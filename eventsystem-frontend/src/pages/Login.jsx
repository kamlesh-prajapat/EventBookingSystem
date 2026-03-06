import { useState } from "react"
import api from "../api/axios"
import { useNavigate } from "react-router-dom"
import "./Auth.css"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await api.post("/auth/login", {
        email,
        password
      })

      const { token, role, name } = response.data
      localStorage.setItem("token", token)
      localStorage.setItem("role", role)
      localStorage.setItem("userEmail", email)
      localStorage.setItem("userName", name)

      alert("Login Successful ✅")
      navigate("/")
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Invalid credentials"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <span className="auth-icon">🔐</span>
          <h1>Welcome Back</h1>
          <p>Login to your Event Booking account</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">📧 Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">🔑 Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? (
              <><span className="spinner" style={{ width: '16px', height: '16px' }}></span> Logging in...</>
            ) : (
              '🚀 Login'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <a href="/register" className="auth-link">Register here</a>
          </p>
        </div>
      </div>

      <div className="auth-background"></div>
    </div>
  )
}

export default Login