import { useState } from "react"
import api from "../api/axios"
import { useNavigate, Link } from "react-router-dom"

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const response = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      })

      const { token, role, name } = response.data
      localStorage.setItem("token", token)
      localStorage.setItem("role", role)
      localStorage.setItem("userEmail", formData.email)
      localStorage.setItem("userName", name)

      alert("Registration Successful ✅")
      navigate("/")
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed"
      setError(errorMessage)
      alert(errorMessage + " ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2070&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative"
      }}
    >
      {/* Dark Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.55)"
        }}
      ></div>

      {/* Register Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(12px)",
          padding: "30px",
          borderRadius: "18px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          position: "relative",
          zIndex: 1,
          border: "1px solid rgba(255,255,255,0.2)"
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "25px",
            color: "#fff",
            fontSize: "30px"
          }}
        >
          Registration 🎟️
        </h2>

        {error && (
          <p
            style={{
              color: "#ffb3b3",
              textAlign: "center",
              marginBottom: "15px"
            }}
          >
            {error}
          </p>
        )}

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "18px" }}>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "22px" }}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "10px",
              background: "#2563eb",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.3s"
            }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
            color: "#fff"
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#93c5fd",
              textDecoration: "none",
              fontWeight: "bold"
            }}
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.3)",
  background: "rgba(255,255,255,0.15)",
  color: "#fff",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box"
}

export default Register