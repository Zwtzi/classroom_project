import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Eliminar Link si no se usa
import { FaUserCircle, FaPlus } from 'react-icons/fa';
import '../styles/Layout.css';

const Navbar = ({ addClass }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const menuRef = useRef(null);
  const optionsRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setIsOptionsOpen(false);
    }
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsCreateModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCreateClass = () => {
    if (className && description) {
      addClass({ name: className, description });
      setClassName('');
      setDescription('');
      setIsCreateModalOpen(false);
    }
  };

  // Manejador de clic para redirigir al Dashboard.js
  const handleNavigateToDashboard = () => {
    navigate('/teacher/Dashboard2'); // Asegúrate de que esta ruta esté definida en tu React Router
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-brand" onClick={handleNavigateToDashboard}>CLASSROOM</h1>
          <div className="navbar-links">
            <FaPlus className="menu-icon plus-icon" onClick={() => setIsOptionsOpen(!isOptionsOpen)} />
            {isOptionsOpen && (
              <div className="options-menu" ref={optionsRef}>
                <button onClick={() => { setIsCreateModalOpen(true); setIsOptionsOpen(false); }}>Crear una clase</button>
              </div>
            )}
            <FaUserCircle className="menu-icon user-icon" onClick={() => setIsMenuOpen(!isMenuOpen)} />
            {isMenuOpen && (
              <div className="user-menu" ref={menuRef}>
                <button className="logout-button" onClick={() => navigate('/')}>Cerrar sesión</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" ref={modalRef}>
            <h2>Crear una clase</h2>
            <input type="text" placeholder="Nombre de la clase" className="class-input" value={className} onChange={e => setClassName(e.target.value)} />
            <input type="text" placeholder="Descripción" className="class-input" value={description} onChange={e => setDescription(e.target.value)} />
            <input type="text" placeholder="Código del grupo" className="class-input" />
            <input type="text" value="Ingeniería en Tecnologías de la Información" className="class-input" readOnly />
            <input type="text" placeholder="Cuatrimestre" className="class-input" />
            <div className="modal-buttons">
              <button className="cancel-button" onClick={() => setIsCreateModalOpen(false)}>Cancelar</button>
              <button className="create-button" onClick={handleCreateClass}>Crear</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Layout2 = ({ children, addClass }) => {
  return (
    <div className="layout">
      <div className="content">
        <Navbar addClass={addClass} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout2;
