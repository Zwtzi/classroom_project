import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Importar useNavigate
import axios from 'axios';
import '../styles/Revisar.css';

const Revisar = () => {
    const [entregas, setEntregas] = useState([]);
    const [calificaciones, setCalificaciones] = useState({});
    const navigate = useNavigate(); // 👈 Hook para navegación

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
        // Obtener entregas y las calificaciones
        axios.get('http://localhost:8000/api/entregas')
            .then((response) => {
                setEntregas(response.data);

                // Inicializar calificaciones
                const calificacionesIniciales = response.data.reduce((acc, entrega) => {
                    acc[entrega.id] = entrega.calificacion || ''; // Asumimos que `calificacion` está en la respuesta
                    return acc;
                }, {});

                setCalificaciones(calificacionesIniciales);
            })
            .catch((error) => {
                console.error('Error al obtener las entregas:', error);
            });
    }, []);

    return (
        <div className="revisar-container">
            {/* Botón para volver */}
            <button className="revisar-back-btn" onClick={() => navigate(-1)}>
                ← Volver
            </button>

            <h1>Revisar Entregas</h1>
            <table className="revisar-table">
                <thead>
                    <tr>
                        <th>Alumno</th>
                        <th>Tarea</th>
                        <th>Clase</th>
                        <th>Archivo</th>
                        <th>Comentario</th>
                        <th>Calificación</th>
                        <th>Actualizar</th>
                    </tr>
                </thead>
                <tbody>
                    {entregas.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="revisar-empty">No hay entregas registradas.</td>
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
                                        >
                                            Ver archivo
                                        </a>
                                    ) : 'No enviado'}
                                </td>
                                <td>{entrega.comentario || '-'}</td>
                                <td>
                                    <input
                                        type="number"
                                        className="revisar-input"
                                        placeholder="Calificación"
                                        value={calificaciones[entrega.id] || ''}
                                        onChange={(e) =>
                                            handleCalificacionChange(entrega.id, e.target.value)
                                        }
                                    />
                                </td>
                                <td>
                                    <button
                                        className="revisar-btn"
                                        onClick={() => handleActualizarCalificacion(entrega.id)}
                                    >
                                        Actualizar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Revisar;
