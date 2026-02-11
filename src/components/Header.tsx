import React from 'react';

export function Header({ onAddClick }) {
    return (
        <header className="page-header">
            <div>
                <h1 className="page-title">Filament Vault</h1>
                <p className="page-subtitle">Manage your 3D printing materials</p>
            </div>
            <button onClick={onAdd} className="btn-add">
                + Add New Roll
            </button>
        </header>
    );
}
