import React, { useState } from 'react';
import './PageStyles.css';

const GoalsPage = ({ calendarConnected }) => {
  const [habits, setHabits] = useState([
    { id: 1, name: "Deep Work (2+ Hours)", current: 3, target: 5, category: "Work" },
    { id: 2, name: "Daily Planning Session", current: 4, target: 5, category: "Productivity" },
    { id: 3, name: "Inbox Zero (Email / Slack)", current: 2, target: 3, category: "Communication" },
  ]);

  const handleIncrement = (id) => {
    setHabits(prevHabits =>
      prevHabits.map(habit => {
        if (habit.id === id && habit.current < habit.target) {
          return { ...habit, current: habit.current + 1 };
        }
        return habit;
      })
    );
  };

  const handleReset = (id) => {
    setHabits(prevHabits =>
      prevHabits.map(habit => {
        if (habit.id === id) {
          return { ...habit, current: 0 };
        }
        return habit;
      })
    );
  };

  return (
    <div className="page-container">
      <header className="page-header flex-between">
        <div>
          <h1 className="gradient-text">Goals & Habits</h1>
          <p className="subtitle">Track your long-term progress with AI coaching.</p>
        </div>
        <div>
          {calendarConnected ? (
            <span className="cal-badge-large active">🎯 Sync Active</span>
          ) : (
            <span className="cal-badge-large demo">💡 Habit Coaching Mode</span>
          )}
        </div>
      </header>

      <div className="analytics-details-grid">
        {/* Habit Trackers */}
        <div className="glass-panel chart-card">
          <h3>Active Habit Tracker</h3>
          <p className="subtitle">Tick off your daily habit completions</p>
          
          <div className="habits-list mt-md">
            {habits.map(habit => {
              const percentage = Math.round((habit.current / habit.target) * 100);
              return (
                <div className="habit-row glass-panel-inner" key={habit.id}>
                  <div className="habit-info flex-between">
                    <div>
                      <span className="habit-category-badge">{habit.category}</span>
                      <h4>{habit.name}</h4>
                    </div>
                    <div className="habit-stats">
                      <strong>{habit.current}</strong> / {habit.target} days ({percentage}%)
                    </div>
                  </div>
                  
                  <div className="progress-bar-bg mt-sm">
                    <div 
                      className="progress-bar-fill" 
                      style={{ 
                        width: `${percentage}%`, 
                        background: percentage === 100 ? 'var(--success)' : 'var(--accent-primary)' 
                      }}
                    ></div>
                  </div>
                  
                  <div className="habit-actions flex-between mt-sm">
                    <button 
                      className="glass-btn xs primary" 
                      onClick={() => handleIncrement(habit.id)}
                      disabled={habit.current >= habit.target}
                    >
                      {habit.current >= habit.target ? "✓ Complete" : "+ Log Day"}
                    </button>
                    <button 
                      className="glass-btn xs text" 
                      onClick={() => handleReset(habit.id)}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Coaching Feed */}
        <div className="glass-panel chart-card flex-column">
          <h3>AI Habit Coaching</h3>
          <p className="subtitle">Personalized feedback and adaptive targets</p>
          
          <div className="coaching-feed mt-md flex-column">
            <div className="coaching-card glass-panel-inner suggestion">
              <div className="coaching-header flex-between">
                <span>⚡ Deep Work Focus</span>
                <span className="coach-badge tip">Pro Tip</span>
              </div>
              <p className="desc mt-xs">
                You've successfully completed 3 Deep Work blocks this week. 
                {calendarConnected 
                  ? " Looking at your Google Calendar, Friday morning between 9 AM and 11 AM has no scheduled meetings. This is a perfect slot to hit your 4th block!"
                  : " Try scheduling your 4th block on Friday morning. If you connect your Google Calendar, I can automatically search for open slots."
                }
              </p>
            </div>

            <div className="coaching-card glass-panel-inner caution mt-md">
              <div className="coaching-header flex-between">
                <span>⚠️ Inbox Distraction</span>
                <span className="coach-badge alert">Alert</span>
              </div>
              <p className="desc mt-xs">
                Your daily log shows you are checking Slack/Email frequently during focus blocks. We suggest keeping communication clients minimized except during scheduled intervals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;
