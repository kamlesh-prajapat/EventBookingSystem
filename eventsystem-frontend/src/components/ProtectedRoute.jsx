import { Navigate } from "react-router-dom"

function ProtectedRoute({ children, requireAdmin = false }) {
  const token = localStorage.getItem("token")
  const userRole = localStorage.getItem("role")

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && userRole !== "ADMIN") {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute