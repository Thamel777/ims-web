"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, getIdTokenResult, IdTokenResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    isCashier: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAdmin: false,
    isCashier: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isCashier, setIsCashier] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);

                // Optionally fetch claims to determine roles if using custom claims or specific doc
                // For now, we'll assume basic auth is enough or check email domain/database role mapping
                // implementation for role check
                // const tokenResult = await getIdTokenResult(user);
                // setIsAdmin(!!tokenResult.claims.admin);

            } else {
                setUser(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Protect routes here or in middleware
    useEffect(() => {
        if (!loading && !user && pathname !== "/login") {
            router.push("/login");
        }
    }, [user, loading, pathname, router]);

    if (loading) return <div className="loading-screen">Loading...</div>;

    // Prevent flash of content
    if (!user && pathname !== "/login") return null;

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin, isCashier }}>
            {children}
        </AuthContext.Provider>
    );
};
