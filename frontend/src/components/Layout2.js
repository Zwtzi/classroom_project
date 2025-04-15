import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/Layout.css';

const Navbar = ({ addClass }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [classCode, setClassCode] = useState('');
  const [cuatrimestre, setCuatrimestre] = useState('');
  const [error, setError] = useState('');

  const [userData, setUserData] = useState(null);

  const menuRef = useRef(null);
  const optionsRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserData(user);
    }
  }, []);

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateClass = async () => {
    if (!className || !description || !classCode || !cuatrimestre) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const newClass = {
      nombre: className,
      descripcion: description,
      codigo_grupo: classCode,
      carrera: 'Ingeniería en Tecnologías de la Información',
      cuatrimestre: cuatrimestre,
      profesor_id: userData?.id,
    };

    try {
      const response = await fetch('http://localhost:8000/api/clases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClass),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Error al crear la clase');

      if (typeof addClass === 'function') {
        addClass(data.clase);
      }

      setClassName('');
      setDescription('');
      setClassCode('');
      setCuatrimestre('');
      setIsCreateModalOpen(false);
      setError('');

      navigate('/teacher/Dashboard2');
      window.location.reload();
    } catch (error) {
      setError('No se pudo crear la clase. Inténtalo de nuevo.');
      console.error('Error al crear la clase:', error);
    }
  };

  const handleNavigateToDashboard = () => {
    navigate('/teacher/Dashboard2');
    window.location.reload();
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-brand" onClick={handleNavigateToDashboard}>
            CLASSROOM - PROFESOR
          </h1>
          <div className="navbar-links">
            <FaPlus
              size={32}
              color="#ffffff"
              onClick={() => setIsOptionsOpen(!isOptionsOpen)}
              style={{ cursor: 'pointer', marginRight: '1rem' }}
            />
            {isOptionsOpen && (
              <div className="options-menu" ref={optionsRef}>
                <button onClick={() => { setIsCreateModalOpen(true); setIsOptionsOpen(false); }}>
                  Crear una clase
                </button>
              </div>
            )}

            <FaUserCircle
              size={34}
              color="#ffffff"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ cursor: 'pointer' }}
            />
            {isMenuOpen && userData && (
              <div className="user-menu" ref={menuRef}>
                <button className="logout-button" onClick={() => navigate('/')}>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" ref={modalRef}>
            <h2 className="modal-title">Crear una clase</h2>
            <div className="form-row">
              <input
                type="text"
                placeholder="Nombre de la clase"
                className="styled-input"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
              <input
                type="text"
                value="Ingeniería en Tecnologías de la Información"
                className="styled-input long-input"
                readOnly
              />
            </div>

            <div className="form-row">
              <input
                type="text"
                placeholder="Descripción"
                className="styled-input long-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="text"
                placeholder="Código del grupo"
                className="styled-input"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
              />
              <input
                type="text"
                placeholder="Cuatrimestre"
                className="styled-input"
                value={cuatrimestre}
                onChange={(e) => setCuatrimestre(e.target.value)}
              />
            </div>

            <div className="modal-buttons">
              <button className="lacancel-button" onClick={() => setIsCreateModalOpen(false)}>
                Cancelar
              </button>
              <button className="create-button" onClick={handleCreateClass}>
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Layout2 = ({ children, addClass = () => {} }) => {
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
