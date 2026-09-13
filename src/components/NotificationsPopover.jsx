import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertTriangle, CheckCircle, Award, X } from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Students At Risk Alert',
    desc: '3 students in Class 10 & 11 scored below 55% average.',
    time: '15m ago',
    type: 'warning',
    link: '/students',
    unread: true,
  },
  {
    id: 2,
    title: 'Top Performance Milestone',
    desc: 'Kavya Iyer achieved 99% in Mathematics.',
    time: '1h ago',
    type: 'success',
    link: '/students/STU016',
    unread: true,
  },
  {
    id: 3,
    title: 'Term 1 Evaluations Ready',
    desc: 'All 30 report cards are ready for printing and dispatch.',
    time: '3h ago',
    type: 'info',
    link: '/reports',
    unread: true,
  },
];

export default function NotificationsPopover({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const popoverRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  function handleItemClick(link, id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
    onClose();
    navigate(link);
  }

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div
      ref={popoverRef}
      style={{
        position: 'absolute',
        top: '54px',
        right: '180px',
        width: '340px',
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
            Notifications
          </span>
          {unreadCount > 0 && (
            <span
              style={{
                fontSize: '0.72rem',
                background: '#e0e7ff',
                color: '#4f46e5',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: '999px',
              }}
            >
              {unreadCount} new
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: 600 }}
          >
            Mark all read
          </button>
        )}
      </div>

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => handleItemClick(n.link, n.id)}
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #f8faff',
              display: 'flex',
              gap: 12,
              cursor: 'pointer',
              background: n.unread ? '#f8faff' : '#ffffff',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = n.unread ? '#f8faff' : '#ffffff')
            }
          >
            <div style={{ marginTop: 2 }}>
              {n.type === 'warning' ? (
                <AlertTriangle size={17} color="#d97706" />
              ) : n.type === 'success' ? (
                <Award size={17} color="#10b981" />
              ) : (
                <CheckCircle size={17} color="#4f46e5" />
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                {n.title}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                {n.desc}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                {n.time}
              </div>
            </div>

            {n.unread && (
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#4f46e5',
                  alignSelf: 'center',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
