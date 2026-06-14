import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDepartments } from '../context/DepartmentsContext';

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', first_name: '', last_name: '',
    role: 'student', department: '', student_number: '',
    staff_number: '', phone_number: '', password: '', password2: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { departments, ensureLoaded } = useDepartments();
  const navigate = useNavigate();

  useEffect(() => { ensureLoaded(); }, [ensureLoaded]);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.department) delete payload.department;
      if (!payload.student_number) delete payload.student_number;
      if (!payload.staff_number) delete payload.staff_number;
      await register(payload);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      if (err.response?.data) setErrors(err.response.data);
      else setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const isStudent = form.role === 'student';
  const isStaff = ['work_supervisor', 'acad_supervisor', 'admin'].includes(form.role);

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div className="auth-brand">
          <div className="auth-brand-icon">I</div>
          <span style={{ fontWeight: 700, fontSize: 17 }}>ILES Portal</span>
        </div>
        <h1>Create account</h1>
        <p className="subtitle">Register to access the internship system</p>

        {errors.general && <div className="alert alert-error">{errors.general}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First name <span className="req">*</span></label>
              <input name="first_name" className="form-control" value={form.first_name} onChange={handleChange} required />
              {errors.first_name && <div className="form-error">{errors.first_name}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Last name <span className="req">*</span></label>
              <input name="last_name" className="form-control" value={form.last_name} onChange={handleChange} required />
              {errors.last_name && <div className="form-error">{errors.last_name}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Username <span className="req">*</span></label>
            <input name="username" className="form-control" value={form.username} onChange={handleChange} required />
            {errors.username && <div className="form-error">{errors.username}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Role <span className="req">*</span></label>
              <select name="role" className="form-control" value={form.role} onChange={handleChange}>
                <option value="student">Student Intern</option>
                <option value="work_supervisor">Workplace Supervisor</option>
                <option value="acad_supervisor">Academic Supervisor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select name="department" className="form-control" value={form.department} onChange={handleChange}>
                <option value="">— Select —</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>

          {isStudent && (
            <div className="form-group">
              <label className="form-label">Student number</label>
              <input name="student_number" className="form-control" value={form.student_number} onChange={handleChange} />
              {errors.student_number && <div className="form-error">{errors.student_number}</div>}
            </div>
          )}

          {isStaff && (
            <div className="form-group">
              <label className="form-label">Staff number</label>
              <input name="staff_number" className="form-control" value={form.staff_number} onChange={handleChange} />
              {errors.staff_number && <div className="form-error">{errors.staff_number}</div>}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Phone number</label>
            <input name="phone_number" className="form-control" value={form.phone_number} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password <span className="req">*</span></label>
              <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm password <span className="req">*</span></label>
              <input type="password" name="password2" className="form-control" value={form.password2} onChange={handleChange} required />
              {errors.password2 && <div className="form-error">{errors.password2}</div>}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '11px' }}
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13.5, color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}