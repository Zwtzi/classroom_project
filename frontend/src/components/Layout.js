import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Layout.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleNavigateToDashboard = () => {
    navigate('/student/Dashboard');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-brand" onClick={handleNavigateToDashboard}>CLASSROOM</h1>
          <div className="navbar-links">

            {/* SVG de agregar clase */}
            <svg
              className="more-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 70 70"
              fill="none"
              onClick={() => setIsModalOpen(true)}
              style={{ cursor: 'pointer' }}
            >
              <rect width="70" height="70" rx="20" fill="#FAFFF0" />
              <path d="M35 22L35 48" stroke="#2C943F" strokeWidth="4" strokeLinecap="round" />
              <path d="M48 35.5L22 35.5" stroke="#2C943F" strokeWidth="4" strokeLinecap="round" />
            </svg>

            {/* SVG del perfil */}
            <svg
              className="user-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 70 70"
              fill="none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ cursor: 'pointer' }}
            >
              <rect width="70" height="70" rx="20" fill="#FAFFF0" />
              <path
                d="M35.1745 35.0457C40.867 35.0457 45.4817 30.431 45.4817 24.7385C45.4817 19.0459 40.867 14.4313 35.1745 14.4313C29.482 14.4313 24.8673 19.0459 24.8673 24.7385C24.8673 30.431 29.482 35.0457 35.1745 35.0457Z"
                stroke="#2C943F"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M52.8823 53C52.8823 45.0222 44.9458 38.5699 35.1746 38.5699C25.4033 38.5699 17.4668 45.0222 17.4668 53"
                stroke="#2C943F"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {isMenuOpen && (
              <div className="user-menu" ref={menuRef}>
                <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Modal para unirse a una clase */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" ref={modalRef}>
            <h2 className="modal-title">Unirse a una clase</h2>
            <div className="form-row">
              <input
                type="text"
                placeholder="Código de la clase"
                className="styled-input long-input"
                // Aquí puedes enlazar el value/onChange con estado si deseas manejarlo
              />
            </div>
            <div className="modal-buttons">
              <button className="lacancel-button" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </button>
              <button className="create-button">
                Unirse
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <div className="content">
        <Navbar />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
