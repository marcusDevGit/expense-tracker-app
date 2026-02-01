import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { Dashboard } from "@/pages/dashboard/Dashboard";
import { useAuthStore } from "@/stores/auth.store";
import { Toaster } from "@/components/ui/toaster";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </>
  );
}
