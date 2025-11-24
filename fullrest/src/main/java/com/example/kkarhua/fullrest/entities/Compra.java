package com.example.kkarhua.fullrest.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "compras")
public class Compra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnoreProperties({"contrasena", "envios"})
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "envio_id", nullable = false)
    private Envio envio;

    @Column(nullable = false)
    private Integer subtotal; // en pesos

    @Column(nullable = false)
    private Integer iva; // 19% en pesos

    @Column(nullable = false)
    private Integer total; // subtotal + iva

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String detalleProductos; // JSON de los productos comprados

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCompra;

    @Column(nullable = false)
    private String estado; // "completada", "pendiente", "cancelada"

    public Compra() {
    }

    public Compra(Usuario usuario, Envio envio, Integer subtotal, Integer iva, 
                  Integer total, String detalleProductos) {
        this.usuario = usuario;
        this.envio = envio;
        this.subtotal = subtotal;
        this.iva = iva;
        this.total = total;
        this.detalleProductos = detalleProductos;
        this.estado = "completada";
    }

    @PrePersist
    protected void onCreate() {
        this.fechaCompra = LocalDateTime.now();
        if (this.estado == null || this.estado.isEmpty()) {
            this.estado = "completada";
        }
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Envio getEnvio() {
        return envio;
    }

    public void setEnvio(Envio envio) {
        this.envio = envio;
    }

    public Integer getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Integer subtotal) {
        this.subtotal = subtotal;
    }

    public Integer getIva() {
        return iva;
    }

    public void setIva(Integer iva) {
        this.iva = iva;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public String getDetalleProductos() {
        return detalleProductos;
    }

    public void setDetalleProductos(String detalleProductos) {
        this.detalleProductos = detalleProductos;
    }

    public LocalDateTime getFechaCompra() {
        return fechaCompra;
    }

    public void setFechaCompra(LocalDateTime fechaCompra) {
        this.fechaCompra = fechaCompra;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "Compra [id=" + id + ", usuarioId=" + (usuario != null ? usuario.getId() : null) + 
               ", envioId=" + (envio != null ? envio.getId() : null) + 
               ", total=" + total + ", estado=" + estado + 
               ", fechaCompra=" + fechaCompra + "]";
    }
}