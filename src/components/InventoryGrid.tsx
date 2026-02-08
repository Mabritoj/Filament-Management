import React, { useState, useEffect } from 'react';
import { FilamentCard } from './FilamentCard';

export function InventoryGrid({ filaments, onEdit, onDelete, addCard }) {
    if (filaments.length === 0 && !addCard) {
        return (
            <div style={{
                textAlign: 'center',
                padding: 'var(--space-xl)',
                color: 'var(--text-dim)',
                border: '2px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-lg)'
            }}>
                <p>No filaments in inventory yet.</p>
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
