import './PopupModal.css';

const PopupModal = ({ onClose, children }) => {
  return (
    <div className="popupmodal-overlay" onClick={onClose}>
      <div className="popupmodal-content" onClick={(e) => e.stopPropagation()}>
        <button className="popupmodal-close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default PopupModal;
