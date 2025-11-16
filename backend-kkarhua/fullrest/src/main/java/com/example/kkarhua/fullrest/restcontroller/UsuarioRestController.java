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
import com.example.kkarhua.fullrest.entities.Usuario;
import com.example.kkarhua.fullrest.services.UsuarioServices;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;

@Tag(name = "Usuarios", description = "Operaciones relacionadas con usuarios")
@RestController
@RequestMapping("api/usuarios")
public class UsuarioRestController {

    @Autowired
    private UsuarioServices usuarioServices;

    @Operation(summary = "Obtener lista de usuarios", description = "Devuelve todos los usuarios registrados")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios retornada correctamente",
                 content = @Content(mediaType = "application/json", 
                 schema = @Schema(implementation = Usuario.class)))
    @GetMapping
    public List<Usuario> verUsuarios() {
        return usuarioServices.findByAll();
    }

    @Operation(summary = "Obtener usuario por ID", description = "Obtiene el detalle de un usuario específico")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario encontrado",
                     content = @Content(mediaType = "application/json", schema = @Schema(implementation = Usuario.class))),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> verDetalle(@PathVariable Long id) {
        Optional<Usuario> usuarioOptional = usuarioServices.findById(id);
        if (usuarioOptional.isPresent()) {
            return ResponseEntity.ok(usuarioOptional.orElseThrow());
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Crear un nuevo usuario", description = "Crea un usuario con los datos proporcionados")
    @ApiResponse(responseCode = "201", description = "Usuario creado correctamente",
                 content = @Content(mediaType = "application/json", schema = @Schema(implementation = Usuario.class)))
    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody Usuario unUsuario, BindingResult result) {
        if (result.hasErrors()) {
            return validar(result);
        }
        
        // Validar si el email ya existe
        if (usuarioServices.existsByEmail(unUsuario.getEmail())) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "El email ya está registrado"));
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioServices.save(unUsuario));
    }

    @Operation(summary = "Actualizar usuario", description = "Actualiza un usuario existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario actualizado correctamente",
                     content = @Content(mediaType = "application/json", schema = @Schema(implementation = Usuario.class))),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<?> modificarUsuario(@PathVariable Long id, 
                                             @Valid @RequestBody Usuario unUsuario, 
                                             BindingResult result) {
        if (result.hasErrors()) {
            return validar(result);
        }
        
        Optional<Usuario> usuarioOptional = usuarioServices.findById(id);
        if (usuarioOptional.isPresent()) {
            Usuario usuarioExiste = usuarioOptional.get();
            
            // Validar si el email ya existe (excepto el email actual del usuario)
            if (!usuarioExiste.getEmail().equals(unUsuario.getEmail()) && 
                usuarioServices.existsByEmail(unUsuario.getEmail())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "El email ya está registrado"));
            }
            
            usuarioExiste.setNombre(unUsuario.getNombre());
            usuarioExiste.setEmail(unUsuario.getEmail());
            usuarioExiste.setContrasena(unUsuario.getContrasena());
            usuarioExiste.setRol(unUsuario.getRol());
            usuarioExiste.setEstado(unUsuario.getEstado());
            
            Usuario usuarioModificado = usuarioServices.save(usuarioExiste);
            return ResponseEntity.ok(usuarioModificado);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario por su ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario eliminado correctamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        Usuario unUsuario = new Usuario();
        unUsuario.setId(id);
        Optional<Usuario> usuarioOptional = usuarioServices.delete(unUsuario);
        if (usuarioOptional.isPresent()) {
            return ResponseEntity.ok(usuarioOptional.orElseThrow());
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