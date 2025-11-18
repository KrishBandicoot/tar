package com.example.kkarhua.fullrest.restcontroller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.kkarhua.fullrest.entities.Categoria;
import com.example.kkarhua.fullrest.services.CategoriaServices;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Categorías", description = "Gestión de categorías de productos")
@RestController
@RequestMapping("api/categorias")
public class CategoriaRestController {

    @Autowired
    private CategoriaServices categoriaServices;

    @Operation(summary = "Obtener todas las categorías", description = "Devuelve la lista completa de categorías disponibles")
    @GetMapping
    public List<Categoria> verCategorias() {
        return categoriaServices.findByAll();
    }

    @Operation(summary = "Obtener categoría por ID", description = "Obtiene el detalle de una categoría específica")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Categoría encontrada"),
        @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> verDetalle(@PathVariable Long id) {
        Optional<Categoria> categoriaOptional = categoriaServices.findById(id);
        if (categoriaOptional.isPresent()) {
            return ResponseEntity.ok(categoriaOptional.orElseThrow());
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Crear nueva categoría", description = "Crea una categoría con los datos proporcionados")
    @ApiResponse(responseCode = "201", description = "Categoría creada correctamente")
    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody Categoria unaCategoria, BindingResult result) {
        if (result.hasErrors()) {
            return validar(result);
        }
        
        // Validar si el nombre ya existe
        if (categoriaServices.existsByNombre(unaCategoria.getNombre())) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Ya existe una categoría con ese nombre"));
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaServices.save(unaCategoria));
    }

    @Operation(summary = "Actualizar categoría", description = "Actualiza una categoría existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Categoría actualizada correctamente"),
        @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    })
    @PutMapping("/{id}")
    public ResponseEntity<?> modificarCategoria(@PathVariable Long id, 
                                               @Valid @RequestBody Categoria unaCategoria, 
                                               BindingResult result) {
        if (result.hasErrors()) {
            return validar(result);
        }
        
        Optional<Categoria> categoriaOptional = categoriaServices.findById(id);
        if (categoriaOptional.isPresent()) {
            Categoria categoriaExiste = categoriaOptional.get();
            
            // Validar si el nombre ya existe (excepto el nombre actual)
            if (!categoriaExiste.getNombre().equals(unaCategoria.getNombre()) && 
                categoriaServices.existsByNombre(unaCategoria.getNombre())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Ya existe una categoría con ese nombre"));
            }
            
            categoriaExiste.setNombre(unaCategoria.getNombre());
            
            Categoria categoriaModificada = categoriaServices.save(categoriaExiste);
            return ResponseEntity.ok(categoriaModificada);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Eliminar categoría", description = "Elimina una categoría por su ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Categoría eliminada correctamente"),
        @ApiResponse(responseCode = "404", description = "Categoría no encontrada"),
        @ApiResponse(responseCode = "409", description = "No se puede eliminar, tiene productos asociados")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCategoria(@PathVariable Long id) {
        Optional<Categoria> categoriaOptional = categoriaServices.findById(id);
        
        if (!categoriaOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        // Verificar si tiene productos asociados
        if (categoriaServices.tieneProductosAsociados(id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "No se puede eliminar la categoría porque tiene productos asociados"));
        }
        
        Categoria unaCategoria = new Categoria();
        unaCategoria.setId(id);
        Optional<Categoria> resultado = categoriaServices.delete(unaCategoria);
        
        if (resultado.isPresent()) {
            return ResponseEntity.ok(resultado.orElseThrow());
        }
        return ResponseEntity.notFound().build();
    }

    private ResponseEntity<?> validar(BindingResult result) {
        Map<String, String> errores = new HashMap<>();
        result.getFieldErrors().forEach(err -> {
            errores.put(err.getField(), "El campo " + err.getField() + " " + err.getDefaultMessage());
        });
        return ResponseEntity.badRequest().body(errores);
    }
}