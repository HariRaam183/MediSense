
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
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
        fetchHistory(userData.email);
      } else {
        localStorage.removeItem("user");
        navigate("/login");
      }
    } catch (e) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const fetchHistory = async (email) => {
    try {
      const res = await axios.get(`${API}/history/${email}`);
      setHistory(res.data.history || []);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
    setLoading(false);
  };

  const clearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear all history?")) return;
    try {
      await axios.delete(`${API}/history/clear/${user.email}`);
      setHistory([]);
      alert("History cleared successfully");
    } catch (err) {
      alert("Error clearing history");
    }
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case "High": return "#c62828";
      case "Medium": return "#ef6c00";
      default: return "#2e7d32";
    }
  };

  const getUrgencyBg = (urgency) => {
    switch(urgency) {
      case "High": return "#ffebee";
      case "Medium": return "#fff3e0";
      default: return "#e8f5e9";
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5"
      }}>
        <p>Loading history...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f0f4f8",
      fontFamily: "'Segoe UI', Arial, sans-serif"
    }}>
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
        <div style={{display: "flex", gap: "12px"}}>
          <Link to="/health">
            <button style={{
              padding: "10px 24px",
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "25px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px"
            }}>+ New Check</button>
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
        </div>
      </nav>

      {/* Content */}
      <div style={{padding: "40px", maxWidth: "950px", margin: "0 auto"}}>
        {/* Page Title */}
        <div style={{marginBottom: "30px"}}>
          <h1 style={{color: "#2d3748", margin: "0 0 10px", fontSize: "32px"}}>📋 Your Health History</h1>
          <p style={{color: "#64748b", margin: 0}}>View all your past symptom checks and analysis results</p>
        </div>

        {user && (
          <div style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "25px 30px",
            borderRadius: "15px",
            marginBottom: "25px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white"
          }}>
            <div>
              <h3 style={{margin: "0 0 5px", fontSize: "20px"}}>👋 {user.name}</h3>
              <p style={{margin: 0, opacity: 0.9}}>{user.email}</p>
            </div>
            <div style={{textAlign: "right"}}>
              <p style={{margin: 0, opacity: 0.9}}>Total Checks: <strong>{history.length}</strong></p>
            </div>
          </div>
        )}

        {history.length === 0 ? (
          <div style={{
            background: "white",
            padding: "80px 40px",
            borderRadius: "20px",
            textAlign: "center",
            boxShadow: "0 10px 40px rgba(0,0,0,0.08)"
          }}>
            <div style={{fontSize: "80px", marginBottom: "25px"}}>📭</div>
            <h3 style={{color: "#2d3748", marginBottom: "15px", fontSize: "24px"}}>No History Yet</h3>
            <p style={{color: "#64748b", marginBottom: "30px", fontSize: "16px"}}>
              You haven't performed any symptom checks yet. Start by checking your symptoms!
            </p>
            <Link to="/health">
              <button style={{
                padding: "16px 40px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "25px",
                fontSize: "16px",
                cursor: "pointer",
                fontWeight: "bold"
              }}>
                Check Symptoms Now
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px"}}>
              <h3 style={{margin: 0, color: "#2d3748", fontSize: "20px"}}>📊 Recent Checks</h3>
              <button 
                onClick={clearHistory}
                style={{
                  padding: "10px 20px",
                  background: "#fee2e2",
                  color: "#dc2626",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500"
                }}
              >
                🗑️ Clear All History
              </button>
            </div>

            {history.map((entry, idx) => (
              <div key={idx} style={{
                background: "white",
                padding: "25px",
                borderRadius: "15px",
                marginBottom: "15px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                borderLeft: "4px solid #667eea"
              }}>
                <div style={{display: "flex", justifyContent: "space-between", marginBottom: "15px"}}>
                  <span style={{color: "#999", fontSize: "14px"}}>
                    📅 {new Date(entry.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span style={{
                    background: getUrgencyBg(entry.urgency),
                    color: getUrgencyColor(entry.urgency),
                    padding: "4px 12px",
                    borderRadius: "15px",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }}>
                    {entry.urgency} Urgency
                  </span>
                </div>

                <div style={{marginBottom: "15px"}}>
                  <p style={{margin: "0 0 5px", color: "#666", fontSize: "14px"}}>Symptoms Described:</p>
                  <p style={{margin: 0, fontStyle: "italic", color: "#333"}}>"{entry.symptoms_text}"</p>
                </div>

                <div style={{
                  background: "#f8f9fa",
                  padding: "15px",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <p style={{margin: "0 0 5px", fontSize: "14px", color: "#666"}}>Predicted Condition:</p>
                    <h3 style={{margin: 0, color: "#e74c3c"}}>{entry.disease}</h3>
                  </div>
                  <div style={{textAlign: "right"}}>
                    <p style={{margin: 0, fontSize: "24px", fontWeight: "bold", color: "#4CAF50"}}>
                      {entry.confidence}%
                    </p>
                    <p style={{margin: 0, fontSize: "12px", color: "#999"}}>Confidence</p>
                  </div>
                </div>

                {entry.symptoms_detected && entry.symptoms_detected.length > 0 && (
                  <div style={{marginTop: "10px"}}>
                    <p style={{margin: "0 0 5px", fontSize: "12px", color: "#999"}}>
                      Detected Symptoms: {entry.symptoms_detected.map(s => s.replace(/_/g, " ")).join(", ")}
                    </p>
                  </div>
                )}

                {entry.possible_conditions && entry.possible_conditions.length > 0 && (
                  <div style={{marginTop: "5px"}}>
                    <p style={{margin: 0, fontSize: "12px", color: "#999"}}>
                      Also consider: {entry.possible_conditions.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default History;
