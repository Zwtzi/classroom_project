import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import '../styles/Dash.css';

const Dashboard = () => {
  const [clases, setClases] = useState([]);
  const [alumnoId, setAlumnoId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Recuperar el objeto del usuario desde localStorage
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

  const handleCardClick = (claseId) => {
    // Redirigir al usuario a la página de la clase
    navigate(`/student/class/${claseId}`);
  };

  return (
    <Layout>
      <div className="dashboard-content">
        {clases.length === 0 ? (
          <div className="welcome-message">
            <h2>Bienvenido al Dashboard</h2>
            <p>Aquí puedes ver todas las clases en las que estás inscrito:</p>
          </div>
        ) : (
          <div className="classes-cards">
            {clases.map(clase => (
              <div
                key={clase.id}
                className="class-card"
                onClick={() => handleCardClick(clase.id)}
              >
                <h3>{clase.nombre}</h3>
                <p>Cuatrimestre: {clase.cuatrimestre}</p> {/* Cambio de maestro a cuatrimestre */}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
