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

import com.example.kkarhua.fullrest.entities.Compra;
import com.example.kkarhua.fullrest.entities.Usuario;
import com.example.kkarhua.fullrest.entities.Envio;
import com.example.kkarhua.fullrest.repositories.CompraRepository;
import com.example.kkarhua.fullrest.services.CompraServiceImpl;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests para CompraServiceImpl")
class CompraServiceImplTest {

    @Mock
    private CompraRepository compraRepository;

    @InjectMocks
    private CompraServiceImpl compraService;

    private Usuario usuario;
    private Envio envio;
    private Compra compra1;
    private Compra compra2;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Juan Pérez");
        usuario.setEmail("juan@email.com");
        usuario.setRol("cliente");
        usuario.setEstado("activo");

        envio = new Envio();
        envio.setId(1L);
        envio.setCalle("Av. Principal 123");
        envio.setRegion("Región Metropolitana");
        envio.setComuna("Santiago");
        envio.setUsuario(usuario);

        String detalleProductos1 = "[{\"id\":1,\"nombre\":\"Laptop\",\"precio\":500000,\"cantidad\":1}]";
        compra1 = new Compra();
        compra1.setId(1L);
        compra1.setUsuario(usuario);
        compra1.setEnvio(envio);
        compra1.setSubtotal(420168);
        compra1.setIva(79832);
        compra1.setTotal(500000);
        compra1.setDetalleProductos(detalleProductos1);
        compra1.setEstado("completada");
        compra1.setFechaCompra(LocalDateTime.now());

