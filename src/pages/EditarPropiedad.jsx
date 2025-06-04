import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert } from '../components/ModalAlert';

export const EditarPropiedad = () => {
  const { id, tipo } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    latitud: '',
    longitud: '',
    disponibilidad: '',
    horario: '',
    anchura: '',
    altura: ''
  });
  const [vehiculos, setVehiculos] = useState([]);
  const [nuevoVehiculo, setNuevoVehiculo] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [alertData, setAlertData] = useState({ type: '', message: '' });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/${tipo === 'Garaje' ? 'garajes' : 'estacionamientos'}/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('easypark_token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setForm(data);
        if (data.vehiculos) setVehiculos(data.vehiculos);
        console.log(data);
      })
      .catch(err => {
        console.error("Error al cargar:", err);
        setAlertData({ type: 'error', message: 'No se pudo cargar la propiedad' });
      });
  }, [id, tipo]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const agregarVehiculo = () => {
    if (!nuevoVehiculo.trim() || !nuevoPrecio.trim()) return;
    setVehiculos([...vehiculos, { tipo: nuevoVehiculo, precio: nuevoPrecio }]);
    setNuevoVehiculo('');
    setNuevoPrecio('');
  };

  const eliminarVehiculo = () => {
    if (filaSeleccionada !== null) {
      setVehiculos(vehiculos.filter((_, i) => i !== filaSeleccionada));
      setFilaSeleccionada(null);
    }
  };

  const handleGuardar = async () => {
    for (let key in form) {
      if (!`${form[key]}`.trim()) {

        setAlertData({ type: 'warning', message: `El campo "${key}" no puede estar vacío` });
        return;
      }
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/${tipo === 'Garaje' ? 'garajes' : 'estacionamientos'}/editar/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('easypark_token')}`
        },
        body: JSON.stringify({ ...form, vehiculos: vehiculos.map(v => ({
             tipo_vehiculo: v.tipo_vehiculo || v.tipo,
             tarifa_hora: v.tarifa_hora || v.precio,
            idTarifaEst: v.idTarifaEst || v.idTarifaGaraje
          })) })
      });

      if (response.ok) {
        setAlertData({ type: 'success', message: 'Propiedad actualizada correctamente' });
        setTimeout(() => navigate('/MisPropiedades'), 2000);
      } else {
        setAlertData({ type: 'error', message: 'Error al actualizar la propiedad' });
      }
    } catch (err) {
      console.error("Error:", err);
      setAlertData({ type: 'error', message: 'Error al conectar con el servidor' });
    }
  };

  return (
    <div className="container mt-4">
      <h2>Editar {tipo}</h2>

      <div className="row">
        {Object.keys(form).map((campo) => {
          const camposExcluidos = ['camposLibres', 'vehiculos', 'estado'];
          const excluirPorTipo = tipo === 'Garaje' && campo === 'nombre';

          if (camposExcluidos.includes(campo) || excluirPorTipo) return null;

          return (
            <div key={campo} className="col-md-6 mb-3">
              <label className="form-label text-capitalize">{campo}</label>
              <input 
                type="text"
                name={campo}
                value={form[campo] || ''}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          );
        })}

      </div>

      {/* Sección para agregar vehículos */}
      <div className="row align-items-end">
        <div className="col-md-6 mb-3">
          <label className="form-label">Tipo de vehículo</label>
          <input
            type="text"
            className="form-control"
            value={nuevoVehiculo}
            onChange={(e) => setNuevoVehiculo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && agregarVehiculo()}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Precio por hora</label>
          <input
            type="text"
            className="form-control"
            value={nuevoPrecio}
            onChange={(e) => setNuevoPrecio(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && agregarVehiculo()}
          />
        </div>
        <div className="col-md-2 mb-3 d-flex gap-2">
          <button className="btn btn-primary" onClick={agregarVehiculo}>+</button>
          <button className="btn btn-danger" onClick={eliminarVehiculo}>-</button>
        </div>
      </div>

      {/* Tabla para pantallas grandes */}
      <div className="d-none d-md-block table-responsive mb-3">
        <table className="table table-bordered text-center">
          <thead className="table-light">
            <tr>
              <th>Vehículo</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.length === 0 ? (
              <tr><td colSpan="2">No hay vehículos registrados</td></tr>
            ) : (
              vehiculos.map((v, i) => (
                
                <tr key={i} className={filaSeleccionada === i ? "table-primary" : ""} onClick={() => setFilaSeleccionada(i)}>
                  <td>{v.tipo_vehiculo || v.tipo }</td>
                  <td>{v.precio || v.tarifa_hora}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Tarjetas para móviles */}
      <div className="d-block d-md-none mb-3">
        {vehiculos.length === 0 ? (
          <p className="text-center">No hay vehículos registrados</p>
        ) : (
          vehiculos.map((v, i) => (
            <div
              key={i}
              className={`card mb-2 shadow-sm ${filaSeleccionada === i ? "border-primary" : ""}`}
              onClick={() => setFilaSeleccionada(i)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body">
                <h6 className="card-title mb-1">Vehículo: {v.tipo_vehiculo || v.tipo}</h6>
                <p className="card-text mb-0"> ₡{v.precio || v.tarifa_hora}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="btn btn-success" onClick={handleGuardar}>Guardar Cambios</button>

      <Alert
        type={alertData.type}
        message={alertData.message}
        onClose={() => setAlertData({ type: '', message: '' })}
      />
    </div>
  );
};
