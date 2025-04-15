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
    const [usuarioId] = useState(1);
    const [entregas, setEntregas] = useState({});

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/clases/${classId}`)
            .then(response => {
                setClase(response.data);
                const codigoGrupo = response.data.codigo_grupo;

                axios.get(`http://127.0.0.1:8000/api/clases/${codigoGrupo}/avisos`)
                    .then(resAvisos => setAvisos(resAvisos.data))
                    .catch(console.error);

                axios.get(`http://127.0.0.1:8000/api/clases/${codigoGrupo}/temas`)
                    .then(resTemas => setMateriales(resTemas.data))
                    .catch(console.error);

                axios.get(`http://127.0.0.1:8000/api/clases/${codigoGrupo}/tareas`)
                    .then(async resTareas => {
                        const tareasData = resTareas.data;
                        const entregasMap = {};

                        for (const tarea of tareasData) {
                            try {
                                const resEntrega = await axios.get('http://127.0.0.1:8000/api/entregas/por-tarea', {
                                    params: { tarea_id: tarea.id, alumno_id: usuarioId }
                                });
                                entregasMap[tarea.id] = resEntrega.data;
                            } catch {
                                entregasMap[tarea.id] = null;
                            }
                        }

                        setTareas(tareasData);
                        setEntregas(entregasMap);
                    })
                    .catch(console.error);
            })
            .catch(console.error);
    }, [classId, usuarioId]);

    const handleArchivoChange = async (e, entregaId) => {
        const archivo = e.target.files[0];
        if (!archivo) return;

        const formData = new FormData();
        formData.append("archivo", archivo);

        try {
            await axios.post(`http://127.0.0.1:8000/api/entregas/${entregaId}/archivo`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Archivo entregado correctamente 🎉");
            window.location.reload();
        } catch {
            alert("Error al entregar el archivo");
        }
    };

    if (!clase) {
        return (
            <Layout>
                <div className="class-view"><h2>Cargando clase...</h2></div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="class-view">
                <div className="class-banner">
                    <div className="class-info">
                        <h1>{clase.nombre}</h1>
                        <p><strong>Código del grupo:</strong> {clase.codigo_grupo}</p>
                        <p><strong>Descripción:</strong> {clase.descripcion ?? "No hay descripción."}</p>
                    </div>
                </div>

                <div className="card">
                    <h2 style={{ textAlign: 'left' }}>Avisos</h2>
                    {avisos.length > 0 ? (
                        <ul className="avisos-list">
                            {avisos.map(aviso => (
                                <li key={aviso.id}>{aviso.contenido}</li>
                            ))}
                        </ul>
                    ) : <p>No hay avisos todavía.</p>}
                </div>

                <div className="card temas-section">
                    <h2 style={{ textAlign: 'left' }}>Temas</h2>
                    {materiales.length > 0 ? (
                        <ul>
                            {materiales.map(material => (
                                <li key={material.id}><strong>{material.nombre}</strong></li>
                            ))}
                        </ul>
                    ) : <p>No hay materiales todavía.</p>}
                </div>

                <div className="card tareas-section">
                    <h2 style={{ textAlign: 'left' }}>Tareas</h2>
                    {tareas.length > 0 ? (
                        <ul>
                            {tareas.map(tarea => {
                                const entrega = entregas[tarea.id];
                                return (
                                    <li key={tarea.id}>
                                        <strong>{tarea.titulo}</strong>
                                        <p><strong>Tema:</strong> {tarea.tema ? tarea.tema.nombre : 'Sin tema'}</p>
                                        <em>{tarea.instrucciones}</em>

                                        <br></br>
                                        <br></br>
                                        <hr></hr>

                                        <p><strong>Fecha límite:</strong> {new Date(tarea.fecha_limite).toLocaleString()}</p>
                                        {entrega ? (
                                            <div style={{ marginTop: '10px' }}>
                                                {entrega.archivo ? (
                                                    <>
                                                        <p><strong>Ya entregaste:</strong> <a href={`http://127.0.0.1:8000/storage/${entrega.archivo}`} target="_blank" rel="noopener noreferrer">Ver archivo</a></p>
                                                        <p><strong>Entregado en:</strong> {new Date(entrega.entregado_en).toLocaleString()}</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <input type="file" onChange={(e) => handleArchivoChange(e, tarea.id)} />
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="entrega-container">
                                                <label className="file-label">Añade tu trabajo:</label>
                                                <input type="file" className="file-input" onChange={(e) => handleArchivoChange(e, tarea.id)} />
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : <p>No hay tareas todavía.</p>}
                </div>
            </div>
        </Layout>
    );
};

export default ClassViewStudent;
