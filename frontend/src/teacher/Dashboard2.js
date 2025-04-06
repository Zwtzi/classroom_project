import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout2 from '../components/Layout2';
import '../styles/Dashboard.css';

const Dashboard2 = () => {
  const [classes, setClasses] = useState([]);
  const [showMenu, setShowMenu] = useState(null);
  const navigate = useNavigate();

  // Función para obtener las clases desde la API
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/clases'); // Ajusta la URL según tu backend
        const data = await response.json();
        setClasses(data); // Guarda las clases en el estado
      } catch (error) {
        console.error('Error al obtener clases:', error);
      }
    };

    fetchClasses();
  }, []); // Se ejecuta una vez al montar el componente

  const toggleMenu = (index) => {
    setShowMenu(showMenu === index ? null : index);
  };

  const handleClassClick = (classCode) => {
    navigate(`/class/${classCode}`);
  };

  return (
    <Layout2>
      <div className="dashboard-container">
        {classes.map((classItem, index) => (
          <div 
            key={index} 
            className="class-card" 
            onClick={() => handleClassClick(classItem.codigo_grupo)}
          >
            <div className="card-content">
              <div className="text-content">
                <h3>{classItem.nombre}</h3>
                <p>{classItem.descripcion}</p>
              </div>
              <svg className="usercard-icon" xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 129 129" fill="none">
                <circle cx="64.5" cy="64.5" r="64.5" fill="#87F29B"/>
                <path d="M64.7077 61.7418C77.339 61.7418 87.5786 51.5022 87.5786 38.8709C87.5786 26.2397 77.339 16 64.7077 16C52.0765 16 41.8368 26.2397 41.8368 38.8709C41.8368 51.5022 52.0765 61.7418 64.7077 61.7418Z" stroke="#2C943F" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M104 101.581C104 83.8791 86.3893 69.5619 64.7077 69.5619C43.0261 69.5619 25.4155 83.8791 25.4155 101.581" stroke="#2C943F" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span 
              className="menu-icon" 
              onClick={(e) => { 
                e.stopPropagation(); 
                toggleMenu(index); 
              }}
            >
              &#x22EE;
            </span>
            {showMenu === index && (
              <div className="menu-modal">
                <button className="cancel-button">
                  Cancelar Registro
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Layout2>
  );
};

export default Dashboard2;
