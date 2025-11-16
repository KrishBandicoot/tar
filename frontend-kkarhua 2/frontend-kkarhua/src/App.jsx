import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home/Home'
import { Contacto } from './pages/Contacto/Contacto'
import { Inventario } from './pages/Inventario/Inventario'
import { CrearProducto } from './componentes/CrearProd/CrearProducto'

import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contacto' element={<Contacto />} />
        <Route path='/inventario' element={<Inventario />} />
        <Route path='/crear-producto' element={<CrearProducto />} />
      </Routes>
    </Router>
  )
}

export default App