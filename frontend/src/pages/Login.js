import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Importamos Axios
import '../styles/Forms.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Realizamos la solicitud POST al backend para validar el login
    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        correo: email,
        contrasena: password
      });

      // Suponemos que la respuesta incluye el tipo de usuario (Alumno, Profesor, Administrador)
      const { tipo } = response.data;

      // Redirigir al dashboard correspondiente
      if (tipo === 'Alumno') {
        navigate('/student/dashboard');
      } else if (tipo === 'Profesor') {
        navigate('/teacher/dashboard2');
      } else if (tipo === 'Administrador') {
        navigate('/admin/dashboard'); // Asegúrate de tener una ruta para Administrador
      }
    } catch (error) {
      // Si la autenticación falla, mostramos un mensaje de error
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="vector-image">
          <img 
            src="/student.png" 
            alt="Imagen" 
            className="vector-img"
          />
        </div>
      </div>
      <div className="login-right">
        <div className="auth-container">
          <h2>Iniciar sesión</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                placeholder="Escriba su correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                placeholder="Escriba su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn">Entrar</button>
            {error && <p className="error-message">{error}</p>} {/* Mostrar mensaje de error */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
