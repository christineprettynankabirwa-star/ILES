import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Navbar ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 60px', height: 64,
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        position: 'sticky', top: 0, background: '#fff', zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: '#185FA5', borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 16,
          }}>I</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#2C2C2A' }}>ILES Portal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/login" style={{
            padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 500,
            color: '#185FA5', border: '1px solid #185FA5', textDecoration: 'none',
            transition: 'all 0.15s',
          }}>Sign in</Link>
          <Link to="/register" style={{
            padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 500,
            background: '#185FA5', color: '#fff', textDecoration: 'none',
            transition: 'all 0.15s',
          }}>Get started</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0C447C 0%, #185FA5 50%, #0F6E56 100%)',
        padding: '90px 60px 80px',
        textAlign: 'center',
        color: '#fff',
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(255,255,255,0.15)',
          borderRadius: 20, padding: '6px 16px',
          fontSize: 13, fontWeight: 600, marginBottom: 24,
          border: '1px solid rgba(255,255,255,0.25)',
        }}>
          🎓 Internship Logging & Evaluation System
        </div>
        <h1 style={{
          fontSize: 52, fontWeight: 800, lineHeight: 1.15,
          marginBottom: 22, letterSpacing: -1,
          maxWidth: 700, margin: '0 auto 22px',
        }}>
          Manage internships.<br />Track progress. Evaluate performance.
        </h1>
        <p style={{
          fontSize: 18, color: 'rgba(255,255,255,0.82)',
          maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7,
        }}>
          A unified platform for students, workplace supervisors, academic supervisors,
          and administrators to manage the full internship lifecycle.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" style={{
            padding: '13px 32px', background: '#fff', color: '#185FA5',
            borderRadius: 9, fontSize: 15, fontWeight: 700, textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
          }}>
            Create account →
          </Link>
          <Link to="/login" style={{
            padding: '13px 32px', background: 'rgba(255,255,255,0.15)',
            color: '#fff', borderRadius: 9, fontSize: 15, fontWeight: 600,
            textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)',
          }}>
            Sign in
          </Link>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 48,
          marginTop: 60, flexWrap: 'wrap',
        }}>
          {[
            { value: '4', label: 'User Roles' },
            { value: '7', label: 'Core Modules' },
            { value: '100%', label: 'Workflow Automated' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Roles Section ── */}
      <section style={{ padding: '80px 60px', background: '#F7F6F3' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h2 style={{ fontSize: 34, fontWeight: 700, color: '#2C2C2A', marginBottom: 12 }}>
            Built for every stakeholder
          </h2>
          <p style={{ fontSize: 16, color: '#5F5E5A', maxWidth: 500, margin: '0 auto' }}>
            Each role gets a tailored experience with the right tools and permissions.
          </p>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20, maxWidth: 1000, margin: '0 auto',
        }}>
          {[
            {
              icon: '🎒', title: 'Student Intern',
              color: '#185FA5', bg: '#E6F1FB',
              points: ['Submit weekly logs', 'Track placement status', 'View grades & scores', 'Monitor deadlines'],
            },
            {
              icon: '🏢', title: 'Workplace Supervisor',
              color: '#0F6E56', bg: '#E1F5EE',
              points: ['Review weekly logs', 'Add supervisor comments', 'Approve submissions', 'Monitor student activity'],
            },
            {
              icon: '🎓', title: 'Academic Supervisor',
              color: '#854F0B', bg: '#FAEEDA',
              points: ['Evaluate student performance', 'Compute weighted scores', 'Approve reviewed logs', 'Manage placements'],
            },
            {
              icon: '⚙️', title: 'Administrator',
              color: '#A32D2D', bg: '#FCEBEB',
              points: ['Manage all users', 'View system statistics', 'Configure departments', 'Access all data'],
            },
          ].map(role => (
            <div key={role.title} style={{
              background: '#fff', borderRadius: 14,
              border: '1px solid rgba(0,0,0,0.08)',
              padding: '28px 24px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: role.bg, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 22, marginBottom: 16,
              }}>{role.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#2C2C2A', marginBottom: 14 }}>
                {role.title}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {role.points.map(p => (
                  <li key={p} style={{
                    fontSize: 13.5, color: '#5F5E5A',
                    padding: '4px 0',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{ color: role.color, fontWeight: 700 }}>✓</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Section ── */}
      <section style={{ padding: '80px 60px', background: '#fff' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h2 style={{ fontSize: 34, fontWeight: 700, color: '#2C2C2A', marginBottom: 12 }}>
            Everything you need
          </h2>
          <p style={{ fontSize: 16, color: '#5F5E5A', maxWidth: 500, margin: '0 auto' }}>
            From placement registration to final grading — all in one place.
          </p>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24, maxWidth: 1000, margin: '0 auto',
        }}>
          {[
            { icon: '📋', title: 'Placement Management', desc: 'Register internship placements with organisation details, dates, supervisors, and prevent scheduling conflicts automatically.' },
            { icon: '📝', title: 'Weekly Logbook', desc: 'Students submit weekly activity logs with deadline enforcement. Logs move through Draft → Submitted → Reviewed → Approved.' },
            { icon: '🔄', title: 'Supervisor Workflow', desc: 'Structured review process ensures workplace supervisors review logs before academic supervisors can approve them.' },
            { icon: '📊', title: 'Weighted Evaluation', desc: 'Academic supervisors evaluate students across attendance (40%), technical competence (30%), and quality of work (30%).' },
            { icon: '🏆', title: 'Automatic Grading', desc: 'Total scores are computed automatically and synced to the placement record. Grades A–F are assigned instantly.' },
            { icon: '📈', title: 'Dashboards & Reports', desc: 'Role-specific dashboards with charts showing student progress, pending reviews, and institutional statistics.' },
          ].map(f => (
            <div key={f.title} style={{
              padding: '24px', borderRadius: 12,
              border: '1px solid rgba(0,0,0,0.08)',
              background: '#F7F6F3',
            }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2C2C2A', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13.5, color: '#5F5E5A', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Workflow Section ── */}
      <section style={{ padding: '80px 60px', background: '#0C447C', color: '#fff' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h2 style={{ fontSize: 34, fontWeight: 700, marginBottom: 12 }}>
            How the log workflow works
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 480, margin: '0 auto' }}>
            Every weekly log follows a strict approval chain.
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 0, flexWrap: 'wrap', maxWidth: 860, margin: '0 auto',
        }}>
          {[
            { step: '1', label: 'Draft', desc: 'Student creates log', color: '#888780' },
            { step: '2', label: 'Submitted', desc: 'Student submits log', color: '#185FA5' },
            { step: '3', label: 'Reviewed', desc: 'Workplace supervisor reviews', color: '#BA7517' },
            { step: '4', label: 'Approved', desc: 'Academic supervisor approves', color: '#3B6D11' },
          ].map((s, i, arr) => (
            <React.Fragment key={s.step}>
              <div style={{ textAlign: 'center', padding: '0 12px' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: s.color, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 700, margin: '0 auto 12px',
                  border: '3px solid rgba(255,255,255,0.2)',
                }}>{s.step}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', maxWidth: 110 }}>{s.desc}</div>
              </div>
              {i < arr.length - 1 && (
                <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.3)', padding: '0 4px', marginBottom: 28 }}>→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section style={{
        padding: '80px 60px', textAlign: 'center', background: '#F7F6F3',
      }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: '#2C2C2A', marginBottom: 14 }}>
          Ready to get started?
        </h2>
        <p style={{ fontSize: 16, color: '#5F5E5A', maxWidth: 440, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Join the ILES portal and streamline your internship management today.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" style={{
            padding: '13px 32px', background: '#185FA5', color: '#fff',
            borderRadius: 9, fontSize: 15, fontWeight: 700, textDecoration: 'none',
          }}>
            Create your account →
          </Link>
          <Link to="/login" style={{
            padding: '13px 32px', background: '#fff', color: '#185FA5',
            borderRadius: 9, fontSize: 15, fontWeight: 600,
            textDecoration: 'none', border: '1px solid #185FA5',
          }}>
            Sign in
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: '24px 60px',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#fff', flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, background: '#185FA5', borderRadius: 7,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 13,
          }}>I</div>
          <span style={{ fontWeight: 600, fontSize: 14, color: '#2C2C2A' }}>ILES Portal</span>
        </div>
        <p style={{ fontSize: 13, color: '#888780', margin: 0 }}>
          © {new Date().getFullYear()} Internship Logging & Evaluation System · CSC 1202 designed By BALEERO ISAAC, NANKABIRWA CHRISTINE, SSALI JOEL AND NAMKUKA JACQUELINE NAAVA
        </p>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link to="/login" style={{ fontSize: 13, color: '#5F5E5A', textDecoration: 'none' }}>Sign in</Link>
          <Link to="/register" style={{ fontSize: 13, color: '#5F5E5A', textDecoration: 'none' }}>Register</Link>
        </div>
      </footer>

    </div>
  );
}
