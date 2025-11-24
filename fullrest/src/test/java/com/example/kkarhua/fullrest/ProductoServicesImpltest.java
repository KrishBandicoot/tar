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
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.kkarhua.fullrest.entities.Usuario;
import com.example.kkarhua.fullrest.repositories.UsuarioRepository;
import com.example.kkarhua.fullrest.services.UsuarioServiceImpl;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests para UsuarioServiceImpl")
class UsuarioServiceImplTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioServiceImpl usuarioService;

    private Usuario usuario1;
    private Usuario usuario2;
    private Usuario usuario3;

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

        usuario3 = new Usuario();
        usuario3.setId(3L);
        usuario3.setNombre("María González");
        usuario3.setEmail("maria@email.com");
        usuario3.setContrasena("Maria123");
        usuario3.setRol("vendedor");
        usuario3.setEstado("activo");
        usuario3.setFechaCreacion(LocalDateTime.now());
    }

    @Test
    @DisplayName("findByAll - Debe retornar lista de todos los usuarios")
    void testFindByAll_DebeRetornarListaDeUsuarios() {
        // Given
        List<Usuario> usuarios = Arrays.asList(usuario1, usuario2, usuario3);
        when(usuarioRepository.findAll()).thenReturn(usuarios);

        // When
        List<Usuario> resultado = usuarioService.findByAll();

        // Then
        assertNotNull(resultado);
        assertEquals(3, resultado.size());
        assertEquals("Administrador Principal", resultado.get(0).getNombre());
        assertEquals("Juan Pérez", resultado.get(1).getNombre());
        assertEquals("María González", resultado.get(2).getNombre());
        verify(usuarioRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("findByAll - Debe retornar lista vacía cuando no hay usuarios")
    void testFindByAll_DebeRetornarListaVaciaCuandoNoHayUsuarios() {
        // Given
        when(usuarioRepository.findAll()).thenReturn(Arrays.asList());

        // When
        List<Usuario> resultado = usuarioService.findByAll();

        // Then
        assertNotNull(resultado);
        assertTrue(resultado.isEmpty());
        verify(usuarioRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("findById - Debe retornar usuario cuando existe")
    void testFindById_DebeRetornarUsuarioCuandoExiste() {
        // Given
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario1));

        // When
        Optional<Usuario> resultado = usuarioService.findById(1L);

        // Then
        assertTrue(resultado.isPresent());
        assertEquals("Administrador Principal", resultado.get().getNombre());
        assertEquals("super-admin", resultado.get().getRol());
        assertEquals("admin@kkarhua.com", resultado.get().getEmail());
        verify(usuarioRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("findById - Debe retornar Optional vacío cuando no existe")
    void testFindById_DebeRetornarVacioCuandoNoExiste() {
        // Given
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        // When
        Optional<Usuario> resultado = usuarioService.findById(99L);

        // Then
        assertFalse(resultado.isPresent());
        verify(usuarioRepository, times(1)).findById(99L);
    }

    @Test
    @DisplayName("findByEmail - Debe retornar usuario cuando email existe")
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
    @DisplayName("findByEmail - Debe retornar Optional vacío cuando email no existe")
    void testFindByEmail_DebeRetornarVacioCuandoNoExiste() {
        // Given
        when(usuarioRepository.findByEmail("noexiste@email.com")).thenReturn(Optional.empty());

        // When
        Optional<Usuario> resultado = usuarioService.findByEmail("noexiste@email.com");

        // Then
        assertFalse(resultado.isPresent());
        verify(usuarioRepository, times(1)).findByEmail("noexiste@email.com");
    }

    @Test
    @DisplayName("save - Debe encriptar contraseña al guardar nuevo usuario")
    void testSave_DebeEncriptarContrasenaAlGuardarNuevoUsuario() {
        // Given
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre("Pedro López");
        nuevoUsuario.setEmail("pedro@email.com");
        nuevoUsuario.setContrasena("Pedro123");
        nuevoUsuario.setRol("cliente");
        nuevoUsuario.setEstado("activo");

        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario usuario = invocation.getArgument(0);
            usuario.setId(4L);
            usuario.setFechaCreacion(LocalDateTime.now());
            return usuario;
        });

        // When
        Usuario resultado = usuarioService.save(nuevoUsuario);

        // Then
        assertNotNull(resultado);
        assertNotNull(resultado.getId());
        assertEquals("Pedro López", resultado.getNombre());
        assertNotEquals("Pedro123", resultado.getContrasena());
        assertTrue(resultado.getContrasena().startsWith("$2a$"));
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    @DisplayName("save - No debe reencriptar contraseña ya encriptada")
    void testSave_NoDebeReencriptarContrasenaYaEncriptada() {
        // Given
        Usuario usuarioConContrasenaEncriptada = new Usuario();
        usuarioConContrasenaEncriptada.setId(1L);
        usuarioConContrasenaEncriptada.setNombre("Usuario Test");
        usuarioConContrasenaEncriptada.setEmail("test@email.com");
        String contrasenaEncriptada = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkO";
        usuarioConContrasenaEncriptada.setContrasena(contrasenaEncriptada);
        usuarioConContrasenaEncriptada.setRol("cliente");
        usuarioConContrasenaEncriptada.setEstado("activo");

        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioConContrasenaEncriptada);

        // When
        Usuario resultado = usuarioService.save(usuarioConContrasenaEncriptada);

        // Then
        assertNotNull(resultado);
        assertEquals(contrasenaEncriptada, resultado.getContrasena());
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    @DisplayName("save - Debe encriptar nueva contraseña al actualizar usuario existente")
    void testSave_DebeEncriptarNuevaContrasenaAlActualizar() {
        // Given
        Usuario usuarioExistente = new Usuario();
        usuarioExistente.setId(1L);
        usuarioExistente.setNombre("Usuario Actualizado");
        usuarioExistente.setEmail("usuario@email.com");
        usuarioExistente.setContrasena("NuevaPass123"); // Nueva contraseña sin encriptar
        usuarioExistente.setRol("cliente");
        usuarioExistente.setEstado("activo");

        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        Usuario resultado = usuarioService.save(usuarioExistente);

        // Then
        assertNotNull(resultado);
        assertNotEquals("NuevaPass123", resultado.getContrasena());
        assertTrue(resultado.getContrasena().startsWith("$2a$"));
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    @DisplayName("existsByEmail - Debe retornar true cuando email existe")
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
    @DisplayName("existsByEmail - Debe retornar false cuando email no existe")
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
    @DisplayName("delete - Debe eliminar usuario cuando existe")
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
    @DisplayName("delete - No debe eliminar cuando usuario no existe")
    void testDelete_NoDebeEliminarCuandoNoExiste() {
        // Given
        Usuario usuarioInexistente = new Usuario();
        usuarioInexistente.setId(99L);
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        // When
        Optional<Usuario> resultado = usuarioService.delete(usuarioInexistente);

        // Then
        assertFalse(resultado.isPresent());
        verify(usuarioRepository, times(1)).findById(99L);
        verify(usuarioRepository, never()).delete(any());
    }

    @Test
    @DisplayName("save - Debe guardar usuario con todos los roles permitidos")
    void testSave_DebeGuardarUsuarioConDiferentesRoles() {
        // Given
        String[] roles = {"cliente", "vendedor", "super-admin"};
        
        for (String rol : roles) {
            Usuario usuario = new Usuario();
            usuario.setNombre("Usuario " + rol);
            usuario.setEmail(rol + "@email.com");
            usuario.setContrasena("Pass123");
            usuario.setRol(rol);
            usuario.setEstado("activo");

            when(usuarioRepository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

            // When
            Usuario resultado = usuarioService.save(usuario);

            // Then
            assertNotNull(resultado);
            assertEquals(rol, resultado.getRol());
        }
    }

    @Test
    @DisplayName("save - Debe guardar usuario con diferentes estados")
    void testSave_DebeGuardarUsuarioConDiferentesEstados() {
        // Given
        String[] estados = {"activo", "inactivo"};
        
        for (String estado : estados) {
            Usuario usuario = new Usuario();
            usuario.setNombre("Usuario");
            usuario.setEmail("usuario@email.com");
            usuario.setContrasena("Pass123");
            usuario.setRol("cliente");
            usuario.setEstado(estado);

            when(usuarioRepository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

            // When
            Usuario resultado = usuarioService.save(usuario);

            // Then
            assertNotNull(resultado);
            assertEquals(estado, resultado.getEstado());
        }
    }

    @Test
    @DisplayName("findById - Debe verificar que usuario tiene todos los campos necesarios")
    void testFindById_DebeVerificarTodosLosCampos() {
        // Given
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario1));

        // When
        Optional<Usuario> resultado = usuarioService.findById(1L);

        // Then
        assertTrue(resultado.isPresent());
        Usuario u = resultado.get();
        assertNotNull(u.getId());
        assertNotNull(u.getNombre());
        assertNotNull(u.getEmail());
        assertNotNull(u.getContrasena());
        assertNotNull(u.getRol());
        assertNotNull(u.getEstado());
        assertNotNull(u.getFechaCreacion());
    }
}