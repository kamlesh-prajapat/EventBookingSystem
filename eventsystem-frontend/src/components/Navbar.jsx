import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useTheme } from "../context/ThemeContext"
import "./Navbar.css"

function Navbar() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const token = localStorage.getItem("token")
  const userEmail = localStorage.getItem("userEmail")
  const userRole = localStorage.getItem("role")
  const isAdmin = userRole === "ADMIN"
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("userEmail")
    setMobileMenuOpen(false)
    navigate("/login")
  }

  const handleNavigate = (path) => {
    navigate(path)
    setMobileMenuOpen(false)
  }

  if (!token) {
    return null
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo" onClick={() => handleNavigate("/")}>
          <span className="logo-icon">📅</span>
          <span className="logo-text">Event Booking</span>
        </div>

        {/* User Info - Desktop */}
        <div className="navbar-user-info">
          <span className="user-email">👤 {userEmail}</span>
          {isAdmin && <span className="admin-badge">ADMIN</span>}
        </div>

        {/* Hamburger Menu Button */}
        <button
          className={`hamburger ${mobileMenuOpen ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Nav Links */}
        <div className={`navbar-links ${mobileMenuOpen ? "mobile-active" : ""}`}>
          <button 
            className="nav-link" 
            onClick={() => handleNavigate("/")}
          >
            🏠 Home
          </button>
          
          <button 
            className="nav-link" 
            onClick={() => handleNavigate("/my-bookings")}
          >
            📖 My Bookings
          </button>

          {isAdmin && (
            <>
              <button 
                className="nav-link nav-link-admin" 
                onClick={() => handleNavigate("/admin")}
              >
                📊 Dashboard
              </button>
              
              <button 
                className="nav-link nav-link-success" 
                onClick={() => handleNavigate("/create-event")}
              >
                ➕ Create Event
              </button>
              
              <button 
                className="nav-link nav-link-primary" 
                onClick={() => handleNavigate("/manage-events")}
              >
                ⚙️ Manage Events
              </button>
            </>
          )}

          {/* Theme Toggle */}
          <button
            className="nav-link nav-link-theme"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>

          {/* Logout */}
          <button 
            className="nav-link nav-link-logout" 
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar