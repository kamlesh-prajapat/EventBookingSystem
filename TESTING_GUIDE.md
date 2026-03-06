# Testing Guide - Admin Event Management Feature

## 🧪 Comprehensive Testing Guide

This guide provides step-by-step instructions to test all admin event management features.

---

## Prerequisites

### Before Testing
- [ ] Backend running on `http://localhost:8080`
- [ ] Frontend running on `http://localhost:5173`
- [ ] Database (MySQL) running
- [ ] At least one user with ADMIN role
- [ ] Browser with DevTools for debugging

### Creating Admin User

If you need an admin user, use one of these methods:

#### Method 1: Database Query
```sql
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@example.com', '$2a$10...', 'ADMIN');
```

#### Method 2: Direct Registration (if enabled) + Manual Role Update
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'youradmin@example.com';
```

---

## 🧑‍💻 User Setup

### Create Test Admin Account
1. Go to http://localhost:5173/register
2. Register with:
   - Name: Admin Test
   - Email: admin@test.com
   - Password: Test@123
3. After registration, manually update database:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'admin@test.com';
   ```
4. Logout and login again to refresh token

### Create Test User Account
1. Follow registration above
2. Name: Regular User
3. Email: user@test.com
4. Password: Test@123
5. (No database update needed, default role is USER)

---

## ✅ Feature Testing

### Test 1: Admin Access Control

**Objective**: Verify only admins can access admin pages

**Steps**:
1. **Login as Regular User**
   ```
   2. Go to http://localhost:5173/login
   3. Enter: user@test.com / Test@123
   4. Click Login
   ```

2. **Attempt to Access Create Event Page**
   ```
   5. Go to http://localhost:5173/create-event
   6. Expected: Redirected to home page
   7. Reason: Not an admin
   ```

3. **Logout**
   ```
   8. Click Logout button
   9. Redirected to login
   ```

4. **Login as Admin**
   ```
   10. Go to http://localhost:5173/login
   11. Enter: admin@test.com / Test@123 (or your admin account)
   12. Click Login
   ```

5. **Access Create Event Page**
   ```
   13. Click "➕ Create Event" in navbar
   14. Should load Create Event page
   15. Form should be visible
   ```

**Expected Result**: ✅ Only admins can access admin pages

---

### Test 2: Event Creation with Validation

**Objective**: Verify form validation works correctly

**Steps**:

#### Test 2a: Form Validation
1. **Access Create Event page** (as admin)
2. **Leave form empty and click "Create Event"**
   - Expected: Error messages appear for all required fields
3. **Fill Title only, try submit**
   - Expected: Errors for Location, Date, Capacity, Price
4. **Fill all fields correctly**
   ```
   Title: Summer Tech Conference 2026
   Description: A conference for tech enthusiasts
   Location: New Delhi Convention Center
   Date: 2026-06-15 (future date)
   Capacity: 500
   Price: 1999.00
   ```
5. **Click "Create Event"**
   - Expected: Success message with Event ID

#### Test 2b: Invalid Data
1. **Try event with past date**
   - Enter date before today
   - Expected: Cannot submit or error message
2. **Try negative capacity**
   - Enter: -100
   - Expected: Validation error
3. **Try zero price**
   - Enter: 0
   - Expected: Validation error
4. **Try very long title**
   - Enter 101+ characters
   - Expected: Input stops at 100 chars (max length)

**Expected Result**: ✅ All validation works correctly

---

### Test 3: Image Upload

**Objective**: Verify image upload with validation

**Steps**:

#### Test 3a: Valid Image Upload
1. **Create an event successfully**
   - After creation, "Upload Event Image" section appears
   - Event ID is displayed
2. **Select a valid image**
   - Click upload area
   - Select a JPG/PNG file (< 5MB)
   - Expected: Image preview appears
3. **Upload image**
   - Click "Upload Image" button
   - Expected: Success message
4. **Verify**
   - Go to Manage Events
   - Check if 🖼️ icon appears next to event

#### Test 3b: File Validation
1. **Try uploading non-image file**
   - Select a .txt or .pdf file
   - Expected: Error message "Please select a valid image file"
2. **Try uploading large image**
   - Use image > 5MB
   - Expected: Error message "Image size must be less than 5MB"
3. **Try uploading invalid format**
   - WebP format (if not supported)
   - Expected: Format validation error
4. **Try uploading empty file**
   - Select a corrupted image
   - Expected: Error or no preview

**Expected Result**: ✅ Image validation works correctly

---

