import '../styles/LoadingSpinner.css';

function LoadingSpinner({ message = 'A carregar...' }) {
  return (
    <div className="loading-spinner-container">
      <div className="spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
