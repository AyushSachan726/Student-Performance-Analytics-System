import { useState, useRef } from 'react';
import { Upload, Download, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import Modal from './Modal';
import { SUBJECTS, SAMPLE_CSV, addStudentsBulk } from '../data/students';

export default function CsvUploadModal({ isOpen, onClose, onImportSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  function handleDownloadSample() {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function parseCSV(text) {
    setError('');
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length < 2) {
      setError('CSV file must have a header row and at least one student data row.');
      return;
    }

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
    const expectedHeaders = ['name', 'class', 'section', 'email', 'attendance'];

    const hasRequired = expectedHeaders.every((h) =>
      headers.some((header) => header.toLowerCase() === h.toLowerCase())
    );

    if (!hasRequired) {
      setError(`CSV must include headers: ${expectedHeaders.join(', ')}`);
      return;
    }

    const nameIdx = headers.findIndex((h) => h.toLowerCase() === 'name');
    const classIdx = headers.findIndex((h) => h.toLowerCase() === 'class');
    const secIdx = headers.findIndex((h) => h.toLowerCase() === 'section');
    const emailIdx = headers.findIndex((h) => h.toLowerCase() === 'email');
    const attIdx = headers.findIndex((h) => h.toLowerCase() === 'attendance');

    const subjectIndices = {};
    SUBJECTS.forEach((subj) => {
      const idx = headers.findIndex((h) => h.toLowerCase() === subj.toLowerCase());
      if (idx !== -1) subjectIndices[subj] = idx;
    });

    const parsed = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
      if (cols.length < expectedHeaders.length) continue;

      const name = cols[nameIdx] || '';
      if (!name) continue;

      const studentClass = cols[classIdx] || '10';
      const section = cols[secIdx] || 'A';
      const email = cols[emailIdx] || `${name.toLowerCase().replace(/\s+/g, '.')}@school.edu`;
      const attendance = Math.min(100, Math.max(0, parseInt(cols[attIdx], 10) || 85));

      const subjects = {};
      SUBJECTS.forEach((subj) => {
        const sIdx = subjectIndices[subj];
        const mark = sIdx !== undefined && cols[sIdx] !== undefined ? parseInt(cols[sIdx], 10) : 75;
        subjects[subj] = isNaN(mark) ? 75 : Math.min(100, Math.max(0, mark));
      });

      parsed.push({
        name,
        class: studentClass,
        section,
        email,
        attendance,
        subjects,
      });
    }

    if (parsed.length === 0) {
      setError('No valid student rows found in the CSV.');
      return;
    }

    setParsedData(parsed);
  }

  function handleFile(file) {
    if (!file) return;
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setError('Please upload a valid .csv file.');
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      parseCSV(e.target.result);
    };
    reader.readAsText(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  function handleImport() {
    if (parsedData.length === 0) return;
    const imported = addStudentsBulk(parsedData);
    onImportSuccess(imported);
    handleReset();
    onClose();
  }

  function handleReset() {
    setParsedData([]);
    setFileName('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import Students from CSV">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>
            Upload bulk student records with attendance and marks in one click.
          </p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleDownloadSample}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Download size={14} /> Download Sample CSV
          </button>
        </div>

        {/* Upload Zone (Light Theme) */}
        {parsedData.length === 0 ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragActive ? 'var(--primary)' : '#cbd5e1'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '36px 20px',
              textAlign: 'center',
              background: dragActive ? '#eef2ff' : '#f8faff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <div style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: '#e0e7ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              color: 'var(--primary)',
            }}>
              <Upload size={24} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4, color: 'var(--text-primary)' }}>
              Drag & Drop your CSV file here, or <span style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Browse</span>
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Supports comma-separated format with name, class, attendance, and subject marks
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: '#ecfdf5',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #a7f3d0',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 size={20} color="#059669" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#047857' }}>
                    {fileName}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Ready to import <strong>{parsedData.length} students</strong>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleReset}
                title="Remove file"
              >
                <Trash2 size={15} color="#dc2626" />
              </button>
            </div>

            {/* Preview table */}
            <div style={{ maxHeight: 220, overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <table className="light-table" style={{ fontSize: '0.82rem' }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Sec</th>
                    <th>Attendance</th>
                    <th>Math</th>
                    <th>Sci</th>
                    <th>Eng</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedData.slice(0, 10).map((p, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{p.name}</td>
                      <td>{p.class}</td>
                      <td>{p.section}</td>
                      <td>{p.attendance}%</td>
                      <td>{p.subjects.Mathematics}</td>
                      <td>{p.subjects.Science}</td>
                      <td>{p.subjects.English}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsedData.length > 10 && (
                <div style={{ padding: '8px 12px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', background: '#fafbfe' }}>
                  + and {parsedData.length - 10} more records ready
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            background: '#fef2f2',
            border: '1px solid #fee2e2',
            borderRadius: 'var(--radius-md)',
            color: '#dc2626',
            fontSize: '0.84rem',
          }}>
            <AlertCircle size={17} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleImport}
            disabled={parsedData.length === 0}
            style={{ opacity: parsedData.length === 0 ? 0.5 : 1, cursor: parsedData.length === 0 ? 'not-allowed' : 'pointer' }}
          >
            Import {parsedData.length > 0 ? `(${parsedData.length})` : ''} Students
          </button>
        </div>
      </div>
    </Modal>
  );
}
