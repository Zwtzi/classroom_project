import React, { useState } from 'react';
import axios from 'axios';  // Importamos Axios
import { useNavigate } from 'react-router-dom';
import '../styles/Forms.css';  // Asegúrate de que la ruta sea la correcta

const Register = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Realizamos la solicitud POST para registrar el nuevo usuario
    try {
      const response = await axios.post('http://localhost:8000/api/usuarios', {
        nombre: nombre,
        correo: correo,
        contrasena: contrasena
      });

      // Si la respuesta es exitosa, redirigimos al login o dashboard
      if (response.status === 201) {
        navigate('/login');  // Redirige al login o donde desees
      }
    } catch (error) {
      // Si hay un error (como un correo duplicado), mostramos un mensaje
      setError('Error al registrar el usuario');
    }
  };

  return (
    <div className="auth-container">
      <h2>Registrar cuenta</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">Registrar</button>
        {error && <p className="error-message">{error}</p>} {/* Mostrar mensaje de error */}
      </form>
    </div>
  );
};

export default Register;