import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Confirm } from "../components/ModalAlert";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from '../config/firebaseConfig.js';
import { Eye, EyeOff } from 'lucide-react';
import '../assets/css/Login.css';
import "bootstrap/dist/css/bootstrap.min.css";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const Login = () => {
  const [alertCustom, setAlertCustom] = useState({ type: '', message: '' });
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [mostrar, setMostrar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setAlertCustom({ type: 'error', message: 'Por favor complete todos los campos' });
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      localStorage.setItem('easypark_token', token);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Error al obtener información del usuario');
      const usuario = await response.json();

      localStorage.setItem('rol', usuario.tipo_usuarios);
      localStorage.setItem('iduser', usuario.idUsuario);
      localStorage.setItem('nombre', usuario.nombre);

      const rol = usuario.tipo_usuarios;
      if (rol === 'Admin' || rol === 'propietario' || rol === 'cliente') {
        setAlertCustom({ type: 'success', message: 'Inicio de sesión exitoso' });
        setTimeout(() => navigate('/Bienvenida'), 1500);
      } else if (rol === 'propietariop') {
        setAlertCustom({ type: 'success', message: 'Inicio de sesión exitoso' });
        setTimeout(() => navigate('/Pendiente'), 1500);
      } else if (rol === 'propietarioNo') {
        setAlertCustom({ type: 'error', message: 'Cuenta no autorizada' });
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
      setAlertCustom({ 
        type: 'error', 
        message: error.message.includes('Firebase') 
          ? 'Credenciales incorrectas' 
          : 'Error en el servidor' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloser = () => {
    setAlertCustom({ type: '', message: '' });
  };

  return (
    <div className="Fondo">
      <div className="content-box">
        <form onSubmit={handleLogin}>
          <div className="text-center mb-4">
            <img 
              src="/src/assets/img/logo-easyPark.jpeg" 
              alt="EasyPark Logo" 
              className="logo" 
            />
            <h2 className="spanLog">Iniciar Sesión</h2>
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              autoComplete="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-group">
              <input
                type={mostrar ? "text" : "password"}
                className="form-control"
                id="password"
                name="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setMostrar(!mostrar)}
                aria-label={mostrar ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {mostrar ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group mt-4">
            <button 
              type="submit" 
              className="btn btn-primary w-100 py-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Cargando...
                </>
              ) : 'Ingresar'}
            </button>
          </div>

          <div className="text-center mt-3">
            <a href="/forgot-password" className="text-decoration-none small text-muted">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </form>

        <Confirm
          type={alertCustom.type}
          message={alertCustom.message}
          onConfirm={handleCloser}
          onClose={handleCloser}
        />
      </div>
    </div>
  );
};