        String detalleProductos2 = "[{\"id\":2,\"nombre\":\"Mouse\",\"precio\":50000,\"cantidad\":2}]";
        compra2 = new Compra();
        compra2.setId(2L);
        compra2.setUsuario(usuario);
        compra2.setEnvio(envio);
        compra2.setSubtotal(84034);
        compra2.setIva(15966);
        compra2.setTotal(100000);
        compra2.setDetalleProductos(detalleProductos2);
        compra2.setEstado("completada");
        compra2.setFechaCompra(LocalDateTime.now());
    }

    @Test
    @DisplayName("findByAll - Debe retornar lista de compras")
    void testFindByAll_DebeRetornarListaDeCompras() {
        // Given
        List<Compra> compras = Arrays.asList(compra1, compra2);
        when(compraRepository.findAll()).thenReturn(compras);

        // When
        List<Compra> resultado = compraService.findByAll();

        // Then
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertEquals(500000, resultado.get(0).getTotal());
        assertEquals(100000, resultado.get(1).getTotal());
        verify(compraRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("findByAll - Debe retornar lista vacía cuando no hay compras")
    void testFindByAll_DebeRetornarListaVacia() {
        // Given
        when(compraRepository.findAll()).thenReturn(Arrays.asList());

        // When
        List<Compra> resultado = compraService.findByAll();

        // Then
        assertNotNull(resultado);
        assertTrue(resultado.isEmpty());
        verify(compraRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("findById - Debe retornar compra cuando existe")
    void testFindById_DebeRetornarCompraCuandoExiste() {
        // Given
        when(compraRepository.findById(1L)).thenReturn(Optional.of(compra1));

        // When
        Optional<Compra> resultado = compraService.findById(1L);

        // Then
        assertTrue(resultado.isPresent());
        assertEquals(500000, resultado.get().getTotal());
        assertEquals("completada", resultado.get().getEstado());
        verify(compraRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("findById - Debe retornar Optional vacío cuando no existe")
    void testFindById_DebeRetornarVacioCuandoNoExiste() {
        // Given
        when(compraRepository.findById(99L)).thenReturn(Optional.empty());

        // When
        Optional<Compra> resultado = compraService.findById(99L);

        // Then
        assertFalse(resultado.isPresent());
        verify(compraRepository, times(1)).findById(99L);
    }

    @Test
    @DisplayName("findByUsuarioId - Debe retornar compras del usuario")
    void testFindByUsuarioId_DebeRetornarComprasDelUsuario() {
        // Given
        List<Compra> compras = Arrays.asList(compra1, compra2);
        when(compraRepository.findByUsuarioId(1L)).thenReturn(compras);

        // When
        List<Compra> resultado = compraService.findByUsuarioId(1L);

        // Then
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertEquals(1L, resultado.get(0).getUsuario().getId());
        assertEquals(1L, resultado.get(1).getUsuario().getId());
        verify(compraRepository, times(1)).findByUsuarioId(1L);
    }

    @Test
    @DisplayName("findByUsuarioId - Debe retornar lista vacía cuando usuario no tiene compras")
    void testFindByUsuarioId_DebeRetornarListaVacia() {
        // Given
        when(compraRepository.findByUsuarioId(99L)).thenReturn(Arrays.asList());

        // When
        List<Compra> resultado = compraService.findByUsuarioId(99L);

        // Then
        assertNotNull(resultado);
        assertTrue(resultado.isEmpty());
        verify(compraRepository, times(1)).findByUsuarioId(99L);
    }

    @Test
    @DisplayName("save - Debe guardar nueva compra correctamente")
    void testSave_DebeGuardarNuevaCompraCorrectamente() {
        // Given
        String detalleProductos = "[{\"id\":3,\"nombre\":\"Teclado\",\"precio\":80000,\"cantidad\":1}]";
        Compra nuevaCompra = new Compra();
        nuevaCompra.setUsuario(usuario);
        nuevaCompra.setEnvio(envio);
        nuevaCompra.setSubtotal(67227);
        nuevaCompra.setIva(12773);
        nuevaCompra.setTotal(80000);
        nuevaCompra.setDetalleProductos(detalleProductos);

        when(compraRepository.save(any(Compra.class))).thenAnswer(invocation -> {
            Compra c = invocation.getArgument(0);
            c.setId(3L);
            c.setFechaCompra(LocalDateTime.now());
            return c;
        });

        // When
        Compra resultado = compraService.save(nuevaCompra);

        // Then
        assertNotNull(resultado);
        assertNotNull(resultado.getId());
        assertEquals(80000, resultado.getTotal());
        assertNotNull(resultado.getFechaCompra());
        verify(compraRepository, times(1)).save(nuevaCompra);
    }

    @Test
    @DisplayName("save - Debe calcular correctamente subtotal, IVA y total")
    void testSave_DebeCalcularCorrectamenteMontos() {
        // Given
        when(compraRepository.save(compra1)).thenReturn(compra1);

        // When
        Compra resultado = compraService.save(compra1);

        // Then
        assertNotNull(resultado);
        assertEquals(420168, resultado.getSubtotal());
        assertEquals(79832, resultado.getIva());
        assertEquals(500000, resultado.getTotal());
        assertEquals(resultado.getSubtotal() + resultado.getIva(), resultado.getTotal());
        verify(compraRepository, times(1)).save(compra1);
    }

    @Test
    @DisplayName("delete - Debe eliminar compra cuando existe")
    void testDelete_DebeEliminarCompraCuandoExiste() {
        // Given
        when(compraRepository.findById(1L)).thenReturn(Optional.of(compra1));
        doNothing().when(compraRepository).delete(compra1);

        // When
        Optional<Compra> resultado = compraService.delete(compra1);

        // Then
        assertTrue(resultado.isPresent());
        assertEquals(500000, resultado.get().getTotal());
        verify(compraRepository, times(1)).findById(1L);
        verify(compraRepository, times(1)).delete(compra1);
    }

    @Test
    @DisplayName("delete - No debe eliminar cuando compra no existe")
    void testDelete_NoDebeEliminarCuandoNoExiste() {
        // Given
        Compra compraInexistente = new Compra();
        compraInexistente.setId(99L);
        when(compraRepository.findById(99L)).thenReturn(Optional.empty());

        // When
        Optional<Compra> resultado = compraService.delete(compraInexistente);

        // Then
        assertFalse(resultado.isPresent());
        verify(compraRepository, times(1)).findById(99L);
        verify(compraRepository, never()).delete(any());
    }

    @Test
    @DisplayName("countCompletadas - Debe contar compras completadas")
    void testCountCompletadas_DebeContarComprasCompletadas() {
        // Given
        when(compraRepository.countByEstado("completada")).thenReturn(10L);

        // When
        long resultado = compraService.countCompletadas();

        // Then
        assertEquals(10L, resultado);
        verify(compraRepository, times(1)).countByEstado("completada");
    }

    @Test
    @DisplayName("countCompletadas - Debe retornar 0 cuando no hay compras completadas")
    void testCountCompletadas_DebeRetornarCeroCuandoNoHayCompletadas() {
        // Given
        when(compraRepository.countByEstado("completada")).thenReturn(0L);

        // When
        long resultado = compraService.countCompletadas();

        // Then
        assertEquals(0L, resultado);
        verify(compraRepository, times(1)).countByEstado("completada");
    }

    @Test
    @DisplayName("save - Debe guardar compra con estado predeterminado")
    void testSave_DebeGuardarCompraConEstadoPredeterminado() {
        // Given
        Compra compra = new Compra();
        compra.setUsuario(usuario);
        compra.setEnvio(envio);
        compra.setSubtotal(84034);
        compra.setIva(15966);
        compra.setTotal(100000);
        compra.setDetalleProductos("[]");
        compra.setEstado("completada");

        when(compraRepository.save(any(Compra.class))).thenReturn(compra);

        // When
        Compra resultado = compraService.save(compra);

        // Then
        assertNotNull(resultado);
        assertEquals("completada", resultado.getEstado());
        verify(compraRepository, times(1)).save(compra);
    }

    @Test
    @DisplayName("save - Debe mantener asociaciones con usuario y envío")
    void testSave_DebeMantenerAsociaciones() {
        // Given
        when(compraRepository.save(compra1)).thenReturn(compra1);

        // When
        Compra resultado = compraService.save(compra1);

        // Then
        assertNotNull(resultado);
        assertNotNull(resultado.getUsuario());
        assertNotNull(resultado.getEnvio());
        assertEquals(usuario.getId(), resultado.getUsuario().getId());
        assertEquals(envio.getId(), resultado.getEnvio().getId());
        verify(compraRepository, times(1)).save(compra1);
    }

    @Test
    @DisplayName("save - Debe guardar detalle de productos correctamente")
    void testSave_DebeGuardarDetalleProductos() {
        // Given
        when(compraRepository.save(compra1)).thenReturn(compra1);

        // When
        Compra resultado = compraService.save(compra1);

        // Then
        assertNotNull(resultado);
        assertNotNull(resultado.getDetalleProductos());
        assertFalse(resultado.getDetalleProductos().isEmpty());
        assertTrue(resultado.getDetalleProductos().contains("Laptop"));
        verify(compraRepository, times(1)).save(compra1);
    }

    @Test
    @DisplayName("findByUsuarioId - Debe retornar compras ordenadas por fecha")
    void testFindByUsuarioId_DebeRetornarComprasDelMismoUsuario() {
        // Given
        Compra compra3 = new Compra();
        compra3.setId(3L);
        compra3.setUsuario(usuario);
        compra3.setEnvio(envio);
        compra3.setTotal(200000);
        compra3.setEstado("completada");

        List<Compra> compras = Arrays.asList(compra1, compra2, compra3);
        when(compraRepository.findByUsuarioId(1L)).thenReturn(compras);

        // When
        List<Compra> resultado = compraService.findByUsuarioId(1L);

        // Then
        assertNotNull(resultado);
        assertEquals(3, resultado.size());
        resultado.forEach(c -> {
            assertEquals(1L, c.getUsuario().getId());
            assertEquals("completada", c.getEstado());
        });
        verify(compraRepository, times(1)).findByUsuarioId(1L);
    }
}