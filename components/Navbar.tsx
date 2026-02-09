"use client";

import { useState } from "react";
import { User, Moon, Sun } from "lucide-react";
import { useTheme } from "./providers/ThemeProvider";

export default function Navbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="navbar">
            <div className="navbar-container">
                <h1 className="page-title">Dashboard</h1>
                <div className="navbar-actions">
                    <button 
                        onClick={toggleTheme} 
                        className="icon-button"
                        aria-label="Toggle theme"
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    <div className="divider"></div>
                    <div className="user-menu">
                        <span className="user-name">Admin User</span>
                        <button 
                            type="button"
                            className="user-avatar" 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            aria-label="Toggle user menu"
                        >
                            <User size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .navbar {
          height: 64px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 40;
          display: flex;
          align-items: center;
          padding: 0 1.5rem;
        }

        [data-theme="dark"] .navbar {
          background: #1f2937;
          border-bottom-color: #374151;
        }

        .navbar-container {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 100%;
        }

        .page-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.025em;
          margin: 0;
        }

        [data-theme="dark"] .page-title {
          color: #f9fafb;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .icon-button {
          width: 40px;
          height: 40px;
          border-radius: 0.5rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .icon-button:hover {
          background: #f3f4f6;
          color: #111827;
          border-color: #d1d5db;
        }

        [data-theme="dark"] .icon-button {
          background: #374151;
          border-color: #4b5563;
          color: #9ca3af;
        }

        [data-theme="dark"] .icon-button:hover {
          background: #4b5563;
          color: #f9fafb;
          border-color: #6b7280;
        }

        .divider {
          width: 1px;
          height: 24px;
          background: #e5e7eb;
        }

        [data-theme="dark"] .divider {
          background: #4b5563;
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .user-name {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }

        [data-theme="dark"] .user-name {
          color: #d1d5db;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
        }

        .user-avatar:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgb(59 130 246 / 0.3);
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 0 1rem;
          }

          .page-title {
            font-size: 1.25rem;
          }
          
          .user-name {
            display: none;
          }

          .divider {
            display: none;
          }
        }
      `}</style>
        </header>
    );
}
