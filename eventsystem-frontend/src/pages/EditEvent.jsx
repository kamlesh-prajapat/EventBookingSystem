import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api/axios"
import {
  validateEventForm,
  validateImageFile,
  formatFileSize,
  ADMIN_CONFIG
} from "../utils/adminConfig"

function EditEvent() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    eventDate: "",
    capacity: "",
    price: ""
  })

  const [imageFile, setImageFile] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)

  // Fetch event data on mount
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`)
        const event = response.data
        
        // Convert eventDate to YYYY-MM-DD format for input
        const eventDate = event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : ""
        
        setFormData({
          title: event.title || "",
          description: event.description || "",
          location: event.location || "",
          eventDate: eventDate,
          capacity: event.capacity || "",
          price: event.price || ""
        })
        
        if (event.imageUrl) {
          setCurrentImage(event.imageUrl)
        }
        
        setLoading(false)
      } catch (error) {
        setError("Failed to load event. " + (error.response?.data?.message || error.message))
        setLoading(false)
        console.error("Error fetching event:", error)
      }
    }

    if (id) {
      fetchEvent()
    }
  }, [id])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const validationError = validateImageFile(file)
      if (validationError) {
        setError(validationError)
        return
      }
      setImageFile(file)
      
      // Preview image
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      setError(null)
    }
  }

  const updateEvent = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validate form
    const errors = validateEventForm(formData)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setSubmitting(true)

    try {
      await api.put(`/events/${id}`, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        eventDate: formData.eventDate,
        capacity: parseInt(formData.capacity),
        price: parseFloat(formData.price)
      })

      // If there's a new image, upload it
      if (imageFile) {
        try {
          const formDataWithImage = new FormData()
          formDataWithImage.append("file", imageFile)

          await api.post(
            `/events/${id}/upload-image`,
            formDataWithImage,
            {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            }
          )
        } catch (imageError) {
          console.error("Warning: Image upload failed, but event was updated", imageError)
          // Continue even if image upload fails
        }
      }

      setSuccess("Event updated successfully! Redirecting...")
      setImageFile(null)
      setImagePreview(null)
      
      // Redirect back to manage events after 2 seconds
      setTimeout(() => {
        navigate("/manage-events")
      }, 2000)
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to update event"
      setError(errorMsg)
      console.error("Error updating event:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        Loading event details...
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Edit Event</h2>
        <button
          onClick={() => navigate("/manage-events")}
          style={{
            padding: "8px 16px",
            backgroundColor: "#666",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          ← Back
        </button>
      </div>

      {error && (
        <div style={{ color: "red", padding: "10px", backgroundColor: "#ffe0e0", borderRadius: "4px", marginBottom: "15px" }}>
          ❌ {error}
        </div>
      )}

      {success && (
        <div style={{ color: "green", padding: "10px", backgroundColor: "#e0ffe0", borderRadius: "4px", marginBottom: "15px" }}>
          ✅ {success}
        </div>
      )}

      <form onSubmit={updateEvent}>
        <div style={{ marginBottom: "15px" }}>
          <label>Event Title * {formData.title.length}/{ADMIN_CONFIG.EVENT_TITLE_MAX_LENGTH}</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            maxLength={ADMIN_CONFIG.EVENT_TITLE_MAX_LENGTH}
            placeholder="Enter event title"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "8px",
              boxSizing: "border-box",
              borderColor: formErrors.title ? "red" : "#ccc",
              border: "1px solid"
            }}
            required
          />
          {formErrors.title && <p style={{ color: "red", margin: "5px 0" }}>{formErrors.title}</p>}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Description {formData.description.length}/{ADMIN_CONFIG.EVENT_DESCRIPTION_MAX_LENGTH}</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            maxLength={ADMIN_CONFIG.EVENT_DESCRIPTION_MAX_LENGTH}
            placeholder="Enter event description"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "8px",
              boxSizing: "border-box",
              minHeight: "100px"
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Location * {formData.location.length}/{ADMIN_CONFIG.LOCATION_MAX_LENGTH}</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleFormChange}
            maxLength={ADMIN_CONFIG.LOCATION_MAX_LENGTH}
            placeholder="Enter event location"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "8px",
              boxSizing: "border-box",
              borderColor: formErrors.location ? "red" : "#ccc",
              border: "1px solid"
            }}
            required
          />
          {formErrors.location && <p style={{ color: "red", margin: "5px 0" }}>{formErrors.location}</p>}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Event Date * {formErrors.eventDate && <span style={{ color: "red" }}>*</span>}</label>
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleFormChange}
            disabled={submitting}
            style={{
              width: "100%",
              padding: "8px",
              boxSizing: "border-box",
              borderColor: formErrors.eventDate ? "red" : "#ccc",
              border: "1px solid"
            }}
            required
          />
          {formErrors.eventDate && <p style={{ color: "red", margin: "5px 0" }}>{formErrors.eventDate}</p>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
          <div>
            <label>Capacity (Seats) * {formErrors.capacity && <span style={{ color: "red" }}>*</span>}</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleFormChange}
              placeholder="Enter capacity"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "8px",
                boxSizing: "border-box",
                borderColor: formErrors.capacity ? "red" : "#ccc",
                border: "1px solid"
              }}
              min="1"
              required
            />
            {formErrors.capacity && <p style={{ color: "red", margin: "5px 0", fontSize: "12px" }}>{formErrors.capacity}</p>}
          </div>

          <div>
            <label>Price (₹) * {formErrors.price && <span style={{ color: "red" }}>*</span>}</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleFormChange}
              placeholder="Enter price"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "8px",
                boxSizing: "border-box",
                borderColor: formErrors.price ? "red" : "#ccc",
                border: "1px solid"
              }}
              min="0"
              step="0.01"
              required
            />
            {formErrors.price && <p style={{ color: "red", margin: "5px 0", fontSize: "12px" }}>{formErrors.price}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: submitting ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: submitting ? "default" : "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          {submitting ? "Updating Event..." : "Update Event"}
        </button>
      </form>

      <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "2px solid #ddd" }}>
        <h3>Event Image</h3>
        
        {currentImage && !imagePreview && (
          <div style={{ marginBottom: "15px" }}>
            <label>Current Image</label>
            <div style={{
              marginTop: "10px",
              textAlign: "center",
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "4px"
            }}>
              <img
                src={`/api/events/image/${currentImage}`}
                alt="Current"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/200?text=No+Image"
                }}
              />
            </div>
          </div>
        )}

        <div style={{ marginBottom: "15px" }}>
          <label>Upload New Image (Optional, Max {formatFileSize(ADMIN_CONFIG.MAX_FILE_SIZE)})</label>
          <div style={{
            border: "2px dashed #4CAF50",
            padding: "20px",
            textAlign: "center",
            borderRadius: "4px",
            marginTop: "10px",
            backgroundColor: "#f9f9f9",
            cursor: "pointer"
          }}>
            <input
              type="file"
              accept={ADMIN_CONFIG.ALLOWED_IMAGE_TYPES.join(",")}
              onChange={handleImageSelect}
              disabled={uploadingImage}
              id="image-input"
              style={{ display: "none" }}
            />
            <label htmlFor="image-input" style={{ cursor: "pointer" }}>
              <div>
                <p style={{ marginBottom: "10px" }}>📁 Click to select image or drag and drop</p>
                <p style={{ fontSize: "12px", color: "#999" }}>Supported: JPG, PNG, GIF, WebP (Max {formatFileSize(ADMIN_CONFIG.MAX_FILE_SIZE)})</p>
              </div>
            </label>
          </div>
        </div>

        {imageFile && (
          <div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
            <p>File: <strong>{imageFile.name}</strong> ({formatFileSize(imageFile.size)})</p>
          </div>
        )}

        {imagePreview && (
          <div style={{ marginBottom: "15px" }}>
            <label>New Image Preview</label>
            <div style={{
              marginTop: "10px",
              textAlign: "center",
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "4px"
            }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EditEvent
