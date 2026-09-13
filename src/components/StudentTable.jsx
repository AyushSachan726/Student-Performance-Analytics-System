import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { getStudentAverage, getStatus } from '../data/analytics';
import Badge from './Badge';

export default function StudentTable({ students, onDelete }) {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  function handleSort(field) {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  }

  const sortedStudents = [...students].sort((a, b) => {
    let valA, valB;
    if (sortField === 'name') {
      valA = a.name.toLowerCase();
      valB = b.name.toLowerCase();
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    } else if (sortField === 'id') {
      valA = a.id;
      valB = b.id;
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    } else if (sortField === 'class') {
      valA = `${a.class}-${a.section}`;
      valB = `${b.class}-${b.section}`;
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    } else if (sortField === 'average') {
      valA = getStudentAverage(a);
      valB = getStudentAverage(b);
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    } else if (sortField === 'attendance') {
      valA = a.attendance;
      valB = b.attendance;
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    }
    return 0;
  });

  function renderSortIcon(field) {
    if (sortField !== field) {
      return <ArrowUpDown size={13} style={{ opacity: 0.35, marginLeft: 4 }} />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={13} style={{ color: 'var(--primary)', marginLeft: 4 }} />
    ) : (
      <ArrowDown size={13} style={{ color: 'var(--primary)', marginLeft: 4 }} />
    );
  }

  return (
    <div className="table-responsive-wrapper">
      <table className="light-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', userSelect: 'none' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                Student Info {renderSortIcon('name')}
              </div>
            </th>
            <th onClick={() => handleSort('id')} style={{ cursor: 'pointer', userSelect: 'none' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                Roll ID {renderSortIcon('id')}
              </div>
            </th>
            <th onClick={() => handleSort('class')} style={{ cursor: 'pointer', userSelect: 'none' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                Class {renderSortIcon('class')}
              </div>
            </th>
            <th onClick={() => handleSort('average')} style={{ cursor: 'pointer', userSelect: 'none' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                Average {renderSortIcon('average')}
              </div>
            </th>
            <th>Status</th>
            <th onClick={() => handleSort('attendance')} style={{ cursor: 'pointer', userSelect: 'none' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                Attendance {renderSortIcon('attendance')}
              </div>
            </th>
            {onDelete && <th style={{ textAlign: 'right' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((s) => {
            const avg = getStudentAverage(s);
            const status = getStatus(avg);
            return (
              <tr
                key={s.id}
                onClick={() => navigate(`/students/${s.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <div className="avatar-cell">
                    <div
                      className="avatar-circle"
                      style={{ backgroundColor: s.avatarColor }}
                    >
                      {s.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <div className="student-title">{s.name}</div>
                      <div className="student-subtitle">{s.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      background: '#f1f5f9',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                    }}
                  >
                    {s.id}
                  </span>
                </td>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  Class {s.class}-{s.section}
                </td>
                <td style={{ fontWeight: 700, fontSize: '0.95rem' }}>{avg}%</td>
                <td>
                  <Badge status={status} />
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 50,
                        height: 6,
                        background: '#e2e8f0',
                        borderRadius: 999,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${s.attendance}%`,
                          height: '100%',
                          background:
                            s.attendance >= 90
                              ? '#10b981'
                              : s.attendance >= 75
                              ? '#4f46e5'
                              : '#f59e0b',
                          borderRadius: 999,
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{s.attendance}%</span>
                  </div>
                </td>
                {onDelete && (
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(s.id);
                      }}
                      title="Delete Student"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
