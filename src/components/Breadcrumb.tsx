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
    } else if (pathSegments.length === 0) {
        // If on the root path, the "Home" link is the current item
        // No additional breadcrumbs needed from the array
    } else {
        // For other paths, we might want to add segments, but the original only added filamentName
        // For now, we'll keep it as is, only adding filamentName if present.
        // If the intent was to show "Home / Inventory" or "Home / SomeOtherPage",
        // the breadcrumbs array construction would need to be more dynamic.
        // Based on the original code, the only dynamic part was the filamentName.
        // The "Inventory" was the base.
        // Let's assume "Inventory" is now replaced by "Home" in the hardcoded link.
        // If the path is not root and not a detail page, we don't add anything to breadcrumbs array
        // based on the original logic.
    }


    return (
        <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            {breadcrumbs.length > 0 && breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                    <span className="breadcrumb-separator"> / </span>
                    {index === breadcrumbs.length - 1 ? (
                        <span className="breadcrumb-current">{crumb.label}</span>
                    ) : (
                        <Link to={crumb.path} className="breadcrumb-link">{crumb.label}</Link>
                    )}
                </React.Fragment>
            ))}

        </nav >
    );
}
