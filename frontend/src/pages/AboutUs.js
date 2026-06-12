import React from 'react';
import './AboutUs.css'; 

const AboutUs = () => {
  return (
    <div className="about-container">
      {/* Top Banner Section */}
      <section className="about-hero">
        <h1>About ILES</h1>
        <p className="hero-subtitle">Internship Logbook & Evaluation System</p>
      </section>

      {/* Main Narrative */}
      <section className="about-content">
        <div className="intro-card">
          <h2>Welcome to ILES</h2>
          <p>
            The <strong>Internship Logbook & Evaluation System (ILES)</strong> is a modern, 
            web-based platform built to transform the traditional, paper-based university 
            internship tracking process into a seamless digital experience.
          </p>
          <p>
            Traditionally, managing industrial attachments involves cumbersome physical logbooks, 
            manual supervisor assignments, and delayed feedback loops. ILES bridges this gap 
            by providing a centralized digital portal where students, university supervisors, 
            and field mentors can collaborate, track progress, and complete evaluations in real-time.
          </p>
        </div>

        {/* Mission Statement Box */}
        <div className="mission-card">
          <h2>Our Mission</h2>
          <blockquote className="mission-quote">
            "To digitize, streamline, and elevate the internship attachment lifecycle by 
            empowering students with efficient logging tools and providing supervisors with 
            real-time evaluation insights."
          </blockquote>
        </div>

        {/* Capabilities Breakdown Grid */}
        <div className="capabilities-grid">
          <div className="capability-box student-box">
            <h3>For Students</h3>
            <ul>
              <li><strong>Digital Logbook Entries:</strong> Easily record daily and weekly field activities, tasks performed, and skills acquired.</li>
              <li><strong>Instant Submission:</strong> Submit weekly reports directly through the portal without needing physical signatures.</li>
              <li><strong>Progress Tracking:</strong> Monitor supervisor approvals and review assessment feedback instantly.</li>
            </ul>
          </div>

          <div className="capability-box supervisor-box">
            <h3>For Supervisors & Mentors</h3>
            <ul>
              <li><strong>Remote Monitoring:</strong> Keep track of multiple students' field progress from a centralized dashboard.</li>
              <li><strong>Streamlined Evaluations:</strong> Complete grading rubrics and submit weekly or final evaluation assessments electronically.</li>
              <li><strong>Direct Communication:</strong> Seamlessly verify student presence and performance with industry mentors.</li>
            </ul>
          </div>
        </div>

        {/* Team Section */}
        <div className="team-section">
          <h2>Meet the Developers (Group 8)</h2>
          <p className="team-subtitle">The minds behind the development of ILES</p>
          
          <div className="team-grid">
            <div className="member-card">
              <div className="avatar-placeholder">NJ</div>
              <h3>Naava Jacqueline</h3>
              <p className="role">Frontend Developer & UI/UX Designer</p>
              <p className="desc">Responsible for constructing the user interface, building responsive dashboard components in React, and optimizing the user authentication flows.</p>
            </div>

            <div className="member-card">
              <div className="avatar-placeholder">CA</div>
              <h3>Criss Atuhaire</h3>
              <p className="role">Backend Engineer & Database Administrator</p>
              <p className="desc">Responsible for architecting the relational database schema in PostgreSQL, designing secure REST API endpoints using Django, and implementing environment-driven security configurations.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;