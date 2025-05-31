import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './toast.scss';

const Toast = ({ message, type, duration, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose && onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className={`toast toast--${type}`}>
      <div className="toast__content">
        <span className="toast__message">{message}</span>
        <button className="toast__close" onClick={() => setVisible(false)}>
          &times;
        </button>
      </div>
      <div 
        className="toast__progress" 
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  duration: PropTypes.number,
  onClose: PropTypes.func,
};

Toast.defaultProps = {
  type: 'info',
  duration: 5000,
};

export default Toast;