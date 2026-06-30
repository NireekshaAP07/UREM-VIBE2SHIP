import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  initializeGoogleAPI,
  initializeTokenClient,
  loginWithGoogle,
  logoutFromGoogle,
  GOOGLE_CLIENT_ID,
} from '../services/aiService';
import { useTheme, themes } from './ThemeContext';
import './Sidebar.css';

const Sidebar = ({ onCalendarConnected, isOpen, setIsOpen }) => {
  const [calendarStatus, setCalendarStatus] = useState('idle'); // idle | connecting | connected | error
  const [userName, setUserName] = useState(null);

  const { currentThemeId, customThemeColors, selectTheme, updateCustomTheme } = useTheme();
  const [isThemeExpanded, setIsThemeExpanded] = useState(false);

  // Auto-expand theme settings if the theme is set to Custom
  useEffect(() => {
    if (currentThemeId === 'custom') {
      setIsThemeExpanded(true);
    }
  }, [currentThemeId]);

  const handleCustomChange = (key, value) => {
    updateCustomTheme({
      ...customThemeColors,
      [key]: value
    });
  };

  useEffect(() => {
    // Initialize Google API in the background
    initializeGoogleAPI().then(() => {
      if (GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE')) {
        initializeTokenClient(
          (response) => {
            // Success: token received, fetch user info
            setCalendarStatus('connected');
            if (onCalendarConnected) onCalendarConnected(true);
          },
          (error) => {
            console.error("Auth error:", error);
            setCalendarStatus('error');
          }
        );
      }
    });
  }, []);

  const handleConnect = () => {
    if (GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE')) {
      alert('Please add your Google Client ID to src/services/aiService.js first!');
      return;
    }
    setCalendarStatus('connecting');
    loginWithGoogle();
  };

  const handleDisconnect = () => {
    logoutFromGoogle();
    setCalendarStatus('idle');
    if (onCalendarConnected) onCalendarConnected(false);
  };

  return (
    <aside className={`sidebar glass-panel ${isOpen ? 'mobile-open' : ''}`}>
      <div className="logo-container">
        <h1 className="gradient-text">UREM</h1>
        <p className="tagline">Productivity Companion</p>
      </div>

      <nav className="nav-menu">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} end onClick={() => setIsOpen && setIsOpen(false)}>
          <span className="icon">⌘</span>
          <span className="label">Dashboard</span>
        </NavLink>
        <NavLink to="/schedule" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={() => setIsOpen && setIsOpen(false)}>
          <span className="icon">📅</span>
          <span className="label">Schedule</span>
        </NavLink>
        <NavLink to="/goals" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={() => setIsOpen && setIsOpen(false)}>
          <span className="icon">🎯</span>
          <span className="label">Goals</span>
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={() => setIsOpen && setIsOpen(false)}>
          <span className="icon">📈</span>
          <span className="label">Analytics</span>
        </NavLink>
      </nav>

      {/* Theme Customizer Panel */}
      <div className="sidebar-theme-panel glass-panel-inner">
        <div className="theme-panel-header" onClick={() => setIsThemeExpanded(!isThemeExpanded)}>
          <div className="panel-title-group">
            <span className="icon">🎨</span>
            <span className="panel-title">Theme Settings</span>
          </div>
          <span className={`expand-arrow ${isThemeExpanded ? 'open' : ''}`}>▼</span>
        </div>
        
        {isThemeExpanded && (
          <div className="theme-panel-content">
            <div className="preset-dots-container">
              {Object.values(themes).map((theme) => {
                const isActive = currentThemeId === theme.id;
                const colors = theme.id === 'custom' ? customThemeColors : theme.colors;
                return (
                  <button
                    key={theme.id}
                    className={`preset-dot-btn ${isActive ? 'active' : ''}`}
                    onClick={() => selectTheme(theme.id)}
                    title={theme.name}
                    style={{
                      background: `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentSecondary})`
                    }}
                  >
                    {isActive && <span className="active-dot-indicator" />}
                  </button>
                );
              })}
            </div>
            
            {currentThemeId === 'custom' && (
              <div className="sidebar-custom-pickers">
                <div className="sidebar-picker-field">
                  <input
                    type="color"
                    id="picker-bg"
                    value={customThemeColors.bg}
                    onChange={(e) => handleCustomChange('bg', e.target.value)}
                  />
                  <label htmlFor="picker-bg">Bg</label>
                </div>
                <div className="sidebar-picker-field">
                  <input
                    type="color"
                    id="picker-text"
                    value={customThemeColors.textPrimary}
                    onChange={(e) => handleCustomChange('textPrimary', e.target.value)}
                  />
                  <label htmlFor="picker-text">Txt</label>
                </div>
                <div className="sidebar-picker-field">
                  <input
                    type="color"
                    id="picker-primary"
                    value={customThemeColors.accentPrimary}
                    onChange={(e) => handleCustomChange('accentPrimary', e.target.value)}
                  />
                  <label htmlFor="picker-primary">Pri</label>
                </div>
                <div className="sidebar-picker-field">
                  <input
                    type="color"
                    id="picker-secondary"
                    value={customThemeColors.accentSecondary}
                    onChange={(e) => handleCustomChange('accentSecondary', e.target.value)}
                  />
                  <label htmlFor="picker-secondary">Sec</label>
                </div>
                <div className="sidebar-picker-field">
                  <input
                    type="color"
                    id="picker-tertiary"
                    value={customThemeColors.accentTertiary}
                    onChange={(e) => handleCustomChange('accentTertiary', e.target.value)}
                  />
                  <label htmlFor="picker-tertiary">Acc</label>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Google Calendar Connection Panel */}
      <div className="calendar-connect-panel glass-panel-inner">
        {calendarStatus === 'connected' ? (
          <>
            <div className="connected-status">
              <span className="status-dot active"></span>
              <span>Google Calendar</span>
            </div>
            <p className="connect-sub">Connected & syncing</p>
            <button className="disconnect-btn" onClick={handleDisconnect}>Disconnect</button>
          </>
        ) : (
          <>
            <p className="connect-label">
              <span>📆</span> Connect your calendar for real-time AI scheduling
            </p>
            <button
              className={`connect-btn ${calendarStatus === 'connecting' ? 'loading' : ''}`}
              onClick={handleConnect}
              disabled={calendarStatus === 'connecting'}
            >
              {calendarStatus === 'connecting' ? 'Connecting...' : 'Connect Google Calendar'}
            </button>
            {calendarStatus === 'error' && (
              <p className="connect-error">Connection failed. Please try again.</p>
            )}
          </>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">U</div>
          <div className="user-info">
            <span className="name">{userName || 'User'}</span>
            <span className="status">● Productive</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
