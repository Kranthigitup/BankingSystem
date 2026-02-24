import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ChangePassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ oldPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await API.post("/auth/change-password", form);
      setMessage("Password updated");
      setForm({ oldPassword: "", newPassword: "" });
    } catch {
      setMessage("Update failed");
    }
  };

  return (
    <div className="app-shell">
      <div className="container-xl">
        <div className="form-shell glass-card">
          <h2 className="form-title">Change Password</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              name="oldPassword"
              className="form-input"
              placeholder="Old Password"
              value={form.oldPassword}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="newPassword"
              className="form-input"
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleChange}
              required
            />
            <button type="submit" className="btn">Update</button>
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

export default ChangePassword;
