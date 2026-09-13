import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Area, AreaChart, Cell,
} from 'recharts';
import { Users, TrendingUp, Award, CalendarCheck, MoreVertical, Calendar } from 'lucide-react';
import KPICard from '../components/KPICard';
import ChartCard from '../components/ChartCard';
import Badge from '../components/Badge';
import {
  getOverallStats,
  getGradeDistribution,
  getPerformanceTrend,
  getStudentAverage,
  getStatus,
} from '../data/analytics';

const GRADE_COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#06b6d4', '#f59e0b', '#ef4444'];

// Light Modern Tooltip
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
          {p.name}: <strong style={{ color: '#0f172a' }}>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [gradeData, setGradeData] = useState([]);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    setStats(getOverallStats());
    setGradeData(getGradeDistribution());
    setTrendData(getPerformanceTrend());
  }, []);

  if (!stats) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 4 Top KPI Cards (Squircle pastel cards matching reference) */}
      <div className="kpi-row">
        <KPICard
          icon={Users}
          label="Total Enrolled"
          value={stats.totalStudents}
          trend={8.4}
          color="purple"
          delay={0}
        />
        <KPICard
          icon={TrendingUp}
          label="Class Average"
          value={stats.classAverage}
          trend={3.2}
          color="blue"
          delay={1}
        />
        <KPICard
          icon={Award}
          label="Highest Score"
          value={stats.topPerformer ? getStudentAverage(stats.topPerformer) : 0}
          trend={1.8}
          color="teal"
          delay={2}
        />
        <KPICard
          icon={CalendarCheck}
          label="Avg Attendance"
          value={stats.attendanceAvg}
          trend={2.5}
          color="amber"
          delay={3}
        />
      </div>

      {/* Main Content Split (Matching Middle Row of Reference Image) */}
      <div className="dashboard-grid-2col">
        {/* Left: Students Performance Mini-List (like reference image) */}
        <ChartCard
          title="Students Performance"
          subtitle="Top ranked academic achievers this session"
          delay={4}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {stats.topPerformers.map((s, i) => {
              const avg = getStudentAverage(s);
              const status = getStatus(avg);
              return (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    background: i === 0 ? '#f8f9ff' : '#fafbfe',
                    border: '1px solid #f1f3fa',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      className="avatar-circle"
                      style={{
                        backgroundColor: s.avatarColor,
                        width: 38,
                        height: 38,
                        fontSize: '0.82rem',
                      }}
                    >
                      {s.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        {s.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Class {s.class}-{s.section} • Att: {s.attendance}%
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Badge status={status} />
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        fontSize: '1rem',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {avg}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>

        {/* Right: Total Attendance & Performance Trend Report (like reference image line chart) */}
        <ChartCard
          title="Academic Progress Trend"
          subtitle="Semester-by-semester average growth"
          delay={5}
        >
          <div style={{ height: 290 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGradLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="semester"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[60, 100]}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<LightCustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="average"
                  name="Average Score"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#areaGradLight)"
                  dot={{ fill: '#6366f1', stroke: '#ffffff', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: '#4f46e5' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Bottom Grid: Grade Distribution + Mini Calendar Schedule (Matching Reference) */}
      <div className="dashboard-grid-2col">
        {/* Grade Distribution Bar Chart */}
        <ChartCard
          title="Grade Distribution"
          subtitle="Student count breakdown across grade bands"
          delay={6}
        >
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeData} barSize={38}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="grade"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<LightCustomTooltip />} />
                <Bar dataKey="count" name="Students" radius={[8, 8, 0, 0]}>
                  {gradeData.map((_, i) => (
                    <Cell key={i} fill={GRADE_COLORS[i % GRADE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Academic Calendar & Events (Like right widget in Reference Image) */}
        <div className="mini-calendar-card">
          <div className="calendar-header">
            <span>Academic Schedule</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
              Term 1, 2026
            </span>
          </div>

          {/* Calendar Grid */}
          <div className="calendar-grid">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
              <div key={d} className="calendar-day-label">
                {d}
              </div>
            ))}
            {[
              28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
              16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
            ].map((day, idx) => (
              <div
                key={idx}
                className={`calendar-cell${day === 13 && idx === 16 ? ' active-day' : ''}`}
                style={{ opacity: idx < 4 ? 0.35 : 1 }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Upcoming Academic Milestones */}
          <div style={{ marginTop: 20, borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
              Upcoming Milestones
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1' }} />
                  <span style={{ fontWeight: 600 }}>Mid-Term Assessment</span>
                </div>
                <span style={{ color: 'var(--text-muted)' }}>20 Sept</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                  <span style={{ fontWeight: 600 }}>Science Lab Evaluation</span>
                </div>
                <span style={{ color: 'var(--text-muted)' }}>24 Sept</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
                  <span style={{ fontWeight: 600 }}>Report Card Dispatch</span>
                </div>
                <span style={{ color: 'var(--text-muted)' }}>30 Sept</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* At-Risk Alert Section */}
      {stats.atRisk.length > 0 && (
        <ChartCard
          title="Students Requiring Academic Attention"
          subtitle="Students with average below 55% threshold"
          delay={7}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
            {stats.atRisk.map((s) => {
              const avg = getStudentAverage(s);
              return (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: '#fef2f2',
                    border: '1px solid #fee2e2',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      className="avatar-circle"
                      style={{ backgroundColor: s.avatarColor, width: 34, height: 34, fontSize: '0.78rem' }}
                    >
                      {s.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#991b1b' }}>{s.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#b91c1c' }}>
                        Class {s.class}-{s.section} • Att: {s.attendance}%
                      </div>
                    </div>
                  </div>
                  <Badge status="At Risk" />
                  <div style={{ fontWeight: 800, color: '#dc2626', fontSize: '0.95rem' }}>{avg}%</div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      )}
    </div>
  );
}
