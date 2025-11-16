package com.example.kkarhua.fullrest.services;
import java.util.List;
import java.util.Optional;

import com.example.kkarhua.fullrest.entities.Producto;

public interface ProductoServices {

    List<Producto> findByAll();                     //devuelve un iterable con toda la informacion de la entidad

    Optional<Producto> findById(Long id);           //devuelve un objeto a través de su id 

    Producto save(Producto unProducto);

    Optional<Producto> delete(Producto unProducto);



}
