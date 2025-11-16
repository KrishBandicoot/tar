package com.example.kkarhua.fullrest.restcontroller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.kkarhua.fullrest.entities.Producto;
import com.example.kkarhua.fullrest.services.ProductoServices;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@Tag(name = "Stock", description = "Gestión de inventario y stock de productos")
@RestController
@RequestMapping("api/stock")
public class StockController {

    @Autowired
    private ProductoServices productoServices;

    @Operation(summary = "Consultar stock", description = "Obtiene el stock actual de un producto")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Stock consultado correctamente"),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    })
    @GetMapping("/{productoId}")
    public ResponseEntity<?> consultarStock(@PathVariable Long productoId) {
        Optional<Producto> productoOptional = productoServices.findById(productoId);
        if (!productoOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Producto producto = productoOptional.get();
        Map<String, Object> response = new HashMap<>();
        response.put("productoId", producto.getId());
        response.put("nombre", producto.getNombre());
        response.put("stock", producto.getStock());
        response.put("estado", producto.getStock() > 0 ? "disponible" : "agotado");

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Actualizar stock", description = "Actualiza el stock de un producto (establecer cantidad)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Stock actualizado correctamente"),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado"),
        @ApiResponse(responseCode = "400", description = "Stock inválido")
    })
    @PatchMapping("/{productoId}/actualizar")
    public ResponseEntity<?> actualizarStock(@PathVariable Long productoId, 
                                            @RequestBody Map<String, Integer> request) {
        Optional<Producto> productoOptional = productoServices.findById(productoId);
        if (!productoOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Integer nuevoStock = request.get("stock");
        if (nuevoStock == null || nuevoStock < 0) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "El stock debe ser un número mayor o igual a 0");
            return ResponseEntity.badRequest().body(error);
        }

        Producto producto = productoOptional.get();
        int stockAnterior = producto.getStock();
        producto.setStock(nuevoStock);
        
        // Cambiar estado si se agota
        if (nuevoStock == 0) {
            producto.setEstado("agotado");
        } else if (stockAnterior == 0 && nuevoStock > 0) {
            producto.setEstado("activo");
        }

        productoServices.save(producto);

        Map<String, Object> response = new HashMap<>();
        response.put("productoId", producto.getId());
        response.put("nombre", producto.getNombre());
        response.put("stockAnterior", stockAnterior);
        response.put("stockActual", producto.getStock());
        response.put("estado", producto.getEstado());

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Agregar stock", description = "Incrementa el stock de un producto")
    @ApiResponse(responseCode = "200", description = "Stock incrementado correctamente")
    @PatchMapping("/{productoId}/agregar")
    public ResponseEntity<?> agregarStock(@PathVariable Long productoId, 
                                         @RequestBody Map<String, Integer> request) {
        Optional<Producto> productoOptional = productoServices.findById(productoId);
        if (!productoOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Integer cantidad = request.get("cantidad");
        if (cantidad == null || cantidad <= 0) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "La cantidad debe ser un número mayor a 0");
            return ResponseEntity.badRequest().body(error);
        }

        Producto producto = productoOptional.get();
        int stockAnterior = producto.getStock();
        producto.setStock(stockAnterior + cantidad);
        
        if (stockAnterior == 0 && producto.getStock() > 0) {
            producto.setEstado("activo");
        }

        productoServices.save(producto);

        Map<String, Object> response = new HashMap<>();
        response.put("productoId", producto.getId());
        response.put("nombre", producto.getNombre());
        response.put("stockAnterior", stockAnterior);
        response.put("cantidadAgregada", cantidad);
        response.put("stockActual", producto.getStock());
        response.put("estado", producto.getEstado());

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Reducir stock", description = "Disminuye el stock de un producto")
    @ApiResponse(responseCode = "200", description = "Stock reducido correctamente")
    @PatchMapping("/{productoId}/reducir")
    public ResponseEntity<?> reducirStock(@PathVariable Long productoId, 
                                         @RequestBody Map<String, Integer> request) {
        Optional<Producto> productoOptional = productoServices.findById(productoId);
        if (!productoOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Integer cantidad = request.get("cantidad");
        if (cantidad == null || cantidad <= 0) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "La cantidad debe ser un número mayor a 0");
            return ResponseEntity.badRequest().body(error);
        }

        Producto producto = productoOptional.get();
        int stockAnterior = producto.getStock();

        if (stockAnterior < cantidad) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Stock insuficiente. Stock actual: " + stockAnterior);
            return ResponseEntity.badRequest().body(error);
        }

        producto.setStock(stockAnterior - cantidad);
        
        if (producto.getStock() == 0) {
            producto.setEstado("agotado");
        }

        productoServices.save(producto);

        Map<String, Object> response = new HashMap<>();
        response.put("productoId", producto.getId());
        response.put("nombre", producto.getNombre());
        response.put("stockAnterior", stockAnterior);
        response.put("cantidadReducida", cantidad);
        response.put("stockActual", producto.getStock());
        response.put("estado", producto.getEstado());

        return ResponseEntity.ok(response);
    }
}