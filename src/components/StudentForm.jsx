import { useState } from 'react';
import { SUBJECTS } from '../data/students';

const INITIAL = {
  name: '',
  class: '10',
  section: 'A',
  email: '',
  attendance: 90,
  subjects: Object.fromEntries(SUBJECTS.map((s) => [s, 75])),
};

export default function StudentForm({ student, onSubmit, onCancel }) {
  const [form, setForm] = useState(student || INITIAL);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubjectChange(subject, value) {
    setForm((prev) => ({
      ...prev,
      subjects: { ...prev.subjects, [subject]: Number(value) || 0 },
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field-group">
        <label>Full Student Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g. Aarav Sharma"
          required
        />
      </div>

      <div className="field-row-2">
        <div className="field-group">
          <label>Class Level</label>
          <select value={form.class} onChange={(e) => handleChange('class', e.target.value)}>
            <option value="10">Class 10</option>
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>
        </div>
        <div className="field-group">
          <label>Class Section</label>
          <select value={form.section} onChange={(e) => handleChange('section', e.target.value)}>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
        </div>
      </div>

      <div className="field-row-2">
        <div className="field-group">
          <label>Email Address</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="student@school.edu"
          />
        </div>
        <div className="field-group">
          <label>Attendance Rate (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={form.attendance}
            onChange={(e) => handleChange('attendance', Number(e.target.value))}
          />
        </div>
      </div>

      <h3 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: 12, marginTop: 10, color: 'var(--text-primary)' }}>
        Subject Marks (out of 100)
      </h3>

      <div className="field-row-3">
        {SUBJECTS.map((subj) => (
          <div className="field-group" key={subj}>
            <label>{subj}</label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.subjects[subj]}
              onChange={(e) => handleSubjectChange(subj, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {student ? 'Save Changes' : 'Create Student'}
        </button>
      </div>
    </form>
  );
}
