import React from 'react';
import './PageStyles.css';

const AnalyticsPage = ({ calendarConnected }) => {
  return (
    <div className="page-container">
      <header className="page-header flex-between">
        <div>
          <h1 className="gradient-text">Productivity Analytics</h1>
          <p className="subtitle">Deep dive into your performance metrics.</p>
        </div>
        <div>
          {calendarConnected ? (
            <span className="cal-badge-large active">⚡ Sync Active</span>
          ) : (
            <span className="cal-badge-large demo">📊 Demo Analytics</span>
          )}
        </div>
      </header>

      {/* Top Level Cards */}
      <div className="analytics-grid">
        <div className="glass-panel metric-card flex-between">
          <div>
            <span className="metric-label">Focus Hours Today</span>
            <h2 className="metric-value">6.5 <span className="metric-unit">hrs</span></h2>
          </div>
          <span className="metric-icon green">⚡</span>
        </div>

        <div className="glass-panel metric-card flex-between">
          <div>
            <span className="metric-label">Task Completion Rate</span>
            <h2 className="metric-value">92<span className="metric-unit">%</span></h2>
          </div>
          <span className="metric-icon purple">🎯</span>
        </div>

        <div className="glass-panel metric-card flex-between">
          <div>
            <span className="metric-label">Meetings Attended</span>
            <h2 className="metric-value">{calendarConnected ? "2" : "3"} <span className="metric-unit">events</span></h2>
          </div>
          <span className="metric-icon pink">📅</span>
        </div>
      </div>

      {/* Main Charts & Insight Section */}
      <div className="analytics-details-grid">
        <div className="glass-panel chart-card">
          <h3>Daily Focus Distribution</h3>
          <p className="subtitle">Minutes of high-focus deep work per day</p>
          <div className="bar-chart-container">
            <div className="chart-bar-group">
              <div className="chart-bar" style={{ height: '70%' }}>
                <span className="bar-value">280m</span>
              </div>
              <span className="bar-label">Mon</span>
            </div>
            <div className="chart-bar-group">
              <div className="chart-bar" style={{ height: '85%' }}>
                <span className="bar-value">340m</span>
              </div>
              <span className="bar-label">Tue</span>
            </div>
            <div className="chart-bar-group">
              <div className="chart-bar" style={{ height: '55%' }}>
                <span className="bar-value">220m</span>
              </div>
              <span className="bar-label">Wed</span>
            </div>
            <div className="chart-bar-group">
              <div className="chart-bar" style={{ height: '95%' }}>
                <span className="bar-value">380m</span>
              </div>
              <span className="bar-label">Thu</span>
            </div>
            <div className="chart-bar-group">
              <div className="chart-bar" style={{ height: '40%' }}>
                <span className="bar-value">160m</span>
              </div>
              <span className="bar-label">Fri</span>
            </div>
          </div>
        </div>

        <div className="glass-panel chart-card flex-column">
          <h3>Time Allocation</h3>
          <p className="subtitle">Categorization of scheduled events</p>

          <div className="progress-list">
            <div className="progress-item">
              <div className="flex-between">
                <span>Deep Work / Tasks</span>
                <span>65%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '65%', background: 'var(--accent-primary)' }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="flex-between">
                <span>Meetings & Collaboration</span>
                <span>{calendarConnected ? '20%' : '25%'}</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: calendarConnected ? '20%' : '25%', background: 'var(--accent-secondary)' }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="flex-between">
                <span>Admin & Planning</span>
                <span>{calendarConnected ? '15%' : '10%'}</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: calendarConnected ? '15%' : '10%', background: 'var(--accent-tertiary)' }}></div>
              </div>
            </div>
          </div>

          <div className="ai-report-card glass-panel-inner mt-lg">
            <h4>💡 AI Optimization Recommendation</h4>
            <p className="desc mt-xs">
              {calendarConnected
                ? "UREM has analyzed your synchronized Google Calendar events. We recommend moving your Thursday sync meeting to Friday morning to secure a 4-hour uninterrupted block of focus time."
                : "Connect your Google Calendar to enable our AI algorithms to calculate conflict indices and recommend specific time blocks that suit your cognitive high periods."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
