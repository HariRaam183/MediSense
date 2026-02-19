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
      background: "linear-gradient(135deg, #E3F2FD 0%, #E8F5E9 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', Arial, sans-serif",
      padding: "20px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Animated floating medical icons background */}
      <style>{`
        @keyframes float-signup {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .medical-icon-signup {
          position: absolute;
          font-size: 40px;
          opacity: 0.15;
          animation: float-signup 6s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>
      
      <span className="medical-icon-signup" style={{top: "8%", left: "12%", animationDelay: "0s"}}>💊</span>
      <span className="medical-icon-signup" style={{top: "25%", right: "10%", animationDelay: "1s"}}>🩺</span>
      <span className="medical-icon-signup" style={{bottom: "20%", left: "18%", animationDelay: "2s"}}>❤️</span>
      <span className="medical-icon-signup" style={{top: "55%", right: "15%", animationDelay: "3s"}}>🏥</span>
      <span className="medical-icon-signup" style={{bottom: "25%", right: "22%", animationDelay: "1.5s"}}>💉</span>
      <span className="medical-icon-signup" style={{top: "45%", left: "15%", animationDelay: "2.5s"}}>🧬</span>

      <div className="auth-card" style={{
        background: "white",
        padding: "50px 45px",
        borderRadius: "25px",
        boxShadow: "0 30px 70px rgba(2, 136, 209, 0.15)",
        width: "100%",
        maxWidth: "500px",
        position: "relative",
        zIndex: 1,
        border: "1px solid rgba(2, 136, 209, 0.1)"
      }}>
        <div style={{textAlign: "center", marginBottom: "35px"}}>
          <div className="auth-icon-container" style={{
            background: "linear-gradient(135deg, #0288D1, #26C6DA)",
            padding: "18px",
            borderRadius: "20px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            boxShadow: "0 8px 20px rgba(2, 136, 209, 0.25)"
          }}>
            <span style={{fontSize: "45px"}}>🩺</span>
          </div>
          <h2 style={{
            background: "linear-gradient(135deg, #0288D1, #26C6DA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 0 10px",
            fontSize: "32px",
            fontWeight: "800"
          }}>Join MediSense</h2>
          <p style={{color: "#546E7A", margin: 0, fontSize: "15px"}}>Create your free account to get started</p>
        </div>
        {error && (
          <div style={{
            background: "linear-gradient(135deg, #ffebee, #ffcdd2)",
            color: "#c62828",
            padding: "14px 18px",
            borderRadius: "12px",
            marginBottom: "25px",
            textAlign: "center",
            fontSize: "14px",
            fontWeight: "600",
            border: "1px solid rgba(198, 40, 40, 0.2)"
          }}>
            ⚠️ {error}
          </div>
        )}
        <form onSubmit={(e) => { e.preventDefault(); signup(); }}>
          <div style={{marginBottom: "20px"}}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#263238",
              fontWeight: "600",
              fontSize: "14px"
            }}>👤 Full Name *</label>
            <input 
              type="text"
              placeholder="Enter your full name" 
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "15px 18px",
                border: "2px solid #E3F2FD",
                borderRadius: "12px",
                fontSize: "16px",
                boxSizing: "border-box",
                transition: "all 0.3s ease",
                outline: "none",
                background: "#F9FAFB"
              }}
              onFocus={(e) => e.target.style.borderColor = "#0288D1"}
              onBlur={(e) => e.target.style.borderColor = "#E3F2FD"}
            />
          </div>
          <div style={{marginBottom: "20px"}}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#263238",
              fontWeight: "600",
              fontSize: "14px"
            }}>📧 Email *</label>
            <input 
              type="email"
              placeholder="Enter your email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "15px 18px",
                border: "2px solid #E3F2FD",
                borderRadius: "12px",
                fontSize: "16px",
                boxSizing: "border-box",
                transition: "all 0.3s ease",
                outline: "none",
                background: "#F9FAFB"
              }}
              onFocus={(e) => e.target.style.borderColor = "#0288D1"}
              onBlur={(e) => e.target.style.borderColor = "#E3F2FD"}
            />
          </div>
          <div style={{marginBottom: "20px"}}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#263238",
              fontWeight: "600",
              fontSize: "14px"
            }}>🔒 Password *</label>
            <input 
              type="password" 
              placeholder="Create a password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "15px 18px",
                border: "2px solid #E3F2FD",
                borderRadius: "12px",
                fontSize: "16px",
                boxSizing: "border-box",
                transition: "all 0.3s ease",
                outline: "none",
                background: "#F9FAFB"
              }}
              onFocus={(e) => e.target.style.borderColor = "#0288D1"}
              onBlur={(e) => e.target.style.borderColor = "#E3F2FD"}
            />
          </div>
          <div className="form-row" style={{display: "flex", gap: "15px", marginBottom: "30px"}}>
            <div style={{flex: 1}}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                color: "#263238",
                fontWeight: "600",
                fontSize: "14px"
              }}>🎂 Age</label>
              <input 
                type="number"
                placeholder="Age" 
                value={age}
                onChange={e => setAge(e.target.value)}
                style={{
                  width: "100%",
                  padding: "15px 18px",
                  border: "2px solid #E3F2FD",
                  borderRadius: "12px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                  transition: "all 0.3s ease",
                  outline: "none",
                  background: "#F9FAFB"
                }}
                onFocus={(e) => e.target.style.borderColor = "#0288D1"}
                onBlur={(e) => e.target.style.borderColor = "#E3F2FD"}
              />
            </div>
            <div style={{flex: 1}}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                color: "#263238",
                fontWeight: "600",
                fontSize: "14px"
              }}>⚧️ Gender</label>
              <select 
                value={gender}
                onChange={e => setGender(e.target.value)}
                style={{
                  width: "100%",
                  padding: "15px 18px",
                  border: "2px solid #E3F2FD",
                  borderRadius: "12px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                  transition: "all 0.3s ease",
                  outline: "none",
                  background: "#F9FAFB"
                }}
                onFocus={(e) => e.target.style.borderColor = "#0288D1"}
                onBlur={(e) => e.target.style.borderColor = "#E3F2FD"}
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
              padding: "18px",
              background: loading ? "#B0BEC5" : "linear-gradient(135deg, #0288D1 0%, #26C6DA 100%)",
              color: "white",
              border: "none",
              borderRadius: "14px",
              fontSize: "17px",
              fontWeight: "800",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 8px 25px rgba(2, 136, 209, 0.3)",
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => !loading && (e.target.style.transform = "translateY(-2px)")}
            onMouseOut={(e) => !loading && (e.target.style.transform = "translateY(0)")}
          >
            {loading ? "🔄 Creating Account..." : "Create Free Account →"}
          </button>
        </form>
        <p style={{textAlign: "center", marginTop: "30px", color: "#546E7A", fontSize: "15px"}}>
          Already have an account? <Link to="/login" style={{
            color: "#0288D1",
            textDecoration: "none",
            fontWeight: "700",
            borderBottom: "2px solid transparent",
            transition: "border-color 0.3s"
          }} onMouseOver={(e) => e.target.style.borderBottomColor = "#0288D1"} onMouseOut={(e) => e.target.style.borderBottomColor = "transparent"}>Login</Link>
        </p>
        <p style={{textAlign: "center", marginTop: "18px"}}>
          <Link to="/" style={{
            color: "#78909C",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "600"
          }}>← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
