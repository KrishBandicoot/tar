import { Navbar } from "../../componentes/Navbar/Navbar";
import { Footer } from "../../componentes/Footer/Footer";
import { Productos } from "../../componentes/Productos/Productos";

export function ListaProductos(){

    return (
        <>
            <Navbar/>
            <div className="container">
                <Productos/>
            </div>
            <Footer />
        </>
    )
}