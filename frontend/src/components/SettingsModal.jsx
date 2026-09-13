import { useState } from 'react';
import { Settings, Download, RotateCcw, CheckCircle2 } from 'lucide-react';
import Modal from './Modal';
import { getSettings, saveSettings, resetData, exportStudentsToCSV } from '../data/students';

export default function SettingsModal({ isOpen, onClose, onDataReset }) {
  const [settings, setSettingsState] = useState(getSettings());
  const [savedMessage, setSavedMessage] = useState('');

  function handleSave(e) {
    e.preventDefault();
    saveSettings(settings);
    setSavedMessage('Settings saved successfully!');
    setTimeout(() => {
      setSavedMessage('');
      onClose();
    }, 1200);
  }

  function handleReset() {
    if (window.confirm('Reset all student data to original 30 records? Any added students will be cleared.')) {
      resetData();
      if (onDataReset) onDataReset();
      onClose();
      window.location.reload();
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Academic System Settings">
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {savedMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: 'var(--radius-md)',
            color: '#059669',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}>
            <CheckCircle2 size={16} />
            <span>{savedMessage}</span>
          </div>
        )}

        <div className="field-group">
          <label>School / Institution Name</label>
          <input
            type="text"
            value={settings.schoolName}
            onChange={(e) => setSettingsState({ ...settings, schoolName: e.target.value })}
            placeholder="School name"
            required
          />
        </div>

        <div className="field-row-2">
          <div className="field-group">
            <label>Current Academic Session</label>
            <input
              type="text"
              value={settings.academicYear}
              onChange={(e) => setSettingsState({ ...settings, academicYear: e.target.value })}
              placeholder="e.g. 2025-26"
            />
          </div>

          <div className="field-group">
            <label>Evaluation Term</label>
            <input
              type="text"
              value={settings.termName}
              onChange={(e) => setSettingsState({ ...settings, termName: e.target.value })}
              placeholder="e.g. Mid-Term 1"
            />
          </div>
        </div>

        <div className="field-row-2">
          <div className="field-group">
            <label>Passing Threshold (%)</label>
            <input
              type="number"
              min="30"
              max="70"
              value={settings.passingScore}
              onChange={(e) => setSettingsState({ ...settings, passingScore: Number(e.target.value) })}
            />
          </div>

          <div className="field-group">
            <label>Excellence (A+) Cutoff (%)</label>
            <input
              type="number"
              min="80"
              max="98"
              value={settings.excellenceScore}
              onChange={(e) => setSettingsState({ ...settings, excellenceScore: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* Data Utilities */}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
          <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
            Data Management
          </h4>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={exportStudentsToCSV}
            >
              <Download size={14} /> Export Backup (CSV)
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={handleReset}
            >
              <RotateCcw size={14} /> Reset Database
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Preferences
          </button>
        </div>
      </form>
    </Modal>
  );
}
