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

        {/* Formulario para agregar avisos */}
        <div className="avisos-section">
          <h2>Avisos</h2>
          <form onSubmit={handleAddAviso}>
            <textarea
              placeholder="Escribe un nuevo aviso..."
              value={nuevoAviso}
              onChange={(e) => setNuevoAviso(e.target.value)}
              required
            />
            <input type="file" multiple onChange={handleFileChange} accept="image/*,application/pdf" />
            <button type="submit">Publicar Aviso</button>
          </form>

          {/* Lista de avisos */}
          <ul className="avisos-list">
            {avisos.map(aviso => (
              <li key={aviso.id}>
                <p>{aviso.contenido}</p>
                <p><small>{new Date(aviso.created_at).toLocaleString()}</small></p>
                {aviso.anexos && aviso.anexos.length > 0 && (
                  <div>
                    <h4>Archivos Adjuntos:</h4>
                    <ul>
                      {aviso.anexos.map(anexo => (
                        <li key={anexo.id}>
                          <a href={`http://127.0.0.1:8000/storage/${anexo.ruta_archivo}`} target="_blank" rel="noopener noreferrer">
                            {anexo.ruta_archivo.endsWith('.pdf') ? '📄 Ver PDF' : '🖼️ Ver Imagen'}
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
    </Layout2>
  );

};


export default ClassView;
