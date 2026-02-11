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
      const res = await axios.post("http://localhost:10000/predict_text", {
        age,
        gender,
        duration,
        text: issues
      });
      setResult(res.data);
      
      // Save to history if prediction was successful
      if (res.data.success && res.data.predictions && res.data.predictions.length > 0 && user) {
        await axios.post("http://localhost:10000/history/add", {
          email: user.email,
          symptoms_text: issues,
          symptoms_detected: res.data.symptoms_detected,
          disease: res.data.primary_disease,
          confidence: res.data.primary_confidence,
          urgency: res.data.urgency,
          possible_conditions: res.data.predictions.slice(1).map(p => p.disease) || [],
          age: age,
          duration: duration
        });
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error connecting to server");
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={{minHeight: "100vh", background: "linear-gradient(135deg, #E3F2FD 0%, #E8F5E9 100%)", fontFamily: "'Segoe UI', Arial, sans-serif"}}>
      <style>{`
        @keyframes pulse-form { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
      `}</style>
      {/* Header */}
      <nav style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        padding: "15px 50px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 20px rgba(2, 136, 209, 0.08)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "2px solid rgba(2, 136, 209, 0.1)"
      }}>
        <Link to="/" style={{textDecoration: "none", display: "flex", alignItems: "center", gap: "12px"}}>
          <div style={{
            background: "linear-gradient(135deg, #0288D1, #26C6DA)",
            padding: "8px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(2, 136, 209, 0.3)"
          }}>
            <span style={{fontSize: "24px"}}>🩺</span>
          </div>
          <span style={{fontSize: "22px", fontWeight: "800", background: "linear-gradient(135deg, #0288D1, #26C6DA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>MediSense</span>
        </Link>
        <div style={{display: "flex", gap: "12px", alignItems: "center"}}>
          {user && <span style={{color: "#546E7A", marginRight: "5px", fontWeight: "500"}}>Hi, <strong style={{color: "#0288D1"}}>{user.name}</strong></span>}
          <Link to="/history">
            <button style={{
              padding: "10px 22px",
              background: "transparent",
              color: "#0288D1",
              border: "2px solid rgba(2, 136, 209, 0.2)",
              borderRadius: "25px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "14px",
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => { e.target.style.background = '#E3F2FD'; e.target.style.borderColor = '#0288D1'; }}
            onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(2, 136, 209, 0.2)'; }}
            >📋 History</button>
          </Link>
          <Link to="/">
            <button style={{
              padding: "10px 22px",
              background: "transparent",
              color: "#0288D1",
              border: "2px solid rgba(2, 136, 209, 0.2)",
              borderRadius: "25px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "14px",
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => { e.target.style.background = '#E3F2FD'; e.target.style.borderColor = '#0288D1'; }}
            onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(2, 136, 209, 0.2)'; }}
            >🏠 Home</button>
          </Link>
          <button onClick={logout} style={{
            padding: "10px 22px",
            background: "linear-gradient(135deg, #EF5350, #E53935)",
            color: "white",
            border: "none",
            borderRadius: "25px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "700",
            boxShadow: "0 4px 12px rgba(239, 83, 80, 0.3)",
            transition: "all 0.3s ease"
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >🚪 Logout</button>
        </div>
      </nav>

      <div style={{padding:"40px", maxWidth:"750px", margin:"auto"}}>
        <div style={{background: "white", padding: "45px", borderRadius: "25px", boxShadow: "0 15px 50px rgba(2, 136, 209, 0.1)", border: "1px solid rgba(2, 136, 209, 0.08)"}}>
          <h2 style={{
            background: "linear-gradient(135deg, #0288D1, #26C6DA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginTop: 0, marginBottom: "10px", textAlign: "center", fontSize: "30px", fontWeight: "800"
          }}>
            📝 Describe Your Symptoms
          </h2>
          <p style={{textAlign: "center", color: "#546E7A", marginBottom: "35px", fontSize: "15px"}}>Tell us how you're feeling in your own words</p>

          <div style={{display: "flex", gap: "20px", marginBottom: "22px"}}>
            <div style={{flex: 1}}>
              <label style={{display: "block", marginBottom: "8px", color: "#263238", fontWeight: "700", fontSize: "14px"}}>🎂 Age</label>
              <input 
                type="number" 
                value={age}
                style={{width: "100%", padding:"15px 18px", borderRadius: "12px", border: "2px solid #E3F2FD", boxSizing: "border-box", fontSize: "16px", outline: "none", transition: "all 0.3s", background: "#F9FAFB"}} 
                onChange={e=>setAge(e.target.value)} 
                onFocus={(e) => e.target.style.borderColor = "#0288D1"}
                onBlur={(e) => e.target.style.borderColor = "#E3F2FD"}
              />
            </div>
            <div style={{flex: 1}}>
              <label style={{display: "block", marginBottom: "8px", color: "#263238", fontWeight: "700", fontSize: "14px"}}>⚧️ Gender</label>
              <select 
                value={gender}
                style={{width: "100%", padding:"15px 18px", borderRadius: "12px", border: "2px solid #E3F2FD", boxSizing: "border-box", fontSize: "16px", outline: "none", transition: "all 0.3s", background: "#F9FAFB"}} 
                onChange={e=>setGender(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = "#0288D1"}
                onBlur={(e) => e.target.style.borderColor = "#E3F2FD"}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style={{flex: 1}}>
              <label style={{display: "block", marginBottom: "8px", color: "#263238", fontWeight: "700", fontSize: "14px"}}>⏰ Duration (days)</label>
              <input 
                type="number" 
                value={duration}
                style={{width: "100%", padding:"15px 18px", borderRadius: "12px", border: "2px solid #E3F2FD", boxSizing: "border-box", fontSize: "16px", outline: "none", transition: "all 0.3s", background: "#F9FAFB"}} 
                onChange={e=>setDuration(e.target.value)} 
                onFocus={(e) => e.target.style.borderColor = "#0288D1"}
                onBlur={(e) => e.target.style.borderColor = "#E3F2FD"}
              />
            </div>
          </div>

          <div style={{marginBottom: "25px"}}>
            <label style={{display: "block", marginBottom: "8px", color: "#263238", fontWeight: "700", fontSize: "14px"}}>🦠 Describe your health issues *</label>
            <textarea 
              rows="4" 
              value={issues}
              style={{width:"100%", padding:"15px 18px", fontSize:"16px", borderRadius: "12px", border: "2px solid #E3F2FD", boxSizing: "border-box", resize: "vertical", outline: "none", transition: "all 0.3s", background: "#F9FAFB", fontFamily: "inherit"}}
              placeholder="Example: I have fever, headache, stomach pain, vomiting..."
              onChange={e=>setIssues(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = "#0288D1"}
              onBlur={(e) => e.target.style.borderColor = "#E3F2FD"}
            ></textarea>
          </div>

          <button 
            onClick={submit} 
            disabled={loading}
            style={{
              width: "100%",
              padding:"18px 30px", 
              fontSize:"17px", 
              background: loading ? "#B0BEC5" : "linear-gradient(135deg, #0288D1 0%, #26C6DA 100%)",
              color:"white", 
              border:"none", 
              borderRadius:"14px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "800",
              boxShadow: loading ? "none" : "0 8px 25px rgba(2, 136, 209, 0.3)",
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => !loading && (e.target.style.transform = "translateY(-2px)")}
            onMouseOut={(e) => !loading && (e.target.style.transform = "translateY(0)")}
          >
            {loading ? "🔄 Analyzing Symptoms..." : "🔍 Check Symptoms"}
          </button>
        </div>

        {result && result.success && result.predictions && result.predictions.length > 0 && (
        <div style={{
          marginTop:"30px", 
          background: "white",
          borderRadius:"25px",
          padding:"40px",
          boxShadow: "0 15px 50px rgba(2, 136, 209, 0.1)",
          border: "1px solid rgba(2, 136, 209, 0.08)"
        }}>
          <h2 style={{
            background: "linear-gradient(135deg, #0288D1, #66BB6A)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginTop: 0,
            marginBottom:"30px",
            textAlign: "center",
            fontSize: "28px",
            fontWeight: "800"
          }}>
            🔍 Analysis Result
          </h2>
          
          {/* Severity Score Display */}
          <div style={{
            background: result.severity_score >= 8 ? "linear-gradient(135deg, #ffebee, #ffcdd2)" : result.severity_score >= 6 ? "linear-gradient(135deg, #fff3e0, #ffe0b2)" : "linear-gradient(135deg, #E8F5E9, #C8E6C9)",
            padding:"20px", 
            borderRadius:"16px",
            marginBottom:"25px",
            textAlign: "center",
            border: result.severity_score >= 8 ? "2px solid #EF5350" : result.severity_score >= 6 ? "2px solid #FF9800" : "2px solid #66BB6A"
          }}>
            <p style={{margin:"0 0 5px 0", fontSize: "13px", color: "#546E7A", fontWeight: "600"}}>Symptom Severity Score</p>
            <h3 style={{
              margin:"5px 0",
              fontSize: "32px",
              color: result.severity_score >= 8 ? "#EF5350" : result.severity_score >= 6 ? "#FF9800" : "#66BB6A"
            }}>
              {result.severity_score}/10
            </h3>
            <p style={{margin:"5px 0 0", fontSize:"14px", fontWeight:"700",
              color: result.severity_score >= 8 ? "#EF5350" : result.severity_score >= 6 ? "#FF9800" : "#66BB6A"
            }}>
              {result.urgency_message}
            </p>
          </div>

          {/* Top 3 Predictions */}
          <div style={{marginBottom:"25px"}}>
            <h3 style={{color:"#263238", marginBottom:"18px", fontSize:"20px", fontWeight: "700"}}>📊 Top 3 Possible Conditions:</h3>
            
            {result.predictions.map((prediction, idx) => (
              <div key={idx} style={{
                background: idx === 0 ? "linear-gradient(135deg, rgba(2, 136, 209, 0.05), rgba(38, 198, 218, 0.05))" : "white",
                border: idx === 0 ? "2px solid #0288D1" : "2px solid #E3F2FD",
                padding:"20px",
                borderRadius:"16px",
                marginBottom:"14px",
                boxShadow: idx === 0 ? "0 4px 15px rgba(2, 136, 209, 0.15)" : "0 2px 8px rgba(0,0,0,0.04)",
                transition: "all 0.3s ease"
              }}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px"}}>
                  <div style={{flex: 1}}>
                    <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
                      <span style={{
                        fontSize:"20px",
                        fontWeight:"800",
                        color: idx === 0 ? "#0288D1" : "#78909C",
                        minWidth:"25px"
                      }}>
                        #{idx + 1}
                      </span>
                      <h4 style={{
                        margin:"0",
                        fontSize: idx === 0 ? "20px" : "18px",
                        color: prediction.is_critical ? "#EF5350" : "#263238",
                        fontWeight: idx === 0 ? "bold" : "600"
                      }}>
                        {prediction.disease}
                        {prediction.is_critical && <span style={{marginLeft:"8px", fontSize:"18px"}}>⚠️</span>}
                      </h4>
                    </div>
                  </div>
                  <div style={{
                    background: idx === 0 ? "linear-gradient(135deg, #0288D1, #26C6DA)" : "#B0BEC5",
                    color:"white",
                    padding:"10px 20px",
                    borderRadius:"25px",
                    fontWeight:"800",
                    fontSize: idx === 0 ? "16px" : "14px",
                    boxShadow: idx === 0 ? "0 4px 12px rgba(2, 136, 209, 0.3)" : "none"
                  }}>
                    {prediction.confidence}%
                  </div>
                </div>
                
                {idx === 0 && (
                  <p style={{margin:"8px 0 0 35px", fontSize:"13px", color:"#0288D1", fontWeight:"700"}}>
                    ✓ Most Likely Condition
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Critical Warning */}
          {result.has_critical_symptoms && (
            <div style={{
              background:"linear-gradient(135deg, #EF5350, #E53935)", 
              color:"white", 
              padding:"20px", 
              borderRadius:"16px", 
              textAlign:"center",
              marginBottom:"25px",
              fontWeight:"bold",
              fontSize:"15px",
              boxShadow: "0 8px 20px rgba(239, 83, 80, 0.3)"
            }}>
              ⚠️ CRITICAL: You have symptoms requiring immediate medical attention. Please visit emergency care NOW!
            </div>
          )}

          {/* Urgency Level */}
          <div style={{
            background: result.urgency === "High" ? "linear-gradient(135deg, #ffebee, #ffcdd2)" : result.urgency === "Medium" ? "linear-gradient(135deg, #fff3e0, #ffe0b2)" : "linear-gradient(135deg, #E8F5E9, #C8E6C9)",
            padding:"18px", 
            borderRadius:"16px",
            marginBottom:"25px",
            textAlign: "center",
            border: `2px solid ${result.urgency === "High" ? "#EF5350" : result.urgency === "Medium" ? "#FF9800" : "#66BB6A"}`
          }}>
            <h3 style={{margin:"0", fontSize:"18px", fontWeight: "700"}}>
              <span style={{
                color: result.urgency === "High" ? "#EF5350" : result.urgency === "Medium" ? "#FF9800" : "#66BB6A"
              }}>
                {result.urgency === "High" ? "🚨 High Urgency" : result.urgency === "Medium" ? "⚡ Medium Urgency" : "✅ Low Urgency"}
              </span>
            </h3>
          </div>
          
          {/* Symptoms Detected */}
          {result.symptoms_detected && result.symptoms_detected.length > 0 && (
            <div style={{background: "linear-gradient(135deg, rgba(227, 242, 253, 0.5), rgba(232, 245, 233, 0.5))", padding: "20px", borderRadius: "16px", marginBottom: "25px", border: "1px solid rgba(2, 136, 209, 0.1)"}}>
              <p style={{margin:"0 0 12px", fontWeight:"700", color:"#263238", fontSize: "15px"}}>
                🔍 Symptoms Identified ({result.symptom_count}):
              </p>
              <div style={{display:"flex", flexWrap:"wrap", gap:"10px"}}>
                {result.symptoms_detected.map((s, idx) => (
                  <span key={idx} style={{
                    background:"white",
                    padding:"8px 16px",
                    borderRadius:"25px",
                    fontSize:"13px",
                    color:"#0288D1",
                    border:"1px solid rgba(2, 136, 209, 0.2)",
                    fontWeight: "600"
                  }}>
                    {s.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Doctor Recommendations */}
          {result.doctor_recommendations && result.doctor_recommendations.length > 0 && (
            <div style={{
              background: "linear-gradient(135deg, #0288D1 0%, #26C6DA 100%)",
              padding: "25px",
              borderRadius: "16px",
              marginBottom: "25px",
              color: "white",
              boxShadow: "0 8px 25px rgba(2, 136, 209, 0.3)"
            }}>
              <h3 style={{margin:"0 0 18px", fontSize:"19px", display:"flex", alignItems:"center", gap:"10px", fontWeight: "800"}}>
                👨‍⚕️ Recommended Specialists
              </h3>
              <div style={{display:"flex", flexDirection:"column", gap:"12px"}}>
                {result.doctor_recommendations.map((rec, idx) => (
                  <div key={idx} style={{
                    background: "rgba(255,255,255,0.15)",
                    padding: "15px 18px",
                    borderRadius: "12px",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.25)"
                  }}>
                    <div style={{fontWeight:"bold", fontSize:"15px", marginBottom:"5px"}}>
                      {rec.specialist}
                    </div>
                    <div style={{fontSize:"13px", opacity:"0.9"}}>
                      For: {rec.disease}
                    </div>
                  </div>
                ))}
              </div>
              <p style={{margin:"18px 0 0", fontSize:"13px", opacity:"0.95", fontStyle:"italic"}}>
                💡 Consult these specialists for proper diagnosis and treatment
              </p>
            </div>
          )}

          {/* Success confirmation */}
          <div style={{background: "linear-gradient(135deg, #E3F2FD, #E8F5E9)", padding: "15px", borderRadius: "12px", marginBottom: "20px", textAlign: "center", border: "1px solid rgba(2, 136, 209, 0.15)"}}>
            <p style={{margin: 0, color: "#0288D1", fontSize: "14px", fontWeight: "600"}}>
              ✅ This analysis has been saved to your history
            </p>
          </div>

          {/* Enhanced Disclaimer */}
          <div style={{
            background: "linear-gradient(135deg, #FFF8E1, #FFF3E0)",
            border: "2px solid #FFB300",
            borderRadius: "16px",
            padding: "20px",
            marginTop: "20px"
          }}>
            <p style={{margin:"0 0 12px", fontWeight:"800", color:"#E65100", fontSize:"16px"}}>
              ⚕️ IMPORTANT MEDICAL DISCLAIMER
            </p>
            <p style={{margin:"0", fontSize:"13px", color:"#795548", lineHeight:"1.8"}}>
              • This is an AI-powered analysis tool and NOT a professional medical diagnosis<br/>
              • Confidence scores are estimates based on symptom matching<br/>
              • Always consult a qualified healthcare professional for accurate diagnosis<br/>
              • If symptoms are severe or worsening, seek immediate medical attention<br/>
              • This tool should complement, not replace, professional medical advice
            </p>
          </div>
        </div>
        )}

        {result && !result.success && (
          <div style={{marginTop:"25px", padding:"20px", backgroundColor:"#fff3cd", borderRadius:"10px", border:"2px solid #ffc107"}}>
            <p style={{margin:"0", color:"#856404", textAlign: "center", fontWeight:"600"}}>
              ⚠️ {result.message}
            </p>
            {result.symptoms_detected && result.symptoms_detected.length > 0 && (
              <p style={{margin:"10px 0 0", color:"#856404", fontSize:"14px", textAlign:"center"}}>
                Detected: {result.symptoms_detected.join(", ")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicalForm;
