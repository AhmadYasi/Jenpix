import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// ─────────────────────────────────────────────
//  ProtectedRoute
//  Wraps any admin route that requires a valid token.
//  If no token → redirect to /admin (login page).
//  If token exists → render the page normally.
// ─────────────────────────────────────────────
export default function ProtectedRoute({ children }) {
    const { token } = useAuth();

    if (!token) {
        return <Navigate to="/admin" replace />;
    }

    return children;
}