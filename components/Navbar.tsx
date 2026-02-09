"use client";

import { useState } from "react";
import { User } from "lucide-react";

export default function Navbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="navbar">
            <div className="navbar-container">
                <h1>Dashboard</h1>
                <div className="navbar-actions">
                    <div className="user-profile">
                        <span className="user-name">Admin</span>
                        <div className="user-avatar" onClick={() => setDropdownOpen(!dropdownOpen)}>
                            <User size={20} />
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .navbar {
          height: 64px;
          background: rgb(var(--surface));
          border-bottom: 1px solid rgb(var(--border) / 0.5);
          position: sticky;
          top: 0;
          z-index: 40;
          display: flex;
          align-items: center;
          padding: 0 2rem;
        }

        .navbar-container {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        h1 {
            font-size: 1.25rem;
            font-weight: 600;
            color: rgb(var(--text-primary));
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .user-name {
            font-weight: 500;
            color: rgb(var(--text-secondary));
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: rgb(var(--primary) / 0.1);
          color: rgb(var(--primary));
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 0 1rem;
          }
        }
      `}</style>
        </header>
    );
}
