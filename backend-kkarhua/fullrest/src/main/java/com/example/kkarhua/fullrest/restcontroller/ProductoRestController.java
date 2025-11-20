package com.example.kkarhua.fullrest.restcontroller;

import java.util.List;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.kkarhua.fullrest.entities.Producto;
import com.example.kkarhua.fullrest.entities.Categoria;
import com.example.kkarhua.fullrest.services.ProductoServices;
import com.example.kkarhua.fullrest.services.CategoriaServices;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

@Tag(name = "Productos", description = "Operaciones relacionadas con productos")
@RestController
@RequestMapping("api/productos")
public class ProductoRestController {

    @Autowired
    private ProductoServices productoServices;

    @Autowired
    private CategoriaServices categoriaServices;

    @Operation(summary = "Obtener lista de productos", description = "Devuelve todos los productos disponibles")
    @ApiResponse(responseCode = "200", description = "Lista de productos retornada correctamente",
                 content = @Content(mediaType = "application/json", 
                 schema = @Schema(implementation = Producto.class)))
    @GetMapping
    public List<Producto> verProductos(){
        return (List<Producto>) productoServices.findByAll();
    }

    @Operation(summary = "Obtener producto por ID", description = "Obtiene el detalle de un producto específico")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Producto encontrado",
                     content = @Content(mediaType = "application/json", schema = @Schema(implementation = Producto.class))),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> verDetalle(@PathVariable Long id){
        Optional<Producto> productoOptional = productoServices.findById(id);
        if (productoOptional.isPresent()){
            return ResponseEntity.ok(productoOptional.orElseThrow());
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Crear un nuevo producto", description = "Crea un producto con los datos proporcionados")
    @ApiResponse(responseCode = "201", description = "Producto creado correctamente",
                 content = @Content(mediaType = "application/json", schema = @Schema(implementation = Producto.class)))
    @PostMapping
    public ResponseEntity<Producto> crear(@RequestBody Producto unProducto){
        return ResponseEntity.status(HttpStatus.CREATED).body(productoServices.save(unProducto));
    }

    @Operation(summary = "Actualizar producto", description = "Actualiza un producto existente - NO actualiza stock ni estado")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Producto actualizado correctamente",
                     content = @Content(mediaType = "application/json", schema = @Schema(implementation = Producto.class))),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PutMapping("/{id}")
    public ResponseEntity<?> modificarProducto(@PathVariable Long id, @RequestBody Map<String, Object> productoData){
        try {
            Optional<Producto> productoOptional = productoServices.findById(id);
            
            if (!productoOptional.isPresent()){
                Map<String, String> error = new HashMap<>();
                error.put("error", "Producto no encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            Producto productoExiste = productoOptional.get();
            
            // Actualizar nombre
            if (productoData.containsKey("nombre") && productoData.get("nombre") != null) {
                productoExiste.setNombre(productoData.get("nombre").toString());
            }
            
            // Actualizar descripción
            if (productoData.containsKey("descripcion") && productoData.get("descripcion") != null) {
                productoExiste.setDescripcion(productoData.get("descripcion").toString());
            }
            
            // Actualizar precio
            if (productoData.containsKey("precio") && productoData.get("precio") != null) {
                Object precioObj = productoData.get("precio");
                int precio = (precioObj instanceof Number) ? ((Number) precioObj).intValue() : Integer.parseInt(precioObj.toString());
                productoExiste.setPrecio(precio);
            }
            
            // Actualizar imagen
            if (productoData.containsKey("imagen") && productoData.get("imagen") != null) {
                productoExiste.setImagen(productoData.get("imagen").toString());
            }
            
            // Actualizar categoría - IMPORTANTE: Manejar correctamente
            if (productoData.containsKey("categoria") && productoData.get("categoria") != null) {
                Object categoriaObj = productoData.get("categoria");
                
                Long categoriaId = null;
                
                // Si viene como objeto con id
                if (categoriaObj instanceof Map) {
                    Map<String, Object> categoriaMap = (Map<String, Object>) categoriaObj;
                    if (categoriaMap.containsKey("id")) {
                        Object idObj = categoriaMap.get("id");
                        categoriaId = (idObj instanceof Number) ? ((Number) idObj).longValue() : Long.parseLong(idObj.toString());
                    }
                } 
                // Si viene como número directo
                else if (categoriaObj instanceof Number) {
                    categoriaId = ((Number) categoriaObj).longValue();
                } 
                // Si viene como string
                else {
                    try {
                        categoriaId = Long.parseLong(categoriaObj.toString());
                    } catch (NumberFormatException e) {
                        Map<String, String> error = new HashMap<>();
                        error.put("error", "ID de categoría inválido: " + categoriaObj.toString());
                        return ResponseEntity.badRequest().body(error);
                    }
                }
                
                if (categoriaId != null) {
                    Optional<Categoria> categoriaOptional = categoriaServices.findById(categoriaId);
                    
                    if (!categoriaOptional.isPresent()) {
                        Map<String, String> error = new HashMap<>();
                        error.put("error", "Categoría no encontrada con ID: " + categoriaId);
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
                    }
                    
                    productoExiste.setCategoria(categoriaOptional.get());
                }
            }
            
            Producto productoModificado = productoServices.save(productoExiste);
            return ResponseEntity.ok(productoModificado);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al actualizar producto: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Eliminar producto", description = "Elimina un producto por su ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Producto eliminado correctamente"),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarProducto(@PathVariable Long id){
        Producto unProducto = new Producto();
        unProducto.setId(id);
        Optional<Producto> productoOptional = productoServices.delete(unProducto);
        if (productoOptional.isPresent()){
            return ResponseEntity.ok(productoOptional.orElseThrow());
        }
        return ResponseEntity.notFound().build();
    }
}