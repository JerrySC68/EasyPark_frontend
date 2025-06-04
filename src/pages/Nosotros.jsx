import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/Nosotros.css";

import parkingImg from "../assets/img/about-parking.png";
import userImg from "../assets/img/about-user.png";
import ownerImg from "../assets/img/about-owner.png";
import reservaImg from "../assets/img/about-reservation.png";

export const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);

  return (
    <div className="container mt-5 mb-5">
      {/* Encabezado principal */}
      <div className="text-center mb-5 fade-in">
        <h1 className="fw-bold display-5">Acerca de EasyPark</h1>
        <p className="text-muted fs-5">Conectamos a conductores con espacios de parqueo disponibles de forma rápida y segura.</p>
      </div>

      {/* ¿Qué es EasyPark? */}
      <div className="row align-items-center mb-5">
        <div className="col-lg-6 mb-4 fade-in">
          <img src={parkingImg} alt="Qué es EasyPark" className="img-fluid" />
        </div>
        <div className="col-lg-6 fade-in-delay">
          <h3 className="fw-bold">¿Qué es EasyPark?</h3>
          <p>
            EasyPark es una plataforma digital que permite a los usuarios localizar y reservar espacios de parqueo fácilmente desde su celular o computadora.
            Nos enfocamos en ofrecer una experiencia eficiente para ambos: quienes buscan dónde parquear y quienes administran un parqueo.
          </p>
          
        </div>
      </div>

      {/* Misión */}
      <div className="row align-items-center mb-5 flex-lg-row-reverse">
        <div className="col-lg-6 mb-4 fade-in">
          <img src={reservaImg} alt="Nuestra misión" className="img-fluid" />
        </div>
        <div className="col-lg-6 fade-in-delay">
          <h3 className="fw-bold">Nuestra Misión</h3>
          <p>
            Buscamos transformar la forma en que se gestionan y encuentran parqueos. Nuestra misión es simplificar y agilizar el proceso utilizando tecnología de vanguardia, sin complicaciones.
          </p>
        </div>
      </div>

      {/* Beneficios para usuarios */}
      <div className="row align-items-center mb-5">
        <div className="col-lg-6 mb-4 fade-in">
          <img src={userImg} alt="Beneficios para usuarios" className="img-fluid" />
        </div>
        <div className="col-lg-6 fade-in-delay">
          <h3 className="fw-bold">Beneficios para Usuarios</h3>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">🔎 Búsqueda rápida de parqueo cercano</li>
            <li className="list-group-item">📱 Reserva en tiempo real desde tu celular</li>
            <li className="list-group-item">🕘 Historial y control de tus reservas</li>
            <li className="list-group-item">📍 Visualización en mapa</li>
          </ul>
        </div>
      </div>

      {/* Beneficios para propietarios */}
      <div className="row align-items-center">
        <div className="col-lg-6 fade-in">
          <h3 className="fw-bold">Beneficios para Propietarios</h3>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">📊 Administra tus espacios de forma sencilla</li>
            <li className="list-group-item">📅 Control de disponibilidad y ocupación</li>
            <li className="list-group-item">👥 Conecta con clientes en tiempo real</li>
            
          </ul>
        </div>
        <div className="col-lg-6 mb-4 fade-in-delay">
          <img src={ownerImg} alt="Beneficios para propietarios" className="img-fluid" />
        </div>
      </div>
    </div>
  );
};

export default About;
