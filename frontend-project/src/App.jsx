import { useEffect, useState } from "react";
import { Navigate, NavLink, Outlet, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";
import CategoryForm from "./pages/Category";
import MedicineForm from "./pages/Medicine";
import InventoryStockForm from "./pages/InvetoryStock";
import SalesForm from "./pages/Sales";
import InventoryReport from "./pages/Report";
import api from "./api/api";

// ─── Protected Route Guard ───────────────────────────────────────────────────
function ProtectedRoute({ isAuth, children }) {
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// ─── Dashboard Layout ────────────────────────────────────────────────────────
function DashboardLayout({ setIsAuth }) {
  const links = [
    { path: "/dashboard/category",  label: "Category"        },
    { path: "/dashboard/medicine",  label: "Medicine"        },
    { path: "/dashboard/inventory", label: "Inventory Stock" },
    { path: "/dashboard/sales",     label: "Sales"           },
    { path: "/dashboard",           label: "Report"          },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-white border-b px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-700">Pharmacy Dashboard</h1>
          <Logout setIsAuth={setIsAuth} />
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap gap-2">
          {links.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-md border text-sm font-semibold transition ${
                  isActive
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Page Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>

    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // On app load, check if the user is already logged in
  useEffect(() => {
    async function verifySession() {
      const hasLocalAuth = localStorage.getItem("isAuth") === "true";

      // If localStorage has no auth entry, stop checking immediately
      if (!hasLocalAuth) {
        setCheckingSession(false);
        return;
      }

      // If localStorage has auth entry, confirm with the backend
      try {
        await api.get("/auth/verify");
        setIsAuth(true);
      } catch {
        localStorage.removeItem("isAuth");
        setIsAuth(false);
      } finally {
        setCheckingSession(false);
      }
    }

    verifySession();
  }, []);

  // Show loading screen while session check is running
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  // Once session check is done, render the routes
  return (
    <Routes>

      {/* Default - redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public routes - redirect to dashboard if already logged in */}
      <Route path="/login"    element={isAuth ? <Navigate to="/dashboard" replace /> : <Login setIsAuth={setIsAuth} />} />
      <Route path="/register" element={isAuth ? <Navigate to="/dashboard" replace /> : <Register />} />

      {/* Protected dashboard routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuth={isAuth}>
            <DashboardLayout setIsAuth={setIsAuth} />
          </ProtectedRoute>
        }
      >
        <Route index                  element={<InventoryReport />}    />
        <Route path="category"        element={<CategoryForm />}       />
        <Route path="medicine"        element={<MedicineForm />}       />
        <Route path="inventory"       element={<InventoryStockForm />} />
        <Route path="sales"           element={<SalesForm />}          />
        <Route path="report"          element={<InventoryReport />}    />
      </Route>

      {/* Catch-all - redirect based on auth status */}
      <Route path="*" element={<Navigate to={isAuth ? "/dashboard" : "/login"} replace />} />

    </Routes>
  );
}