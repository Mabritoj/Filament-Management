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
        <div className="modal-overlay">
            <div
                className="modal-container glass-panel"
                onClick={e => e.stopPropagation()}
            >
                {/* Header - Sticky */}
                <h2 className="modal-header">{initialData ? 'Edit Roll' : 'Add New Roll'}</h2>

                {/* Scrollable Form Content */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col"
                    style={{ height: '100%', overflow: 'hidden' }}
                >
                    <div className="modal-scroll-content">
                        {/* Brand & Type */}
                        <div className="grid-2-col">
                            <label>
                                <div className="form-label">Brand</div>
                                <input
                                    required
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g. Prusament"
                                />
                            </label>
                            <label>
                                <div className="form-label">Material</div>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    {MATERIAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </label>
                        </div>

                        {/* Filament Name */}
                        <label>
                            <div className="form-label">Filament Name</div>
                            <input
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="e.g. Galaxy Black"
                            />
                        </label>

                        {/* Color Section */}
                        <div>
                            <div className="form-label" style={{ marginBottom: '8px' }}>Color</div>
                            <div className="flex gap-sm" style={{ marginBottom: '8px' }}>
                                <input
                                    type="color"
                                    name="colorHex"
                                    value={formData.colorHex}
                                    onChange={handleChange}
                                    className="color-input"
                                />
                                <input
                                    required
                                    name="colorName"
                                    value={formData.colorName}
                                    onChange={handleChange}
                                    placeholder="Color Name"
                                    className="form-input"
                                    style={{ flex: 1 }}
                                />
                            </div>
                            <div className="flex gap-sm flex-wrap">
                                {PRESET_COLORS.map(c => (
                                    <button
                                        key={c.name}
                                        type="button"
                                        onClick={() => handleColorPreset(c)}
                                        className={`color-preset-btn ${formData.colorHex === c.hex ? 'selected' : ''}`}
                                        style={{ backgroundColor: c.hex }}
                                        title={c.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Weights */}
                        <div className="grid-2-col">
                            <label>
                                <div className="form-label">Remaining (g)</div>
                                <input
                                    required
                                    type="number"
                                    name="weightRemaining"
                                    value={formData.weightRemaining}
                                    onChange={handleChange}
                                    min="0"
                                    max={formData.weightTotal}
                                    className="form-input"
                                />
                            </label>
                            <label>
                                <div className="form-label">Total Weight (g)</div>
                                <input
                                    required
                                    type="number"
                                    name="weightTotal"
                                    value={formData.weightTotal}
                                    onChange={handleChange}
                                    min="1"
                                    className="form-input"
                                />
                            </label>
                        </div>

                        {/* Advanced Fields Toggle */}
                        <button
                            type="button"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="btn-toggle"
                        >
                            {showAdvanced ? '▼' : '▶'} Advanced Properties (Optional)
                        </button>

                        {/* Advanced Fields Section */}
                        {showAdvanced && (
                            <div className="modal-section">
                                {/* Temperature Settings */}
                                <div style={{ marginBottom: 'var(--space-sm)' }}>
                                    <h3 className="section-heading" style={{ marginBottom: 'var(--space-sm)' }}>
                                        Temperature Settings
                                    </h3>
                                    <div className="grid-2-col">
                                        <label>
                                            <div className="form-label">Nozzle Temp</div>
                                            <input
                                                name="nozzleTemp"
                                                value={formData.nozzleTemp || ''}
                                                onChange={handleChange}
                                                placeholder="e.g. 200-220"
                                                className="form-input"
                                            />
                                        </label>
                                        <label>
                                            <div className="form-label">Bed Temp (°C)</div>
                                            <input
                                                type="number"
                                                name="bedTemp"
                                                value={formData.bedTemp || ''}
                                                onChange={handleNumberChange}
                                                placeholder="e.g. 60"
                                                className="form-input"
                                            />
                                        </label>
                                        <label>
                                            <div className="form-label">Drying Temp (°C)</div>
                                            <input
                                                type="number"
                                                name="dryingTemp"
                                                value={formData.dryingTemp || ''}
                                                onChange={handleNumberChange}
                                                placeholder="e.g. 50"
                                                className="form-input"
                                            />
                                        </label>
                                        <label>
                                            <div className="form-label">Drying Time (hrs)</div>
                                            <input
                                                type="number"
                                                name="dryingTime"
                                                value={formData.dryingTime || ''}
                                                onChange={handleNumberChange}
                                                placeholder="e.g. 6"
                                                className="form-input"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Material Properties */}
                                <div style={{ marginBottom: 'var(--space-sm)' }}>
                                    <h3 className="section-heading" style={{ marginBottom: 'var(--space-sm)' }}>
                                        Material Properties
                                    </h3>
                                    <div className="grid-2-col">
                                        <label>
                                            <div className="form-label">Density (g/cm³)</div>
                                            <input
                                                type="number"
                                                step="0.01"
                                                name="density"
                                                value={formData.density || ''}
                                                onChange={handleNumberChange}
                                                placeholder="e.g. 1.24"
                                                className="form-input"
                                            />
                                        </label>
                                        <label>
                                            <div className="form-label">Spool Weight (g)</div>
                                            <input
                                                type="number"
                                                name="spoolWeight"
                                                value={formData.spoolWeight || ''}
                                                onChange={handleNumberChange}
                                                placeholder="e.g. 200"
                                                className="form-input"
                                            />
                                        </label>
                                        <label>
                                            <div className="form-label">Material ID (EAN/UPC)</div>
                                            <input
                                                name="materialId"
                                                value={formData.materialId || ''}
                                                onChange={handleChange}
                                                placeholder="e.g. 8594064310237"
                                                className="form-input"
                                            />
                                        </label>
                                        <label>
                                            <div className="form-label">Country Code</div>
                                            <input
                                                name="countryOfOrigin"
                                                value={formData.countryOfOrigin || ''}
                                                onChange={handleChange}
                                                placeholder="e.g. US, DE, CZ"
                                                maxLength={2}
                                                className="form-input"
                                                style={{ textTransform: 'uppercase' }}
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div>
                                    <div className="form-label">Material Tags</div>
                                    <div className="flex gap-sm" style={{ marginBottom: '8px' }}>
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
                                            className="form-input"
                                            style={{ flex: 1 }}
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
                                            className="tag-add-btn"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {formData.tags && formData.tags.length > 0 && (
                                        <div className="flex gap-sm flex-wrap">
                                            {formData.tags.map((tag, idx) => (
                                                <span key={idx} className="tag-item">
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveTag(tag)}
                                                        className="tag-remove-btn"
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
                                        <div className="form-label">Manufacturer URL</div>
                                        <input
                                            type="url"
                                            name="manufacturerUrl"
                                            value={formData.manufacturerUrl || ''}
                                            onChange={handleChange}
                                            placeholder="https://example.com/product"
                                            className="form-input"
                                        />
                                    </label>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label>
                                        <div className="form-label">Notes</div>
                                        <textarea
                                            name="notes"
                                            value={formData.notes || ''}
                                            onChange={handleChange}
                                            rows={3}
                                            placeholder="Additional notes..."
                                            className="form-textarea"
                                        />
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sticky Footer Buttons */}
                    <div className="modal-footer">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-cancel"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                        >
                            {initialData ? 'Save Changes' : 'Add Roll'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
