
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = "https://medisense-zpu2.onrender.com";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
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
      case "High": return "#EF5350";
      case "Medium": return "#FF9800";
      default: return "#66BB6A";
    }
  };

  const getUrgencyBg = (urgency) => {
    switch(urgency) {
      case "High": return "linear-gradient(135deg, #ffebee, #ffcdd2)";
      case "Medium": return "linear-gradient(135deg, #fff3e0, #ffe0b2)";
      default: return "linear-gradient(135deg, #E8F5E9, #C8E6C9)";
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #E3F2FD 0%, #E8F5E9 100%)",
        fontFamily: "'Segoe UI', Arial, sans-serif"
      }}>
        <div style={{textAlign: "center"}}>
          <div style={{fontSize: "50px", marginBottom: "20px", animation: "pulse 2s ease-in-out infinite"}}>🩺</div>
          <p style={{color: "#0288D1", fontSize: "18px", fontWeight: "600"}}>Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #E3F2FD 0%, #E8F5E9 100%)",
      fontFamily: "'Segoe UI', Arial, sans-serif"
    }}>
      <style>{`
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
      `}</style>
      {/* Header */}
      <nav className="nav-bar" style={{
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
          <span className="nav-logo-text" style={{fontSize: "22px", fontWeight: "800", background: "linear-gradient(135deg, #0288D1, #26C6DA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>MediSense</span>
        </Link>

        {/* Desktop nav links */}
        <div className="nav-links-desktop" style={{display: "flex", gap: "12px"}}>
          <Link to="/health">
            <button style={{
              padding: "10px 24px",
              background: "linear-gradient(135deg, #66BB6A, #4CAF50)",
              color: "white",
              border: "none",
              borderRadius: "25px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "14px",
              boxShadow: "0 4px 12px rgba(102, 187, 106, 0.3)",
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >+ New Check</button>
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
        </div>

        {/* Hamburger button for mobile */}
        <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      
      {/* Mobile Slide-in Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={() => setMenuOpen(false)}>✕</button>
        <Link to="/health" onClick={() => setMenuOpen(false)}>
          <button style={{
            padding: "14px 24px",
            background: "linear-gradient(135deg, #66BB6A, #4CAF50)",
            color: "white",
            border: "none",
            borderRadius: "14px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "15px",
            width: "100%"
          }}>+ New Check</button>
        </Link>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <button style={{
            padding: "14px 24px",
            background: "white",
            color: "#0288D1",
            border: "2px solid #B3E5FC",
            borderRadius: "14px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "15px",
            width: "100%"
          }}>🏠 Home</button>
        </Link>
      </div>

      {/* Content */}
      <div className="page-content" style={{padding: "40px", maxWidth: "1000px", margin: "0 auto"}}>
        {/* Page Title */}
        <div style={{marginBottom: "35px"}}>
          <h1 className="history-title page-title" style={{
            background: "linear-gradient(135deg, #0288D1, #26C6DA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 0 10px",
            fontSize: "36px",
            fontWeight: "800"
          }}>📋 Your Health History</h1>
          <p style={{color: "#546E7A", margin: 0, fontSize: "16px"}}>View all your past symptom checks and analysis results</p>
        </div>

        {user && (
          <div className="user-info-card" style={{
            background: "linear-gradient(135deg, #0288D1 0%, #26C6DA 100%)",
            padding: "30px 35px",
            borderRadius: "20px",
            marginBottom: "30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
            boxShadow: "0 10px 30px rgba(2, 136, 209, 0.25)"
          }}>
            <div>
              <h3 style={{margin: "0 0 5px", fontSize: "22px", fontWeight: "800"}}>👋 {user.name}</h3>
              <p style={{margin: 0, opacity: 0.9, fontSize: "15px"}}>{user.email}</p>
            </div>
            <div style={{
              textAlign: "right",
              background: "rgba(255,255,255,0.15)",
              padding: "15px 25px",
              borderRadius: "14px",
              backdropFilter: "blur(10px)"
            }}>
              <p style={{margin: 0, fontSize: "16px", fontWeight: "700"}}>Total Checks: <strong style={{fontSize: "24px"}}>{history.length}</strong></p>
            </div>
          </div>
        )}

        {history.length === 0 ? (
          <div style={{
            background: "white",
            padding: "80px 40px",
            borderRadius: "25px",
            textAlign: "center",
            boxShadow: "0 15px 50px rgba(2, 136, 209, 0.1)",
            border: "1px solid rgba(2, 136, 209, 0.08)"
          }}>
            <div style={{fontSize: "80px", marginBottom: "25px"}}>📭</div>
            <h3 style={{
              background: "linear-gradient(135deg, #0288D1, #26C6DA)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "15px",
              fontSize: "28px",
              fontWeight: "800"
            }}>No History Yet</h3>
            <p style={{color: "#546E7A", marginBottom: "35px", fontSize: "16px", lineHeight: "1.7"}}>
              You haven't performed any symptom checks yet. Start by checking your symptoms!
            </p>
            <Link to="/health">
              <button style={{
                padding: "18px 45px",
                background: "linear-gradient(135deg, #0288D1 0%, #26C6DA 100%)",
                color: "white",
                border: "none",
                borderRadius: "30px",
                fontSize: "17px",
                cursor: "pointer",
                fontWeight: "800",
                boxShadow: "0 8px 25px rgba(2, 136, 209, 0.3)",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Check Symptoms Now →
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="history-header-row" style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px"}}>
              <h3 style={{margin: 0, color: "#263238", fontSize: "22px", fontWeight: "700"}}>📊 Recent Checks</h3>
              <button 
                onClick={clearHistory}
                style={{
                  padding: "10px 22px",
                  background: "linear-gradient(135deg, #ffebee, #ffcdd2)",
                  color: "#EF5350",
                  border: "1px solid rgba(239, 83, 80, 0.2)",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "700",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => { e.target.style.background = '#EF5350'; e.target.style.color = 'white'; }}
                onMouseOut={(e) => { e.target.style.background = 'linear-gradient(135deg, #ffebee, #ffcdd2)'; e.target.style.color = '#EF5350'; }}
              >
                🗑️ Clear All History
              </button>
            </div>

            {history.map((entry, idx) => (
              <div key={idx} className="history-entry" style={{
                background: "white",
                padding: "30px",
                borderRadius: "20px",
                marginBottom: "18px",
                boxShadow: "0 8px 25px rgba(2, 136, 209, 0.08)",
                borderLeft: "5px solid #0288D1",
                border: "1px solid rgba(2, 136, 209, 0.08)",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="history-entry-header" style={{display: "flex", justifyContent: "space-between", marginBottom: "18px"}}>
                  <span style={{color: "#78909C", fontSize: "14px", fontWeight: "600"}}>
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
                    padding: "6px 16px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "800",
                    border: `1px solid ${getUrgencyColor(entry.urgency)}30`,
                    whiteSpace: "nowrap"
                  }}>
                    {entry.urgency} Urgency
                  </span>
                </div>

                <div style={{marginBottom: "18px"}}>
                  <p style={{margin: "0 0 8px", color: "#78909C", fontSize: "13px", fontWeight: "600"}}>Symptoms Described:</p>
                  <p style={{margin: 0, fontStyle: "italic", color: "#263238", fontSize: "15px", lineHeight: "1.6"}}>"{entry.symptoms_text}"</p>
                </div>

                <div className="history-result-row" style={{
                  background: "linear-gradient(135deg, rgba(227, 242, 253, 0.5), rgba(232, 245, 233, 0.5))",
                  padding: "18px",
                  borderRadius: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid rgba(2, 136, 209, 0.1)"
                }}>
                  <div>
                    <p style={{margin: "0 0 5px", fontSize: "13px", color: "#78909C", fontWeight: "600"}}>Predicted Condition:</p>
                    <h3 style={{margin: 0, color: "#0288D1", fontWeight: "800", fontSize: "20px"}}>{entry.disease}</h3>
                  </div>
                  <div style={{textAlign: "right"}}>
                    <p style={{
                      margin: 0,
                      fontSize: "28px",
                      fontWeight: "800",
                      background: "linear-gradient(135deg, #66BB6A, #4CAF50)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent"
                    }}>
                      {entry.confidence}%
                    </p>
                    <p style={{margin: 0, fontSize: "12px", color: "#78909C", fontWeight: "600"}}>Confidence</p>
                  </div>
                </div>

                {entry.symptoms_detected && entry.symptoms_detected.length > 0 && (
                  <div style={{marginTop: "14px"}}>
                    <div style={{display:"flex", flexWrap:"wrap", gap:"8px"}}>
                      {entry.symptoms_detected.map((s, i) => (
                        <span key={i} style={{
                          background:"#E3F2FD",
                          padding:"4px 12px",
                          borderRadius:"15px",
                          fontSize:"12px",
                          color:"#0288D1",
                          fontWeight: "600"
                        }}>
                          {s.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {entry.possible_conditions && entry.possible_conditions.length > 0 && (
                  <div style={{marginTop: "10px"}}>
                    <p style={{margin: 0, fontSize: "13px", color: "#78909C", fontWeight: "600"}}>
                      Also consider: <span style={{color: "#546E7A"}}>{entry.possible_conditions.join(", ")}</span>
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
