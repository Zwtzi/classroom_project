import React, { useState } from 'react'; 
import Layout2 from '../components/Layout2';
import '../styles/ClassView.css';
import axios from 'axios';
import { useEffect } from 'react';


const ClassView = ({ classCode, className, classDescription }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [announcementText, setAnnouncementText] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskInstructions, setTaskInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState('');
  const [announcementFile, setAnnouncementFile] = useState(null);
  const [taskFile, setTaskFile] = useState(null); // Nuevo estado para los archivos de tarea
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [availableStudents, setAvailableStudents] = useState([]); // Alumnos disponibles
  const [selectedStudent, setSelectedStudent] = useState('');


  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'long' };
    return date.toLocaleDateString('es-ES', options);
  };

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/alumnos")
        .then(response => {
          console.log("Lista de alumnos:", response.data);
          setAvailableStudents(response.data); // Guarda los alumnos en el estado
        })
        .catch(error => {
          console.error("Error al obtener alumnos:", error);
        });
  }, []);



  const handleAddStudent = () => {
    if (selectedStudent) {
      // Enviar al backend el ID del alumno y el código de la clase
      axios.post("http://localhost:5000/api/students", {
        classCode,            // Código de la clase
        studentId: selectedStudent // ID del alumno seleccionado
      })
          .then(response => {
            setStudents([...students, response.data]); // Actualiza el estado de estudiantes
            setSelectedStudent(''); // Resetea el valor seleccionado
          })
          .catch(error => console.error("Error al agregar alumno:", error));
    }
  };



  const handleCreateAnnouncement = async () => {
    if (announcementText || announcementFile) {
      const formData = new FormData();
      formData.append("text", announcementText);
      formData.append("date", new Date().toISOString());
      if (announcementFile) {
        formData.append("file", announcementFile);
      }

      try {
        const response = await axios.post("http://localhost:5000/api/announcements", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setAnnouncements([...announcements, response.data]);
        setAnnouncementText('');
        setAnnouncementFile(null);
      } catch (error) {
        console.error("Error al crear el anuncio:", error);
      }
    }
  };
  const handleEditAnnouncement = (index) => {
    const announcement = announcements[index];
    setAnnouncementText(announcement.text);
    setAnnouncementFile(announcement.file);
    setEditingAnnouncement(index);
  };

  const handleCreateTask = async () => {
    if (taskTitle && taskInstructions && dueDate) {
      const formData = new FormData();
      formData.append("title", taskTitle);
      formData.append("instructions", taskInstructions);
      formData.append("dueDate", dueDate);
      formData.append("date", new Date().toISOString());
      if (taskFile) {
        formData.append("file", taskFile);
      }

      try {
        const response = await axios.post("http://localhost:5000/api/tasks", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setTasks([...tasks, response.data]);
        setTaskTitle('');
        setTaskInstructions('');
        setDueDate('');
        setTaskFile(null);
      } catch (error) {
        console.error("Error al crear la tarea:", error);
      }
    }
  };


  const handleEditTask = (index) => {
    const task = tasks[index];
    setTaskTitle(task.title);
    setTaskInstructions(task.instructions);
    setDueDate(task.dueDate);
    setTaskFile(task.file); // Set the file if editing
    setEditingTask(index);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAnnouncementFile(file);
    }
  };

  const handleTaskFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setTaskFile(file); // Handling task file input
    }
  };


  return (
    <Layout2>
      <div className="class-view">
        <div className="class-banner">
          <div className="class-info">
            <h1>{className}</h1>
            <p>{classDescription}</p>
          </div>
          <div className="class-code">
            <h3>Código de Clase</h3>
            <p>{classCode}</p>
          </div>
        </div>

        <section className="students">
          <h2>Alumnos</h2>
          <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
            <option value="">Selecciona un alumno</option>
            {availableStudents.map((student, index) => (
                <option key={index} value={student.id}>{student.nombre}</option>
            ))}
          </select>
          <button onClick={handleAddStudent}>Agregar Alumno</button>
          <ul>
            {students.map((student, index) => (
                <li key={index}>{student}</li>
            ))}
          </ul>
        </section>


        <section className="announcements">
          <h2>Anuncios</h2>
          <textarea
            placeholder="Escribe un anuncio..."
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
          />
          <input type="file" accept="*/*" onChange={handleFileChange} />
          <button onClick={handleCreateAnnouncement}>
            {editingAnnouncement !== null ? 'Actualizar Anuncio' : 'Crear Anuncio'}
          </button>
          <ul>
            {announcements.map((announcement, index) => (
              <li key={index} className="announcement-item">
                <div className="announcement-header">
                  <span>{announcement.date}{announcement.modificationDate && ` (${announcement.modificationDate})`}</span>
                </div>
                <p>{announcement.text}</p>
                {announcement.file && (
                  <a href={URL.createObjectURL(announcement.file)} download>
                    Descargar archivo adjunto ({announcement.file.name})
                  </a>
                )}
                <button onClick={() => handleEditAnnouncement(index)}>Editar</button>
              </li>
            ))}
          </ul>
        </section>

        <section className="tasks">
          <h2>Tareas</h2>
          <input
            type="text"
            placeholder="Título de la tarea"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <textarea
            placeholder="Instrucciones de la tarea"
            value={taskInstructions}
            onChange={(e) => setTaskInstructions(e.target.value)}
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <input type="file" accept="*/*" onChange={handleTaskFileChange} />
          <button onClick={handleCreateTask}>
            {editingTask !== null ? 'Actualizar Tarea' : 'Crear Tarea'}
          </button>
          <ul>
            {tasks.map((task, index) => (
              <li key={index} className="task-item">
                <div className="task-header">
                  <span>{task.date}{task.modificationDate && ` (${task.modificationDate})`}</span>
                </div>
                <div className="task-content">
                  <h3>{task.title}</h3>
                  <p>{task.instructions}</p>
                  <p><strong>Fecha de entrega:</strong> {task.dueDate}</p>
                  {task.file && (
                    <a href={URL.createObjectURL(task.file)} download>
                      Descargar archivo adjunto ({task.file.name})
                    </a>
                  )}
                </div>
                <button onClick={() => handleEditTask(index)}>Editar</button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Layout2>
  );

};


export default ClassView;
