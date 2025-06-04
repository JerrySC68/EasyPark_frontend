import '../assets/css/ReservePage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ReservePage = () => {
  const [formData, setFormData] = useState({
    location: '',
    arrivalDate: '',
    arrivalTime: '',
    departureDate: '',
    departureTime: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { location, arrivalDate, arrivalTime, departureDate, departureTime } = formData;
    if (!location || !arrivalDate || !arrivalTime || !departureDate || !departureTime) {
      alert('Por favor complete todos los campos.');
      return;
    }

    // Aquí podrías almacenar temporalmente los datos o pasarlos vía estado
    navigate('/mapa'); // redirige a la página del mapa
  };

  /*
  return (
    <div className="reserve-page">
      <form className="reserve-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="location"
          placeholder="¿A dónde va?"
          value={formData.location}
          onChange={handleChange}
        />
        <div className="date-time-group">
          <div>
            <label>Llegada</label>
            <input
              type="date"
              name="arrivalDate"
              value={formData.arrivalDate}
              onChange={handleChange}
            />
            <input
              type="time"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Salida</label>
            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
            />
            <input
              type="time"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
            />
          </div>
        </div>
        <button type="submit">Buscar</button>
      </form>
    </div>
  );

*/
return (
  <div className="reserve-wrapper">
    <form className="reserve-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="location">¿A dónde va?</label>
        <input
          type="text"
          name="location"
          id="location"
          value={formData.location}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Fecha y hora de llegada</label>
        <input
          type="date"
          name="arrivalDate"
          value={formData.arrivalDate}
          onChange={handleChange}
        />
        <input
          type="time"
          name="arrivalTime"
          value={formData.arrivalTime}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Fecha y hora de salida</label>
        <input
          type="date"
          name="departureDate"
          value={formData.departureDate}
          onChange={handleChange}
        />
        <input
          type="time"
          name="departureTime"
          value={formData.departureTime}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Buscar</button>
    </form>
  </div>
);
};