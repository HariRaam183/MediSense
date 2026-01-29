import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function MedicalForm() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [duration, setDuration] = useState("");
  const [issues, setIssues] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
      return;
    }
    try {
      const userData = JSON.parse(stored);
      if (userData && userData.email) {
        setUser(userData);
        setAge(userData.age || "");
        setGender(userData.gender || "");
      } else {
        localStorage.removeItem("user");
        navigate("/login");
      }
    } catch (e) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const submit = async () => {
    if (!issues.trim()) {
      alert("Please describe your symptoms");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/predict_text", {
        age,
        gender,
        duration,
        text: issues
      });
      setResult(res.data);
      
      // Save to history if prediction was successful
      if (res.data.confidence > 0 && user) {
        await axios.post("http://127.0.0.1:5000/history/add", {
          email: user.email,
          symptoms_text: issues,
          symptoms_detected: res.data.symptoms_detected,
          disease: res.data.disease,
          confidence: res.data.confidence,
          urgency: res.data.urgency,
          possible_conditions: res.data.possible_conditions || [],
          age: age,
          duration: duration
        });
      }
    } catch (error) {
      alert("Error connecting to server");
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={{minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Segoe UI', Arial, sans-serif"}}>
      {/* Header */}
      <nav style={{
        background: "white",
        padding: "15px 50px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 15px rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <Link to="/" style={{textDecoration: "none", display: "flex", alignItems: "center", gap: "10px"}}>
          <span style={{fontSize: "28px"}}>🩺</span>
          <span style={{fontSize: "22px", fontWeight: "bold", color: "#2d3748"}}>MediSense</span>
        </Link>
        <div style={{display: "flex", gap: "12px", alignItems: "center"}}>
          {user && <span style={{color: "#64748b", marginRight: "5px"}}>Hi, <strong>{user.name}</strong></span>}
          <Link to="/history">
            <button style={{
              padding: "10px 20px",
              background: "transparent",
              color: "#2d3748",
              border: "2px solid #e2e8f0",
              borderRadius: "25px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px"
            }}>📋 History</button>
          </Link>
          <Link to="/">
            <button style={{
              padding: "10px 20px",
              background: "transparent",
              color: "#2d3748",
              border: "2px solid #e2e8f0",
              borderRadius: "25px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px"
            }}>🏠 Home</button>
          </Link>
          <button onClick={logout} style={{
            padding: "10px 20px",
            background: "#f1f5f9",
            color: "#64748b",
            border: "none",
            borderRadius: "25px",
            cursor: "pointer",
            fontSize: "14px"
          }}>Logout</button>
        </div>
      </nav>

      <div style={{padding:"40px", maxWidth:"700px", margin:"auto"}}>
        <div style={{background: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.08)"}}>
          <h2 style={{color:"#2d3748", marginTop: 0, marginBottom: "10px", textAlign: "center", fontSize: "28px"}}>
            📝 Describe Your Symptoms
          </h2>
          <p style={{textAlign: "center", color: "#64748b", marginBottom: "30px"}}>Tell us how you're feeling in your own words</p>

          <div style={{display: "flex", gap: "20px", marginBottom: "20px"}}>
            <div style={{flex: 1}}>
              <label style={{display: "block", marginBottom: "5px", color: "#555", fontWeight: "bold"}}>Age</label>
              <input 
                type="number" 
                value={age}
                style={{width: "100%", padding:"12px", borderRadius: "8px", border: "1px solid #ddd", boxSizing: "border-box"}} 
                onChange={e=>setAge(e.target.value)} 
              />
            </div>
            <div style={{flex: 1}}>
              <label style={{display: "block", marginBottom: "5px", color: "#555", fontWeight: "bold"}}>Gender</label>
              <select 
                value={gender}
                style={{width: "100%", padding:"12px", borderRadius: "8px", border: "1px solid #ddd", boxSizing: "border-box"}} 
                onChange={e=>setGender(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style={{flex: 1}}>
              <label style={{display: "block", marginBottom: "5px", color: "#555", fontWeight: "bold"}}>Duration (days)</label>
              <input 
                type="number" 
                value={duration}
                style={{width: "100%", padding:"12px", borderRadius: "8px", border: "1px solid #ddd", boxSizing: "border-box"}} 
                onChange={e=>setDuration(e.target.value)} 
              />
            </div>
          </div>

          <div style={{marginBottom: "20px"}}>
            <label style={{display: "block", marginBottom: "5px", color: "#555", fontWeight: "bold"}}>Describe your health issues *</label>
            <textarea 
              rows="4" 
              value={issues}
              style={{width:"100%", padding:"12px", fontSize:"16px", borderRadius: "8px", border: "1px solid #ddd", boxSizing: "border-box", resize: "vertical"}}
              placeholder="Example: I have fever, headache, stomach pain, vomiting..."
              onChange={e=>setIssues(e.target.value)}
            ></textarea>
          </div>

          <button 
            onClick={submit} 
            disabled={loading}
            style={{
              width: "100%",
              padding:"14px 30px", 
              fontSize:"16px", 
              background: "#4CAF50",
              color:"white", 
              border:"none", 
              borderRadius:"8px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "🔍 Analyzing..." : "🔍 Check Symptoms"}
          </button>
        </div>

        {result && result.confidence > 0 && (
        <div style={{
          marginTop:"25px", 
          background: "white",
          borderRadius:"15px",
          padding:"25px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{color:"#2c3e50", marginTop: 0, marginBottom:"20px", textAlign: "center"}}>🔍 Analysis Result</h2>
          
          <div style={{background: "#f8f9fa", padding:"20px", borderRadius:"10px", marginBottom:"15px", textAlign: "center"}}>
            <p style={{margin:"0 0 5px", color:"#666", fontSize: "14px"}}>Most Likely Condition:</p>
            <h2 style={{fontSize:"28px", fontWeight:"bold", color:"#e74c3c", margin:"10px 0"}}>{result.disease}</h2>
            <p style={{margin:"0", color:"#667eea", fontSize: "18px", fontWeight: "bold"}}>{result.confidence}% Confidence</p>
          </div>

          {result.possible_conditions && result.possible_conditions.length > 0 && (
            <div style={{background: "#f8f9fa", padding:"15px", borderRadius:"10px", marginBottom:"15px"}}>
              <h4 style={{margin:"0 0 10px 0", color:"#2c3e50"}}>Other Possible Conditions:</h4>
              <ul style={{margin:"0", paddingLeft:"20px"}}>
                {result.possible_conditions.map((condition, idx) => (
                  <li key={idx} style={{color:"#666", marginBottom:"5px"}}>{condition}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{
            backgroundColor: result.urgency === "High" ? "#ffebee" : result.urgency === "Medium" ? "#fff3e0" : "#e8f5e9",
            padding:"15px", 
            borderRadius:"10px",
            marginBottom:"15px",
            textAlign: "center"
          }}>
            <h3 style={{margin:"0"}}>
              <span style={{
                color: result.urgency === "High" ? "#c62828" : result.urgency === "Medium" ? "#ef6c00" : "#2e7d32"
              }}>
                {result.urgency === "High" ? "⚠️ High Urgency" : result.urgency === "Medium" ? "⚡ Medium Urgency" : "✅ Low Urgency"}
              </span>
            </h3>
          </div>
          
          {result.symptoms_detected && result.symptoms_detected.length > 0 && (
            <p style={{color:"#555", background: "#f8f9fa", padding: "12px", borderRadius: "8px", margin: "15px 0"}}>
              <strong>Symptoms Identified:</strong> {result.symptoms_detected.map(s => s.replace(/_/g, " ")).join(", ")}
            </p>
          )}

          {result.urgency === "High" && (
            <div style={{backgroundColor:"#c62828", color:"white", padding:"15px", borderRadius:"10px", textAlign:"center"}}>
              <h3 style={{margin:"0"}}>⚠️ Please consult a doctor immediately!</h3>
            </div>
          )}

          <div style={{background: "#e3f2fd", padding: "12px", borderRadius: "8px", marginTop: "15px", textAlign: "center"}}>
            <p style={{margin: 0, color: "#1565c0", fontSize: "14px"}}>
              ✅ This check has been saved to your history
            </p>
          </div>

          <p style={{fontSize:"12px", color:"#999", marginTop:"15px", textAlign: "center"}}>
            ⚕️ Disclaimer: This is an AI-based prediction. Please consult a healthcare professional for accurate diagnosis.
          </p>
        </div>
        )}

        {result && result.confidence === 0 && (
          <div style={{marginTop:"25px", padding:"20px", backgroundColor:"#fff3cd", borderRadius:"10px"}}>
            <p style={{margin:"0", color:"#856404", textAlign: "center"}}>{result.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicalForm;