import React from 'react';

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-container-sm glass-panel"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="modal-title">
                    {title}
                </h2>
                <p className="modal-message">
                    {message}
                </p>

                <div className="flex gap-md">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-cancel"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="btn-delete"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
