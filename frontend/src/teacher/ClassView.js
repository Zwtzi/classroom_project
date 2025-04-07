import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout2 from '../components/Layout2';
import '../styles/ClassView.css';
import axios from 'axios';
import { Link } from 'react-router-dom';


const ClassView = () => {
  const { classCode } = useParams();
  const [students, setStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [avisos, setAvisos] = useState([]);
  const [nuevoAviso, setNuevoAviso] = useState('');
  const [archivos, setArchivos] = useState([]);
  const [temas, setTemas] = useState([]);
  const [nuevoTema, setNuevoTema] = useState({ nombre: '', descripcion: '' });
  const [nuevaTarea, setNuevaTarea] = useState({
    titulo: '',
    instrucciones: '',
    fecha_limite: '',
    tema_id: ''
  });
  const [tareas, setTareas] = useState([]);



  useEffect(() => {
    // Obtener alumnos de la clase
    axios.get(`http://127.0.0.1:8000/api/clases/${classCode}/alumnos`)
      .then(response => setStudents(response.data))
      .catch(error => console.error("Error al obtener alumnos de la clase:", error));

    axios.get("http://127.0.0.1:8000/api/alumnos")
      .then(response => setAvailableStudents(response.data))
      .catch(error => console.error("Error al obtener lista de alumnos:", error));

    axios.get(`http://127.0.0.1:8000/api/clases/${classCode}/avisos`)
      .then(response => setAvisos(response.data))
      .catch(error => console.error("Error al obtener avisos:", error));

    axios.get(`http://127.0.0.1:8000/api/clases/${classCode}/temas`)
      .then(response => setTemas(response.data))
      .catch(error => console.error("Error al obtener temas:", error));

    axios.get(`http://127.0.0.1:8000/api/clases/${classCode}/tareas`)
      .then(response => setTareas(response.data))
      .catch(error => console.error("Error al obtener tareas:", error));
    

  }, [classCode]);

  const handleAddStudent = () => {
    if (selectedStudent) {
      axios.post(`http://127.0.0.1:8000/api/clases/${classCode}/agregaralumno`, {
        alumno_id: selectedStudent
      })
        .then(response => {
          setStudents([...students, response.data]);
          setSelectedStudent('');
        })
        .catch(error => console.error("Error al agregar alumno:", error));
    }
  };

  const handleFileChange = (e) => {
    setArchivos([...e.target.files]);
  };

  const handleAddAviso = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("contenido", nuevoAviso);
    archivos.forEach((file, index) => {
      formData.append(`anexos[${index}]`, file);
    });

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/clases/${classCode}/avisos`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setAvisos([response.data, ...avisos]);
      setNuevoAviso('');
      setArchivos([]);
    } catch (error) {
      console.error("Error al agregar aviso:", error.response ? error.response.data : error);
    }
};

  

  return (
    <Layout2>
      <div className="class-view">
        <h2>Alumnos en la Clase {classCode}</h2>
        <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
          <option value="">Selecciona un alumno</option>
          {availableStudents
            .filter(student => !students.some(s => s.id === student.id))
            .map((student) => (
              <option key={student.id} value={student.id}>{student.nombre}</option>
            ))}
        </select>
        <button onClick={handleAddStudent}>Agregar Alumno</button>

        <ul>
          {students.map((student, index) => (
            <li key={index}>{student.nombre}</li>
          ))}
        </ul>

        {/* Sección avisos */}
        <div className="avisos-layout">
        <div className="sidebar-vacio">{/* Espacio para, tareas pendientes? */}</div>
        <div className="avisos-section">
          <h2>Anuncios</h2>
          <div className="aviso-input-container">
          <form onSubmit={handleAddAviso} className="aviso-form">
            <textarea
              placeholder="Anuncie algo a la clase..."
              value={nuevoAviso}
              onChange={(e) => setNuevoAviso(e.target.value)}
              required
            />

          <div className="aviso-actions">
            <label htmlFor="file-upload" className="file-button">
              Agregar Archivos
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/*,application/pdf"
              style={{ display: "none" }}
            />
            <button type="submit" className="submit-button">Publicar Aviso</button>
          </div>
          </form>
          </div>

          <ul className="avisos-list">
          {avisos.map(aviso => (
            <li key={aviso.id} className="aviso-item">
              <div className="aviso-header">
                <div className="avatar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 129 129" fill="none">
                    <circle cx="64.5" cy="64.5" r="64.5" fill="#2C943F"/>
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
                        <a href={`http://127.0.0.1:8000/storage/${anexo.ruta_archivo}`} target="_blank" rel="noopener noreferrer">
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

        {/* Sección temas */}
          <div className="temas-section">
            <h2>Temas</h2>
            <div className="aviso-input-container">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  axios.post(`http://127.0.0.1:8000/api/clases/${classCode}/temas`, nuevoTema)
                    .then(res => {
                      setTemas([res.data, ...temas]);
                      setNuevoTema({ nombre: '', descripcion: '' });
                    })
                    .catch(err => console.error("Error al crear tema:", err));
                }}
                className="aviso-form"
              >
                <input
                  type="text"
                  placeholder="Nombre del tema"
                  value={nuevoTema.nombre}
                  onChange={(e) => setNuevoTema({ ...nuevoTema, nombre: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Descripción del tema"
                  value={nuevoTema.descripcion}
                  onChange={(e) => setNuevoTema({ ...nuevoTema, descripcion: e.target.value })}
                />

                <div className="aviso-actions">
                  <button type="submit" className="submit-button">Crear Tema</button>
                </div>
              </form>
            </div>
              
            <ul className="avisos-list">
              {temas.map((tema) => (
                <li key={tema.id} className="aviso-item">
                  <div className="aviso-header">
                    <div className="avatar">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 73 73" fill="none">
                        <circle cx="36.5" cy="36.5" r="36.5" fill="#2C943F"/>
                        <path d="M58.8345 32.1777L56.5901 41.724C54.6663 49.9685 50.8645 53.3029 43.7191 52.6177C42.574 52.5264 41.3373 52.3208 40.0089 52.0011L36.1614 51.0876C26.6112 48.8266 23.6568 44.122 25.9012 34.5757L28.1456 25.0065C28.6037 23.0653 29.1533 21.3753 29.8404 19.9822C32.5199 14.4554 37.0775 12.9709 44.7268 14.7751L48.5514 15.6658C58.1474 17.9039 61.0789 22.6314 58.8345 32.1777Z" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M43.4428 52.16C42.0679 53.1224 40.3382 53.9243 38.2315 54.6347L34.7277 55.8262C25.9238 58.7591 21.289 56.3073 18.4283 47.2107L15.5898 38.1599C12.7513 29.0632 15.102 24.2514 23.9058 21.3184L27.4096 20.1269C28.3188 19.8291 29.1837 19.577 30.0042 19.4166C29.3389 20.8143 28.8067 22.5099 28.3632 24.4576L26.1899 34.0583C24.0167 43.6362 26.8774 48.3564 36.1248 50.6248L39.8503 51.5413C41.1365 51.8621 42.334 52.0683 43.4428 52.16Z" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M38.074 28.0071L49.8859 30.1548" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M35.926 36.5976L42.3689 37.6714" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <div className="aviso-user-info">
                      <strong className="aviso-nombre">{tema.nombre}</strong>
                    </div>
                  </div>
              
                  <p className="aviso-contenido">{tema.descripcion}</p>
                </li>
              ))}
            </ul>
          </div>

        {/* Sección tareas */}
        <div className="tareas-section">
        <h2>Tareas</h2>
          <div className="aviso-input-container">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                axios.post(`http://127.0.0.1:8000/api/clases/${classCode}/tareas`, nuevaTarea)
                  .then(res => {
                    setTareas([res.data, ...tareas]);
                    setNuevaTarea({ titulo: '', instrucciones: '', fecha_limite: '', tema_id: '' });
                  })
                  .catch(err => console.error("Error al crear tarea:", err));
              }}
              className="aviso-form"
            >
              <input
                type="text"
                placeholder="Título de la tarea"
                value={nuevaTarea.titulo}
                onChange={(e) => setNuevaTarea({ ...nuevaTarea, titulo: e.target.value })}
                required
              />
              <textarea
                placeholder="Instrucciones"
                value={nuevaTarea.instrucciones}
                onChange={(e) => setNuevaTarea({ ...nuevaTarea, instrucciones: e.target.value })}
              />
              <input
                type="datetime-local"
                value={nuevaTarea.fecha_limite}
                onChange={(e) => setNuevaTarea({ ...nuevaTarea, fecha_limite: e.target.value })}
                required
              />
              <select
                value={nuevaTarea.tema_id}
                onChange={(e) => setNuevaTarea({ ...nuevaTarea, tema_id: e.target.value })}
              >
                <option value="">Sin tema</option>
                {temas.map((tema) => (
                  <option key={tema.id} value={tema.id}>{tema.nombre}</option>
                ))}
              </select>
              
              <div className="aviso-actions">
                <button type="submit" className="submit-button">Crear Tarea</button>
              </div>
            </form>
          </div>
              
          <ul className="avisos-list">
            {tareas.map((tarea) => (
              <li key={tarea.id} className="aviso-item">
                <div className="aviso-header">
                  <div className="avatar">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 73 73" fill="none">
                        <circle cx="36.5" cy="36.5" r="36.5" fill="#2C943F"/>
                        <path d="M58.8345 32.1777L56.5901 41.724C54.6663 49.9685 50.8645 53.3029 43.7191 52.6177C42.574 52.5264 41.3373 52.3208 40.0089 52.0011L36.1614 51.0876C26.6112 48.8266 23.6568 44.122 25.9012 34.5757L28.1456 25.0065C28.6037 23.0653 29.1533 21.3753 29.8404 19.9822C32.5199 14.4554 37.0775 12.9709 44.7268 14.7751L48.5514 15.6658C58.1474 17.9039 61.0789 22.6314 58.8345 32.1777Z" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M43.4428 52.16C42.0679 53.1224 40.3382 53.9243 38.2315 54.6347L34.7277 55.8262C25.9238 58.7591 21.289 56.3073 18.4283 47.2107L15.5898 38.1599C12.7513 29.0632 15.102 24.2514 23.9058 21.3184L27.4096 20.1269C28.3188 19.8291 29.1837 19.577 30.0042 19.4166C29.3389 20.8143 28.8067 22.5099 28.3632 24.4576L26.1899 34.0583C24.0167 43.6362 26.8774 48.3564 36.1248 50.6248L39.8503 51.5413C41.1365 51.8621 42.334 52.0683 43.4428 52.16Z" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M38.074 28.0071L49.8859 30.1548" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M35.926 36.5976L42.3689 37.6714" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
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
              </li>
            ))}
          </ul>
        </div>
        </div>
        </div>
      </div>
    </Layout2>
  );
};

export default ClassView;
