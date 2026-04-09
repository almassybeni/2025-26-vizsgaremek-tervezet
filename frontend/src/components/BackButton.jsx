import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

const BackButton = ({ to, label = 'Vissza' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button className="back-button" onClick={handleClick}>
      <span className="back-icon">←</span>
      <span className="back-label">{label}</span>
    </button>
  );
};

export default BackButton;