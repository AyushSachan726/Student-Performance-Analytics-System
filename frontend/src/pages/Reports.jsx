import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Printer, FileText } from 'lucide-react';
import { getStudents, SUBJECTS } from '../data/students';
import { getStudentAverage, getGrade, getStatus } from '../data/analytics';
import StudentSearchPicker from '../components/StudentSearchPicker';

export default function Reports() {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const list = getStudents();
    setStudents(list);
    if (list.length > 0 && !selected) {
      setSelected(list[0]);
    }
  }, []);

  function handlePrint() {
    window.print();
  }

  const avg = selected ? getStudentAverage(selected) : 0;
  const grade = selected ? getGrade(avg) : '';
  const status = selected ? getStatus(avg) : '';
  const totalMarks = selected ? Object.values(selected.subjects).reduce((a, b) => a + b, 0) : 0;
  const maxMarks = SUBJECTS.length * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800 }}>
          Academic Reports & Transcripts
        </h2>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          Search any student among 1,000+ records to generate an official report card
        </p>
      </div>

      {/* Search Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <StudentSearchPicker
          students={students}
          selectedStudent={selected}
          onSelectStudent={(st) => setSelected(st)}
        />

        {selected && (
          <button className="btn btn-primary" onClick={handlePrint} style={{ height: '44px' }}>
            <Printer size={17} /> Print Report
          </button>
        )}
      </div>

      {!selected ? (
        <div className="white-card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <FileText size={48} style={{ margin: '0 auto 12px', opacity: 0.35 }} />
          <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>
            Use the search bar above to select a student and preview their official report card.
          </p>
        </div>
      ) : (
        <motion.div
          key={selected.id}
          className="report-paper"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="report-title-section">
            <h2>🎓 Official Academic Report Card</h2>
            <p>Annual Evaluation & Performance Transcript • Academic Session 2025-26</p>
          </div>

          {/* Student Profile Overview */}
          <div className="report-student-card">
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>STUDENT NAME</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{selected.name}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>ROLL NUMBER</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: 'monospace', color: 'var(--primary)' }}>{selected.id}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CLASS & SECTION</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Class {selected.class} — Section {selected.section}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>EMAIL ADDRESS</div>
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{selected.email}</div>
            </div>
          </div>

          {/* Marks Table */}
          <table className="light-table" style={{ marginBottom: 24, border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Marks Scored</th>
                <th>Max Marks</th>
                <th>Grade</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {SUBJECTS.map((subj) => {
                const marks = selected.subjects[subj] || 0;
                const subGrade = getGrade(marks);
                return (
                  <tr key={subj}>
                    <td style={{ fontWeight: 600 }}>{subj}</td>
                    <td style={{ fontWeight: 700 }}>{marks}</td>
                    <td style={{ color: 'var(--text-muted)' }}>100</td>
                    <td style={{
                      fontWeight: 800,
                      color: marks >= 90 ? '#10b981' : marks >= 75 ? '#6366f1' : marks >= 50 ? '#f59e0b' : '#ef4444'
                    }}>
                      {subGrade}
                    </td>
                    <td>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        background: marks >= 50 ? '#ecfdf5' : '#fef2f2',
                        color: marks >= 50 ? '#059669' : '#dc2626',
                      }}>
                        {marks >= 50 ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              <tr style={{ fontWeight: 800, background: '#f8faff', borderTop: '2px solid #e2e8f0' }}>
                <td>Cumulative Total</td>
                <td style={{ color: 'var(--primary)' }}>{totalMarks}</td>
                <td>{maxMarks}</td>
                <td style={{ color: 'var(--primary)' }}>{grade}</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>

          {/* Summary KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
            <div style={{ textAlign: 'center', padding: '16px', background: '#f8faff', borderRadius: '12px', border: '1px solid #eef2ff' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>
                {avg}%
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Overall Score</div>
            </div>

            <div style={{ textAlign: 'center', padding: '16px', background: '#f8faff', borderRadius: '12px', border: '1px solid #eef2ff' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>
                {selected.attendance}%
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Attendance Rate</div>
            </div>

            <div style={{ textAlign: 'center', padding: '16px', background: '#f8faff', borderRadius: '12px', border: '1px solid #eef2ff' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                fontWeight: 800,
                marginTop: 4,
                color: status === 'Excellent' ? '#10b981' : status === 'Good' ? '#6366f1' : status === 'Average' ? '#f59e0b' : '#ef4444'
              }}>
                {status}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Performance Band</div>
            </div>
          </div>

          {/* Footer note */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16, textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            This is an automated performance report card generated by EduAnalytics System. Verified for official academic records.
          </div>
        </motion.div>
      )}
    </div>
  );
}
