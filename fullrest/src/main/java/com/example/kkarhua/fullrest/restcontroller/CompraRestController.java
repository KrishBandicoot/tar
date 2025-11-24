package com.example.kkarhua.fullrest.restcontroller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.kkarhua.fullrest.entities.Compra;
import com.example.kkarhua.fullrest.services.CompraServices;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Compras", description = "Gestión de compras y boletas")
@RestController
@RequestMapping("api/compras")
public class CompraRestController {

    @Autowired
    private CompraServices compraServices;

    @Operation(summary = "Obtener todas las compras")
    @GetMapping
    public ResponseEntity<List<Compra>> verCompras() {
        return ResponseEntity.ok(compraServices.findByAll());
    }

    @Operation(summary = "Obtener compra por ID")
    @GetMapping("/{id}")
    public ResponseEntity<?> verDetalle(@PathVariable Long id) {
        Optional<Compra> compraOptional = compraServices.findById(id);
        if (compraOptional.isPresent()) {
            return ResponseEntity.ok(compraOptional.get());
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Obtener compras de un usuario")
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> verComprasPorUsuario(@PathVariable Long usuarioId) {
        List<Compra> compras = compraServices.findByUsuarioId(usuarioId);
        return ResponseEntity.ok(compras);
    }

    @Operation(summary = "Crear nueva compra (generar boleta)")
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Compra unaCompra) {
        try {
            if (unaCompra.getUsuario() == null || unaCompra.getEnvio() == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Usuario y Envío son obligatorios"));
            }

            Compra compraGuardada = compraServices.save(unaCompra);
            return ResponseEntity.status(HttpStatus.CREATED).body(compraGuardada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error al crear compra: " + e.getMessage()));
        }
    }

    @Operation(summary = "Obtener estadísticas de compras")
    @GetMapping("/stats/totales")
    public ResponseEntity<?> getStats() {
        long totalCompras = compraServices.countCompletadas();
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCompras", totalCompras);
        stats.put("fecha", java.time.LocalDateTime.now());
        return ResponseEntity.ok(stats);
    }
}