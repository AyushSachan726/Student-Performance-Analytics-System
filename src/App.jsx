import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentDetail from './pages/StudentDetail';
import Analytics from './pages/Analytics';
import Subjects from './pages/Subjects';
import Leaderboard from './pages/Leaderboard';
import Reports from './pages/Reports';
import SettingsModal from './components/SettingsModal';
import NotificationsPopover from './components/NotificationsPopover';
import { getSettings } from './data/students';

const PAGE_TITLES = {
  '/': 'Academic Dashboard',
  '/students': 'Students Directory',
  '/analytics': 'Performance Analytics',
  '/subjects': 'Subjects Breakdown',
  '/leaderboard': 'Student Leaderboard',
  '/reports': 'Reports & Transcripts',
};

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settings, setSettings] = useState(getSettings());
  const location = useLocation();
  const currentTitle = PAGE_TITLES[location.pathname] || 'Student Analytics';

  const todayStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="dashboard-shell">
      <Sidebar onOpenSettings={() => setSettingsOpen(true)} />

      <main className="main-canvas">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-greeting">
            <h1>Welcome back, Professor!</h1>
            <p>{todayStr} • {settings.schoolName || 'St. Xavier'} • {currentTitle}</p>
          </div>

          <div className="header-right-actions" style={{ position: 'relative' }}>
            <button
              type="button"
              className="notification-bell-btn"
              title="Notifications"
              onClick={() => setNotificationsOpen((o) => !o)}
            >
              <Bell size={19} />
              <span className="notification-dot" />
            </button>

            {/* Real Notifications Popover */}
            <NotificationsPopover
              isOpen={notificationsOpen}
              onClose={() => setNotificationsOpen(false)}
            />

            <div
              className="user-profile-pill"
              onClick={() => setSettingsOpen(true)}
              style={{ cursor: 'pointer' }}
              title="Click to open preferences"
            >
              <div className="user-profile-avatar">EA</div>
              <div className="user-profile-text">
                <div className="user-profile-name">Dr. Evans</div>
                <div className="user-profile-role">Head of Academics</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Real Functional Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          setSettings(getSettings());
        }}
        onDataReset={() => setSettings(getSettings())}
      />
    </div>
  );
}
