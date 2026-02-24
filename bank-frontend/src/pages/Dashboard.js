import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  if (!userData || !token) {
    return <h2 className="text-center mt-5">Please login first</h2>;
  }

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [meRes, txRes] = await Promise.all([
          API.get("/users/me"),
          API.get("/users/transactions")
        ]);
        if (!active) {
          return;
        }
        setUserData(meRes.data);
        localStorage.setItem("user", JSON.stringify(meRes.data));
        setTransactions(txRes.data || []);
      } catch (error) {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          setMessage("Session expired. Please log in again.");
          setTimeout(() => navigate("/login"), 800);
          return;
        }
        const backendMessage = error?.response?.data?.message;
        setMessage(backendMessage ? `Failed to load data: ${backendMessage}` : "Failed to load data.");
      }
    };

    const refresh = async () => {
      try {
        const res = await API.post("/auth/refresh");
        localStorage.setItem("token", res.data.token);
      } catch (error) {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    load();
    const intervalId = setInterval(refresh, 4 * 60 * 1000);
    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="app-shell">
      <div className="container-xl">
        <div className="nav-blur">
          <div className="brand">
            <div className="brand-badge">KB</div>
            <div>
              <div>Personal Dashboard</div>
              <div className="form-note">Welcome back, {userData.name}</div>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
        </div>

        <section className="hero" style={{ marginTop: "24px" }}>
          <div className="hero-copy">
            <h1>Your money in motion.</h1>
            <p>Real-time balance, instant transfers, secure actions.</p>
            <div className="balance-pill">Available Balance: Rs {userData.balance}</div>
            <div style={{ marginTop: "16px" }} className="hero-actions">
              <button className="btn" onClick={() => navigate("/deposit")}>Deposit</button>
              <button className="btn btn-ghost" onClick={() => navigate("/withdraw")}>Withdraw</button>
              <button className="btn btn-ghost" onClick={() => navigate("/transfer")}>Transfer</button>
              <button className="btn btn-ghost" onClick={() => navigate("/change-password")}>Change Password</button>
            </div>
          </div>
          <div className="hero-visual">
            <img src="/assets/charts.jpg" alt="Finance charts" loading="lazy" decoding="async" />
            <div className="hero-overlay" />
          </div>
        </section>

        {message && <div className="alert">{message}</div>}

        <div className="dashboard-grid">
          <div className="glass-card">
            <h3>Account Overview</h3>
            <p className="form-note">Primary savings account</p>
            <div style={{ marginTop: "12px" }}>
              <div><strong>Account No:</strong> {userData.accountNumber}</div>
              <div><strong>Branch:</strong> Hyderabad Main</div>
            </div>
          </div>
          <div className="glass-card">
            <h3>Security Status</h3>
            <p className="form-note">JWT session auto-refresh</p>
            <div style={{ marginTop: "12px" }}>
              <div>2-step reset with OTP</div>
              <div>Password hashing: BCrypt</div>
            </div>
          </div>
          <div className="glass-card">
            <h3>Quick Actions</h3>
            <div className="action-card">
              <button className="btn" onClick={() => navigate("/deposit")}>Add Funds</button>
              <button className="btn btn-ghost" onClick={() => navigate("/transfer")}>Send Money</button>
              <button className="btn btn-ghost" onClick={() => navigate("/withdraw")}>Cash Out</button>
            </div>
          </div>
        </div>

        <div className="admin-section glass-card" style={{ marginTop: "24px" }}>
          <h3>Transaction History</h3>
          {transactions.length === 0 ? (
            <p className="form-note">No transactions yet.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.type}</td>
                    <td>{t.amount}</td>
                    <td>{t.fromAccount}</td>
                    <td>{t.toAccount}</td>
                    <td>{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
