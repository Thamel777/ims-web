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
    Users,
    ChevronLeft,
    ChevronRight,
    LucideIcon
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect, CSSProperties } from "react";

// --- INLINE STYLES CONFIGURATION ---
const COLORS = {
    white: '#ffffff',
    bg: '#ffffff',
    border: '#e5e7eb',
    text: '#64748b',
    textDark: '#1e293b', 
    primary: '#2563eb',
    primaryBg: '#eff6ff',
    hoverBg: '#f8fafc',
    danger: '#ef4444',
    dangerBg: '#fef2f2'
};

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isHovered, setIsHovered] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully");
            router.push("/login");
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

    if (!mounted) return null;

    // --- DYNAMIC STYLES ---
    const sidebarStyle: CSSProperties = {
        width: isCollapsed ? '80px' : '260px',
        height: '100vh',
        backgroundColor: COLORS.bg,
        borderRight: `1px solid ${COLORS.border}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'width 0.3s ease',
        flexShrink: 0,
        boxSizing: 'border-box'
    };

    const logoContainerStyle: CSSProperties = {
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        padding: isCollapsed ? '0' : '0 24px',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        borderBottom: '1px solid transparent',
        marginBottom: '10px'
    };

    const logoIconStyle: CSSProperties = {
        width: '40px',
        height: '40px',
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        color: 'white',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
        flexShrink: 0
    };

    const brandTextStyle: CSSProperties = {
        marginLeft: '12px',
        display: isCollapsed ? 'none' : 'flex',
        flexDirection: 'column',
        opacity: isCollapsed ? 0 : 1,
        transition: 'opacity 0.2s',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
    };

    const toggleButtonStyle: CSSProperties = {
        position: 'absolute',
        top: '24px',
        right: '-12px',
        width: '24px',
        height: '24px',
        backgroundColor: 'white',
        border: `1px solid ${COLORS.border}`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: COLORS.text,
        zIndex: 60,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    };

    const navSectionStyle: CSSProperties = {
        flex: 1,
        padding: isCollapsed ? '16px 12px' : '16px 16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    };

    const labelStyle: CSSProperties = {
        fontSize: '11px',
        fontWeight: 700,
        color: '#94a3b8',
        marginBottom: '8px',
        paddingLeft: '12px',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        display: isCollapsed ? 'none' : 'block'
    };

    return (
        <aside style={sidebarStyle} id="sidebar-main">
            {/* Header */}
            <div style={logoContainerStyle}>
                <div style={logoIconStyle}>
                    <Package size={24} strokeWidth={2.5} />
                </div>
                <div style={brandTextStyle}>
                    <span style={{ fontWeight: 700, fontSize: '16px', color: COLORS.textDark, lineHeight: 1.2 }}>IMS Web</span>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.05em' }}>SYSTEM</span>
                </div>
            </div>

            {/* Helper Toggle */}
            <div 
                style={toggleButtonStyle} 
                onClick={() => setIsCollapsed(!isCollapsed)}
                role="button"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </div>

            {/* Navigation */}
            <div style={navSectionStyle}>
                <span style={labelStyle}>MAIN MENU</span>
                
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const isItemHovered = isHovered === item.href;
                    
                    const itemStyle: CSSProperties = {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        padding: isCollapsed ? '10px 0' : '10px 12px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        backgroundColor: isActive 
                            ? COLORS.primaryBg 
                            : (isItemHovered ? COLORS.hoverBg : 'transparent'),
                        color: isActive 
                            ? COLORS.primary 
                            : (isItemHovered ? COLORS.textDark : COLORS.text),
                        marginBottom: '4px',
                        width: '100%',
                        cursor: 'pointer',
                        position: 'relative',
                        minHeight: '44px'
                    };

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={itemStyle}
                            onMouseEnter={() => setIsHovered(item.href)}
                            onMouseLeave={() => setIsHovered(null)}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', flexShrink: 0 }}>
                                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            
                            {!isCollapsed && (
                                <span style={{ marginLeft: '12px', fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                    {item.label}
                                </span>
                            )}
                            
                            {isActive && !isCollapsed && (
                                <div style={{ 
                                    position: 'absolute', 
                                    right: '0', 
                                    width: '3px', 
                                    height: '20px', 
                                    backgroundColor: COLORS.primary, 
                                    borderTopLeftRadius: '3px', 
                                    borderBottomLeftRadius: '3px' 
                                }} />
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Footer */}
            <div style={{ padding: '16px', borderTop: `1px solid ${COLORS.border}`, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                    onClick={handleLogout}
                    onMouseEnter={() => setIsHovered('logout')}
                    onMouseLeave={() => setIsHovered(null)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        padding: isCollapsed ? '10px 0' : '10px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: isHovered === 'logout' ? COLORS.dangerBg : 'transparent',
                        color: isHovered === 'logout' ? COLORS.danger : COLORS.text,
                        cursor: 'pointer',
                        width: '100%',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s',
                        fontSize: '14px',
                        fontWeight: 500
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', flexShrink: 0 }}>
                        <LogOut size={20} />
                    </div>
                    {!isCollapsed && <span style={{ marginLeft: '12px' }}>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
