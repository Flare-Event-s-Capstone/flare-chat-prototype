import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './login/LoginPage.jsx'
import CreateUserPage from './login/CreateUserPage.jsx'
import ResetPassword from './login/ResetPassword.jsx'
import ResetSent from './login/ResetSent.jsx'
import ResetPasswordLink from './login/ResetPasswordLink.jsx'
import Dashboard from './dashboard/Dashboard.jsx'
import EventsPanel from './dashboard/EventsPanel.jsx'
import SettingsPanel from './dashboard/SettingsPanel.jsx'
import MatchesPanel from './dashboard/MatchesPanel.jsx'
import ChatPage from './components/ChatPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/create-user" element={<CreateUserPage />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/reset/sent" element={<ResetSent />} />
        <Route path="/reset/:resetToken" element={<ResetPasswordLink />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<MatchesPanel />} />
          <Route path="settings" element={<SettingsPanel />} />
          <Route path="events" element={<EventsPanel />} />
          <Route path="chat/:matchid" element={<ChatPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
