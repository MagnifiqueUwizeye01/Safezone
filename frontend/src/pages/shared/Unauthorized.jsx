import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Layout from '../../components/layout/PublicLayout';

const Unauthorized = () => {
  return (
    <Layout>
      <div className="unauthorized-page">
        <div className="unauthorized-content">
          <h1 className="unauthorized-code">403</h1>
          <h2 className="unauthorized-title">Access Denied</h2>
          <p className="unauthorized-message">
            You don't have permission to access this page.
          </p>
          <div className="unauthorized-actions">
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

export default Unauthorized;

