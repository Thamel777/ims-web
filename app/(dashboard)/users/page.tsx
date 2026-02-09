"use client";

import { Users } from "lucide-react";

export default function UsersPage() {
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
                <Users size={64} color="#2563eb" />
            </div>
            <h1 style={{ 
                fontSize: "2rem", 
                fontWeight: "700", 
                color: "#1e293b",
                marginBottom: "16px" 
            }}>User Management Coming Soon</h1>
            <p style={{ maxWidth: "450px", fontSize: "1.1rem", lineHeight: "1.6" }}>
                Team collaboration features, role-based access control, and user activity logs will be available here soon.
            </p>
        </div>
    );
}
