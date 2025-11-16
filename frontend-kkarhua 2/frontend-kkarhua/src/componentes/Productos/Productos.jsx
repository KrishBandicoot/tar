import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Productos.css'

export function Productos() {
  const [productos, setProductos] = useState([])

    useEffect(() => {
        fetch('http://localhost:8080/productos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor')
            }
            return response.json()
        })
        .then(data => {
            console.log("Respuesta del backend:",data)
            setProductos(data)
        })
        .catch(error => {
            console.error('Error al obtener las categorias:', error)
        });
    }, []);
    return (
        <>
            <div className="container mi tabla">
                <h3 style={({ marginBottom: '20px'})}>Inventario de productos</h3>
                <div className="row mb-3">
                    <div className="col-12 text-end">
                        <Link className="btn btn-primary" to="/crear-producto">
                            Crear nuevo producto
                        </Link>
                    </div>
                </div>

                <div className="row">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Id Producto</th>
                                <th>Nombre Producto</th>
                                <th>Descripcion</th>
                                <th>Precio Producto</th>
                                <th>Editar Producto</th>
                                <th>Eliminar Producto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((prod) => (
                                <tr key={prod.id}>
                                    <td>{prod.id}</td>
                                    <td>{prod.nombre}</td>
                                    <td>{prod.descripcion}</td>
                                    <td>{prod.precio}</td>
                                    <td><Link className="nav-link active enlaceEdit" to="/">Editar</Link></td>
                                    <td><Link className="nav-link active enlaceDel" to="/">Eliminar</Link></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}