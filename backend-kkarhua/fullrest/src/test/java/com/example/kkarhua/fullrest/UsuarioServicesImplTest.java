package com.example.kkarhua.fullrest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.kkarhua.fullrest.entities.Usuario;
import com.example.kkarhua.fullrest.repositories.UsuarioRepository;
import com.example.kkarhua.fullrest.services.UsuarioServiceImpl;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceImplTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioServiceImpl usuarioService;

    private Usuario usuario1;
    private Usuario usuario2;

    @BeforeEach
    void setUp() {
        usuario1 = new Usuario();
        usuario1.setId(1L);
        usuario1.setNombre("Administrador Principal");
        usuario1.setEmail("admin@kkarhua.com");
        usuario1.setContrasena("Admin123");
        usuario1.setRol("super-admin");
        usuario1.setEstado("activo");
        usuario1.setFechaCreacion(LocalDateTime.now());

        usuario2 = new Usuario();
        usuario2.setId(2L);
        usuario2.setNombre("Juan Pérez");
        usuario2.setEmail("juan.perez@email.com");
        usuario2.setContrasena("Juan123");
        usuario2.setRol("cliente");
        usuario2.setEstado("activo");
        usuario2.setFechaCreacion(LocalDateTime.now());
    }

    @Test
    void testFindByAll_DebeRetornarListaDeUsuarios() {
        // Given
        List<Usuario> usuarios = Arrays.asList(usuario1, usuario2);
        when(usuarioRepository.findAll()).thenReturn(usuarios);

        // When
        List<Usuario> resultado = usuarioService.findByAll();

        // Then
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertEquals("Administrador Principal", resultado.get(0).getNombre());
        assertEquals("Juan Pérez", resultado.get(1).getNombre());
        verify(usuarioRepository, times(1)).findAll();
    }

    @Test
    void testFindById_DebeRetornarUsuarioCuandoExiste() {
        // Given
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario1));

        // When
        Optional<Usuario> resultado = usuarioService.findById(1L);

        // Then
        assertTrue(resultado.isPresent());
        assertEquals("Administrador Principal", resultado.get().getNombre());
        assertEquals("super-admin", resultado.get().getRol());
        verify(usuarioRepository, times(1)).findById(1L);
    }

    @Test
    void testFindByEmail_DebeRetornarUsuarioCuandoExiste() {
        // Given
        when(usuarioRepository.findByEmail("admin@kkarhua.com")).thenReturn(Optional.of(usuario1));

        // When
        Optional<Usuario> resultado = usuarioService.findByEmail("admin@kkarhua.com");

        // Then
        assertTrue(resultado.isPresent());
        assertEquals("Administrador Principal", resultado.get().getNombre());
        assertEquals("admin@kkarhua.com", resultado.get().getEmail());
        verify(usuarioRepository, times(1)).findByEmail("admin@kkarhua.com");
    }

    @Test
    void testSave_DebeEncriptarContrasenaAlGuardarNuevoUsuario() {
        // Given
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre("María González");
        nuevoUsuario.setEmail("maria@email.com");
        nuevoUsuario.setContrasena("Maria123");
        nuevoUsuario.setRol("vendedor");
        nuevoUsuario.setEstado("activo");

        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario usuario = invocation.getArgument(0);
            usuario.setId(3L);
            return usuario;
        });

        // When
        Usuario resultado = usuarioService.save(nuevoUsuario);

        // Then
        assertNotNull(resultado);
        assertEquals("María González", resultado.getNombre());
        assertNotEquals("Maria123", resultado.getContrasena()); // Contraseña debe estar encriptada
        assertTrue(resultado.getContrasena().startsWith("$2a$")); // BCrypt prefix
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    void testExistsByEmail_DebeRetornarTrueCuandoEmailExiste() {
        // Given
        when(usuarioRepository.existsByEmail("admin@kkarhua.com")).thenReturn(true);

        // When
        boolean resultado = usuarioService.existsByEmail("admin@kkarhua.com");

        // Then
        assertTrue(resultado);
        verify(usuarioRepository, times(1)).existsByEmail("admin@kkarhua.com");
    }

    @Test
    void testExistsByEmail_DebeRetornarFalseCuandoEmailNoExiste() {
        // Given
        when(usuarioRepository.existsByEmail("noexiste@email.com")).thenReturn(false);

        // When
        boolean resultado = usuarioService.existsByEmail("noexiste@email.com");

        // Then
        assertFalse(resultado);
        verify(usuarioRepository, times(1)).existsByEmail("noexiste@email.com");
    }

    @Test
    void testDelete_DebeEliminarUsuarioCuandoExiste() {
        // Given
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario1));
        doNothing().when(usuarioRepository).delete(usuario1);

        // When
        Optional<Usuario> resultado = usuarioService.delete(usuario1);

        // Then
        assertTrue(resultado.isPresent());
        assertEquals("Administrador Principal", resultado.get().getNombre());
        verify(usuarioRepository, times(1)).findById(1L);
        verify(usuarioRepository, times(1)).delete(usuario1);
    }

    @Test
    void testSave_NoDebeEncriptarContrasenaYaEncriptada() {
        // Given
        Usuario usuarioConContrasenaEncriptada = new Usuario();
        usuarioConContrasenaEncriptada.setId(1L);
        usuarioConContrasenaEncriptada.setNombre("Usuario Test");
        usuarioConContrasenaEncriptada.setEmail("test@email.com");
        usuarioConContrasenaEncriptada.setContrasena("$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkO");
        usuarioConContrasenaEncriptada.setRol("cliente");
        usuarioConContrasenaEncriptada.setEstado("activo");

        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioConContrasenaEncriptada);

        // When
        Usuario resultado = usuarioService.save(usuarioConContrasenaEncriptada);

        // Then
        assertNotNull(resultado);
        assertEquals("$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkO", resultado.getContrasena());
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }
}