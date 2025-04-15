import React, { useEffect, useState } from 'react';
import Layout2 from '../components/Layout2'; 
import '../styles/Revisar.css';
import axios from 'axios';

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
        <Layout2>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Revisar Entregas</h1>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr className="table-header">
                                <th>Alumno</th>
                                <th>Tarea</th>
                                <th>Clase</th>
                                <th>Archivo</th>
                                <th>Calificación</th>
                                <th>Actualizar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entregas.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">No hay entregas registradas.</td>
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
                                                    className="text-blue-600 underline"
                                                >
                                                    Ver archivo
                                                </a>
                                            ) : 'No enviado'}
                                        </td>
                                        <td>
                                            {entrega.calificacion != null ? `${entrega.calificacion}%` : 'Sin calificar'}
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={calificaciones[entrega.id] || ''}
                                                onChange={(e) => handleCalificacionChange(entrega.id, e.target.value)}
                                                className="input-field"
                                                placeholder="Nueva calificación"
                                            />
                                            <button
                                                onClick={() => handleActualizarCalificacion(entrega.id)}
                                                className="button mt-2"
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
            </div>
        </Layout2>
    );
};

export default Revisar;
