import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Item {
    id: string;
    name: string;
    sku: string;
    barcode: string;
    category: string;
    currentStock: number;
    minStock: number;
    maxStock: number;
    unitPrice: number;
    location: string;
    supplier: string;
    description: string;
    lastRestocked: string; // ISO string
}

export function useInventory() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Ensure 'items' collection exists or is created when adding items
        const q = query(collection(db, 'items'), orderBy('currentStock')); // sort by stock for interesting default view?
        // Actually alphabetical is safer for general list
        // modifying to just collection(db, 'items') to avoid index requirements initially
        const unsubscribe = onSnapshot(collection(db, 'items'), (snapshot) => {
            const itemsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Item));
            setItems(itemsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching inventory:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { items, loading };
}
