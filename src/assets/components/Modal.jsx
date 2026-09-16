
import React from "react";

const Modal = ({ isOpen, onClose, label, children }) => {
    if (!isOpen) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textShadow: "0px 0px 0px black",
            }}
        >
            <div>
                <div
                    style={{
                        justifyContent: 'left',
                        height: '1em',
                        display: 'flex',
                        flexDirection: 'row',
                        backgroundColor: 'rgb(219, 219, 219)',
                    }}
                >
                    {label}
                </div>
                <div
                    style={{
                        background: "white",
                        margin: "auto",
                        padding: "2%",
                        border: '2px solid',
                        borderColor: 'rgb(219, 219, 219)',
                        boxShadow: "2px solid black",
                    }}
                >
                    {children}
                    <button onClick={onClose}>Exit</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;