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
      </div>
      </div>
      </div>
    </Layout2>
  );
};

export default ClassView;
