"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    BarChart3,
    Settings,
    LogOut,
    ScanBarcode,
    Users
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully");
            router.push("/login"); // Force redirect just in case
        } catch (error) {
            console.error("Logout error", error);
            toast.error("Failed to log out");
        }
    };

    const navItems = [
        { label: "Dashboard", href: "/", icon: LayoutDashboard },
        { label: "Inventory", href: "/inventory", icon: Package },
        { label: "Scanner", href: "/scanner", icon: ScanBarcode },
        { label: "Reports", href: "/reports", icon: BarChart3 },
        { label: "Users", href: "/users", icon: Users },
        { label: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <aside className="sidebar">
            <div className="branding">
                <div className="logo-icon">I</div>
                <span className="brand-name">IMS Web</span>
            </div>

            <nav className="nav-menu">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${isActive ? "active" : ""}`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="nav-item logout-btn">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>

            <style jsx>{`
        .sidebar {
          width: 280px;
          height: 100vh;
          background: rgb(var(--surface));
          border-right: 1px solid rgb(var(--border));
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .branding {
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid rgb(var(--border) / 0.5);
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: rgb(var(--primary));
          color: white;
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }

        .brand-name {
          font-weight: 700;
          font-size: 1.25rem;
          color: rgb(var(--text-primary));
        }

        .nav-menu {
          flex: 1;
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius);
          color: rgb(var(--text-secondary));
          transition: var(--transition);
          text-decoration: none;
          font-weight: 500;
          background: transparent;
          border: none;
          width: 100%;
          cursor: pointer;
          font-size: 0.95rem;
        }

        .nav-item:hover {
          background: rgb(var(--primary) / 0.05);
          color: rgb(var(--primary));
        }

        .nav-item.active {
          background: rgb(var(--primary) / 0.1);
          color: rgb(var(--primary));
          font-weight: 600;
        }

        .sidebar-footer {
          padding: 1.5rem 1rem;
          border-top: 1px solid rgb(var(--border) / 0.5);
        }

        .logout-btn {
          color: rgb(var(--danger));
        }

        .logout-btn:hover {
          background: rgb(var(--danger) / 0.05);
          color: rgb(var(--danger));
        }
      `}</style>
        </aside>
    );
};

export default Sidebar;
