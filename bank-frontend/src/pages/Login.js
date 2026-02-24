import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/login", form);
      const { token, ...data } = res.data;
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (error) {
      const errorMsg = typeof error.response?.data === 'string'
        ? error.response.data
        : (error.response?.data?.message || "Invalid Email or Password");
      setError(errorMsg);
    }
  };

  return (
    <div className="app-shell">
      <div className="container-xl">
        <div className="form-shell glass-card">
          <h2 className="form-title">Secure Login</h2>
          <p className="form-note">Access your account with encrypted sessions.</p>

          {error && <div className="alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button className="btn" type="submit">
              Login
            </button>
          </form>
          <div style={{ marginTop: "14px" }}>
            <Link to="/forgot" className="form-note">Forgot password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
