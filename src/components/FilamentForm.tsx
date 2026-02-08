import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import type { Filament } from '../types';

interface PresetColor {
    name: string;
    hex: string;
}

const PRESET_COLORS: PresetColor[] = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Grey', hex: '#808080' },
    { name: 'Red', hex: '#FF0000' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Green', hex: '#00FF00' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Orange', hex: '#FFA500' },
    { name: 'Purple', hex: '#800080' },
];

const MATERIAL_TYPES = ['PLA', 'PLA+', 'PETG', 'ABS', 'ASA', 'TPU', 'Nylon', 'PC'] as const;

interface FilamentFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Filament, 'id' | 'createdAt'>) => void;
    initialData?: Filament | null | undefined;
}

type FormData = Omit<Filament, 'id' | 'createdAt'>;

export function FilamentForm({ isOpen, onClose, onSubmit, initialData = null }: FilamentFormProps) {
    const [formData, setFormData] = useState<FormData>({
        brand: '',
        name: '',
        type: 'PLA',
        colorName: '',
        colorHex: '#000000',
        weightTotal: 1000,
        weightRemaining: 1000,
        diameter: 1.75,
        notes: '',
        // Material Properties
        density: undefined,
        materialId: '',
        countryOfOrigin: '',
        tags: [],
        // Temperature Settings
        nozzleTemp: '',
        bedTemp: undefined,
        dryingTemp: undefined,
        dryingTime: undefined,
        // Additional Metadata
        manufacturerUrl: '',
        spoolWeight: undefined
    });
    const [showAdvanced, setShowAdvanced] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                brand: initialData.brand,
                name: initialData.name || '',
                type: initialData.type,
                colorName: initialData.colorName,
                colorHex: initialData.colorHex,
                weightTotal: initialData.weightTotal,
                weightRemaining: initialData.weightRemaining,
                diameter: initialData.diameter,
                notes: initialData.notes || '',
                density: initialData.density,
                materialId: initialData.materialId || '',
                countryOfOrigin: initialData.countryOfOrigin || '',
                tags: initialData.tags || [],
                nozzleTemp: initialData.nozzleTemp || '',
                bedTemp: initialData.bedTemp,
                dryingTemp: initialData.dryingTemp,
                dryingTime: initialData.dryingTime,
                manufacturerUrl: initialData.manufacturerUrl || '',
                spoolWeight: initialData.spoolWeight
            });
            // Show advanced section if any advanced fields are populated
            if (initialData.density || initialData.materialId || initialData.nozzleTemp ||
                initialData.bedTemp || initialData.tags?.length || initialData.manufacturerUrl) {
                setShowAdvanced(true);
            }
        } else {
            setFormData({
                brand: '',
                name: '',
                type: 'PLA',
                colorName: '',
                colorHex: '#000000',
                weightTotal: 1000,
                weightRemaining: 1000,
                diameter: 1.75,
                notes: '',
                density: undefined,
                materialId: '',
                countryOfOrigin: '',
                tags: [],
                nozzleTemp: '',
                bedTemp: undefined,
                dryingTemp: undefined,
                dryingTime: undefined,
                manufacturerUrl: '',
                spoolWeight: undefined
            });
            setShowAdvanced(false);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Clean up the form data - only remove truly undefined/null values and empty arrays
        const cleanedData = { ...formData };
        if (cleanedData.density === undefined) delete cleanedData.density;
        if (cleanedData.bedTemp === undefined) delete cleanedData.bedTemp;
        if (cleanedData.dryingTemp === undefined) delete cleanedData.dryingTemp;
        if (cleanedData.dryingTime === undefined) delete cleanedData.dryingTime;
        if (cleanedData.spoolWeight === undefined) delete cleanedData.spoolWeight;
        if (!cleanedData.tags?.length) delete cleanedData.tags;

        onSubmit(cleanedData);
        onClose();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // If changing weightRemaining, ensure it doesn't exceed weightTotal
        if (name === 'weightRemaining') {
            const numValue = Number(value);
            const totalWeight = Number(formData.weightTotal);
            setFormData(prev => ({
                ...prev,
                [name]: numValue > totalWeight ? totalWeight : numValue
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value === '' ? undefined : Number(value) }));
    };

    const handleColorPreset = (color: PresetColor) => {
        setFormData(prev => ({
            ...prev,
            colorName: color.name,
            colorHex: color.hex
        }));
    };

    const handleAddTag = (tag: string) => {
        if (tag && !formData.tags?.includes(tag)) {
            setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tag] }));
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tagToRemove) || [] }));
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div
                className="glass-panel"
                style={{
                    width: '750px',
                    maxWidth: '90%',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header - Sticky */}
                <h2 style={{
                    margin: 0,
                    padding: 'var(--space-lg)',
                    paddingBottom: 'var(--space-md)',
                    backgroundColor: 'var(--bg-card)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid var(--border-subtle)',
                }}>{initialData ? 'Edit Roll' : 'Add New Roll'}</h2>

                {/* Scrollable Form Content */}
                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{
                        padding: 'var(--space-lg)',
                        paddingTop: 'var(--space-md)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-md)',
                        overflowY: 'auto',
                        flex: 1
                    }}>
                        {/* Brand & Type */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                            <label>
                                <div style={{ marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Brand</div>
                                <input
                                    required
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--border-focus)',
                                        background: 'rgba(0,0,0,0.3)',
                                        color: 'white'
                                    }}
                                    placeholder="e.g. Prusament"
                                />
                            </label>
                            <label>
                                <div style={{ marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Material</div>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--border-focus)',
                                        background: 'rgba(0,0,0,0.3)',
                                        color: 'white'
                                    }}
                                >
                                    {MATERIAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </label>
                        </div>

                        {/* Filament Name */}
                        <label>
                            <div style={{ marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Filament Name</div>
                            <input
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--border-focus)',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: 'white'
                                }}
                                placeholder="e.g. Galaxy Black"
                            />
                        </label>

                        {/* Color Section */}
                        <div>
                            <div style={{ marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Color</div>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <input
                                    type="color"
                                    name="colorHex"
                                    value={formData.colorHex}
                                    onChange={handleChange}
                                    style={{ border: 'none', width: '40px', height: '40px', borderRadius: '4px', cursor: 'pointer' }}
                                />
                                <input
                                    required
                                    name="colorName"
                                    value={formData.colorName}
                                    onChange={handleChange}
                                    placeholder="Color Name"
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--border-focus)',
                                        background: 'rgba(0,0,0,0.3)',
                                        color: 'white'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {PRESET_COLORS.map(c => (
                                    <button
                                        key={c.name}
                                        type="button"
                                        onClick={() => handleColorPreset(c)}
                                        style={{
                                            width: '24px', height: '24px',
                                            borderRadius: '50%',
                                            backgroundColor: c.hex,
                                            border: formData.colorHex === c.hex ? '2px solid white' : '1px solid grey'
                                        }}
                                        title={c.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Weights */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                            <label>
                                <div style={{ marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Remaining (g)</div>
                                <input
                                    required
                                    type="number"
                                    name="weightRemaining"
                                    value={formData.weightRemaining}
                                    onChange={handleChange}
                                    min="0"
                                    max={formData.weightTotal}
                                    style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-focus)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                                />
                            </label>
                            <label>
                                <div style={{ marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Weight (g)</div>
                                <input
                                    required
                                    type="number"
                                    name="weightTotal"
                                    value={formData.weightTotal}
                                    onChange={handleChange}
                                    min="1"
                                    style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-focus)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                                />
                            </label>
                        </div>

                        {/* Advanced Fields Toggle */}
                        <button
                            type="button"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border-focus)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--text-muted)',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                marginTop: 'var(--space-sm)'
                            }}
                        >
                            {showAdvanced ? '▼' : '▶'} Advanced Properties (Optional)
                        </button>

                        {/* Advanced Fields Section */}
                        {showAdvanced && (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--space-md)',
                                paddingTop: 'var(--space-md)',
                                borderTop: '1px solid var(--border-subtle)'
                            }}>
                                {/* Temperature Settings */}
                                <div style={{ marginBottom: 'var(--space-sm)' }}>
                                    <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>
                                        Temperature Settings
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                                        <label>
                                            <div style={{ marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Nozzle Temp</div>
                                            <input
                                                name="nozzleTemp"
                                                value={formData.nozzleTemp || ''}
                                                onChange={handleChange}
                                                placeholder="e.g. 200-220"
                                                style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-focus)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                                            />
                                        </label>
                                        <label>
                                            <div style={{ marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Bed Temp (°C)</div>
                                            <input
                                                type="number"
                                                name="bedTemp"
                                                value={formData.bedTemp || ''}
                                                onChange={handleNumberChange}
                                                placeholder="e.g. 60"
                                                style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-focus)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                                            />
                                        </label>
                                        <label>
                                            <div style={{ marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Drying Temp (°C)</div>
                                            <input
                                                type="number"
                                                name="dryingTemp"
                                                value={formData.dryingTemp || ''}
                                                onChange={handleNumberChange}
                                                placeholder="e.g. 50"
                                                style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-focus)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                                            />
                                        </label>
                                        <label>
                                            <div style={{ marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Drying Time (hrs)</div>
                                            <input
                                                type="number"
                                                name="dryingTime"
                                                value={formData.dryingTime || ''}
                                                onChange={handleNumberChange}
                                                placeholder="e.g. 6"
                                                style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-focus)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Material Properties */}
                                <div style={{ marginBottom: 'var(--space-sm)' }}>
                                    <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>
                                        Material Properties
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                                        <label>
                                            <div style={{ marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Density (g/cm³)</div>
                                            <input
                                                type="number"
                                                step="0.01"
                                                name="density"
                                                value={formData.density || ''}
                                                onChange={handleNumberChange}
                                                placeholder="e.g. 1.24"
                                                style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-focus)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                                            />
                                        </label>
                                        <label>
                                            <div style={{ marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Spool Weight (g)</div>
                                            <input
                                                type="number"
                                                name="spoolWeight"
                                                value={formData.spoolWeight || ''}
                                                onChange={handleNumberChange}
                                                placeholder="e.g. 200"
                                                style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-focus)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                                            />
                                        </label>
                                        <label>
                                            <div style={{ marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Material ID (EAN/UPC)</div>
                                            <input
                                                name="materialId"
                                                value={formData.materialId || ''}
                                                onChange={handleChange}
                                                placeholder="e.g. 8594064310237"
                                                style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-focus)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                                            />
                                        </label>
                                        <label>
                                            <div style={{ marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Country Code</div>
                                            <input
                                                name="countryOfOrigin"
                                                value={formData.countryOfOrigin || ''}
                                                onChange={handleChange}
                                                placeholder="e.g. US, DE, CZ"
                                                maxLength={2}
                                                style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-focus)', background: 'rgba(0,0,0,0.3)', color: 'white', textTransform: 'uppercase' }}
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div>
                                    <div style={{ marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Material Tags</div>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                        <input
                                            type="text"
                                            id="tagInput"
                                            placeholder="e.g. UV Resistant, Food Safe"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const input = e.currentTarget as HTMLInputElement;
                                                    handleAddTag(input.value.trim());
                                                    input.value = '';
                                                }
                                            }}
                                            style={{
                                                flex: 1,
                                                padding: '8px',
                                                borderRadius: 'var(--radius-sm)',
                                                border: '1px solid var(--border-focus)',
                                                background: 'rgba(0,0,0,0.3)',
                                                color: 'white'
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const input = document.getElementById('tagInput') as HTMLInputElement;
                                                if (input) {
                                                    handleAddTag(input.value.trim());
                                                    input.value = '';
                                                }
                                            }}
                                            style={{
                                                padding: '8px 16px',
                                                background: 'var(--primary)',
                                                color: 'black',
                                                borderRadius: 'var(--radius-sm)',
                                                fontWeight: '600'
                                            }}
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {formData.tags && formData.tags.length > 0 && (
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            {formData.tags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    style={{
                                                        padding: '4px 8px',
                                                        background: 'var(--accent-purple)',
                                                        color: 'white',
                                                        borderRadius: 'var(--radius-sm)',
                                                        fontSize: '0.85rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px'
                                                    }}
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveTag(tag)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: 'white',
                                                            cursor: 'pointer',
                                                            padding: '0',
                                                            fontSize: '1rem',
                                                            lineHeight: '1'
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Additional Metadata */}
                                <div>
                                    <label>
                                        <div style={{ marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Manufacturer URL</div>
                                        <input
                                            type="url"
                                            name="manufacturerUrl"
                                            value={formData.manufacturerUrl || ''}
                                            onChange={handleChange}
                                            placeholder="https://example.com/product"
                                            style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-focus)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                                        />
                                    </label>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label>
                                        <div style={{ marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Notes</div>
                                        <textarea
                                            name="notes"
                                            value={formData.notes || ''}
                                            onChange={handleChange}
                                            rows={3}
                                            placeholder="Additional notes..."
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: 'var(--radius-sm)',
                                                border: '1px solid var(--border-focus)',
                                                background: 'rgba(0,0,0,0.3)',
                                                color: 'white',
                                                resize: 'vertical',
                                                fontFamily: 'inherit'
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sticky Footer Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: 'var(--space-md)',
                        padding: 'var(--space-lg)',
                        paddingTop: 'var(--space-md)',
                        borderTop: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-card)',
                        backdropFilter: 'blur(12px)'
                    }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-focus)', color: 'var(--text-muted)' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--primary)', color: 'black', fontWeight: '600' }}
                        >
                            {initialData ? 'Save Changes' : 'Add Roll'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
