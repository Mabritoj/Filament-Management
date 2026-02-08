import React from 'react';

export function AddFilamentCard({ onClick }) {
    return (
        <div className="add-filament-card" onClick={onClick}>
            <div className="add-card-icon">
                +
            </div>
            <div className="add-card-content">
                <div className="add-card-title">Add New Roll</div>
                <div className="add-card-subtitle">
                    Click to add filament
                </div>
            </div>
        </div>
    );
}
