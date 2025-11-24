package com.example.kkarhua.fullrest.services;

import java.util.List;
import java.util.Optional;
import com.example.kkarhua.fullrest.entities.Compra;

public interface CompraServices {
    List<Compra> findByAll();
    Optional<Compra> findById(Long id);
    List<Compra> findByUsuarioId(Long usuarioId);
    Compra save(Compra unaCompra);
    Optional<Compra> delete(Compra unaCompra);
    long countCompletadas();
}