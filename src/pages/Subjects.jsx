import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { getSubjectStats } from '../data/analytics';
import ChartCard from '../components/ChartCard';

const SUBJECT_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#0ea5e9'];
const SUBJECT_ICONS = {
  Mathematics: '📐',
  Science: '🔬',
  English: '📚',
  History: '🏛️',
  'Computer Science': '💻',
  Art: '🎨',
};

const LightCustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '10px 14px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        fontSize: '0.84rem',
      }}
    >
      <p style={{ color: '#1e293b', fontWeight: 700, marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || '#6366f1', margin: 0, fontWeight: 600 }}>
          {p.name}: <strong style={{ color: '#0f172a' }}>{p.value}%</strong>
        </p>
      ))}
    </div>
  );
};

export default function Subjects() {
  const [subjectStats, setSubjectStats] = useState([]);

  useEffect(() => {
    setSubjectStats(getSubjectStats());
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800 }}>
          Curriculum & Subject Analytics
        </h2>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          Detailed breakdown of class averages, passing benchmarks, and topper scores per discipline
        </p>
      </div>

      {/* Overview Chart */}
      <ChartCard title="Discipline Benchmarks Overview" subtitle="Average marks distribution across disciplines" delay={0}>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectStats} barSize={42}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<LightCustomTooltip />} />
              <Bar dataKey="average" name="Class Average" radius={[8, 8, 0, 0]}>
                {subjectStats.map((_, i) => (
                  <Cell key={i} fill={SUBJECT_COLORS[i % SUBJECT_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Subject Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {subjectStats.map((stat, i) => (
          <motion.div
            key={stat.subject}
            className="white-card"
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  fontSize: '1.4rem',
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  background: '#f8f9fe',
                  border: '1px solid #eef2ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {SUBJECT_ICONS[stat.subject] || '📖'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stat.subject}</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Class Avg: <strong>{stat.average}%</strong></span>
                </div>
              </div>

              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: SUBJECT_COLORS[i % SUBJECT_COLORS.length],
                background: '#f8faff',
                padding: '6px 12px',
                borderRadius: '10px',
                border: '1px solid #f1f5f9',
              }}>
                {stat.average}%
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f8faff' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Highest Scored</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>{stat.highest} / 100</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f8faff' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Lowest Scored</span>
                <span style={{ fontWeight: 700, color: '#ef4444' }}>{stat.lowest} / 100</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f8faff' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subject Topper</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{stat.topStudent}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Overall Pass Rate</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{stat.passRate}%</span>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div style={{ height: 6, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${stat.average}%`,
                    background: SUBJECT_COLORS[i % SUBJECT_COLORS.length],
                    borderRadius: 999,
                    transition: 'width 1s ease',
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
