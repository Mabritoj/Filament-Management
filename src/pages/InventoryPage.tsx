import { useState, useMemo } from 'react';
import { AddFilamentCard } from '../components/AddFilamentCard';
import { InventoryGrid } from '../components/InventoryGrid';
import { FilterPanel } from '../components/FilterPanel';
import { FilamentForm } from '../components/FilamentForm';
import { Breadcrumb } from '../components/Breadcrumb';
import { useFilaments } from '../context/FilamentContext';
import { ConfirmationModal } from '../components/ConfirmationModal';
import type { Filament, Filters } from '../types';

export function InventoryPage() {
    const { filaments, addFilament, updateFilament, deleteFilament, stats } = useFilaments();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<Filament | null>(null);
    const [filters, setFilters] = useState<Filters>({ brands: [], types: [], colors: [] });
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    // Apply filters
    const filteredFilaments = useMemo(() => {
        return filaments.filter(filament => {
            const brandMatch = filters.brands.length === 0 || filters.brands.includes(filament.brand);
            const typeMatch = filters.types.length === 0 || filters.types.includes(filament.type);
            const colorMatch = filters.colors.length === 0 || filters.colors.includes(filament.colorName);
            return brandMatch && typeMatch && colorMatch;
        });
    }, [filaments, filters]);

    const handleAddClick = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (filament: Filament) => {
        setEditingItem(filament);
        setIsModalOpen(true);
    };

    const handleFormSubmit = (data: Omit<Filament, 'id' | 'createdAt'>) => {
        if (editingItem) {
            updateFilament(editingItem.id, data);
        } else {
            addFilament(data);
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteConfirmId(id);
    };

    const handleConfirmDelete = () => {
        if (deleteConfirmId) {
            deleteFilament(deleteConfirmId);
            setDeleteConfirmId(null);
        }
    };

    return (
        <>
            <Breadcrumb />

            <h1 className="heading-xl mb-md">Inventory</h1>

            {/* Stats Summary (Mini Dashboard) */}
            <div className="stats-row">
                <div>
                    <span className="stat-label">Total Rolls</span>
                    <span className="stat-value">{stats.totalRolls}</span>
                </div>
                <div>
                    <span className="stat-label">Total Weight</span>
                    <span className="stat-value">{(stats.totalWeight / 1000).toFixed(1)} kg</span>
                </div>
            </div>

            <div className="content-with-filter">
                <div className="inventory-section">
                    <InventoryGrid
                        filaments={filteredFilaments}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        addCard={<AddFilamentCard onClick={handleAddClick} />}
                    />
                </div>

                <FilterPanel
                    filters={filters}
                    onFilterChange={setFilters}
                    filaments={filaments}
                />
            </div>

            <FilamentForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingItem || undefined}
            />

            <ConfirmationModal
                isOpen={deleteConfirmId !== null}
                onClose={() => setDeleteConfirmId(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Filament Roll?"
                message={`Are you sure you want to delete this filament roll? This action cannot be undone.`}
            />
        </>
    );
}
