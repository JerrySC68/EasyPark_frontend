import React, { useState,useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/Registrar.css'; 
import '../assets/css/Modal.css';
import { Alert, Confirm } from "../components/ModalAlert";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {firebaseConfig} from '../config/firebaseConfig.js'
import { ModalAcuerdo } from "../components/ModalAcuerdo";
import { ModalPrivacidad } from "../components/ModalPrivacidad";
import { useValidaciones } from "../components/useValidaciones";
import { handleRegistrar, handleCloseAlert } from '../handlers/registrarHandlers';
import { Eye, EyeOff } from 'lucide-react'; // 👈 Agregado



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const Registrar = () => {
  // Estados para los datos del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipoUsuarios, setTipoUsuarios] = useState('');
  const [telefono, setTelefono] = useState('');
const [alertCustom, setAlertCustom] = useState({ type: '', message: '' });
const [showAcuerdo, setShowAcuerdo] = useState(false);
const [showPrivacidad, setShowPrivacidad] = useState(false);
const[aceptoTerminos, setAceptoTerminos] = useState(false);
const erroresCampo = useValidaciones({ email, password, telefono });
const [mostrar, setMostrar] = useState(false); // 👈 Nuevo estado


  const navigate = useNavigate();
    const resetFormulario = () => {
      setNombre("");
      setEmail("");
      setPassword("");
      setTipoUsuarios('');
      setTelefono("");
      
    };

     useEffect(() => {
        
        const token = localStorage.getItem("easypark_token");
       
      }, []); 
 const onRegistrar = (e) => {
  e.preventDefault();
  handleRegistrar({
    nombre,
    email,
    password,
    tipoUsuarios,
    telefono,
    aceptoTerminos,
    token: localStorage.getItem("easypark_token"),
    setAlertCustom,
    navigate,
    resetFormulario,
    setEmailAuth: { signInWithEmailAndPassword, auth }
  });
};

  return (
   
    <div className="content-box mx-auto p-4 shadow rounded bg-white bg-opacity-75">
      <h1>Registro de Usuario</h1>
       <div className="form-group text-center">
  <img
    src="/src/assets/img/logo-easyPark.jpeg"
    alt="Logo"
    className="logo"
    style={{ maxWidth: '30%', height: 'auto' }}
  />
</div>

      <form onSubmit={onRegistrar}>
        
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input type="text" autoComplete="nombre" className="form-control" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className={`form-control ${erroresCampo.email ? 'is-invalid' : ''}`}
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {erroresCampo.email && <div className="invalid-feedback">{erroresCampo.email}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <div className="input-group">
            <input
              type={mostrar ? "text" : "password"}
              className={`form-control ${erroresCampo.password ? 'is-invalid' : ''}`}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setMostrar(!mostrar)}
              tabIndex={-1} // para que no interrumpa el tab de formulario
            >
              {mostrar ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {erroresCampo.password && <div className="invalid-feedback">{erroresCampo.password}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="tipoUsuarios" className="form-label">Tipo de Usuario</label>
          <select className="form-select" id="tipoUsuarios" value={tipoUsuarios} onChange={(e) => setTipoUsuarios(e.target.value)} required>
            <option value="">Seleccionar tipo de usuario</option>
            <option value="cliente">Cliente</option>
            <option value="propietariop">propietario</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="telefono" className="form-label">Teléfono</label>
          <input
            type="tel"
            className={`form-control ${erroresCampo.telefono ? 'is-invalid' : ''}`}
            id="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          {erroresCampo.telefono && <div className="invalid-feedback">{erroresCampo.telefono}</div>}
        </div>
        <div className="form-check mt-3 mb-4 d-flex align-items-center gap-1">
          <input
            className="form-check-input m-0"
            type="checkbox"
            id="checkAcuerdo"
            checked={aceptoTerminos}
            onChange={(e) => setAceptoTerminos(e.target.checked)}
          />
              <label className="form-check-label m-0" htmlFor="checkAcuerdo">
                Acepto los <button type="button" className="btn btn-link p-0" onClick={() => setShowAcuerdo(true)}>Términos de usuario</button> y la <button type="button" className="btn btn-link p-0" onClick={() => setShowPrivacidad(true)}>Política de Privacidad</button>
              </label>
      </div>

        <button type="submit" className="btn btn-primary" disabled={Object.keys(erroresCampo).length > 0}>
          Registrar Usuario
        </button>

      </form>
       <Alert
          type={alertCustom.type}
          message={alertCustom.message}
          onClose={() => handleCloseAlert(setAlertCustom)}
        />

        <Confirm
          type={alertCustom.type}
          message={alertCustom.message}
          onConfirm={() => handleCloseAlert(setAlertCustom)}
          onClose={() => handleCloseAlert(setAlertCustom)}
        />

       <ModalAcuerdo
        show={showAcuerdo}
        handleClose={() => setShowAcuerdo(false)}
      />
      <ModalPrivacidad
        show={showPrivacidad}
        handleClose={() => setShowPrivacidad(false)}
      />
    </div>
  );
};


