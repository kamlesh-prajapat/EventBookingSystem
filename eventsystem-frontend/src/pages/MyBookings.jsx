import { useEffect, useState } from "react"
import api from "../api/axios"
import Navbar from "../components/Navbar"

function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [cancelingId, setCancelingId] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get("/bookings/my")
      setBookings(response.data)
    } catch (error) {
      setError(error.message || "Error fetching bookings")
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const cancelBooking = async (bookingId) => {
    setCancelingId(bookingId)
    try {
      await api.put("/bookings/cancel", null, {
        params: { bookingId }
      })
      alert("Booking cancelled successfully")
      fetchBookings()
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel booking")
    } finally {
      setCancelingId(null)
    }
  }

  return (
    <div>
      <Navbar />
      <h2>My Bookings</h2>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      
      {loading && <p>Loading bookings...</p>}

      {!loading && bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
            <p>Booking ID: {booking.id}</p>
            <p>Event: {booking.event.title}</p>
            <p>Date: {booking.event.eventDate}</p>
            <p>Location: {booking.event.location}</p>
            <p>Price: ₹{booking.event.price}</p>
            <p>Status: <strong>{booking.status}</strong></p>
            <button 
              onClick={() => cancelBooking(booking.id)}
              disabled={booking.status === "CANCELLED" || cancelingId === booking.id}
            >
              {cancelingId === booking.id ? "Cancelling..." : "Cancel Booking"}
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default MyBookings