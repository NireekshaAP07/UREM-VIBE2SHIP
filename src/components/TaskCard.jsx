import React from 'react';
import './TaskCard.css';

const TaskCard = ({ title, time, priority, category, status }) => {
  // Determine color based on priority
  const getPriorityColor = () => {
    switch (priority) {
      case 'High': return 'var(--danger)';
      case 'Medium': return 'var(--warning)';
      case 'Low': return 'var(--success)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="task-card glass-panel">
      <div className="task-header flex-between">
        <span className="category">{category}</span>
        <span 
          className="priority-indicator"
          style={{ backgroundColor: getPriorityColor() }}
        >
          {priority}
        </span>
      </div>
      
      <h3 className="task-title">{title}</h3>
      
      <div className="task-footer flex-between">
        <div className="time">
          <span className="icon">🕒</span> {time}
        </div>
        
        {status === 'AI Suggested' ? (
          <div className="ai-badge">
            <span className="sparkle">✨</span> AI Suggested
          </div>
        ) : (
          <button className="complete-btn">
            Complete
          </button>
        )}
      </div>
      
      {status === 'AI Suggested' && (
        <div className="ai-insight">
          Optimized for your peak focus hours based on past performance.
        </div>
      )}
    </div>
  );
};

export default TaskCard;
