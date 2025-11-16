package com.example.kkarhua.fullrest.repositories;

import org.springframework.data.repository.CrudRepository;
import com.example.kkarhua.fullrest.entities.Usuario;
import java.util.Optional;

public interface UsuarioRepository extends CrudRepository<Usuario, Long> {
    
    Optional<Usuario> findByEmail(String email);
    
    boolean existsByEmail(String email);
}