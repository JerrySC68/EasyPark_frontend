import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Settings, Trash2 } from 'lucide-react';
import { Alert, Confirm } from '../components/ModalAlert'; // Asegúrate de que la ruta sea correcta

export const MisPropiedades = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [alertData, setAlertData] = useState({ show: false, type: '', message: '' });
  const [confirmData, setConfirmData] = useState({ show: false, propiedad: null });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("easypark_token");
    const id = localStorage.getItem("iduser");
    if (!token) return navigate("/");

    fetch(`${import.meta.env.VITE_API_URL}/api/propiedades/mis/${id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setPropiedades(data))
      .catch(err => console.error("Error:", err));
  }, []);

  const handleEditar = (propiedad) => {
    navigate(`/EditarPropiedad/${propiedad.id}/${propiedad.tipo}`);
  };

  const handleAdministrar = (propiedad) => {
    navigate(`/AdministrarPropiedad/${propiedad.id}/${propiedad.tipo}`);
  };

  const handleEliminar = () => {
    const { propiedad } = confirmData;
    fetch(`${import.meta.env.VITE_API_URL}/api/propiedades/eliminar/${propiedad.tipo}/${propiedad.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem("easypark_token")}`,
      },
    })
      .then(res => {
        if (res.ok) {
          setPropiedades(prev => prev.filter(p => p.id !== propiedad.id));
          setAlertData({ show: true, type: 'success', message: 'Propiedad eliminada con éxito' });
        } else {
          setAlertData({ show: true, type: 'error', message: 'Error al eliminar la propiedad' });
        }
        setConfirmData({ show: false, propiedad: null });
      })
      .catch(err => {
        console.error("Error:", err);
        setAlertData({ show: true, type: 'error', message: 'Error del servidor' });
        setConfirmData({ show: false, propiedad: null });
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Mis propiedades</h2>

      {alertData.show && (
        <Alert type={alertData.type} message={alertData.message} onClose={() => setAlertData({ show: false, type: '', message: '' })} />
      )}

      {confirmData.show && (
        <Confirm
          message="¿Estás seguro de que deseas eliminar esta propiedad?"
          onConfirm={handleEliminar}
          onClose={() => setConfirmData({ show: false, propiedad: null })}
        />
      )}

      {/* TABLA EN PANTALLAS GRANDES */}
      <div className="d-none d-md-block table-responsive">
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>Tipo</th>
              <th>Dirección</th>
              <th>Disponibilidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {propiedades.length === 0 ? (
              <tr>
                <td colSpan="4">No tienes propiedades registradas</td>
              </tr>
            ) : (
              propiedades.map((p, i) => (
                <tr key={i}>
                  <td>{p.tipo}</td>
                  <td>{p.direccion}</td>
                  <td>{p.disponibilidad}</td>
                  <td>
                    <button className="btn btn-warning btn-sm" onClick={() => handleEditar(p)}><Pencil size={15} className="me-1" /> Editar</button>
                    <button className="btn btn-primary btn-sm ms-2" onClick={() => handleAdministrar(p)}><Settings size={15} className="me-1" /> Administrar</button>
                    <button className="btn btn-danger btn-sm ms-2" onClick={() => setConfirmData({ show: true, propiedad: p })}><Trash2 size={15} className="me-1" /> Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CARDS EN MÓVIL */}
      <div className="d-block d-md-none">
        {propiedades.length === 0 ? (
          <p className="text-center">No tienes propiedades registradas</p>
        ) : (
          propiedades.map((p, i) => (
            <div key={i} className="card mb-3 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{p.tipo}</h5>
                <p className="card-text"><strong>Dirección:</strong> {p.direccion}</p>
                <p className="card-text"><strong>Disponibilidad:</strong> {p.disponibilidad}</p>
                <button className="btn btn-warning w-100" onClick={() => handleEditar(p)}><Pencil className="me-2" size={16} /> Editar</button>
                <button className="btn btn-primary w-100 mt-2" onClick={() => handleAdministrar(p)}><Settings className="me-2" size={16} /> Administrar</button>
                <button className="btn btn-danger w-100 mt-2" onClick={() => setConfirmData({ show: true, propiedad: p })}><Trash2 className="me-2" size={16} /> Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
