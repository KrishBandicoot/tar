import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

export function Sidebar({ menuItems, currentPath }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
      <div className="sidebar-header">
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <i className={`bi bi-${sidebarOpen ? 'chevron-left' : 'chevron-right'}`}></i>
        </button>
        {sidebarOpen && <h3 className="sidebar-brand">Kkarhua</h3>}
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item, idx) => (
          <div
            key={idx}
            className={`nav-item ${item.path === currentPath ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <i className={`bi ${item.icon}`}></i>
            {sidebarOpen && <span>{item.label}</span>}
          </div>
        ))}
      </nav>
    </aside>
  );
}