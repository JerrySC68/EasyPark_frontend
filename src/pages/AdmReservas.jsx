import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Html5QrcodeScanner } from "html5-qrcode";
import successSound from "../assets/success.mp3";

export const AdmReservas = () => {
  const [tab, setTab] = useState("pendientes");
  const [pendientes, setPendientes] = useState([]);
  const [confirmadas, setConfirmadas] = useState([]);
  const [mostrarQRScanner, setMostrarQRScanner] = useState(false);
  const [modalCancelar, setModalCancelar] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [motivo, setMotivo] = useState("");
  const [busquedaUsuario, setBusquedaUsuario] = useState("");
  const [castigarUsuario, setCastigarUsuario] = useState(false);


  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    const token = localStorage.getItem("easypark_token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/propiedades/pendientes-confirmadas`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    
    setPendientes(data.pendientes);
    setConfirmadas(data.confirmadas);
  };

  const aceptar = async (idReserva) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/propiedades/aceptar/${idReserva}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("easypark_token")}` }
    });
    cargarReservas();
  };

  const cancelar = async () => {
  const token = localStorage.getItem("easypark_token");
  await fetch(`${import.meta.env.VITE_API_URL}/api/propiedades/reservas/cancelar/${reservaSeleccionada.idReserva}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ motivo })
  });

  if (castigarUsuario) {
    await fetch(`${import.meta.env.VITE_API_URL}/api/propiedades/reservas/castigar/${reservaSeleccionada.idReserva}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  setModalCancelar(false);
  setMotivo("");
  setCastigarUsuario(false);
  cargarReservas();
};


 

 const marcarComoLlegado = async ({ idReserva, qr_code = null }) => {
  const token = localStorage.getItem("easypark_token");

  const payload = {};
  if (qr_code) payload.qr_code = qr_code;
  if (idReserva) payload.idReserva = idReserva;

  if (!payload.qr_code && !payload.idReserva) {
    console.error("Falta qr_code o idReserva");
    return;
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/propiedades/reservas/completar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const error = await res.json();
    console.error("Error completando reserva:", error);
  }

  cargarReservas();
};



  const iniciarQRScanner = () => {
    setMostrarQRScanner(true);
  };

  useEffect(() => {
    if (mostrarQRScanner) {
      const scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });

      scanner.render(async (qrCode) => {
        const audio = new Audio(successSound);
        audio.play();

        await marcarComoLlegado(qrCode);
        scanner.clear();
        setMostrarQRScanner(false);
      });

      return () => {
        scanner.clear().catch(() => {});
      };
    }
  }, [mostrarQRScanner]);

  const calcularRetraso = (horaReserva) => {
    const ahora = new Date();
    let horaLimpia = horaReserva.includes("T")
      ? horaReserva.split("T")[1]
      : horaReserva.includes(".")
      ? horaReserva.split(".")[0]
      : horaReserva;

    const [horas, minutos, segundos] = horaLimpia.split(":").map(Number);

    const horaReservaDate = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate(),
      horas,
      minutos,
      segundos || 0
    );

    return Math.floor((ahora - horaReservaDate) / 60000);
  };

  const reservasFiltradas = (lista) => {
    if (!busquedaUsuario.trim()) return lista;
    return lista.filter(r =>
      r.nombreUsuario?.toLowerCase().includes(busquedaUsuario.toLowerCase())
    );
  };

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Administrar Reservas</h3>
        <Button variant="primary" onClick={iniciarQRScanner}>📷 Escanear QR</Button>
      </div>

      <div className="input-group mb-3">
        <Form.Control
          placeholder="Buscar por nombre de usuario"
          value={busquedaUsuario}
          onChange={(e) => setBusquedaUsuario(e.target.value)}
        />
      </div>

      <div className="btn-group mb-3">
        <Button variant={tab === "pendientes" ? "dark" : "outline-dark"} onClick={() => setTab("pendientes")}>Pendientes</Button>
        <Button variant={tab === "confirmadas" ? "dark" : "outline-dark"} onClick={() => setTab("confirmadas")}>Confirmadas</Button>
      </div>

      {tab === "pendientes" && reservasFiltradas(pendientes).map(reserva => (
        <div className="card mb-2" key={reserva.idReserva}>
          <div className="card-body">
            <h5>{reserva.tipo === "estacionamiento" ? "Estacionamiento" : "Garaje"} - {reserva.direccion}</h5>
            <p><strong>Usuario:</strong> {reserva.nombreUsuario}</p>
            <Button variant="success" onClick={() => aceptar(reserva.idReserva)}>Aceptar</Button>
          </div>
        </div>
      ))}

      {tab === "confirmadas" && reservasFiltradas(confirmadas).map(reserva => {
        const minutos = calcularRetraso(reserva.hora_reserva);
        return (
          <div className="card mb-2" key={reserva.idReserva}>
            <div className="card-body">
              <h5>{reserva.tipo === "estacionamiento" ? "Estacionamiento" : "Garaje"} - {reserva.direccion}</h5>
              <p><strong>Usuario:</strong> {reserva.nombreUsuario}</p>
              <p className={minutos > 10 ? "text-danger fw-bold" : ""}>Tiempo desde: {minutos} minutos</p>
              {reserva.qr_code && (
                    
                        <Button
                      variant="success"
                      onClick={() => marcarComoLlegado({
                        idReserva: reserva.idReserva, // siempre lo enviás
                        qr_code: reserva.qr_code || null // solo si existe
                      })}
                    >
                      ✅ Llegó
                    </Button>


              )}{" "}
              <Button variant="danger" onClick={() => { setReservaSeleccionada(reserva); setModalCancelar(true); }}>Cancelar</Button>{" "}
              
            </div>
          </div>
        );
      })}

      {mostrarQRScanner && (
        <div id="qr-reader" className="mb-4" style={{ width: "100%" }}></div>
      )}

      <Modal show={modalCancelar} onHide={() => setModalCancelar(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Motivo de Cancelación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Motivo</Form.Label>
            <Form.Control as="textarea" value={motivo} onChange={e => setMotivo(e.target.value)} />
          </Form.Group>
          <Form.Check
            type="checkbox"
            label="Aplicar castigo al usuario"
            checked={castigarUsuario}
            onChange={(e) => setCastigarUsuario(e.target.checked)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalCancelar(false)}>Cerrar</Button>
          <Button variant="danger" onClick={cancelar}>Confirmar Cancelación</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};
