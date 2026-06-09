import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Layout from '../../components/layout/PublicLayout';

const Features = () => {
  const features = [
    {
      icon: '🚨',
      title: 'Incident Reporting',
      description: 'Quick and easy incident reporting with location tagging and detailed descriptions.',
      details: [
        'Multiple report types (Theft, Violence, Harassment, etc.)',
        'Location-based reporting',
        'Status tracking',
        'Photo attachments support',
      ],
    },
    {
      icon: '📢',
      title: 'Real-Time Alerts',
      description: 'Receive instant safety alerts for your area from authorities and community leaders.',
      details: [
        'Location-based alert distribution',
        'Multiple alert types',
        'Push notifications',
        'Email notifications',
      ],
    },
    {
      icon: '🆘',
      title: 'Emergency Contacts',
      description: 'Quick access to location-specific emergency services directory.',
      details: [
        'Police contacts',
        'Fire department',
        'Medical services',
        'Other emergency services',
      ],
    },
    {
      icon: '👥',
      title: 'Community Network',
      description: 'Connect with your community, police, and leaders for enhanced safety.',
      details: [
        'Role-based access',
        'Community forums',
        'Collaborative safety efforts',
        'Transparent communication',
      ],
    },
    {
      icon: '📊',
      title: 'Analytics & Insights',
      description: 'Comprehensive analytics for incident trends and safety patterns.',
      details: [
        'Incident statistics',
        'Location-based analytics',
        'Trend analysis',
        'Safety reports',
      ],
    },
    {
      icon: '🔔',
      title: 'Smart Notifications',
      description: 'Personalized notifications based on your location and preferences.',
      details: [
        'Customizable preferences',
        'Real-time updates',
        'Unread notifications',
        'Notification history',
      ],
    },
  ];

  return (
    <Layout>
      <div className="features-page">
        <section className="features-hero">
          <div className="container">
            <h1>Features</h1>
            <p className="hero-subtitle">Comprehensive Safety Platform Features</p>
          </div>
        </section>

        <section className="features-list">
          <div className="container">
            {features.map((feature, index) => (
              <div key={index} className="feature-detail">
                <div className="feature-detail-content">
                  <div className="feature-icon-large">{feature.icon}</div>
                  <h2>{feature.title}</h2>
                  <p className="feature-description">{feature.description}</p>
                  <ul className="feature-details-list">
                    {feature.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="features-cta">
          <div className="container">
            <h2>Ready to Experience These Features?</h2>
            <p>Join SafeZone today and start making your community safer</p>
            <div className="cta-buttons">
              <Link to="/register">
                <Button variant="primary" size="lg">Sign Up Now</Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="outline" size="lg">Learn How It Works</Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Features;

