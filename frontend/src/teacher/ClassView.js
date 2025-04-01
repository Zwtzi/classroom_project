import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout2 from '../components/Layout2';
import '../styles/ClassView.css';
import axios from 'axios';

const ClassView = () => {
  const { classCode } = useParams(); // Obtener classCode desde la URL
  const [students, setStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const availableFilteredStudents = availableStudents.filter(
    (student) => !students.some((s) => s.id === student.id)
  );

  const [selectedStudent, setSelectedStudent] = useState('');

  useEffect(() => {
    // Obtener los alumnos de la clase
    axios.get(`http://127.0.0.1:8000/api/clases/${classCode}/alumnos`)
      .then(response => {
        console.log("Alumnos en la clase:", response.data);
        setStudents(response.data);
      })
      .catch(error => console.error("Error al obtener alumnos de la clase:", error));

    // Obtener la lista de todos los alumnos
    axios.get("http://127.0.0.1:8000/api/alumnos")
      .then(response => {
        setAvailableStudents(response.data);
      })
      .catch(error => console.error("Error al obtener lista de alumnos:", error));
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

  return (
    <Layout2>
      <div className="class-view">
        <h2>Alumnos en la Clase {classCode}</h2>
        <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
          <option value="">Selecciona un alumno</option>
          {availableFilteredStudents.map((student) => (
            <option key={student.id} value={student.id}>{student.nombre}</option>
          ))}
        </select>

        <button onClick={handleAddStudent}>Agregar Alumno</button>
        <ul>
          {students.map((student, index) => (
            <li key={index}>{student.nombre}</li>
          ))}
        </ul>
      </div>
    </Layout2>
  );
};

export default ClassView;
