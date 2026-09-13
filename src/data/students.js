// ─── Seed Data ──────────────────────────────────────────────
const STORAGE_KEY = 'spa_students';
const SETTINGS_KEY = 'spa_settings';

const DEFAULT_SETTINGS = {
  academicYear: '2025-26',
  schoolName: 'St. Xavier International School',
  passingScore: 50,
  excellenceScore: 90,
  termName: 'Term 1 / Mid-Term',
};

const SEED_STUDENTS = [
  { id: 'STU001', name: 'Aarav Sharma', class: '10', section: 'A', email: 'aarav.s@school.edu', avatarColor: '#4f46e5', attendance: 94, subjects: { Mathematics: 92, Science: 88, English: 78, History: 85, 'Computer Science': 95, Art: 72 }, semesters: [{ sem: 'Sem 1', avg: 82 }, { sem: 'Sem 2', avg: 85 }, { sem: 'Sem 3', avg: 87 }, { sem: 'Sem 4', avg: 85 }] },
  { id: 'STU002', name: 'Priya Patel', class: '10', section: 'A', email: 'priya.p@school.edu', avatarColor: '#db2777', attendance: 97, subjects: { Mathematics: 98, Science: 95, English: 92, History: 88, 'Computer Science': 97, Art: 85 }, semesters: [{ sem: 'Sem 1', avg: 90 }, { sem: 'Sem 2', avg: 92 }, { sem: 'Sem 3', avg: 93 }, { sem: 'Sem 4', avg: 93 }] },
  { id: 'STU003', name: 'Rohan Gupta', class: '10', section: 'B', email: 'rohan.g@school.edu', avatarColor: '#0d9488', attendance: 82, subjects: { Mathematics: 65, Science: 70, English: 72, History: 68, 'Computer Science': 74, Art: 80 }, semesters: [{ sem: 'Sem 1', avg: 68 }, { sem: 'Sem 2', avg: 70 }, { sem: 'Sem 3', avg: 71 }, { sem: 'Sem 4', avg: 72 }] },
  { id: 'STU004', name: 'Ananya Singh', class: '10', section: 'A', email: 'ananya.s@school.edu', avatarColor: '#d97706', attendance: 91, subjects: { Mathematics: 88, Science: 82, English: 90, History: 92, 'Computer Science': 78, Art: 95 }, semesters: [{ sem: 'Sem 1', avg: 84 }, { sem: 'Sem 2', avg: 86 }, { sem: 'Sem 3', avg: 87 }, { sem: 'Sem 4', avg: 88 }] },
  { id: 'STU005', name: 'Vikram Reddy', class: '10', section: 'B', email: 'vikram.r@school.edu', avatarColor: '#dc2626', attendance: 76, subjects: { Mathematics: 45, Science: 52, English: 58, History: 48, 'Computer Science': 55, Art: 62 }, semesters: [{ sem: 'Sem 1', avg: 50 }, { sem: 'Sem 2', avg: 52 }, { sem: 'Sem 3', avg: 53 }, { sem: 'Sem 4', avg: 53 }] },
  { id: 'STU006', name: 'Sneha Joshi', class: '10', section: 'A', email: 'sneha.j@school.edu', avatarColor: '#7c3aed', attendance: 95, subjects: { Mathematics: 90, Science: 92, English: 88, History: 78, 'Computer Science': 94, Art: 70 }, semesters: [{ sem: 'Sem 1', avg: 84 }, { sem: 'Sem 2', avg: 85 }, { sem: 'Sem 3', avg: 86 }, { sem: 'Sem 4', avg: 85 }] },
  { id: 'STU007', name: 'Arjun Nair', class: '10', section: 'B', email: 'arjun.n@school.edu', avatarColor: '#0284c7', attendance: 88, subjects: { Mathematics: 75, Science: 80, English: 82, History: 74, 'Computer Science': 85, Art: 78 }, semesters: [{ sem: 'Sem 1', avg: 76 }, { sem: 'Sem 2', avg: 78 }, { sem: 'Sem 3', avg: 79 }, { sem: 'Sem 4', avg: 79 }] },
  { id: 'STU008', name: 'Meera Krishnan', class: '10', section: 'A', email: 'meera.k@school.edu', avatarColor: '#059669', attendance: 98, subjects: { Mathematics: 96, Science: 94, English: 97, History: 90, 'Computer Science': 92, Art: 88 }, semesters: [{ sem: 'Sem 1', avg: 92 }, { sem: 'Sem 2', avg: 93 }, { sem: 'Sem 3', avg: 94 }, { sem: 'Sem 4', avg: 93 }] },
  { id: 'STU009', name: 'Kabir Malhotra', class: '10', section: 'B', email: 'kabir.m@school.edu', avatarColor: '#ea580c', attendance: 85, subjects: { Mathematics: 70, Science: 65, English: 75, History: 80, 'Computer Science': 68, Art: 90 }, semesters: [{ sem: 'Sem 1', avg: 72 }, { sem: 'Sem 2', avg: 74 }, { sem: 'Sem 3', avg: 75 }, { sem: 'Sem 4', avg: 75 }] },
  { id: 'STU010', name: 'Diya Verma', class: '10', section: 'A', email: 'diya.v@school.edu', avatarColor: '#9333ea', attendance: 92, subjects: { Mathematics: 85, Science: 88, English: 82, History: 90, 'Computer Science': 80, Art: 92 }, semesters: [{ sem: 'Sem 1', avg: 84 }, { sem: 'Sem 2', avg: 86 }, { sem: 'Sem 3', avg: 86 }, { sem: 'Sem 4', avg: 86 }] },
  { id: 'STU011', name: 'Ishaan Mehta', class: '11', section: 'A', email: 'ishaan.m@school.edu', avatarColor: '#2563eb', attendance: 90, subjects: { Mathematics: 82, Science: 78, English: 85, History: 76, 'Computer Science': 90, Art: 68 }, semesters: [{ sem: 'Sem 1', avg: 78 }, { sem: 'Sem 2', avg: 80 }, { sem: 'Sem 3', avg: 80 }, { sem: 'Sem 4', avg: 80 }] },
  { id: 'STU012', name: 'Riya Kapoor', class: '11', section: 'A', email: 'riya.k@school.edu', avatarColor: '#db2777', attendance: 96, subjects: { Mathematics: 94, Science: 90, English: 96, History: 92, 'Computer Science': 88, Art: 94 }, semesters: [{ sem: 'Sem 1', avg: 90 }, { sem: 'Sem 2', avg: 91 }, { sem: 'Sem 3', avg: 92 }, { sem: 'Sem 4', avg: 92 }] },
  { id: 'STU013', name: 'Aditya Banerjee', class: '11', section: 'B', email: 'aditya.b@school.edu', avatarColor: '#16a34a', attendance: 78, subjects: { Mathematics: 58, Science: 62, English: 55, History: 60, 'Computer Science': 65, Art: 72 }, semesters: [{ sem: 'Sem 1', avg: 58 }, { sem: 'Sem 2', avg: 60 }, { sem: 'Sem 3', avg: 62 }, { sem: 'Sem 4', avg: 62 }] },
  { id: 'STU014', name: 'Nisha Agarwal', class: '11', section: 'A', email: 'nisha.a@school.edu', avatarColor: '#e11d48', attendance: 93, subjects: { Mathematics: 87, Science: 84, English: 90, History: 88, 'Computer Science': 82, Art: 86 }, semesters: [{ sem: 'Sem 1', avg: 84 }, { sem: 'Sem 2', avg: 86 }, { sem: 'Sem 3', avg: 86 }, { sem: 'Sem 4', avg: 86 }] },
  { id: 'STU015', name: 'Dev Choudhary', class: '11', section: 'B', email: 'dev.c@school.edu', avatarColor: '#0284c7', attendance: 80, subjects: { Mathematics: 42, Science: 48, English: 52, History: 55, 'Computer Science': 50, Art: 58 }, semesters: [{ sem: 'Sem 1', avg: 48 }, { sem: 'Sem 2', avg: 50 }, { sem: 'Sem 3', avg: 51 }, { sem: 'Sem 4', avg: 51 }] },
  { id: 'STU016', name: 'Kavya Iyer', class: '11', section: 'A', email: 'kavya.i@school.edu', avatarColor: '#c026d3', attendance: 99, subjects: { Mathematics: 99, Science: 97, English: 95, History: 93, 'Computer Science': 98, Art: 90 }, semesters: [{ sem: 'Sem 1', avg: 94 }, { sem: 'Sem 2', avg: 95 }, { sem: 'Sem 3', avg: 95 }, { sem: 'Sem 4', avg: 95 }] },
  { id: 'STU017', name: 'Rahul Tiwari', class: '11', section: 'B', email: 'rahul.t@school.edu', avatarColor: '#65a30d', attendance: 87, subjects: { Mathematics: 72, Science: 75, English: 68, History: 70, 'Computer Science': 78, Art: 65 }, semesters: [{ sem: 'Sem 1', avg: 70 }, { sem: 'Sem 2', avg: 71 }, { sem: 'Sem 3', avg: 72 }, { sem: 'Sem 4', avg: 72 }] },
  { id: 'STU018', name: 'Simran Dhawan', class: '11', section: 'A', email: 'simran.d@school.edu', avatarColor: '#ea580c', attendance: 94, subjects: { Mathematics: 88, Science: 85, English: 92, History: 86, 'Computer Science': 84, Art: 90 }, semesters: [{ sem: 'Sem 1', avg: 86 }, { sem: 'Sem 2', avg: 87 }, { sem: 'Sem 3', avg: 88 }, { sem: 'Sem 4', avg: 88 }] },
  { id: 'STU019', name: 'Aryan Saxena', class: '12', section: 'A', email: 'aryan.s@school.edu', avatarColor: '#4f46e5', attendance: 89, subjects: { Mathematics: 80, Science: 82, English: 78, History: 74, 'Computer Science': 88, Art: 70 }, semesters: [{ sem: 'Sem 1', avg: 76 }, { sem: 'Sem 2', avg: 78 }, { sem: 'Sem 3', avg: 79 }, { sem: 'Sem 4', avg: 79 }] },
  { id: 'STU020', name: 'Pooja Mishra', class: '12', section: 'A', email: 'pooja.m@school.edu', avatarColor: '#0d9488', attendance: 95, subjects: { Mathematics: 91, Science: 89, English: 94, History: 92, 'Computer Science': 86, Art: 88 }, semesters: [{ sem: 'Sem 1', avg: 88 }, { sem: 'Sem 2', avg: 90 }, { sem: 'Sem 3', avg: 90 }, { sem: 'Sem 4', avg: 90 }] },
  { id: 'STU021', name: 'Karan Deshmukh', class: '12', section: 'B', email: 'karan.d@school.edu', avatarColor: '#dc2626', attendance: 74, subjects: { Mathematics: 38, Science: 42, English: 50, History: 45, 'Computer Science': 48, Art: 55 }, semesters: [{ sem: 'Sem 1', avg: 44 }, { sem: 'Sem 2', avg: 46 }, { sem: 'Sem 3', avg: 46 }, { sem: 'Sem 4', avg: 46 }] },
  { id: 'STU022', name: 'Tanvi Rao', class: '12', section: 'A', email: 'tanvi.r@school.edu', avatarColor: '#7c3aed', attendance: 97, subjects: { Mathematics: 95, Science: 92, English: 90, History: 88, 'Computer Science': 96, Art: 82 }, semesters: [{ sem: 'Sem 1', avg: 90 }, { sem: 'Sem 2', avg: 91 }, { sem: 'Sem 3', avg: 91 }, { sem: 'Sem 4', avg: 91 }] },
  { id: 'STU023', name: 'Nikhil Pandey', class: '12', section: 'B', email: 'nikhil.p@school.edu', avatarColor: '#ea580c', attendance: 83, subjects: { Mathematics: 62, Science: 58, English: 65, History: 70, 'Computer Science': 60, Art: 75 }, semesters: [{ sem: 'Sem 1', avg: 62 }, { sem: 'Sem 2', avg: 64 }, { sem: 'Sem 3', avg: 65 }, { sem: 'Sem 4', avg: 65 }] },
  { id: 'STU024', name: 'Aisha Khan', class: '12', section: 'A', email: 'aisha.k@school.edu', avatarColor: '#0284c7', attendance: 96, subjects: { Mathematics: 93, Science: 90, English: 95, History: 94, 'Computer Science': 88, Art: 92 }, semesters: [{ sem: 'Sem 1', avg: 90 }, { sem: 'Sem 2', avg: 91 }, { sem: 'Sem 3', avg: 92 }, { sem: 'Sem 4', avg: 92 }] },
  { id: 'STU025', name: 'Siddharth Jain', class: '12', section: 'B', email: 'siddharth.j@school.edu', avatarColor: '#059669', attendance: 86, subjects: { Mathematics: 76, Science: 72, English: 70, History: 68, 'Computer Science': 80, Art: 60 }, semesters: [{ sem: 'Sem 1', avg: 70 }, { sem: 'Sem 2', avg: 71 }, { sem: 'Sem 3', avg: 72 }, { sem: 'Sem 4', avg: 72 }] },
  { id: 'STU026', name: 'Zara Sheikh', class: '10', section: 'B', email: 'zara.s@school.edu', avatarColor: '#c026d3', attendance: 93, subjects: { Mathematics: 86, Science: 84, English: 92, History: 88, 'Computer Science': 82, Art: 96 }, semesters: [{ sem: 'Sem 1', avg: 86 }, { sem: 'Sem 2', avg: 87 }, { sem: 'Sem 3', avg: 88 }, { sem: 'Sem 4', avg: 88 }] },
  { id: 'STU027', name: 'Manav Bhatt', class: '11', section: 'B', email: 'manav.b@school.edu', avatarColor: '#2563eb', attendance: 81, subjects: { Mathematics: 55, Science: 60, English: 62, History: 58, 'Computer Science': 64, Art: 70 }, semesters: [{ sem: 'Sem 1', avg: 58 }, { sem: 'Sem 2', avg: 60 }, { sem: 'Sem 3', avg: 62 }, { sem: 'Sem 4', avg: 62 }] },
  { id: 'STU028', name: 'Tara Menon', class: '12', section: 'A', email: 'tara.m@school.edu', avatarColor: '#e11d48', attendance: 92, subjects: { Mathematics: 84, Science: 86, English: 88, History: 82, 'Computer Science': 90, Art: 78 }, semesters: [{ sem: 'Sem 1', avg: 82 }, { sem: 'Sem 2', avg: 84 }, { sem: 'Sem 3', avg: 85 }, { sem: 'Sem 4', avg: 85 }] },
  { id: 'STU029', name: 'Harsh Srivastava', class: '10', section: 'A', email: 'harsh.sr@school.edu', avatarColor: '#16a34a', attendance: 90, subjects: { Mathematics: 78, Science: 82, English: 74, History: 80, 'Computer Science': 86, Art: 68 }, semesters: [{ sem: 'Sem 1', avg: 76 }, { sem: 'Sem 2', avg: 78 }, { sem: 'Sem 3', avg: 78 }, { sem: 'Sem 4', avg: 78 }] },
  { id: 'STU030', name: 'Lavanya Pillai', class: '11', section: 'A', email: 'lavanya.p@school.edu', avatarColor: '#0284c7', attendance: 98, subjects: { Mathematics: 97, Science: 95, English: 93, History: 90, 'Computer Science': 96, Art: 88 }, semesters: [{ sem: 'Sem 1', avg: 92 }, { sem: 'Sem 2', avg: 93 }, { sem: 'Sem 3', avg: 93 }, { sem: 'Sem 4', avg: 93 }] },
];

