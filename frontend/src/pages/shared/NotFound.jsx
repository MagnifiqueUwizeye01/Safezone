import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Layout from '../../components/layout/PublicLayout';

const NotFound = () => {
  return (
    <Layout>
      <div className="not-found-page">
        <div className="not-found-content">
          <h1 className="not-found-code">404</h1>
          <h2 className="not-found-title">Page Not Found</h2>
          <p className="not-found-message">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="not-found-actions">
            <Link to="/">
              <Button variant="primary" size="lg">Go Home</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;

