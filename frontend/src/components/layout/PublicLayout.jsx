import React from 'react';
import Header from './Header';
import Footer from './Footer';

const PublicLayout = ({ children }) => {
  return (
    <div className="public-layout">
      <Header />
      <main className="public-layout-content">{children}</main>
      <Footer />
    </div>
  );
};

export default PublicLayout;

