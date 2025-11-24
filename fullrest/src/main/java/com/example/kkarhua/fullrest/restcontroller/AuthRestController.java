package com.example.kkarhua.fullrest.restcontroller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.kkarhua.fullrest.entities.Usuario;
import com.example.kkarhua.fullrest.security.JwtUtil;
import com.example.kkarhua.fullrest.services.UsuarioServices;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@Tag(name = "Autenticación", description = "Endpoints para login y gestión de tokens JWT")
@RestController
@RequestMapping("api/auth")
public class AuthRestController {

    @Autowired
    private UsuarioServices usuarioServices;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Operation(summary = "Login de usuario", description = "Valida credenciales y retorna tokens JWT")
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

        // Validar contraseña (protección contra timing attacks mediante passwordEncoder.matches)
        if (!passwordEncoder.matches(password, usuario.getContrasena())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Credenciales inválidas");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // Generar tokens JWT
        String accessToken = jwtUtil.generateToken(usuario.getEmail(), usuario.getRol(), usuario.getId());
        String refreshToken = jwtUtil.generateRefreshToken(usuario.getEmail());

        // Login exitoso - retornar tokens e información del usuario
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login exitoso");
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);
        response.put("tokenType", "Bearer");
        response.put("expiresIn", 86400); // 24 horas en segundos
        response.put("user", Map.of(
            "id", usuario.getId(),
            "nombre", usuario.getNombre(),
            "email", usuario.getEmail(),
            "rol", usuario.getRol(),
            "estado", usuario.getEstado(),
            "fechaCreacion", usuario.getFechaCreacion()
        ));

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Renovar token de acceso", description = "Genera un nuevo access token usando el refresh token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Token renovado exitosamente"),
        @ApiResponse(responseCode = "401", description = "Refresh token inválido o expirado")
    })
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");

        if (refreshToken == null || refreshToken.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Refresh token es requerido");
            return ResponseEntity.badRequest().body(error);
        }

        try {
            // Validar refresh token
            if (!jwtUtil.validateRefreshToken(refreshToken)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Refresh token inválido o expirado");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }

            // Extraer email del refresh token
            String email = jwtUtil.extractEmail(refreshToken);

            // Buscar usuario
            Optional<Usuario> usuarioOptional = usuarioServices.findByEmail(email);
            if (!usuarioOptional.isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Usuario no encontrado");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }

            Usuario usuario = usuarioOptional.get();

            // Verificar que el usuario siga activo
            if (!"activo".equals(usuario.getEstado())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Usuario inactivo");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
            }

            // Generar nuevo access token
            String newAccessToken = jwtUtil.generateToken(usuario.getEmail(), usuario.getRol(), usuario.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("accessToken", newAccessToken);
            response.put("tokenType", "Bearer");
            response.put("expiresIn", 86400); // 24 horas en segundos

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al renovar token: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @Operation(summary = "Logout de usuario", description = "Invalida el token actual (implementación del lado del cliente)")
    @ApiResponse(responseCode = "200", description = "Logout exitoso")
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        // En JWT stateless, el logout se maneja principalmente del lado del cliente
        // eliminando los tokens del localStorage/sessionStorage
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logout exitoso. Por favor elimine los tokens del almacenamiento local.");
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Validar token", description = "Verifica si un token es válido y no ha expirado")
    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Token no proporcionado");
                return ResponseEntity.badRequest().body(error);
            }

            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);

            if (jwtUtil.validateToken(token, email)) {
                Map<String, Object> response = new HashMap<>();
                response.put("valid", true);
                response.put("email", email);
                response.put("rol", jwtUtil.extractRol(token));
                response.put("userId", jwtUtil.extractUserId(token));
                response.put("remainingTime", jwtUtil.getTokenRemainingTime(token));
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Token inválido o expirado");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Token inválido: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
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