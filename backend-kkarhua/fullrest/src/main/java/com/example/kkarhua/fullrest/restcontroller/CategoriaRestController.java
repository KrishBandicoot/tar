package com.example.kkarhua.fullrest.restcontroller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.kkarhua.fullrest.entities.Categoria;
import com.example.kkarhua.fullrest.repositories.CategoriaRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Categorías", description = "Gestión de categorías de productos")
@RestController
@RequestMapping("api/categorias")
public class CategoriaRestController {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Operation(summary = "Obtener todas las categorías", description = "Devuelve la lista completa de categorías disponibles")
    @GetMapping
    public List<Categoria> verCategorias() {
        return (List<Categoria>) categoriaRepository.findAll();
    }
}