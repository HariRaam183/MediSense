import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        if (userData && userData.email) {
          setUser(userData);
        } else {
          localStorage.removeItem("user");
        }
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Arial, sans-serif",
      background: "#f0f4f8"
    }}>
      {/* Navigation Bar */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 50px",
        background: "white",
        boxShadow: "0 2px 15px rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
          <span style={{fontSize: "32px"}}>🩺</span>
          <span style={{fontSize: "24px", fontWeight: "bold", color: "#2d3748"}}>MediSense</span>
        </div>
        
        <div style={{display: "flex", gap: "15px", alignItems: "center"}}>
          {user ? (
            <>
              <span style={{color: "#666"}}>Welcome, <strong>{user.name}</strong></span>
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
                }}>Check Symptoms</button>
              </Link>
              <Link to="/history">
                <button style={{
                  padding: "10px 24px",
                  background: "transparent",
                  color: "#2d3748",
                  border: "2px solid #e2e8f0",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px"
                }}>My History</button>
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
            </>
          ) : (
            <>
              <Link to="/login">
                <button style={{
                  padding: "10px 28px",
                  background: "transparent",
                  color: "#2d3748",
                  border: "2px solid #e2e8f0",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px"
                }}>Login</button>
              </Link>
              <Link to="/signup">
                <button style={{
                  padding: "10px 28px",
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px"
                }}>Sign Up Free</button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        padding: "100px 50px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          top: "-100px",
          right: "-100px"
        }}></div>
        <div style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          bottom: "-50px",
          left: "10%"
        }}></div>
        <div style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          top: "20%",
          left: "5%"
        }}></div>

        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 1
        }}>
          <div style={{maxWidth: "600px"}}>
            <h1 style={{
              fontSize: "56px",
              color: "white",
              marginBottom: "20px",
              fontWeight: "700",
              lineHeight: "1.2"
            }}>
              Your Health,<br/>Our Priority
            </h1>
            <p style={{
              fontSize: "20px",
              color: "rgba(255,255,255,0.9)",
              marginBottom: "40px",
              lineHeight: "1.7"
            }}>
              Get instant AI-powered health insights. Describe your symptoms and receive 
              intelligent analysis with personalized recommendations in seconds.
            </p>
            
            {!user ? (
              <div style={{display: "flex", gap: "15px"}}>
                <Link to="/signup">
                  <button style={{
                    padding: "18px 40px",
                    fontSize: "16px",
                    background: "white",
                    color: "#667eea",
                    border: "none",
                    borderRadius: "30px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                    transition: "transform 0.3s"
                  }}>
                    Get Started — It's Free
                  </button>
                </Link>
                <Link to="/login">
                  <button style={{
                    padding: "18px 40px",
                    fontSize: "16px",
                    background: "transparent",
                    color: "white",
                    border: "2px solid rgba(255,255,255,0.5)",
                    borderRadius: "30px",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}>
                    I have an account
                  </button>
                </Link>
              </div>
            ) : (
              <Link to="/health">
                <button style={{
                  padding: "18px 50px",
                  fontSize: "16px",
                  background: "white",
                  color: "#667eea",
                  border: "none",
                  borderRadius: "30px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                }}>
                  🔍 Check My Symptoms Now
                </button>
              </Link>
            )}
          </div>

          {/* Hero illustration */}
          <div style={{
            fontSize: "180px",
            opacity: "0.9",
            textShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}>
            🏥
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{
        background: "white",
        padding: "40px 50px",
        boxShadow: "0 -5px 20px rgba(0,0,0,0.05)"
      }}>
        <div style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-around",
          textAlign: "center"
        }}>
          {[
            {number: "41+", label: "Diseases Detected"},
            {number: "130+", label: "Symptoms Analyzed"},
            {number: "95%", label: "Accuracy Rate"},
            {number: "24/7", label: "Available"}
          ].map((stat, idx) => (
            <div key={idx}>
              <div style={{fontSize: "36px", fontWeight: "bold", color: "#667eea"}}>{stat.number}</div>
              <div style={{color: "#64748b", fontSize: "14px", marginTop: "5px"}}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div style={{
        padding: "80px 50px",
        background: "#f8fafc"
      }}>
        <div style={{maxWidth: "1200px", margin: "0 auto"}}>
          <h2 style={{
            textAlign: "center",
            fontSize: "36px",
            color: "#2d3748",
            marginBottom: "15px"
          }}>How MediSense Works</h2>
          <p style={{
            textAlign: "center",
            color: "#64748b",
            marginBottom: "60px",
            fontSize: "18px"
          }}>Get health insights in three simple steps</p>

          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            flexWrap: "wrap"
          }}>
            {[
              {step: "1", icon: "📝", title: "Describe Symptoms", desc: "Tell us how you're feeling in your own words. Our AI understands natural language."},
              {step: "2", icon: "🤖", title: "AI Analysis", desc: "Our machine learning model analyzes your symptoms against thousands of medical cases."},
              {step: "3", icon: "📊", title: "Get Results", desc: "Receive instant predictions with confidence levels and recommended actions."}
            ].map((item, idx) => (
              <div key={idx} style={{
                background: "white",
                padding: "40px 30px",
                borderRadius: "20px",
                width: "300px",
                textAlign: "center",
                boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                position: "relative"
              }}>
                <div style={{
                  position: "absolute",
                  top: "-20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "40px",
                  height: "40px",
                  background: "#667eea",
                  color: "white",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold"
                }}>{item.step}</div>
                <div style={{fontSize: "50px", marginBottom: "20px", marginTop: "10px"}}>{item.icon}</div>
                <h3 style={{color: "#2d3748", marginBottom: "15px"}}>{item.title}</h3>
                <p style={{color: "#64748b", fontSize: "15px", lineHeight: "1.6"}}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        padding: "80px 50px",
        background: "white"
      }}>
        <div style={{maxWidth: "1200px", margin: "0 auto"}}>
          <h2 style={{
            textAlign: "center",
            fontSize: "36px",
            color: "#2d3748",
            marginBottom: "60px"
          }}>Why Choose MediSense?</h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "30px"
          }}>
            {[
              {icon: "🔒", title: "100% Private", desc: "Your health data stays secure and is never shared with third parties."},
              {icon: "⚡", title: "Instant Results", desc: "Get AI-powered analysis in seconds, not hours or days."},
              {icon: "📱", title: "Easy to Use", desc: "Simply describe symptoms in plain English - no medical jargon needed."},
              {icon: "📈", title: "Track History", desc: "Keep records of all your symptom checks for future reference."},
              {icon: "🎯", title: "High Accuracy", desc: "Trained on thousands of medical cases for reliable predictions."},
              {icon: "💚", title: "Always Free", desc: "Access basic health insights without any cost or subscription."}
            ].map((feature, idx) => (
              <div key={idx} style={{
                padding: "30px",
                borderRadius: "15px",
                border: "1px solid #e2e8f0",
                transition: "all 0.3s",
                cursor: "default"
              }}>
                <div style={{fontSize: "40px", marginBottom: "15px"}}>{feature.icon}</div>
                <h3 style={{color: "#2d3748", marginBottom: "10px", fontSize: "18px"}}>{feature.title}</h3>
                <p style={{color: "#64748b", fontSize: "14px", lineHeight: "1.6", margin: 0}}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div style={{
          padding: "80px 50px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          textAlign: "center"
        }}>
          <h2 style={{color: "white", fontSize: "36px", marginBottom: "20px"}}>
            Ready to Take Control of Your Health?
          </h2>
          <p style={{color: "rgba(255,255,255,0.9)", fontSize: "18px", marginBottom: "40px", maxWidth: "600px", margin: "0 auto 40px"}}>
            Join thousands of users who trust MediSense for quick, reliable health insights.
          </p>
          <Link to="/signup">
            <button style={{
              padding: "18px 50px",
              fontSize: "18px",
              background: "white",
              color: "#667eea",
              border: "none",
              borderRadius: "30px",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
            }}>
              Create Free Account
            </button>
          </Link>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        background: "#1e293b",
        color: "#94a3b8",
        padding: "40px 50px",
        textAlign: "center"
      }}>
        <div style={{marginBottom: "20px"}}>
          <span style={{fontSize: "24px"}}>🩺</span>
          <span style={{fontSize: "20px", fontWeight: "bold", color: "white", marginLeft: "10px"}}>MediSense</span>
        </div>
        <p style={{fontSize: "14px", marginBottom: "15px"}}>
          ⚕️ Disclaimer: MediSense provides AI-based health insights for informational purposes only. 
          Always consult a qualified healthcare professional for medical advice.
        </p>
        <p style={{fontSize: "13px", color: "#64748b"}}>
          © 2026 MediSense. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;
