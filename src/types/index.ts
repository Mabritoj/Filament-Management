// Filament type definition
export interface Filament {
    id: string;
    brand: string;
    name?: string;
    type: string;
    colorName: string;
    colorHex: string;
    weightTotal: number;
    weightRemaining: number;
    diameter: number;
    notes?: string;
    createdAt?: string;
    
    // Material Properties (OpenPrintTag)
    density?: number; // g/cm³
    materialId?: string; // EAN/UPC barcode
    countryOfOrigin?: string; // ISO 3166-1 alpha-2 code
    tags?: string[]; // Material property tags
    
    // Temperature Settings
    nozzleTemp?: string; // Can be range like "200-220" or single value
    bedTemp?: number; // °C
    dryingTemp?: number; // °C
    dryingTime?: number; // hours
    
    // Additional Metadata
    manufacturerUrl?: string; // Product page URL
    spoolWeight?: number; // Empty spool weight in grams
}

// Filter types
export interface Filters {
    brands: string[];
    types: string[];
    colors: string[];
}

// Stats type
export interface FilamentStats {
    totalWeight: number;
    totalRolls: number;
}

// Context types
export interface FilamentContextType {
    filaments: Filament[];
    addFilament: (filament: Omit<Filament, 'id' | 'createdAt'>) => void;
    updateFilament: (id: string, updates: Partial<Filament>) => void;
    deleteFilament: (id: string) => void;
    stats: FilamentStats;
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}
