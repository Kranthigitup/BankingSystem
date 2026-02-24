import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Transfer() {

  const navigate = useNavigate();

  // ✅ Hooks must always be at top
  const [user, setUser] = useState(null);
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Load user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!storedUser || !token) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  // ✅ After hooks, then condition
  if (!user) {
    return <h2>Loading...</h2>;
  }

  const handleTransfer = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post(
        `/users/transfer?fromAccount=${user.accountNumber}&toAccount=${toAccount}&amount=${Number(amount)}`
      );

      const data = response.data;

      localStorage.setItem("user", JSON.stringify(data));

      setMessage("✅ Transfer Successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {
      setMessage("❌ Transfer Failed");
    }
  };

  return (
    <div className="app-shell">
      <div className="container-xl">
        <div className="form-shell glass-card">
          <h2 className="form-title">Transfer Funds</h2>
          <p className="form-note">From: {user.accountNumber}</p>
          <div className="balance-pill">Current Balance: ₹ {user.balance}</div>

          {message && (
            <div className={`alert ${message.startsWith("❌") ? "" : "success"}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleTransfer}>
            <input
              className="form-input"
              placeholder="Receiver Account Number"
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              required
            />

            <input
              type="number"
              className="form-input"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <button type="submit" className="btn">Transfer</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Transfer;
