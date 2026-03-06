import { useEffect, useState } from "react"
import api from "../api/axios"
import Navbar from "../components/Navbar"
import "./Pages.css"

function Home() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [bookingId, setBookingId] = useState(null)

  const handleBooking = async (eventId) => {
    setBookingId(eventId)
    try {
      await api.post("/bookings", null, {
        params: { eventId: eventId }
      })
      alert("Booking Successful 🎉")
      fetchEvents(page)
    } catch (error) {
      alert(error.response?.data?.message || "Booking Failed ❌")
    } finally {
      setBookingId(null)
    }
  }

  useEffect(() => {
    fetchEvents(0)
  }, [])

  const fetchEvents = async (pageNum) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get("/events", {
        params: {
          page: pageNum,
          size: 5,
          sortBy: "eventDate",
          direction: "asc"
        }
      })
      setEvents(response.data.content)
      setTotalPages(response.data.totalPages)
      setPage(pageNum)
    } catch (error) {
      setError(error.message || "Error fetching events")
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateSeatsLeft = (capacity, availableSeats) => {
    return capacity - availableSeats
  }

  const getAvailabilityStatus = (availableSeats) => {
    if (availableSeats === 0) return 'SOLD OUT'
    if (availableSeats < 5) return 'HURRY'
    return 'AVAILABLE'
  }

  const getAvailabilityColor = (availableSeats) => {
    if (availableSeats === 0) return '#f44336'
    if (availableSeats < 5) return '#ff9800'
    return '#4caf50'
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <main className="container">
        <div className="page-header">
          <h1>🎉 Available Events</h1>
          <p>Browse and book exciting events near you</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading amazing events...</p>
          </div>
        )}

        {!loading && events.length === 0 && !error ? (
          <div className="empty-state">
            <span className="empty-state-icon">📋</span>
            <h2>No Events Available</h2>
            <p>Check back soon for exciting events!</p>
          </div>
        ) : (
          <>
            <div className="events-grid">
              {events.map((event) => (
                <div key={event.id} className="event-card">
                  {/* Event Image */}
                  {event.imageUrl && (
                    <div className="event-image-container">
                      <img 
                        src={`/api/events/image/${event.imageUrl}`}
                        alt={event.title}
                        className="event-image"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x200?text=Event+Image"
                        }}
                      />
                    </div>
                  )}

                  <div className="event-header">
                    <div>
                      <h3 className="event-title">{event.title}</h3>
                      <p className="event-location">📍 {event.location}</p>
                    </div>
                    <span 
                      className="availability-badge"
                      style={{ backgroundColor: getAvailabilityColor(event.availableSeats) }}
                    >
                      {getAvailabilityStatus(event.availableSeats)}
                    </span>
                  </div>

                  <div className="event-body">
                    <p className="event-description">{event.description}</p>

                    <div className="event-details">
                      <div className="detail-item">
                        <span className="detail-label">📅 Date</span>
                        <span className="detail-value">{formatDate(event.eventDate)}</span>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">💺 Seats</span>
                        <span className="detail-value">
                          {event.availableSeats}/{event.capacity} Available
                        </span>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">💰 Price</span>
                        <span className="detail-value">₹{event.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="event-footer">
                    <button 
                      className="btn-primary"
                      onClick={() => handleBooking(event.id)}
                      disabled={bookingId === event.id || event.availableSeats === 0}
                      style={{ width: '100%' }}
                    >
                      {bookingId === event.id ? (
                        <><span className="spinner" style={{ width: '16px', height: '16px' }}></span> Booking...</>
                      ) : event.availableSeats === 0 ? (
                        '😞 SOLD OUT'
                      ) : (
                        '🎟️ Book Now'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="pagination-container">
              <button 
                className="btn-outline"
                onClick={() => fetchEvents(page - 1)} 
                disabled={page === 0}
              >
                ← Previous
              </button>

              <div className="pagination-info">
                Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong>
              </div>

              <button 
                className="btn-outline"
                onClick={() => fetchEvents(page + 1)} 
                disabled={page >= totalPages - 1}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Home