### Test 4: Event Management

**Objective**: Verify event listing and deletion

**Steps**:

#### Test 4a: Event Listing
1. **Go to Manage Events page**
   - Click "⚙️ Manage Events" in navbar
   - Expected: List of events appears in table
2. **Verify table displays**
   - Title with image indicator
   - Location
   - Date (formatted)
   - Capacity
   - Available seats (color-coded)
   - Price (formatted currency)
   - Delete button
3. **Verify pagination**
   - If less than 10 events: Only current page shown
   - If more than 10 events: Pagination controls visible
4. **Test pagination**
   - Click "Next →"
   - Page number increments
   - Events change to show next 10
   - "← Previous" becomes enabled
5. **Test boundary conditions**
   - On first page: "← Previous" disabled
   - On last page: "Next →" disabled

#### Test 4b: Event Deletion
1. **Create several test events**
   - Event 1: "Test Conference"
   - Event 2: "Music Festival"
   - Event 3: "Sports Meet"
2. **Refresh Manage Events page**
   - All events should appear
3. **Delete Event 2**
   - Click delete button for "Music Festival"
   - Verify confirmation dialog appears
   - Click "Cancel" → Event not deleted
   - Click "OK" → Event deleted
4. **Verify deletion**
   - Event disappears from list
   - Page refreshes
   - Event no longer visible
5. **Check deletion message**
   - Success notification appears
   - Message: "Event deleted successfully ✅"

**Expected Result**: ✅ Event management works correctly

---

### Test 5: Admin Dashboard

**Objective**: Verify dashboard statistics

**Steps**:

1. **Navigate to Admin Dashboard**
   - Click "📊 Dashboard" in navbar (admin only)
2. **Verify statistics display**
   - Total Events: Shows count
   - Total Bookings: Shows count
   - Total Users: Shows count
   - Total Revenue: Shows formatted currency
3. **Create new event**
   - Check dashboard (should increment Total Events)
4. **Create new bookings** (from regular user account)
   - Check dashboard (should increment Total Bookings)
5. **Verify loading states**
   - Stats should load with "Loading stats..." message
   - Should complete quickly

**Expected Result**: ✅ Dashboard displays correct stats

---

### Test 6: Navbar Functionality

**Objective**: Verify navbar shows correct content for admin vs user

**Steps**:

#### Test 6a: Admin Navbar
1. **Login as admin**
   - Navbar should show:
     - 🏠 Home button
     - 📖 My Bookings button
     - 📊 Dashboard button (orange)
     - ➕ Create Event button (green)
     - ⚙️ Manage Events button (blue)
     - 🚪 Logout button (red)
   - Admin badge visible next to email

#### Test 6b: User Navbar
1. **Login as regular user**
   - Navbar should show:
     - 🏠 Home button
     - 📖 My Bookings button
     - 🚪 Logout button (red)
   - NO admin buttons visible
   - NO admin badge

#### Test 6c: Navigation Tests
1. **Click all buttons**
   - Each button navigates to correct page
   - No errors in console
2. **Check responsive design**
   - On mobile: Buttons wrap nicely
   - No overflow or cut-off content

**Expected Result**: ✅ Navbar shows correct features for each role

---

### Test 7: Error Handling

**Objective**: Verify error handling across features

**Steps**:

#### Test 7a: Network Errors
1. **Create event, then disconnect network**
   - Expected: Error message appears
   - Same for image upload
2. **Reconnect network**
   - Retry functionality works
3. **Try on slow internet**
   - Loading states visible
   - User feedback present

#### Test 7b: API Errors
1. **Try creating duplicate event** (same test data)
   - Should either create or reject appropriately
2. **Delete non-existent event** (modify request)
   - Error message appears
3. **Upload image to deleted event**
   - Error: Event not found

#### Test 7c: Form Errors
1. **Submit form with validation errors**
   - Error messages appear inline
   - Form doesn't submit
2. **Fix errors one by one**
   - Error messages disappear as you fix
3. **Multiple errors**
   - All shown simultaneously
   - Clear which fields have issues

**Expected Result**: ✅ Error handling is robust

---

### Test 8: Performance Testing

**Objective**: Verify application performs well

**Steps**:

#### Test 8a: Page Load Time
1. **Open Create Event page**
   - Should load in < 2 seconds
2. **Open Manage Events page**
   - Should load in < 3 seconds
3. **Upload image**
   - Should complete in < 10 seconds
4. **Delete event**
   - Should complete in < 2 seconds

