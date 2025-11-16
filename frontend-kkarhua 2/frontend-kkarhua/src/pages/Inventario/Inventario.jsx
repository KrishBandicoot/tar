import { Navbar } from "../../componentes/Navbar/Navbar";
import { Productos } from "../../componentes/Productos/Productos";

export function Inventario() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="container-fluid px-0">
        <Navbar />
      </div>
      <div className="container py-4">
        <Productos />
      </div>
    </div>
  )
}