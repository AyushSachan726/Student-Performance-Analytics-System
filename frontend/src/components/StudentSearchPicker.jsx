import { useState, useRef, useEffect } from 'react';
import { Search, X, Check } from 'lucide-react';
import { getStudentAverage, getStatus } from '../data/analytics';
import Badge from './Badge';

export default function StudentSearchPicker({ students, selectedStudent, onSelectStudent }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [classFilter, setClassFilter] = useState('all');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredStudents = students.filter((s) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      `${s.class}-${s.section}`.toLowerCase().includes(q);

    const matchesClass = classFilter === 'all' || s.class === classFilter;
    return matchesQuery && matchesClass;
  });

  const displayStudents = filteredStudents.slice(0, 30);

  function handleSelect(s) {
    onSelectStudent(s);
    setIsOpen(false);
    setQuery('');
  }

  function handleClear() {
    onSelectStudent(null);
    setQuery('');
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: '650px' }}>
      {selectedStudent ? (
        /* Selected Student Banner (Light Theme) */
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            padding: '12px 18px',
            background: '#ffffff',
            border: '1px solid #e0e7ff',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              className="avatar-circle"
              style={{
                backgroundColor: selectedStudent.avatarColor,
                width: 42,
                height: 42,
                fontSize: '0.88rem',
              }}
            >
              {selectedStudent.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                  {selectedStudent.name}
                </span>
                <span
                  style={{
                    fontSize: '0.74rem',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    background: '#eef2ff',
                    color: 'var(--primary)',
                    fontWeight: 700,
                  }}
                >
                  {selectedStudent.id}
                </span>
                <Badge status={getStatus(getStudentAverage(selectedStudent))} />
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Class {selectedStudent.class}-{selectedStudent.section} • {selectedStudent.email} • Average: <strong>{getStudentAverage(selectedStudent)}%</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setIsOpen(true);
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
            >
              Change Student
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleClear}
              title="Clear selection"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      ) : (
        /* Search Box (Pill shape) */
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: 14,
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search student by Name, Roll ID (e.g. STU001) or Class..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              style={{
                width: '100%',
                padding: '12px 40px 12px 44px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.92rem',
                color: 'var(--text-primary)',
                outline: 'none',
                boxShadow: isOpen
                  ? '0 0 0 3px rgba(99, 102, 241, 0.15), 0 4px 12px rgba(0, 0, 0, 0.05)'
                  : 'var(--shadow-sm)',
                transition: 'all 0.2s',
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                style={{
                  position: 'absolute',
                  right: 14,
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Autocomplete Dropdown (Light Theme) */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 20px 45px rgba(25, 35, 65, 0.12), 0 4px 12px rgba(25, 35, 65, 0.05)',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          {/* Filter Bar */}
          <div
            style={{
              padding: '10px 14px',
              borderBottom: '1px solid #f1f5f9',
              background: '#f8faff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter:</span>
              {['all', '10', '11', '12'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setClassFilter(c)}
                  style={{
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    background: classFilter === c ? 'var(--primary)' : '#e2e8f0',
                    color: classFilter === c ? '#ffffff' : 'var(--text-secondary)',
                    transition: 'all 0.15s',
                  }}
                >
                  {c === 'all' ? 'All Classes' : `Class ${c}`}
                </button>
              ))}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {filteredStudents.length} matching students
            </span>
          </div>

          {/* Results List */}
          <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {displayStudents.length > 0 ? (
              displayStudents.map((s) => {
                const isSelected = selectedStudent?.id === s.id;
                const avg = getStudentAverage(s);
                const status = getStatus(avg);

                return (
                  <div
                    key={s.id}
                    onClick={() => handleSelect(s)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f8faff',
                      background: isSelected ? '#f0f4ff' : 'transparent',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = '#f8faff';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        className="avatar-circle"
                        style={{
                          backgroundColor: s.avatarColor,
                          width: 34,
                          height: 34,
                          fontSize: '0.8rem',
                        }}
                      >
                        {s.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            {s.name}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                            {s.id}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Class {s.class}-{s.section} • {s.email}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                          {avg}%
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          Att: {s.attendance}%
                        </div>
                      </div>
                      <Badge status={status} />
                      {isSelected && <Check size={16} color="var(--primary)" />}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>
                  No students found matching "{query}"
                </p>
                <p style={{ fontSize: '0.75rem', marginTop: 4 }}>
                  Try searching by different name, roll ID or class filter.
                </p>
              </div>
            )}
          </div>

          {filteredStudents.length > 30 && (
            <div
              style={{
                padding: '8px 14px',
                textAlign: 'center',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                background: '#f8faff',
                borderTop: '1px solid #f1f5f9',
              }}
            >
              Showing top 30 of {filteredStudents.length} students. Type to refine your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
