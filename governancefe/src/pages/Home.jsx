
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="brand">
          <span className="brand-icon">🏛️</span>
          CivicConnect
        </Link>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
        </div>

        <Link to="/login" className="nav-login">
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <span className="hero-tag">
            YOUR CITY, YOUR VOICE
          </span>

          <h1>
            Report Problems.
            <br />
            <span>Build a Better City.</span>
          </h1>

          <p className="hero-description">
            See a pothole, overflowing garbage, broken
            streetlight, or another civic issue?
            Report it with a photo and help make
            your surroundings cleaner, safer, and better.
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="primary-btn">
              Report an Issue <span>→</span>
            </Link>

            <Link to="/login" className="secondary-btn">
              Track Your Complaint
            </Link>
          </div>

          <div className="hero-note">
            <span>✓</span> Report civic issues easily
            <span>✓</span> Track resolution status
          </div>
        </div>

        
<div className="hero-visual">
  <div className="issue-panel">
    <div className="issue-panel-heading">
      <div>
        <span className="section-tag">CIVIC REPORTING</span>
        <h3>Issues Around You</h3>
      </div>
      <span className="live-indicator">
        <span></span> Community
      </span>
    </div>

    <div className="issue-photo-row">
      <img
        src="https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=240&q=80"
        alt="Damaged road in a neighbourhood"
      />
      <div className="issue-photo-info">
        <h4>Road Damage</h4>
        <p>Roads and public infrastructure</p>
      </div>
    </div>

    <div className="issue-photo-row">
      <img
        src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=240&q=80"
        alt="Waste and garbage"
      />
      <div className="issue-photo-info">
        <h4>Waste Management</h4>
        <p>Clean streets and public spaces</p>
      </div>
    </div>

    <div className="issue-photo-row">
      <img
        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=240&q=80"
        alt="Street infrastructure"
      />
      <div className="issue-photo-info">
        <h4>Street Infrastructure</h4>
        <p>Safer neighbourhoods for everyone</p>
      </div>
    </div>

    <div className="issue-panel-footer">
      <span>Have you spotted a problem?</span>
      <Link to="/login">Report it →</Link>
    </div>
  </div>
</div>

      </section>

      {/* How It Works */}
      <section className="how-section" id="how-it-works">
        <div className="section-heading">
          <span className="section-tag">SIMPLE AND TRANSPARENT</span>
          <h2>How CivicConnect Works</h2>
          <p>
            Three simple steps to make your neighbourhood better.
          </p>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-icon step-blue">📸</div>
            <span className="step-number">STEP 01</span>
            <h3>Report an Issue</h3>
            <p>
              Sign in, upload a photo of the civic problem,
              and provide its location and description.
            </p>
          </div>

          <div className="step-card">
            <div className="step-icon step-orange">🔎</div>
            <span className="step-number">STEP 02</span>
            <h3>Track Progress</h3>
            <p>
              View your submitted complaints and check
              whether each issue is pending or resolved.
            </p>
          </div>

          <div className="step-card">
            <div className="step-icon step-green">✅</div>
            <span className="step-number">STEP 03</span>
            <h3>Get It Resolved</h3>
            <p>
              Government administrators review reported
              issues and update their resolution status.
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="about-section" id="about">
        <div>
          <span className="section-tag">OUR MISSION</span>
          <h2>A Better Community Starts With You.</h2>
          <p>
            CivicConnect brings citizens and local
            authorities together to report, monitor,
            and resolve everyday civic problems.
          </p>
        </div>

        <Link to="/login" className="primary-btn">
          Get Started <span>→</span>
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <Link to="/" className="brand footer-brand">
          🏛️ CivicConnect
        </Link>
        <p>Building cleaner, safer, better communities.</p>
        <span>© 2026 CivicConnect · Mini Project</span>
      </footer>
    </div>
  );
}

export default Home;
