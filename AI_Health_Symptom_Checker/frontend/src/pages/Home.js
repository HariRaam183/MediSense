import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
    setMenuOpen(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      background: "linear-gradient(135deg, #E3F2FD 0%, #E8F5E9 100%)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Animated floating medical icons background */}
      <div className="floating-icon" style={{position: "absolute", top: "10%", left: "5%", fontSize: "40px", opacity: "0.1", animation: "float 6s ease-in-out infinite"}}>💊</div>
      <div className="floating-icon" style={{position: "absolute", top: "20%", right: "8%", fontSize: "35px", opacity: "0.1", animation: "float 7s ease-in-out infinite 1s"}}>🩺</div>
      <div className="floating-icon" style={{position: "absolute", bottom: "25%", left: "10%", fontSize: "45px", opacity: "0.1", animation: "float 8s ease-in-out infinite 2s"}}>❤️</div>
      <div className="floating-icon" style={{position: "absolute", top: "60%", right: "15%", fontSize: "38px", opacity: "0.1", animation: "float 6.5s ease-in-out infinite 1.5s"}}>🏥</div>
      <div className="floating-icon" style={{position: "absolute", bottom: "15%", right: "25%", fontSize: "42px", opacity: "0.1", animation: "float 7.5s ease-in-out infinite 0.5s"}}>💉</div>
      <div className="floating-icon" style={{position: "absolute", top: "35%", left: "20%", fontSize: "36px", opacity: "0.1", animation: "float 6.8s ease-in-out infinite 2.5s"}}>🧬</div>
      
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(10deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .hover-lift:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(2, 136, 209, 0.15) !important;
          }
          .hover-grow:hover {
            transform: scale(1.05);
          }
        `}
      </style>

      {/* Navigation Bar */}
      <nav className="nav-bar" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 60px",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 20px rgba(2, 136, 209, 0.1)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "1px solid rgba(2, 136, 209, 0.1)"
      }}>
        <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
          <div style={{
            background: "linear-gradient(135deg, #0288D1 0%, #26C6DA 100%)",
            padding: "8px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span style={{fontSize: "28px"}}>🩺</span>
          </div>
          <span className="nav-logo-text" style={{fontSize: "26px", fontWeight: "700", background: "linear-gradient(135deg, #0288D1, #26C6DA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>MediSense</span>
        </div>
        
        {/* Desktop nav links */}
        <div className="nav-links-desktop" style={{display: "flex", gap: "12px", alignItems: "center"}}>
          {user ? (
            <>
              <span style={{color: "#546E7A", fontSize: "15px"}}>Welcome, <strong style={{color: "#0288D1"}}>{user.name}</strong></span>
              <Link to="/health">
                <button className="hover-grow" style={{
                  padding: "12px 28px",
                  background: "linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                  boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
                  transition: "all 0.3s ease"
                }}>✨ Check Symptoms</button>
              </Link>
              <Link to="/history">
                <button className="hover-grow" style={{
                  padding: "12px 28px",
                  background: "white",
                  color: "#0288D1",
                  border: "2px solid #B3E5FC",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                  transition: "all 0.3s ease"
                }}>📋 History</button>
              </Link>
              <button onClick={logout} style={{
                padding: "12px 22px",
                background: "#ECEFF1",
                color: "#546E7A",
                border: "none",
                borderRadius: "25px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.3s ease"
              }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="hover-grow" style={{
                  padding: "12px 32px",
                  background: "white",
                  color: "#0288D1",
                  border: "2px solid #B3E5FC",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                  transition: "all 0.3s ease"
                }}>Login</button>
              </Link>
              <Link to="/signup">
                <button className="hover-grow" style={{
                  padding: "12px 32px",
                  background: "linear-gradient(135deg, #0288D1 0%, #26C6DA 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                  boxShadow: "0 4px 15px rgba(2, 136, 209, 0.3)",
                  transition: "all 0.3s ease"
                }}>Sign Up Free</button>
              </Link>
            </>
          )}
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
        {user ? (
          <>
            <div style={{padding: "12px 0", color: "#546E7A", fontSize: "15px", borderBottom: "1px solid #E3F2FD", marginBottom: "8px"}}>
              Welcome, <strong style={{color: "#0288D1"}}>{user.name}</strong>
            </div>
            <Link to="/health" onClick={() => setMenuOpen(false)}>
              <button style={{
                padding: "14px 24px",
                background: "linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%)",
                color: "white",
                border: "none",
                borderRadius: "14px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "15px",
                width: "100%"
              }}>✨ Check Symptoms</button>
            </Link>
            <Link to="/history" onClick={() => setMenuOpen(false)}>
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
              }}>📋 History</button>
            </Link>
            <button onClick={logout} style={{
              padding: "14px 24px",
              background: "#ECEFF1",
              color: "#546E7A",
              border: "none",
              borderRadius: "14px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "500",
              width: "100%"
            }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
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
              }}>Login</button>
            </Link>
            <Link to="/signup" onClick={() => setMenuOpen(false)}>
              <button style={{
                padding: "14px 24px",
                background: "linear-gradient(135deg, #0288D1 0%, #26C6DA 100%)",
                color: "white",
                border: "none",
                borderRadius: "14px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "15px",
                width: "100%"
              }}>Sign Up Free</button>
            </Link>
          </>
        )}
      </div>

      {/* Hero Section */}
      <div className="hero-section" style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(227,242,253,0.8) 100%)",
        padding: "120px 60px 100px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative medical elements */}
        <div className="hero-decorative-circle" style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(2, 136, 209, 0.05) 0%, transparent 70%)",
          top: "-150px",
          right: "-150px",
          animation: "pulse 4s ease-in-out infinite"
        }}></div>
        <div className="hero-decorative-circle" style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(102, 187, 106, 0.05) 0%, transparent 70%)",
          bottom: "-100px",
          left: "-100px",
          animation: "pulse 5s ease-in-out infinite 1s"
        }}></div>

        <div className="hero-content" style={{
          maxWidth: "1300px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "80px",
          position: "relative",
          zIndex: 1
        }}>
          <div style={{flex: 1, animation: "slideIn 0.8s ease-out"}}>
            <div className="hero-badge" style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #E3F2FD, #C8E6C9)",
              padding: "8px 20px",
              borderRadius: "30px",
              marginBottom: "25px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#01579B"
            }}>
              🏥 AI-Powered Health Assistant
            </div>
            <h1 className="hero-title" style={{
              fontSize: "62px",
              background: "linear-gradient(135deg, #0288D1, #66BB6A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "25px",
              fontWeight: "800",
              lineHeight: "1.1",
              letterSpacing: "-1px"
            }}>
              Your Health,<br/>Our Priority
            </h1>
            <p className="hero-desc" style={{
              fontSize: "20px",
              color: "#546E7A",
              marginBottom: "45px",
              lineHeight: "1.8",
              maxWidth: "580px"
            }}>
              Get instant AI-powered health insights. Describe your symptoms and receive 
              intelligent analysis with personalized recommendations in seconds. 24/7 health support at your fingertips.
            </p>
            
            {!user ? (
              <div className="hero-buttons" style={{display: "flex", gap: "18px", flexWrap: "wrap"}}>
                <Link to="/signup" style={{flex: "1 1 auto"}}>
                  <button className="hover-lift hero-btn-primary" style={{
                    padding: "20px 45px",
                    fontSize: "17px",
                    background: "linear-gradient(135deg, #0288D1 0%, #26C6DA 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "30px",
                    cursor: "pointer",
                    fontWeight: "700",
                    boxShadow: "0 10px 30px rgba(2, 136, 209, 0.25)",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    width: "100%"
                  }}>
                    <span>Get Started — It's Free</span>
                    <span>→</span>
                  </button>
                </Link>
                <Link to="/login" style={{flex: "1 1 auto"}}>
                  <button className="hover-grow hero-btn-secondary" style={{
                    padding: "20px 45px",
                    fontSize: "17px",
                    background: "white",
                    color: "#0288D1",
                    border: "2px solid #B3E5FC",
                    borderRadius: "30px",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    width: "100%"
                  }}>
                    I have an account
                  </button>
                </Link>
              </div>
            ) : (
              <Link to="/health">
                <button className="hover-lift hero-btn-primary" style={{
                  padding: "20px 50px",
                  fontSize: "18px",
                  background: "linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "30px",
                  cursor: "pointer",
                  fontWeight: "700",
                  boxShadow: "0 10px 30px rgba(76, 175, 80, 0.25)",
                  transition: "all 0.3s ease"
                }}>
                  🔍 Check My Symptoms Now
                </button>
              </Link>
            )}
          </div>

          {/* Hero illustration */}
          <div className="hero-illustration" style={{
            position: "relative",
            animation: "float 6s ease-in-out infinite"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #E3F2FD 0%, #C8E6C9 100%)",
              padding: "60px",
              borderRadius: "50%",
              boxShadow: "0 20px 60px rgba(2, 136, 209, 0.15)"
            }}>
              <div style={{
                fontSize: "180px",
                filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))"
              }}>
                🏥
              </div>
            </div>
            {/* Small floating icons around main icon */}
            <div style={{position: "absolute", top: "10%", left: "-10%", fontSize: "35px", animation: "float 4s ease-in-out infinite"}}>💊</div>
            <div style={{position: "absolute", bottom: "15%", right: "-8%", fontSize: "35px", animation: "float 5s ease-in-out infinite 1s"}}>❤️</div>
            <div style={{position: "absolute", top: "20%", right: "-5%", fontSize: "30px", animation: "float 4.5s ease-in-out infinite 0.5s"}}>🩺</div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section" style={{
        background: "white",
        padding: "50px 60px",
        boxShadow: "0 -8px 30px rgba(2, 136, 209, 0.08)",
        borderTop: "1px solid rgba(2, 136, 209, 0.1)"
      }}>
        <div className="stats-container" style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-around",
          textAlign: "center",
          gap: "40px"
        }}>
          {[
            {number: "41+", label: "Diseases Detected", icon: "🦠"},
            {number: "130+", label: "Symptoms Analyzed", icon: "📊"},
            {number: "95%", label: "Accuracy Rate", icon: "✓"},
            {number: "24/7", label: "Available", icon: "⏰"}
          ].map((stat, idx) => (
            <div key={idx} className="hover-lift" style={{
              padding: "30px 25px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #E3F2FD 0%, #E8F5E9 100%)",
              transition: "all 0.3s ease",
              boxShadow: "0 5px 15px rgba(2, 136, 209, 0.1)",
              flex: 1
            }}>
              <div style={{fontSize: "40px", marginBottom: "12px"}}>{stat.icon}</div>
              <div style={{fontSize: "42px", fontWeight: "800", background: "linear-gradient(135deg, #0288D1, #66BB6A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>{stat.number}</div>
              <div style={{color: "#546E7A", fontSize: "15px", marginTop: "8px", fontWeight: "600"}}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="section-padding" style={{
        padding: "100px 60px",
        background: "linear-gradient(135deg, rgba(227, 242, 253, 0.3) 0%, rgba(232, 245, 233, 0.3) 100%)",
        position: "relative"
      }}>
        <div style={{maxWidth: "1300px", margin: "0 auto"}}>
          <div className="section-badge" style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #E3F2FD, #C8E6C9)",
            padding: "10px 25px",
            borderRadius: "30px",
            marginBottom: "15px",
            fontSize: "14px",
            fontWeight: "700",
            color: "#01579B",
            marginLeft: "50%",
            transform: "translateX(-50%)"
          }}>
            HOW IT WORKS
          </div>
          <h2 className="section-title" style={{
            textAlign: "center",
            fontSize: "46px",
            background: "linear-gradient(135deg, #0288D1, #66BB6A)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "15px",
            fontWeight: "800"
          }}>Simple. Fast. Accurate.</h2>
          <p className="section-subtitle" style={{
            textAlign: "center",
            color: "#546E7A",
            marginBottom: "70px",
            fontSize: "19px",
            maxWidth: "600px",
            margin: "0 auto 70px"
          }}>Get health insights in three simple steps</p>

          <div className="steps-container" style={{
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            flexWrap: "wrap"
          }}>
            {[
              {step: "1", icon: "📝", title: "Describe Symptoms", desc: "Tell us how you're feeling in your own words. Our AI understands natural language.", color: "#42A5F5"},
              {step: "2", icon: "🤖", title: "AI Analysis", desc: "Our machine learning model analyzes your symptoms against thousands of medical cases.", color: "#66BB6A"},
              {step: "3", icon: "📊", title: "Get Results", desc: "Receive instant predictions with confidence levels and recommended actions.", color: "#26C6DA"}
            ].map((item, idx) => (
              <div key={idx} className="hover-lift step-card" style={{
                background: "white",
                padding: "50px 35px",
                borderRadius: "25px",
                width: "330px",
                textAlign: "center",
                boxShadow: "0 15px 50px rgba(2, 136, 209, 0.12)",
                position: "relative",
                transition: "all 0.3s ease",
                border: "1px solid rgba(2, 136, 209, 0.08)"
              }}>
                <div style={{
                  position: "absolute",
                  top: "-25px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "55px",
                  height: "55px",
                  background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`,
                  color: "white",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "800",
                  fontSize: "24px",
                  boxShadow: `0 8px 20px ${item.color}40`
                }}>{item.step}</div>
                <div style={{fontSize: "65px", marginBottom: "25px", marginTop: "20px", filter: "drop-shadow(0 5px 10px rgba(0,0,0,0.1)"}}>{item.icon}</div>
                <h3 style={{color: "#263238", marginBottom: "18px", fontSize: "22px", fontWeight: "700"}}>{item.title}</h3>
                <p style={{color: "#546E7A", fontSize: "15px", lineHeight: "1.7"}}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="section-padding" style={{
        padding: "100px 60px",
        background: "white"
      }}>
        <div style={{maxWidth: "1300px", margin: "0 auto"}}>
          <div className="section-badge" style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #E3F2FD, #C8E6C9)",
            padding: "10px 25px",
            borderRadius: "30px",
            marginBottom: "15px",
            fontSize: "14px",
            fontWeight: "700",
            color: "#01579B",
            marginLeft: "50%",
            transform: "translateX(-50%)"
          }}>
            WHY CHOOSE US
          </div>
          <h2 className="section-title" style={{
            textAlign: "center",
            fontSize: "46px",
            background: "linear-gradient(135deg, #0288D1, #66BB6A)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "70px",
            fontWeight: "800"
          }}>Trusted Healthcare Companion</h2>

          <div className="features-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "35px"
          }}>
            {[
              {icon: "🔒", title: "100% Private", desc: "Your health data stays secure and is never shared with third parties.", color: "#42A5F5"},
              {icon: "⚡", title: "Instant Results", desc: "Get AI-powered analysis in seconds, not hours or days.", color: "#66BB6A"},
              {icon: "📱", title: "Easy to Use", desc: "Simply describe symptoms in plain English - no medical jargon needed.", color: "#26C6DA"},
              {icon: "📈", title: "Track History", desc: "Keep records of all your symptom checks for future reference.", color: "#7E57C2"},
              {icon: "🎯", title: "High Accuracy", desc: "Trained on thousands of medical cases for reliable predictions.", color: "#EF5350"},
              {icon: "💚", title: "Always Free", desc: "Access basic health insights without any cost or subscription.", color: "#66BB6A"}
            ].map((feature, idx) => (
              <div key={idx} className="hover-lift" style={{
                padding: "40px 30px",
                borderRadius: "20px",
                background: "linear-gradient(135deg, rgba(227, 242, 253, 0.3), rgba(232, 245, 233, 0.3))",
                border: "1px solid rgba(2, 136, 209, 0.1)",
                transition: "all 0.3s ease",
                cursor: "default",
                boxShadow: "0 8px 25px rgba(2, 136, 209, 0.08)"
              }}>
                <div style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "18px",
                  background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "35px",
                  marginBottom: "20px",
                  boxShadow: `0 8px 20px ${feature.color}30`
                }}>{feature.icon}</div>
                <h3 style={{color: "#263238", marginBottom: "12px", fontSize: "20px", fontWeight: "700"}}>{feature.title}</h3>
                <p style={{color: "#546E7A", fontSize: "15px", lineHeight: "1.7", margin: 0}}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="cta-section" style={{
          padding: "100px 60px",
          background: "linear-gradient(135deg, #0288D1 0%, #26C6DA 50%, #66BB6A 100%)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Decorative elements */}
          <div className="hero-decorative-circle" style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            top: "-100px",
            right: "-100px",
            animation: "pulse 4s ease-in-out infinite"
          }}></div>
          <div className="hero-decorative-circle" style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            bottom: "-80px",
            left: "-80px",
            animation: "pulse 5s ease-in-out infinite 1s"
          }}></div>
          
          <div style={{position: "relative", zIndex: 1}}>
            <h2 className="cta-title" style={{color: "white", fontSize: "48px", marginBottom: "25px", fontWeight: "800"}}>
              Ready to Take Control of Your Health?
            </h2>
            <p className="cta-desc" style={{color: "rgba(255,255,255,0.95)", fontSize: "20px", marginBottom: "45px", maxWidth: "700px", margin: "0 auto 45px", lineHeight: "1.7"}}>
              Join thousands of users who trust MediSense for quick, reliable health insights. Start your journey to better health today.
            </p>
            <Link to="/signup">
              <button className="hover-lift cta-btn" style={{
                padding: "22px 55px",
                fontSize: "19px",
                background: "white",
                color: "#0288D1",
                border: "none",
                borderRadius: "35px",
                cursor: "pointer",
                fontWeight: "800",
                boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
                transition: "all 0.3s ease"
              }}>
                Create Free Account →
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer" style={{
        background: "linear-gradient(135deg, #263238 0%, #37474F 100%)",
        color: "#B0BEC5",
        padding: "50px 60px",
        textAlign: "center",
        borderTop: "3px solid #0288D1"
      }}>
        <div style={{marginBottom: "25px"}}>
          <div style={{
            background: "linear-gradient(135deg, #0288D1, #26C6DA)",
            padding: "12px",
            borderRadius: "15px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "12px"
          }}>
            <span style={{fontSize: "32px"}}>🩺</span>
          </div>
          <div>
            <span style={{fontSize: "24px", fontWeight: "800", background: "linear-gradient(135deg, #0288D1, #26C6DA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>MediSense</span>
          </div>
        </div>
        <div style={{
          maxWidth: "800px",
          margin: "0 auto 25px",
          padding: "20px",
          background: "rgba(2, 136, 209, 0.05)",
          borderRadius: "12px",
          border: "1px solid rgba(2, 136, 209, 0.1)"
        }}>
          <p style={{fontSize: "15px", marginBottom: "0", lineHeight: "1.7", color: "#CFD8DC"}}>
            ⚕️ <strong>Medical Disclaimer:</strong> MediSense provides AI-based health insights for informational purposes only. 
            This tool is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical concerns.
          </p>
        </div>
        <p style={{fontSize: "14px", color: "#78909C", marginBottom: "10px"}}>
          Built with care for better health outcomes 💙
        </p>
        <p style={{fontSize: "13px", color: "#546E7A"}}>
          © 2026 MediSense. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;
