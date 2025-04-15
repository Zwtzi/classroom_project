import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout2 from '../components/Layout2';
import '../styles/Dashboard.css';

const Dashboard2 = () => {
  const [classes, setClasses] = useState([]);
  const [showMenu, setShowMenu] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/clases');
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Error al obtener clases:', error);
      }
    };

    fetchClasses();
  }, []);

  const cardColors = [
    '#FFB6C1', '#FF6347', '#FFD700', '#98FB98', '#AFEEEE',
    '#E6E6FA', '#D8BFD8', '#F0E68C', '#D3D3D3', '#ADD8E6',
    '#F5DEB3', '#FFA07A', '#B0E0E6', '#FFC0CB', '#87CEFA'
  ];

  const getColorFromCode = (code) => {
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
      hash = code.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % cardColors.length;
    return cardColors[index];
  };

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
            style={{ backgroundColor: getColorFromCode(classItem.codigo_grupo) }}
            onClick={() => handleClassClick(classItem.codigo_grupo)}
          >
            <div className="card-content">
              <div className="text-content">
                <h3>{classItem.nombre}</h3>
                <p>{classItem.descripcion}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout2>
  );
};

export default Dashboard2;
