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

@Tag(name = "Envíos", description = "Gestión de direcciones de envío de productos")
@RestController
@RequestMapping("api/envios")
public class EnvioRestController {

    @Autowired
    private EnvioServices envioServices;

    @Autowired
    private UsuarioServices usuarioServices;

    @Operation(summary = "Obtener todos los envíos", description = "Devuelve la lista completa de direcciones de envío registradas")
    @ApiResponse(responseCode = "200", description = "Lista de envíos retornada correctamente")
    @GetMapping
    public ResponseEntity<List<Envio>> verEnvios() {
        List<Envio> envios = envioServices.findByAll();
        return ResponseEntity.ok(envios);
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
            return ResponseEntity.ok(envioOptional.get());
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Obtener envíos de un usuario", description = "Devuelve todas las direcciones de envío asociadas a un usuario específico")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Envíos encontrados"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> verEnviosPorUsuario(@PathVariable Long usuarioId) {
        Optional<Usuario> usuarioOptional = usuarioServices.findById(usuarioId);
        if (!usuarioOptional.isPresent()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Usuario no encontrado con ID: " + usuarioId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        List<Envio> envios = envioServices.findByUsuarioId(usuarioId);
        return ResponseEntity.ok(envios);
    }

    @Operation(summary = "Crear nuevo envío", description = "Crea una dirección de envío asociada a un usuario. Campos obligatorios: calle, region, comuna, usuarioId. Campos opcionales: departamento, indicaciones")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Envío creado correctamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos o falta campos obligatorios"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody Map<String, Object> envioData, BindingResult result) {
        // Validar errores de BindingResult
        if (result.hasErrors()) {
            return validar(result);
        }

        try {
            // Validar campos obligatorios
            if (!envioData.containsKey("calle") || envioData.get("calle") == null || 
                envioData.get("calle").toString().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "El campo 'calle' es obligatorio"));
            }

            if (!envioData.containsKey("region") || envioData.get("region") == null || 
                envioData.get("region").toString().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "El campo 'region' es obligatorio"));
            }

            if (!envioData.containsKey("comuna") || envioData.get("comuna") == null || 
                envioData.get("comuna").toString().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "El campo 'comuna' es obligatorio"));
            }

            if (!envioData.containsKey("usuarioId") || envioData.get("usuarioId") == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "El campo 'usuarioId' es obligatorio"));
            }

            // Extraer y validar usuarioId
            Long usuarioId;
            try {
                Object usuarioIdObj = envioData.get("usuarioId");
                usuarioId = (usuarioIdObj instanceof Number) ? 
                    ((Number) usuarioIdObj).longValue() : 
                    Long.parseLong(usuarioIdObj.toString());
            } catch (Exception e) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "El campo 'usuarioId' debe ser un número válido"));
            }

            // Verificar que el usuario existe
            Optional<Usuario> usuarioOptional = usuarioServices.findById(usuarioId);
            if (!usuarioOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Usuario no encontrado con ID: " + usuarioId));
            }

            // Crear el envío con datos validados
            Envio nuevoEnvio = new Envio();
            nuevoEnvio.setCalle(envioData.get("calle").toString());
            nuevoEnvio.setRegion(envioData.get("region").toString());
            nuevoEnvio.setComuna(envioData.get("comuna").toString());
            
            // Campos opcionales
            if (envioData.containsKey("departamento") && envioData.get("departamento") != null) {
                String departamento = envioData.get("departamento").toString().trim();
                if (!departamento.isEmpty()) {
                    nuevoEnvio.setDepartamento(departamento);
                }
            }

            if (envioData.containsKey("indicaciones") && envioData.get("indicaciones") != null) {
                String indicaciones = envioData.get("indicaciones").toString().trim();
                if (!indicaciones.isEmpty()) {
                    nuevoEnvio.setIndicaciones(indicaciones);
                }
            }

            // Asignar usuario
            nuevoEnvio.setUsuario(usuarioOptional.get());

            // Guardar envío
            Envio envioGuardado = envioServices.save(nuevoEnvio);
            return ResponseEntity.status(HttpStatus.CREATED).body(envioGuardado);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error al crear envío: " + e.getMessage()));
        }
    }

    @Operation(summary = "Actualizar envío", description = "Actualiza una dirección de envío existente. Solo actualiza los campos que se envíen.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Envío actualizado correctamente"),
        @ApiResponse(responseCode = "404", description = "Envío no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
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
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Envío no encontrado con ID: " + id));
        }

        try {
            Envio envioExiste = envioOptional.get();

            // Actualizar solo los campos que vienen en la petición
            if (envioData.containsKey("calle") && envioData.get("calle") != null) {
                String calle = envioData.get("calle").toString().trim();
                if (!calle.isEmpty()) {
                    envioExiste.setCalle(calle);
                }
            }

            if (envioData.containsKey("departamento") && envioData.get("departamento") != null) {
                String departamento = envioData.get("departamento").toString().trim();
                envioExiste.setDepartamento(departamento.isEmpty() ? null : departamento);
            }

            if (envioData.containsKey("region") && envioData.get("region") != null) {
                String region = envioData.get("region").toString().trim();
                if (!region.isEmpty()) {
                    envioExiste.setRegion(region);
                }
            }

            if (envioData.containsKey("comuna") && envioData.get("comuna") != null) {
                String comuna = envioData.get("comuna").toString().trim();
                if (!comuna.isEmpty()) {
                    envioExiste.setComuna(comuna);
                }
            }

            if (envioData.containsKey("indicaciones") && envioData.get("indicaciones") != null) {
                String indicaciones = envioData.get("indicaciones").toString().trim();
                envioExiste.setIndicaciones(indicaciones.isEmpty() ? null : indicaciones);
            }

            // Guardar cambios
            Envio envioModificado = envioServices.save(envioExiste);
            return ResponseEntity.ok(envioModificado);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
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
        Optional<Envio> envioOptional = envioServices.findById(id);
        
        if (!envioOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Envío no encontrado con ID: " + id));
        }

        Envio unEnvio = new Envio();
        unEnvio.setId(id);
        envioServices.delete(unEnvio);
        
        return ResponseEntity.ok(Map.of("message", "Envío eliminado correctamente", "envioId", id));
    }

    private ResponseEntity<?> validar(BindingResult result) {
        Map<String, String> errores = new HashMap<>();
        result.getFieldErrors().forEach(err -> {
            errores.put(err.getField(), "El campo " + err.getField() + " " + err.getDefaultMessage());
        });
        return ResponseEntity.badRequest().body(errores);
    }
}