import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/ParkAdm.css";
import { Alert } from "../components/ModalAlert";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/logo-easyPark.jpeg";

export const ParkAdm = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [nuevoVehiculo, setNuevoVehiculo] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [tipoParqueo, setTipoParqueo] = useState("");
  const [horario, setHorario] = useState("");
  const [nombreParqueo, setNombreParqueo] = useState("");
  const [alturaEspacio, setAlturaEspacio] = useState("");
  const [anchuraEspacio, setAnchuraEspacio] = useState("");
  const [disponibilidad, setCantidadCampos] = useState("");
  const [longitud, setLongitud] = useState("");
  const [direccion, setDireccion] = useState("");
  const [latitud, setLatitud] = useState("");
  const [alertCustom, setAlertCustom] = useState({ type: '', message: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("easypark_token");
    if (!token) navigate("/");
  }, []);

  const resetFormulario = () => {
    setTipoParqueo("");
    setNombreParqueo("");
    setDireccion("");
    setLatitud("");
    setLongitud("");
    setHorario("");
    setAlturaEspacio("");
    setAnchuraEspacio("");
    setCantidadCampos("");
    setVehiculos([]);
    setFilaSeleccionada(null);
  };

  const agregarVehiculo = () => {
    if (nuevoVehiculo.trim() && !isNaN(nuevoPrecio) && nuevoPrecio.trim()) {
      setVehiculos([...vehiculos, { tipo: nuevoVehiculo, precio: nuevoPrecio }]);
      setNuevoVehiculo("");
      setNuevoPrecio("");
    }
  };

  const eliminarVehiculo = () => {
    if (filaSeleccionada !== null) {
      const copia = [...vehiculos];
      copia.splice(filaSeleccionada, 1);
      setVehiculos(copia);
      setFilaSeleccionada(null);
    }
  };

  const handleRegistrar = async () => {
    const token = localStorage.getItem("easypark_token");
    if (!token) {
      setAlertCustom({ type: 'error', message: 'No autorizado' });
      return;
    }

    const errores = [];
    if (!tipoParqueo) errores.push('Tipo de parqueo es requerido.');
    if (tipoParqueo !== "Garajes Privados" && !nombreParqueo.trim()) errores.push('Nombre del parqueo es requerido.');
    if (!direccion.trim()) errores.push('Dirección es requerida.');
    if (!longitud.trim()) errores.push('Longitud es requerida.');
    if (!latitud.trim()) errores.push('Latitud es requerida.');
    if (!horario.trim()) errores.push('Horario es requerido.');
    if (!alturaEspacio.trim()) errores.push('Altura del espacio es requerida.');
    if (!anchuraEspacio.trim()) errores.push('Anchura del espacio es requerida.');
    if (!disponibilidad.trim()) errores.push('Cantidad de campos es requerida.');
    if (vehiculos.length === 0) errores.push('Debe agregar al menos un vehículo.');

    if (errores.length > 0) {
      setAlertCustom({ type: 'error', message: errores.join(' ') });
      return;
    }

    try {
      let url = "";
      let body = {};

      if (tipoParqueo === "Garajes Privados") {
        url = `${import.meta.env.VITE_API_URL}/api/garajes/guardar`;
        body = JSON.stringify({
          direccion,
          latitud,
          longitud,
          horario,
          estado: "ocupado",
          disponibilidad,
          anchura: anchuraEspacio,
          altura: alturaEspacio,
          fecha_inscripcion: new Date().toISOString(),
          vehiculos: vehiculos.map(v => ({
            tipo_vehiculo: v.tipo,
            tarifa_hora: v.precio
          }))
        });
      } else {
        url = `${import.meta.env.VITE_API_URL}/api/estacionamientos/guardar`;
        body = JSON.stringify({
          nombre: nombreParqueo,
          direccion,
          longitud,
          latitud,
          horario,
          altura: alturaEspacio,
          anchura: anchuraEspacio,
          disponibilidad,
          fecha_registro: new Date().toISOString(),
          vehiculos: vehiculos.map(v => ({
            tipo_vehiculo: v.tipo,
            tarifa_hora: v.precio
          }))
        });
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body
      });

      const result = await response.json();

      if (response.ok) {
        setAlertCustom({ type: 'success', message: 'Parqueo registrado con éxito' });
        resetFormulario();
        navigate("/Bienvenida");
      } else {
        setAlertCustom({ type: 'error', message: result.error || 'No se pudo registrar' });
      }
    } catch (error) {
      console.error("❌ Error al registrar:", error);
      setAlertCustom({ type: 'error', message: 'Error de red' });
    }
  };

  const handleCloseAlert = () => {
    setAlertCustom({ type: '', message: '' });
  };

 return (
  <div className="Fondo">
    <div className="content-box">
      <form onSubmit={(e) => { e.preventDefault(); handleRegistrar(); }}>
        <div className="text-center mb-4">
          <img 
            src={logo}
            alt="EasyPark Logo" 
            className="logo" 
          />
          <h2 className="spanLog ">Registro de Parqueo/Garaje</h2>
        </div>

        <div className="form-group">
          <label htmlFor="tipoParqueo">Tipo de parqueo</label>
          <select className="form-select" id="tipoParqueo" value={tipoParqueo} onChange={(e) => setTipoParqueo(e.target.value)}>
            <option value="">Selecciona tipo de parqueo</option>
            <option value="Estacionamientos">Estacionamientos</option>
            <option value="Garajes Privados">Garajes Privados</option>
          </select>
        </div>

        {tipoParqueo !== "Garajes Privados" && (
          <div className="form-group">
            <label htmlFor="nombreParqueo">Nombre del parqueo/garaje</label>
            <input placeholder="Nombre " type="text" className="form-control bg-light" id="nombreParqueo" value={nombreParqueo} onChange={(e) => setNombreParqueo(e.target.value)} />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="direccion">Dirección</label>
          <input placeholder="Dirección" type="text" className="form-control bg-light" id="direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
        </div>

        <div className="row">
          <div className="form-group col-md-6">
            <label htmlFor="longitud">Longitud</label>
            <input placeholder="Longitud" type="text" className="form-control bg-light" id="longitud" value={longitud} onChange={(e) => setLongitud(e.target.value)} />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="latitud">Latitud</label>
            <input placeholder="Latitud " type="text" className="form-control bg-light" id="latitud" value={latitud} onChange={(e) => setLatitud(e.target.value)} />
          </div>
        </div>

        <div className="row">
          <div className="form-group col-md-6">
            <label htmlFor="alturaEspacio">Altura del campo (m)</label>
            <input placeholder="Altura " type="number" className="form-control bg-light" id="alturaEspacio" value={alturaEspacio} onChange={(e) => setAlturaEspacio(e.target.value)} />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="anchuraEspacio">Anchura del campo (m)</label>
            <input placeholder="Anchura" type="number" className="form-control bg-light" id="anchuraEspacio" value={anchuraEspacio} onChange={(e) => setAnchuraEspacio(e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="disponibilidad">Cantidad de campos</label>
          <input placeholder="Cantidad" type="number" className="form-control bg-light" id="disponibilidad" value={disponibilidad} onChange={(e) => setCantidadCampos(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor="horario">Horario de atención</label>
          <div className="d-flex gap-2">
            <div className="w-50">
              <label>Desde</label>
              <input
                type="time"
                className="form-control bg-light"
                value={horario?.split(" - ")[0] || ""}
                onChange={(e) => {
                  const hasta = horario?.split(" - ")[1] || "";
                  setHorario(`${e.target.value} - ${hasta}`);
                }}
              />
            </div>
            <div className="w-50">
              <label>Hasta</label>
              <input
                type="time"
                className="form-control bg-light"
                value={horario?.split(" - ")[1] || ""}
                onChange={(e) => {
                  const desde = horario?.split(" - ")[0] || "";
                  setHorario(`${desde} - ${e.target.value}`);
                }}
              />
            </div>
          </div>
        </div>


        <div className="row align-items-end">
          <div className="form-group col-md-6">
            <label htmlFor="nuevoVehiculo">Tipo de vehículo</label>
            <input placeholder="Vehículo" type="text" className="form-control bg-light" id="nuevoVehiculo" value={nuevoVehiculo} onChange={(e) => setNuevoVehiculo(e.target.value)} onKeyDown={(e) => e.key === "Enter" && agregarVehiculo()} />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="nuevoPrecio">Precio por hora</label>
            <input placeholder="Precio" type="text" className="form-control bg-light" id="nuevoPrecio" value={nuevoPrecio} onChange={(e) => setNuevoPrecio(e.target.value)} onKeyDown={(e) => e.key === "Enter" && agregarVehiculo()} />
          </div>
        </div>

        <div className="form-group d-flex gap-2">
          <button type="button" className="btn btn-primary btn-vehiculo" onClick={agregarVehiculo}>+</button>
          <button type="button" className="btn btn-danger btn-vehiculo" onClick={eliminarVehiculo}>-</button>
        </div>

        {/* Tabla escritorio */}
        <div className="d-none d-md-block table-responsive mb-3">
          <table className="table table-bordered text-center">
            <thead className="table-light">
              <tr><th>Vehículo</th><th>Precio</th></tr>
            </thead>
            <tbody>
              {vehiculos.length === 0 ? (
                <tr><td colSpan="2">No hay vehículos registrados</td></tr>
              ) : (
                vehiculos.map((v, i) => (
                  <tr key={i} className={filaSeleccionada === i ? "selected-row" : ""} onClick={() => setFilaSeleccionada(i)}>
                    <td>{v.tipo}</td>
                    <td>{v.precio}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Cards móvil */}
        <div className="d-block d-md-none mb-3">
          {vehiculos.map((v, i) => (
            <div key={i} className={`card mb-2 shadow-sm ${filaSeleccionada === i ? "border-primary" : ""}`} onClick={() => setFilaSeleccionada(i)} style={{ cursor: "pointer" }}>
              <div className="card-body">
                <h6 className="card-title mb-1">Vehículo: {v.tipo}</h6>
                <p className="card-text mb-0"><strong>Precio por hora:</strong> ₡{v.precio}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-success w-100 py-2">
            Registrar Parqueo/Garaje
          </button>
        </div>
      </form>

      <Alert type={alertCustom.type} message={alertCustom.message} onClose={handleCloseAlert} />
    </div>
  </div>
);
}