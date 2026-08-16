import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import ToastStack from './components/ToastStack.jsx';
import ChatWidget from './components/ChatWidget.jsx';
import { useAuth } from './context/AuthContext.jsx';

import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Schedule from './pages/Schedule.jsx';
import Track from './pages/Track.jsx';
import RecyclingGuide from './pages/RecyclingGuide.jsx';
import Rewards from './pages/Rewards.jsx';
import Marketplace from './pages/Marketplace.jsx';
import GreenServices from './pages/GreenServices.jsx';
import Report from './pages/Report.jsx';
import Account from './pages/Account.jsx';
import About from './pages/About.jsx';

export default function App() {
  const { isAuthenticated, checking } = useAuth();

  if (checking) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-mark">ZL</div>
        <p>Loading ZeroLoop…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/track" element={<Track />} />
            <Route path="/guide" element={<RecyclingGuide />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/green-services" element={<GreenServices />} />
            <Route path="/report" element={<Report />} />
            <Route path="/account" element={<Account />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
      <ToastStack />
      <ChatWidget />
    </div>
  );
}