export const SUBJECTS = ['Mathematics', 'Science', 'English', 'History', 'Computer Science', 'Art'];

// ─── LocalStorage Persistence ───────────────────────────────
function loadStudents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_STUDENTS));
  return [...SEED_STUDENTS];
}

function persist(students) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

// ─── Settings API ───────────────────────────────────────────
export function getSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(newSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  return newSettings;
}

// ─── Public API ─────────────────────────────────────────────
export function getStudents() {
  return loadStudents();
}

export function getStudentById(id) {
  return loadStudents().find((s) => s.id === id) || null;
}

export function addStudent(student) {
  const students = loadStudents();
  const nextId = 'STU' + String(students.length + 1).padStart(3, '0');
  const avg = Math.round(Object.values(student.subjects || {}).reduce((a, b) => a + b, 0) / (SUBJECTS.length || 1));
  const newStudent = {
    ...student,
    id: nextId,
    avatarColor: student.avatarColor || '#4f46e5',
    semesters: student.semesters || [
      { sem: 'Sem 1', avg },
      { sem: 'Sem 2', avg },
      { sem: 'Sem 3', avg },
      { sem: 'Sem 4', avg },
    ],
  };
  students.push(newStudent);
  persist(students);
  return newStudent;
}

export function updateStudent(id, updates) {
  const students = loadStudents();
  const idx = students.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  students[idx] = { ...students[idx], ...updates };
  persist(students);
  return students[idx];
}

