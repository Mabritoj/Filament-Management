import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'filament-inventory-v1';

export function Settings() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        try {
            const filaments = localStorage.getItem(STORAGE_KEY) || '[]';
            const data = JSON.parse(filaments);

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `filament-inventory-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export data');
        }
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const data = JSON.parse(content);

                // Validate data structure
                if (!Array.isArray(data)) {
                    throw new Error('Invalid data format');
                }

                const confirmImport = window.confirm(
                    `This will import ${data.length} filament(s). Current data will be replaced. Continue?`
                );

                if (confirmImport) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                    alert('Import successful! Redirecting to inventory...');
                    navigate('/');
                    window.location.reload();
                }
            } catch (error) {
                console.error('Import failed:', error);
                alert('Failed to import data. Please check the file format.');
            }
        };

        reader.readAsText(file);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: 'var(--space-xl)'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
                marginBottom: 'var(--space-xl)'
            }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: 'var(--space-sm)',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 style={{ fontSize: '2rem', margin: 0 }}>Settings</h1>
            </div>

            {/* Data Management Section */}
            <div style={{
                background: 'var(--bg-panel)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-lg)',
                marginBottom: 'var(--space-lg)'
            }}>
                <h2 style={{
                    fontSize: '1.2rem',
                    marginBottom: 'var(--space-md)',
                    color: 'var(--text-main)'
                }}>
                    Data Management
                </h2>
                <p style={{
                    color: 'var(--text-muted)',
                    marginBottom: 'var(--space-lg)',
                    fontSize: '0.9rem'
                }}>
                    Export your filament inventory as JSON for backup, or import data from a previous export.
                </p>

                <div style={{
                    display: 'flex',
                    gap: 'var(--space-md)',
                    flexWrap: 'wrap'
                }}>
                    {/* Export Button */}
                    <button
                        onClick={handleExport}
                        style={{
                            flex: '1',
                            minWidth: '200px',
                            padding: 'var(--space-md) var(--space-lg)',
                            background: 'var(--bg-card)',
                            border: '2px solid var(--border-focus)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--space-sm)',
                            fontSize: '1rem',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--primary)';
                            e.currentTarget.style.background = 'var(--bg-card-hover)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-focus)';
                            e.currentTarget.style.background = 'var(--bg-card)';
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Export Data
                    </button>

                    {/* Import Button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            flex: '1',
                            minWidth: '200px',
                            padding: 'var(--space-md) var(--space-lg)',
                            background: 'var(--bg-card)',
                            border: '2px solid var(--border-focus)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--space-sm)',
                            fontSize: '1rem',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--primary)';
                            e.currentTarget.style.background = 'var(--bg-card-hover)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-focus)';
                            e.currentTarget.style.background = 'var(--bg-card)';
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Import Data
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        style={{ display: 'none' }}
                    />
                </div>
            </div>

            {/* Future sections can go here */}
            <div style={{
                background: 'var(--bg-panel)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-lg)',
                border: '2px dashed var(--border-subtle)'
            }}>
                <p style={{
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    margin: 0,
                    fontSize: '0.9rem'
                }}>
                    More settings coming soon...
                </p>
            </div>
        </div>
    );
}
