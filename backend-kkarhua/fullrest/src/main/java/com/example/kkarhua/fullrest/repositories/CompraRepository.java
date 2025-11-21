package com.example.kkarhua.fullrest.repositories;

import org.springframework.data.repository.CrudRepository;
import com.example.kkarhua.fullrest.entities.Compra;
import java.util.List;

public interface CompraRepository extends CrudRepository<Compra, Long> {
    List<Compra> findByUsuarioId(Long usuarioId);
    long countByEstado(String estado);
}