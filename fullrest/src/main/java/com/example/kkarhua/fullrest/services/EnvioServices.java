package com.example.kkarhua.fullrest.services;

import java.util.List;
import java.util.Optional;
import com.example.kkarhua.fullrest.entities.Envio;

public interface EnvioServices {

    List<Envio> findByAll();

    Optional<Envio> findById(Long id);
    
    List<Envio> findByUsuarioId(Long usuarioId);

    Envio save(Envio unEnvio);

    Optional<Envio> delete(Envio unEnvio);
}