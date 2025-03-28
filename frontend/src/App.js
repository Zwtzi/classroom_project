import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './student/Dashboard';
import Dashboard2 from './teacher/Dashboard2';
import Login from './pages/Login';
import ClassView from './teacher/ClassView';


const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/student/dashboard" element={<Dashboard />} />
          <Route path="/teacher/dashboard2" element={<Dashboard2 />} />
          <Route path="/class/:classCode" element={<ClassView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
