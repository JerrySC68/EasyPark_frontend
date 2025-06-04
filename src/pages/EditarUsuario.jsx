import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Alert } from "../components/ModalAlert";
import '../assets/css/Modal.css';
import { useValidaciones } from '../components/useValidaciones';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config/firebaseConfig";

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const EditarUsuario = () => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: ''
  });

  const [mostrar, setMostrar] = useState(false);
  const [alerta, setAlerta] = useState({ show: false, type: '', text: '' });
  const [verificada, setVerificada] = useState(false);
  const [passwordIngreso, setPasswordIngreso] = useState('');
  const [loading, setLoading] = useState(false);

  const erroresCampo = useValidaciones({
    email: form.email,
    password: form.password,
    telefono: form.telefono
  });

  const id = localStorage.getItem("iduser");
  const token = localStorage.getItem("easypark_token");

  const validarPasswordIngreso = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuario no autenticado");

      const credential = EmailAuthProvider.credential(user.email, passwordIngreso);
      await reauthenticateWithCredential(user, credential);
      setVerificada(true);
    } catch (err) {
      console.error("❌ Error al verificar con Firebase:", err);
      setAlerta({
        show: true,
        type: "error",
        text: "Contraseña incorrecta o sesión no válida."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!verificada) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setForm({
          nombre: data.nombre || '',
          email: data.email || '',
          telefono: data.telefono || '',
          password: data.password || ''
        });
      })
      .catch(err => {
        console.error("❌ Error al obtener usuario:", err);
        setAlerta({
          show: true,
          type: "error",
          text: "No se pudo obtener la información del usuario."
        });
      });
  }, [verificada]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleMostrar = () => setMostrar(!mostrar);

  const handleGuardar = () => {
    const hayErrores = Object.values(erroresCampo).some(error => error !== "");
    const nombreValido = form.nombre.trim().length > 0;

    if (!nombreValido || hayErrores) {
      setAlerta({
        show: true,
        type: "error",
        text: "Por favor, corrige los datos ingresados."
      });
      return;
    }

    const uidFirebase = auth.currentUser?.uid;

    fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/editar/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...form,
        uid: uidFirebase
      })
    })
      .then(res => res.json())
      .then(() => {
        setAlerta({
          show: true,
          type: "success",
          text: "Usuario actualizado correctamente."
        });
        setTimeout(() => {
          window.location.href = "/Bienvenida";
        }, 2000);
      })
      .catch(err => {
        console.error("❌ Error al actualizar usuario:", err);
        setAlerta({
          show: true,
          type: "error",
          text: "No se pudo actualizar el usuario."
        });
      });
  };

 if (!verificada) {
  return (
    <div className="container mt-5">
      <h3>Confirmar identidad</h3>
      <p>Por seguridad, ingresa tu contraseña para continuar.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault(); // evita recarga y permite usar Enter
          validarPasswordIngreso();
        }}
      >
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Contraseña"
          value={passwordIngreso}
          
          autoComplete="current-password"
          onChange={(e) => setPasswordIngreso(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Verificando..." : "Continuar"}
        </button>
      </form>

      {alerta.show && (
        <Alert
          type={alerta.type}
          message={alerta.text}
          onClose={() => setAlerta({ ...alerta, show: false })}
        />
      )}
    </div>
  );
}


  return (
    <div className="container mt-5">
      <h2 className="mb-4">Editar Usuario</h2>

      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input
          type="text"
          className="form-control"
          name="nombre"
          autoComplete="username"
          value={form.nombre}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Correo</label>
        <input
          type="email"
          className={`form-control ${erroresCampo.email ? 'is-invalid' : ''}`}
          name="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
        />
        {erroresCampo.email && <div className="invalid-feedback">{erroresCampo.email}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Teléfono</label>
        <input
          type="tel"
          className={`form-control ${erroresCampo.telefono ? 'is-invalid' : ''}`}
          name="telefono"
          autoComplete="telefono"
          value={form.telefono}
          onChange={handleChange}
        />
        {erroresCampo.telefono && <div className="invalid-feedback">{erroresCampo.telefono}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Nueva Contraseña</label>
        <div className="input-group">
          <input
            type={mostrar ? 'text' : 'password'}
            className={`form-control ${erroresCampo.password ? 'is-invalid' : ''}`}
            name="password"
            autoComplete="password"
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={toggleMostrar}
          >
            {mostrar ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {erroresCampo.password && <div className="invalid-feedback d-block ms-2">{erroresCampo.password}</div>}
      </div>

      <button className="btn btn-primary w-100" onClick={handleGuardar}>
        Guardar Cambios
      </button>

      {alerta.show && (
        <Alert
          type={alerta.type}
          message={alerta.text}
          onClose={() => setAlerta({ ...alerta, show: false })}
        />
      )}
    </div>
  );
};
