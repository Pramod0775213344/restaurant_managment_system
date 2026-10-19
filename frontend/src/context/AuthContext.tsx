import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "@/lib/api"

type User = {
    id: string | number;
    name: string;
    email: string;
    role: string;
    mustChangePassword?: boolean;
};
type AuthCtx = {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
    refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx>(null!);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await api("/api/auth/me");
            if (res.ok) {
                const data = await res.json();
                setUser(data?.user ?? null);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();

        // When navigating with browser back/forward buttons (BFCache), re-verify auth
        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                checkAuth();
            }
        };

        window.addEventListener("pageshow", handlePageShow);
        return () => window.removeEventListener("pageshow", handlePageShow);
    }, []);

    const logout = async () => {
        try {
            await api("/api/auth/logout", { method: "POST" });
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, setUser, refreshAuth: checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}