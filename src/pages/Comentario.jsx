// ComentariosPage.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Alert,Confirm  } from "../components/ModalAlert"; // Ajusta la ruta si es distinta



export const Comentario= () => {
  const { id } = useParams();
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [comentario, setComentario] = useState("");
  const [puntuacion, setPuntuacion] = useState(0);
  const [puedeComentar, setPuedeComentar] = useState(true);
  const [alerta, setAlerta] = useState({ mostrar: false, tipo: "", mensaje: "" });
  const [confirmarEnvio, setConfirmarEnvio] = useState(false);

  const mostrarAlerta = (tipo, mensaje) => {
    setAlerta({ mostrar: true, tipo, mensaje });
  };

  const cerrarAlerta = () => {
    setAlerta({ mostrar: false, tipo: "", mensaje: "" });
  };

useEffect(() => {
    
    if (id) {
      // Buscar por ID automáticamente
       
      buscarPorId(id);
    }
  }, [id]);

  const buscarPorId = async (id) => {
    const token = localStorage.getItem("easypark_token");
    try {
      
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comentarios/propiedad/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("No se encontró la propiedad");
      

      const data = await res.json();
      setBusqueda(data.nombre || data.propietario || ""); // Asignar nombre o propietario al campo de búsqueda
      setSeleccionado(data); // debe contener { id, nombre, tipo }
      verificarSiPuedeComentar(localStorage.getItem("iduser"), data.tipo, data.id);
    } catch (error) {
      console.error("Error buscando por ID:", error);
    }
  };
  const verificarSiPuedeComentar = async (usuarioId, tipo, propiedadId) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comentarios/puede-comentar/${usuarioId}/${tipo}/${propiedadId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("easypark_token")}` },
    });

    const data = await res.json();
    setPuedeComentar(data.puedeComentar);
    if (data.puedeComentar) {
        setMostrarModal(true);
      } else {
        mostrarAlerta("warning", "Solo puedes comentar si ya has completado una reserva en este lugar.");
      }
  } catch (error) {
    console.error("Error al verificar permiso para comentar:", error);
    setPuedeComentar(false);
    mostrarAlerta("error", "Hubo un error al verificar si puedes comentar.");
  }
};


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
  mostrarAlerta("warning", "Debe seleccionar un parqueo primero.");
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
    mostrarAlerta("error", "Tipo de parqueo desconocido.");
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

    mostrarAlerta("success", "Comentario enviado con éxito.");
    setMostrarModal(false);
    setComentario("");
    setPuntuacion(0);
  } catch (err) {
    console.error("Error al enviar comentario:", err);
    mostrarAlerta("error", "Hubo un error al enviar el comentario.");
  }
};



  return (
    <div className="container mt-4">
      <h3>Buscar Estacionamiento</h3>
      <h2>Nombre del estacionamiento o del propietario(Garaje Privado)</h2>
      <input
        type="text"
        className="form-control mb-3 bg-light"
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
              verificarSiPuedeComentar(localStorage.getItem("iduser"), est.tipo, est.id);
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
          <Button variant="primary" onClick={() => setConfirmarEnvio(true)}>Enviar</Button>
        </Modal.Footer>
      </Modal>
       {confirmarEnvio && (
        <Confirm
          message="¿Estás seguro de enviar este comentario?"
          onConfirm={() => {
            setConfirmarEnvio(false);
            enviarComentario();
          }}
          onClose={() => setConfirmarEnvio(false)}
        />
      )}
      {alerta.mostrar && (
        <Alert type={alerta.tipo} message={alerta.mensaje} onClose={cerrarAlerta} />
      )}

    </div>
  );
};
