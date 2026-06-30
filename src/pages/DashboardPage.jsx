import React from 'react';
import TaskCard from '../components/TaskCard';
import AIAssistantWidget from '../components/AIAssistantWidget';
import './DashboardPage.css';

const Dashboard = ({ calendarConnected }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  return (
    <div className="dashboard">
      <header className="dashboard-header flex-between">
        <div>
          <h2 className="greeting">{greeting}, User</h2>
          <p className="subtitle">UREM has optimized your day for maximum productivity.</p>
        </div>
        <div className="header-actions">
          <button className="glass-btn">+ New Task</button>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="main-column">
          <AIAssistantWidget calendarConnected={calendarConnected} />
          
          <section className="task-section mt-xl">
            <div className="section-header flex-between">
              <h3>Priority Queue</h3>
              <span className="badge">AI Sorted</span>
            </div>
            
            <div className="task-grid">
              <TaskCard 
                title="Finalize Q3 Marketing Report" 
                time="10:00 AM - 12:00 PM" 
                priority="High" 
                category="Work"
                status="Pending"
              />
              <TaskCard 
                title="Team Sync: Product Launch" 
                time="1:00 PM - 2:00 PM" 
                priority="Medium" 
                category="Meeting"
                status="Pending"
              />
              <TaskCard 
                title="Review Design Mockups" 
                time="2:30 PM - 3:15 PM" 
                priority="Low" 
                category="Design"
                status="AI Suggested"
              />
            </div>
          </section>
        </div>
        
        <div className="side-column">
          <section className="stats-section glass-panel">
            <h3>Productivity Score</h3>
            <div className="score-circle">
              <span className="score-value">92</span>
              <svg className="progress-ring" width="120" height="120">
                <circle stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="transparent" r="52" cx="60" cy="60"/>
                <circle className="progress-ring__circle" stroke="var(--accent-primary)" strokeWidth="8" strokeDasharray="326" strokeDashoffset="26" fill="transparent" r="52" cx="60" cy="60"/>
              </svg>
            </div>
            <p className="score-text">Top 5% of your past weeks. Keep it up!</p>
          </section>
          
          <section className="upcoming-section glass-panel mt-md">
            <h3>Up Next</h3>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot active"></div>
                <div className="timeline-content">
                  <div className="time">10:00 AM</div>
                  <div className="title">Q3 Marketing Report</div>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="time">1:00 PM</div>
                  <div className="title">Team Sync</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
