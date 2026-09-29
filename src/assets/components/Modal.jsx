
import React from "react";
import './Modal.css';

const Modal = ({ isOpen, onClose, label, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div>
                <div className="modal-header">
                    {label}
                </div>
                <div className="modal-content">
                    {children}
                    <button onClick={onClose}>Exit</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
