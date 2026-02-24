import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="app-shell">
      <div className="container-xl">
        <div className="nav-blur">
          <div className="brand">
            <div className="brand-badge">KB</div>
            <div>
              <div>Kranthi Bank</div>
              <div className="form-note">Secure digital wealth</div>
            </div>
          </div>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-ghost">Login</Link>
            <Link to="/register" className="btn">Open Account</Link>
          </div>
        </div>

        <section className="hero">
          <div className="hero-copy">
            <span className="tag">AI‑ready banking</span>
            <h1>Instant banking with privacy baked in.</h1>
            <p>
              Open accounts, move funds, and track balances in real time.
              Built for speed, secured by design.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn">Create Account</Link>
              <Link to="/forgot" className="btn btn-ghost">Reset Password</Link>
              <Link to="/admin/login" className="btn btn-ghost">Admin Access</Link>
            </div>

            <div className="stats-row">
              <div className="stat-card">
                <h3 aria-hidden="true"></h3>
                <span>Move funds in seconds.</span>
              </div>
              <div className="stat-card">
                <h3 aria-hidden="true"></h3>
                <span>JWT auth + hashing.</span>
              </div>
              <div className="stat-card">
                <h3 aria-hidden="true"></h3>
                <span>Admin visibility.</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <img src="/assets/hero.jpg" alt="Modern banking" loading="eager" decoding="async" />
            <div className="hero-overlay" />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
