package com.example.kkarhua.fullrest.services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.kkarhua.fullrest.entities.Usuario;
import com.example.kkarhua.fullrest.repositories.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UsuarioServiceImpl implements UsuarioServices {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> findByAll() {
        return (List<Usuario>) usuarioRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> findById(Long id) {
        return usuarioRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Override
    @Transactional
    public Usuario save(Usuario unUsuario) {
        // Si es un nuevo usuario o la contraseña ha sido modificada, encriptarla
        if (unUsuario.getId() == null || !unUsuario.getContrasena().startsWith("$2a$")) {
            String contrasenaEncriptada = passwordEncoder.encode(unUsuario.getContrasena());
            unUsuario.setContrasena(contrasenaEncriptada);
        }
        return usuarioRepository.save(unUsuario);
    }

    @Override
    @Transactional
    public Optional<Usuario> delete(Usuario unUsuario) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(unUsuario.getId());
        usuarioOptional.ifPresent(usuarioDb -> {
            usuarioRepository.delete(unUsuario);
        });
        return usuarioOptional;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }
}