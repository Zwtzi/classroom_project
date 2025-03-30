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
          <div key={index} className="class-card" onClick={() => handleClassClick(classItem.codigo_grupo)}>
            <div className="card-header">
              <h3>{classItem.nombre}</h3>
              <span className="menu-icon" onClick={(e) => { e.stopPropagation(); toggleMenu(index); }}>
                &#x22EE;
              </span>
            </div>
            <p>{classItem.descripcion}</p>
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
