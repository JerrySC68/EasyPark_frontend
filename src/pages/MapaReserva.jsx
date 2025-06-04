import React from "react";
import { useLocation } from "react-router-dom";

export const MapaReserva = () => {
  const { state } = useLocation();
  const { latitud, longitud, direccion, idReserva } = state;

  const cancelar = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/reservas/cancelar/${idReserva}`, {
      method: "PUT",
    }).then(() => window.history.back());
  };

  return (
    <div className="container mt-3">
      <h4>Mapa de Reserva: {direccion}</h4>
      <iframe
        title="Google Maps"
        width="100%"
        height="400"
        style={{ border: 0 }}
        loading="lazy"
        src={`https://maps.google.com/maps?q=${latitud},${longitud}&z=15&output=embed`}
      ></iframe>
      <button className="btn btn-danger mt-3" onClick={cancelar}>Cancelar Reserva</button>
    </div>
  );
};
