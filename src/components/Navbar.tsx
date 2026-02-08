import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useState, useRef, useEffect } from 'react';

export function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
        };

        if (showProfileMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfileMenu]);

    const handleSettingsClick = () => {
        setShowProfileMenu(false);
        navigate('/settings');
    };

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '64px',
            background: 'var(--bg-panel)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 var(--space-lg)',
            zIndex: 100,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            {/* Left: Logo */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-lg)',
                    cursor: 'pointer'
                }}
                onClick={() => navigate('/')}
            >
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, var(--primary), var(--accent-purple))',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    color: '#000',
                    boxShadow: '0 0 15px var(--primary-glow)'
                }}>
                    F
                </div>
                <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Filament Manager</span>
            </div>

            {/* Right: Theme Toggle & Profile Icon */}
            <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'var(--bg-card)',
                        border: '2px solid var(--border-focus)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-focus)'}
                    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                    {theme === 'dark' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    )}
                </button>

                {/* Profile Icon with Dropdown */}
                <div ref={menuRef} style={{ position: 'relative' }}>
                    <div
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'var(--bg-card)',
                            border: '2px solid var(--border-focus)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'border-color 0.2s'
                        }}
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-focus)'}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                        </svg>
                    </div>

                    {/* Dropdown Menu */}
                    {showProfileMenu && (
                        <div style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            right: 0,
                            background: 'var(--bg-panel)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                            minWidth: '180px',
                            overflow: 'hidden',
                            zIndex: 1000
                        }}>
                            <button
                                onClick={handleSettingsClick}
                                style={{
                                    width: '100%',
                                    padding: 'var(--space-md)',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-main)',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-sm)',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M12 1v6m0 6v6m-8-8h6m6 0h6" />
                                    <path d="m20.2 20.2-4.2-4.2m-8 0-4.2 4.2M20.2 3.8l-4.2 4.2m-8 0L3.8 3.8" />
                                </svg>
                                Settings
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
