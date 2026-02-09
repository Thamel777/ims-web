"use client";

import { useInventory, Item } from "@/lib/hooks/useInventory";
import { useState } from "react";
import ItemForm from "@/components/ItemForm";
import { Plus, Edit, Trash2 } from "lucide-react";
import { collection, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

export default function InventoryPage() {
    const { items, loading } = useInventory();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [saving, setSaving] = useState(false);

    const handleAddStart = () => {
        setEditingItem(null);
        setModalOpen(true);
    };

    const handleEditStart = (item: Item) => {
        setEditingItem(item);
        setModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            try {
                await deleteDoc(doc(db, "items", id));
                toast.success("Item deleted");
            } catch (e) {
                toast.error("Failed to delete item");
            }
        }
    };

    // We need to carefully handle types here. Item contains id, but form data doesn't (necessarily).
    // The form component returns the data fields.
    const handleSave = async (data: any) => {
        setSaving(true);
        try {
            const payload = {
                ...data,
                lastRestocked: new Date().toISOString()
            };

            if (editingItem) {
                await updateDoc(doc(db, "items", editingItem.id), payload);
                toast.success("Item updated successfully");
            } else {
                await addDoc(collection(db, "items"), payload);
                toast.success("Item created successfully");
            }
            setModalOpen(false);
        } catch (e) {
            console.error(e);
            toast.error("Error saving item");
        } finally {
            setSaving(false);
        }
    };

    const [searchTerm, setSearchTerm] = useState("");

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading inventory...</p>
            <style jsx>{`
            .loading-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                color: rgb(var(--text-secondary));
            }
            .spinner {
                border: 4px solid rgb(var(--border));
                border-top: 4px solid rgb(var(--primary));
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin-bottom: 1rem;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
    );

    return (
        <div className="Inventory-page">
            <div className="page-header">
                <div className="header-left">
                    <h1>Inventory Management</h1>
                    <p className="subtitle">Manage stock, prices, and locations</p>
                </div>
                <button onClick={handleAddStart} className="btn btn-primary">
                    <Plus size={18} /> Add New Item
                </button>
            </div>

            <div className="controls-bar">
                <input
                    type="text"
                    placeholder="Search by name, SKU, or barcode..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input search-input"
                />
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>SKU</th>
                            <th>Category</th>
                            <th>Stock</th>
                            <th>Loc</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <div className="item-name">{item.name}</div>
                                    <div className="item-supplier">{item.supplier}</div>
                                </td>
                                <td>{item.sku}</td>
                                <td>
                                    <span className="badge badge-primary">{item.category}</span>
                                </td>
                                <td>
                                    <span className={`badge ${item.currentStock <= item.minStock ? 'badge-danger' : 'badge-success'}`}>
                                        {item.currentStock} / {item.maxStock}
                                    </span>
                                </td>
                                <td>{item.location}</td>
                                <td>${item.unitPrice.toFixed(2)}</td>
                                <td className="actions">
                                    <button onClick={() => handleEditStart(item)} className="btn-icon" title="Edit">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="btn-icon text-danger" title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredItems.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center">
                                    {items.length === 0 ? "No items found. Add one to get started." : "No matching items found."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <ItemForm
                    initialData={editingItem || undefined}
                    onSubmit={handleSave}
                    onCancel={() => setModalOpen(false)}
                    isLoading={saving}
                />
            )}

            <style jsx>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .header-left {
            display: flex;
            flex-direction: column;
        }

        .subtitle {
            color: rgb(var(--text-secondary));
            font-size: 0.875rem;
        }

        h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: rgb(var(--text-primary));
        }

        .controls-bar {
            margin-bottom: 1.5rem;
        }

        .search-input {
            max-width: 400px;
        }

        .actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-icon {
          background: transparent;
          border: none;
          padding: 0.5rem;
          color: rgb(var(--text-secondary));
          cursor: pointer;
          border-radius: var(--radius);
          transition: var(--transition);
        }

        .btn-icon:hover {
          background: rgb(var(--primary) / 0.1);
          color: rgb(var(--primary));
        }

        .text-danger {
            color: rgb(var(--danger));
        }

        .text-danger:hover {
          background: rgb(var(--danger) / 0.1);
          color: rgb(var(--danger));
        }

        .text-center {
            text-align: center;
            color: rgb(var(--text-secondary));
            padding: 3rem;
            font-style: italic;
        }
        
        .badge-primary {
             background-color: rgb(var(--primary) / 0.1);
             color: rgb(var(--primary));
        }

        .item-name {
            font-weight: 600;
            color: rgb(var(--text-primary));
        }
        
        .item-supplier {
            font-size: 0.75rem;
            color: rgb(var(--text-secondary));
        }
      `}</style>
        </div>
    );
}
