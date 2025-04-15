import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css'; // Asegúrate de tener los estilos de cards aquí

const Dashboard = () => {
  const [clases, setClases] = useState([]);
  const [alumnoId, setAlumnoId] = useState(null);
  const navigate = useNavigate();

  // Paleta de colores
  const cardColors = [
    '#FFB6C1', '#FF6347', '#FFD700', '#98FB98', '#AFEEEE',
    '#E6E6FA', '#D8BFD8', '#F0E68C', '#D3D3D3', '#ADD8E6',
    '#F5DEB3', '#FFA07A', '#B0E0E6', '#FFC0CB', '#87CEFA'
  ];

  // Función determinista para asignar color fijo por código
  const getColorFromCode = (code) => {
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
      hash = code.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % cardColors.length;
    return cardColors[index];
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.id && parsedUser.tipo === "Alumno") {
          setAlumnoId(parsedUser.id);
        } else {
          console.warn("El usuario no es un alumno o no tiene un ID válido.");
        }
      } catch (error) {
        console.error("Error al parsear el objeto usuario:", error);
      }
    } else {
      console.warn("No hay información de usuario en localStorage.");
    }
  }, []);

  useEffect(() => {
    if (alumnoId) {
      axios.get(`http://127.0.0.1:8000/api/alumnos/${alumnoId}/clases`)
        .then(response => {
          console.log("Clases recibidas:", response.data);
          setClases(response.data);
        })
        .catch(error => console.error("Error al obtener clases del alumno:", error));
    }
  }, [alumnoId]);

  const handleClassClick = (classId) => {
    navigate(`/student/class/${classId}`);
  };

  return (
    <Layout>
      <div className="dashboard-container">
        {clases.length > 0 ? (
          clases.map((clase, index) => (
            <div
              key={clase.id}
              className="class-card"
              style={{ backgroundColor: getColorFromCode(clase.codigo_grupo) }}
              onClick={() => handleClassClick(clase.id)}
            >
              <div className="card-content">
                <div className="text-content">
                  <h3>{clase.nombre}</h3>
                  <p>{clase.codigo_grupo}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>{alumnoId === null ? "Cargando..." : "No estás inscrito en ninguna clase."}</p>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
