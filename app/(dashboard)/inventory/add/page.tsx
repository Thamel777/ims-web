"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ref, push, set, update } from "firebase/database";
import { rtdb, auth } from "@/lib/firebase";
import { toast } from "sonner";
import {
    Upload,
    FileText,
    Plus,
    ArrowLeft,
    Check,
    AlertCircle,
    Download
} from "lucide-react";
import Link from "next/link";

interface NewItem {
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
}

const INITIAL_ITEM: NewItem = {
    name: "",
    sku: "",
    barcode: "",
    category: "",
    currentStock: 0,
    minStock: 5,
    maxStock: 50,
    unitPrice: 0,
    location: "",
    supplier: "",
    description: "",
};

export default function AddInventoryPage() {
    const router = useRouter();
    const [mode, setMode] = useState<'manual' | 'bulk'>('manual');
    const [loading, setLoading] = useState(false);

    // Manual Form State
    const [newItem, setNewItem] = useState<NewItem>(INITIAL_ITEM);

    // Bulk Upload State
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [parsedItems, setParsedItems] = useState<NewItem[]>([]);
    const [previewMode, setPreviewMode] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Manual Form Handlers
    const handleManualChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewItem(prev => ({
            ...prev,
            [name]: (name.includes("Stock") || name === "unitPrice") ? Number(value) : value
        }));
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const inventoryRef = ref(rtdb, "inventory");
            const newItemRef = push(inventoryRef);
            await set(newItemRef, {
                ...newItem,
                id: newItemRef.key,
                lastRestocked: new Date().toISOString()
            });
            toast.success("Item added successfully");
            router.push("/inventory");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add item");
        } finally {
            setLoading(false);
        }
    };

    // Bulk Upload Handlers
    const testFirebasePermission = async () => {
        try {
            const currentUser = auth.currentUser;
            console.log('Testing Firebase connection...');
            console.log('User:', currentUser?.email);
            console.log('Database URL:', rtdb.app.options.databaseURL);
            
            const testRef = ref(rtdb, "inventory");
            const newTestRef = push(testRef);
            console.log('Attempting to write to:', `inventory/${newTestRef.key}`);
            
            await set(newTestRef, {
                name: "Test Item",
                sku: "TEST-001",
                barcode: "123",
                category: "Test",
                currentStock: 10,
                minStock: 5,
                maxStock: 50,
                unitPrice: 9.99,
                location: "Test",
                supplier: "Test",
                description: "Test",
                id: newTestRef.key,
                lastRestocked: new Date().toISOString()
            });
            
            console.log('✅ TEST SUCCESSFUL - Firebase permissions are OK');
            toast.success('Firebase connection test passed!');
        } catch (error: any) {
            console.error('❌ TEST FAILED:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            toast.error(`Test failed: ${error.code || error.message}`);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCsvFile(e.target.files[0]);
            parseCSV(e.target.files[0]);
        }
    };

    const parseCSV = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            if (!text) return;

            const lines = text.split('\n');
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

            const items: NewItem[] = [];

            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;

                // Simple CSV split (doesn't handle commas inside quotes)
                const values = lines[i].split(',').map(v => v.trim());

                if (values.length < headers.length) continue;

                const item: any = { ...INITIAL_ITEM };

                headers.forEach((header, index) => {
                    const value = values[index];
                    if (header === 'name') item.name = value || '';
                    else if (header === 'sku') item.sku = value || '';
                    else if (header === 'barcode') item.barcode = value || '';
                    else if (header === 'category') item.category = value || '';
                    else if (header === 'currentstock' || header === 'stock') item.currentStock = Number(value) || 0;
                    else if (header === 'minstock') item.minStock = Number(value) || 5;
                    else if (header === 'maxstock') item.maxStock = Number(value) || 50;
                    else if (header === 'unitprice' || header === 'price') item.unitPrice = Number(value) || 0;
                    else if (header === 'location') item.location = value || '';
                    else if (header === 'supplier') item.supplier = value || '';
                    else if (header === 'description') item.description = value || '';
                });

                // Validate required fields
                if (item.name && item.name.trim()) {
                    items.push(item);
                }
            }

            setParsedItems(items);
            setPreviewMode(true);
        };
        reader.readAsText(file);
    };

    const handleBulkUpload = async () => {
        if (parsedItems.length === 0) {
            toast.error('No valid items to upload');
            return;
        }

        // Check authentication
        const currentUser = auth.currentUser;
        if (!currentUser) {
            toast.error('You must be logged in to upload items');
            return;
        }

        console.log('🔐 Authenticated user:', currentUser.email);
        console.log('📦 Uploading', parsedItems.length, 'items...');
        
        setLoading(true);

        try {
            const inventoryRef = ref(rtdb, "inventory");
            let successCount = 0;
            let firstError = null;
            
            // Write items sequentially to avoid rate limits and permission issues
            for (let i = 0; i < parsedItems.length; i++) {
                const item = parsedItems[i];
                try {
                    // Ensure all fields have valid values
                    const validatedItem = {
                        name: item.name || '',
                        sku: item.sku || '',
                        barcode: item.barcode || '',
                        category: item.category || '',
                        currentStock: Number(item.currentStock) || 0,
                        minStock: Number(item.minStock) || 5,
                        maxStock: Number(item.maxStock) || 50,
                        unitPrice: Number(item.unitPrice) || 0,
                        location: item.location || '',
                        supplier: item.supplier || '',
                        description: item.description || ''
                    };

                    const newItemRef = push(inventoryRef);
                    console.log(`Attempting to write to: inventory/${newItemRef.key}`);
                    
                    await set(newItemRef, {
                        ...validatedItem,
                        id: newItemRef.key,
                        lastRestocked: new Date().toISOString()
                    });
                    
                    successCount++;
                    console.log(`✓ Uploaded item ${i + 1}/${parsedItems.length}: ${item.name}`);
                } catch (itemError: any) {
                    if (!firstError) firstError = itemError;
                    console.error(`✗ Failed item ${i + 1} (${item.name}):`, itemError);
                    console.error('Error code:', itemError.code);
                    console.error('Error message:', itemError.message);
                    console.error('Full error object:', JSON.stringify(itemError, null, 2));
                    // Continue with other items even if one fails
                }
            }

            if (successCount === parsedItems.length) {
                toast.success(`Successfully added all ${parsedItems.length} items to inventory`);
                router.push("/inventory");
            } else if (successCount > 0) {
                toast.warning(`Added ${successCount} of ${parsedItems.length} items. Some failed - check console for details.`);
                router.push("/inventory");
            } else {
                const errorMsg = firstError ? `${firstError.code}: ${firstError.message}` : 'All items failed to upload';
                toast.error(errorMsg);
                console.error('❌ First error that occurred:', firstError);
            }
        } catch (error: any) {
            console.error("Full Upload Error:", error);
            console.error("Error Code:", error.code);
            console.error("Error Message:", error.message);
            console.error("Error Details:", error);
            toast.error(`Upload failed: ${error.message || 'Permission denied'}`);
        } finally {
            setLoading(false);
        }
    };

    const downloadTemplate = () => {
        const headers = "Name,SKU,Barcode,Category,CurrentStock,MinStock,MaxStock,UnitPrice,Location,Supplier,Description";
        const example = "Hammer,HMR-001,12345678,Tools,50,10,100,15.99,Shelf A1,Tool Co,Heavy duty hammer";
        const content = `${headers}\n${example}`;
        const blob = new Blob([content], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventory_template.csv';
        a.click();
    };

    return (
        <div className="add-inventory-page">
            <div className="page-header">
                <Link href="/inventory" className="back-link">
                    <ArrowLeft size={20} /> Back to Inventory
                </Link>
                <h1>Add Inventory</h1>
            </div>

            <div className="mode-toggle">
                <button
                    className={`toggle-btn ${mode === 'manual' ? 'active' : ''}`}
                    onClick={() => setMode('manual')}
                >
                    <Plus size={18} /> Manual Entry
                </button>
                <button
                    className={`toggle-btn ${mode === 'bulk' ? 'active' : ''}`}
                    onClick={() => setMode('bulk')}
                >
                    <Upload size={18} /> Bulk Upload (CSV)
                </button>
            </div>

            <div className="content-area">
                {mode === 'manual' ? (
                    <div className="card manual-form-card">
                        <form onSubmit={handleManualSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Item Name *</label>
                                    <input
                                        name="name"
                                        value={newItem.name}
                                        onChange={handleManualChange}
                                        required
                                        className="input"
                                        placeholder="e.g. Hydraulic Pump A-1500"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>SKU *</label>
                                    <input
                                        name="sku"
                                        value={newItem.sku}
                                        onChange={handleManualChange}
                                        required
                                        className="input"
                                        placeholder="e.g. HYD-PUMP-001"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Barcode</label>
                                    <input
                                        name="barcode"
                                        value={newItem.barcode}
                                        onChange={handleManualChange}
                                        className="input"
                                        placeholder="Scan barcode..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <input
                                        name="category"
                                        value={newItem.category}
                                        onChange={handleManualChange}
                                        className="input"
                                        placeholder="e.g. Hydraulics"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Current Stock</label>
                                    <input
                                        type="number"
                                        name="currentStock"
                                        value={newItem.currentStock}
                                        onChange={handleManualChange}
                                        className="input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Min Stock (Alert Level)</label>
                                    <input
                                        type="number"
                                        name="minStock"
                                        value={newItem.minStock}
                                        onChange={handleManualChange}
                                        className="input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Max Stock</label>
                                    <input
                                        type="number"
                                        name="maxStock"
                                        value={newItem.maxStock}
                                        onChange={handleManualChange}
                                        className="input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Unit Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="unitPrice"
                                        value={newItem.unitPrice}
                                        onChange={handleManualChange}
                                        className="input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input
                                        name="location"
                                        value={newItem.location}
                                        onChange={handleManualChange}
                                        className="input"
                                        placeholder="e.g. Warehouse A, Aisle 3"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Supplier</label>
                                    <input
                                        name="supplier"
                                        value={newItem.supplier}
                                        onChange={handleManualChange}
                                        className="input"
                                        placeholder="e.g. FastBolts Inc."
                                    />
                                </div>
                            </div>
                            <div className="form-group mt-4">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={newItem.description}
                                    onChange={handleManualChange}
                                    rows={4}
                                    className="input textarea"
                                    placeholder="Enter item description..."
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" onClick={() => router.back()} className="btn btn-outline">Cancel</button>
                                <button type="submit" disabled={loading} className="btn btn-primary">
                                    {loading ? "Adding..." : "Add Item"}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="card bulk-upload-card">
                        {!previewMode ? (
                            <div className="upload-zone">
                                <div className="upload-icon-container">
                                    <Upload size={48} className="upload-icon" />
                                </div>
                                <h3>Upload CSV File</h3>
                                <p>Drag and drop your CSV file here, or click to browse</p>
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                />
                                <button
                                    className="btn btn-primary mt-4"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Select File
                                </button>
                                <div className="template-link" onClick={downloadTemplate}>
                                    <Download size={14} /> Download CSV Template
                                </div>
                            </div>
                        ) : (
                            <div className="preview-zone">
                                <div className="preview-header">
                                    <h3>Preview ({parsedItems.length} items)</h3>
                                    <div className="preview-actions">
                                        <button onClick={testFirebasePermission} className="btn btn-outline btn-sm mr-2" style={{marginRight: '8px'}}>
                                            Test Connection
                                        </button>
                                        <button onClick={() => { setPreviewMode(false); setParsedItems([]); setCsvFile(null); }} className="btn btn-outline btn-sm">
                                            Cancel
                                        </button>
                                        <button onClick={handleBulkUpload} disabled={loading} className="btn btn-primary btn-sm">
                                            {loading ? "Uploading..." : "Confirm Upload"}
                                        </button>
                                    </div>
                                </div>
                                <div className="preview-table-container">
                                    <table className="preview-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>SKU</th>
                                                <th>Stock</th>
                                                <th>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {parsedItems.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>{item.name || <span className="text-muted">-</span>}</td>
                                                    <td>{item.sku || <span className="text-muted">-</span>}</td>
                                                    <td>{item.currentStock}</td>
                                                    <td>${item.unitPrice.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <div className="bulk-info">
                            <h4><AlertCircle size={16} /> Important Notes</h4>
                            <ul>
                                <li>Ensure your CSV follows the template format.</li>
                                <li>Required fields: Name, SKU.</li>
                                <li>Duplicate SKUs might cause confusion but are not strictly prevented here.</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .add-inventory-page {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .page-header {
                    margin-bottom: 2rem;
                }

                .back-link {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: rgb(var(--text-secondary));
                    text-decoration: none;
                    margin-bottom: 1rem;
                    font-size: 0.875rem;
                }

                .back-link:hover {
                    color: rgb(var(--primary));
                }

                .mode-toggle {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    border-bottom: 1px solid rgb(var(--border));
                    padding-bottom: 1rem;
                }

                .toggle-btn {
                    background: transparent;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: var(--radius);
                    cursor: pointer;
                    color: rgb(var(--text-secondary));
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: var(--transition);
                }

                .toggle-btn:hover {
                    background: rgb(var(--surface-hover));
                    color: rgb(var(--text-primary));
                }

                .toggle-btn.active {
                    background: rgb(var(--primary) / 0.1);
                    color: rgb(var(--primary));
                }

                .card {
                    background: rgb(var(--surface));
                    padding: 2rem;
                    border-radius: var(--radius-lg);
                    border: 1px solid rgb(var(--border));
                    box-shadow: var(--shadow-sm);
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
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

                .mt-4 { margin-top: 1.5rem; }

                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 2rem;
                    padding-top: 1rem;
                    border-top: 1px solid rgb(var(--border));
                }

                /* Upload Zone Styles */
                .upload-zone {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem;
                    border: 2px dashed rgb(var(--border));
                    border-radius: var(--radius-lg);
                    background: rgb(var(--background));
                    text-align: center;
                }

                .upload-icon-container {
                    width: 80px;
                    height: 80px;
                    background: rgb(var(--primary) / 0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                }

                .upload-icon {
                    color: rgb(var(--primary));
                }

                .template-link {
                    margin-top: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: rgb(var(--primary));
                    cursor: pointer;
                    font-size: 0.875rem;
                }
                
                .template-link:hover {
                    text-decoration: underline;
                }

                .bulk-info {
                    margin-top: 2rem;
                    padding: 1.5rem;
                    background: rgb(var(--background));
                    border-radius: var(--radius);
                    font-size: 0.875rem;
                    color: rgb(var(--text-secondary));
                }

                .bulk-info h4 {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                    color: rgb(var(--text-primary));
                }

                .bulk-info ul {
                    padding-left: 1.5rem;
                    margin-top: 0.5rem;
                }

                .preview-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .preview-actions {
                    display: flex;
                    gap: 0.5rem;
                }
                
                .preview-table-container {
                    max-height: 400px;
                    overflow-y: auto;
                    border: 1px solid rgb(var(--border));
                    border-radius: var(--radius);
                }

                .preview-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .preview-table th, .preview-table td {
                    padding: 0.75rem 1rem;
                    text-align: left;
                    border-bottom: 1px solid rgb(var(--border));
                }
                
                .preview-table th {
                    background: rgb(var(--surface-hover));
                    position: sticky;
                    top: 0;
                }

                .text-muted { color: rgb(var(--text-secondary)); font-style: italic; }
            `}</style>
        </div>
    );
}
