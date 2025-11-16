import { useState } from 'react'
import './App.css'
import Header from './componentes/Header.jsx'
import{ HelloWorld } from './componentes/HelloWorld.jsx'
import { Productos } from './componentes/Productos.jsx'


function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <Header />
      <HelloWorld user='Cachupin' id='1'/>
      <Productos />
    </>
  )
}

export default App
