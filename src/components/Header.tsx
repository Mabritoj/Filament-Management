import React from 'react';

export function Header({ onAddClick }) {
    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-xl)',
            padding: 'var(--space-md) 0'
        }}>
            <div>
                <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>
                    <span style={{ color: 'var(--primary)' }}>Filament</span> Manager
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Inventory Status</p>
            </div>

            <button
                onClick={onAddClick}
                style={{
                    background: 'linear-gradient(135deg, var(--primary), var(--accent-purple))',
                    color: '#000',
                    fontWeight: '600',
                    padding: '12px 24px',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 4px 12px var(--primary-glow)',
                    transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
                + Add New Roll
            </button>
        </header>
    );
}
