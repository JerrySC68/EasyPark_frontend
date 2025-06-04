import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaParking, FaUserCheck } from "react-icons/fa";
import "../assets/css/Bienvenida.css"; // 👈 crea este archivo para estilos
import bienvenidoImg from "../assets/img/logo-easyPark.jpeg"; // 👈 usa tu imagen decorativa

export const Bienvenida = () => {
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("");
  const [idUsuario, setidUsuario] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedRol = localStorage.getItem("rol");
    const storedNombre = localStorage.getItem("nombre");
    const storedid = localStorage.getItem("iduser");

    if (!storedRol) {
      navigate("/");
    } else {
      setRol(storedRol);
      setidUsuario(storedid);
      setNombre(storedNombre || "Usuario");
    }
  }, [navigate]);

  const renderRolDescripcion = () => {
    switch (rol) {
      case "Admin":
        return (
          <>
            <FaUserShield size={50} className="text-primary mb-2" />
            <p className="lead">Puedes gestionar usuarios y aprobar parqueos pendientes.</p>
          </>
        );
      case "propietario":
        return (
          <>
            <FaParking size={50} className="text-success mb-2" />
            <p className="lead">Puedes registrar nuevos parqueos disponibles.</p>
          </>
        );
      case "cliente":
        return (
          <>
            <FaUserCheck size={50} className="text-info mb-2" />
            <p className="lead">Busca parqueos y realiza reservas fácilmente.</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container py-5 text-center fade-in">
      <img
        src={bienvenidoImg}
        alt="Bienvenido"
        className="img-fluid mb-4 rounded shadow-sm animate-slide"
        style={{ maxWidth: "300px" }}
      />
      <h1 className="fw-bold">¡Bienvenido(a), {nombre}!</h1>
      <p className="lead">Has iniciado sesión como <strong>{rol}</strong>.</p>
      
      <div className="mt-4">
        {renderRolDescripcion()}
      </div>
    </div>
  );
};

export default Bienvenida;
