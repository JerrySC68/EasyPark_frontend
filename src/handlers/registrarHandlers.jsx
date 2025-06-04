// registrarHandlers.js
export const handleCloseAlert = (setAlertCustom) => {
  setAlertCustom({ type: '', message: '' });
};

export const handleRegistrar = async ({
  nombre,
  email,
  password,
  tipoUsuarios,
  telefono,
  aceptoTerminos,
  token,
  setAlertCustom,
  navigate,
  resetFormulario,
  setEmailAuth
}) => {
  const errores = [];

  if (!nombre) errores.push('Nombre es requerido.');
  if (!email.trim()) errores.push('Email es requerido.');
  if (!password.trim()) errores.push('Contraseña es requerida.');
  if (!tipoUsuarios) errores.push('Tipo de usuario es requerido.');
  if (!telefono.trim()) errores.push('Teléfono es requerido.');
  if (!aceptoTerminos) errores.push('Debes aceptar los términos y condiciones.');
  if (telefono.length < 8) errores.push('Teléfono debe tener al menos 8 dígitos.');
  if (telefono.length > 10) errores.push('Teléfono no debe tener más de 10 dígitos.');
  if (!/^\d+$/.test(telefono)) errores.push('Teléfono debe contener solo números.');
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) errores.push('Email no es válido.');
  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) errores.push('La contraseña debe tener al menos 8 caracteres, incluyendo letras y números.');

  if (errores.length > 0) {
    setAlertCustom({ type: 'error', message: errores.join(' ') });
    return;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/registrar`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        
      },
      body: JSON.stringify({
        nombre,
        email,
        password,
        tipo_usuarios: tipoUsuarios,
        telefono,
        fecha_registro: new Date().toISOString()
      })
    });

    const result = await response.json();
    console.log("✅ Registro exitoso:", result);
    const user = result.User;
    localStorage.setItem('iduser', user.idUsuario);
    localStorage.setItem('rol', user.tipo_usuarios);
    localStorage.setItem('nombre', user.nombre);
    resetFormulario();
    if (response.ok) {
      setAlertCustom({ type: 'success', message: 'Usuario registrado con éxito' });
       
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Firebase auth opcional
      if (setEmailAuth) {
        const { signInWithEmailAndPassword, auth } = setEmailAuth;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        localStorage.setItem('easypark_token', token);
      }

      
       
      if (tipoUsuarios === 'propietariop') {
       
        navigate('/Pendiente');
        
      } else if (tipoUsuarios === 'cliente') {
        
        navigate('/Bienvenida'); // o donde quieras
      }
    } else {
      setAlertCustom({ type: 'error', message: result.error || 'No se pudo registrar' });
    }
  } catch (error) {
    console.error("❌ Error al registrar:", error);
    setAlertCustom({ type: 'error', message: 'Error de red' });
  }
};
