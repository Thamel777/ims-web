"use client";

import { useInventory } from "@/lib/hooks/useInventory";
import { Package, AlertTriangle, DollarSign, TrendingUp } from "lucide-react";

export default function Dashboard() {
    const { items, loading } = useInventory();

    if (loading) {
        return <div className="loading-state">Loading dashboard data...</div>;
    }

    const totalItems = items.length;
    const lowStockItems = items.filter((item) => item.currentStock <= item.minStock);
    const totalValue = items.reduce((acc, item) => acc + (item.currentStock * item.unitPrice), 0);
    // Simulating activity or just show top movers
    const topMovers = items.slice(0, 5); // Just first 5 items for now as mock top movers

    return (
        <div className="dashboard-container">
            <h1 className="page-title">Overview</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon bg-primary-light">
                        <Package size={24} className="text-primary" />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Total Items</span>
                        <span className="stat-value">{totalItems}</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon bg-warning-light">
                        <AlertTriangle size={24} className="text-warning" />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Low Stock Alerts</span>
                        <span className="stat-value">{lowStockItems.length}</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon bg-success-light">
                        <DollarSign size={24} className="text-success" />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Total Inventory Value</span>
                        <span className="stat-value">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-sections">
                <div className="section-card">
                    <h2>Low Stock Alerts</h2>
                    {lowStockItems.length === 0 ? (
                        <p className="empty-state">No items are currently low in stock.</p>
                    ) : (
                        <div className="alert-list">
                            {lowStockItems.map((item) => (
                                <div key={item.id} className="alert-item">
                                    <div className="alert-icon">
                                        <AlertTriangle size={16} />
                                    </div>
                                    <div className="alert-details">
                                        <span className="item-name">{item.name}</span>
                                        <span className="stock-info">
                                            Stock: <span className="text-danger">{item.currentStock}</span> / Min: {item.minStock}
                                        </span>
                                    </div>
                                    <button className="btn-sm btn-outline">Restock</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="section-card">
                    <h2>Recent Activity</h2>
                    <p className="empty-state">Activity logging coming soon.</p>
                </div>
            </div>

            <style jsx>{`
        .page-title {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 2rem;
          color: rgb(var(--text-primary));
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: rgb(var(--surface));
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: var(--shadow);
          border: 1px solid rgb(var(--border) / 0.5);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bg-primary-light { background: rgb(var(--primary) / 0.1); }
        .text-primary { color: rgb(var(--primary)); }
        
        .bg-warning-light { background: rgb(var(--warning) / 0.1); }
        .text-warning { color: rgb(var(--warning)); }

        .bg-success-light { background: rgb(var(--success) / 0.1); }
        .text-success { color: rgb(var(--success)); }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.875rem;
          color: rgb(var(--text-secondary));
          font-weight: 500;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: rgb(var(--text-primary));
        }

        .dashboard-sections {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .section-card {
          background: rgb(var(--surface));
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow);
          border: 1px solid rgb(var(--border) / 0.5);
        }

        h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: rgb(var(--text-primary));
        }

        .empty-state {
          color: rgb(var(--text-secondary));
          font-style: italic;
          padding: 1rem 0;
        }

        .alert-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .alert-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background: rgb(var(--danger) / 0.05);
          border-radius: var(--radius);
          border: 1px solid rgb(var(--danger) / 0.1);
        }
        
        .alert-icon {
          color: rgb(var(--danger));
        }

        .alert-details {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .item-name {
          font-weight: 600;
          color: rgb(var(--text-primary));
        }

        .stock-info {
          font-size: 0.875rem;
          color: rgb(var(--text-secondary));
        }

        .text-danger {
          color: rgb(var(--danger));
          font-weight: 700;
        }
        
        .btn-sm {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
        }

        .loading-state {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            color: rgb(var(--text-secondary));
        }
      `}</style>
        </div>
    );
}
