import React, { useEffect, useState, useRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import '../assets/css/MapPage.css';
import garajeimg from "../assets/img/garage.png";
import parqueoimg from "../assets/img/parking.png";
import { Alert, Confirm } from '../components/ModalAlert';
import { ModalComentarios } from '../components/ModalComentarios';

export const MapPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationInfo, setLocationInfo] = useState('');
  const [nearbyParkings, setNearbyParkings] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedParking, setSelectedParking] = useState(null);
  const [mostrarLista, setMostrarLista] = useState(true);
const [showConfirm, setShowConfirm] = useState(false);
const [alertCustom, setAlertCustom] = useState({ type: '', message: '' });
const [comentariosData, setComentariosData] = useState({});
const [modalComentarios, setModalComentarios] = useState({ mostrar: false, comentarios: [], promedio: 0 });

const [duracionViaje, setDuracionViaje] = useState('');
  const [formData, setFormData] = useState({
    origin: '',
    destination: ''
  });
  const [userModifiedOrigin, setUserModifiedOrigin] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const directionsRenderer = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setAlertCustom({ type: 'error', message: 'NO soporta da geolocalización' });

      setUserLocation({ lat: 10.003649986156336 , lng: -84.14259788597299 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
      },
      (err) => {
        //console.error("Error de geolocalización:", err);
        setAlertCustom({ type: 'error', message: 'Error al cargar la ubicacion.' });

        setUserLocation({ lat: 10.003649986156336 , lng: -84.14259788597299 });
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  useEffect(() => {
    if (userLocation) {
      getLocationInfo(userLocation);
    }
  }, [userLocation]);

  const calcularDuracion = (origen, destino) => {
  const service = new window.google.maps.DirectionsService();
  service.route({
    origin: origen,
    destination: destino,
    travelMode: 'DRIVING'
  }, (result, status) => {
    if (status === 'OK') {
      const duracion = result.routes[0].legs[0].duration.text;
      setDuracionViaje(duracion);
    } else {
      setDuracionViaje('No disponible');
    }
  });
};

  const getLocationInfo = async (location) => {
    if (!window.google || !window.google.maps) return;

    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const formatted = results[0].formatted_address;
          if (!userModifiedOrigin) {
            setFormData((prev) => ({ ...prev, origin: formatted }));
          }

          let district = '';
          let province = '';

          for (const component of results[0].address_components) {
            if (component.types.includes('sublocality') || component.types.includes('administrative_area_level_2')) {
              district = component.long_name;
            }
            if (component.types.includes('administrative_area_level_1')) {
              province = component.long_name;
            }
          }

          if (district || province) {
            setLocationInfo(`${district}${district && province ? ', ' : ''}${province}`);
          } else {
            setLocationInfo('Ubicación desconocida');
          }
        } else {
          if (!userModifiedOrigin) {
            setFormData((prev) => ({ ...prev, origin: 'Ubicación desconocida' }));
          }
          setLocationInfo('Ubicación desconocida');
        }
      });
    } catch (err) {
      console.error("Error en geocodificación inversa:", err);
      if (!userModifiedOrigin) {
        setFormData((prev) => ({ ...prev, origin: 'Ubicación desconocida' }));
      }
      setLocationInfo('Ubicación desconocida');
    }
  };

  useEffect(() => {
    if (!userLocation || !mapRef.current) return;

    const initMap = async () => {
      try {
        if (!window.google || !window.google.maps) {
          throw new Error("Google Maps API no está disponible");
        }

        await window.google.maps.importLibrary("marker");

        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: userLocation,
          zoom: 14,
          disableDefaultUI: true,
          gestureHandling: "greedy",
          mapId: 'f145ef9e17dfd1237ec834e9' 
        });

        const { AdvancedMarkerElement } = window.google.maps.marker;
        const userIcon = document.createElement('div');
        userIcon.style.width = '40px';
        userIcon.style.height = '40px';
        userIcon.style.borderRadius = '50%';
        userIcon.style.backgroundColor = '#4285F4';
        userIcon.style.border = '2px solid white';

        new AdvancedMarkerElement({
          map: mapInstance.current,
          position: userLocation,
          title: "Tu ubicación",
          content: userIcon
        });

        setLoading(false);
        findNearbyParkings();

      } catch (err) {
        console.error("Error al inicializar el mapa:", err);
        setAlertCustom({ type: 'error', message: 'Error al cargar el mapa. Recarga la página.' });

        setLoading(false);
      }
    };

    if (window.google && window.google.maps) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD7hTh2iDt3rt_aHNRp9E-GhJC8JOQKXIc&libraries=places&callback=initMap&loading=async`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        setAlertCustom({ type: 'error', message: 'Error al cargar el mapa. Recarga la página.' });

        setLoading(false);
      };
      window.initMap = initMap;
      document.head.appendChild(script);
    }

    return () => {
      if (window.initMap) delete window.initMap;
    };
  }, [userLocation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "origin") setUserModifiedOrigin(true);
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSearch = () => {
    if (!formData.destination || !mapInstance.current) return;

    const service = new window.google.maps.places.PlacesService(mapInstance.current);
    const request = {
      query: formData.destination,
      fields: ['name', 'geometry']
    };

    service.findPlaceFromQuery(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results[0]) {
        const location = results[0].geometry.location;
        mapInstance.current.setCenter(location);
        mapInstance.current.setZoom(16);
        setUserLocation({ lat: location.lat(), lng: location.lng() });
        setShowSearchModal(false);
      }
    });
  };
const handleMarkerClick = (parking) => {
  setSelectedParking(parking);
  calcularDuracion(userLocation, { lat: parking.latitud, lng: parking.longitud });
};

 // dentro del mismo archivo MapPage.jsx

const fetchComentarios = async (tipo, id) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comentarios/propiedad/${tipo}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('easypark_token')}`
      }
    });
    const data = await res.json();
    return {
      promedio: data.promedio || 5,
      comentarios: data.comentarios || []
    };
  } catch (err) {
    console.error(`Error al obtener comentarios de ${tipo} ${id}:`, err);
    return { promedio: 5, comentarios: [] }; // por defecto
  }
};

