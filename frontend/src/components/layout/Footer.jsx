import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Check if we're on a public page
  const isPublicPage = location.pathname === '/' || 
                       location.pathname.startsWith('/about') ||
                       location.pathname.startsWith('/contact') ||
                       location.pathname.startsWith('/features') ||
                       location.pathname.startsWith('/how-it-works') ||
                       location.pathname.startsWith('/public-reports') ||
                       location.pathname === '/login' ||
                       location.pathname === '/register';

  // Show minimal footer for authenticated pages
  if (isAuthenticated && !isPublicPage) {
    return (
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>&copy; {currentYear} SafeZone. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-emerald-700 transition-colors duration-200">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-emerald-700 transition-colors duration-200">Terms of Service</Link>
              <Link to="/contact" className="hover:text-emerald-700 transition-colors duration-200">Get Support</Link>
            </div>
            <p className="text-gray-500">Version 1.0.0</p>
          </div>
        </div>
      </footer>
    );
  }

  // Full footer for public pages
  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SafeZone</h3>
            <p className="text-slate-300 mb-2">Community Safety Platform</p>
            <p className="text-sm text-slate-400">
              Empowering communities to report incidents, receive real-time alerts, 
              and stay connected for a safer tomorrow.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link to="/" className="hover:text-emerald-400 transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition">About</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition">Contact</Link></li>
              <li><Link to="/features" className="hover:text-emerald-400 transition">Features</Link></li>
              <li><Link to="/how-it-works" className="hover:text-emerald-400 transition">How It Works</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link to="/features" className="hover:text-emerald-400 transition">Incident Reporting</Link></li>
              <li><Link to="/features" className="hover:text-emerald-400 transition">Real-Time Alerts</Link></li>
              <li><Link to="/features" className="hover:text-emerald-400 transition">Emergency Contacts</Link></li>
              <li><Link to="/features" className="hover:text-emerald-400 transition">Community Network</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link to="/contact" className="hover:text-emerald-400 transition">Get Support</Link></li>
              <li><Link to="/privacy" className="hover:text-emerald-400 transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-emerald-400 transition">Terms of Service</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              &copy; {currentYear} SafeZone. All rights reserved.
            </p>
            <div className="flex gap-4 text-slate-400">
              <span>Follow us:</span>
              <a href="#" aria-label="Facebook" className="hover:text-emerald-400 transition">📘</a>
              <a href="#" aria-label="Twitter" className="hover:text-emerald-400 transition">🐦</a>
              <a href="#" aria-label="LinkedIn" className="hover:text-emerald-400 transition">💼</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
