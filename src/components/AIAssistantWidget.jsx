import React, { useState, useEffect, useRef } from 'react';
import { getProactiveInsight, chatWithAssistant, fetchCalendarEvents } from '../services/aiService';
import './AIAssistantWidget.css';

const AIAssistantWidget = ({ calendarConnected }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch calendar events and get proactive insight on load or when calendar connects
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const events = await fetchCalendarEvents();
      setCalendarEvents(events);
      const insight = await getProactiveInsight(events);
      if (insight) {
        setMessages([insight]);
      }
      setIsLoading(false);
    };
    loadData();
  }, [calendarConnected]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg = { type: 'user', message: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const responseText = await chatWithAssistant(userMsg.message);
    setMessages(prev => [...prev, { type: 'assistant', message: responseText }]);
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const getIcon = (type) => {
    if (type === 'suggestion') return '💡';
    if (type === 'user') return '👤';
    return '🤖';
  };

  return (
    <div className={`ai-widget glass-panel ${isOpen ? 'open' : 'closed'}`}>
      <div className="ai-widget-header flex-between" onClick={() => setIsOpen(!isOpen)}>
        <div className="ai-title">
          <span className="ai-icon pulse">🤖</span>
          <span className="gradient-text">UREM Assistant</span>
          {calendarConnected && <span className="cal-badge">📆 Live</span>}
        </div>
        <button className="toggle-btn">{isOpen ? '▼' : '▲'}</button>
      </div>

      {isOpen && (
        <div className="ai-content">

          {/* Calendar events preview strip */}
          {calendarEvents.length > 0 && (
            <div className="events-strip">
              <p className="events-label">Today's Events</p>
              <div className="events-list">
                {calendarEvents.slice(0, 3).map(evt => (
                  <div className="event-chip" key={evt.id}>
                    <span className="event-dot"></span>
                    <span>{evt.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="messages-container">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`ai-message ${msg.type} animate-fade-in`}
              >
                <div className="message-icon">{getIcon(msg.type)}</div>
                <div className="message-text">
                  {msg.title && <><strong>{msg.title}:</strong>{' '}</>}
                  {msg.message}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="ai-message assistant typing-indicator">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-input-container">
            <input
              type="text"
              id="ai-chat-input"
              placeholder="Ask me to schedule a task or check your calendar..."
              className="ai-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="send-btn" onClick={handleSend} id="ai-send-btn">↑</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistantWidget;
