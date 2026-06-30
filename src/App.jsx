import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import SchedulePage from './pages/SchedulePage';
import GoalsPage from './pages/GoalsPage';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  const [calendarConnected, setCalendarConnected] = useState(false);

  return (
    <Router>
      <Layout onCalendarConnected={setCalendarConnected}>
        <Routes>
          <Route path="/" element={<DashboardPage calendarConnected={calendarConnected} />} />
          <Route path="/schedule" element={<SchedulePage calendarConnected={calendarConnected} />} />
          <Route path="/goals" element={<GoalsPage calendarConnected={calendarConnected} />} />
          <Route path="/analytics" element={<AnalyticsPage calendarConnected={calendarConnected} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
