import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Importamos Axios
import '../styles/Forms.css';

const Register = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [tipo, setTipo] = useState('Alumno'); // Valor por defecto
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Realizamos la solicitud POST para registrar el nuevo usuario
    try {
      const response = await axios.post('http://localhost:8000/api/usuarios', {
        nombre: nombre,
        correo: correo,
        contrasena: contrasena,
        tipo: tipo
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
      <div className="register-right">
        <div className="auth-container-register">
          <h2>Registrar cuenta</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                placeholder="Escriba su nombre"
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
                placeholder="Escriba su correo electrónico"
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
                placeholder="Escriba su contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="tipo">Tipo</label>
              <select
                id="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                required
              >
                <option value="Administrador">Administrador</option>
                <option value="Profesor">Profesor</option>
                <option value="Alumno">Alumno</option>
              </select>
            </div>
            <a href="/" className="btn">
              Registrar
            </a>
            {error && <p className="error-message">{error}</p>} {/* Mostrar mensaje de error */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;