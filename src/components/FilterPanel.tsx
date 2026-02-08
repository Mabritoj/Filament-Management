import React, { useState, useEffect } from 'react';

export function FilterPanel({ filters, onFilterChange, filaments }) {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile viewport
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Update CSS variable to adjust main content padding
    useEffect(() => {
        // When collapsed: 16px strip + 24px padding = 40px total
        // When expanded: 280px sidebar + 20px padding = 300px total
        document.documentElement.style.setProperty('--filter-width', isCollapsed ? '40px' : '300px');
    }, [isCollapsed]);

    // Extract unique values from filaments
    const uniqueBrands = [...new Set(filaments.map(f => f.brand))].sort();
    const uniqueTypes = [...new Set(filaments.map(f => f.type))].sort();
    const uniqueColors = [...new Set(filaments.map(f => f.colorName).filter(Boolean))].sort();

    const handleCheckboxChange = (category, value) => {
        const currentFilters = filters[category] || [];
        const newFilters = currentFilters.includes(value)
            ? currentFilters.filter(v => v !== value)
            : [...currentFilters, value];

        onFilterChange({ ...filters, [category]: newFilters });
    };

    const clearFilters = () => {
        onFilterChange({ brands: [], types: [], colors: [] });
    };

    const handleToggleClick = () => {
        if (isMobile) {
            setIsMobileOpen(!isMobileOpen);
        } else {
            setIsCollapsed(!isCollapsed);
        }
    };

    const handleBackdropClick = () => {
        if (isMobile) {
            setIsMobileOpen(false);
        }
    };

    const hasActiveFilters =
        (filters.brands?.length > 0) ||
        (filters.types?.length > 0) ||
        (filters.colors?.length > 0);

    return (
        <>
            {/* Backdrop for mobile */}
            {isMobile && (
                <div
                    className={`filter-backdrop ${isMobileOpen ? 'active' : ''}`}
                    onClick={handleBackdropClick}
                />
            )}

            <div
                className={`filter-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobile && isMobileOpen ? 'mobile-open' : ''} ${isMobile ? 'mobile' : ''}`}
            >
                {!isCollapsed && (
                    <>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 'var(--space-md)'
                        }}>
                            <h3 style={{ fontSize: '1rem', margin: 0 }}>Filters</h3>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--primary)',
                                        textDecoration: 'underline',
                                        padding: '4px'
                                    }}
                                >
                                    Clear All
                                </button>
                            )}
                        </div>

                        {/* Filter Content */}
                        <div style={{
                            animation: 'fadeIn 0.2s ease-in',
                            overflow: 'hidden'
                        }}>
                            {/* Brand Filters */}
                            {uniqueBrands.length > 0 && (
                                <div style={{ marginBottom: 'var(--space-lg)' }}>
                                    <h4 style={{
                                        fontSize: '0.85rem',
                                        color: 'var(--text-muted)',
                                        textTransform: 'uppercase',
                                        marginBottom: 'var(--space-sm)',
                                        letterSpacing: '0.05em'
                                    }}>
                                        Brand
                                    </h4>
                                    {uniqueBrands.map(brand => (
                                        <label
                                            key={brand}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-sm)',
                                                marginBottom: 'var(--space-xs)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={filters.brands?.includes(brand) || false}
                                                onChange={() => handleCheckboxChange('brands', brand)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <span style={{ fontSize: '0.9rem' }}>{brand}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {/* Type Filters */}
                            {uniqueTypes.length > 0 && (
                                <div style={{ marginBottom: 'var(--space-lg)' }}>
                                    <h4 style={{
                                        fontSize: '0.85rem',
                                        color: 'var(--text-muted)',
                                        textTransform: 'uppercase',
                                        marginBottom: 'var(--space-sm)',
                                        letterSpacing: '0.05em'
                                    }}>
                                        Material Type
                                    </h4>
                                    {uniqueTypes.map(type => (
                                        <label
                                            key={type}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-sm)',
                                                marginBottom: 'var(--space-xs)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={filters.types?.includes(type) || false}
                                                onChange={() => handleCheckboxChange('types', type)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <span style={{ fontSize: '0.9rem' }}>{type}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {/* Color Filters */}
                            {uniqueColors.length > 0 && (
                                <div>
                                    <h4 style={{
                                        fontSize: '0.85rem',
                                        color: 'var(--text-muted)',
                                        textTransform: 'uppercase',
                                        marginBottom: 'var(--space-sm)',
                                        letterSpacing: '0.05em'
                                    }}>
                                        Color
                                    </h4>
                                    {uniqueColors.map(color => (
                                        <label
                                            key={color}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-sm)',
                                                marginBottom: 'var(--space-xs)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={filters.colors?.includes(color) || false}
                                                onChange={() => handleCheckboxChange('colors', color)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <span style={{ fontSize: '0.9rem' }}>{color}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Floating toggle button */}
            <button
                className="filter-toggle-btn"
                onClick={handleToggleClick}
                style={{
                    position: 'fixed',
                    right: isCollapsed ? '16px' : '296px',
                    top: '80px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--bg-panel)',
                    border: '2px solid var(--border-focus)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'right 0.3s ease, border-color 0.2s',
                    zIndex: isMobile ? 1001 : 50,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-focus)'}
                title={isMobile ? (isMobileOpen ? 'Close filters' : 'Open filters') : (isCollapsed ? 'Show filters' : 'Hide filters')}
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                        transform: (isMobile ? !isMobileOpen : isCollapsed) ? 'rotate(0deg)' : 'rotate(180deg)',
                        transition: 'transform 0.3s ease'
                    }}
                >
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            </button>
        </>
    );
}
