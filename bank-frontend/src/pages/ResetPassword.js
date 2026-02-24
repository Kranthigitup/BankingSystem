import React, { useState } from "react";
import API from "../services/api";

function ResetPassword() {
  const [form, setForm] = useState({ email: "", otp: "", newPassword: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await API.post("/auth/reset-password", form);
      setMessage("Password reset successful");
      setForm({ email: "", otp: "", newPassword: "" });
    } catch {
      setMessage("Reset failed");
    }
  };

  return (
    <div className="app-shell">
      <div className="container-xl">
        <div className="form-shell glass-card">
          <h2 className="form-title">Set New Password</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="email"
              type="email"
              className="form-input"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              name="otp"
              className="form-input"
              placeholder="OTP"
              value={form.otp}
              onChange={handleChange}
              required
            />
            <input
              name="newPassword"
              type="password"
              className="form-input"
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleChange}
              required
            />
            <button type="submit" className="btn">Reset</button>
          </form>
          {message && (
            <div className={`alert ${message.toLowerCase().includes("failed") ? "" : "success"}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
