
import { Link } from 'react-router-dom';

export function Navbar(){
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light"> 
            <div className="container"> 
            <Link className="navbar-brand" to="/">Mi Página</Link> 
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"  
                data-bs-target="#menuNav"> 
               <span className="navbar-toggler-icon"></span> 
            </button> 
 
            <div className="collapse navbar-collapse" id="menuNav"> 
            <ul className="navbar-nav ms-auto"> 
                <li className="nav-item"> 
                <Link className="nav-link active" to="/">Home</Link> 
                </li> 
                <li className="nav-item"> 
                <Link className="nav-link" to="/inventario">Inventario</Link> 
                </li> 
                <li className="nav-item"> 
                <Link className="nav-link" to="/contacto">Contacto</Link> 
                </li> 
            </ul> 
            </div> 
        </div> 
     </nav> 
    );
}
