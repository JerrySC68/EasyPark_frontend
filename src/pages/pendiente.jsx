import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../assets/img/logo-easyPark.jpeg'; // Adjust the path as necessary

export const Pendiente = () => {
  return (
    <div className="container text-center mt-5">
      <img
        src={Logo}
        alt="Logo EasyPark"
        className="img-fluid"
        style={{ maxWidth: '50%', height: 'auto' }}
      />
      <h1 className="mt-3">Pendiente</h1>
    </div>
  );
};

