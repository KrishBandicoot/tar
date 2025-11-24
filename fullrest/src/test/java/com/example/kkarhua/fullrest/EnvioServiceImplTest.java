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

import com.example.kkarhua.fullrest.entities.Envio;
import com.example.kkarhua.fullrest.entities.Usuario;
import com.example.kkarhua.fullrest.repositories.EnvioRepository;
import com.example.kkarhua.fullrest.services.EnvioServiceImpl;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests para EnvioServiceImpl")
class EnvioServiceImplTest {

    @Mock
    private EnvioRepository envioRepository;

    @InjectMocks
    private EnvioServiceImpl envioService;

    private Usuario usuario;
    private Envio envio1;
    private Envio envio2;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Juan Pérez");
        usuario.setEmail("juan@email.com");
        usuario.setRol("cliente");
        usuario.setEstado("activo");

        envio1 = new Envio();
        envio1.setId(1L);
        envio1.setCalle("Av. Libertador 1234");
        envio1.setDepartamento("Depto 501");
        envio1.setRegion("Región Metropolitana");
        envio1.setComuna("Santiago");
        envio1.setIndicaciones("Tocar el timbre 501");
        envio1.setUsuario(usuario);
        envio1.setFechaCreacion(LocalDateTime.now());
        envio1.setFechaActualizacion(LocalDateTime.now());

