import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/layout/Layout';
import PublicLayout from '../../components/layout/PublicLayout';
import { FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const Terms = () => {
  const { isAuthenticated } = useAuth();
  const MainLayout = isAuthenticated ? Layout : PublicLayout;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-emerald-600" />
              <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
            </div>
            
            <p className="text-gray-600 mb-8">Last updated: December 2024</p>

            <div className="prose prose-gray max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using SafeZone, you accept and agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  2. User Responsibilities
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">As a SafeZone user, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Provide accurate and truthful information when creating reports</li>
                  <li>Use the platform only for legitimate safety and security purposes</li>
                  <li>Respect the privacy and rights of other users</li>
                  <li>Not submit false, misleading, or malicious reports</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <XCircle className="w-6 h-6 text-red-600" />
                  3. Prohibited Activities
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">You must not:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Submit false or fraudulent incident reports</li>
                  <li>Harass, threaten, or harm other users</li>
                  <li>Attempt to gain unauthorized access to the platform</li>
                  <li>Use the platform for any illegal activities</li>
                  <li>Interfere with or disrupt platform operations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                  4. Report Accuracy
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Users are responsible for the accuracy of information submitted in reports. 
                  False or misleading reports may result in account suspension or legal action. 
                  All reports are subject to verification by authorized personnel.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Service Availability</h2>
                <p className="text-gray-700 leading-relaxed">
                  SafeZone strives to maintain platform availability but does not guarantee uninterrupted service. 
                  We reserve the right to modify, suspend, or discontinue any part of the service at any time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  SafeZone is provided "as is" without warranties. We are not liable for any damages arising from 
                  use of the platform, including but not limited to incident response times or outcomes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Account Termination</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to suspend or terminate accounts that violate these terms or engage in 
                  prohibited activities. Users may also request account deletion at any time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update these Terms of Service from time to time. Continued use of the platform 
                  after changes constitutes acceptance of the updated terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact</h2>
                <p className="text-gray-700 leading-relaxed">
                  For questions about these terms, contact us at{' '}
                  <a href="mailto:legal@safezone.rw" className="text-emerald-600 hover:text-emerald-700">
                    legal@safezone.rw
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

export default Terms;

