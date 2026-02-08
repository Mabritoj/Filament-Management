import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import type { Filament, FilamentContextType } from '../types';

const FilamentContext = createContext<FilamentContextType | undefined>(undefined);

const STORAGE_KEY = 'filament-inventory-v1';

interface FilamentProviderProps {
    children: ReactNode;
}

export function FilamentProvider({ children }: FilamentProviderProps) {
    const [filaments, setFilaments] = useState<Filament[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filaments));
    }, [filaments]);

    const addFilament = (filament: Omit<Filament, 'id' | 'createdAt'>) => {
        const newFilament: Filament = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            ...filament,
        };
        setFilaments((prev) => [newFilament, ...prev]);
    };

    const updateFilament = (id: string, updates: Partial<Filament>) => {
        setFilaments((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
        );
    };

    const deleteFilament = (id: string) => {
        setFilaments((prev) => prev.filter((item) => item.id !== id));
    };

    // derived stats
    const totalWeight = filaments.reduce((acc, curr) => acc + (Number(curr.weightRemaining) || 0), 0);
    const totalRolls = filaments.length;

    const value: FilamentContextType = {
        filaments,
        addFilament,
        updateFilament,
        deleteFilament,
        stats: {
            totalWeight,
            totalRolls,
        },
    };

    return (
        <FilamentContext.Provider value={value}>
            {children}
        </FilamentContext.Provider>
    );
}

export function useFilaments(): FilamentContextType {
    const context = useContext(FilamentContext);
    if (!context) {
        throw new Error('useFilaments must be used within a FilamentProvider');
    }
    return context;
}
