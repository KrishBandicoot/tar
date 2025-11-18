package com.example.kkarhua.fullrest.repositories;

import org.springframework.data.repository.CrudRepository;
import com.example.kkarhua.fullrest.entities.Categoria;

public interface CategoriaRepository extends CrudRepository<Categoria, Long> {
    
    boolean existsByNombre(String nombre);
}