function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <a className="navbar-brand" href="#">Mi Página</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
            data-bs-target="#menuNav">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="menuNav">
            <ul className="navbar-nav ms-auto">
            <li className="nav-item">
                <a className="nav-link active" href="#">Home</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="#">Somos</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="#">Contacto</a>
            </li>
            </ul>
        </div>
                </div>
        </nav>
);
}
export default Header;