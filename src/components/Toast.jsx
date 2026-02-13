const Toast = ({ message, type = "success", onClose }) => {
  return (
    <div className="toast toast-top toast-end z-50">
      <div className={`alert alert-${type}`}>
        <span>{message}</span>
        <button className="btn btn-sm btn-ghost" onClick={onClose}>
          X
        </button>
      </div>
    </div>
  );
};

export default Toast;
