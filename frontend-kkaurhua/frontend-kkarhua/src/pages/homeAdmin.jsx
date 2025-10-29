import React from 'react';
import { AdminSidebar } from '../components/AdminSidebar';

export const HomeAdmin = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <AdminSidebar />
        
        <div className="col-md-10 main-content">
          <span className="noti-icon"><i className="bi bi-bell"></i></span>
          <h1 className="mt-2 mb-4">¡Bienvenido Administrador!</h1>
          <div className="section"></div>
          <div className="section"></div>
        </div>
      </div>
    </div>
  );
};