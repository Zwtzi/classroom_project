import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';

const ClassViewStudent = () => {
    const { classId } = useParams();
    const [clase, setClase] = useState(null);
    const [avisos, setAvisos] = useState([]);
    const [materiales, setMateriales] = useState([]);
    const [tareas, setTareas] = useState([]);
    const [usuarioId, setUsuarioId] = useState(1);
    const [entregas, setEntregas] = useState({});
    const [entregasCompletadas, setEntregasCompletadas] = useState({});

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/clases/${classId}`)
            .then(response => {
                setClase(response.data);
                const codigoGrupo = response.data.codigo_grupo;

                axios.get(`http://127.0.0.1:8000/api/clases/${codigoGrupo}/avisos`)
                    .then(resAvisos => setAvisos(resAvisos.data))
                    .catch(error => console.error("Error al cargar avisos:", error));

                axios.get(`http://127.0.0.1:8000/api/clases/${codigoGrupo}/temas`)
                    .then(resTemas => setMateriales(resTemas.data))
                    .catch(error => console.error("Error al cargar materiales:", error));

                axios.get(`http://127.0.0.1:8000/api/clases/${codigoGrupo}/tareas`)
                    .then(async resTareas => {
                        const tareasData = resTareas.data;
                        const entregasMap = {};

                        for (const tarea of tareasData) {
                            try {
                                const resEntrega = await axios.get('http://127.0.0.1:8000/api/entregas', {
                                    params: {
                                        tarea_id: tarea.id,
                                        alumno_id: usuarioId
                                    }
                                });

                                const entrega = resEntrega.data;
                                entregasMap[tarea.id] = entrega;

                                if (entrega && entrega.archivo) {
                                    setEntregasCompletadas(prev => ({
                                        ...prev,
                                        [tarea.id]: true
                                    }));
                                }
                            } catch (error) {
                                entregasMap[tarea.id] = null;
                            }
                        }

                        setTareas(tareasData);
                        setEntregas(entregasMap);
                    })
                    .catch(error => console.error("Error al cargar tareas:", error));
            })
            .catch(error => console.error("Error al cargar detalles de la clase:", error));
    }, [classId, usuarioId]);

    const handleArchivoChange = async (e, tareaId) => {
        const archivo = e.target.files[0];
        if (!archivo) return;

        const entrega = entregas[tareaId];
        console.log("Tarea ID:", tareaId);
        console.log("Entrega encontrada:", entrega);

        if (!entrega || !entrega.id) {
            console.error("ID de entrega no definido para la tarea:", tareaId);
            return;
        }

        const formData = new FormData();
        formData.append('archivo', archivo);

        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/entregas/${entrega.id}/archivo`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log('Archivo subido correctamente:', response.data);

            setEntregasCompletadas(prev => ({
                ...prev,
                [tareaId]: true,
            }));
        } catch (error) {
            console.error('Error al subir archivo:', error);
        }
    };

    if (!clase) {
        return (
            <Layout>
                <div className="class-view-content">
                    <h2>Cargando clase...</h2>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="class-view-content">
                <h2>{clase.nombre}</h2>
                <p><strong>Código del grupo:</strong> {clase.codigo_grupo}</p>
                <p><strong>Descripción:</strong> {clase.descripcion ?? "No hay descripción."}</p>

                <h3>Avisos</h3>
                {avisos.length > 0 ? (
                    <ul>
                        {avisos.map(aviso => (
                            <li key={aviso.id}>{aviso.contenido}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay avisos todavía.</p>
                )}

                <h3>Materiales</h3>
                {materiales.length > 0 ? (
                    <ul>
                        {materiales.map(material => (
                            <li key={material.id}>{material.nombre}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay materiales todavía.</p>
                )}

                <h3>Tareas</h3>
                {tareas.length > 0 ? (
                    <ul>
                        {tareas.map(tarea => {
                            const entrega = entregas[tarea.id];
                            const completada = entregasCompletadas[tarea.id];

                            return (
                                <li key={tarea.id}>
                                    <strong>{tarea.titulo}</strong><br />
                                    <em>{tarea.instrucciones}</em><br />
                                    <p><strong>Fecha límite:</strong> {new Date(tarea.fecha_limite).toLocaleString()}</p>
                                    <p><strong>Tema:</strong> {tarea.tema ? tarea.tema.nombre : 'Sin tema'}</p>

                                    {entrega ? (
                                        <div style={{ marginTop: '10px' }}>
                                            {entrega.archivo ? (
                                                <>
                                                    <p><strong>Ya entregaste:</strong> <a href={`http://127.0.0.1:8000/storage/${entrega.archivo}`} target="_blank" rel="noopener noreferrer">Ver archivo</a></p>
                                                    <p><strong>Entregado en:</strong> {new Date(entrega.entregado_en).toLocaleString()}</p>
                                                </>
                                            ) : (
                                                <>
                                                    {!completada && (
                                                        <>
                                                            <label>Subir archivo de entrega:</label>
                                                            <input type="file" onChange={(e) => handleArchivoChange(e, tarea.id)} />
                                                        </>
                                                    )}
                                                    {completada && <p style={{ color: 'green' }}>¡Tarea completada!</p>}
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <p style={{ color: 'gray' }}>No tienes asignación para esta tarea.</p>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>No hay tareas todavía.</p>
                )}
            </div>
        </Layout>
    );
};

export default ClassViewStudent;
