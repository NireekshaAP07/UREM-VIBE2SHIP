import React, { useState, useEffect } from 'react';
import { fetchCalendarEvents } from '../services/aiService';
import './PageStyles.css';

const SchedulePage = ({ calendarConnected }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getEvents = async () => {
      setIsLoading(true);
      const data = await fetchCalendarEvents();
      setEvents(data);
      setIsLoading(false);
    };
    getEvents();
  }, [calendarConnected]);

  const formatTime = (timeStr) => {
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timeStr;
    }
  };

  const formatDate = (timeStr) => {
    try {
      const date = new Date(timeStr);
      return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
    } catch (e) {
      return 'Today';
    }
  };

  return (
    <div className="page-container">
      <header className="page-header flex-between">
        <div>
          <h1 className="gradient-text">Schedule Explorer</h1>
          <p className="subtitle">Your AI-optimized timeline for the week.</p>
        </div>
        <div>
          {calendarConnected ? (
            <span className="cal-badge-large active">📆 Connected to Google Calendar</span>
          ) : (
            <span className="cal-badge-large demo">🛠️ Demo Mode (Using Mock Events)</span>
          )}
        </div>
      </header>

      {isLoading ? (
        <div className="schedule-loading glass-panel">
          <div className="typing-indicator">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <p>Syncing calendar timelines...</p>
        </div>
      ) : (
        <div className="schedule-timeline">
          {events.length === 0 ? (
            <div className="empty-state glass-panel">
              <span className="icon">🗓️</span>
              <h3>No Upcoming Events</h3>
              <p>Your calendar is completely clear! Or connect your Google Calendar in the sidebar to sync your agenda.</p>
            </div>
          ) : (
            events.map((evt) => (
              <div className="timeline-card glass-panel animate-fade-in" key={evt.id}>
                <div className="timeline-date">{formatDate(evt.start)}</div>
                <div className="timeline-card-content">
                  <div className="timeline-time-block">
                    <span className="time-badge">{formatTime(evt.start)} - {formatTime(evt.end)}</span>
                  </div>
                  <div className="timeline-card-details">
                    <h3>{evt.title}</h3>
                    {evt.description && <p className="desc">{evt.description}</p>}
                  </div>
                  {evt.link && evt.link !== '#' && (
                    <a href={evt.link} target="_blank" rel="noopener noreferrer" className="view-event-btn">
                      View in Calendar ↗
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
