package com.example.kkarhua.fullrest.restcontroller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.kkarhua.fullrest.entities.Usuario;
import com.example.kkarhua.fullrest.services.UsuarioServices;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@Tag(name = "Autenticación", description = "Endpoints para login y autenticación")
@RestController
@RequestMapping("api/auth")
public class AuthRestController {

    @Autowired
    private UsuarioServices usuarioServices;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Operation(summary = "Login de usuario", description = "Valida credenciales y retorna información del usuario autenticado")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login exitoso"),
        @ApiResponse(responseCode = "401", description = "Credenciales inválidas"),
        @ApiResponse(responseCode = "403", description = "Usuario inactivo")
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Email y contraseña son requeridos");
            return ResponseEntity.badRequest().body(error);
        }

        Optional<Usuario> usuarioOptional = usuarioServices.findByEmail(email);
        
        if (!usuarioOptional.isPresent()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Credenciales inválidas");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        Usuario usuario = usuarioOptional.get();

        // Verificar si el usuario está activo
        if (!"activo".equals(usuario.getEstado())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Usuario inactivo");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        // Validar contraseña
        if (!passwordEncoder.matches(password, usuario.getContrasena())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Credenciales inválidas");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // Login exitoso - retornar información del usuario (sin contraseña)
        Map<String, Object> response = new HashMap<>();
        response.put("id", usuario.getId());
        response.put("nombre", usuario.getNombre());
        response.put("email", usuario.getEmail());
        response.put("rol", usuario.getRol());
        response.put("estado", usuario.getEstado());
        response.put("fechaCreacion", usuario.getFechaCreacion());
        response.put("message", "Login exitoso");

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Validar rol de administrador", description = "Verifica si un usuario tiene rol de super-admin")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Validación exitosa"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @PostMapping("/validate-admin")
    public ResponseEntity<?> validateAdmin(@RequestBody Map<String, Long> request) {
        Long userId = request.get("userId");
        
        if (userId == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "userId es requerido");
            return ResponseEntity.badRequest().body(error);
        }

        Optional<Usuario> usuarioOptional = usuarioServices.findById(userId);
        
        if (!usuarioOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Usuario usuario = usuarioOptional.get();
        boolean isAdmin = "super-admin".equals(usuario.getRol());

        Map<String, Object> response = new HashMap<>();
        response.put("userId", userId);
        response.put("isAdmin", isAdmin);
        response.put("rol", usuario.getRol());

        return ResponseEntity.ok(response);
    }
}