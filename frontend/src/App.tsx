import { Navigate, Route, Routes } from "react-router-dom"
import LoginPage from "@/pages/Login/LoginPage"
import UserPage from "@/pages/User/UserPage"
import MenuPage from "@/pages/Menu/MenuPage"
import ChangePasswordPage from "@/pages/Auth/ChangePasswordPage"
import "./App.css"
import AppLayout from "./layout/AppLayout"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import { useAuth } from "./context/AuthContext"
import RestaurantTablePage from "./pages/RestaurnatTables/RestaurantTablePage"

function App() {
  const { user, loading } = useAuth()

  return (
    <Routes>
      {/* Root url: http://localhost:5173/ -> Navigates to /login when logged out */}
      <Route
        path="/"
        element={
          loading ? null : user ? (
            user.mustChangePassword ? (
              <Navigate to="/change-password" replace />
            ) : (
              <Navigate to="/overview" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Login page */}
      <Route
        path="/login"
        element={
          user ? (
            user.mustChangePassword ? (
              <Navigate to="/change-password" replace />
            ) : (
              <Navigate to="/overview" replace />
            )
          ) : (
            <LoginPage />
          )
        }
      />

      {/* First login force password change */}
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        }
      />

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/overview"
          element={
            <div className="dashboard-placeholder">
              <h3 className="text-lg font-semibold text-gray-700">Dashboard Overview</h3>
              <p className="text-sm text-gray-500 mt-1">Select an item from the sidebar to view details.</p>
            </div>
          }
        />
        <Route path="/users" element={<UserPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/table" element={<RestaurantTablePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
