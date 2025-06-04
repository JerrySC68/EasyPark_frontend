import React from "react";
import { Link } from "react-router-dom";
import foto from "../assets/img/ParqueFondo.png";

export const Home = () => {
  return (
   <div className="container py-5 text-center">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-6 col-md-10 mb-4">
            <h1 className="fw-bold mb-3 display-5">Bienvenido a EasyPark</h1>
            <p className="lead">
              Encuentra, reserva y gestiona parqueos de forma rápida, segura y desde cualquier lugar.
            </p>

            <div className="d-grid gap-3 mt-4">
              {/* Para que en móvil estén en columna, y en desktop en fila */}
              <Link to="/Registrar" className="btn btn-success btn-lg w-100 w-md-auto">
                Crear cuenta
              </Link>
              <Link to="/Login" className="btn btn-success btn-lg w-100 w-md-auto">
                Iniciar sesión
              </Link>
              <Link to="/about" className="btn btn-outline-primary btn-lg w-100 w-md-auto">
                Saber más
              </Link>
            </div>
          </div>

          <div className="col-lg-6 col-md-10 mt-4 mt-lg-0">
            <img
              src={foto}
              alt="Ilustración de parqueo"
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>

  );
};

export default Home;