export function deleteStudent(id) {
  let students = loadStudents();
  students = students.filter((s) => s.id !== id);
  persist(students);
  return true;
}

export function addStudentsBulk(newStudents) {
  const students = loadStudents();
  let nextNum = students.length + 1;
  const created = [];

  for (const s of newStudents) {
    const nextId = 'STU' + String(nextNum++).padStart(3, '0');
    const avg = Math.round(Object.values(s.subjects || {}).reduce((a, b) => a + b, 0) / (SUBJECTS.length || 1));
    const student = {
      ...s,
      id: nextId,
      avatarColor: s.avatarColor || '#4f46e5',
      semesters: s.semesters || [
        { sem: 'Sem 1', avg },
        { sem: 'Sem 2', avg },
        { sem: 'Sem 3', avg },
        { sem: 'Sem 4', avg },
      ],
    };
    students.push(student);
    created.push(student);
  }

  persist(students);
  return created;
}

export function exportStudentsToCSV() {
  const students = loadStudents();
  const headers = ['name', 'class', 'section', 'email', 'attendance', ...SUBJECTS];
  const rows = students.map((s) => [
    `"${s.name}"`,
    s.class,
    s.section,
    s.email,
    s.attendance,
    ...SUBJECTS.map((sub) => s.subjects[sub] || 0),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `students_export_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  return loadStudents();
}

export const SAMPLE_CSV = `name,class,section,email,attendance,Mathematics,Science,English,History,Computer Science,Art
Manish Verma,10,A,manish.v@school.edu,92,85,90,78,82,88,74
Sonia Sen,10,B,sonia.s@school.edu,95,94,92,90,86,96,88
Amit Saxena,11,A,amit.s@school.edu,86,72,68,75,80,74,70
Farhan Akhtar,11,B,farhan.a@school.edu,89,64,70,72,65,78,80
Kritika Roy,12,A,kritika.r@school.edu,97,96,98,92,90,95,94`;
