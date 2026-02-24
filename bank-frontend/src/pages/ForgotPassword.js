import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setResetMessage("");
    setOtp("");
    try {
      const res = await API.post("/auth/request-reset", { email });
      setMessage(res.data.message);
      if (res.data.otp) {
        setOtp(res.data.otp);
      }
    } catch {
      setMessage("Request failed");
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setResetMessage("");
    try {
      await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      setResetMessage("Password reset successful");
      setOtp("");
      setNewPassword("");
      navigate("/dashboard");
    } catch {
      setResetMessage("Reset failed");
    }
  };

  return (
    <div className="app-shell">
      <div className="container-xl">
        <div className="form-shell glass-card">
          <h2 className="form-title">Reset Access</h2>
          <p className="form-note">We will generate a one-time OTP link (dev).</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className="form-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn">Send OTP</button>
          </form>
          {message && (
            <div className={`alert ${message.toLowerCase().includes("failed") ? "" : "success"}`}>
              {message}
            </div>
          )}
          {otp && <div className="alert">OTP (dev only): {otp}</div>}
          <form onSubmit={handleReset}>
            <input
              type="text"
              className="form-input"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              className="form-input"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn">Reset Password</button>
          </form>
          {resetMessage && (
            <div className={`alert ${resetMessage.toLowerCase().includes("failed") ? "" : "success"}`}>
              {resetMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;