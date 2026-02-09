"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ref, onValue, limitToFirst, query } from "firebase/database";
import { rtdb } from "@/lib/firebase";

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

interface InventoryContextType {
    items: Item[];
    loading: boolean;
    refresh: () => void;
}

const InventoryContext = createContext<InventoryContextType>({
    items: [],
    loading: true,
    refresh: () => { }
});

export const InventoryProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Use Realtime Database listener
        const inventoryQuery = query(ref(rtdb, 'inventory'), limitToFirst(500));

        const unsubscribe = onValue(inventoryQuery, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const itemsData = Object.keys(data).map(key => ({
                    ...data[key],
                    id: key
                } as Item));

                // Client-side sort
                itemsData.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

                setItems(itemsData);
            } else {
                setItems([]);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching inventory from RTDB:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const refresh = () => {
        // Real-time updates mean manual refresh is usually unnecessary in RTDB
    };

    return (
        <InventoryContext.Provider value={{ items, loading, refresh }}>
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventory = () => useContext(InventoryContext);
