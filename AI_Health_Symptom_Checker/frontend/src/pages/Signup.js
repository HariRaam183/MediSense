import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";


function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signup = async () => {
    if (!name || !email || !password) {
      setError("Please fill in all required fields");
      return;
    }
    if (!gender) {
      setError("Please select gender");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("https://medisense-zpu2.onrender.com/signup", {
        name,
        email,
        password,
        age: age ? Number(age) : null,
        gender
      });
      console.log("Signup Response:", res.data);
      if (res.data.success) {
        alert("Account created successfully!");
        navigate("/login");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setError(err.response?.data?.message || err.message || "Signup failed");
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
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
        width: "100%",
        maxWidth: "480px"
      }}>
        <div style={{textAlign: "center", marginBottom: "25px"}}>
          <span style={{fontSize: "40px"}}>🩺</span>
          <h2 style={{color: "#2d3748", margin: "15px 0 5px", fontSize: "28px"}}>Join MediSense</h2>
          <p style={{color: "#64748b", margin: 0}}>Create your free account to get started</p>
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
        <form onSubmit={(e) => { e.preventDefault(); signup(); }}>
          <div style={{marginBottom: "15px"}}>
            <label style={{display: "block", marginBottom: "5px", color: "#555"}}>Full Name *</label>
            <input 
              type="text"
              placeholder="Enter your full name" 
              value={name}
              onChange={e => setName(e.target.value)}
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
          <div style={{marginBottom: "15px"}}>
            <label style={{display: "block", marginBottom: "5px", color: "#555"}}>Email *</label>
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
          <div style={{marginBottom: "15px"}}>
            <label style={{display: "block", marginBottom: "5px", color: "#555"}}>Password *</label>
            <input 
              type="password" 
              placeholder="Create a password" 
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
          <div style={{display: "flex", gap: "15px", marginBottom: "25px"}}>
            <div style={{flex: 1}}>
              <label style={{display: "block", marginBottom: "5px", color: "#555"}}>Age</label>
              <input 
                type="number"
                placeholder="Age" 
                value={age}
                onChange={e => setAge(e.target.value)}
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
            <div style={{flex: 1}}>
              <label style={{display: "block", marginBottom: "5px", color: "#555"}}>Gender</label>
              <select 
                value={gender}
                onChange={e => setGender(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box"
                }}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <button 
            type="submit"
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
            {loading ? "Creating Account..." : "Create Free Account"}
          </button>
        </form>
        <p style={{textAlign: "center", marginTop: "25px", color: "#64748b"}}>
          Already have an account? <Link to="/login" style={{color: "#667eea", textDecoration: "none", fontWeight: "bold"}}>Login</Link>
        </p>
        <p style={{textAlign: "center", marginTop: "15px"}}>
          <Link to="/" style={{color: "#94a3b8", textDecoration: "none", fontSize: "14px"}}>← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
