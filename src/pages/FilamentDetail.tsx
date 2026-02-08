import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFilaments } from '../context/FilamentContext';
import { Breadcrumb } from '../components/Breadcrumb';
import { ConfirmationModal } from '../components/ConfirmationModal';

export function FilamentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { filaments, deleteFilament } = useFilaments();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const filament = filaments.find(f => f.id === id);

    if (!filament) {
        return (
            <div className="p-xl text-center">
                <h2>Filament not found</h2>
                <button onClick={() => navigate('/')} className="btn btn-primary mt-md">
                    Back to Inventory
                </button>
            </div>
        );
    }

    const percentage = Math.min(100, Math.max(0, (filament.weightRemaining / filament.weightTotal) * 100));

    const handleDelete = () => {
        if (id) {
            deleteFilament(id);
            navigate('/');
        }
    };

    return (
        <>
            <Breadcrumb />

            <div className="w-full">
                {/* Header with actions */}
                <div className="flex-between mb-lg gap-sm flex-wrap">
                    <h1 className="heading-xl min-w-200">
                        {filament.name || `${filament.brand} ${filament.colorName}`}
                    </h1>

                    <div className="flex gap-sm flex-shrink-0">
                        <button onClick={() => navigate('/')} className="btn-outline">
                            ← Back
                        </button>
                        <button onClick={() => setShowDeleteModal(true)} className="btn btn-secondary">
                            Delete
                        </button>
                    </div>
                </div>

                {/* Hero Section with Color Swatch and Key Info */}
                <div className="glass-panel hero-panel">
                    <div className="flex gap-xl flex-start flex-wrap">
                        {/* SVG Filament Spool */}
                        <div className="flex flex-col items-center gap-sm">
                            <div
                                className="spool-container"
                                style={{
                                    boxShadow: `0 8px 24px ${filament.colorHex}40, 0 0 0 1px rgba(255,255,255,0.1)`
                                }}
                            >
                                {/* SVG Spool */}
                                <svg viewBox="0 0 200 200" className="spool-svg">
                                    {/* Outer cardboard ring */}
                                    <circle cx="100" cy="100" r="90" fill="#8B7355" opacity="0.9" />

                                    {/* Filament wound section - this gets the dynamic color */}
                                    <circle cx="100" cy="100" r="70" fill={filament.colorHex} />

                                    {/* Inner cardboard hub */}
                                    <circle cx="100" cy="100" r="35" fill="#A0826D" opacity="0.95" />

                                    {/* Center hole */}
                                    <circle cx="100" cy="100" r="15" fill="rgba(0,0,0,0.3)" />

                                    {/* Add some depth with subtle gradients */}
                                    <defs>
                                        <radialGradient id={`filamentGlow-${filament.id}`}>
                                            <stop offset="0%" stopColor={filament.colorHex} stopOpacity="1" />
                                            <stop offset="100%" stopColor={filament.colorHex} stopOpacity="0.7" />
                                        </radialGradient>
                                    </defs>

                                    {/* Highlight for dimension */}
                                    <ellipse cx="100" cy="80" rx="25" ry="12" fill="white" opacity="0.15" />
                                </svg>
                            </div>
                        </div>

                        {/* Key Specs Grid */}
                        <div className="flex-1 min-w-300">
                            <div className="stats-grid mb-md">
                                <QuickStat icon="🏷️" label="Brand" value={filament.brand} />
                                <QuickStat icon="🎨" label="Color" value={filament.colorName || 'N/A'} />
                                <QuickStat icon="🧬" label="Material" value={filament.type} />
                                <QuickStat icon="📏" label="Diameter" value={`${filament.diameter || 1.75}mm`} />
                                <QuickStat icon="📅" label="Added" value={filament.createdAt ? new Date(filament.createdAt).toLocaleDateString() : 'N/A'} />
                            </div>
                        </div>
                    </div>

                    {/* Weight Progress Bar */}
                    <div className="section-divider">
                        <div className="flex-between mb-sm items-baseline">
                            <span className="text-md text-muted text-medium">Weight Remaining</span>
                            <div className="flex items-baseline gap-sm">
                                <span className="text-3xl text-bold text-main">
                                    {filament.weightRemaining}g
                                </span>
                                <span className="text-md text-dim">
                                    / {filament.weightTotal}g
                                </span>
                            </div>
                        </div>
                        <div className="progress-container">
                            <div
                                className={`progress-fill ${percentage > 50 ? 'progress-fill-high' : 'progress-fill-low'}`}
                                style={{ width: `${percentage}%` }}
                            >
                                <div className="progress-shimmer" />
                            </div>
                        </div>
                        <div className="text-right mt-xs text-base text-dim text-semibold">
                            {Math.round(percentage)}% remaining
                        </div>
                    </div>
                </div>

                {/* Info Cards Grid */}
                <div className="grid-auto-fit mb-lg">
                    {/* Temperature Card */}
                    {(filament.nozzleTemp || filament.bedTemp || filament.dryingTemp) && (
                        <InfoCard title="🌡️ Temperature Settings" icon="🌡️">
                            <div className="info-grid">
                                {filament.nozzleTemp && <PropertyItem label="Nozzle Temp" value={filament.nozzleTemp.includes('-') ? `${filament.nozzleTemp}°C` : `${filament.nozzleTemp}°C`} />}
                                {filament.bedTemp && <PropertyItem label="Bed Temp" value={`${filament.bedTemp}°C`} />}
                                {filament.dryingTemp && <PropertyItem label="Drying Temp" value={`${filament.dryingTemp}°C`} />}
                                {filament.dryingTime && <PropertyItem label="Drying Time" value={`${filament.dryingTime} hours`} />}
                            </div>
                        </InfoCard>
                    )}

                    {/* Weight Details Card */}
                    {filament.spoolWeight && (
                        <InfoCard title="⚖️ Weight Breakdown" icon="⚖️">
                            <div className="info-grid">
                                <PropertyItem label="Total Weight" value={`${filament.weightTotal}g`} />
                                <PropertyItem label="Spool Weight" value={`${filament.spoolWeight}g`} />
                                <PropertyItem label="Net Filament" value={`${filament.weightRemaining - (filament.spoolWeight || 0)}g`} />
                            </div>
                        </InfoCard>
                    )}

                    {/* Material Properties Card */}
                    {(filament.density || filament.materialId || filament.countryOfOrigin) && (
                        <InfoCard title="🧪 Material Properties" icon="🧪">
                            <div className="info-grid">
                                {filament.density && <PropertyItem label="Density" value={`${filament.density} g/cm³`} />}
                                {filament.materialId && <PropertyItem label="Material ID (EAN/UPC)" value={filament.materialId} />}
                                {filament.countryOfOrigin && <PropertyItem label="Country of Origin" value={filament.countryOfOrigin.toUpperCase()} />}
                            </div>
                        </InfoCard>
                    )}
                </div>

                {/* Tags Section */}
                {filament.tags && filament.tags.length > 0 && (
                    <div className="glass-panel p-lg mb-lg">
                        <h3 className="section-heading mb-md">
                            🏷️ Material Tags
                        </h3>
                        <div className="flex gap-sm flex-wrap">
                            {filament.tags.map((tag, idx) => (
                                <span key={idx} className="tag-badge">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Product Link Card */}
                {filament.manufacturerUrl && (
                    <div className="glass-panel p-lg mb-lg">
                        <h3 className="section-heading mb-md">
                            🔗 Product Information
                        </h3>
                        <a
                            href={filament.manufacturerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-card"
                        >
                            <span className="text-2xl">🔗</span>
                            <span>Manufacturer Product Page</span>
                            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>↗</span>
                        </a>
                    </div>
                )}

                {/* Notes Section */}
                {filament.notes && (
                    <div className="glass-panel p-lg">
                        <h3 className="section-heading mb-md">
                            📝 Notes
                        </h3>
                        <p className="text-main text-lg whitespace-pre-wrap" style={{ lineHeight: '1.7', margin: 0 }}>
                            {filament.notes}
                        </p>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Filament Roll?"
                message={`Are you sure you want to delete ${filament.name || filament.brand}? This action cannot be undone.`}
            />
        </>
    );
}

function QuickStat({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <div className="stat-card">
            <span className="quick-stat-icon">{icon}</span>
            <div>
                <div className="quick-stat-label">
                    {label}
                </div>
                <div className="quick-stat-value">
                    {value}
                </div>
            </div>
        </div>
    );
}

function InfoCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
    return (
        <div className="glass-panel info-card">
            <h3 className="section-heading mb-md flex items-center gap-xs">
                <span className="text-2xl">{icon}</span>
                {title.replace(icon, '').trim()}
            </h3>
            {children}
        </div>
    );
}

function PropertyItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className="property-item-label">
                {label}
            </div>
            <div className="property-item-value">
                {value}
            </div>
        </div>
    );
}
