import React, { useState, useEffect } from 'react';
import { FilamentCard } from './FilamentCard';

export function InventoryGrid({ filaments, onEdit, onDelete, addCard }) {
    if (filaments.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="35" r="15" stroke="var(--accent-gold)" strokeWidth="3" />
                        <path d="M 42 48 L 58 48 L 60 75 L 40 75 Z" fill="var(--accent-gold)" opacity="0.6" />
                    </svg>
                </div>
                <h3 className="empty-state-title">No Filaments Found</h3>
                <p className="empty-state-message">
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
