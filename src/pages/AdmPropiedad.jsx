// src/pages/AdministrarPropiedad.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToggleRight, ToggleLeft } from 'lucide-react';
import { Alert } from '../components/ModalAlert';
import '../assets/css/AdmPropiedad.css';
import '../assets/css/Modal.css'; // Asegúrate de que la ruta sea correcta

export const AdministrarPropiedad = () => {
  const { id, tipo } = useParams();
  const navigate = useNavigate();
  const [camposLibres, setCamposLibres] = useState(0);
  const [disponibilidad, setDisponibilidad] = useState(0);
  const [estado, setEstado] = useState(true);
  const [valorCambio, setValorCambio] = useState(1); // 🔧 Nuevo input para modificar
  const [alerta, setAlerta] = useState({ type: '', message: '' });

  useEffect(() => {
    const token = localStorage.getItem("easypark_token");

    fetch(`${import.meta.env.VITE_API_URL}/api/${tipo === 'Garaje' ? 'garajes' : 'estacionamientos'}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setCamposLibres(parseInt(data.camposLibres));
        setDisponibilidad(parseInt(data.disponibilidad));
        if (tipo === 'Garaje') {
          setEstado(data.estado === 'disponible' );
        }
      })
      .catch(() => {
        setAlerta({ type: 'error', message: 'Error al cargar la propiedad' });
      });
  }, [id, tipo]);

  const aumentar = () => {
    const nuevo = Math.min(camposLibres + parseInt(valorCambio || 1), disponibilidad);
    setCamposLibres(nuevo);
     setValorCambio(0);
  };

  const disminuir = () => {
    const nuevo = Math.max(camposLibres - parseInt(valorCambio || 1), 0);
    setCamposLibres(nuevo);
     setValorCambio(0);
  };

  const handleActualizar = async () => {
    const token = localStorage.getItem("easypark_token");

    if (camposLibres < 0 || camposLibres > disponibilidad) {
      setAlerta({
        type: 'warning',
        message: `Campos libres debe estar entre 0 y ${disponibilidad}`,
      });
      return;
    }

    const body = { camposLibres };

    if (tipo === 'Garaje') {
      body.estado = estado ? 'disponible' : 'ocupado';
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/propiedades/campos/${tipo}/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        setAlerta({ type: 'success', message: 'Campos actualizados correctamente' });
        setTimeout(() => navigate("/MisPropiedades"), 2000);
      } else {
        setAlerta({ type: 'error', message: 'Error al actualizar los campos' });
      }
    } catch (err) {
      console.error("Error:", err);
      setAlerta({ type: 'error', message: 'Error al conectar con el servidor' });
    }
  };

  return (
    <div className="container mt-4">
      <h3>Administrar Campos - {tipo}</h3>

      <div className="campo-container">
  <label className="form-label fs-5">Campos libres actuales</label>

            <div className="campo-input-group">
                <button className="btn btn-outline-secondary" onClick={disminuir}>-</button>

                <input
                type="number"
                className="form-control campo-input"
                value={valorCambio}
                onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (isNaN(val) || val < 0) setValorCambio(0);
                    else if (val > disponibilidad) setValorCambio(disponibilidad);
                    else setValorCambio(val);
                }}
                onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e') e.preventDefault();
                }}
                />

                <button className="btn btn-outline-secondary" onClick={aumentar}>+</button>
            </div>

            <div className="form-text">
                <strong>Actual:</strong> {camposLibres} / <strong>Disponibilidad total:</strong> {disponibilidad}
            </div>
            </div>

            {tipo === 'Garaje' && (
                <div className="estado-container">
                    <div className="estado-cuadro">
                    <label className="form-label fs-5">Estado</label>
                    <div
                        className="estado-toggle"
                        onClick={() => setEstado(prev => !prev)}
                    >
                        <div className="estado-icon">
                        {estado ? <ToggleRight color="#28a745" size={70} /> : <ToggleLeft color="#dc3545" size={70} />}
                        </div>
                        <div className="estado-label">
                        {estado ? "Disponible" : "Ocupado"}
                        </div>
                    </div>
                    </div>
                </div>
                )}



      <button className="btn btn-success" onClick={handleActualizar}>Guardar cambios</button>

      <Alert
        type={alerta.type}
        message={alerta.message}
        onClose={() => setAlerta({ type: '', message: '' })}
      />
    </div>
  );
};
