import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout2 from '../components/Layout2';
import '../styles/ClassView.css';
import axios from 'axios';

const ClassView = () => {
  const { classCode } = useParams(); // Obtener el ID de la clase desde la URL
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

    // Obtener lista de alumnos disponibles
    axios.get("http://127.0.0.1:8000/api/alumnos")
      .then(response => setAvailableStudents(response.data))
      .catch(error => console.error("Error al obtener lista de alumnos:", error));

    // Obtener avisos de la clase
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

    // Depurar los archivos antes de enviarlos
    console.log("Archivos a enviar:", archivos);

    archivos.forEach((file, index) => {
        formData.append(`anexos[${index}]`, file);
    });

    try {
        const response = await axios.post(
            `http://127.0.0.1:8000/api/clases/${classCode}/avisos`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
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
      {/* Banner superior estilo Google Classroom */}
      <div className="class-banner">
        <h1 className="class-name">Clase de Ejemplo</h1>
        <span className="class-code">{classCode}</span>
      </div>

      {/* Select de alumnos */}
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

      {/* Sección de avisos */}
      <div className="avisos-layout">
      <div className="sidebar-vacio">{/* Espacio para, tareas pendientes? */}</div>
      <div className="avisos-section">
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

        {/* Lista de Temas */}
        <div className="temas-section">
          <h2>Temas</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            axios.post(`http://127.0.0.1:8000/api/clases/${classCode}/temas`, nuevoTema)
              .then(res => {
                setTemas([res.data, ...temas]);
                setNuevoTema({ nombre: '', descripcion: '' });
              })
              .catch(err => console.error("Error al crear tema:", err));
          }}>
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
            <button type="submit">Crear Tema</button>
          </form>

          <ul>
            {temas.map((tema) => (
              <li key={tema.id}>
                <strong>{tema.nombre}</strong> - {tema.descripcion}
              </li>
            ))}
          </ul>
        </div>

        {/* Forms de tareas */}
        <div className="tareas-section">
          <h2>Tareas</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            axios.post(`http://127.0.0.1:8000/api/clases/${classCode}/tareas`, nuevaTarea)
              .then(res => {
                setTareas([res.data, ...tareas]);
                setNuevaTarea({ titulo: '', instrucciones: '', fecha_limite: '', tema_id: '' });
              })
              .catch(err => console.error("Error al crear tarea:", err));
          }}>
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
            <button type="submit">Crear Tarea</button>
          </form>

          {/* Lista de tareas existentes */}
          <ul>
            {tareas.map((tarea) => (
              <li key={tarea.id}>
                <strong>{tarea.titulo}</strong> - {tarea.instrucciones}<br/>
                <small>Fecha límite: {new Date(tarea.fecha_limite).toLocaleString()}</small><br/>
                {tarea.tema && <em>Tema: {tarea.tema.nombre}</em>}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </Layout2>
  );
};

export default ClassView;