const findNearbyParkings = async () => {
  if (!userLocation) return;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/propiedades/cercanas`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('easypark_token')}`
      }
    });

    const data = await response.json();
    const { AdvancedMarkerElement } = window.google.maps.marker;

    const cercanos = await Promise.all(data.map(async parking => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        parking.latitud,
        parking.longitud
      );

      if (distance <= 10) {
        const iconUrl = parking.tipo === 'Garaje' ? garajeimg : parqueoimg;

        const img = document.createElement('img');
        img.src = iconUrl;
        img.style.width = '40px';
        img.style.height = '40px';

        new AdvancedMarkerElement({
          map: mapInstance.current,
          position: { lat: parking.latitud, lng: parking.longitud },
          title: parking.tipo === 'Garaje' ? 'Garaje' : parking.nombre,
          content: img
        });

        const { promedio, comentarios } = await fetchComentarios(parking.tipo, parking.id);

        return {
          id: parking.id,
          name: parking.nombre,
          tipo: parking.tipo,
          distance,
          disponibilidad: parking.camposlibres,
          direccion: parking.direccion,
          location: {
            lat: parking.latitud,
            lng: parking.longitud
          },
          promedio,
          comentarios
        };
      }
      return null;
    }));

    setNearbyParkings(cercanos.filter(p => p !== null));
  } catch (err) {
    console.error("Error al buscar parqueos:", err);
    setAlertCustom({ type: 'error', message: 'Error al cargar los parqueos. Recarga la página.' });
  }
};


  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const focusOnParking = (parking) => {
    if (!mapInstance.current || !window.google || !userLocation) return;

    if (directionsRenderer.current) {
      directionsRenderer.current.setMap(null);
      directionsRenderer.current = null;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsRenderer.current = new window.google.maps.DirectionsRenderer({
      map: mapInstance.current,
      suppressMarkers: false
    });

    const origin = new window.google.maps.LatLng(userLocation.lat, userLocation.lng);
    const destination = new window.google.maps.LatLng(parking.location.lat, parking.location.lng);

    const request = {
      origin,
      destination,
      travelMode: window.google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        directionsRenderer.current.setDirections(result);
      } else {
        console.error("No se pudo obtener la ruta:", status);
      }
    });

    mapInstance.current.setCenter(destination);
    mapInstance.current.setZoom(15);
  };

  const handleReservar = async () => {
  setShowConfirm(true); // Mostrar el modal personalizado
};

