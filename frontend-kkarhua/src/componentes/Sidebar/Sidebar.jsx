import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

export function Sidebar({ menuItems, currentPath }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Aplicar clase al body para ajustar el margen del contenido
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('sidebar-open');
      document.body.classList.remove('sidebar-collapsed');
    } else {
      document.body.classList.add('sidebar-collapsed');
      document.body.classList.remove('sidebar-open');
    }
  }, [sidebarOpen]);

  return (
    <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {menuItems.map((item, idx) => (
            <div
              key={idx}
              className={`nav-item ${item.path === currentPath ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              title={!sidebarOpen ? item.label : ''}
            >
              <i className={`bi ${item.icon}`}></i>
              {sidebarOpen && <span>{item.label}</span>}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
            title={sidebarOpen ? 'Contraer menú' : 'Expandir menú'}
          >
            <i className={`bi bi-${sidebarOpen ? 'chevron-double-left' : 'chevron-double-right'}`}></i>
            {sidebarOpen && <span>Contraer</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}