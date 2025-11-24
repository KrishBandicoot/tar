package com.example.kkarhua.fullrest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

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

import com.example.kkarhua.fullrest.entities.Categoria;
import com.example.kkarhua.fullrest.repositories.CategoriaRepository;
import com.example.kkarhua.fullrest.repositories.ProductoRepository;
import com.example.kkarhua.fullrest.services.CategoriaServiceImpl;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests para CategoriaServiceImpl")
class CategoriaServiceImplTest {

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private CategoriaServiceImpl categoriaService;

    private Categoria categoria1;
    private Categoria categoria2;
    private Categoria categoria3;

    @BeforeEach
    void setUp() {
        categoria1 = new Categoria();
        categoria1.setId(1L);
        categoria1.setNombre("Electrónica");

        categoria2 = new Categoria();
        categoria2.setId(2L);
        categoria2.setNombre("Ropa");

        categoria3 = new Categoria();
        categoria3.setId(3L);
        categoria3.setNombre("Hogar");
    }

    @Test
    @DisplayName("findByAll - Debe retornar lista de categorías")
    void testFindByAll_DebeRetornarListaDeCategorias() {
        // Given
        List<Categoria> categorias = Arrays.asList(categoria1, categoria2, categoria3);
        when(categoriaRepository.findAll()).thenReturn(categorias);

        // When
        List<Categoria> resultado = categoriaService.findByAll();

        // Then
        assertNotNull(resultado);
        assertEquals(3, resultado.size());
        assertEquals("Electrónica", resultado.get(0).getNombre());
        assertEquals("Ropa", resultado.get(1).getNombre());
        assertEquals("Hogar", resultado.get(2).getNombre());
        verify(categoriaRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("findByAll - Debe retornar lista vacía cuando no hay categorías")
    void testFindByAll_DebeRetornarListaVacia() {
        // Given
        when(categoriaRepository.findAll()).thenReturn(Arrays.asList());

        // When
        List<Categoria> resultado = categoriaService.findByAll();

        // Then
        assertNotNull(resultado);
        assertTrue(resultado.isEmpty());
        verify(categoriaRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("findById - Debe retornar categoría cuando existe")
    void testFindById_DebeRetornarCategoriaCuandoExiste() {
        // Given
        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria1));

        // When
        Optional<Categoria> resultado = categoriaService.findById(1L);

        // Then
        assertTrue(resultado.isPresent());
        assertEquals("Electrónica", resultado.get().getNombre());
        assertEquals(1L, resultado.get().getId());
        verify(categoriaRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("findById - Debe retornar Optional vacío cuando no existe")
    void testFindById_DebeRetornarVacioCuandoNoExiste() {
        // Given
        when(categoriaRepository.findById(99L)).thenReturn(Optional.empty());

        // When
        Optional<Categoria> resultado = categoriaService.findById(99L);

        // Then
        assertFalse(resultado.isPresent());
        verify(categoriaRepository, times(1)).findById(99L);
    }

    @Test
    @DisplayName("save - Debe guardar nueva categoría correctamente")
    void testSave_DebeGuardarNuevaCategoriaCorrectamente() {
        // Given
        Categoria nuevaCategoria = new Categoria();
        nuevaCategoria.setNombre("Deportes");

        when(categoriaRepository.save(any(Categoria.class))).thenAnswer(invocation -> {
            Categoria c = invocation.getArgument(0);
            c.setId(4L);
            return c;
        });

        // When
        Categoria resultado = categoriaService.save(nuevaCategoria);

        // Then
        assertNotNull(resultado);
        assertNotNull(resultado.getId());
        assertEquals("Deportes", resultado.getNombre());
        verify(categoriaRepository, times(1)).save(nuevaCategoria);
    }

    @Test
    @DisplayName("save - Debe actualizar categoría existente")
    void testSave_DebeActualizarCategoriaExistente() {
        // Given
        categoria1.setNombre("Electrónica y Tecnología");
        when(categoriaRepository.save(categoria1)).thenReturn(categoria1);

        // When
        Categoria resultado = categoriaService.save(categoria1);

        // Then
        assertNotNull(resultado);
        assertEquals("Electrónica y Tecnología", resultado.getNombre());
        verify(categoriaRepository, times(1)).save(categoria1);
    }

    @Test
    @DisplayName("delete - Debe eliminar categoría cuando existe")
    void testDelete_DebeEliminarCategoriaCuandoExiste() {
        // Given
        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria1));
        doNothing().when(categoriaRepository).delete(categoria1);

        // When
        Optional<Categoria> resultado = categoriaService.delete(categoria1);

        // Then
        assertTrue(resultado.isPresent());
        assertEquals("Electrónica", resultado.get().getNombre());
        verify(categoriaRepository, times(1)).findById(1L);
        verify(categoriaRepository, times(1)).delete(categoria1);
    }

    @Test
    @DisplayName("delete - No debe eliminar cuando categoría no existe")
    void testDelete_NoDebeEliminarCuandoNoExiste() {
        // Given
        Categoria categoriaInexistente = new Categoria();
        categoriaInexistente.setId(99L);
        when(categoriaRepository.findById(99L)).thenReturn(Optional.empty());

        // When
        Optional<Categoria> resultado = categoriaService.delete(categoriaInexistente);

        // Then
        assertFalse(resultado.isPresent());
        verify(categoriaRepository, times(1)).findById(99L);
        verify(categoriaRepository, never()).delete(any());
    }

    @Test
    @DisplayName("existsByNombre - Debe retornar true cuando nombre existe")
    void testExistsByNombre_DebeRetornarTrueCuandoNombreExiste() {
        // Given
        when(categoriaRepository.existsByNombre("Electrónica")).thenReturn(true);

        // When
        boolean resultado = categoriaService.existsByNombre("Electrónica");

        // Then
        assertTrue(resultado);
        verify(categoriaRepository, times(1)).existsByNombre("Electrónica");
    }

    @Test
    @DisplayName("existsByNombre - Debe retornar false cuando nombre no existe")
    void testExistsByNombre_DebeRetornarFalseCuandoNombreNoExiste() {
        // Given
        when(categoriaRepository.existsByNombre("Inexistente")).thenReturn(false);

        // When
        boolean resultado = categoriaService.existsByNombre("Inexistente");

        // Then
        assertFalse(resultado);
        verify(categoriaRepository, times(1)).existsByNombre("Inexistente");
    }

    @Test
    @DisplayName("tieneProductosAsociados - Debe retornar true cuando tiene productos")
    void testTieneProductosAsociados_DebeRetornarTrueCuandoTieneProductos() {
        // Given
        when(productoRepository.countByCategoriaId(1L)).thenReturn(5L);

        // When
        boolean resultado = categoriaService.tieneProductosAsociados(1L);

        // Then
        assertTrue(resultado);
        verify(productoRepository, times(1)).countByCategoriaId(1L);
    }

    @Test
    @DisplayName("tieneProductosAsociados - Debe retornar false cuando no tiene productos")
    void testTieneProductosAsociados_DebeRetornarFalseCuandoNoTieneProductos() {
        // Given
        when(productoRepository.countByCategoriaId(1L)).thenReturn(0L);

        // When
        boolean resultado = categoriaService.tieneProductosAsociados(1L);

        // Then
        assertFalse(resultado);
        verify(productoRepository, times(1)).countByCategoriaId(1L);
    }

    @Test
    @DisplayName("save - Debe permitir nombres con espacios")
    void testSave_DebePermitirNombresConEspacios() {
        // Given
        Categoria categoria = new Categoria();
        categoria.setNombre("Tecnología y Electrónica");
        when(categoriaRepository.save(any(Categoria.class))).thenReturn(categoria);

        // When
        Categoria resultado = categoriaService.save(categoria);

        // Then
        assertNotNull(resultado);
        assertEquals("Tecnología y Electrónica", resultado.getNombre());
        assertTrue(resultado.getNombre().contains(" "));
        verify(categoriaRepository, times(1)).save(categoria);
    }

    @Test
    @DisplayName("save - Debe guardar categoría con nombre de longitud mínima")
    void testSave_DebeGuardarCategoriaConNombreMinimo() {
        // Given
        Categoria categoria = new Categoria();
        categoria.setNombre("ABC"); // 3 caracteres (mínimo)
        when(categoriaRepository.save(any(Categoria.class))).thenReturn(categoria);

        // When
        Categoria resultado = categoriaService.save(categoria);

        // Then
        assertNotNull(resultado);
        assertEquals("ABC", resultado.getNombre());
        assertEquals(3, resultado.getNombre().length());
        verify(categoriaRepository, times(1)).save(categoria);
    }

    @Test
    @DisplayName("save - Debe guardar categoría con nombre de longitud máxima")
    void testSave_DebeGuardarCategoriaConNombreMaximo() {
        // Given
        String nombreLargo = "A".repeat(50); // 50 caracteres (máximo)
        Categoria categoria = new Categoria();
        categoria.setNombre(nombreLargo);
        when(categoriaRepository.save(any(Categoria.class))).thenReturn(categoria);

        // When
        Categoria resultado = categoriaService.save(categoria);

        // Then
        assertNotNull(resultado);
        assertEquals(50, resultado.getNombre().length());
        verify(categoriaRepository, times(1)).save(categoria);
    }
}