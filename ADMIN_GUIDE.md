# Admin Event Management - Complete Guide

## 🎯 Overview

This document provides a comprehensive guide to the Admin Event Management system. Admins have full control over event creation, image uploads, event editing, and deletion.

---

## 📋 Admin Features

### 1. **Create Event**
- **Path**: `/create-event`
- **Access**: Admin only (role must be "ADMIN")
- **Features**:
  - Create new events with form validation
  - Real-time character count for title and description
  - File size and type validation for images
  - Image preview before upload
  - Auto-generated event ID

### 2. **Manage Events**
- **Path**: `/manage-events`
- **Access**: Admin only
- **Features**:
  - View all events in paginated table
  - Display event details (title, location, date, capacity, price)
  - Show available seats status
  - Delete events with confirmation
  - Formatted currency display
  - Responsive table layout

### 3. **Admin Dashboard**
- **Path**: `/admin`
- **Access**: Admin only
- **Features**:
  - View dashboard statistics
  - Total events count
  - Total bookings count
  - Total users count
  - Total revenue

---

## 📊 Form Validation

### Event Creation Form

| Field | Rules | Max Length |
|-------|-------|-----------|
| Title | Required, Not empty | 100 chars |
| Description | Optional | 1000 chars |
| Location | Required, Not empty | 200 chars |
| Event Date | Required, Must be future date | N/A |
| Capacity | Required, Must be > 0 | N/A |
| Price | Required, Must be > 0 | N/A |

### Image Upload

| Setting | Value |
|---------|-------|
| Max Size | 5 MB |
| Allowed Types | JPG, PNG, GIF, WebP |
| Required | After event creation |

---

## 🔐 Security Features

### Authentication
- JWT token-based authentication
- Automatic logout on 401 responses
- Role-based access control (ADMIN role required)

### File Upload Security
- File type validation (only images allowed)
- File size validation (max 5MB)
- Content-type checking
- Server-side validation in backend

### Authorization
- All admin endpoints require ADMIN role
- DELETE operations protected
- Image upload protected
- Event creation protected

---

## 🚀 Step-by-Step Usage

### Creating an Event with Image

#### Step 1: Navigate to Create Event
```
1. Click "➕ Create Event" button in navbar
2. You'll see the event creation form
```

#### Step 2: Fill Event Details
```
1. Title: Enter event name (e.g., "Tech Conference 2026")
2. Description: Enter event details (optional)
3. Location: Enter venue location
4. Event Date: Select a future date
5. Capacity: Enter total seats
6. Price: Enter ticket price in rupees
```

#### Step 3: Create Event
```
1. Click "Create Event" button
2. Wait for success message
3. Event ID will be displayed
```

#### Step 4: Upload Image
```
1. Once event is created, image upload section appears
2. Click on upload area or drag & drop image
3. Preview will be shown
4. Click "Upload Image" button
5. Success message confirms upload
```

### Managing Events

#### Step 1: Navigate to Manage Events
```
1. Click "⚙️ Manage Events" in navbar
2. View all events in table format
```

#### Step 2: View Event Details
```
- Title: Event name with image indicator (🖼️)
- Location: Event venue
- Date: Formatted date (e.g., "March 15, 2026")
- Capacity: Total seats
- Available: Remaining seats (color-coded)
- Price: Formatted currency (₹)
```

#### Step 3: Delete Event
```
1. Click "🗑️ Delete" button
2. Confirm deletion in popup
3. Event will be removed immediately
4. Page refreshes to show updated list
```

#### Step 4: Pagination
```
- Use "← Previous" and "Next →" buttons
- Shows current page and total pages
- Buttons auto-disable at boundaries
```

---

## 📈 Backend API Integration

### Endpoints Used

#### Create Event
```
POST /events/create
Authorization: Bearer {token}
Content-Type: application/json

Payload:
{
  "title": "string",
  "description": "string",
  "location": "string",
  "eventDate": "YYYY-MM-DD",
  "capacity": 100,
  "price": 500.00
}

Response: 200 OK
{
  "id": 1,
  "title": "...",
  "capacity": 100,
  "availableSeats": 100,
  ...
}
```

#### Upload Image
```
POST /admin/{eventId}/upload-image
Authorization: Bearer {token}
Content-Type: multipart/form-data

Parameters:
- file: MultipartFile (image)

Response: 200 OK
"Image uploaded successfully"
```

#### Get Events
```
GET /events?page=0&size=10&sortBy=eventDate&direction=asc
Authorization: Bearer {token}

Response: 200 OK
{
  "content": [...],
  "totalPages": 5,
  "totalElements": 45,
  ...
}
```

