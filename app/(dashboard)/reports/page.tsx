"use client";

import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "80vh",
            textAlign: "center",
            color: "#64748b"
        }}>
            <div style={{
                background: "#eff6ff",
                padding: "24px",
                borderRadius: "50%",
                marginBottom: "24px"
            }}>
                <BarChart3 size={64} color="#2563eb" />
            </div>
            <h1 style={{ 
                fontSize: "2rem", 
                fontWeight: "700", 
                color: "#1e293b",
                marginBottom: "16px" 
            }}>Analytics & Reports Coming Soon</h1>
            <p style={{ maxWidth: "450px", fontSize: "1.1rem", lineHeight: "1.6" }}>
                Detailed insights, sales tracking, and inventory turnover reports are currently in development to help you make data-driven decisions.
            </p>
        </div>
    );
}