        envio2 = new Envio();
        envio2.setId(2L);
        envio2.setCalle("Calle Los Alerces 567");
        envio2.setRegion("Región Metropolitana");
        envio2.setComuna("Providencia");
        envio2.setUsuario(usuario);
        envio2.setFechaCreacion(LocalDateTime.now());
        envio2.setFechaActualizacion(LocalDateTime.now());
    }

    @Test
    @DisplayName("findByAll - Debe retornar lista de envíos")
    void testFindByAll_DebeRetornarListaDeEnvios() {
        // Given
        List<Envio> envios = Arrays.asList(envio1, envio2);
        when(envioRepository.findAll()).thenReturn(envios);

        // When
        List<Envio> resultado = envioService.findByAll();

        // Then
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertEquals("Av. Libertador 1234", resultado.get(0).getCalle());
        assertEquals("Calle Los Alerces 567", resultado.get(1).getCalle());
        verify(envioRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("findByAll - Debe retornar lista vacía cuando no hay envíos")
    void testFindByAll_DebeRetornarListaVacia() {
        // Given
        when(envioRepository.findAll()).thenReturn(Arrays.asList());

        // When
        List<Envio> resultado = envioService.findByAll();

        // Then
        assertNotNull(resultado);
        assertTrue(resultado.isEmpty());
        verify(envioRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("findById - Debe retornar envío cuando existe")
    void testFindById_DebeRetornarEnvioCuandoExiste() {
        // Given
        when(envioRepository.findById(1L)).thenReturn(Optional.of(envio1));

        // When
        Optional<Envio> resultado = envioService.findById(1L);

        // Then
        assertTrue(resultado.isPresent());
        assertEquals("Av. Libertador 1234", resultado.get().getCalle());
        assertEquals("Santiago", resultado.get().getComuna());
        verify(envioRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("findById - Debe retornar Optional vacío cuando no existe")
    void testFindById_DebeRetornarVacioCuandoNoExiste() {
        // Given
        when(envioRepository.findById(99L)).thenReturn(Optional.empty());

        // When
        Optional<Envio> resultado = envioService.findById(99L);

        // Then
        assertFalse(resultado.isPresent());
        verify(envioRepository, times(1)).findById(99L);
    }

    @Test
    @DisplayName("findByUsuarioId - Debe retornar envíos del usuario")
    void testFindByUsuarioId_DebeRetornarEnviosDelUsuario() {
        // Given
        List<Envio> envios = Arrays.asList(envio1, envio2);
        when(envioRepository.findByUsuarioId(1L)).thenReturn(envios);

        // When
        List<Envio> resultado = envioService.findByUsuarioId(1L);

        // Then
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertEquals(1L, resultado.get(0).getUsuario().getId());
        assertEquals(1L, resultado.get(1).getUsuario().getId());
        verify(envioRepository, times(1)).findByUsuarioId(1L);
    }

    @Test
    @DisplayName("findByUsuarioId - Debe retornar lista vacía cuando usuario no tiene envíos")
    void testFindByUsuarioId_DebeRetornarListaVacia() {
        // Given
        when(envioRepository.findByUsuarioId(99L)).thenReturn(Arrays.asList());

        // When
        List<Envio> resultado = envioService.findByUsuarioId(99L);

        // Then
        assertNotNull(resultado);
        assertTrue(resultado.isEmpty());
        verify(envioRepository, times(1)).findByUsuarioId(99L);
    }

    @Test
    @DisplayName("save - Debe guardar nuevo envío correctamente")
    void testSave_DebeGuardarNuevoEnvioCorrectamente() {
        // Given
        Envio nuevoEnvio = new Envio();
        nuevoEnvio.setCalle("Av. Providencia 2000");
        nuevoEnvio.setRegion("Región Metropolitana");
        nuevoEnvio.setComuna("Providencia");
        nuevoEnvio.setUsuario(usuario);

        when(envioRepository.save(any(Envio.class))).thenAnswer(invocation -> {
            Envio e = invocation.getArgument(0);
            e.setId(3L);
            e.setFechaCreacion(LocalDateTime.now());
            e.setFechaActualizacion(LocalDateTime.now());
            return e;
        });

        // When
        Envio resultado = envioService.save(nuevoEnvio);

        // Then
        assertNotNull(resultado);
        assertNotNull(resultado.getId());
        assertEquals("Av. Providencia 2000", resultado.getCalle());
        assertNotNull(resultado.getFechaCreacion());
        verify(envioRepository, times(1)).save(nuevoEnvio);
    }

    @Test
    @DisplayName("save - Debe actualizar envío existente")
    void testSave_DebeActualizarEnvioExistente() {
        // Given
        envio1.setCalle("Nueva Dirección 999");
        envio1.setComuna("Las Condes");
        when(envioRepository.save(envio1)).thenReturn(envio1);

        // When
        Envio resultado = envioService.save(envio1);

        // Then
        assertNotNull(resultado);
        assertEquals("Nueva Dirección 999", resultado.getCalle());
        assertEquals("Las Condes", resultado.getComuna());
        verify(envioRepository, times(1)).save(envio1);
    }

    @Test
    @DisplayName("save - Debe guardar envío con campos opcionales nulos")
    void testSave_DebeGuardarEnvioConCamposOpcionalesNulos() {
        // Given
        Envio envioSinOpcionales = new Envio();
        envioSinOpcionales.setCalle("Calle Principal 123");
        envioSinOpcionales.setRegion("Región Metropolitana");
        envioSinOpcionales.setComuna("Santiago");
        envioSinOpcionales.setDepartamento(null); // Opcional
        envioSinOpcionales.setIndicaciones(null); // Opcional
        envioSinOpcionales.setUsuario(usuario);

        when(envioRepository.save(any(Envio.class))).thenReturn(envioSinOpcionales);

        // When
        Envio resultado = envioService.save(envioSinOpcionales);

        // Then
        assertNotNull(resultado);
        assertNull(resultado.getDepartamento());
        assertNull(resultado.getIndicaciones());
        verify(envioRepository, times(1)).save(envioSinOpcionales);
    }

    @Test
    @DisplayName("save - Debe guardar envío con todos los campos completos")
    void testSave_DebeGuardarEnvioConTodosLosCampos() {
        // Given
        when(envioRepository.save(envio1)).thenReturn(envio1);

        // When
        Envio resultado = envioService.save(envio1);

        // Then
        assertNotNull(resultado);
        assertNotNull(resultado.getCalle());
        assertNotNull(resultado.getDepartamento());
        assertNotNull(resultado.getRegion());
        assertNotNull(resultado.getComuna());
        assertNotNull(resultado.getIndicaciones());
        assertNotNull(resultado.getUsuario());
        verify(envioRepository, times(1)).save(envio1);
    }

    @Test
    @DisplayName("delete - Debe eliminar envío cuando existe")
    void testDelete_DebeEliminarEnvioCuandoExiste() {
        // Given
        when(envioRepository.findById(1L)).thenReturn(Optional.of(envio1));
        doNothing().when(envioRepository).delete(envio1);

        // When
        Optional<Envio> resultado = envioService.delete(envio1);

        // Then
        assertTrue(resultado.isPresent());
        assertEquals("Av. Libertador 1234", resultado.get().getCalle());
        verify(envioRepository, times(1)).findById(1L);
        verify(envioRepository, times(1)).delete(envio1);
    }

    @Test
    @DisplayName("delete - No debe eliminar cuando envío no existe")
    void testDelete_NoDebeEliminarCuandoNoExiste() {
        // Given
        Envio envioInexistente = new Envio();
        envioInexistente.setId(99L);
        when(envioRepository.findById(99L)).thenReturn(Optional.empty());

        // When
        Optional<Envio> resultado = envioService.delete(envioInexistente);

        // Then
        assertFalse(resultado.isPresent());
        verify(envioRepository, times(1)).findById(99L);
        verify(envioRepository, never()).delete(any());
    }

    @Test
    @DisplayName("save - Debe mantener asociación con usuario")
    void testSave_DebeMantenerAsociacionConUsuario() {
        // Given
        when(envioRepository.save(envio1)).thenReturn(envio1);

        // When
        Envio resultado = envioService.save(envio1);

        // Then
        assertNotNull(resultado);
        assertNotNull(resultado.getUsuario());
        assertEquals(usuario.getId(), resultado.getUsuario().getId());
        assertEquals("Juan Pérez", resultado.getUsuario().getNombre());
        verify(envioRepository, times(1)).save(envio1);
    }

    @Test
    @DisplayName("findByUsuarioId - Debe retornar múltiples direcciones del mismo usuario")
    void testFindByUsuarioId_DebeRetornarMultiplesDirecciones() {
        // Given
        Envio envio3 = new Envio();
        envio3.setId(3L);
        envio3.setCalle("Otra Dirección 789");
        envio3.setRegion("Región Metropolitana");
        envio3.setComuna("Vitacura");
        envio3.setUsuario(usuario);

        List<Envio> envios = Arrays.asList(envio1, envio2, envio3);
        when(envioRepository.findByUsuarioId(1L)).thenReturn(envios);

        // When
        List<Envio> resultado = envioService.findByUsuarioId(1L);

        // Then
        assertNotNull(resultado);
        assertEquals(3, resultado.size());
        resultado.forEach(e -> assertEquals(1L, e.getUsuario().getId()));
        verify(envioRepository, times(1)).findByUsuarioId(1L);
    }
}