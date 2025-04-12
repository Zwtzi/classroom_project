import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddStudentView = () => {
    const { classCode } = useParams(); // Obtener el ID de la clase desde la URL
    const navigate = useNavigate();
    const [availableStudents, setAvailableStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        // Obtener lista de alumnos disponibles
        axios.get("http://127.0.0.1:8000/api/alumnos")
            .then(response => {
                setAvailableStudents(response.data);
            })
            .catch(error => {
                console.error("Error al obtener lista de alumnos:", error);
            });
    }, []);

    const handleAddStudent = () => {
        if (!selectedStudent) {
            setError("Por favor, selecciona un alumno antes de agregar.");
            return;
        }

        axios.post(`http://127.0.0.1:8000/api/clases/${classCode}/agregaralumno`, {
            alumno_id: selectedStudent
        })
            .then(response => {
                navigate(`/clases/${classCode}`);
            })
            .catch(error => {
                console.error("Error al agregar alumno:", error);
                if (error.response) {
                    setError(error.response.data.message || 'Hubo un error al agregar el alumno.');
                }
            });
    };

    return (
        <div>
            <h2>Agregar Alumno a la Clase {classCode}</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
                <option value="">Selecciona un alumno</option>
                {availableStudents.map((student) => (
                    <option key={student.id} value={student.id}>{student.nombre}</option>
                ))}
            </select>
            <button onClick={handleAddStudent}>Agregar Alumno</button>
        </div>
    );
};

export default AddStudentView;
