package com.example.kkarhua.fullrest.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.kkarhua.fullrest.entities.Categoria;
import com.example.kkarhua.fullrest.repositories.CategoriaRepository;
import com.example.kkarhua.fullrest.repositories.ProductoRepository;

@Service
public class CategoriaServiceImpl implements CategoriaServices {

    @Autowired
    private CategoriaRepository categoriaRepository;
    
    @Autowired
    private ProductoRepository productoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Categoria> findByAll() {
        return (List<Categoria>) categoriaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Categoria> findById(Long id) {
        return categoriaRepository.findById(id);
    }

    @Override
    @Transactional
    public Categoria save(Categoria unaCategoria) {
        return categoriaRepository.save(unaCategoria);
    }

    @Override
    @Transactional
    public Optional<Categoria> delete(Categoria unaCategoria) {
        Optional<Categoria> categoriaOptional = categoriaRepository.findById(unaCategoria.getId());
        categoriaOptional.ifPresent(categoriaDb -> {
            categoriaRepository.delete(unaCategoria);
        });
        return categoriaOptional;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByNombre(String nombre) {
        return categoriaRepository.existsByNombre(nombre);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean tieneProductosAsociados(Long categoriaId) {
        return productoRepository.countByCategoriaId(categoriaId) > 0;
    }
}