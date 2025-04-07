import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [clases, setClases] = useState([]);
  const [alumnoId, setAlumnoId] = useState(null);

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

  return (
    <Layout>
      <div className="dashboard-content">
        <h2>Bienvenido al Dashboard</h2>
        <p>Aquí puedes ver todas las clases en las que estás inscrito:</p>
        {clases.length > 0 ? (
            <ul>
              {clases.map(clase => (
                  <li key={clase.id}>
                    <Link to={`/student/class/${clase.id}`}>
                      {clase.nombre} - {clase.codigo_grupo}
                    </Link>
                  </li>
              ))}
            </ul>
        ) : (
          <p>{alumnoId === null ? "Cargando..." : "No estás inscrito en ninguna clase."}</p>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
