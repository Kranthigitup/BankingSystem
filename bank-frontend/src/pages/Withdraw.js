import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Withdraw() {

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

  const handleWithdraw = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post(
        `/users/withdraw?accountNumber=${user.accountNumber}&amount=${amount}`
      );

      const data = response.data;

      localStorage.setItem("user", JSON.stringify(data));

      setMessage("✅ Withdraw Successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {
      setMessage("❌ " + (error.response?.data || "Withdraw Failed"));
    }
  };

  return (
    <div className="app-shell">
      <div className="container-xl">
        <div className="form-shell glass-card">
          <h2 className="form-title">Withdraw Funds</h2>
          <p className="form-note">Account: {user.accountNumber}</p>
          <div className="balance-pill">Current Balance: ₹ {user.balance}</div>

          {message && (
            <div className={`alert ${message.startsWith("❌") ? "" : "success"}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleWithdraw}>
            <input
              type="number"
              className="form-input"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <button type="submit" className="btn">Withdraw</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Withdraw;
