import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaPlus } from 'react-icons/fa';
import '../styles/Layout.css';

const Navbar = ({ addClass }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Estados para los datos del formulario
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [classCode, setClassCode] = useState('');
  const [cuatrimestre, setCuatrimestre] = useState('');
  const [error, setError] = useState('');

  // Obtener los datos del usuario desde localStorage
  const [userData, setUserData] = useState(null);

  const menuRef = useRef(null);
  const optionsRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  // Cargar los datos del usuario desde localStorage cuando se monta el componente
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 🔹 Función para crear la clase en el backend
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
      profesor_id: userData?.id, // Usar el id del usuario que está logueado
    };

    try {
      const response = await fetch('http://localhost:8000/api/clases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClass),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error en la API:', data);
        throw new Error(data.message || 'Error al crear la clase');
      }

      console.log('Clase creada:', data.clase);
      if (typeof addClass === 'function') {
        addClass(data.clase); // Asegurar que `addClass` es una función antes de llamarla
      } else {
        console.error('addClass no es una función:', addClass);
      }

      // Limpiar el formulario
      setClassName('');
      setDescription('');
      setClassCode('');
      setCuatrimestre('');
      setIsCreateModalOpen(false);
      setError('');

      // Redirigir al dashboard
      navigate('/teacher/Dashboard2');
      window.location.reload();
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setError('No se pudo crear la clase. Inténtalo de nuevo.');
    }
  };

  const handleNavigateToDashboard = () => {
    navigate('/teacher/Dashboard2');
    window.location.reload();
  };

  const handleLogout = () => {
    // Eliminar los datos del usuario de localStorage y redirigir al login
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-brand" onClick={handleNavigateToDashboard}>
            CLASSROOM
          </h1>
          <div className="navbar-links">
            <FaPlus className="menu-icon plus-icon" onClick={() => setIsOptionsOpen(!isOptionsOpen)} />
            {isOptionsOpen && (
              <div className="options-menu" ref={optionsRef}>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(true);
                    setIsOptionsOpen(false);
                  }}
                >
                  Crear una clase
                </button>
              </div>
            )}
            <FaUserCircle className="menu-icon user-icon" onClick={() => setIsMenuOpen(!isMenuOpen)} />
            {isMenuOpen && userData && (
              <div className="user-menu" ref={menuRef}>
                <p>Hola, {userData.nombre}</p> {/* Mostrar el nombre del usuario */}
                <button className="logout-button" onClick={handleLogout}>
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
            <h2>Crear una clase</h2>
            <input
              type="text"
              placeholder="Nombre de la clase"
              className="class-input"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Descripción"
              className="class-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="text"
              placeholder="Código del grupo"
              className="class-input"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
            />
            <input type="text" value="Ingeniería en Tecnologías de la Información" className="class-input" readOnly />
            <input
              type="text"
              placeholder="Cuatrimestre"
              className="class-input"
              value={cuatrimestre}
              onChange={(e) => setCuatrimestre(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="cancel-button" onClick={() => setIsCreateModalOpen(false)}>
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
