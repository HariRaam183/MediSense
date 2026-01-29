import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const res = await axios.post("http://127.0.0.1:5000/login", {
        email,
        password
      });
      
      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/health");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', Arial, sans-serif",
      padding: "20px"
    }}>
      <div style={{
        background: "white",
        padding: "50px 40px",
        borderRadius: "20px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
        width: "100%",
        maxWidth: "420px"
      }}>
        <div style={{textAlign: "center", marginBottom: "30px"}}>
          <span style={{fontSize: "40px"}}>🩺</span>
          <h2 style={{color: "#2d3748", margin: "15px 0 5px", fontSize: "28px"}}>Welcome Back!</h2>
          <p style={{color: "#64748b", margin: 0}}>Login to access your health dashboard</p>
        </div>
        
        {error && (
          <div style={{
            background: "#ffebee",
            color: "#c62828",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "20px",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}
        
        <div style={{marginBottom: "20px"}}>
          <label style={{display: "block", marginBottom: "5px", color: "#555"}}>Email</label>
          <input 
            type="email"
            placeholder="Enter your email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          />
        </div>
        
        <div style={{marginBottom: "25px"}}>
          <label style={{display: "block", marginBottom: "5px", color: "#555"}}>Password</label>
          <input 
            type="password" 
            placeholder="Enter your password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          />
        </div>
        
        <button 
          onClick={login}
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
          }}
        >
          {loading ? "Logging in..." : "Login to MediSense"}
        </button>
        
        <p style={{textAlign: "center", marginTop: "25px", color: "#64748b"}}>
          Don't have an account? <Link to="/signup" style={{color: "#667eea", textDecoration: "none", fontWeight: "bold"}}>Sign Up Free</Link>
        </p>
        
        <p style={{textAlign: "center", marginTop: "15px"}}>
          <Link to="/" style={{color: "#94a3b8", textDecoration: "none", fontSize: "14px"}}>← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
