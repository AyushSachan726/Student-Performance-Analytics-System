import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend,
} from 'recharts';
import { Filter } from 'lucide-react';
import { getStudents, SUBJECTS } from '../data/students';
import { getStudentAverage, getStatus } from '../data/analytics';
import ChartCard from '../components/ChartCard';

const COLORS = ['#4f46e5', '#7c3aed', '#9333ea', '#0284c7', '#d97706', '#dc2626'];
const SUBJECT_COLORS = ['#4f46e5', '#7c3aed', '#db2777', '#d97706', '#059669', '#0284c7'];

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
      <p style={{ color: '#0f172a', fontWeight: 700, marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || '#4f46e5', margin: 0, fontWeight: 600 }}>
          {p.name}: <strong style={{ color: '#0f172a' }}>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</strong>
        </p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [classFilter, setClassFilter] = useState('all');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [gradeData, setGradeData] = useState([]);
  const [subjectStats, setSubjectStats] = useState([]);
  const [scatterData, setScatterData] = useState([]);

  useEffect(() => {
    const all = getStudents();
    const list = classFilter === 'all' ? all : all.filter((s) => s.class === classFilter);
    setFilteredStudents(list);

    // Compute grades for filtered students
    const grades = { 'A+ (90-100)': 0, 'A (80-89)': 0, 'B (70-79)': 0, 'C (60-69)': 0, 'D (50-59)': 0, 'F (<50)': 0 };
    list.forEach((s) => {
      const avg = getStudentAverage(s);
      if (avg >= 90) grades['A+ (90-100)']++;
      else if (avg >= 80) grades['A (80-89)']++;
      else if (avg >= 70) grades['B (70-79)']++;
      else if (avg >= 60) grades['C (60-69)']++;
      else if (avg >= 50) grades['D (50-59)']++;
      else grades['F (<50)']++;
    });
    setGradeData(Object.entries(grades).map(([grade, count]) => ({ grade, count })));

    // Compute subject stats for filtered students
    const stats = SUBJECTS.map((subj) => {
      const marks = list.map((s) => s.subjects[subj] || 0);
      const avg = marks.length ? marks.reduce((a, b) => a + b, 0) / marks.length : 0;
      const max = marks.length ? Math.max(...marks) : 0;
      const min = marks.length ? Math.min(...marks) : 0;
      const topStudent = list.find((s) => s.subjects[subj] === max);
      const passing = marks.filter((m) => m >= 50).length;

      return {
        subject: subj,
        average: Math.round(avg * 10) / 10,
        highest: max,
        lowest: min,
        topStudent: topStudent?.name || 'N/A',
        passRate: marks.length ? Math.round((passing / marks.length) * 100) : 0,
      };
    });
    setSubjectStats(stats);

    // Compute scatter points
    setScatterData(
      list.map((s) => ({
        name: s.name,
        attendance: s.attendance,
        average: getStudentAverage(s),
        status: getStatus(getStudentAverage(s)),
      }))
    );
  }, [classFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800 }}>
            Performance Analytics & Insights
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Showing data for {filteredStudents.length} students {classFilter !== 'all' ? `in Class ${classFilter}` : '(All Classes)'}
          </p>
        </div>

        {/* Real Working Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            className="select-pill"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="all">All Cohorts (10, 11, 12)</option>
            <option value="10">Class 10</option>
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>
        </div>
      </div>

      <div className="charts-row-2col">
        {/* Donut Chart */}
        <ChartCard title="Grade Distribution" subtitle="Class cohort breakdown" delay={0}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <ResponsiveContainer width="60%" height={260}>
              <PieChart>
                <Pie
                  data={gradeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  dataKey="count"
                  nameKey="grade"
                  strokeWidth={2}
                  stroke="#ffffff"
                  paddingAngle={3}
                >
                  {gradeData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<LightCustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {gradeData.map((g, i) => (
                <div key={g.grade} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: '0.82rem' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: COLORS[i] }} />
                  <span style={{ flex: 1, color: 'var(--text-secondary)' }}>{g.grade}</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{g.count}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Subject Comparison */}
        <ChartCard title="Subject Performance Benchmark" subtitle="Class average vs highest scores" delay={1}>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectStats} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<LightCustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '0.8rem', color: '#64748b' }} />
                <Bar dataKey="average" name="Class Avg" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="highest" name="Top Mark" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="charts-row-2col">
        {/* Scatter Plot */}
        <ChartCard title="Attendance vs Marks Correlation" subtitle="Impact of regular attendance on student grades" delay={2}>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="attendance"
                  name="Attendance"
                  domain={[60, 100]}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  label={{ value: 'Attendance %', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 11 }}
                />
                <YAxis
                  dataKey="average"
                  name="Average"
                  domain={[30, 100]}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  label={{ value: 'Avg %', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                        fontSize: '0.82rem',
                      }}>
                        <p style={{ color: '#0f172a', fontWeight: 700, margin: 0 }}>{d.name}</p>
                        <p style={{ margin: '3px 0 0', color: 'var(--text-secondary)' }}>Attendance: <strong>{d.attendance}%</strong></p>
                        <p style={{ margin: 0, color: 'var(--primary)' }}>Average: <strong>{d.average}%</strong></p>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatterData} fill="#4f46e5">
                  {scatterData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        entry.status === 'Excellent' ? '#059669'
                          : entry.status === 'Good' ? '#4f46e5'
                            : entry.status === 'Average' ? '#d97706'
                              : '#dc2626'
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Pass Rate Horizontal Bar */}
        <ChartCard title="Subject Pass Rate" subtitle="Percentage of students clearing passing criteria (50+)" delay={3}>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectStats} barSize={26} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={110} />
                <Tooltip content={<LightCustomTooltip />} />
                <Bar dataKey="passRate" name="Pass Rate %" radius={[0, 6, 6, 0]}>
                  {subjectStats.map((_, i) => (
                    <Cell key={i} fill={SUBJECT_COLORS[i % SUBJECT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Subject Detailed Breakdown Table */}
      <div className="white-card">
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700 }}>
            Subject Performance Matrix
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Class statistics, difficulty benchmarks and highest scores per department
          </p>
        </div>

        <div className="table-responsive-wrapper">
          <table className="light-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Class Average</th>
                <th>Highest Mark</th>
                <th>Lowest Mark</th>
                <th>Pass Rate</th>
                <th>Subject Topper</th>
              </tr>
            </thead>
            <tbody>
              {subjectStats.map((s) => (
                <tr key={s.subject}>
                  <td style={{ fontWeight: 700 }}>{s.subject}</td>
                  <td>{s.average}%</td>
                  <td style={{ color: '#059669', fontWeight: 700 }}>{s.highest}</td>
                  <td style={{ color: '#dc2626', fontWeight: 700 }}>{s.lowest}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 6, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ width: `${s.passRate}%`, height: '100%', background: s.passRate >= 90 ? '#059669' : s.passRate >= 70 ? '#4f46e5' : '#d97706', borderRadius: 999 }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{s.passRate}%</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{s.topStudent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
