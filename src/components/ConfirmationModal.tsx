import React from 'react';

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}
            onClick={onClose}
        >
            <div
                className="glass-panel"
                style={{
                    width: '450px',
                    maxWidth: '90%',
                    padding: 'var(--space-lg)',
                    borderRadius: 'var(--radius-lg)',
                }}
                onClick={e => e.stopPropagation()}
            >
                <h2 style={{ marginBottom: 'var(--space-md)', fontSize: '1.5rem' }}>
                    {title}
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-xl)', lineHeight: '1.5' }}>
                    {message}
                </p>

                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-focus)',
                            color: 'var(--text-main)',
                            fontWeight: '500'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--secondary)',
                            color: '#fff',
                            fontWeight: '600'
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
