import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Revisar.css';

const Revisar = () => {
  const [entregas, setEntregas] = useState([]);
  const [calificaciones, setCalificaciones] = useState({});

  const handleCalificacionChange = (alumnoId, nuevaCalificacion) => {
    setCalificaciones((prev) => ({
      ...prev,
      [alumnoId]: nuevaCalificacion,
    }));
  };

  const handleActualizarCalificacion = (id) => {
    const calificacion = calificaciones[id];
    if (calificacion) {
      axios
        .patch(`http://127.0.0.1:8000/api/entregas/${id}`, {
          calificacion,
        })
        .then((response) => {
          console.log('Calificación actualizada:', response.data);
        })
        .catch((error) => {
          console.error('Error al actualizar la calificación:', error);
        });
    }
  };

  useEffect(() => {
    axios.get('http://localhost:8000/api/entregas')
      .then((response) => {
        setEntregas(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener las entregas:', error);
      });
  }, []);

  return (
    <div className="entregas-section">
      <h2>Revisar Entregas</h2>
      <div className="entregas-tabla-container">
        <table className="entregas-tabla">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Tarea</th>
              <th>Clase</th>
              <th>Archivo</th>
              <th>Comentario</th>
              <th>Calificación</th>
              <th>Revisión</th>
            </tr>
          </thead>
          <tbody>
            {entregas.length === 0 ? (
              <tr>
                <td colSpan="7" className="texto-centrado">No hay entregas registradas.</td>
              </tr>
            ) : (
              entregas.map((entrega) => (
                <tr key={entrega.id}>
                  <td>{entrega.alumno?.nombre || entrega.alumno_id}</td>
                  <td>{entrega.tarea?.titulo || entrega.tarea_id}</td>
                  <td>{entrega.clase?.nombre || entrega.clase_id}</td>
                  <td>
                    {entrega.archivo ? (
                      <a
                        href={`http://localhost:8000/storage/${entrega.archivo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="archivo-link"
                      >
                        Ver archivo
                      </a>
                    ) : 'No enviado'}
                  </td>
                  <td>{entrega.comentario || '-'}</td>
                  <td>{entrega.calificacion != null ? `${entrega.calificacion}%` : 'Sin calificar'}</td>
                  <td>
                    <div className="accion-calificacion">
                      <input
                        type="number"
                        value={calificaciones[entrega.id] || ''}
                        onChange={(e) => handleCalificacionChange(entrega.id, e.target.value)}
                        placeholder="Nueva calificación"
                      />
                      <button
                        onClick={() => handleActualizarCalificacion(entrega.id)}
                        className="submit-button"
                      >
                        Actualizar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Revisar;
