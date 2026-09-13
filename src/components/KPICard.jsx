import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MoreHorizontal, ExternalLink, Copy, Check } from 'lucide-react';

export default function KPICard({
  icon: Icon,
  label,
  value,
  trend,
  color = 'purple',
  link = '/students',
  delay = 0,
}) {
  const [display, setDisplay] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const numericValue = typeof value === 'number' ? value : parseFloat(value);
  const isNumber = !isNaN(numericValue);

  useEffect(() => {
    if (!isNumber) return;
    let start = 0;
    const end = numericValue;
    const duration = 1100;
    const startTime = performance.now();

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [numericValue, isNumber]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const formattedValue = isNumber
    ? numericValue % 1 !== 0
      ? display.toFixed(1)
      : Math.round(display)
    : value;

  function copyValue() {
    navigator.clipboard?.writeText?.(`${label}: ${formattedValue}`);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setMenuOpen(false);
    }, 900);
  }

  return (
    <motion.div
      className="kpi-squircle-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.08 }}
      style={{ position: 'relative' }}
    >
      <div className="kpi-card-top">
        <div className={`kpi-icon-container ${color}`}>
          <Icon />
        </div>

        <div style={{ position: 'relative' }} ref={menuRef}>
          <button
            type="button"
            className="kpi-more-btn"
            title="Options"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <MoreHorizontal size={17} />
          </button>

          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                right: 0,
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
                zIndex: 100,
                width: '150px',
                padding: '4px',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate(link);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  color: 'var(--text-primary)',
                  fontWeight: 500,
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8faff')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <ExternalLink size={13} /> View Details
              </button>

              <button
                type="button"
                onClick={copyValue}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  color: 'var(--text-primary)',
                  fontWeight: 500,
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8faff')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                {copied ? 'Copied!' : 'Copy Metric'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="kpi-big-number">
        {formattedValue}
        {typeof value === 'string' && value.includes('%') ? '%' : ''}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
        <span className="kpi-sub-label">{label}</span>
        {trend && (
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              color: trend > 0 ? '#059669' : '#dc2626',
              background: trend > 0 ? '#ecfdf5' : '#fef2f2',
              padding: '2px 8px',
              borderRadius: '999px',
            }}
          >
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </motion.div>
  );
}
