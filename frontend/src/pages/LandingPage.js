import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function LandingSite() {
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
    const canvasRef = useRef(null);

    // Hardware-accelerated Software Project Architecture Animation Engine
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Core components of a modern web development software stack
        const projectModules = [
            'Frontend (React)', 'Backend (Django)', 'PostgreSQL', 'REST API', 
            'JWT Auth', 'Redux Store', 'Docker Container', 'Git Merge', 
            'Nginx Server', 'Logbook Serializer', 'Supervisor Auth Pipeline'
        ];

        // Instantiate nodes with individual positioning vectors, velocities, and labels
        const nodeCount = Math.min(22, Math.floor((canvas.width * canvas.height) / 50000));
        const nodes = Array.from({ length: nodeCount }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            radius: 4,
            label: projectModules[Math.floor(Math.random() * projectModules.length)]
        }));

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Step 1: Draw the connecting network data pipelines
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Connect modules if they drift close enough together
                    if (distance < 160) {
                        const alpha = (1 - distance / 160) * 0.18;
                        ctx.strokeStyle = `rgba(52, 152, 219, ${alpha})`; // Blue link stream
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Step 2: Draw the interactive architecture node blocks
            nodes.forEach((node) => {
                // Update vector positions
                node.x += node.vx;
                node.y += node.vy;

                // Bounce layout edges cleanly
                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

                // Render microservice node dot
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#3498db';
                ctx.fill();

                // Render accompanying technical system title labels
                ctx.font = '600 11px "Courier New", monospace';
                ctx.fillStyle = 'rgba(44, 62, 80, 0.45)';
                ctx.fillText(`[${node.label}]`, node.x + 10, node.y + 4);
            });

            animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const handleContactSubmit = (e) => {
        e.preventDefault();
        alert(`Message sent by ${contactForm.name}! We will get back to you shortly.`);
        setContactForm({ name: '', email: '', message: '' });
    };

    // Global Styles Setup
    const layoutStyle = {
        fontFamily: '"Segoe UI", Roboto, sans-serif',
        color: '#2c3e50',
        backgroundColor: '#fdfefe',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    };

    const canvasContainerStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '25px 5%',
        backgroundColor: 'rgba(255, 255, 255, 0.93)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #ebedf0',
        position: 'sticky',
        top: 0,
        zIndex: 1000
    };

    const brandingStyle = {
        fontSize: '26px',
        fontWeight: '800',
        color: '#2c3e50',
        textDecoration: 'none',
        letterSpacing: '0.5px'
    };

    const authContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        border: '2px solid #e2e8f0',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#ffffff'
    };

    const authTabStyle = {
        padding: '10px 20px',
        textDecoration: 'none',
        fontWeight: '600',
        fontSize: '14px'
    };

    const signupTabStyle = {
        ...authTabStyle,
        backgroundColor: '#3498db',
        color: '#ffffff'
    };

    const loginTabStyle = {
        ...authTabStyle,
        backgroundColor: '#ffffff',
        color: '#3498db'
    };

    const sectionStyle = {
        padding: '90px 10%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        borderBottom: '1px solid #f2f4f7',
        position: 'relative',
        zIndex: 2
    };

    const sectionHeadingStyle = {
        fontSize: '34px',
        fontWeight: '700',
        marginBottom: '25px',
        color: '#2c3e50'
    };

    const bodyTextStyle = {
        fontSize: '17px',
        color: '#657786',
        lineHeight: '1.8',
        maxWidth: '850px',
        margin: '0 auto'
    };

    const welcomeSectionStyle = {
        ...sectionStyle,
        backgroundColor: 'transparent', 
        padding: '140px 10%'
    };

    const mainTitleStyle = {
        fontSize: '52px',
        fontWeight: '800',
        color: '#1a252f',
        margin: '0 0 20px 0',
        lineHeight: '1.2'
    };

    const universityTagStyle = {
        fontSize: '14px',
        fontWeight: '700',
        color: '#3498db',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        marginBottom: '15px'
    };

    const mvGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        width: '100%',
        maxWidth: '1000px',
        marginTop: '30px'
    };

    const mvCardStyle = {
        padding: '40px 30px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(4px)',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        border: '1px solid #edf2f7',
        textAlign: 'left'
    };

    const formStyle = {
        width: '100%',
        maxWidth: '550px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginTop: '30px'
    };

    const inputStyle = {
        width: '100%',
        padding: '14px 18px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box'
    };

    const textareaStyle = {
        ...inputStyle,
        height: '140px',
        resize: 'vertical'
    };

    const submitButtonStyle = {
        backgroundColor: '#2ecc71',
        color: '#ffffff',
        padding: '14px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(46, 204, 113, 0.2)'
    };

    return (
        <div style={layoutStyle}>
            {/* The animation element rendering behind landing block content items */}
            <canvas ref={canvasRef} style={canvasContainerStyle} />

            <header style={headerStyle}>
                <Link to="/" style={brandingStyle}>ILES</Link>
                <div style={authContainerStyle}>
                    <Link to="/signup" style={signupTabStyle}>Signup</Link>
                    <Link to="/login" style={loginTabStyle}>Login</Link>
                </div>
            </header>

            <section style={welcomeSectionStyle}>
                <div style={universityTagStyle}>University of Uganda</div>
                <h1 style={mainTitleStyle}>Welcome to ILES</h1>
                <p style={{...bodyTextStyle, fontSize: '20px', color: '#4a5568'}}>
                    The modern, automated platform optimizing Industrial Training monitoring, daily progress logging, and field metrics translation for Computer Science students and faculty.
                </p>
            </section>

            <section style={{...sectionStyle, backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(2px)'}}>
                <h2 style={sectionHeadingStyle}>Mission & Vision</h2>
                <div style={mvGridStyle}>
                    <div style={mvCardStyle}>
                        <h3 style={{fontSize: '22px', color: '#2c3e50', marginBottom: '15px'}}>Our Mission</h3>
                        <p style={{...bodyTextStyle, fontSize: '15px', textAlign: 'left'}}>
                            To provide an intuitive, high-integrity framework that simplifies how students track field experience and bridges real-time performance logging gaps between host organizations and department academic supervisors.
                        </p>
                    </div>
                    <div style={mvCardStyle}>
                        <h3 style={{fontSize: '22px', color: '#2c3e50', marginBottom: '15px'}}>Our Vision</h3>
                        <p style={{...bodyTextStyle, fontSize: '15px', textAlign: 'left'}}>
                            To establish a transparent, paperless continuous evaluation baseline across East African technical disciplines, leveraging accurate data trails to maximize internship training qualities.
                        </p>
                    </div>
                </div>
            </section>

            <section style={{...sectionStyle, backgroundColor: 'rgba(248, 250, 252, 0.85)', backdropFilter: 'blur(2px)'}}>
                <h2 style={sectionHeadingStyle}>About Us</h2>
                <p style={bodyTextStyle}>
                    The Internship Logging & Evaluation System (ILES) was conceptualized to address the structural challenges of physical logbook maintenance within higher education. Developed specifically for university ecosystems, our software shifts manual paper systems into a collaborative, automated pipeline. By unifying field metrics and programmatic reviews into a centralized digital hub, we enhance verification transparency and simplify the reporting workflow for students and faculties alike.
                </p>
            </section>

            <section style={{...sectionStyle, backgroundColor: 'rgba(255, 255, 255, 0.95)', borderBottom: 'none'}}>
                <h2 style={sectionHeadingStyle}>Contact Us</h2>
                <p style={bodyTextStyle}>
                    Have questions about registration validation rules, custom schemas, or platform deployment? Send a message to the administrator department.
                </p>
                
                <form onSubmit={handleContactSubmit} style={formStyle}>
                    <input 
                        type="text" 
                        placeholder="Your Full Name" 
                        style={inputStyle}
                        required 
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    />
                    <input 
                        type="email" 
                        placeholder="Your Email Address" 
                        style={inputStyle}
                        required 
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    />
                    <textarea 
                        placeholder="Type your message here..." 
                        style={textareaStyle}
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    />
                    <button type="submit" style={submitButtonStyle}>Send Message</button>
                </form>
            </section>

            <footer style={{backgroundColor: '#1a252f', color: '#94a3b8', padding: '25px', textAlign: 'center', fontSize: '14px', marginTop: 'auto', position: 'relative', zIndex: 10}}>
                &copy; {new Date().getFullYear()} Internship Logging & Evaluation System (ILES). All rights reserved.
            </footer>
        </div>
    );
}

export default LandingSite;