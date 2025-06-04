import React, { useState,useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/Registrar.css'; 
import '../assets/css/Modal.css';
import { Alert, Confirm } from "../components/ModalAlert";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap'; 



export const AdmPendientes = () => {
  const [pendientes, setPendientes] = useState([]);
  const [tipoUsuarioEditando, setTipoUsuarioEditando] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [alertCustom, setAlertCustom] = useState({ type: '', message: '' });

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("easypark_token");
   
    if (!token) {
     navigate("/");
    }

         fetchPendientes();
  }, []);

  const fetchPendientes = async () => {
    const token = localStorage.getItem("easypark_token");
console.log(token)
  if (!token) {
    setAlertCustom({ type: 'error', message: 'No autorizado' });
    return;
  }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        console.log(response)
        const data = await response.json();
        setPendientes(data);
      } else {
        console.error('Error al obtener los pendientes:', response.statusText);
      }
    } catch (error) {
      console.error('Error de red al obtener los pendientes:', error);
    }
  };

  const handleEditTipoUsuario = (pendiente) => {
   
    setUsuarioSeleccionado(pendiente);
    setTipoUsuarioEditando(pendiente.tipo_usuarios);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUsuarioSeleccionado(null);
    setTipoUsuarioEditando('');
  };

  const handleUpdateTipoUsuario = async () => {
    const token = localStorage.getItem("easypark_token");

  if (!token) {
    setAlertCustom({ type: 'error', message: 'No autorizado' });
    return;
  }
   if (!tipoUsuarioEditando) return;
   
   
   
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/${usuarioSeleccionado.idUsuario}/tipo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ tipo_usuarios: tipoUsuarioEditando }),
      });
      
      if (response.ok) {
        
         setAlertCustom({ type: 'success', message: 'cambio correcto' });
        handleCloseModal();
        fetchPendientes(); 

      } else {
        console.error('Error al actualizar el tipo de usuario:', response.statusText);
      }
    } catch (error) {
      console.error('Error de red al actualizar el tipo de usuario:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Pendientes</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            
            <th>Nombre</th>
            <th>Pendiete</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pendientes.map((pendiente) => (
            <tr key={pendiente.idUsuario}>
              
              <td>{pendiente.nombre}</td>
              <td>⏳ Pendiente</td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => handleEditTipoUsuario(pendiente)}
                >
                  Aceptar/Negar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

     
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Tipo de Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="tipoUsuario">Tipo de Usuario</label>
               <select
                  className="form-select"
                  id="tipoUsuario"
                  value={tipoUsuarioEditando}
                  onChange={(e) => setTipoUsuarioEditando(e.target.value)} required
                >
                  <option value="">Seleccionar tipo de usuario</option>
                  
                  <option value="propietario">Aceptar</option>
                  <option value="propietarioNo">Negar</option>
                </select>

          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="secondary" onClick={handleUpdateTipoUsuario}>
            Cambiar
          </Button>
         
        </Modal.Footer>
      </Modal>
    </div>
  );
};


