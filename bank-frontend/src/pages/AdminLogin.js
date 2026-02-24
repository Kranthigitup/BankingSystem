import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminAPI from "../services/adminApi";

function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await adminAPI.post("/admin/login", form);
      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin/dashboard");
    } catch {
      setError("Invalid admin credentials");
    }
  };

  return (
    <div className="app-shell">
      <div className="container-xl">
        <div className="form-shell glass-card">
          <h2 className="form-title">Admin Console</h2>
          <p className="form-note">Restricted access to system-wide controls.</p>
          {error && <div className="alert">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input
              name="username"
              className="form-input"
              placeholder="Admin Username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Admin Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button type="submit" className="btn">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
