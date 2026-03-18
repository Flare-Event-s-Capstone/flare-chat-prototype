import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./AppLogin.css";
import LoginPage from "./LoginPage";
import ResetPassword from "./ResetPassword";
import ResetSent from "./ResetSent";
import ResetPasswordLink from "./ResetPasswordLink";
import MessagingApp from "../App";

function AppLogin() {
  return (
    <Router>
      <Routes>
        {/* Login page */}
        <Route
          path="/"
          element={
            <div className="login-page">
              <LoginPage />
            </div>
          }
        />

        {/* Forgot password page */}
        <Route
          path="/reset"
          element={
            <div className="login-page">
              <ResetPassword />
            </div>
          }
        />

        {/* Reset confirmation page */}
        <Route
          path="/reset/sent"
          element={
            <div className="login-page">
              <ResetSent />
            </div>
          }
        />

        {/* Reset link page */}
        <Route
          path="/reset/:resetToken"
          element={
            <div className="login-page">
              <ResetPasswordLink />
            </div>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <div className="dashboard-page">
              <MessagingApp />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppLogin;