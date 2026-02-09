"use client";

import { useEffect, useRef, useState } from "react";
import Barcode from "react-barcode";
import { useReactToPrint } from "react-to-print";
import { X, Printer } from "lucide-react";
import { Item } from "@/lib/hooks/useInventory";

interface BarcodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: Item | null;
}

const BarcodeModal = ({ isOpen, onClose, item }: BarcodeModalProps) => {
    const componentRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: item ? `${item.name}-barcode` : 'barcode',
    });

    if (!isOpen || !item || !mounted) return null;

    // Use barcode field if available, otherwise SKU, otherwise ID
    const barcodeValue = item.barcode || item.sku || item.id;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Print Barcode</h3>
                    <button onClick={onClose} className="close-btn">
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="print-preview" ref={componentRef}>
                        <div className="barcode-sticker">
                            <div className="sticker-header">
                                <span className="company-name">IMS Web</span>
                                <span className="item-price">LKR {item.unitPrice?.toFixed(2)}</span>
                            </div>
                            <div className="item-name">{item.name}</div>
                            <div className="barcode-wrapper">
                                <Barcode 
                                    value={barcodeValue} 
                                    width={1.5}
                                    height={50}
                                    fontSize={12}
                                />
                            </div>
                            <div className="item-sku">SKU: {item.sku}</div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={() => handlePrint()}>
                        <Printer size={16} style={{ marginRight: '8px' }} />
                        Print Label
                    </button>
                </div>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.2s ease-out;
                }

                .modal-content {
                    background: white;
                    border-radius: 0.75rem;
                    width: 100%;
                    max-width: 400px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    overflow: hidden;
                    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .modal-header {
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .modal-header h3 {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #111827;
                    margin: 0;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: #6b7280;
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 0.375rem;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .close-btn:hover {
                    background-color: #f3f4f6;
                    color: #111827;
                }

                .modal-body {
                    padding: 2rem;
                    background-color: #f9fafb;
                    display: flex;
                    justify-content: center;
                }

                .print-preview {
                    background: white;
                    padding: 1rem;
                    border: 1px dashed #d1d5db;
                    border-radius: 0.5rem;
                }

                .barcode-sticker {
                    width: 250px;
                    padding: 10px;
                    border: 1px solid #e5e7eb;
                    background: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }

                .sticker-header {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    margin-bottom: 5px;
                    font-size: 10px;
                    color: #6b7280;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .item-price {
                    color: #111827;
                    font-weight: 700;
                }

                .item-name {
                    font-weight: 700;
                    font-size: 14px;
                    color: #111827;
                    margin-bottom: 5px;
                    line-height: 1.2;
                    max-width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .item-sku {
                    font-size: 10px;
                    color: #6b7280;
                    margin-top: 2px;
                    font-family: monospace;
                }

                .modal-footer {
                    padding: 1rem 1.5rem;
                    border-top: 1px solid #e5e7eb;
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.75rem;
                }

                .btn {
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                }

                .btn-secondary {
                    background-color: white;
                    border-color: #d1d5db;
                    color: #374151;
                }

                .btn-secondary:hover {
                    background-color: #f9fafb;
                    border-color: #9ca3af;
                }

                .btn-primary {
                    background-color: #2563eb;
                    color: white;
                }

                .btn-primary:hover {
                    background-color: #1d4ed8;
                }

                @media print {
                    .barcode-sticker {
                        border: none;
                        padding: 0;
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default BarcodeModal;
