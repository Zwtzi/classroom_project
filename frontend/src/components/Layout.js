import React, { useState, useEffect, useRef } from 'react';
import {FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/Layout.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    console.log("Cerrar sesión");
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleNavigateToDashboard = () => {
    navigate('/student/Dashboard');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-brand" onClick={handleNavigateToDashboard}>CLASSROOM - ALUMNO</h1>
          <div className="navbar-links">

            <FaUserCircle
              className="menu-icon user-icon"
              onClick={toggleMenu}
              size={34}
              color="#ffffff"
              style={{ cursor: 'pointer' }}
            />
            {isMenuOpen && (
              <div className="user-menu" ref={menuRef}>
                <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
              </div>
            )}
          </div>
        </div>
      </nav>
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
