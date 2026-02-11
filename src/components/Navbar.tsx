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
        <nav className="navbar">
            {/* Left: Logo */}
            <div
                className="navbar-logo"
                onClick={() => navigate('/')}
            >
                <img
                    src="/src/assets/filacrypt-logo.svg"
                    alt="Filacrypt Logo"
                    className="navbar-logo-img"
                />
                <span className="navbar-logo-text">Filacrypt</span>
            </div>

            {/* Right: Theme Toggle & Profile Icon */}
            <div className="navbar-actions">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="icon-btn"
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
                        className="icon-btn"
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                        </svg>
                    </div>

                    {/* Dropdown Menu */}
                    {showProfileMenu && (
                        <div className="dropdown-menu">
                            <button
                                onClick={handleSettingsClick}
                                className="dropdown-item"
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
