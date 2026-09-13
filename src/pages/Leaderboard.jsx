import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { getLeaderboard } from '../data/analytics';
import { SUBJECTS } from '../data/students';
import Badge from '../components/Badge';
import { getStatus } from '../data/analytics';

export default function Leaderboard() {
  const [subject, setSubject] = useState('overall');
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    setLeaderboard(getLeaderboard(subject === 'overall' ? null : subject));
  }, [subject]);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  // Reorder for podium: [2nd, 1st, 3rd]
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800 }}>
          Honor Roll & Leaderboard
        </h2>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          Student performance rankings evaluated across individual subjects and overall GPA
        </p>
      </div>

      {/* Subject Tabs Filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          className={`btn ${subject === 'overall' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setSubject('overall')}
        >
          <Trophy size={15} /> Overall Rank
        </button>
        {SUBJECTS.map((s) => (
          <button
            key={s}
            className={`btn ${subject === s ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setSubject(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Top 3 Podium (Light Theme) */}
      {top3.length >= 3 && (
        <div className="white-card">
          <div className="podium-container">
            {podiumOrder.map((s, visualIndex) => {
              const actualRank = visualIndex === 0 ? 2 : visualIndex === 1 ? 1 : 3;
              const medal = actualRank === 1 ? '🥇' : actualRank === 2 ? '🥈' : '🥉';
              return (
                <motion.div
                  key={s.id}
                  className="podium-column"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + visualIndex * 0.08 }}
                >
                  <div
                    className="avatar-circle"
                    style={{
                      backgroundColor: s.avatarColor,
                      width: 52,
                      height: 52,
                      fontSize: '1rem',
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {s.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', textAlign: 'center' }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {s.avg}% Avg
                  </div>
                  <div className="podium-pedestal">
                    {medal}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Leaderboard List */}
      <div className="white-card">
        <div style={{ marginBottom: 18 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700 }}>
            Ranked Student Cohort
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {subject === 'overall' ? 'Consolidated overall marks' : `${subject} subject ranking`}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {leaderboard.map((s, i) => {
            const status = getStatus(s.avg);
            return (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  background: i < 3 ? '#fafbfe' : '#ffffff',
                  border: '1px solid #f1f3fa',
                  borderRadius: '14px',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '1rem',
                      width: 28,
                      textAlign: 'center',
                      color: i === 0 ? '#d97706' : i === 1 ? '#7c3aed' : i === 2 ? '#ea580c' : 'var(--text-muted)',
                    }}
                  >
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </div>

                  <div
                    className="avatar-circle"
                    style={{
                      backgroundColor: s.avatarColor,
                      width: 36,
                      height: 36,
                      fontSize: '0.8rem',
                    }}
                  >
                    {s.name.split(' ').map((n) => n[0]).join('')}
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                      {s.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Class {s.class}-{s.section} • Roll: {s.id}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <Badge status={status} />
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      color: 'var(--text-primary)',
                      minWidth: 50,
                      textAlign: 'right',
                    }}
                  >
                    {s.avg}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
