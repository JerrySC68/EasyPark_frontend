import '../assets/css/Modal.css';

const Titles = {
  success: 'Éxito',
  error: 'Error',
  warning: 'Alerta',
  confirm: 'Confirmar',
  cancel: 'Cancelar'
};

const Icons = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  confirm: '❓',
  cancel: '🚫'
};

export const Alert = ({ type, message, onClose }) => {
  if (!type || !message) return null;

  return (
    <div className="overlay">
      <div className="alert">
        <div className="icon">{Icons[type] || '🔔'}</div>
        <div className="title">{Titles[type]}</div>
        <div className="message">{message}</div>
        <div className="wrapper-buttons">
          <button className="" onClick={onClose}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export const Confirm = ({ type = 'confirm', message, onConfirm, onClose }) => {
  if (!message) return null;

  return (
    <div className="overlay">
      <div className="alert">
        <div className="icon">{Icons[type] || '❓'}</div>
        <div className="title">{Titles[type]}</div>
        <div className="message">{message}</div>
        <div className="wrapper-buttons">
          <button onClick={onConfirm}>Confirmar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};
