# Image Upload Failure Analysis - Event Booking System

## 🔴 Critical Issues Found

### **ISSUE 1: Inconsistent Upload Endpoints (Main Problem)**

Your code uses **TWO DIFFERENT endpoints** for image uploads, causing confusion and failures:

#### CreateEvent Page
- **Endpoint Used:** `POST /admin/{id}/upload-image`
- **File:** [eventsystem-frontend/src/pages/CreateEvent.jsx](eventsystem-frontend/src/pages/CreateEvent.jsx#L124-L140)
- **Code:**
```javascript
await api.post(
  ADMIN_CONFIG.API_ENDPOINTS.UPLOAD_IMAGE(createdEventId),  // → /admin/{id}/upload-image
  formDataWithImage,
  ...
)
```
- **Backend Handler:** [AdminController.java](eventsystem/src/main/java/com/kamlesh/eventsystem/controller/AdminController.java#L31-L36)
- **Security:** ✅ **Requires ADMIN role**

#### EditEvent Page
- **Endpoint Used:** `POST /events/{id}/upload-image`
- **File:** [eventsystem-frontend/src/pages/EditEvent.jsx](eventsystem-frontend/src/pages/EditEvent.jsx#L113-L127)
- **Code:**
```javascript
await api.post(
  `/events/${id}/upload-image`,  // ← Different endpoint!
  formDataWithImage,
  ...
)
```
- **Backend Handler:** [EventController.java](eventsystem/src/main/java/com/kamlesh/eventsystem/controller/EventController.java#L72-L78)
- **Security:** ❌ **No authorization check (Security Issue!)**

---

### **ISSUE 2: Security Configuration Mismatch**

**File:** [SecurityConfig.java](eventsystem/src/main/java/com/kamlesh/eventsystem/config/SecurityConfig.java#L37-L49)

```java
requestMatchers("/admin/**").hasRole("ADMIN")           // ✅ Protected
requestMatchers(HttpMethod.POST, "/events/create").hasRole("ADMIN")
requestMatchers(HttpMethod.GET, "/events").permitAll()
requestMatchers(HttpMethod.GET, "/events/**").permitAll() // ⚠️ This includes /events/{id}/upload-image!
```

**Problem:**
- `/events/{id}/upload-image` matches `HttpMethod.GET, "/events/**"` rule
- This makes it **publicly accessible** with no authentication!
- Anyone can upload images to any event without being an admin
- **PUT /events/{id}** also has no explicit authorization (handled by anyRequest().authenticated())

---

### **ISSUE 3: EditEvent Image Display URL (Same as display issue)**

**File:** [EditEvent.jsx](eventsystem-frontend/src/pages/EditEvent.jsx#L357-L368)

```jsx
<img
  src={`/events/image/${currentImage}`}  // ❌ Missing http://localhost:8080
  alt="Current"
  style={{ maxWidth: "100%", maxHeight: "200px" }}
/>
```

**Problem:**
- Relative path `/events/image/{filename}` tries to load from frontend port (3000 or 5173)
- Backend API is on port 8080
- Results in 404 Not Found errors

---

## 📊 Current Flow vs Expected Flow

```
CURRENT STATE (BROKEN):
┌──────────────────────────────────────────────────────────────┐
│ CreateEvent.jsx → POST /admin/{id}/upload-image             │
│                    (Requires ADMIN role) ✅                 │
├──────────────────────────────────────────────────────────────┤
│ EditEvent.jsx → POST /events/{id}/upload-image              │
│                 (NO AUTH - public) ❌                       │
└──────────────────────────────────────────────────────────────┘

EXPECTED STATE (FIX):
┌──────────────────────────────────────────────────────────────┐
│ CreateEvent.jsx → POST /admin/{id}/upload-image             │
│                    (Requires ADMIN role) ✅                 │
├──────────────────────────────────────────────────────────────┤
│ EditEvent.jsx → POST /admin/{id}/upload-image               │
│                 (Same as Create - Requires ADMIN role) ✅   │
└──────────────────────────────────────────────────────────────┘
```

---

## 📋 Why Image Upload Fails

### Scenario 1: Using CreateEvent
✅ Usually works because it uses the protected `/admin/` endpoint

### Scenario 2: Using EditEvent  
❌ **Fails because:**
1. **Wrong endpoint:** Uses `/events/{id}/upload-image` instead of `/admin/{id}/upload-image`
2. **No authorization:** Even if request goes through, it's inconsistent with backend
3. **Cross-origin issue:** Current image display URL is relative, not absolute

---

## 🔒 Security Issues Found

| Issue | Severity | Description |
|-------|----------|-------------|
| Unprotected upload endpoint | 🔴 HIGH | `/events/{id}/upload-image` has no auth check |
| Inconsistent endpoints | 🔴 HIGH | Creates confusion, enables bypass of admin check |
| Missing base URL in image display | 🟡 MEDIUM | Frontend tries to fetch from wrong URL |
| PUT endpoint vague authorization | 🟡 MEDIUM | `/events/{id}` PUT depends on anyRequest().authenticated() |

---

## ✅ Required Fixes

### Fix 1: Use Consistent Upload Endpoint in EditEvent
**File:** [EditEvent.jsx](eventsystem-frontend/src/pages/EditEvent.jsx#L113-L127)

**Current (WRONG):**
```javascript
await api.post(
  `/events/${id}/upload-image`,
  formDataWithImage,
  { headers: { "Content-Type": "multipart/form-data" } }
)
```

**Fixed:**
```javascript
await api.post(
  ADMIN_CONFIG.API_ENDPOINTS.UPLOAD_IMAGE(id),  // Uses /admin/{id}/upload-image
  formDataWithImage,
  { headers: { "Content-Type": "multipart/form-data" } }
)
```

---

### Fix 2: Fix Image Display URL in EditEvent
**File:** [EditEvent.jsx](eventsystem-frontend/src/pages/EditEvent.jsx#L360)

**Current (WRONG):**
```jsx
src={`/events/image/${currentImage}`}
```

**Fixed:**
```jsx
src={`${api.defaults.baseURL}/events/image/${currentImage}`}
```

Or import constant:
```jsx
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080"
src={`${API_BASE_URL}/events/image/${currentImage}`}
```

---

### Fix 3: Remove Unprotected Upload Endpoint (Security)
**File:** [AdminController.java](eventsystem/src/main/java/com/kamlesh/eventsystem/controller/AdminController.java#L28-L36) ✅ Keep this (ADMIN only)

**File:** [EventController.java](eventsystem/src/main/java/com/kamlesh/eventsystem/controller/EventController.java#L72-L78) ❌ Remove or securely implement

**Option A - Remove:** Delete the upload-image method from EventController entirely  
**Option B - Secure it:** 
```java
@PostMapping("/{id}/upload-image")
@PreAuthorize("hasRole('ADMIN')")  // ← Add this
public String uploadEventImage(
    @PathVariable Long id,
    @RequestParam("file") MultipartFile file
) throws IOException {
    return eventService.uploadImage(id, file);
}
```

---

### Fix 4: Verify Security Config
**File:** [SecurityConfig.java](eventsystem/src/main/java/com/kamlesh/eventsystem/config/SecurityConfig.java#L41-L44)

**Current:**
```java
requestMatchers(HttpMethod.GET, "/events/**").permitAll()
requestMatchers(HttpMethod.PUT, "/events/{id}").???  // Vague!
```

**Recommended:**
```java
// GET requests for events - OK to allow all
requestMatchers(HttpMethod.GET, "/events").permitAll()
requestMatchers(HttpMethod.GET, "/events/**").permitAll()

// PUT requests for events - should require ADMIN
requestMatchers(HttpMethod.PUT, "/events/**").hasRole("ADMIN")

// Image uploads - explicitly under /admin
requestMatchers(HttpMethod.POST, "/admin/**").hasRole("ADMIN")
```

---

## 📁 File Structure Summary

```
Upload Flow Issues:

frontend/pages/CreateEvent.jsx
  └─→ uploadImage() → POST /admin/{eventId}/upload-image ✅

frontend/pages/EditEvent.jsx
  └─→ updateEvent() → POST /events/{id}/upload-image ❌
      └─→ Image display: /events/image/{filename} ❌

backend/AdminController.java
  └─→ POST /admin/{id}/upload-image ✅ (ADMIN required)

backend/EventController.java
  └─→ POST /events/{id}/upload-image ❌ (NO AUTH!)
  └─→ GET /events/image/{filename} ✅ (Read public)

backend/SecurityConfig.java
  └─→ CORS: localhost:5173 ✅
  └─→ /admin/** requires ADMIN ✅
  └─→ /events/** GET is public ✅
  └─→ /events/** PUT is vague ❌
```

---

## 🎯 Implementation Priority

| Priority | Fix | Impact |
|----------|-----|--------|
| 1 (Critical) | Remove or secure `/events/{id}/upload-image` | Prevents unauthorized uploads |
| 2 (High) | Update EditEvent to use `/admin/{id}/upload-image` | Makes uploads consistent & secured |
| 3 (High) | Fix image display URLs with base URL | Fixes image not showing |
| 4 (Medium) | Add explicit PUT authorization in SecurityConfig | Clarifies security intent |

---

## Summary

Your image **uploads fail** in EditEvent because:
1. ❌ Wrong endpoint (`/events/` instead of `/admin/`)
2. ❌ No authentication required on that endpoint
3. ❌ Image display URL is relative (separate issue)

CreateEvent works because it uses the correct protected endpoint.
