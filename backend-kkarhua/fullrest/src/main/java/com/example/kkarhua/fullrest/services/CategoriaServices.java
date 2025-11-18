package com.example.kkarhua.fullrest.services;

import java.util.List;
import java.util.Optional;

import com.example.kkarhua.fullrest.entities.Categoria;

public interface CategoriaServices {

    List<Categoria> findByAll();

    Optional<Categoria> findById(Long id);

    Categoria save(Categoria unaCategoria);

    Optional<Categoria> delete(Categoria unaCategoria);
    
    boolean existsByNombre(String nombre);
    
    boolean tieneProductosAsociados(Long categoriaId);
}