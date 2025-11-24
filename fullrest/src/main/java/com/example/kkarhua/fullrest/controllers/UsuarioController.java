package com.example.kkarhua.fullrest.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import com.example.kkarhua.fullrest.entities.Usuario;
import com.example.kkarhua.fullrest.services.UsuarioServices;
import jakarta.validation.Valid;

@Controller
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioServices usuarioServices;

    @GetMapping
    public String verUsuarios(Model model) {
        List<Usuario> usuarios = usuarioServices.findByAll();
        model.addAttribute("usuarios", usuarios);
        return "usuarios/lista";
    }

    @GetMapping("/nuevo")
    public String formularioNuevo(Model model) {
        model.addAttribute("usuario", new Usuario());
        return "usuarios/formulario";
    }

    @GetMapping("/editar/{id}")
    public String formularioEditar(@PathVariable Long id, Model model) {
        Usuario usuario = usuarioServices.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        model.addAttribute("usuario", usuario);
        return "usuarios/formulario";
    }

    @PostMapping("/guardar")
    public String guardar(@Valid Usuario usuario, BindingResult result, Model model) {
        if (result.hasErrors()) {
            return "usuarios/formulario";
        }

        // Validar email único
        if (usuario.getId() == null && usuarioServices.existsByEmail(usuario.getEmail())) {
            model.addAttribute("errorEmail", "El email ya está registrado");
            return "usuarios/formulario";
        }

        usuarioServices.save(usuario);
        return "redirect:/usuarios";
    }

    @GetMapping("/eliminar/{id}")
    public String eliminar(@PathVariable Long id) {
        Usuario usuario = new Usuario();
        usuario.setId(id);
        usuarioServices.delete(usuario);
        return "redirect:/usuarios";
    }
}