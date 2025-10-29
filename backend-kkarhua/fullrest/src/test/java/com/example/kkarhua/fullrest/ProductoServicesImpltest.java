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

import com.example.kkarhua.fullrest.entities.Producto;
import com.example.kkarhua.fullrest.repositories.ProductoRepository;
import com.example.kkarhua.fullrest.services.ProductoServiceImpl;

@ExtendWith(MockitoExtension.class)
class ProductoServiceImplTest {

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private ProductoServiceImpl productoService;

    private Producto producto1;
    private Producto producto2;

    @BeforeEach
    void setUp() {
        producto1 = new Producto();
        producto1.setId(1L);
        producto1.setNombre("Laptop HP Pavilion");
        producto1.setDescripcion("Laptop con procesador Intel Core i5");
        producto1.setPrecio(649990);
        producto1.setStock(15);
        producto1.setCategoria("Electrónica");
        producto1.setImagen("laptop-hp.jpg");
        producto1.setEstado("activo");
        producto1.setFechaCreacion(LocalDateTime.now());

        producto2 = new Producto();
        producto2.setId(2L);
        producto2.setNombre("Mouse Logitech");
        producto2.setDescripcion("Mouse inalámbrico ergonómico");
        producto2.setPrecio(89990);
        producto2.setStock(30);
        producto2.setCategoria("Electrónica");
        producto2.setImagen("mouse-logitech.jpg");
        producto2.setEstado("activo");
        producto2.setFechaCreacion(LocalDateTime.now());
    }

    @Test
    void testFindByAll_DebeRetornarListaDeProductos() {
        // Given
        List<Producto> productos = Arrays.asList(producto1, producto2);
        when(productoRepository.findAll()).thenReturn(productos);

        // When
        List<Producto> resultado = productoService.findByAll();

        // Then
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertEquals("Laptop HP Pavilion", resultado.get(0).getNombre());
        assertEquals("Mouse Logitech", resultado.get(1).getNombre());
        verify(productoRepository, times(1)).findAll();
    }

    @Test
    void testFindById_DebeRetornarProductoCuandoExiste() {
        // Given
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto1));

        // When
        Optional<Producto> resultado = productoService.findById(1L);

        // Then
        assertTrue(resultado.isPresent());
        assertEquals("Laptop HP Pavilion", resultado.get().getNombre());
        assertEquals(649990, resultado.get().getPrecio());
        verify(productoRepository, times(1)).findById(1L);
    }

    @Test
    void testFindById_DebeRetornarVacioCuandoNoExiste() {
        // Given
        when(productoRepository.findById(99L)).thenReturn(Optional.empty());

        // When
        Optional<Producto> resultado = productoService.findById(99L);

        // Then
        assertFalse(resultado.isPresent());
        verify(productoRepository, times(1)).findById(99L);
    }

    @Test
    void testSave_DebeGuardarProductoCorrectamente() {
        // Given
        Producto nuevoProducto = new Producto();
        nuevoProducto.setNombre("Teclado Mecánico");
        nuevoProducto.setDescripcion("Teclado gaming RGB");
        nuevoProducto.setPrecio(129990);
        nuevoProducto.setStock(20);
        nuevoProducto.setCategoria("Electrónica");
        
        when(productoRepository.save(any(Producto.class))).thenReturn(nuevoProducto);

        // When
        Producto resultado = productoService.save(nuevoProducto);

        // Then
        assertNotNull(resultado);
        assertEquals("Teclado Mecánico", resultado.getNombre());
        assertEquals(129990, resultado.getPrecio());
        verify(productoRepository, times(1)).save(nuevoProducto);
    }

    @Test
    void testDelete_DebeEliminarProductoCuandoExiste() {
        // Given
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto1));
        doNothing().when(productoRepository).delete(producto1);

        // When
        Optional<Producto> resultado = productoService.delete(producto1);

        // Then
        assertTrue(resultado.isPresent());
        assertEquals("Laptop HP Pavilion", resultado.get().getNombre());
        verify(productoRepository, times(1)).findById(1L);
        verify(productoRepository, times(1)).delete(producto1);
    }

    @Test
    void testDelete_NoDebeEliminarCuandoNoExiste() {
        // Given
        Producto productoInexistente = new Producto();
        productoInexistente.setId(99L);
        when(productoRepository.findById(99L)).thenReturn(Optional.empty());

        // When
        Optional<Producto> resultado = productoService.delete(productoInexistente);

        // Then
        assertFalse(resultado.isPresent());
        verify(productoRepository, times(1)).findById(99L);
        verify(productoRepository, never()).delete(any());
    }

    @Test
    void testSave_DebeActualizarStockDeProductoExistente() {
        // Given
        producto1.setStock(10); // Stock original
        when(productoRepository.save(producto1)).thenReturn(producto1);

        // When
        producto1.setStock(5); // Actualizar stock
        Producto resultado = productoService.save(producto1);

        // Then
        assertNotNull(resultado);
        assertEquals(5, resultado.getStock());
        verify(productoRepository, times(1)).save(producto1);
    }
}