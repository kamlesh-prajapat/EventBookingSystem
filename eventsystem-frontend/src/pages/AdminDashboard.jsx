import { useEffect, useState } from "react"
import api from "../api/axios"
import Navbar from "../components/Navbar"

function AdminDashboard() {
  const [stats, setStats] = useState({})
  const [bookings, setBookings] = useState([])
  const [loadingStats, setLoadingStats] = useState(false)
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
    fetchAllBookings()
  }, [])

  const fetchStats = async () => {
    setLoadingStats(true)
    setError(null)
    try {
      const response = await api.get("/admin/dashboard")
      setStats(response.data)
    } catch (error) {
      setError(error.message || "Error fetching stats")
      console.error("Error fetching stats:", error)
    } finally {
      setLoadingStats(false)
    }
  }

  const fetchAllBookings = async () => {
    setLoadingBookings(true)
    try {
      const response = await api.get("/bookings")
      setBookings(response.data)
    } catch (error) {
      setError(error.message || "Error fetching bookings")
      console.error("Error fetching bookings:", error)
    } finally {
      setLoadingBookings(false)
    }
  }

  return (
    <div>
      <Navbar />
      <h2>Admin Dashboard</h2>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <h3>Statistics</h3>
      {loadingStats ? (
        <p>Loading stats...</p>
      ) : (
        <>
          <p>Total Events: {stats.totalEvents || 0}</p>
          <p>Total Bookings: {stats.totalBookings || 0}</p>
          <p>Total Users: {stats.totalUsers || 0}</p>
          <p>Total Revenue: ₹{stats.totalRevenue || 0}</p>
        </>
      )}

      <h3>All Bookings</h3>
      {loadingBookings ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
            <p>Booking ID: {booking.id}</p>
            <p>User: {booking.user?.email || "N/A"}</p>
            <p>User Name: {booking.user?.name || "N/A"}</p>
            <p>Event: {booking.event?.title || "N/A"}</p>
            <p>Date: {booking.event?.eventDate || "N/A"}</p>
            <p>Status: <strong>{booking.status}</strong></p>
          </div>
        ))
      )}
    </div>
  )
}

export default AdminDashboard