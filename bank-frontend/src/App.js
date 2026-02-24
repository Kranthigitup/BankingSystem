import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import "./App.css";
import API from "./services/api";
import LoadingScreen from "./components/LoadingScreen";

const Home = lazy(() => import("./pages/Home"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Deposit = lazy(() => import("./pages/Deposit"));
const Withdraw = lazy(() => import("./pages/Withdraw"));
const Transfer = lazy(() => import("./pages/Transfer"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

function App() {
  useEffect(() => {
    const refresh = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      try {
        const res = await API.post("/auth/refresh");
        localStorage.setItem("token", res.data.token);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };

    const intervalId = setInterval(refresh, 4 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Router>
      <Suspense
        fallback={<LoadingScreen />}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
