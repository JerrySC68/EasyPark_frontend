// ModalAcuerdo.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";

export const ModalAcuerdo = ({ show, handleClose }) => (
  <Modal show={show} onHide={handleClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>Acuerdo de Usuario</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>Al utilizar la aplicación EasyPark, aceptas los siguientes términos:</p>
      <ul>
        <li>Aceptas proporcionar información veraz durante el registro.</li>
        <li>Eres responsable del uso de tu cuenta y de mantener tu contraseña segura.</li>
        <li>El uso del servicio está sujeto a las normas de tránsito y uso de parqueo locales.</li>
        <li>EasyPark no se hace responsable por pérdidas, robos o daños en parqueos registrados o informales.</li>
        <li>Tu cuenta puede ser suspendida si incumples los términos.</li>
      </ul>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Cerrar
      </Button>
    </Modal.Footer>
  </Modal>
);