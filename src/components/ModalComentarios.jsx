import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ModalComentarios = ({ visible, onClose, comentarios, promedio }) => {
  const navigate = useNavigate();

  if (!visible) return null;

  return (
    <div className="modal-overlay position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-11 col-sm-10 col-md-8 col-lg-6">
            <div className="bg-white p-4 rounded shadow text-center">
              {/* TÍTULO */}
              <h5 className="mb-4">
                Comentarios (⭐ {comentarios?.length > 0 ? (promedio ?? 0).toFixed(1) : '5.0'})
              </h5>

              {/* COMENTARIOS */}
              <div className="comments-list text-start overflow-auto px-2" style={{ maxHeight: '300px' }}>
                {Array.isArray(comentarios) && comentarios.length > 0 ? (
                  comentarios.map((c, i) => (
                    <div key={i} className="comment-item border-bottom py-2">
                      <div className="fw-bold">⭐ {c.puntuacion}</div>
                      <div>{c.comentario}</div>
                      <div className="text-muted small">{new Date(c.fecha).toLocaleDateString()}</div>
                    </div>
                  ))
                ) : (
                  <div className="comment-item border-bottom py-2">
                    <div className="fw-bold">⭐ 5</div>
                    <div>Este parqueo aún no tiene comentarios. ¡Sé el primero en opinar!</div>
                  </div>
                )}
              </div>

              {/* BOTONES */}
              <div className="d-flex flex-column flex-md-row justify-content-center gap-2 mt-4">
                <button className="btn btn-primary" onClick={() => navigate("/Comentario")}>
                  Ir a Comentar
                </button>
                <button className="btn btn-secondary" onClick={onClose}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
