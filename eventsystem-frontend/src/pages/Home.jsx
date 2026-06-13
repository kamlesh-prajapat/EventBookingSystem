import { useEffect, useState, useRef } from "react"
import api from "../api/axios"
import Navbar from "../components/Navbar"
import "./Pages.css"

function Home() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const failedImages = useRef(new Set())
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
      console.log("📊 Events API Response:", response.data.content)
      response.data.content.forEach(event => {
        console.log(`Event ${event.id}: imageUrl = "${event.imageUrl}"`)
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

    console.log("eveents", events)

  // Simple SVG placeholder (no external calls needed)
  const defaultImagePlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23e0e0e0' width='300' height='200'/%3E%3Ctext x='50%' y='50%' font-size='20' fill='%23999' text-anchor='middle' dy='.3em'%3EEvent Image%3C/text%3E%3C/svg%3E"

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
                        src={`${api.defaults.baseURL}/events/image/${event.imageUrl}`}
                        alt={event.title}
                        className="event-image"
                        onLoad={() => {
                          if (!failedImages.current.has(event.id)) {
                            console.log(`✅ Image loaded successfully for event ${event.id}: ${event.imageUrl}`)
                          }
                        }}
                        onError={(e) => {
                          console.error(`❌ Failed to load image for event ${event.id}: ${event.imageUrl}`)
                          failedImages.current.add(event.id)
                          e.target.src = defaultImagePlaceholder
                        }}
                      />
                    </div>
                  )}
                  {!event.imageUrl && (
                    <div className="event-image-container">
                      <img
                        src={defaultImagePlaceholder}
                        alt={event.title}
                        className="event-image"
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