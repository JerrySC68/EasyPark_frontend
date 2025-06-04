import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Table } from "react-bootstrap";
import QRCode from "react-qr-code";

export const ReservasPage = () => {
  const [reservas, setReservas] = useState([]);
  const [qrReserva, setQrReserva] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [destino, setDestino] = useState(null);
  const [showNavModal, setShowNavModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const qrRef = useRef(null);

  const formatearTipo = (tipo) => {
    return tipo === "estacionamiento" ? "Estacionamiento" : "Garaje Privado";
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);

    fetch(`${import.meta.env.VITE_API_URL}/api/propiedades/pendientes-aceptadas`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('easypark_token')}`
      }
    })
      .then((res) => res.json())
      .then((data) => setReservas(data))
      .catch((err) => console.error(err));

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const verQR = (qr) => {
    setQrReserva(qr);
    setShowQRModal(true);
  };

  const irNavegacion = (lat, lng, tipo, direccion) => {
    setDestino({ lat, lng, tipo, direccion });
    setShowNavModal(true);
  };

  const cancelarReserva = (idReserva) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/propiedades/cancelar/${idReserva}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('easypark_token')}`
      },
    }).then(() => {
      setReservas(prev => prev.filter(r => r.idReserva !== idReserva));
    });
  };

  const descargarQR = () => {
    const svg = qrRef.current.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "reserva_qr.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="container mt-4">
      <h2>Mis Reservas Pendientes o Aceptadas</h2>

      {isMobile ? (
        <div className="row">
          {reservas.map((reserva) => (
            <div className="col-12 mb-3" key={reserva.idReserva}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{formatearTipo(reserva.tipo)}</h5>
                  <p className="card-text">Dirección: {reserva.direccion}</p>
                  <p className="card-text">Estado: {reserva.estado}</p>
                  <div className="d-grid gap-2">
                    <Button onClick={() => verQR(reserva.qr_code)}>Ver QR</Button>
                    <Button
                      variant="info"
                      onClick={() =>
                        irNavegacion(
                          reserva.latitud,
                          reserva.longitud,
                          reserva.tipo,
                          reserva.direccion
                        )
                      }
                    >
                      Navegar
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => navigate("/MapaReserva", { state: reserva })}
                    >
                      Ver Mapa
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => cancelarReserva(reserva.idReserva)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Dirección</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva.idReserva}>
                <td>{formatearTipo(reserva.tipo)}</td>
                <td>{reserva.direccion}</td>
                <td>{reserva.estado}</td>
                <td className="d-flex gap-2 flex-wrap">
                  <Button size="sm" onClick={() => verQR(reserva.qr_code)}>Ver QR</Button>
                  <Button
                    size="sm"
                    variant="info"
                    onClick={() =>
                      irNavegacion(
                        reserva.latitud,
                        reserva.longitud,
                        reserva.tipo,
                        reserva.direccion
                      )
                    }
                  >
                    Navegar
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate("/MapaReserva", { state: reserva })}
                  >
                    Ver Mapa
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => cancelarReserva(reserva.idReserva)}
                  >
                    Cancelar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal QR */}
      <Modal show={showQRModal} onHide={() => setShowQRModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Código QR</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div ref={qrRef} style={{ background: "white", padding: "16px", display: "inline-block" }}>
            <QRCode value={qrReserva || ""} size={200} />
          </div>
          <Button className="mt-3" onClick={descargarQR}>
            Descargar
          </Button>
        </Modal.Body>
      </Modal>

      {/* Modal Navegación */}
      <Modal show={showNavModal} onHide={() => setShowNavModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Navegar a Destino</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Destino:</p>
          <p><strong>{formatearTipo(destino?.tipo)}</strong></p>
          <p>{destino?.direccion}</p>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${destino?.lat},${destino?.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Ir a Google Maps
          </a>
        </Modal.Body>
      </Modal>
    </div>
  );
};
