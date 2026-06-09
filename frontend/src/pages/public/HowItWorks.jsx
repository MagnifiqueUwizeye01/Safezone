import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Layout from '../../components/layout/PublicLayout';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: 'Sign Up',
      description: 'Create your SafeZone account and select your role (Citizen, Police, or Community Leader)',
      icon: '👤',
    },
    {
      number: 2,
      title: 'Set Your Location',
      description: 'Select your location using our hierarchical system (Province → District → Sector → Cell → Village)',
      icon: '📍',
    },
    {
      number: 3,
      title: 'Report or Monitor',
      description: 'Citizens can report incidents, while Police and Leaders can monitor and respond to reports',
      icon: '📝',
    },
    {
      number: 4,
      title: 'Receive Alerts',
      description: 'Get real-time safety alerts for your area and stay informed about community safety',
      icon: '🔔',
    },
    {
      number: 5,
      title: 'Stay Connected',
      description: 'Access emergency contacts, view analytics, and collaborate with your community',
      icon: '🤝',
    },
  ];

  const roles = [
    {
      role: 'Citizen',
      icon: '👥',
      features: [
        'Report incidents quickly',
        'Receive safety alerts',
        'Access emergency contacts',
        'View your report history',
        'Manage notifications',
      ],
    },
    {
      role: 'Police',
      icon: '👮',
      features: [
        'Monitor all reports',
        'Update report status',
        'Create safety alerts',
        'View analytics',
        'Manage emergency contacts',
      ],
    },
    {
      role: 'Community Leader',
      icon: '🏛️',
      features: [
        'Monitor community reports',
        'Create community alerts',
        'View community statistics',
        'Coordinate with police',
        'Manage local contacts',
      ],
    },
  ];

  return (
    <Layout>
      <div className="how-it-works-page">
        <section className="how-hero">
          <div className="container">
            <h1>How It Works</h1>
            <p className="hero-subtitle">Simple steps to a safer community</p>
          </div>
        </section>

        <section className="steps-section">
          <div className="container">
            <h2>Getting Started</h2>
            <div className="steps-grid">
              {steps.map((step) => (
                <div key={step.number} className="step-card">
                  <div className="step-number">{step.number}</div>
                  <div className="step-icon">{step.icon}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="roles-section">
          <div className="container">
            <h2>Role-Based Features</h2>
            <div className="roles-grid">
              {roles.map((role, index) => (
                <div key={index} className="role-card">
                  <div className="role-icon">{role.icon}</div>
                  <h3>{role.role}</h3>
                  <ul className="role-features">
                    {role.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="process-section">
          <div className="container">
            <h2>The Process</h2>
            <div className="process-flow">
              <div className="process-step">
                <div className="process-icon">📱</div>
                <h4>1. Report Incident</h4>
                <p>Citizen reports an incident through the app</p>
              </div>
              <div className="process-arrow">→</div>
              <div className="process-step">
                <div className="process-icon">🔔</div>
                <h4>2. Notification</h4>
                <p>Police receive real-time notification</p>
              </div>
              <div className="process-arrow">→</div>
              <div className="process-step">
                <div className="process-icon">👮</div>
                <h4>3. Response</h4>
                <p>Police respond and update status</p>
              </div>
              <div className="process-arrow">→</div>
              <div className="process-step">
                <div className="process-icon">✅</div>
                <h4>4. Resolution</h4>
                <p>Issue is resolved and tracked</p>
              </div>
            </div>
          </div>
        </section>

        <section className="how-cta">
          <div className="container">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of users making their communities safer</p>
            <div className="cta-buttons">
              <Link to="/register">
                <Button variant="primary" size="lg">Create Account</Button>
              </Link>
              <Link to="/features">
                <Button variant="outline" size="lg">View Features</Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HowItWorks;

