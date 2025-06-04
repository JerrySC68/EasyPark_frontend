// ComentariosPage.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export const Comentario= () => {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [comentario, setComentario] = useState("");
  const [puntuacion, setPuntuacion] = useState(0);

 const buscar = async () => {
  if (!busqueda.trim()) return;

  const token = localStorage.getItem("easypark_token"); // Asegúrate de haberlo guardado con este nombre

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comentarios/estacionamientos?nombre=${encodeURIComponent(busqueda)}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Error al buscar parqueos");

    const data = await res.json();
    setResultados(data);
  } catch (error) {
    console.error("Error en búsqueda:", error);
  }
};



  const enviarComentario = async () => {
  const usuarioId = localStorage.getItem("iduser");
  const token = localStorage.getItem("easypark_token");

  // Validar que haya un seleccionado
  if (!seleccionado) {
    alert("Debe seleccionar un parqueo primero.");
    return;
  }

  // Construir el body dinámicamente
  const body = {
    usuario_id: usuarioId,
    puntuacion,
    comentario,
    fecha: new Date(),
  };

  if (seleccionado.tipo === "estacionamiento") {
    body.estacionamiento_id = seleccionado.id;
  } else if (seleccionado.tipo === "garaje") {
    body.garaje_id = seleccionado.id;
  } else {
    alert("Tipo de parqueo desconocido.");
    return;
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comentarios/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("Error al enviar comentario");

    alert("Comentario enviado con éxito.");
    setMostrarModal(false);
    setComentario("");
    setPuntuacion(0);
  } catch (err) {
    console.error("Error al enviar comentario:", err);
    alert("Hubo un error al enviar el comentario.");
  }
};



  return (
    <div className="container mt-4">
      <h3>Buscar Estacionamiento</h3>
      <h2>Nombre del estacionamiento o del propietario(Garaje Privado)</h2>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Nombre"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <Button onClick={buscar}>Buscar</Button>

      <ul className="list-group mt-3">
        {resultados.map((est) => (
          <li
            key={est.id}
            className="list-group-item list-group-item-action"
            onClick={() => {
              setSeleccionado(est);
              setMostrarModal(true);
            }}
          >
            {est.tipo === "garaje" ? `Garaje: ${est.nombre}` : est.nombre}
          </li>

        ))}
      </ul>

      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Agregar comentario a {seleccionado?.tipo === "garaje" ? `Garaje: ${seleccionado.nombre}` : seleccionado?.nombre}
          </Modal.Title>

        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Comentario</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Puntuación</Form.Label>
            <div>
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  onClick={() => setPuntuacion(n)}
                  style={{
                    cursor: "pointer",
                    fontSize: "2rem",
                    color: n <= puntuacion ? "#ffc107" : "#e4e5e9",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={enviarComentario}>Enviar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
