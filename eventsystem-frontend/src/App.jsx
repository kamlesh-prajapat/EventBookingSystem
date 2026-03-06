import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import ProtectedRoute from "./components/ProtectedRoute"
import MyBookings from "./pages/MyBookings"
import AdminDashboard from "./pages/AdminDashboard"
import CreateEvent from "./pages/CreateEvent"
import ManageEvents from "./pages/ManageEvents"
import EditEvent from "./pages/EditEvent"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
      
      <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/create-event" element={<ProtectedRoute requireAdmin={true}><CreateEvent /></ProtectedRoute>} />
      <Route path="/manage-events" element={<ProtectedRoute requireAdmin={true}><ManageEvents /></ProtectedRoute>} />
      <Route path="/edit-event/:id" element={<ProtectedRoute requireAdmin={true}><EditEvent /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
