// ModalPrivacidad.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";

export const ModalPrivacidad = ({ show, handleClose }) => (
  <Modal show={show} onHide={handleClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>Política de Privacidad</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>Tu privacidad es importante:</p>
      <ul>
        <li>Recolectamos datos como tu nombre y ubicación.</li>
        <li>No compartimos tu información sin consentimiento.</li>
        <li>Usamos tus datos para mejorar el servicio.</li>
        <li>Protegemos tus datos con medidas de seguridad.</li>
        <li>Puedes solicitar cambios o eliminación de tus datos.</li>
      </ul>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Cerrar
      </Button>
    </Modal.Footer>
  </Modal>
);