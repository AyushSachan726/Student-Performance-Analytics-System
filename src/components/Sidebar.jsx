import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  Users,
  BarChart2,
  BookOpen,
  Trophy,
  FileText,
  Settings,
  LogOut,
  GraduationCap,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutGrid, label: 'Dashboard' },
  { to: '/students', icon: Users, label: 'Students' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/subjects', icon: BookOpen, label: 'Subjects' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { to: '/reports', icon: FileText, label: 'Reports' },
];

export default function Sidebar({ onOpenSettings }) {
  function handleLogout() {
    if (window.confirm('Are you sure you want to sign out of the EduAnalytics session?')) {
      window.location.href = '/';
    }
  }

  return (
    <aside className="app-sidebar">
      {/* Brand Icon (Clean, no neon glow) */}
      <div className="sidebar-brand" title="EduAnalytics">
        <GraduationCap />
      </div>

      {/* Main Navigation Stack */}
      <nav className="sidebar-nav-stack">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `sidebar-icon-btn${isActive ? ' active' : ''}`}
            data-tooltip={label}
          >
            <Icon />
          </NavLink>
        ))}
      </nav>

      {/* Bottom Icons (Settings & Logout) */}
      <div className="sidebar-bottom">
        <button
          type="button"
          className="sidebar-icon-btn"
          data-tooltip="Settings"
          onClick={onOpenSettings}
        >
          <Settings />
        </button>
        <button
          type="button"
          className="sidebar-icon-btn"
          data-tooltip="Sign Out"
          onClick={handleLogout}
        >
          <LogOut />
        </button>
      </div>
    </aside>
  );
}
