import React, { useState, useEffect } from 'react';
import { FilamentCard } from './FilamentCard';

export function InventoryGrid({ filaments, onEdit, onDelete, addCard }) {
    if (filaments.length === 0 && !addCard) {
        return (
            <div style={{
                textAlign: 'center',
                padding: 'var(--space-xl)',
                color: 'var(--text-muted)',
                border: '2px dashed var(--border-gold)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-panel)',
                maxWidth: '500px',
                margin: '0 auto'
            }}>
                {/* Keyhole Icon */}
                <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto var(--space-lg)',
                    opacity: 0.5
                }}>
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="35" r="15" stroke="var(--accent-gold)" strokeWidth="3" />
                        <path d="M 42 48 L 58 48 L 60 75 L 40 75 Z" fill="var(--accent-gold)" opacity="0.6" />
                    </svg>
                </div>
                <p style={{
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    marginBottom: 'var(--space-sm)',
                    color: 'var(--text-main)'
                }}>
                    Your vault is empty
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                    Begin building your treasure collection
                </p>
            </div>
        );
    }

    return (
        <div className="inventory-grid">
            {addCard}
            {filaments.map(filament => (
                <FilamentCard
                    key={filament.id}
                    filament={filament}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
