import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Deposit() {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!storedUser || !token) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  if (!user) {
    return <h2>Loading...</h2>;
  }

  const handleDeposit = async (e) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setMessage("Deposit failed: enter an amount greater than 0.");
      return;
    }
    try {
      const response = await API.post(
        `/users/deposit?accountNumber=${user.accountNumber}&amount=${numericAmount}`
      );

      const data = response.data;

      // Update localStorage with new balance
      localStorage.setItem("user", JSON.stringify(data));

      setMessage("Deposit successful.");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        setMessage("Session expired. Please log in again.");
        setTimeout(() => navigate("/login"), 800);
        return;
      }
      const backendMessage = error?.response?.data?.message;
      setMessage(backendMessage ? `Deposit failed: ${backendMessage}` : "Deposit failed.");
    }
  };

  return (
    <div className="app-shell">
      <div className="container-xl">
        <div className="form-shell glass-card">
          <h2 className="form-title">Deposit Funds</h2>
          <p className="form-note">Account: {user.accountNumber}</p>
          <div className="balance-pill">Current Balance: Rs {user.balance}</div>

          {message && (
            <div className={`alert ${message.startsWith("Deposit failed") || message.startsWith("Session expired") ? "" : "success"}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleDeposit}>
            <input
              type="number"
              className="form-input"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <button type="submit" className="btn">Deposit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Deposit;

