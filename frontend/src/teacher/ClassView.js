import React, { useState } from 'react';
import Layout2 from '../components/Layout2';
import '../styles/ClassView.css';

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

  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'long' };
    return date.toLocaleDateString('es-ES', options);
  };

  const handleCreateAnnouncement = () => {
    if (announcementText || announcementFile) {
      const newAnnouncement = { 
        text: announcementText, 
        date: formatDate(new Date()),
        file: announcementFile
      };
      setAnnouncements([...announcements, newAnnouncement]);
      setAnnouncementText('');
      setAnnouncementFile(null);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAnnouncementFile(file);
    }
  };

  const handleAddStudent = () => {
    if (newStudent) {
      setStudents([...students, newStudent]);
      setNewStudent('');
    }
  };

  const handleCreateTask = () => {
    if (taskTitle && taskInstructions && dueDate) {
      const newTask = { 
        title: taskTitle, 
        instructions: taskInstructions, 
        dueDate, 
        date: formatDate(new Date()) 
      };
      setTasks([...tasks, newTask]);
      setTaskTitle('');
      setTaskInstructions('');
      setDueDate('');
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
          <input 
            type="text" 
            placeholder="Nombre del alumno" 
            value={newStudent} 
            onChange={(e) => setNewStudent(e.target.value)} 
          />
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
          <button onClick={handleCreateAnnouncement}>Crear Anuncio</button>
          <ul>
            {announcements.map((announcement, index) => (
              <li key={index} className="announcement-item">
                <div className="announcement-header">
                  <span>{announcement.date}</span>
                </div>
                <p>{announcement.text}</p>
                {announcement.file && (
                  <a href={URL.createObjectURL(announcement.file)} download>
                    Descargar archivo adjunto ({announcement.file.name})
                  </a>
                )}
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
          <button onClick={handleCreateTask}>Crear Tarea</button>
          <ul>
            {tasks.map((task, index) => (
              <li key={index} className="task-item">
                <div className="task-header">
                  <span>{task.date}</span>
                </div>
                <div className="task-content">
                  <h3>{task.title}</h3>
                  <p>{task.instructions}</p>
                  <p><strong>Fecha de entrega:</strong> {task.dueDate}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Layout2>
  );
};

export default ClassView;
