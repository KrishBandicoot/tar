package com.example.kkarhua.fullrest.services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.kkarhua.fullrest.entities.Envio;
import com.example.kkarhua.fullrest.repositories.EnvioRepository;

@Service
public class EnvioServiceImpl implements EnvioServices {

    @Autowired
    private EnvioRepository envioRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Envio> findByAll() {
        return (List<Envio>) envioRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Envio> findById(Long id) {
        return envioRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Envio> findByUsuarioId(Long usuarioId) {
        return envioRepository.findByUsuarioId(usuarioId);
    }

    @Override
    @Transactional
    public Envio save(Envio unEnvio) {
        return envioRepository.save(unEnvio);
    }

    @Override
    @Transactional
    public Optional<Envio> delete(Envio unEnvio) {
        Optional<Envio> envioOptional = envioRepository.findById(unEnvio.getId());
        envioOptional.ifPresent(envioDb -> {
            envioRepository.delete(unEnvio);
        });
        return envioOptional;
    }
}