package com.example.kkarhua.fullrest.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "envios")
public class Envio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La calle es obligatoria")
    @Size(min = 3, max = 200, message = "La calle debe tener entre 3 y 200 caracteres")
    @Column(nullable = false, length = 200)
    private String calle;

    @Size(max = 50, message = "El departamento no puede tener más de 50 caracteres")
    @Column(length = 50)
    private String departamento; // Opcional

    @NotBlank(message = "La región es obligatoria")
    @Size(max = 100, message = "La región no puede tener más de 100 caracteres")
    @Column(nullable = false, length = 100)
    private String region;

    @NotBlank(message = "La comuna es obligatoria")
    @Size(max = 100, message = "La comuna no puede tener más de 100 caracteres")
    @Column(nullable = false, length = 100)
    private String comuna;

    @Size(max = 500, message = "Las indicaciones no pueden tener más de 500 caracteres")
    @Column(length = 500)
    private String indicaciones; // Opcional

    // Relación ManyToOne con Usuario (obligatorio)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnoreProperties({"contrasena", "envios"})
    private Usuario usuario;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(nullable = false)
    private LocalDateTime fechaActualizacion;

    public Envio() {
    }

    public Envio(String calle, String departamento, String region, String comuna, 
                 String indicaciones, Usuario usuario) {
        this.calle = calle;
        this.departamento = departamento;
        this.region = region;
        this.comuna = comuna;
        this.indicaciones = indicaciones;
        this.usuario = usuario;
    }

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCalle() {
        return calle;
    }

    public void setCalle(String calle) {
        this.calle = calle;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getComuna() {
        return comuna;
    }

    public void setComuna(String comuna) {
        this.comuna = comuna;
    }

    public String getIndicaciones() {
        return indicaciones;
    }

    public void setIndicaciones(String indicaciones) {
        this.indicaciones = indicaciones;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }

    @Override
    public String toString() {
        return "Envio [id=" + id + ", calle=" + calle + ", departamento=" + departamento + 
               ", region=" + region + ", comuna=" + comuna + ", indicaciones=" + indicaciones + 
               ", usuarioId=" + (usuario != null ? usuario.getId() : null) + 
               ", fechaCreacion=" + fechaCreacion + "]";
    }
}