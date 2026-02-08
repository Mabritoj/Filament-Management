import React from 'react';
import { useNavigate } from 'react-router-dom';

export function FilamentCard({ filament, onEdit, onDelete }) {
    const navigate = useNavigate();
    const percentage = Math.min(100, Math.max(0, (filament.weightRemaining / filament.weightTotal) * 100));

    // Determine color coding for percentage bar
    let barColor = 'var(--primary)';
    if (percentage < 20) barColor = 'var(--secondary)'; // Low stock
    else if (percentage < 50) barColor = 'var(--accent-green)'; // Medium

    const handleCardClick = () => {
        navigate(`/filament/${filament.id}`, {
            state: { filamentName: filament.name || `${filament.brand} ${filament.colorName}` }
        });
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit(filament);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(filament.id);
    };

    return (
        <div
            className="glass-panel filament-card"
            onClick={handleCardClick}
        >
            <div>
                <div className="flex-between items-start">
                    <div>
                        <div className="text-sm text-muted text-uppercase letter-spacing mb-xs">
                            {filament.brand}
                        </div>
                        <h3 className="text-2xl" style={{ margin: '0 0 6px' }}>
                            {filament.name || filament.colorName}
                        </h3>
                        <div className="flex gap-sm items-center flex-wrap">
                            <span className="material-badge">
                                {filament.type}
                            </span>
                            <span className="text-dim text-base">{filament.colorName}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-xs">
                        <button onClick={handleEdit} className="btn-icon">✏️</button>
                        <button onClick={handleDelete} className="btn-icon" style={{ color: 'var(--secondary)' }}>🗑️</button>
                    </div>
                </div>

                {/* Amount Bar */}
                <div className="mt-lg">
                    <div className="flex-between text-sm text-muted mb-xs">
                        <span>{Math.round(filament.weightRemaining)}g remaining</span>
                        <span>{Math.round(percentage)}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--progress-bg)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${percentage}%`,
                            height: '100%',
                            backgroundColor: barColor,
                            boxShadow: `0 0 8px ${barColor}`,
                            transition: 'width 0.5s ease'
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
