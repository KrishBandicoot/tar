package com.example.kkarhua.fullrest.repositories;

import org.springframework.data.repository.CrudRepository;
import com.example.kkarhua.fullrest.entities.Envio;
import java.util.List;

public interface EnvioRepository extends CrudRepository<Envio, Long> {
    
    // Buscar todos los envíos de un usuario específico
    List<Envio> findByUsuarioId(Long usuarioId);
    
    // Contar envíos de un usuario
    long countByUsuarioId(Long usuarioId);
}