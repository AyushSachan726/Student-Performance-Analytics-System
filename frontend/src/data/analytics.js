import { getStudents, SUBJECTS } from './students';

// ─── Overall Stats ──────────────────────────────────────────
export function getOverallStats() {
  const students = getStudents();
  const totalStudents = students.length;

  const averages = students.map((s) => {
    const vals = Object.values(s.subjects);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  });

  const classAverage = averages.reduce((a, b) => a + b, 0) / totalStudents;
  const attendanceAvg = students.reduce((a, s) => a + s.attendance, 0) / totalStudents;

  const sorted = [...students].sort((a, b) => {
    const avgA = Object.values(a.subjects).reduce((x, y) => x + y, 0) / SUBJECTS.length;
    const avgB = Object.values(b.subjects).reduce((x, y) => x + y, 0) / SUBJECTS.length;
    return avgB - avgA;
  });

  return {
    totalStudents,
    classAverage: Math.round(classAverage * 10) / 10,
    attendanceAvg: Math.round(attendanceAvg * 10) / 10,
    topPerformer: sorted[0],
    topPerformers: sorted.slice(0, 5),
    atRisk: students.filter((s) => {
      const avg = Object.values(s.subjects).reduce((a, b) => a + b, 0) / SUBJECTS.length;
      return avg < 55;
    }),
  };
}

// ─── Student Average ────────────────────────────────────────
export function getStudentAverage(student) {
  const vals = Object.values(student.subjects);
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

// ─── Grade Distribution ─────────────────────────────────────
export function getGradeDistribution() {
  const students = getStudents();
  const grades = { 'A+ (90-100)': 0, 'A (80-89)': 0, 'B (70-79)': 0, 'C (60-69)': 0, 'D (50-59)': 0, 'F (<50)': 0 };

  students.forEach((s) => {
    const avg = getStudentAverage(s);
    if (avg >= 90) grades['A+ (90-100)']++;
    else if (avg >= 80) grades['A (80-89)']++;
    else if (avg >= 70) grades['B (70-79)']++;
    else if (avg >= 60) grades['C (60-69)']++;
    else if (avg >= 50) grades['D (50-59)']++;
    else grades['F (<50)']++;
  });

  return Object.entries(grades).map(([grade, count]) => ({ grade, count }));
}

// ─── Grade for a student ────────────────────────────────────
export function getGrade(avg) {
  if (avg >= 90) return 'A+';
  if (avg >= 80) return 'A';
  if (avg >= 70) return 'B';
  if (avg >= 60) return 'C';
  if (avg >= 50) return 'D';
  return 'F';
}

export function getStatus(avg) {
  if (avg >= 90) return 'Excellent';
  if (avg >= 75) return 'Good';
  if (avg >= 55) return 'Average';
  return 'At Risk';
}

// ─── Subject-wise Stats ─────────────────────────────────────
export function getSubjectStats() {
  const students = getStudents();
  return SUBJECTS.map((subj) => {
    const marks = students.map((s) => s.subjects[subj] || 0);
    const avg = marks.reduce((a, b) => a + b, 0) / marks.length;
    const max = Math.max(...marks);
    const min = Math.min(...marks);
    const topStudent = students.find((s) => s.subjects[subj] === max);
    const passing = marks.filter((m) => m >= 50).length;

    return {
      subject: subj,
      average: Math.round(avg * 10) / 10,
      highest: max,
      lowest: min,
      topStudent: topStudent?.name || 'N/A',
      passRate: Math.round((passing / marks.length) * 100),
    };
  });
}

// ─── Performance Trend (aggregated semester data) ───────────
export function getPerformanceTrend() {
  const students = getStudents();
  const sems = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
  return sems.map((sem) => {
    const vals = students
      .map((s) => s.semesters.find((x) => x.sem === sem)?.avg)
      .filter((v) => v != null);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return { semester: sem, average: Math.round(avg * 10) / 10 };
  });
}

// ─── Radar data for subject comparison ──────────────────────
export function getSubjectRadarData() {
  const stats = getSubjectStats();
  return stats.map((s) => ({ subject: s.subject, average: s.average, highest: s.highest }));
}

// ─── Leaderboard ────────────────────────────────────────────
export function getLeaderboard(subject = null) {
  const students = getStudents();
  return [...students]
    .map((s) => {
      const avg = subject
        ? s.subjects[subject] || 0
        : Object.values(s.subjects).reduce((a, b) => a + b, 0) / SUBJECTS.length;
      return { ...s, avg: Math.round(avg * 10) / 10 };
    })
    .sort((a, b) => b.avg - a.avg);
}

// ─── Student Strengths / Weaknesses ─────────────────────────
export function getStrengthsWeaknesses(student) {
  const entries = Object.entries(student.subjects).sort((a, b) => b[1] - a[1]);
  return {
    strengths: entries.slice(0, 2).map(([s, v]) => ({ subject: s, marks: v })),
    weaknesses: entries.slice(-2).map(([s, v]) => ({ subject: s, marks: v })),
  };
}
