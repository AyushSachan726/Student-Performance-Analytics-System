import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts';
import { ArrowLeft, Mail, BookOpen, CalendarCheck, Edit, Trash2 } from 'lucide-react';
import { getStudentById, updateStudent, deleteStudent, SUBJECTS } from '../data/students';
import { getStudentAverage, getGrade, getStatus, getStrengthsWeaknesses } from '../data/analytics';
import ChartCard from '../components/ChartCard';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import StudentForm from '../components/StudentForm';

const SUBJECT_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#0ea5e9'];

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

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const s = getStudentById(id);
    if (!s) navigate('/students');
    else setStudent(s);
  }, [id, navigate]);

  if (!student) return null;

  const avg = getStudentAverage(student);
  const grade = getGrade(avg);
  const status = getStatus(avg);
  const { strengths, weaknesses } = getStrengthsWeaknesses(student);

  const subjectData = SUBJECTS.map((s) => ({
    subject: s,
    marks: student.subjects[s] || 0,
  }));

  const attendanceData = [
    { name: 'Present', value: student.attendance, fill: '#10b981' },
    { name: 'Absent', value: 100 - student.attendance, fill: '#f1f5f9' },
  ];

  function handleEdit(formData) {
    updateStudent(student.id, formData);
    setStudent(getStudentById(student.id));
    setShowEditModal(false);
  }

  function handleDelete() {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteStudent(student.id);
      navigate('/students');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Link
        to="/students"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.88rem',
          fontWeight: 600,
          color: 'var(--text-secondary)',
        }}
      >
        <ArrowLeft size={16} /> Back to Directory
      </Link>

      {/* Student Profile Banner */}
      <div className="white-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              className="avatar-circle"
              style={{
                backgroundColor: student.avatarColor,
                width: 64,
                height: 64,
                fontSize: '1.4rem',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
              }}
            >
              {student.name.split(' ').map((n) => n[0]).join('')}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>
                  {student.name}
                </h2>
                <span style={{
                  fontFamily: 'monospace',
                  background: '#f1f5f9',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                }}>
                  {student.id}
                </span>
                <Badge status={status} />
              </div>

              <div style={{ display: 'flex', gap: 16, marginTop: 4, fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <span><Mail size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {student.email}</span>
                <span><BookOpen size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Class {student.class}-{student.section}</span>
                <span><CalendarCheck size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {student.attendance}% Attendance</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowEditModal(true)}>
              <Edit size={15} /> Edit Info
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>
              <Trash2 size={15} /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="charts-row-2col">
        <ChartCard title="Discipline Scores" subtitle="Marks scored out of 100" delay={1}>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<LightCustomTooltip />} />
                <Bar dataKey="marks" name="Marks" radius={[6, 6, 0, 0]}>
                  {subjectData.map((_, i) => (
                    <Cell key={i} fill={SUBJECT_COLORS[i % SUBJECT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Semester Progress Growth" subtitle="Performance trend over 4 terms" delay={2}>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={student.semesters}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="sem" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<LightCustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="avg"
                  name="Term Average"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', stroke: '#ffffff', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: '#4f46e5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Attendance & Strengths / Weaknesses */}
      <div className="charts-row-2col">
        <ChartCard title="Attendance Consistency" subtitle="Current term attendance ratio" delay={3}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, padding: '10px 0' }}>
            <div style={{ width: 140, height: 140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    strokeWidth={0}
                  >
                    {attendanceData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800, color: '#10b981', lineHeight: 1.1 }}>
                {student.attendance}%
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 4 }}>
                Attendance Recorded
              </div>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Academic Strengths & Growth Areas" subtitle="AI performance evaluation" delay={4}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                💪 Top Strengths
              </div>
              {strengths.map((s) => (
                <div key={s.subject} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f8faff', fontSize: '0.88rem' }}>
                  <span>{s.subject}</span>
                  <strong style={{ color: '#059669' }}>{s.marks}/100</strong>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 4 }}>
              <div style={{ fontSize: '0.82rem', color: '#dc2626', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                🎯 Focus Areas for Improvement
              </div>
              {weaknesses.map((s) => (
                <div key={s.subject} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f8faff', fontSize: '0.88rem' }}>
                  <span>{s.subject}</span>
                  <strong style={{ color: '#dc2626' }}>{s.marks}/100</strong>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Student Profile">
        <StudentForm student={student} onSubmit={handleEdit} onCancel={() => setShowEditModal(false)} />
      </Modal>
    </div>
  );
}
