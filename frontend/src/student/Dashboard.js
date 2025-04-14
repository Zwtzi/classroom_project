import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [clases, setClases] = useState([]);
  const [alumnoId, setAlumnoId] = useState(null);

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

  return (
    <Layout>
      <div className="dashboard-container">
        {clases.length > 0 ? (
          clases.map((clase, index) => (
            <Link 
              to={`/student/class/${clase.id}`} 
              key={index} 
              className="class-card"
            >
              <div className="card-content">
                <div className="text-content">
                  <h3>{clase.nombre}</h3>
                  <p>{clase.descripcion}</p>
                </div>
                <svg className="usercard-icon" xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 129 129" fill="none">
                  <circle cx="64.5" cy="64.5" r="64.5" fill="#87F29B"/>
                  <path d="M64.7077 61.7418C77.339 61.7418 87.5786 51.5022 87.5786 38.8709C87.5786 26.2397 77.339 16 64.7077 16C52.0765 16 41.8368 26.2397 41.8368 38.8709C41.8368 51.5022 52.0765 61.7418 64.7077 61.7418Z" stroke="#2C943F" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M104 101.581C104 83.8791 86.3893 69.5619 64.7077 69.5619C43.0261 69.5619 25.4155 83.8791 25.4155 101.581" stroke="#2C943F" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          ))
        ) : (
          <p>{alumnoId === null ? "Cargando..." : "No estás inscrito en ninguna clase."}</p>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
