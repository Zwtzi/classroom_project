import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout2 from '../components/Layout2';
import '../styles/Dashboard.css';

const Dashboard2 = () => {
  const [classes, setClasses] = useState([]);
  const [showMenu, setShowMenu] = useState(null);
  const navigate = useNavigate();  // Añadido para la navegación

  const addClass = (newClass) => {
    setClasses([...classes, newClass]);
  };

  const toggleMenu = (index) => {
    setShowMenu(showMenu === index ? null : index);
  };

  const deleteClass = (index) => {
    setClasses(classes.filter((_, i) => i !== index));
    setShowMenu(null);
  };

  const handleClassClick = (classCode) => {
    navigate(`/class/${classCode}`);  // Redirigir a la vista de la clase
  };

  return (
    <Layout2 addClass={addClass}>
      <div className="dashboard-container">
        {classes.map((classItem, index) => (
          <div key={index} className="class-card" onClick={() => handleClassClick(classItem.code)}>  {/* Clase con click */}
            <div className="card-header">
              <h3>{classItem.name}</h3>
              <span 
                className="menu-icon" 
                onClick={() => toggleMenu(index)}
              >
                &#x22EE;
              </span>
            </div>
            <p>{classItem.description}</p>
            {showMenu === index && (
              <div className="menu-modal">
                <button className="cancel-button" onClick={() => deleteClass(index)}>
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
