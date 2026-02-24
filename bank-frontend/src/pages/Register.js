import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();   // 🔥 Step 3 (navigation function)

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/users/register", form);

      const { token, ...data } = response.data;

      // 🔥 Store user data (name, accountNumber, balance)
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", token);

      setMessage("✅ Registration Successful!");

      // Clear form
      setForm({ name: "", email: "", password: "" });

      // 🔥 Redirect to dashboard
      navigate("/dashboard", { state: data });

    } catch (error) {
      const errorMsg = typeof error.response?.data === 'string'
        ? error.response.data
        : (error.response?.data?.message || "Error occurred");
      setMessage("❌ " + errorMsg);
    }
  };

  return (
    <div className="app-shell">
      <div className="container-xl">
        <div className="form-shell glass-card">
          <h2 className="form-title">Open Your Account</h2>
          <p className="form-note">Create a secure profile in under a minute.</p>

          {message && (
            <div className={`alert ${message.startsWith("❌") ? "" : "success"}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              className="form-input"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              className="form-input"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button className="btn" type="submit">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
