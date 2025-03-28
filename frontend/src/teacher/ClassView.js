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
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editingAnnouncementIndex, setEditingAnnouncementIndex] = useState(null);

  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'long' };
    return date.toLocaleDateString('es-ES', options);
  };

  const handleCreateAnnouncement = () => {
    if (announcementText) {
      const newAnnouncement = { text: announcementText, date: formatDate(new Date()) };
      setAnnouncements([...announcements, newAnnouncement]);
      setAnnouncementText('');
    }
  };

  const handleEditAnnouncement = (index) => {
    setAnnouncementText(announcements[index].text);
    setEditingAnnouncementIndex(index);
  };

  const handleUpdateAnnouncement = () => {
    if (announcementText && editingAnnouncementIndex !== null) {
      const updatedAnnouncements = [...announcements];
      updatedAnnouncements[editingAnnouncementIndex] = { 
        ...updatedAnnouncements[editingAnnouncementIndex],
        text: announcementText, 
        lastModified: formatDate(new Date()) 
      };
      setAnnouncements(updatedAnnouncements);
      setAnnouncementText('');
      setEditingAnnouncementIndex(null);
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

  const handleEditTask = (index) => {
    const task = tasks[index];
    setTaskTitle(task.title);
    setTaskInstructions(task.instructions);
    setDueDate(task.dueDate);
    setEditingTaskIndex(index);
  };

  const handleUpdateTask = () => {
    if (taskTitle && taskInstructions && dueDate && editingTaskIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editingTaskIndex] = { 
        ...updatedTasks[editingTaskIndex],
        title: taskTitle, 
        instructions: taskInstructions, 
        dueDate,
        lastModified: formatDate(new Date()) 
      };
      setTasks(updatedTasks);
      setTaskTitle('');
      setTaskInstructions('');
      setDueDate('');
      setEditingTaskIndex(null);
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

        <section className="announcements">
          <h2>Anuncios</h2>
          <textarea
            placeholder="Escribe un anuncio..."
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
          />
          {editingAnnouncementIndex !== null ? (
            <button onClick={handleUpdateAnnouncement}>Actualizar Anuncio</button>
          ) : (
            <button onClick={handleCreateAnnouncement}>Crear Anuncio</button>
          )}
          <ul>
            {announcements.map((announcement, index) => (
              <li key={index} className="announcement-item">
                <div className="announcement-header">
                  <span>{announcement.date}</span>
                  {announcement.lastModified && <span> (Última modificación: {announcement.lastModified})</span>}
                </div>
                <p>{announcement.text}</p>
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
          {editingTaskIndex !== null ? (
            <button onClick={handleUpdateTask}>Actualizar Tarea</button>
          ) : (
            <button onClick={handleCreateTask}>Crear Tarea</button>
          )}
          <ul>
            {tasks.map((task, index) => (
              <li key={index} className="task-item">
                <div className="task-header">
                  <span>{task.date}</span>
                  {task.lastModified && <span> (Última modificación: {task.lastModified})</span>}
                </div>
                <div className="task-content">
                  <h3>{task.title}</h3>
                  <p>{task.instructions}</p>
                  <p><strong>Fecha de entrega:</strong> {task.dueDate}</p>
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
