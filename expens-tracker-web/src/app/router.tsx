import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { Dashboard } from "@/pages/dashboard/Dashboard";
import { Wallets } from "@/pages/wallets/Wallets";
import { Expenses } from "@/pages/expenses/Expenses";
import { Categories } from "@/pages/categories/Categories";
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
        <Route
          path="/wallets"
          element={
            <PrivateRoute>
              <Wallets />
            </PrivateRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <PrivateRoute>
              <Expenses />
            </PrivateRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <Categories />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </>
  );
}
