import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import '../styles/ClassView.css';

const ClassViewStudent = () => {
    const { classId } = useParams();
    const [clase, setClase] = useState(null);
    const [avisos, setAvisos] = useState([]);
    const [materiales, setMateriales] = useState([]);
    const [tareas, setTareas] = useState([]);  // Agregamos el estado para las tareas
    const [usuarioId, setUsuarioId] = useState(1); // reemplaza esto con el ID real del alumno si tienes auth
    const [entregas, setEntregas] = useState({});

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
                .then(async resTareas => {
                    const tareasData = resTareas.data;

                    // Consultar entregas por cada tarea
                    const entregasMap = {};
                    for (const tarea of tareasData) {
                        try {
                            const resEntrega = await axios.get('http://127.0.0.1:8000/api/entregas/por-tarea', {
                                params: {
                                    tarea_id: tarea.id,
                                    alumno_id: usuarioId
                                }
                            });
                            entregasMap[tarea.id] = resEntrega.data;
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
    }, [classId]);

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
            window.location.reload(); // Recarga para actualizar vista
        } catch (error) {
            console.error("Error al subir archivo:", error);
            alert("Error al entregar el archivo");
        }
    };
    

    if (!clase) {
        return (
            <Layout>
                <div className="class-view-h2">
                    <h2>Cargando clase...</h2>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="class-view">
                <h2>{clase.nombre}</h2>
                <p><strong>Código del grupo:</strong> {clase.codigo_grupo}</p>
                <p><strong>Descripción:</strong> {clase.descripcion ?? "No hay descripción."}</p>

                {/* Sección avisos */}
                <div className="avisos-layout">
                  <div className="sidebar-vacio">{/* Espacio para, tareas pendientes? */}</div>
                  <div className="avisos-section">
                    <h2>Anuncios</h2>

                    {avisos.length > 0 ? (
                      <ul className="avisos-list">
                        {avisos.map(aviso => (
                          <li key={aviso.id} className="aviso-item">
                            <div className="aviso-header">
                              <div className="avatar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 129 129" fill="none">
                                  <circle cx="64.5" cy="64.5" r="64.5" fill="#2C943F" />
                                  <path d="M64.7077 61.7418C77.339 61.7418 87.5786 51.5022 87.5786 38.8709C87.5786 26.2397 77.339 16 64.7077 16C52.0765 16 41.8368 26.2397 41.8368 38.8709C41.8368 51.5022 52.0765 61.7418 64.7077 61.7418Z" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M104 101.581C104 83.8791 86.3893 69.5619 64.7077 69.5619C43.0261 69.5619 25.4155 83.8791 25.4155 101.581" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>
                              <div className="aviso-user-info">
                                <strong className="aviso-nombre">{aviso.usuario?.nombre || 'Nombre del Usuario'}</strong>
                                <span className="aviso-fecha">{new Date(aviso.created_at).toLocaleString()}</span>
                              </div>
                            </div>
                        
                            <p className="aviso-contenido">{aviso.contenido}</p>
                        
                            {aviso.anexos && aviso.anexos.length > 0 && (
                              <div className="aviso-archivos">
                                <h4>Archivos Adjuntos:</h4>
                                <ul>
                                  {aviso.anexos.map(anexo => (
                                    <li key={anexo.id}>
                                      <a
                                        href={`http://127.0.0.1:8000/storage/${anexo.ruta_archivo}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {anexo.ruta_archivo.endsWith('.pdf') ? 'Ver PDF' : 'Ver Imagen'}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No hay avisos todavía.</p>
                    )}
                  
                

                {/* Sección materiales */} 
                <div className="temas-section">
                  <h2>Materiales</h2>

                  <div className="avisos-list">
                    {materiales.length > 0 ? (
                      <ul className="avisos-list">
                        {materiales.map(material => (
                          <li key={material.id} className="aviso-item">
                            <div className="aviso-header">
                              <div className="avatar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 73 73" fill="none">
                                  <circle cx="36.5" cy="36.5" r="36.5" fill="#2C943F" />
                                  <path d="M58.8345 32.1777L56.5901 41.724C54.6663 49.9685 50.8645 53.3029 43.7191 52.6177C42.574 52.5264 41.3373 52.3208 40.0089 52.0011L36.1614 51.0876C26.6112 48.8266 23.6568 44.122 25.9012 34.5757L28.1456 25.0065C28.6037 23.0653 29.1533 21.3753 29.8404 19.9822C32.5199 14.4554 37.0775 12.9709 44.7268 14.7751L48.5514 15.6658C58.1474 17.9039 61.0789 22.6314 58.8345 32.1777Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M43.4428 52.16C42.0679 53.1224 40.3382 53.9243 38.2315 54.6347L34.7277 55.8262C25.9238 58.7591 21.289 56.3073 18.4283 47.2107L15.5898 38.1599C12.7513 29.0632 15.102 24.2514 23.9058 21.3184L27.4096 20.1269C28.3188 19.8291 29.1837 19.577 30.0042 19.4166C29.3389 20.8143 28.8067 22.5099 28.3632 24.4576L26.1899 34.0583C24.0167 43.6362 26.8774 48.3564 36.1248 50.6248L39.8503 51.5413C41.1365 51.8621 42.334 52.0683 43.4428 52.16Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M38.074 28.0071L49.8859 30.1548" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M35.926 36.5976L42.3689 37.6714" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>
                              <div className="aviso-user-info">
                                <strong className="aviso-nombre">{material.nombre}</strong>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="aviso-contenido">No hay materiales todavía.</p>
                    )}
                  </div>
                </div>

                {/* Sección Tareas */} 
                <div className="tareas-section">
                  <h2>Tareas</h2>

                  {tareas.length > 0 ? (
                    <ul className="avisos-list">
                      {tareas.map(tarea => {
                        const entrega = entregas[tarea.id];
                    
                        return (
                          <li key={tarea.id} className="aviso-item">
                            <div className="aviso-header">
                              <div className="avatar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 73 73" fill="none">
                                  <circle cx="36.5" cy="36.5" r="36.5" fill="#2C943F" />
                                  <path d="M58.8345 32.1777L56.5901 41.724C54.6663 49.9685 50.8645 53.3029 43.7191 52.6177C42.574 52.5264 41.3373 52.3208 40.0089 52.0011L36.1614 51.0876C26.6112 48.8266 23.6568 44.122 25.9012 34.5757L28.1456 25.0065C28.6037 23.0653 29.1533 21.3753 29.8404 19.9822C32.5199 14.4554 37.0775 12.9709 44.7268 14.7751L48.5514 15.6658C58.1474 17.9039 61.0789 22.6314 58.8345 32.1777Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M43.4428 52.16C42.0679 53.1224 40.3382 53.9243 38.2315 54.6347L34.7277 55.8262C25.9238 58.7591 21.289 56.3073 18.4283 47.2107L15.5898 38.1599C12.7513 29.0632 15.102 24.2514 23.9058 21.3184L27.4096 20.1269C28.3188 19.8291 29.1837 19.577 30.0042 19.4166C29.3389 20.8143 28.8067 22.5099 28.3632 24.4576L26.1899 34.0583C24.0167 43.6362 26.8774 48.3564 36.1248 50.6248L39.8503 51.5413C41.1365 51.8621 42.334 52.0683 43.4428 52.16Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M38.074 28.0071L49.8859 30.1548" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M35.926 36.5976L42.3689 37.6714" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>
                              <div className="aviso-user-info">
                                <strong className="aviso-nombre">{tarea.titulo}</strong>
                                <span className="aviso-fecha">
                                  Fecha límite: {new Date(tarea.fecha_limite).toLocaleString()}
                                </span>
                              </div>
                            </div>
                        
                            <p className="aviso-contenido">{tarea.instrucciones}</p>
                        
                            {tarea.tema && (
                              <div className="aviso-archivos">
                                <h4>Tema relacionado:</h4>
                                <p className="aviso-contenido"><em>{tarea.tema.nombre}</em></p>
                              </div>
                            )}

                            <div className="aviso-entrega">
                              {entrega ? (
                                entrega.archivo ? (
                                  <>
                                    <p className="aviso-contenido"><strong>Ya entregaste:</strong> <a href={`http://127.0.0.1:8000/storage/${entrega.archivo}`} target="_blank" rel="noopener noreferrer">Ver archivo</a></p>
                                    <p className="aviso-contenido"><strong>Entregado en:</strong> {new Date(entrega.entregado_en).toLocaleString()}</p>
                                  </>
                                ) : (
                                  <>
                                    <label className="aviso-contenido">Subir archivo de entrega:</label>
                                    <input type="file" onChange={(e) => handleArchivoChange(e, tarea.id)} />
                                  </>
                                )
                              ) : (
                                <>
                                  <label className="aviso-contenido">Subir archivo de entrega:</label>
                                  <input type="file" onChange={(e) => handleArchivoChange(e, tarea.id)} />
                                </>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p>No hay tareas todavía.</p>
                  )}
                </div>
                </div>
                </div>

            </div>
        </Layout>
    );
};

export default ClassViewStudent;