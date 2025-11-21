package com.example.kkarhua.fullrest.services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.kkarhua.fullrest.entities.Compra;
import com.example.kkarhua.fullrest.repositories.CompraRepository;

@Service
public class CompraServiceImpl implements CompraServices {

    @Autowired
    private CompraRepository compraRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Compra> findByAll() {
        return (List<Compra>) compraRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Compra> findById(Long id) {
        return compraRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Compra> findByUsuarioId(Long usuarioId) {
        return compraRepository.findByUsuarioId(usuarioId);
    }

    @Override
    @Transactional
    public Compra save(Compra unaCompra) {
        return compraRepository.save(unaCompra);
    }

    @Override
    @Transactional
    public Optional<Compra> delete(Compra unaCompra) {
        Optional<Compra> compraOptional = compraRepository.findById(unaCompra.getId());
        compraOptional.ifPresent(compraDb -> {
            compraRepository.delete(unaCompra);
        });
        return compraOptional;
    }

    @Override
    @Transactional(readOnly = true)
    public long countCompletadas() {
        return compraRepository.countByEstado("completada");
    }
}