#### Delete Event
```
DELETE /events/{eventId}
Authorization: Bearer {token}

Response: 200 OK
"Event deleted successfully"
```

---

## 🛡️ Error Handling

### Client-Side Validation Errors
```
- Required field missing → Shows field-specific error
- Invalid format → Shows validation message
- File too large → Shows size error
- Invalid file type → Shows type error
```

### Server-Side Errors
```
- 401 Unauthorized → Auto-logout and redirect to login
- 403 Forbidden → Not admin, cannot access
- 400 Bad Request → Invalid input data
- 500 Internal Server Error → Server error message
```

### How Errors are Displayed
```
1. Error alert box (red background)
2. Toast notification (if configured)
3. User feedback with emoji
4. Console logging for debugging
```

---

## ⚡ Performance Optimizations

### Frontend
1. **Pagination**: Events loaded 10 per page (reduces initial load)
2. **Lazy Loading**: Components load only when accessed
3. **Form Validation**: Client-side validation prevents unnecessary API calls
4. **Error Boundaries**: Prevents app crash on errors
5. **Loading States**: User sees feedback during async operations

### Backend
1. **Input Validation**: @Valid annotation on request body
2. **Database Queries**: Pagination using Spring Data
3. **File Upload**: Size validation prevents large file processing
4. **Error Handling**: Global exception handler
5. **Caching**: Can be added for frequently accessed data

### Image Upload
1. **File Size Validation**: 5MB max before upload attempt
2. **File Type Validation**: Only image/* accepted
3. **Unique Filenames**: Uses timestamp to prevent conflicts
4. **Directory Creation**: Creates uploads/ directory if needed
5. **Error Recovery**: Fallback error messages

---

## 🔧 Configuration

### Admin Configuration File
Location: `src/utils/adminConfig.js`

```javascript
export const ADMIN_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,        // 5MB
  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp"
  ],
  EVENT_TITLE_MAX_LENGTH: 100,
  EVENT_DESCRIPTION_MAX_LENGTH: 1000,
  LOCATION_MAX_LENGTH: 200,
  // ... more configs
}
```

### Backend Configuration
Location: `application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/event_system
spring.datasource.username=root
spring.datasource.password=@kmls123#
spring.jpa.hibernate.ddl-auto=update
```

---

## 📱 Responsive Design

### Breakpoints
- Desktop: Full table with all columns visible
- Mobile: Scrollable table with fixed columns
- Navbar: Wraps buttons responsively

### Touch-Friendly
- Large buttons (minimum 44px height)
- Clear spacing between interactive elements
- Readable font sizes
- Good contrast ratios

---

## 🐛 Troubleshooting

### Image Upload Not Working
**Problem**: Image won't upload
**Solution**:
1. Check file size (max 5MB)
2. Verify file type is image
3. Check backend /uploads directory exists
4. Check file permissions

### Event Not Showing in List
**Problem**: Created event doesn't appear in manage events
**Solution**:
1. Refresh page
2. Check pagination (might be on different page)
3. Verify event creation success message
4. Check browser console for errors

### Delete Button Disabled
**Problem**: Can't delete event
**Solution**:
1. Ensure you have ADMIN role
2. Check if event is already being deleted
3. Refresh page if stuck
4. Check network requests in DevTools

### Can't Access Admin Pages
**Problem**: Redirected to home page
**Solution**:
1. Verify login (check token in localStorage)
2. Confirm role is "ADMIN"
3. Clear browser cache and login again
4. Check network tab for 403 errors

---

## 📚 Related Documentation

- [Quick Start Guide](./QUICK_START.md)
- [Optimization Report](./OPTIMIZATION_REPORT.md)
- Backend API Documentation (Swagger at `/swagger-ui.html`)

---

## ✅ Testing Checklist

- [ ] Create event with valid data
- [ ] See validation error for missing fields
- [ ] Upload image after event creation
- [ ] View uploaded image in manage events
- [ ] Browse events with pagination
- [ ] Delete event and confirm
- [ ] Check error handling with invalid data
- [ ] Verify role-based access control
- [ ] Test on mobile device
- [ ] Check performance with many events

---

## 💡 Tips & Best Practices

1. **Always add a meaningful title**: Helps users find events
2. **Include description**: Increases user engagement
3. **Use high-quality images**: Better presentation
4. **Set realistic capacity**: Avoid overbooking
5. **Price appropriately**: Consider market rates
6. **Plan ahead**: Create events well in advance
7. **Monitor bookings**: Check admin dashboard regularly
8. **Update events**: Keep information current

---

**Last Updated**: March 6, 2026
**Version**: 1.0.0
