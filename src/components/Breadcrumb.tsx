import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Breadcrumb() {
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);

    // Build breadcrumb items
    const breadcrumbs = [
        { label: 'Inventory', path: '/' }
    ];

    // If we're on a detail page, add the filament name
    if (pathSegments.length > 0 && location.state?.filamentName) {
        breadcrumbs.push({
            label: location.state.filamentName,
            path: location.pathname
        });
    }

    return (
        <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            marginBottom: 'var(--space-md)'
        }}>
            {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.path}>
                    {index > 0 && <span style={{ color: 'var(--text-dim)' }}>/</span>}
                    {index === breadcrumbs.length - 1 ? (
                        <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>
                            {crumb.label}
                        </span>
                    ) : (
                        <Link
                            to={crumb.path}
                            style={{
                                color: 'var(--primary)',
                                textDecoration: 'none',
                                transition: 'color 0.2s'
                            }}
                        >
                            {crumb.label}
                        </Link>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
}
