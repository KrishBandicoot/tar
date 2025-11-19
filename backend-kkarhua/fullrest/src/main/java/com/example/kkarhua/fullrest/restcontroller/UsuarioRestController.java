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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.kkarhua.fullrest.entities.Usuario;
import com.example.kkarhua.fullrest.security.JwtUtil;
import com.example.kkarhua.fullrest.services.UsuarioServices;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;

@Tag(name = "Usuarios", description = "Operaciones relacionadas con usuarios (CRUD completo)")
@RestController
@RequestMapping("api/usuarios")
public class UsuarioRestController {

    @Autowired
    private UsuarioServices usuarioServices;

    @Autowired
    private JwtUtil jwtUtil;

    @Operation(summary = "Obtener lista de usuarios", description = "Devuelve todos los usuarios registrados (Solo SUPER-ADMIN)")
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

    @Operation(
        summary = "Crear nuevo usuario / Registro", 
        description = "Crea un nuevo usuario y opcionalmente retorna tokens JWT para auto-login. " +
                     "Si se envía el parámetro ?autoLogin=true, retorna tokens JWT para iniciar sesión automáticamente."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Usuario creado correctamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos o email ya existe")
    })
    @PostMapping
    public ResponseEntity<?> crear(
            @Valid @RequestBody Usuario unUsuario, 
            BindingResult result,
            @RequestParam(required = false, defaultValue = "false") boolean autoLogin) {
        
        System.out.println("📝 UsuarioRestController.crear() - Iniciando registro");
        System.out.println("📧 Email: " + unUsuario.getEmail());
        System.out.println("👤 Nombre: " + unUsuario.getNombre());
        System.out.println("🔐 AutoLogin: " + autoLogin);
        
        // Validar errores de BindingResult
        if (result.hasErrors()) {
            System.out.println("❌ Errores de validación detectados");
            return validar(result);
        }
        
        // Validar si el email ya existe
        if (usuarioServices.existsByEmail(unUsuario.getEmail())) {
            System.out.println("❌ Email ya está registrado: " + unUsuario.getEmail());
            return ResponseEntity.badRequest()
                .body(Map.of("error", "El email ya está registrado"));
        }
        
        try {
            // Guardar usuario (contraseña se encripta automáticamente)
            System.out.println("💾 Guardando usuario en la base de datos");
            Usuario usuarioGuardado = usuarioServices.save(unUsuario);
            System.out.println("✅ Usuario guardado con ID: " + usuarioGuardado.getId());
            
            // Si autoLogin es true, generar tokens JWT
            if (autoLogin) {
                System.out.println("🔑 Generando tokens JWT para auto-login");
                String accessToken = jwtUtil.generateToken(
                    usuarioGuardado.getEmail(), 
                    usuarioGuardado.getRol(), 
                    usuarioGuardado.getId()
                );
                String refreshToken = jwtUtil.generateRefreshToken(usuarioGuardado.getEmail());
                
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Usuario registrado exitosamente");
                response.put("accessToken", accessToken);
                response.put("refreshToken", refreshToken);
                response.put("tokenType", "Bearer");
                response.put("expiresIn", 86400);
                response.put("user", Map.of(
                    "id", usuarioGuardado.getId(),
                    "nombre", usuarioGuardado.getNombre(),
                    "email", usuarioGuardado.getEmail(),
                    "rol", usuarioGuardado.getRol(),
                    "estado", usuarioGuardado.getEstado()
                ));
                
                System.out.println("✅ Tokens generados exitosamente");
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            }
            
            // Si no autoLogin, solo retornar el usuario creado
            System.out.println("✅ Usuario creado sin auto-login");
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioGuardado);
            
        } catch (Exception e) {
            System.out.println("❌ Error al crear usuario: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al crear usuario: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
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
        System.out.println("❌ Errores de validación: " + errores);
        return ResponseEntity.badRequest().body(errores);
    }
}