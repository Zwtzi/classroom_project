import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './student/Dashboard';
import Dashboard2 from './teacher/Dashboard2';
import Login from './pages/Login';
import ClassView from './teacher/ClassView';
import AddStudentView from "./teacher/addstudent";
import ClassViewStudent from './student/ClassViewStudent'; // asegúrate de importar bien
import Revisar from './teacher/Revisar'; // Asegúrate de que la ruta sea correcta


const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/student/dashboard" element={<Dashboard />} />
          <Route path="/teacher/dashboard2" element={<Dashboard2 />} />
          <Route path="/class/:classCode" element={<ClassView />} /> {/* classCode desde URL */}
          <Route path="/clases/:classCode/agregar-alumno" element={<AddStudentView />} />
          <Route path="/student/class/:classId" element={<ClassViewStudent />} />
          <Route path="/clases/:classCode/revisar" element={<Revisar />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