#### Test 8b: Large Data Sets
1. **Create 50+ events** (if time permits)
   - Pagination should work smoothly
   - No UI lag
2. **Navigate through pages**
   - Smooth transitions
   - No delays
3. **Search/filter** (if implemented)
   - Results appear quickly

#### Test 8c: Browser DevTools Check
1. **Open DevTools (F12)**
2. **Go to Network tab**
   - Check request/response sizes
   - Image uploads should be < 5MB
3. **Go to Performance tab**
   - Load time: < 3 seconds
   - No long tasks (> 50ms)
4. **Go to Console**
   - No errors
   - No warnings related to app

**Expected Result**: ✅ Performance is acceptable

---

### Test 9: Cross-Browser Testing

**Objective**: Verify app works on different browsers

**Test Browsers**:
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (if on Mac)
- [ ] Edge (if on Windows)

**Test Points** (on each browser):
1. ✅ Login/Register works
2. ✅ Event creation form displays correctly
3. ✅ Image upload works
4. ✅ Event list displays properly
5. ✅ No CSS issues
6. ✅ All buttons clickable
7. ✅ No console errors

**Expected Result**: ✅ Works consistently across browsers

---

### Test 10: Mobile Responsiveness

**Objective**: Verify mobile experience

**Steps**:

1. **Test on Mobile Device** (or use DevTools)
   - Chrome DevTools: Ctrl+Shift+M
2. **Create Event Page**
   - Form fields display vertically
   - Buttons are touch-friendly (large)
   - No horizontal scroll
3. **Manage Events Page**
   - Table is scrollable
   - Text is readable
   - Delete button is clickable
4. **Navigation**
   - Navbar wraps properly
   - All buttons accessible
5. **Image Upload**
   - Upload area touch-friendly
   - Preview visible
6. **Touch Input**
   - Date picker works
   - Dropdowns work (if any)

**Expected Result**: ✅ Mobile experience is good

---

## 📊 Test Summary Template

Copy and use this template to document your testing:

```
Date: ______________________
Tester: ______________________
Browser: ______________________

Test Results:
- [ ] Admin Access Control: PASS / FAIL
- [ ] Form Validation: PASS / FAIL
- [ ] Image Upload: PASS / FAIL
- [ ] Event Management: PASS / FAIL
- [ ] Dashboard: PASS / FAIL
- [ ] Navbar: PASS / FAIL
- [ ] Error Handling: PASS / FAIL
- [ ] Performance: PASS / FAIL
- [ ] Cross-Browser: PASS / FAIL
- [ ] Mobile: PASS / FAIL

Issues Found:
1. ____________________________
2. ____________________________
3. ____________________________

Overall Status: ✅ PASS / ❌ FAIL
```

---

## 🐛 Debugging Tips

### Browser Console Issues
```
Press F12 → Console tab
Look for red errors
Check network requests
```

### API Request Issues
**Check in DevTools → Network tab**:
1. Request URL is correct
2. Method is correct (POST/GET/DELETE)
3. Headers include Authorization
4. Response status (200/400/401/403/500)
5. Response body shows error details

### Image Upload Issues
**Check**:
1. `/uploads` directory exists
2. Directory has write permissions
3. File size is < 5MB
4. File type is image/*
5. Backend logs for errors

### Admin Access Issues
**Check localStorage**:
```javascript
localStorage.getItem('token')      // Should exist
localStorage.getItem('role')       // Should be 'ADMIN'
localStorage.getItem('userEmail')  // Should be email
```

---

## 📈 Performance Benchmarks

| Operation | Target | Acceptable |
|-----------|--------|-----------|
| Event Creation | < 1s | < 2s |
| Image Upload | < 5s | < 10s |
| Event Deletion | < 500ms | < 1s |
| Page Load (Create Event) | < 1s | < 2s |
| Page Load (Manage Events) | < 2s | < 3s |
| Pagination | < 500ms | < 1s |

---

## ✅ Sign-Off Checklist

- [ ] All tests passed
- [ ] No console errors
- [ ] No critical issues
- [ ] Performance acceptable
- [ ] Mobile friendly
- [ ] Cross-browser compatible
- [ ] Error messages clear
- [ ] User feedback present
- [ ] Documentation complete
- [ ] Ready for production

---

**Test Date**: _______________
**Tester Name**: _______________
**Status**: ✅ READY FOR DEPLOYMENT / ❌ NEEDS FIXES

---

For detailed feature documentation, see [ADMIN_GUIDE.md](./ADMIN_GUIDE.md)
