// src/handlers/LoginHandlers.js

export const handleLogout = (navigate, setRolUsuario) => {
  localStorage.removeItem("token");
  localStorage.removeItem("rol");
  setRolUsuario(null);
  navigate("/");
};

export const handleNavLinkClick = (setMenuOpen) => {
  setMenuOpen(false);
};

export const toggleMenu = (setMenuOpen) => {
  setMenuOpen(prev => !prev);
};
