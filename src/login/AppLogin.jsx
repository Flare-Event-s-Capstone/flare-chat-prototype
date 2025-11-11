import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import ResetPassword from "./ResetPassword";
import ResetSent from "./ResetSent";
import MessagingApp from "../App";

function AppLogin() {
  return (
    <Router>
      <Routes>
        {/* Login page */}
        <Route path="/" element={<LoginPage />} />

        {/* Forgot password page */}
        <Route path="/reset" element={<ResetPassword />} />

        {/* Reset confirmation page */}
        <Route path="/reset-sent" element={<ResetSent />} />

        {/* Dashboard after successful login */}
        <Route path="/dashboard" element={<MessagingApp />} />
      </Routes>
    </Router>
  );
}

export default AppLogin;