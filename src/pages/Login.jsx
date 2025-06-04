import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../assets/css/Login.css';
import { Alert, Confirm } from "../components/ModalAlert";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from '../config/firebaseConfig.js';
import { Eye, EyeOff } from 'lucide-react'; // 👈 Importar íconos

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const Login = () => {
  const [alertCustom, setAlertCustom] = useState({ type: '', message: '' });
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [mostrar, setMostrar] = useState(false); // 👈 Estado para ver contraseña
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setAlertCustom({ type: 'error', message: 'Complete todos los campos' });
      return;
    }

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

      if (!response.ok) throw new Error('No se pudo obtener información del usuario');
      const usuario = await response.json();

      localStorage.setItem('rol', usuario.tipo_usuarios);
      localStorage.setItem('iduser', usuario.idUsuario);
      localStorage.setItem('nombre', usuario.nombre);

      const rol = usuario.tipo_usuarios;
      if (rol === 'Admin' || rol === 'propietario' || rol === 'cliente') {
        setAlertCustom({ type: 'success', message: 'Inicio de sesión exitoso' });
        navigate('/Bienvenida');
      } else if (rol === 'propietariop') {
        setAlertCustom({ type: 'success', message: 'Inicio de sesión exitoso' });
        navigate('/Pendiente');
      } else if (rol === 'propietarioNo') {
        setAlertCustom({ type: 'error', message: 'Cuenta no autorizada' });
      }

    } catch (error) {
      console.error('❌ Error al iniciar sesión:', error.message);
      setAlertCustom({ type: 'error', message: 'Credenciales inválidas o error en Firebase' });
    }
  };

  const handleCloser = () => {
    setAlertCustom({ type: '', message: '' });
  };

  return (
    <div className="Fondo" data-theme='default'>
      <div className="content-box mx-auto p-4 shadow rounded bg-white bg-opacity-75">
        <div className="header-with-logo text-center mb-4 d-flex justify-content-center align-items-center gap-3">
          <form onSubmit={handleLogin}>
            <div className="form">
              <div className="form-group text-center">
                <img src="/src/assets/img/logo-easyPark.jpeg" alt="Logo" className="logo" />
              </div>
              <div className="form-group text-center mt-3">
                <span className="spanLog">Login</span>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  className="form-control"
                  autoComplete="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* 🔐 Campo con botón mostrar/ocultar contraseña */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-group">
                  <input
                    type={mostrar ? "text" : "password"}
                    className="form-control"
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setMostrar(!mostrar)}
                  >
                    {mostrar ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group mt-4 text-center">
                <button type="submit" className="btn btn-primary w-100">Enter</button>
                <Confirm
                  type={alertCustom.type}
                  message={alertCustom.message}
                  onConfirm={handleCloser}
                  onClose={handleCloser}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
