import React from 'react';
import '../../assets/css/Loading.css';

interface LoadingProps {
  message?: string;
  backgroundColor?: string;
}

const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  backgroundColor = 'rgba(0, 128, 0, 0.2)' // Light green overlay
}) => {
  return (
    <div className="loading-overlay fade-in" style={{ backgroundColor }}>
      <div className="loading-content">
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
        </div>
        <p className="loading-text">{message}</p>
      </div>
    </div>
  );
};

export default Loading;