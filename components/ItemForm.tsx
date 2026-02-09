"use client";

import { useState } from "react";
import { Item } from "@/lib/hooks/useInventory";
import { X } from "lucide-react";

interface ItemFormProps {
    initialData?: Item;
    onSubmit: (data: Omit<Item, "id" | "lastRestocked">) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function ItemForm({ initialData, onSubmit, onCancel, isLoading }: ItemFormProps) {
    const [formData, setFormData] = useState<Partial<Item>>(initialData || {
        name: "",
        sku: "",
        barcode: "",
        category: "",
        currentStock: 0,
        minStock: 5,
        maxStock: 100,
        unitPrice: 0,
        location: "",
        supplier: "",
        description: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes("Stock") || name === "unitPrice" ? Number(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validate?
        onSubmit(formData as Omit<Item, "id" | "lastRestocked">);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{initialData ? "Edit Item" : "Add New Item"}</h2>
                    <button onClick={onCancel} className="btn-icon">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="item-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Item Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} required className="input" />
                        </div>
                        <div className="form-group">
                            <label>SKU</label>
                            <input name="sku" value={formData.sku} onChange={handleChange} required className="input" />
                        </div>
                        <div className="form-group">
                            <label>Barcode</label>
                            <input name="barcode" value={formData.barcode} onChange={handleChange} required className="input" />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <input name="category" value={formData.category} onChange={handleChange} required className="input" />
                        </div>
                        <div className="form-group">
                            <label>Current Stock</label>
                            <input type="number" name="currentStock" value={formData.currentStock} onChange={handleChange} required className="input" />
                        </div>
                        <div className="form-group">
                            <label>Min Stock</label>
                            <input type="number" name="minStock" value={formData.minStock} onChange={handleChange} required className="input" />
                        </div>
                        <div className="form-group">
                            <label>Max Stock</label>
                            <input type="number" name="maxStock" value={formData.maxStock} onChange={handleChange} required className="input" />
                        </div>
                        <div className="form-group">
                            <label>Unit Price ($)</label>
                            <input type="number" step="0.01" name="unitPrice" value={formData.unitPrice} onChange={handleChange} required className="input" />
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input name="location" value={formData.location} onChange={handleChange} required className="input" />
                        </div>
                        <div className="form-group">
                            <label>Supplier</label>
                            <input name="supplier" value={formData.supplier} onChange={handleChange} required className="input" />
                        </div>
                    </div>
                    <div className="form-group full-width">
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="input textarea" />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="btn btn-outline">Cancel</button>
                        <button type="submit" disabled={isLoading} className="btn btn-primary">
                            {isLoading ? "Saving..." : "Save Item"}
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background: rgb(var(--surface));
          padding: 2rem;
          border-radius: var(--radius-lg);
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: var(--shadow-lg);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .btn-icon {
          background: transparent;
          border: none;
          cursor: pointer;
          color: rgb(var(--text-secondary));
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .full-width {
          grid-column: span 2;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        label {
            font-size: 0.875rem;
            font-weight: 500;
            color: rgb(var(--text-secondary));
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }

        .textarea {
            font-family: inherit;
        }
      `}</style>
        </div>
    );
}
