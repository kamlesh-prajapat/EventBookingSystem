import { useState } from "react"
import api from "../api/axios"
import {
  validateEventForm,
  validateImageFile,
  formatFileSize,
  ADMIN_CONFIG
} from "../utils/adminConfig"

function CreateEvent() {
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [createdEventId, setCreatedEventId] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)

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

  const createEvent = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validate form
    const errors = validateEventForm(formData)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setLoading(true)

    try {
      const response = await api.post(ADMIN_CONFIG.API_ENDPOINTS.CREATE_EVENT, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        eventDate: formData.eventDate,
        capacity: parseInt(formData.capacity),
        price: parseFloat(formData.price)
      })

      setCreatedEventId(response.data.id)
      setSuccess(`${ADMIN_CONFIG.SUCCESS_MESSAGES.EVENT_CREATED} ID: ${response.data.id}`)
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        location: "",
        eventDate: "",
        capacity: "",
        price: ""
      })
      setFormErrors({})
      setImageFile(null)
      setImagePreview(null)
    } catch (error) {
      const errorMsg = error.response?.data?.message || ADMIN_CONFIG.ERROR_MESSAGES.CREATE_EVENT_FAILED
      setError(errorMsg)
      console.error("Error creating event:", error)
    } finally {
      setLoading(false)
    }
  }

  const uploadImage = async () => {
    if (!imageFile) {
      setError("Please select an image first")
      return
    }

    if (!createdEventId) {
      setError("Please create an event first")
      return
    }

    setUploadingImage(true)
    setError(null)

    try {
      const formDataWithImage = new FormData()
      formDataWithImage.append("file", imageFile)

      await api.post(
        ADMIN_CONFIG.API_ENDPOINTS.UPLOAD_IMAGE(createdEventId),
        formDataWithImage,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )

      setSuccess(ADMIN_CONFIG.SUCCESS_MESSAGES.IMAGE_UPLOADED)
      setImageFile(null)
      setImagePreview(null)
      setCreatedEventId(null)
    } catch (error) {
      const errorMsg = error.response?.data?.message || ADMIN_CONFIG.ERROR_MESSAGES.UPLOAD_IMAGE_FAILED
      setError(errorMsg)
      console.error("Error uploading image:", error)
    } finally {
      setUploadingImage(false)
    }
  }

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>Create New Event</h2>

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

      <form onSubmit={createEvent}>
        <div style={{ marginBottom: "15px" }}>
          <label>Event Title * {formData.title.length}/{ADMIN_CONFIG.EVENT_TITLE_MAX_LENGTH}</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            maxLength={ADMIN_CONFIG.EVENT_TITLE_MAX_LENGTH}
            placeholder="Enter event title"
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: loading ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "default" : "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          {loading ? "Creating Event..." : "Create Event"}
        </button>
      </form>

      {createdEventId && (
        <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "2px solid #ddd" }}>
          <h3>Upload Event Image</h3>
          <p style={{ color: "#666" }}>Event ID: <strong>{createdEventId}</strong></p>

          <div style={{ marginBottom: "15px" }}>
            <label>Select Image * (Max {formatFileSize(ADMIN_CONFIG.MAX_FILE_SIZE)})</label>
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
              <label>Image Preview</label>
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

          <button
            onClick={uploadImage}
            disabled={uploadingImage || !imageFile}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: uploadingImage || !imageFile ? "#ccc" : "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: uploadingImage || !imageFile ? "default" : "pointer",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            {uploadingImage ? "Uploading Image..." : "Upload Image"}
          </button>
        </div>
      )}
    </div>
  )
}

export default CreateEvent
