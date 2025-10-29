package com.example.kkarhua.fullrest.services;

import java.util.List;
import java.util.Optional;
import com.example.kkarhua.fullrest.entities.Usuario;

public interface UsuarioServices {

    List<Usuario> findByAll();

    Optional<Usuario> findById(Long id);

    Optional<Usuario> findByEmail(String email);

    Usuario save(Usuario unUsuario);

    Optional<Usuario> delete(Usuario unUsuario);

    boolean existsByEmail(String email);
}