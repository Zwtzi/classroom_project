import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import '../styles/ClassRoom.css';

const ClassViewStudent = () => {
    const { classId } = useParams();
    const [clase, setClase] = useState(null);
    const [avisos, setAvisos] = useState([]);
    const [materiales, setMateriales] = useState([]);
    const [tareas, setTareas] = useState([]);  // Agregamos el estado para las tareas

    useEffect(() => {
        // Cargar detalles de la clase
        axios.get(`http://127.0.0.1:8000/api/clases/${classId}`)
            .then(response => {
                setClase(response.data);

                // Luego cargar avisos y materiales usando el código del grupo
                const codigoGrupo = response.data.codigo_grupo;

                // Cargar avisos
                axios.get(`http://127.0.0.1:8000/api/clases/${codigoGrupo}/avisos`)
                    .then(resAvisos => setAvisos(resAvisos.data))
                    .catch(error => console.error("Error al cargar avisos:", error));

                // Cargar materiales
                axios.get(`http://127.0.0.1:8000/api/clases/${codigoGrupo}/temas`)
                    .then(resTemas => setMateriales(resTemas.data))
                    .catch(error => console.error("Error al cargar materiales:", error));

                // Cargar tareas
                axios.get(`http://127.0.0.1:8000/api/clases/${codigoGrupo}/tareas`)
                    .then(resTareas => setTareas(resTareas.data))  // Almacenamos las tareas en el estado
                    .catch(error => console.error("Error al cargar tareas:", error));
            })
            .catch(error => console.error("Error al cargar detalles de la clase:", error));
    }, [classId]);

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
            <div className="class-view">
                <div className="class-banner">
                    <div className="class-info">
                        <h1>{clase.nombre}</h1>
                        <p>Código del grupo: {clase.codigo_grupo}</p>
                    </div>
                </div>

                {/* Avisos */}
                <div className="card avisos-section">
                    <h2>Avisos</h2>
                    {avisos.length > 0 ? (
                        <ul>
                            {avisos.map(aviso => (
                                <li key={aviso.id}>
                                    {aviso.contenido}
                                    {/* Si quieres también mostrar anexos aquí después */}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay avisos todavía.</p>
                    )}
                </div>

                {/* Materiales */}
                <div className="card materiales-section">
                    <h2>Materiales</h2>
                    {materiales.length > 0 ? (
                        <ul>
                            {materiales.map(material => (
                                <li key={material.id}>
                                    {material.nombre} {/* O lo que tengas */}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay materiales todavía.</p>
                    )}
                </div>

                {/* Tareas */}
                <div className="card tareas-section">
                    <h2>Tareas</h2>
                    {tareas.length > 0 ? (
                        <ul>
                            {tareas.map(tarea => (
                                <li key={tarea.id}>
                                    <strong>{tarea.titulo}</strong><br />
                                    <em>{tarea.instrucciones}</em><br />
                                    <p><strong>Fecha límite:</strong> {new Date(tarea.fecha_limite).toLocaleString()}</p>
                                    <p><strong>Tema:</strong> {tarea.tema ? tarea.tema.nombre : 'Sin tema'}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay tareas todavía.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ClassViewStudent;
