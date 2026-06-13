# Image Handling Analysis - Event Booking System

## Found Issues 🔴

### **PRIMARY ISSUE: Frontend Image URL Mismatch**

**Location:** [eventsystem-frontend/src/pages/Home.jsx](eventsystem-frontend/src/pages/Home.jsx#L104)

**Problem:**
```javascript
// ❌ INCORRECT - Missing API base URL
src={`/events/image/${event.imageUrl}`}
```

**Why It Fails:**
- Frontend (Vite) runs on `http://localhost:3000`
- Backend API runs on `http://localhost:8080`
- The relative URL `/events/image/{filename}` sends request to `http://localhost:3000/events/image/{filename}`
- This port 3000 endpoint doesn't exist - only the backend on port 8080 has it
- Result: **CORS error or 404 Not Found**

**Solution:**
Import and use the API base URL
```javascript
// ✅ CORRECT - Use API_BASE_URL
import api from "../api/axios"

src={`${api.defaults.baseURL}/events/image/${event.imageUrl}`}
```

Or more simply:
```javascript
// ✅ CORRECT - Use constant
const API_BASE_URL = "http://localhost:8080"
src={`${API_BASE_URL}/events/image/${event.imageUrl}`}
```

---

## Backend Image Handling Flow ✅

### 1. **Image Upload (Working Correctly)**
- **Endpoint:** `POST /events/{id}/upload-image`
- **Handler:** [EventService.uploadImage()](eventsystem/src/main/java/com/kamlesh/eventsystem/service/EventService.java#L85-L122)
- **Process:**
  - File validated (size, type)
  - Saved to `uploads/` directory with timestamp: `1708706160000_imagename.png`
  - Only filename stored in database: `event.setImageUrl(fileName)`
  - ✅ Working as expected

### 2. **Static Resource Configuration**
- **File:** [WebConfig.java](eventsystem/src/main/java/com/kamlesh/eventsystem/config/WebConfig.java)
- **Configuration:**
  ```java
  registry.addResourceHandler("/uploads/**")
          .addResourceLocations("file:uploads/");
  ```
- **Purpose:** Maps `/uploads/filename` to actual `uploads/` directory

### 3. **Image Retrieval Endpoint**
- **Endpoint:** `GET /events/image/{filename}`
- **Handler:** [EventController.getEventImage()](eventsystem/src/main/java/com/kamlesh/eventsystem/controller/EventController.java#L83-L101)
- **Process:**
  - Calls `EventService.getImageFile(filename)`
  - Reads file from `uploads/` directory
  - Sets correct Content-Type based on file extension
  - Returns byte array as response
  - ✅ Working as expected

---

## Complete Image Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND (React/Vite - port 3000)                          │
├─────────────────────────────────────────────────────────────┤
│ 1. User uploads image in CreateEvent.jsx                   │
│ 2. FormData sent to: /events/{id}/upload-image             │
│ 3. Image displayed with src: /events/image/{filename} ❌   │
│    ^ This URL doesn't include http://localhost:8080        │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ ❌ WRONG: http://localhost:3000/events/image/...
                   │ ✅ CORRECT: http://localhost:8080/events/image/...
                   │
┌──────────────────v──────────────────────────────────────────┐
│ BACKEND (Spring Boot - port 8080)                          │
├─────────────────────────────────────────────────────────────┤
│ EventController:                                            │
│ • POST /events/{id}/upload-image → uploadEventImage()     │
│ • GET /events/image/{filename} → getEventImage()          │
│                                                             │
│ EventService:                                              │
│ • uploadImage() → saves to uploads/ directory              │
│ • getImageFile() → reads from uploads/ directory           │
│                                                             │
│ WebConfig:                                                  │
│ • Maps /uploads/** to file:uploads/                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Storage

**Event Entity:** Stores only the filename in `imageUrl` field
```
Event {
  id: 1,
  title: "Conference 2025",
  imageUrl: "1708706160000_event.png"  // ← Only filename stored
}
```

---

## File System Storage

```
project-root/
├── uploads/
│   ├── 1708706160000_event1.png
│   ├── 1708706160001_event2.jpg
│   └── 1708706160002_event3.png
├── eventsystem/
│   └── src/...
└── eventsystem-frontend/
    └── src/...
```

---

## Additional Issues Found 🟡

### 1. **Relative Path Issue (Minor)**
- **File:** EventService.java (lines 105, 157)
- **Issue:** Using relative path `"uploads/"` without explicit base directory
- **Impact:** Works in development but may fail in production
- **Fix:** Use absolute path or configuration property:
  ```java
  Path filePath = Paths.get(System.getProperty("user.dir"), "uploads", fileName);
  ```

### 2. **Default Image Placeholder in Frontend**
- **Status:** ✅ Already implemented
- **File:** [Home.jsx](eventsystem-frontend/src/pages/Home.jsx#L93)
- Shows SVG placeholder if image fails to load

---

## Summary

| Component | Status | Issue |
|-----------|--------|-------|
| Backend Upload | ✅ Working | None |
| Backend Retrieval | ✅ Working | Relative path (minor) |
| Database Storage | ✅ Working | None |
| Static Resources | ✅ Configured | None |
| **Frontend Image URL** | ❌ **BROKEN** | **Missing API base URL** |

---

## Fix Required

**Change in:** [eventsystem-frontend/src/pages/Home.jsx](eventsystem-frontend/src/pages/Home.jsx#L104)

```diff
import { useEffect, useState, useRef } from "react"
import api from "../api/axios"

function Home() {
  // ... other code ...
  
  return (
    // ... other JSX ...
    {event.imageUrl && (
      <div className="event-image-container">
        <img
-         src={`/events/image/${event.imageUrl}`}
+         src={`${api.defaults.baseURL}/events/image/${event.imageUrl}`}
          alt={event.title}
          // ... rest of props ...
        />
      </div>
    )}
  )
}
```

This single change will fix the image display issue! 🎉
