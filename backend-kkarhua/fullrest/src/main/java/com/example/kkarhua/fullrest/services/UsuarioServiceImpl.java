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
        System.out.println("💾 UsuarioServiceImpl.save() - Guardando usuario: " + unUsuario.getEmail());
        
        // Solo encriptar la contraseña si es un usuario nuevo (ID es null)
        if (unUsuario.getId() == null) {
            System.out.println("🔐 Usuario nuevo - Encriptando contraseña");
            String contrasenaEncriptada = passwordEncoder.encode(unUsuario.getContrasena());
            unUsuario.setContrasena(contrasenaEncriptada);
        } else if (unUsuario.getContrasena() != null && 
                   !unUsuario.getContrasena().startsWith("$2a$") &&
                   !unUsuario.getContrasena().startsWith("$2b$") &&
                   !unUsuario.getContrasena().startsWith("$2y$")) {
            System.out.println("🔐 Usuario existente con contraseña sin encriptar - Encriptando");
            String contrasenaEncriptada = passwordEncoder.encode(unUsuario.getContrasena());
            unUsuario.setContrasena(contrasenaEncriptada);
        } else {
            System.out.println("✅ Contraseña ya está encriptada o no ha cambiado");
        }
        
        Usuario usuarioGuardado = usuarioRepository.save(unUsuario);
        System.out.println("✅ Usuario guardado exitosamente con ID: " + usuarioGuardado.getId());
        return usuarioGuardado;
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