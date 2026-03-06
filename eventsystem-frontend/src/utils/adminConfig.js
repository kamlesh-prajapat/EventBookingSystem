/**
 * Admin Configuration and Constants
 */

export const ADMIN_CONFIG = {
  // File upload settings
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  
  // Form validation
  EVENT_TITLE_MAX_LENGTH: 100,
  EVENT_DESCRIPTION_MAX_LENGTH: 1000,
  LOCATION_MAX_LENGTH: 200,
  
  // API endpoints
  API_ENDPOINTS: {
    CREATE_EVENT: "/events/create",
    UPLOAD_IMAGE: (eventId) => `/admin/${eventId}/upload-image`,
    DELETE_EVENT: (eventId) => `/events/${eventId}`,
    GET_EVENTS: "/events",
    GET_EVENT: (eventId) => `/events/${eventId}`
  },

  // Validation messages
  VALIDATION_MESSAGES: {
    TITLE_REQUIRED: "Title is required",
    LOCATION_REQUIRED: "Location is required",
    DATE_REQUIRED: "Event date is required",
    CAPACITY_INVALID: "Capacity must be a positive number",
    PRICE_INVALID: "Price must be a positive number",
    FILE_SIZE_EXCEEDED: "Image size must be less than 5MB",
    INVALID_FILE_TYPE: "Please select a valid image file (JPG, PNG, GIF, WebP)",
    EMAIL_ALREADY_EXISTS: "Email already registered",
    INVALID_CREDENTIALS: "Invalid credentials"
  },

  // Success messages
  SUCCESS_MESSAGES: {
    EVENT_CREATED: "Event created successfully!",
    IMAGE_UPLOADED: "Image uploaded successfully!",
    EVENT_DELETED: "Event deleted successfully!",
    EVENT_UPDATED: "Event updated successfully!"
  },

  // Error messages
  ERROR_MESSAGES: {
    CREATE_EVENT_FAILED: "Failed to create event",
    UPLOAD_IMAGE_FAILED: "Failed to upload image",
    DELETE_EVENT_FAILED: "Failed to delete event",
    FETCH_EVENTS_FAILED: "Failed to fetch events"
  }
}

/**
 * Validate event form data
 */
export const validateEventForm = (formData) => {
  const errors = {}

  if (!formData.title?.trim()) {
    errors.title = ADMIN_CONFIG.VALIDATION_MESSAGES.TITLE_REQUIRED
  }

  if (!formData.location?.trim()) {
    errors.location = ADMIN_CONFIG.VALIDATION_MESSAGES.LOCATION_REQUIRED
  }

  if (!formData.eventDate) {
    errors.eventDate = ADMIN_CONFIG.VALIDATION_MESSAGES.DATE_REQUIRED
  }

  if (!formData.capacity || parseInt(formData.capacity) <= 0) {
    errors.capacity = ADMIN_CONFIG.VALIDATION_MESSAGES.CAPACITY_INVALID
  }

  if (!formData.price || parseFloat(formData.price) <= 0) {
    errors.price = ADMIN_CONFIG.VALIDATION_MESSAGES.PRICE_INVALID
  }

  return errors
}

/**
 * Validate image file
 */
export const validateImageFile = (file) => {
  if (!file) {
    return "Please select an image"
  }

  if (file.size > ADMIN_CONFIG.MAX_FILE_SIZE) {
    return ADMIN_CONFIG.VALIDATION_MESSAGES.FILE_SIZE_EXCEEDED
  }

  if (!ADMIN_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return ADMIN_CONFIG.VALIDATION_MESSAGES.INVALID_FILE_TYPE
  }

  return null
}

/**
 * Format file size for display
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
}

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return `₹${parseFloat(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}

/**
 * Check if date is in the future
 */
export const isFutureDate = (dateString) => {
  const eventDate = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return eventDate > today
}
