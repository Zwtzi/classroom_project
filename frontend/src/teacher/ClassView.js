import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout2 from '../components/Layout2';
import '../styles/ClassView.css';
import axios from 'axios';
import { Link } from 'react-router-dom';


const ClassView = () => {
  const { classCode } = useParams();
  const [clase, setClase] = useState(null);
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
  const [materiales, setMateriales] = useState([]); // Lista de materiales existentes
  const [nuevoMaterial, setNuevoMaterial] = useState({
    titulo: '',
    descripcion: '',
    archivo: null,
    tema_id: ''
  });
  const handleNuevoMaterialChange = (e) => {
    const { name, value } = e.target;
    setNuevoMaterial((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArchivoMaterialChange = (e) => {
    setNuevoMaterial((prev) => ({
      ...prev,
      archivo: e.target.files[0]
    }));
  };



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
  const handleCrearMaterial = async () => {
    const formData = new FormData();
    formData.append('titulo', nuevoMaterial.titulo);
    formData.append('descripcion', nuevoMaterial.descripcion);
    formData.append('tema_id', nuevoMaterial.tema_id);
    formData.append('archivo', nuevoMaterial.archivo);

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/clases/${classCode}/materiales`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setMateriales([...materiales, response.data]);
      setNuevoMaterial({ titulo: '', descripcion: '', archivo: null, tema_id: '' });
    } catch (error) {
      console.error('Error al subir material:', error);
    }
  };

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

        <div className="class-banner">
          <div className="class-info">
            <h1>Clase: {classCode}</h1>
            <p>Bienvenido profesor</p>
          </div>
        </div>

        <div className="card">
          <h2>Agregar alumnos a la clase</h2>
          <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
            <option value="">Selecciona un alumno</option>
            {availableStudents
              .filter(student => !students.some(s => s.id === student.id))
              .map((student) => (
                <option key={student.id} value={student.id}>{student.nombre}</option>
              ))}
          </select>
          <button onClick={handleAddStudent}>Agregar Alumno</button>

          <h2>Alumnos registrados en la Clase {classCode}</h2> 
      
          <ul>
            {students.map((student, index) => (
              <li key={index}>•&nbsp; {student.nombre}</li>
            ))}
          </ul>

        </div> 

        <div className="card">
        <h2>Entregas</h2>

        <Link to={`/clases/${classCode}/revisar`} className="revisar-btn">
          Revisar Entregas
        </Link>
        </div> 

        <div className="avisos-layout">
          <div className="sidebar-vacio"></div>
          <div className="avisos-section">
            <div className="card">
              <h2>Anuncios</h2>
              <div className="aviso-input-container">
                <form onSubmit={handleAddAviso} className="aviso-form">
                  <textarea
                    placeholder="Escribe tu aviso"
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
                      <div className="aviso-user-info">
                        <strong className="aviso-nombre">{aviso.usuario?.nombre || 'Nombre del Usuario'}</strong> -&nbsp;
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
            </div>
            
            <div className="card">
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
                      <div className="aviso-user-info">
                        <strong className="aviso-nombre">{tema.nombre}</strong>
                      </div>
                    </div>

                    <p className="aviso-contenido">{tema.descripcion}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
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
