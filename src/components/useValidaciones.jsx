// src/hooks/useValidaciones.js
import { useState, useEffect } from "react";

export const useValidaciones = ({ email, password, telefono }) => {
  const [errores, setErrores] = useState({
    email: "",
    password: "",
    telefono: ""
  });

  useEffect(() => {
    const nuevosErrores = {};

    // Email
    if (email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      nuevosErrores.email = "Email no válido.";
    }

    // Password
    if (password && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      nuevosErrores.password = "Contraseña debe tener al menos 8 caracteres, incluyendo letras y números.";
    }

    // Teléfono
    if (telefono && (!/^\d+$/.test(telefono) || telefono.length < 8 || telefono.length > 10)) {
      nuevosErrores.telefono = "Teléfono debe contener solo números (8-10 dígitos).";
    }

    setErrores(nuevosErrores);
  }, [email, password, telefono]);

  return errores;
};
