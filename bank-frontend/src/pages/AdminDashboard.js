import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminAPI from "../services/adminApi";

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [resetForm, setResetForm] = useState({ email: "", newPassword: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    const getErrorMessage = (error, fallback) => {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        return "Session expired. Please log in again.";
      }
      const backendMessage = error?.response?.data?.message;
      return backendMessage ? `Failed to load admin data: ${backendMessage}` : fallback;
    };
    const load = async () => {
      const results = await Promise.allSettled([
        adminAPI.get("/admin/users"),
        adminAPI.get("/admin/accounts"),
        adminAPI.get("/admin/transactions")
      ]);

      const errors = [];
      const [usersRes, accountsRes, transactionsRes] = results;

      if (usersRes.status === "fulfilled") {
        setUsers(usersRes.value.data);
      } else {
        errors.push(getErrorMessage(usersRes.reason, "Failed to load users."));
      }

      if (accountsRes.status === "fulfilled") {
        setAccounts(accountsRes.value.data);
      } else {
        errors.push(getErrorMessage(accountsRes.reason, "Failed to load accounts."));
      }

      if (transactionsRes.status === "fulfilled") {
        setTransactions(transactionsRes.value.data);
      } else {
        errors.push(getErrorMessage(transactionsRes.reason, "Failed to load transactions."));
      }

      const hasSessionExpired = errors.some((e) => e.startsWith("Session expired"));
      if (hasSessionExpired) {
        setMessage("Session expired. Please log in again.");
        return;
      }

      if (errors.length > 0) {
        setMessage(errors.join(" "));
      }
    };
    load();

    return undefined;
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const handleResetChange = (e) =>
    setResetForm({ ...resetForm, [e.target.name]: e.target.value });

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await adminAPI.post("/admin/reset-password", resetForm);
      setMessage("Password reset successful");
      setResetForm({ email: "", newPassword: "" });
    } catch {
      setMessage("Password reset failed");
    }
  };

  const handleDeleteUser = async (userId, accountNumber) => {
    const ok = window.confirm("Delete this user? This will remove their accounts and transactions.");
    if (!ok) {
      return;
    }
    setMessage("");
    try {
      await adminAPI.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setAccounts((prev) => prev.filter((a) => a.userId !== userId));
      if (accountNumber) {
        setTransactions((prev) =>
          prev.filter((t) => t.fromAccount !== accountNumber && t.toAccount !== accountNumber)
        );
      }
      setMessage("User deleted");
    } catch (error) {
      const backendMessage = error?.response?.data?.message;
      setMessage(backendMessage ? `Delete failed: ${backendMessage}` : "Delete failed");
    }
  };

  return (
    <div className="app-shell">
      <div className="container-xl">
        <div className="nav-blur">
          <div className="brand">
            <div className="brand-badge">AD</div>
            <div>
              <div>Admin Control Center</div>
              <div className="form-note">Full system visibility</div>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
        </div>

        {message && <div className="alert">{message}</div>}

        <div className="admin-section glass-card">
          <h3>Reset User Password</h3>
          <form onSubmit={handleResetPassword}>
            <input
              name="email"
              className="form-input"
              placeholder="User Email"
              value={resetForm.email}
              onChange={handleResetChange}
              required
            />
            <input
              type="password"
              name="newPassword"
              className="form-input"
              placeholder="New Password"
              value={resetForm.newPassword}
              onChange={handleResetChange}
              required
            />
            <button type="submit" className="btn">Reset</button>
          </form>
        </div>

        <div className="admin-section glass-card">
          <h3>Users</h3>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Last Login</th>
                <th>Account</th>
                <th>Balance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.createdAt || "-"}</td>
                  <td>{u.lastLoginAt || "-"}</td>
                  <td>{u.accountNumber}</td>
                  <td>{u.balance}</td>
                  <td>
                    <button
                      className="btn btn-ghost"
                      type="button"
                      onClick={() => handleDeleteUser(u.id, u.accountNumber)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-section glass-card">
          <h3>Accounts</h3>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Account Number</th>
                <th>User ID</th>
                <th>User Email</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.accountNumber}</td>
                  <td>{a.userId}</td>
                  <td>{a.userEmail}</td>
                  <td>{a.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-section glass-card">
          <h3>Transactions</h3>
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
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
