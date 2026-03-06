# Quick Start Guide - Optimized Event Booking System

## 🔄 Key Changes Summary

### Backend Changes
1. **New DTOs Created**
   - `LoginResponse.java` - Returns token, email, name, role
   - `RegisterRequest.java` - Registration form data
   
2. **AuthService Enhanced**
   - Login now returns `LoginResponse` with user info
   - New `register()` method for user registration
   
3. **AuthController Updated**
   - POST `/auth/login` returns `LoginResponse`
   - POST `/auth/register` accepts `RegisterRequest`

### Frontend Changes
1. **API Client Improved**
   - Added env variable support (`VITE_API_URL`)
   - Added 30-second timeout
   - Auto-logout on 401 responses

2. **All Pages Enhanced**
   - Loading states ⏳
   - Error messages ❌
   - Proper async handling

3. **Routes Protected** 
   - Admin dashboard requires `role: ADMIN`
   - All private routes require authentication

---

## 🚀 Running the Application

### Terminal 1: Backend
```bash
cd eventsystem
mvn spring-boot:run
```
Backend runs on: `http://localhost:8080`

### Terminal 2: Frontend
```bash
cd eventsystem-frontend
npm install  # First time only
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 📝 Testing the Application

### 1. Register New User
- Go to http://localhost:5173/register
- Fill in Name, Email, Password
- Click Register
- You're automatically logged in!

### 2. View Events
- Home page shows paginated events
- Click "Book Now" to book an event
- Use Previous/Next to navigate

### 3. View My Bookings
- Click "My Bookings" in navbar
- See all your bookings
- Click "Cancel Booking" to cancel

### 4. Admin Dashboard
- Need admin account to access
- Shows total stats and all bookings
- Admin check is Role-based

---

## 🔒 Authentication Flow

### Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "USER"
}
```

The frontend stores:
- `token` → Used for API authentication
- `role` → Used for role-based routing
- `userEmail` → Displayed in navbar
- `userName` → Available for future use

---

## 🛠️ Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8080
```

### Backend (application.properties)
```
spring.datasource.url=jdbc:mysql://localhost:3306/event_system
spring.datasource.username=root
spring.datasource.password=@kmls123#
```

---

## 📋 API Endpoints

### Authentication
- `POST /auth/login` - Login with email/password
- `POST /auth/register` - Register new user

### Events
- `GET /events` - Get paginated events
- `POST /events/create` - Create event (admin only)
- `GET /events/{id}` - Get single event
- `DELETE /events/{id}` - Delete event (admin only)

### Bookings
- `GET /bookings/my` - Get user's bookings
- `GET /bookings` - Get all bookings (admin only)
- `POST /bookings` - Create booking
- `PUT /bookings/cancel` - Cancel booking

### Admin
- `GET /admin/dashboard` - Get dashboard stats

---

## ✨ Features

✅ User Registration
✅ User Login with Role
✅ Event Browsing with Pagination
✅ Event Booking
✅ Booking Management
✅ Admin Dashboard
✅ Role-Based Access Control
✅ Auto-Logout on 401
✅ Loading States
✅ Error Handling

---

## 🐛 Troubleshooting

### "Connection refused"
- Check if backend is running on port 8080
- Check if frontend is running on port 5173

### "Invalid credentials"
- Make sure database is running
- Check if user exists in database

### "Unauthorized to access admin"
- Check if user has ADMIN role
- Only admins can access /admin routes

### "Token expired"
- Clear localStorage and login again
- Generate new token

---

## 📚 File Structure

```
eventsystem-frontend/
├── src/
│   ├── api/
│   │   └── axios.js          [✅ Enhanced with interceptors]
│   ├── pages/
│   │   ├── Home.jsx          [✅ Pagination & Loading]
│   │   ├── Login.jsx         [✅ Error handling]
│   │   ├── Register.jsx      [✅ Auto-login after register]
│   │   ├── MyBookings.jsx    [✅ Cancel booking]
│   │   └── AdminDashboard.jsx [✅ Fixed API call]
│   ├── components/
│   │   ├── Navbar.jsx        [✅ Improved UI]
│   │   └── ProtectedRoute.jsx [✅ Role checking]
│   ├── App.jsx               [✅ Protected routes]
│   ├── .env                  [✅ New]
│   └── .env.example          [✅ New]
```

```
eventsystem/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/kamlesh/eventsystem/
│       │       ├── controller/
│       │       │   └── AuthController.java [✅ Returns LoginResponse]
│       │       ├── service/
│       │       │   └── AuthService.java    [✅ Register method added]
│       │       └── dto/
│       │           ├── LoginResponse.java  [✅ New]
│       │           ├── RegisterRequest.java [✅ New]
│       │           └── LoginRequest.java   [✅ Validation added]
```

---

## 💡 Performance Tips

1. **Frontend**
   - Use ProtectedRoute for private pages
   - Let axios interceptors handle tokens
   - Use loading states to prevent double-submission

2. **Backend**
   - Validate input on server
   - Use pagination for large datasets
   - Cache frequently accessed data

3. **Database**
   - Add indexes on frequently searched columns
   - Use connection pooling
   - Regular backups

---

## 📞 Support

For issues or questions:
1. Check console for error messages
2. Review network tab in DevTools
3. Check backend logs
4. Verify database connection

---

**Happy Coding! 🎉**
