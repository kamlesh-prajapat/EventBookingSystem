import { useEffect, useState } from "react"
import api from "../api/axios"
import { useNavigate } from "react-router-dom"
import { formatCurrency, formatDate, ADMIN_CONFIG } from "../utils/adminConfig"

function ManageEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    fetchEvents(0)
  }, [])

  const fetchEvents = async (pageNum) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get(ADMIN_CONFIG.API_ENDPOINTS.GET_EVENTS, {
        params: {
          page: pageNum,
          size: 10,
          sortBy: "eventDate",
          direction: "asc"
        }
      })
      setEvents(response.data.content)
      setTotalPages(response.data.totalPages)
      setPage(pageNum)
    } catch (error) {
      const errorMsg = error.message || ADMIN_CONFIG.ERROR_MESSAGES.FETCH_EVENTS_FAILED
      setError(errorMsg)
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return
    }

    setDeletingId(eventId)
    try {
      await api.delete(ADMIN_CONFIG.API_ENDPOINTS.DELETE_EVENT(eventId))
      setError(null)
      fetchEvents(page)
      alert(ADMIN_CONFIG.SUCCESS_MESSAGES.EVENT_DELETED + " ✅")
    } catch (error) {
      const errorMsg = error.response?.data?.message || ADMIN_CONFIG.ERROR_MESSAGES.DELETE_EVENT_FAILED
      setError(errorMsg)
      alert(errorMsg)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Manage Events</h2>
        <button
          onClick={() => navigate("/create-event")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          ➕ Create New Event
        </button>
      </div>

      {error && (
        <div style={{ color: "red", padding: "10px", backgroundColor: "#ffe0e0", borderRadius: "4px", marginBottom: "15px" }}>
          ❌ {error}
        </div>
      )}

      {loading && <p>Loading events...</p>}

      {!loading && events.length === 0 && (
        <p style={{ textAlign: "center", color: "#999" }}>No events found</p>
      )}

      {!loading && events.length > 0 && (
        <>
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #ddd"
            }}>
              <thead>
                <tr style={{ backgroundColor: "#f0f0f0", borderBottom: "2px solid #ddd" }}>
                  <th style={{ padding: "12px", textAlign: "left", minWidth: "150px" }}>Title</th>
                  <th style={{ padding: "12px", textAlign: "left", minWidth: "150px" }}>Location</th>
                  <th style={{ padding: "12px", textAlign: "center", minWidth: "100px" }}>Date</th>
                  <th style={{ padding: "12px", textAlign: "center", minWidth: "80px" }}>Capacity</th>
                  <th style={{ padding: "12px", textAlign: "center", minWidth: "80px" }}>Available</th>
                  <th style={{ padding: "12px", textAlign: "center", minWidth: "80px" }}>Price</th>
                  <th style={{ padding: "12px", textAlign: "center", minWidth: "120px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "12px" }}>
                      <div>
                        <strong>{event.title}</strong>
                        {event.imageUrl && <span style={{ marginLeft: "8px", color: "#666", fontSize: "12px" }}>🖼️ Has Image</span>}
                      </div>
                    </td>
                    <td style={{ padding: "12px" }}>{event.location}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>{formatDate(event.eventDate)}</td>
                    <td style={{ padding: "12px", textAlign: "center", fontSize: "14px", fontWeight: "bold" }}>{event.capacity}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <span style={{
                        padding: "4px 8px",
                        backgroundColor: event.availableSeats > 0 ? "#e8f5e9" : "#ffebee",
                        borderRadius: "4px",
                        color: event.availableSeats > 0 ? "#2e7d32" : "#c62828",
                        fontWeight: "bold"
                      }}>
                        {event.availableSeats}
                      </span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center", fontWeight: "bold" }}>{formatCurrency(event.price)}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <button
                        onClick={() => navigate(`/edit-event/${event.id}`)}
                        style={{
                          padding: "5px 10px",
                          marginRight: "8px",
                          backgroundColor: "#2196F3",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: "bold"
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        disabled={deletingId === event.id}
                        style={{
                          padding: "5px 10px",
                          backgroundColor: deletingId === event.id ? "#ccc" : "#f44336",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: deletingId === event.id ? "default" : "pointer",
                          fontSize: "12px",
                          fontWeight: "bold"
                        }}
                      >
                        {deletingId === event.id ? "Deleting..." : "🗑️ Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              onClick={() => fetchEvents(page - 1)}
              disabled={page === 0}
              style={{
                padding: "8px 16px",
                marginRight: "10px",
                backgroundColor: page === 0 ? "#ccc" : "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: page === 0 ? "default" : "pointer"
              }}
            >
              ← Previous
            </button>
            <span style={{ margin: "0 15px", fontWeight: "bold" }}>
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => fetchEvents(page + 1)}
              disabled={page >= totalPages - 1}
              style={{
                padding: "8px 16px",
                backgroundColor: page >= totalPages - 1 ? "#ccc" : "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: page >= totalPages - 1 ? "default" : "pointer"
              }}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ManageEvents
