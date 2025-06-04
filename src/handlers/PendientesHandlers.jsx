import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/Registrar.css'; 
import '../assets/css/Modal.css';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { Alert, Confirm } from "../components/ModalAlert";
import {
  fetchPendientes,
  handleEditTipoUsuario,
  handleCloseModal,
  handleUpdateTipoUsuario
} from "../handlers/PendientesHandlers";

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
      return;
    }
    fetchPendientes(token, setPendientes, setAlertCustom);
  }, []);

  const handleAceptarNegarClick = (pendiente) => {
    handleEditTipoUsuario(pendiente, setUsuarioSeleccionado, setTipoUsuarioEditando, setShowModal);
  };

  const cerrarModal = () => {
    handleCloseModal(setShowModal, setUsuarioSeleccionado, setTipoUsuarioEditando);
  };

  const actualizarTipoUsuario = () => {
    const token = localStorage.getItem("easypark_token");
    handleUpdateTipoUsuario({
      token,
      usuarioSeleccionado,
      tipoUsuarioEditando,
      setAlertCustom,
      handleCloseModalCallback: cerrarModal
    });
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Pendientes</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Pendiente</th>
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
                  onClick={() => handleAceptarNegarClick(pendiente)}
                >
                  Aceptar/Negar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={cerrarModal}>
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
              onChange={(e) => setTipoUsuarioEditando(e.target.value)}
              required
            >
              <option value="">Seleccionar tipo de usuario</option>
              <option value="propietario">Aceptar</option>
              <option value="propietarioNo">Negar</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button variant="secondary" onClick={actualizarTipoUsuario}>
            Cambiar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
