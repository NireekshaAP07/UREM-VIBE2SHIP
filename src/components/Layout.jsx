import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children, onCalendarConnected }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout-container">
      {/* Mobile Header */}
      <div className="mobile-header">
        <h1 className="gradient-text">UREM</h1>
        <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
      </div>

      <Sidebar onCalendarConnected={onCalendarConnected} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <main className="main-content animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default Layout;
