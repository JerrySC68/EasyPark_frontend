import React from "react";
import { Link } from "react-router-dom";
import foto from "../assets/img/ParqueFondo.png";
import '../assets/css/Home.css';

export const Home = () => {
  return (
    <div className="form-incio-principal container-fluid d-flex align-items-center justify-content-center">
      <div className="form-control">
        <div className="row justify-content-center align-items-center g-5">
          <div className="col-white col-lg-6 col-md-10">
            <h1 className="mb-4">Bienvenido a EasyPark</h1>
            <p className="lead">
              Encuentra, reserva y gestiona parqueos de forma rápida, segura y desde cualquier lugar.
              Simplificamos tu experiencia de estacionamiento con nuestra plataforma intuitiva.
            </p>

            <div className="form-inicio d-flex flex-wrap gap-3 mt-5">
              <Link to="/Registrar" className="btn btn-success">
                Crear cuenta
              </Link>
              <Link to="/Login" className="btn btn-success">
                Iniciar sesión
              </Link>
              <Link to="/about" className="btn btn-outline-primary">
                Saber más
              </Link>
            </div>
          </div>

          <div className="col-lg-6 col-md-10">
            <img
              src={foto}
              alt="Ilustración de parqueo"
              className="img img-fluid"
              style={{ maxHeight: "450px", width: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;