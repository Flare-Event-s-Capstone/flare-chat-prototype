import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './login/LoginPage.jsx'
import ResetPassword from './login/ResetPassword.jsx'
import ResetSent from './login/ResetSent.jsx'
import App from './App.jsx' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/flare-chat-prototype">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/reset/sent" element={<ResetSent />} />
        <Route path="/dashboard" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)