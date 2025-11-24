package com.example.kkarhua.fullrest;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Date;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.test.util.ReflectionTestUtils;

import com.example.kkarhua.fullrest.security.JwtUtil;

@DisplayName("Tests para JwtUtil")
class JwtUtilTest {

    private JwtUtil jwtUtil;
    private String secret = "mi-secreto-super-seguro-que-debe-tener-al-menos-256-bits-para-HS256-algoritmo-jwt-2024";
    private Long expiration = 86400000L; // 24 horas
    private Long refreshExpiration = 604800000L; // 7 días

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", secret);
        ReflectionTestUtils.setField(jwtUtil, "expiration", expiration);
        ReflectionTestUtils.setField(jwtUtil, "refreshExpiration", refreshExpiration);
    }

    @Test
    @DisplayName("generateToken - Debe generar token válido con claims")
    void testGenerateToken_DebeGenerarTokenValido() {
        // Given
        String email = "test@email.com";
        String rol = "cliente";
        Long userId = 1L;

        // When
        String token = jwtUtil.generateToken(email, rol, userId);

        // Then
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.split("\\.").length == 3); // JWT tiene 3 partes
    }

    @Test
    @DisplayName("extractEmail - Debe extraer email del token")
    void testExtractEmail_DebeExtraerEmailDelToken() {
        // Given
        String email = "test@email.com";
        String token = jwtUtil.generateToken(email, "cliente", 1L);

        // When
        String emailExtraido = jwtUtil.extractEmail(token);

        // Then
        assertNotNull(emailExtraido);
        assertEquals(email, emailExtraido);
    }

    @Test
    @DisplayName("extractRol - Debe extraer rol del token")
    void testExtractRol_DebeExtraerRolDelToken() {
        // Given
        String rol = "vendedor";
        String token = jwtUtil.generateToken("test@email.com", rol, 1L);

        // When
        String rolExtraido = jwtUtil.extractRol(token);

        // Then
        assertNotNull(rolExtraido);
        assertEquals(rol, rolExtraido);
    }

    @Test
    @DisplayName("extractUserId - Debe extraer userId del token")
    void testExtractUserId_DebeExtraerUserIdDelToken() {
        // Given
        Long userId = 123L;
        String token = jwtUtil.generateToken("test@email.com", "cliente", userId);

        // When
        Long userIdExtraido = jwtUtil.extractUserId(token);

        // Then
        assertNotNull(userIdExtraido);
        assertEquals(userId, userIdExtraido);
    }

    @Test
    @DisplayName("validateToken - Debe validar token correcto")
    void testValidateToken_DebeValidarTokenCorrecto() {
        // Given
        String email = "test@email.com";
        String token = jwtUtil.generateToken(email, "cliente", 1L);

        // When
        Boolean isValid = jwtUtil.validateToken(token, email);

        // Then
        assertTrue(isValid);
    }

    @Test
    @DisplayName("validateToken - Debe rechazar token con email incorrecto")
    void testValidateToken_DebeRechazarTokenConEmailIncorrecto() {
        // Given
        String email = "test@email.com";
        String otroEmail = "otro@email.com";
        String token = jwtUtil.generateToken(email, "cliente", 1L);

        // When
        Boolean isValid = jwtUtil.validateToken(token, otroEmail);

        // Then
        assertFalse(isValid);
    }

    @Test
    @DisplayName("isTokenExpired - Token recién creado no debe estar expirado")
    void testIsTokenExpired_TokenNuevoNoDebeEstarExpirado() {
        // Given
        String token = jwtUtil.generateToken("test@email.com", "cliente", 1L);

        // When
        Boolean isExpired = jwtUtil.isTokenExpired(token);

        // Then
        assertFalse(isExpired);
    }

    @Test
    @DisplayName("generateRefreshToken - Debe generar refresh token válido")
    void testGenerateRefreshToken_DebeGenerarRefreshTokenValido() {
        // Given
        String email = "test@email.com";

        // When
        String refreshToken = jwtUtil.generateRefreshToken(email);

        // Then
        assertNotNull(refreshToken);
        assertFalse(refreshToken.isEmpty());
        assertTrue(refreshToken.split("\\.").length == 3);
    }

    @Test
    @DisplayName("validateRefreshToken - Debe validar refresh token correcto")
    void testValidateRefreshToken_DebeValidarRefreshTokenCorrecto() {
        // Given
        String email = "test@email.com";
        String refreshToken = jwtUtil.generateRefreshToken(email);

        // When
        Boolean isValid = jwtUtil.validateRefreshToken(refreshToken);

        // Then
        assertTrue(isValid);
    }

    @Test
    @DisplayName("validateRefreshToken - Debe rechazar token normal como refresh token")
    void testValidateRefreshToken_DebeRechazarTokenNormal() {
        // Given
        String normalToken = jwtUtil.generateToken("test@email.com", "cliente", 1L);

        // When
        Boolean isValid = jwtUtil.validateRefreshToken(normalToken);

        // Then
        assertFalse(isValid);
    }

    @Test
    @DisplayName("extractExpiration - Debe extraer fecha de expiración")
    void testExtractExpiration_DebeExtraerFechaExpiracion() {
        // Given
        String token = jwtUtil.generateToken("test@email.com", "cliente", 1L);

        // When
        Date expiration = jwtUtil.extractExpiration(token);

        // Then
        assertNotNull(expiration);
        assertTrue(expiration.after(new Date()));
    }

    @Test
    @DisplayName("getTokenRemainingTime - Debe retornar tiempo restante positivo")
    void testGetTokenRemainingTime_DebeRetornarTiempoRestante() {
        // Given
        String token = jwtUtil.generateToken("test@email.com", "cliente", 1L);

        // When
        Long remainingTime = jwtUtil.getTokenRemainingTime(token);

        // Then
        assertNotNull(remainingTime);
        assertTrue(remainingTime > 0);
        assertTrue(remainingTime <= expiration);
    }

    @Test
    @DisplayName("generateToken - Debe generar tokens diferentes para diferentes usuarios")
    void testGenerateToken_DebeGenerarTokensDiferentes() {
        // Given
        String token1 = jwtUtil.generateToken("user1@email.com", "cliente", 1L);
        String token2 = jwtUtil.generateToken("user2@email.com", "cliente", 2L);

        // Then
        assertNotNull(token1);
        assertNotNull(token2);
        assertNotEquals(token1, token2);
    }

    @Test
    @DisplayName("generateToken - Debe generar tokens con diferentes roles")
    void testGenerateToken_DebeGenerarTokensConDiferentesRoles() {
        // Given
        String email = "test@email.com";
        String tokenCliente = jwtUtil.generateToken(email, "cliente", 1L);
        String tokenVendedor = jwtUtil.generateToken(email, "vendedor", 1L);
        String tokenAdmin = jwtUtil.generateToken(email, "super-admin", 1L);

        // When
        String rolCliente = jwtUtil.extractRol(tokenCliente);
        String rolVendedor = jwtUtil.extractRol(tokenVendedor);
        String rolAdmin = jwtUtil.extractRol(tokenAdmin);

        // Then
        assertEquals("cliente", rolCliente);
        assertEquals("vendedor", rolVendedor);
        assertEquals("super-admin", rolAdmin);
    }

    @Test
    @DisplayName("extractEmail - Debe extraer email correctamente de refresh token")
    void testExtractEmail_DebeExtraerEmailDeRefreshToken() {
        // Given
        String email = "test@email.com";
        String refreshToken = jwtUtil.generateRefreshToken(email);

        // When
        String emailExtraido = jwtUtil.extractEmail(refreshToken);

        // Then
        assertNotNull(emailExtraido);
        assertEquals(email, emailExtraido);
    }

    @Test
    @DisplayName("validateToken - Debe funcionar con diferentes longitudes de email")
    void testValidateToken_DebeFuncionarConDiferentesEmails() {
        // Given
        String[] emails = {
            "a@b.c",
            "test@email.com",
            "usuario.muy.largo.con.puntos@dominio.empresa.com"
        };

        for (String email : emails) {
            String token = jwtUtil.generateToken(email, "cliente", 1L);
            
            // When
            Boolean isValid = jwtUtil.validateToken(token, email);
            
            // Then
            assertTrue(isValid, "Token debe ser válido para email: " + email);
        }
    }

    @Test
    @DisplayName("validateToken - Debe lanzar excepción con token malformado")
    void testValidateToken_DebeLanzarExcepcionConTokenMalformado() {
        // Given
        String tokenMalformado = "token.invalido.malformado";
        String email = "test@email.com";

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            jwtUtil.validateToken(tokenMalformado, email);
        });
    }

    @Test
    @DisplayName("generateToken - Token debe contener timestamp actual")
    void testGenerateToken_DebeContenerTimestampActual() {
        // Given
        long timestampAntes = System.currentTimeMillis();
        String token = jwtUtil.generateToken("test@email.com", "cliente", 1L);
        long timestampDespues = System.currentTimeMillis();

        // When
        Date expiration = jwtUtil.extractExpiration(token);
        long expirationTimestamp = expiration.getTime();

        // Then
        assertTrue(expirationTimestamp > timestampAntes);
        assertTrue(expirationTimestamp < timestampDespues + this.expiration);
    }
}