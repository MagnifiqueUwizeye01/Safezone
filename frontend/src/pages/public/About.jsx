import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Layout from '../../components/layout/PublicLayout';

const About = () => {
  return (
    <Layout>
      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="container">
            <h1>About SafeZone</h1>
            <p className="hero-subtitle">Building Safer Communities Together</p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="about-mission">
          <div className="container">
            <div className="mission-content">
              <div className="mission-text">
                <h2>Our Mission</h2>
                <p>
                  SafeZone is dedicated to creating safer communities through technology-enabled 
                  collaboration. We believe that safety is a shared responsibility, and by 
                  connecting citizens, law enforcement, and community leaders, we can build a 
                  more secure and responsive safety ecosystem.
                </p>
                <p>
                  Our platform leverages location-based services and real-time communication 
                  to ensure that safety information reaches the right people at the right time, 
                  fostering a safer and more connected community.
                </p>
              </div>
              <div className="mission-image">
                <img 
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop" 
                  alt="Community Safety" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="about-values">
          <div className="container">
            <h2>Our Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">🛡️</div>
                <h3>Safety First</h3>
                <p>We prioritize the safety and security of our community members above all else.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🤝</div>
                <h3>Collaboration</h3>
                <p>We believe in working together - citizens, police, and leaders - for common safety goals.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">⚡</div>
                <h3>Responsiveness</h3>
                <p>We ensure rapid response times and real-time information sharing.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🔒</div>
                <h3>Transparency</h3>
                <p>We maintain transparency in our operations and data handling practices.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="about-team">
          <div className="container">
            <h2>How It Works</h2>
            <div className="workflow-steps">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Report</h3>
                <p>Citizens report incidents through our easy-to-use platform</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>Respond</h3>
                <p>Police and authorities receive real-time notifications and respond</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Alert</h3>
                <p>Community members receive safety alerts for their area</p>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <h3>Resolve</h3>
                <p>Issues are tracked and resolved, creating a safer community</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-cta">
          <div className="container">
            <h2>Join Us in Making Communities Safer</h2>
            <p>Be part of the SafeZone community and help create a safer tomorrow</p>
            <div className="cta-buttons">
              <Link to="/register">
                <Button variant="primary" size="lg">Get Started</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">Contact Us</Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;

