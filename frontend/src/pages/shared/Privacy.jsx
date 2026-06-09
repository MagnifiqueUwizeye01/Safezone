import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/layout/Layout';
import PublicLayout from '../../components/layout/PublicLayout';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const Privacy = () => {
  const { isAuthenticated } = useAuth();
  const MainLayout = isAuthenticated ? Layout : PublicLayout;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-emerald-600" />
              <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
            
            <p className="text-gray-600 mb-8">Last updated: December 2024</p>

            <div className="prose prose-gray max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-emerald-600" />
                  1. Information We Collect
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  SafeZone collects information necessary to provide our community safety services:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Personal information (name, email, phone number) for account creation</li>
                  <li>Location data (Province, District, Sector, Cell, Village) for location-based services</li>
                  <li>Incident reports and related information you submit</li>
                  <li>Usage data and interaction with the platform</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-emerald-600" />
                  2. How We Use Your Information
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use collected information to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Provide and improve our safety services</li>
                  <li>Send location-based safety alerts and notifications</li>
                  <li>Process and manage incident reports</li>
                  <li>Communicate with you about your account and reports</li>
                  <li>Ensure platform security and prevent fraud</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-emerald-600" />
                  3. Data Security
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We implement industry-standard security measures to protect your personal information. 
                  All data is encrypted in transit and at rest. Access to personal data is restricted 
                  to authorized personnel only.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Sharing</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We do not sell your personal information. We may share data with:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Law enforcement and emergency services when required for incident response</li>
                  <li>Authorized personnel within the SafeZone platform</li>
                  <li>Service providers who assist in platform operations (under strict confidentiality agreements)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Access and review your personal information</li>
                  <li>Update or correct your information through your profile</li>
                  <li>Request deletion of your account and associated data</li>
                  <li>Opt-out of non-essential communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed">
                  For privacy-related questions or concerns, please contact us at{' '}
                  <a href="mailto:privacy@safezone.rw" className="text-emerald-600 hover:text-emerald-700">
                    privacy@safezone.rw
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Privacy;

