import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

// adjust paths if needed
import studentGif from './assets/student.gif';
import sectionGif from './assets/sections.gif';
import resultGif from './assets/result.gif';

const initialData = {
  students: [
    { id: 1, name: 'John Doe', email: 'john@example.com', section: 'A', enrollmentDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', section: 'B', enrollmentDate: '2024-01-20' }
  ],
  sections: [
    { id: 1, name: 'Section A', description: 'Computer Science Students' },
    { id: 2, name: 'Section B', description: 'Mathematics Students' }
  ],
  results: [
    { id: 1, studentId: 1, studentName: 'John Doe', subject: 'Mathematics', marks: 95, examDate: '2024-03-15' },
    { id: 2, studentId: 2, studentName: 'Jane Smith', subject: 'Physics', marks: 88, examDate: '2024-03-16' }
  ]
};

const App = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState(initialData.students);
  const [sections, setSections] = useState(initialData.sections);
  const [results, setResults] = useState(initialData.results);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState(null);
  const [filterStudent, setFilterStudent] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const getGrade = (marks) => {
    if (marks >= 90) return { grade: 'A+', color: '#10b981' };
    if (marks >= 80) return { grade: 'A', color: '#3b82f6' };
    if (marks >= 70) return { grade: 'B', color: '#8b5cf6' };
    if (marks >= 60) return { grade: 'C', color: '#f59e0b' };
    if (marks >= 50) return { grade: 'D', color: '#ef4444' };
    return { grade: 'F', color: '#dc2626' };
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item || {});
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (modalType === 'student') {
      if (!formData.name?.trim()) newErrors.name = 'Name is required';
      if (!formData.email?.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    } else if (modalType === 'section') {
      if (!formData.name?.trim()) newErrors.name = 'Name is required';
    } else if (modalType === 'result') {
      if (!formData.studentId) newErrors.studentId = 'Student is required';
      if (!formData.subject?.trim()) newErrors.subject = 'Subject is required';
      if (formData.marks === undefined || formData.marks === '') newErrors.marks = 'Marks are required';
      else if (formData.marks < 0 || formData.marks > 100) newErrors.marks = 'Marks must be between 0 and 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    if (modalType === 'student') {
      if (editingItem) {
        setStudents(students.map(s => s.id === editingItem.id ? { ...formData, id: editingItem.id } : s));
        showNotification('Student updated successfully!');
      } else {
        setStudents([...students, { ...formData, id: Date.now() }]);
        showNotification('Student added successfully!');
      }
    } else if (modalType === 'section') {
      if (editingItem) {
        setSections(sections.map(s => s.id === editingItem.id ? { ...formData, id: editingItem.id } : s));
        showNotification('Section updated successfully!');
      } else {
        setSections([...sections, { ...formData, id: Date.now() }]);
        showNotification('Section added successfully!');
      }
    } else if (modalType === 'result') {
      const studentName = students.find(s => s.id === parseInt(formData.studentId))?.name || '';
      if (editingItem) {
        setResults(results.map(r => r.id === editingItem.id ? { ...formData, id: editingItem.id, studentName } : r));
        showNotification('Result updated successfully!');
      } else {
        setResults([...results, { ...formData, id: Date.now(), studentName }]);
        showNotification('Result added successfully!');
      }
    }
    
    closeModal();
  };

  const handleDelete = (type, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (type === 'student') {
        setStudents(students.filter(s => s.id !== id));
        showNotification('Student deleted successfully!');
      } else if (type === 'section') {
        setSections(sections.filter(s => s.id !== id));
        showNotification('Section deleted successfully!');
      } else if (type === 'result') {
        setResults(results.filter(r => r.id !== id));
        showNotification('Result deleted successfully!');
      }
    }
  };

  const filteredResults = results.filter(result => {
    const matchesStudent = !filterStudent || result.studentName.toLowerCase().includes(filterStudent.toLowerCase());
    const matchesSubject = !filterSubject || result.subject.toLowerCase().includes(filterSubject.toLowerCase());
    return matchesStudent && matchesSubject;
  });

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Student Result Management System</h1>
      </header>

      {notification && (
        <div style={styles.notification}>{notification}</div>
      )}

      <div style={styles.tabContainer}>
        <button
          style={{...styles.tab, ...(activeTab === 'students' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('students')}
        >
          Students
        </button>
        <button
          style={{...styles.tab, ...(activeTab === 'sections' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('sections')}
        >
          Sections
        </button>
        <button
          style={{...styles.tab, ...(activeTab === 'results' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('results')}
        >
          Results
        </button>
      </div>

      <div style={styles.content}>
        {activeTab === 'students' && (
          <div>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Students</h2>
              <button style={styles.primaryButton} onClick={() => openModal('student')}>
                <Plus size={20} />
                <span>Add New Student</span>
              </button>
            </div>

            <div style={styles.contentRow}>
              <div style={styles.tableWrapper}>
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.tableHeader}>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Section</th>
                        <th style={styles.th}>Enrollment Date</th>
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={styles.emptyState}>No records found</td>
                        </tr>
                      ) : (
                        students.map(student => (
                          <tr
                            key={student.id}
                            style={styles.tableRow}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <td style={styles.td}>{student.name}</td>
                            <td style={styles.td}>{student.email}</td>
                            <td style={styles.td}>{student.section || '-'}</td>
                            <td style={styles.td}>{student.enrollmentDate || '-'}</td>
                            <td style={styles.td}>
                              <button style={styles.iconButton} onClick={() => openModal('student', student)}>
                                <Edit2 size={16} />
                              </button>
                              <button style={styles.iconButtonDanger} onClick={() => handleDelete('student', student.id)}>
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <img src={studentGif} alt="Students" style={styles.gif} />
            </div>
          </div>
        )}

        {activeTab === 'sections' && (
          <div>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Sections</h2>
              <button style={styles.primaryButton} onClick={() => openModal('section')}>
                <Plus size={20} />
                <span>Add New Section</span>
              </button>
            </div>

            <div style={styles.contentRow}>
              <div style={styles.tableWrapper}>
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.tableHeader}>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Description</th>
                        <th style={styles.th}>Total Students</th>
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sections.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={styles.emptyState}>No records found</td>
                        </tr>
                      ) : (
                        sections.map(section => (
                          <tr
                            key={section.id}
                            style={styles.tableRow}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <td style={styles.td}>{section.name}</td>
                            <td style={styles.td}>{section.description || '-'}</td>
                            <td style={styles.td}>{students.filter(s => s.section === section.name).length}</td>
                            <td style={styles.td}>
                              <button style={styles.iconButton} onClick={() => openModal('section', section)}>
                                <Edit2 size={16} />
                              </button>
                              <button style={styles.iconButtonDanger} onClick={() => handleDelete('section', section.id)}>
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <img src={sectionGif} alt="Sections" style={styles.gif} />
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Results</h2>
              <button style={styles.primaryButton} onClick={() => openModal('result')}>
                <Plus size={20} />
                <span>Add New Result</span>
              </button>
            </div>
            
            <div style={styles.filterContainer}>
              <input
                type="text"
                placeholder="Filter by Student Name..."
                style={styles.input}
                value={filterStudent}
                onChange={(e) => setFilterStudent(e.target.value)}
              />
            <input
                type="text"
                placeholder="Filter by Subject..."
                style={styles.input}
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
              />
            </div>

            <div style={styles.contentRow}>
              <div style={styles.tableWrapper}>
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.tableHeader}>
                        <th style={styles.th}>Student Name</th>
                        <th style={styles.th}>Subject</th>
                        <th style={styles.th}>Marks</th>
                        <th style={styles.th}>Grade</th>
                        <th style={styles.th}>Exam Date</th>
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResults.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={styles.emptyState}>No records found</td>
                        </tr>
                      ) : (
                        filteredResults.map(result => {
                          const { grade, color } = getGrade(result.marks);
                          return (
                            <tr
                              key={result.id}
                              style={styles.tableRow}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <td style={styles.td}>{result.studentName}</td>
                              <td style={styles.td}>{result.subject}</td>
                              <td style={styles.td}>{result.marks}</td>
                              <td style={styles.td}>
                                <span style={{...styles.badge, backgroundColor: color}}>{grade}</span>
                              </td>
                              <td style={styles.td}>{result.examDate || '-'}</td>
                              <td style={styles.td}>
                                <button style={styles.iconButton} onClick={() => openModal('result', result)}>
                                  <Edit2 size={16} />
                                </button>
                                <button style={styles.iconButtonDanger} onClick={() => handleDelete('result', result.id)}>
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <img src={resultGif} alt="Results" style={styles.gif} />
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editingItem ? 'Edit' : 'Add New'}{' '}
                {modalType === 'student' ? 'Student' : modalType === 'section' ? 'Section' : 'Result'}
              </h3>
              <button style={styles.closeButton} onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            
            <div style={styles.formContainer}>
              {modalType === 'student' && (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Name *</label>
                    <input
                      type="text"
                      style={{...styles.input, ...(errors.name ? styles.inputError : {})}}
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    {errors.name && <span style={styles.errorText}>{errors.name}</span>}
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email *</label>
                    <input
                      type="email"
                      style={{...styles.input, ...(errors.email ? styles.inputError : {})}}
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    {errors.email && <span style={styles.errorText}>{errors.email}</span>}
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Section</label>
                    <select
                      style={styles.input}
                      value={formData.section || ''}
                      onChange={(e) => setFormData({...formData, section: e.target.value})}
                    >
                      <option value="">Select Section</option>
                      {sections.map(section => (
                        <option key={section.id} value={section.name}>{section.name}</option>
                      ))}
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Enrollment Date</label>
                    <input
                      type="date"
                      style={styles.input}
                      value={formData.enrollmentDate || ''}
                      onChange={(e) => setFormData({...formData, enrollmentDate: e.target.value})}
                    />
                  </div>
                </>
              )}

              {modalType === 'section' && (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Name *</label>
                    <input
                      type="text"
                      style={{...styles.input, ...(errors.name ? styles.inputError : {})}}
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    {errors.name && <span style={styles.errorText}>{errors.name}</span>}
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Description</label>
                    <textarea
                      style={{...styles.input, minHeight: '100px', resize: 'vertical', fontFamily: 'inherit'}}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </>
              )}

              {modalType === 'result' && (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Student *</label>
                    <select
                      style={{...styles.input, ...(errors.studentId ? styles.inputError : {})}}
                      value={formData.studentId || ''}
                      onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                    >
                      <option value="">Select Student</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id}>{student.name}</option>
                      ))}
                    </select>
                    {errors.studentId && <span style={styles.errorText}>{errors.studentId}</span>}
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Subject *</label>
                    <input
                      type="text"
                      style={{...styles.input, ...(errors.subject ? styles.inputError : {})}}
                      value={formData.subject || ''}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                    {errors.subject && <span style={styles.errorText}>{errors.subject}</span>}
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Marks (0-100) *</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      style={{...styles.input, ...(errors.marks ? styles.inputError : {})}}
                      value={formData.marks === undefined ? '' : formData.marks}
                      onChange={(e) => setFormData({...formData, marks: e.target.value ? parseInt(e.target.value) : ''})}
                    />
                    {errors.marks && <span style={styles.errorText}>{errors.marks}</span>}
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Exam Date</label>
                    <input
                      type="date"
                      style={styles.input}
                      value={formData.examDate || ''}
                      onChange={(e) => setFormData({...formData, examDate: e.target.value})}
                    />
                  </div>
                </>
              )}

              <div style={styles.modalActions}>
                <button style={styles.secondaryButton} onClick={closeModal}>
                  Cancel
                </button>
                <button style={styles.primaryButton} onClick={handleSubmit}>
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '24px 32px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  headerTitle: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '600',
  },
  notification: {
    padding: '16px 32px',
    backgroundColor: '#10b981',
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
  tabContainer: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    padding: '0 32px',
    display: 'flex',
    gap: '8px',
  },
  tab: {
    padding: '16px 24px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#6b7280',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    color: '#3b82f6',
    borderBottomColor: '#3b82f6',
  },
  content: {
    padding: '32px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  secondaryButton: {
    padding: '10px 20px',
    backgroundColor: 'white',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  filterContainer: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    overflow: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '600px',
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  tableRow: {
    borderTop: '1px solid #e5e7eb',
    transition: 'background-color 0.2s ease',
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#374151',
  },
  emptyState: {
    padding: '48px 16px',
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '14px',
  },
  iconButton: {
    padding: '6px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#3b82f6',
    cursor: 'pointer',
    borderRadius: '4px',
    marginRight: '8px',
    transition: 'all 0.2s ease',
  },
  iconButtonDanger: {
    padding: '6px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '13px',
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #e5e7eb',
  },
  modalTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '4px',
  },
  formContainer: {
    padding: '24px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db', // ✅ fixed line
    borderRadius: '6px',
    fontSize: '14px',
    color: '#374151',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
  },
  inputError: {
    borderColor: '#ef4444',
    outline: 'none',
  },
  errorText: {
    display: 'block',
    marginTop: '4px',
    fontSize: '12px',
    color: '#ef4444',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  },
  contentRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '24px',
  },
  tableWrapper: {
    flex: 1,
  },
  gif: {
    width: '200px',
    borderRadius: '10px',
    objectFit: 'cover',
  },
};

export default App;
