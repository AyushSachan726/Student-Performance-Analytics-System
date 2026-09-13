import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, Upload, CheckCircle2 } from 'lucide-react';
import { getStudents, addStudent, deleteStudent, exportStudentsToCSV } from '../data/students';
import StudentTable from '../components/StudentTable';
import Modal from '../components/Modal';
import StudentForm from '../components/StudentForm';
import CsvUploadModal from '../components/CsvUploadModal';
import { Download } from 'lucide-react';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    setStudents(getStudents());
  }, []);

  function handleAdd(formData) {
    addStudent(formData);
    setStudents(getStudents());
    setShowAddModal(false);
    triggerToast('Student added successfully!');
  }

  function handleCsvSuccess(importedList) {
    setStudents(getStudents());
    triggerToast(`Successfully imported ${importedList.length} students from CSV!`);
  }

  function triggerToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  }

  function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteStudent(id);
      setStudents(getStudents());
      triggerToast('Student record removed.');
    }
  }

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter === 'all' || s.class === classFilter;
    const matchesSection = sectionFilter === 'all' || s.section === sectionFilter;
    return matchesSearch && matchesClass && matchesSection;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800 }}>
            Students Directory
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Total {students.length} registered students across all classes
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={exportStudentsToCSV}
            title="Download CSV of all students"
          >
            <Download size={17} />
            Export CSV
          </button>
          <button className="btn btn-secondary" onClick={() => setShowCsvModal(true)}>
            <Upload size={17} />
            Import CSV
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <UserPlus size={17} />
            Add Student
          </button>
        </div>
      </div>

      {/* Success Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 18px',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: 'var(--radius-md)',
              color: '#047857',
              fontWeight: 600,
              fontSize: '0.88rem',
            }}
          >
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Filter Toolbar */}
      <div className="toolbar-flex">
        <div className="search-input-pill">
          <Search />
          <input
            type="text"
            placeholder="Search student by name, roll ID or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <select className="select-pill" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
            <option value="all">All Classes</option>
            <option value="10">Class 10</option>
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>

          <select className="select-pill" value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}>
            <option value="all">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
        </div>
      </div>

      {/* Main Student Directory Table */}
      <div className="white-card">
        {filtered.length > 0 ? (
          <StudentTable students={filtered} onDelete={handleDelete} />
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <Search size={42} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p style={{ fontWeight: 600 }}>No students found matching "{search}"</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Student">
        <StudentForm onSubmit={handleAdd} onCancel={() => setShowAddModal(false)} />
      </Modal>

      <CsvUploadModal
        isOpen={showCsvModal}
        onClose={() => setShowCsvModal(false)}
        onImportSuccess={handleCsvSuccess}
      />
    </div>
  );
}
