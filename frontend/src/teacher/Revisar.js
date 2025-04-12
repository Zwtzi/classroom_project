import React, { useEffect, useState } from 'react';
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
        // Aquí deberías ajustar la URL a la correcta según tu backend
        axios.get('http://localhost:8000/api/entregas')
            .then((response) => {
                setEntregas(response.data);
            })
            .catch((error) => {
                console.error('Error al obtener las entregas:', error);
            });
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Revisar Entregas</h1>
            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2">Alumno</th>
                        <th className="border px-4 py-2">Tarea</th>
                        <th className="border px-4 py-2">Clase</th>
                        <th className="border px-4 py-2">Archivo</th>
                        <th className="border px-4 py-2">Comentario</th>
                        <th className="border px-4 py-2">Calificación</th>
                        <th className="border px-4 py-2">Actualizar</th>
                    </tr>
                </thead>
                <tbody>
                    {entregas.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center py-4">No hay entregas registradas.</td>
                        </tr>
                    ) : (
                        entregas.map((entrega) => (
                            <tr key={entrega.id}>
                                <td className="border px-4 py-2">{entrega.alumno?.nombre || entrega.alumno_id}</td>
                                <td className="border px-4 py-2">{entrega.tarea?.titulo || entrega.tarea_id}</td>
                                <td className="border px-4 py-2">{entrega.clase?.nombre || entrega.clase_id}</td>
                                <td className="border px-4 py-2">
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
                                <td className="border px-4 py-2">{entrega.comentario || '-'}</td>
                                <td className="border px-4 py-2">
                                    {entrega.calificacion != null ? `${entrega.calificacion}%` : 'Sin calificar'}
                                </td>
                                <td className="border px-4 py-2">
                                    <input
                                        type="number"
                                        value={calificaciones[entrega.id] || ''}
                                        onChange={(e) => handleCalificacionChange(entrega.id, e.target.value)}
                                        className="border px-2 py-1"
                                        placeholder="Nueva calificación"
                                    />
                                    <button
                                        onClick={() => handleActualizarCalificacion(entrega.id)}
                                        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
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