const confirmarReserva = async () => {
  setShowConfirm(false); // Cerrar el modal

 const tipoParqueo = selectedParking.tipo;
const parqueo_id = selectedParking.id;

const usuario_id = localStorage.getItem("iduser");
const nombre_usuario = localStorage.getItem("nombre");
const token = localStorage.getItem("easypark_token");

const qrContent = `QR-${nombre_usuario}-${usuario_id}-${parqueo_id}-${tipoParqueo}`;

const body = {
  usuario_id: parseInt(usuario_id),
  estacionamiento_id: tipoParqueo === "Estacionamiento" ? parqueo_id : null,
  garaje_id: tipoParqueo === "Garaje" ? parqueo_id : null,
  qr_code: qrContent,
  estado: "pendiente",
  fecha_reserva: new Date().toISOString().split("T")[0],
  hora_reserva: new Date().toTimeString().split(" ")[0].slice(0, 5),
  penalizacion: null // se permite null según el diseño de la tabla
};


  if (selectedParking.tipo === "Garaje") {
    body.garaje_id = selectedParking.id;
  } else {
    body.estacionamiento_id = selectedParking.id;
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/propiedades/reservas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error("Error al reservar");
     const data = await res.json(); // 👈 Obtener respuesta del backend

    setAlertCustom({ type: "success", message: "Reserva enviada correctamente" });

    setSelectedParking(null);
    setMostrarLista(true);
    
    navigate("/ReservasPage");

 // Redirigir a la página de reservas
  } catch (error) {
  console.error(error);
  setAlertCustom({ type: "error", message: "Ocurrió un error al reservar." });
}

};

  const focusIfTooFar = () => {
    if (!mapInstance.current || !userLocation) return;

    const center = mapInstance.current.getCenter();
    const centerLat = center.lat();
    const centerLng = center.lng();

    const distance = calculateDistance(
      centerLat,
      centerLng,
      userLocation.lat,
      userLocation.lng
    );

    if (distance > 1) {
      mapInstance.current.setCenter(userLocation);
      mapInstance.current.setZoom(16);
    }
  };

  return (
    <div className="map-fullscreen-container">
     

      {loading && (
        <div className="map-loading-overlay">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando mapa...</span>
          </div>
        </div>
      )}

      <div className="location-info-box">
        <span className="location-text">{locationInfo || "Obteniendo ubicación..."}</span>
        <button className="search-circle-button" onClick={() => setShowSearchModal(true)} aria-label="Buscar" />
      </div>

      {showSearchModal && (
        <div className="modal-overlay">
          <div className="reserve-wrapper">
            <form className="reserve-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="origin">¿Dónde está?</label>
                <input
                  type="text"
                  name="origin"
                  id="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="destination">¿A dónde va?</label>
                <input
                  type="text"
                  name="destination"
                  id="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mt-3 d-flex justify-content-between">
                <button type="submit" className="btn btn-primary">Buscar</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowSearchModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {selectedParking && (
        <div className="info-panel bg-light p-3 shadow rounded position-absolute" style={{ bottom: 20, left: 20, zIndex: 1000, width: window.innerWidth <= 768 ? '100%' : 'auto' }}>
          <h5>{selectedParking.tipo}</h5>
          
           <p><strong>Dirección:</strong> {selectedParking.direccion}</p>
          <p><strong>Campos Libres:</strong> {selectedParking.disponibilidad}</p>
          <p><strong>Duración estimada:</strong> {duracionViaje}</p>
        
          <button className="btn btn-primary mt-2" onClick={handleReservar}>
            Reservar
          </button>
          
         
        {window.innerWidth <= 768 && (
          <button
            className="btn btn-secondary mt-2"
            onClick={() => {
              setSelectedParking(null);
              setMostrarLista(true);
            }}
          >
            Retroceso
          </button>
        )}

        </div>
      )}
    {mostrarLista && (
      <div className="parkings-list-container">
        <h5 className="parkings-list-title">Parqueos cercanos</h5>
        <div className="parkings-list">
          {nearbyParkings.length > 0 ? (
            nearbyParkings.map(parking => (
              <div
                key={parking.id}
                className="parking-item"
                onClick={() => {
                  focusOnParking(parking);
                    setSelectedParking(parking);   // mostrar el panel de reserva
                  calcularDuracion(userLocation, { lat: parking.location.lat, lng: parking.location.lng });
                  if (window.innerWidth <= 768) {
                    setMostrarLista(false);
                  }

                }}
              >
                <div className="parking-name">{parking.tipo === 'Garaje' ? 'Garaje' : parking.name }</div>
                <div className="parking-distance">{parking.distance} km</div>
                <div className="parking-rating">⭐ {parking.promedio || 0} / 5</div>
                  <button
                    className="btn btn-sm btn-outline-info mt-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalComentarios({
                        mostrar: true,
                        comentarios: parking.comentarios,
                        promedio: parking.promedio
                      });
                    }}
                  >
                    Ver Comentarios
                  </button>
              </div>
            ))
          ) : (
            <div className="no-parkings">No se encontraron parqueos cercanos</div>
          )}
        </div>
      </div>

        )}

      

      <div ref={mapRef} className="map-fullscreen"></div>
      {showConfirm && (
        <Confirm
          message="¿Está seguro de reservar este parqueo?"
          onConfirm={confirmarReserva}
          onClose={() => setShowConfirm(false)}
        />
      )}
      {alertCustom.message && (
  <Alert
    type={alertCustom.type}
    message={alertCustom.message}
    onClose={() => setAlertCustom({ type: '', message: '' })}
  />
  
)}
<ModalComentarios
  visible={modalComentarios.mostrar}
  comentarios={modalComentarios.comentarios}
  promedio={modalComentarios.promedio}
  onClose={() => setModalComentarios({ mostrar: false, comentarios: [], promedio: 0 })}
/>

    </div>
  );
};

