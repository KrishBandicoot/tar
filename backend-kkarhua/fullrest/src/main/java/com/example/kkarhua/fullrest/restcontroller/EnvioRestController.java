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

import com.example.kkarhua.fullrest.entities.Envio;
import com.example.kkarhua.fullrest.entities.Usuario;
import com.example.kkarhua.fullrest.services.EnvioServices;
import com.example.kkarhua.fullrest.services.UsuarioServices;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Envíos", description = "Gestión de direcciones de envío")
@RestController
@RequestMapping("api/envios")
public class EnvioRestController {

    @Autowired
    private EnvioServices envioServices;

    @Autowired
    private UsuarioServices usuarioServices;

    @Operation(summary = "Obtener todos los envíos", description = "Devuelve la lista completa de direcciones de envío")
    @GetMapping
    public List<Envio> verEnvios() {
        return envioServices.findByAll();
    }

    @Operation(summary = "Obtener envío por ID", description = "Obtiene el detalle de una dirección de envío específica")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Envío encontrado"),
        @ApiResponse(responseCode = "404", description = "Envío no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> verDetalle(@PathVariable Long id) {
        Optional<Envio> envioOptional = envioServices.findById(id);
        if (envioOptional.isPresent()) {
            return ResponseEntity.ok(envioOptional.orElseThrow());
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Obtener envíos de un usuario", description = "Devuelve todas las direcciones de envío de un usuario específico")
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> verEnviosPorUsuario(@PathVariable Long usuarioId) {
        // Verificar que el usuario existe
        Optional<Usuario> usuarioOptional = usuarioServices.findById(usuarioId);
        if (!usuarioOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        List<Envio> envios = envioServices.findByUsuarioId(usuarioId);
        return ResponseEntity.ok(envios);
    }

    @Operation(summary = "Crear nuevo envío", description = "Crea una dirección de envío asociada a un usuario")
    @ApiResponse(responseCode = "201", description = "Envío creado correctamente")
    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody Map<String, Object> envioData, BindingResult result) {
        if (result.hasErrors()) {
            return validar(result);
        }

        try {
            // Extraer usuarioId
            Long usuarioId = Long.parseLong(envioData.get("usuarioId").toString());

            // Verificar que el usuario existe
            Optional<Usuario> usuarioOptional = usuarioServices.findById(usuarioId);
            if (!usuarioOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Usuario no encontrado con ID: " + usuarioId));
            }

            // Crear el envío
            Envio nuevoEnvio = new Envio();
            nuevoEnvio.setCalle(envioData.get("calle").toString());
            nuevoEnvio.setDepartamento(envioData.containsKey("departamento") ? 
                envioData.get("departamento").toString() : null);
            nuevoEnvio.setRegion(envioData.get("region").toString());
            nuevoEnvio.setComuna(envioData.get("comuna").toString());
            nuevoEnvio.setIndicaciones(envioData.containsKey("indicaciones") ? 
                envioData.get("indicaciones").toString() : null);
            nuevoEnvio.setUsuario(usuarioOptional.get());

            Envio envioGuardado = envioServices.save(nuevoEnvio);
            return ResponseEntity.status(HttpStatus.CREATED).body(envioGuardado);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Error al crear envío: " + e.getMessage()));
        }
    }

    @Operation(summary = "Actualizar envío", description = "Actualiza una dirección de envío existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Envío actualizado correctamente"),
        @ApiResponse(responseCode = "404", description = "Envío no encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<?> modificarEnvio(@PathVariable Long id, 
                                           @Valid @RequestBody Map<String, Object> envioData, 
                                           BindingResult result) {
        if (result.hasErrors()) {
            return validar(result);
        }

        Optional<Envio> envioOptional = envioServices.findById(id);
        if (!envioOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        try {
            Envio envioExiste = envioOptional.get();

            // Actualizar datos
            if (envioData.containsKey("calle")) {
                envioExiste.setCalle(envioData.get("calle").toString());
            }
            if (envioData.containsKey("departamento")) {
                envioExiste.setDepartamento(envioData.get("departamento").toString());
            }
            if (envioData.containsKey("region")) {
                envioExiste.setRegion(envioData.get("region").toString());
            }
            if (envioData.containsKey("comuna")) {
                envioExiste.setComuna(envioData.get("comuna").toString());
            }
            if (envioData.containsKey("indicaciones")) {
                envioExiste.setIndicaciones(envioData.get("indicaciones").toString());
            }

            Envio envioModificado = envioServices.save(envioExiste);
            return ResponseEntity.ok(envioModificado);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Error al actualizar envío: " + e.getMessage()));
        }
    }

    @Operation(summary = "Eliminar envío", description = "Elimina una dirección de envío por su ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Envío eliminado correctamente"),
        @ApiResponse(responseCode = "404", description = "Envío no encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarEnvio(@PathVariable Long id) {
        Envio unEnvio = new Envio();
        unEnvio.setId(id);
        Optional<Envio> envioOptional = envioServices.delete(unEnvio);
        if (envioOptional.isPresent()) {
            return ResponseEntity.ok(envioOptional.orElseThrow());
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