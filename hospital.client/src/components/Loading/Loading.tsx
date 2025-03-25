import React from 'react';
import '../../assets/css/Loading.css';

interface LoadingProps {
  message?: string;
  spinnerColor?: string;
  backgroundColor?: string;
}

const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  spinnerColor = '#3498db',
  backgroundColor = 'rgba(255, 255, 255, 0.9)'
}) => {
  return (
    <div className="loading-overlay" style={{ backgroundColor }}>
      <div className="loading-content">
        <div className="loading-spinner" style={{ borderColor: spinnerColor }}></div>
        <p className="loading-text">{message}</p>
      </div>
    </div>
  );
};

export default Loading;