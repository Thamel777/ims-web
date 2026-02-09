"use client";

import { Settings } from "lucide-react";

export default function SettingsPage() {
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
                <Settings size={64} color="#2563eb" />
            </div>
            <h1 style={{ 
                fontSize: "2rem", 
                fontWeight: "700", 
                color: "#1e293b",
                marginBottom: "16px" 
            }}>System Settings Coming Soon</h1>
            <p style={{ maxWidth: "450px", fontSize: "1.1rem", lineHeight: "1.6" }}>
                Configuration options for alerts, company details, integrations, and preferences are being built.
            </p>
        </div>
    );
}
