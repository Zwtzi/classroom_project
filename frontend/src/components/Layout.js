import React, { useState, useEffect, useRef } from 'react'; // Importa useEffect y useRef
import { FaPlus, FaUserCircle } from 'react-icons/fa'; // Solo importamos FaPlus y FaUserCircle
import { useNavigate } from 'react-router-dom';
import '../styles/Layout.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para abrir/cerrar el menú
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para abrir/cerrar la ventana modal
  const menuRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  // Función para cerrar el menú al hacer clic fuera
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    console.log("Cerrar sesión");
    setIsMenuOpen(false);
    navigate('/'); // Redirige a la página de inicio o login
  };

  // Manejador de clic para redirigir al Dashboard.js
  const handleNavigateToDashboard = () => {
    navigate('/student/Dashboard'); // Asegúrate de que esta ruta esté definida en tu React Router
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-brand" onClick={handleNavigateToDashboard}>CLASSROOM</h1>
          <div className="navbar-links">
            <FaPlus className="menu-icon plus-icon" onClick={() => setIsModalOpen(true)} />
            <FaUserCircle className="menu-icon user-icon" onClick={toggleMenu} />
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
            <h2>Unirse a una clase</h2>
            <p>Ingresa el código de clase</p>
            <input type="text" placeholder="Código de clase" className="class-input" />
            <div className="modal-buttons">
              <button className="cancel-button" onClick={() => setIsModalOpen(false)}>Cancelar</button>
              <button className="join-button">Unirme</button>
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
