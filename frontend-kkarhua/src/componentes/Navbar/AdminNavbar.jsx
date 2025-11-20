import { Link } from 'react-router-dom';

export function AdminNavbar(){
    return (
        <nav className="navbar navbar-expand-sm bg-dark navbar-dark" 
             style={{ 
                 width: '100vw', 
                 marginLeft: 'calc(-50vw + 50%)', 
                 marginRight: 'calc(-50vw + 50%)',
                 backgroundColor: '#1a1a1a'
             }}>
            <div className="container-fluid">
                <h3 style={{marginTop: 20, marginBottom: 20, color: "white", padding: 15}}>
                    Kkarhua
                </h3>                               
            </div>
        </nav> 
    );
}