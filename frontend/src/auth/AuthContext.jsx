import { createContext, useContext, useState, useCallback } from "react";
import { adminApi } from "../api/api";

// ─────────────────────────────────────────────
//  Context
// ─────────────────────────────────────────────
const AuthContext = createContext(null);

// ─────────────────────────────────────────────
//  Provider — wrap the whole app in this
// ─────────────────────────────────────────────
export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("ve_token"));
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("ve_user");
        return stored ? JSON.parse(stored) : null;
    });

    // Called from AdminLogin after successful API response
    const login = useCallback((responseData) => {
        const userData = {
            username: responseData.username,
            fullName: responseData.fullName,
            role: responseData.role,
        };
        localStorage.setItem("ve_token", responseData.token);
        localStorage.setItem("ve_user", JSON.stringify(userData));
        setToken(responseData.token);
        setUser(userData);
    }, []);

    // Called from sidebar logout button
    const logout = useCallback(async () => {
        try {
            if (token) await adminApi.logout(token);
        } catch {
            // Swallow — even if the server call fails, clear local state
        } finally {
            localStorage.removeItem("ve_token");
            localStorage.removeItem("ve_user");
            setToken(null);
            setUser(null);
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// ─────────────────────────────────────────────
//  Hook — use this in every component that needs auth
//  e.g. const { token, user, logout } = useAuth();
// ─────────────────────────────────────────────
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}