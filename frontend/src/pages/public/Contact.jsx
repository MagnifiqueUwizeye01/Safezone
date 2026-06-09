import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/layout/Layout';
import PublicLayout from '../../components/layout/PublicLayout';
import Input from '../../components/common/Input';
import TextArea from '../../components/common/TextArea';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { validateForm } from '../../utils/validation';
import { HelpCircle, Book, MessageCircle, Phone, Mail, ChevronDown, ChevronRight, Search, MapPin } from 'lucide-react';

const Contact = () => {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategory, setOpenCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('contact'); // 'contact' or 'faq'

  const faqCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Book,
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click on "Get Started" or "Register" from the homepage. Fill in your details including your location (Province, District, Sector, Cell, Village), and submit the form. You\'ll receive a confirmation email once your account is created.'
        },
        {
          q: 'How do I report an incident?',
          a: 'Navigate to "Report Incident" from your dashboard or sidebar. Fill in the report form with details about the incident, select the type (Theft, Violence, Harassment, etc.), choose your location, and submit. Your report will be reviewed by authorities.'
        },
        {
          q: 'How do I receive safety alerts?',
          a: 'Safety alerts are automatically sent to users in the affected area based on your registered location. Make sure your location information is accurate in your profile to receive relevant alerts.'
        }
      ]
    },
    {
      id: 'reports',
      title: 'Reports & Incidents',
      icon: MessageCircle,
      questions: [
        {
          q: 'What types of incidents can I report?',
          a: 'You can report: Theft, Violence, Harassment, Vandalism, Lost Items, Suspicious Activity, Emergencies, and Other incidents. Select the most appropriate category when creating your report.'
        },
        {
          q: 'How do I track my report status?',
          a: 'Go to "My Reports" from your dashboard to see all your submitted reports. Each report shows its current status: Pending, In Progress, Resolved, or Cancelled.'
        },
        {
          q: 'Can I edit or delete my report?',
          a: 'You can view your reports and their details, but editing or deleting may be restricted once a report is under review. Contact support if you need to make changes to a submitted report.'
        },
        {
          q: 'How long does it take for a report to be reviewed?',
          a: 'Response times vary depending on the urgency and type of incident. Emergency reports are prioritized and typically receive faster responses. You\'ll receive notifications when your report status changes.'
        }
      ]
    },
    {
      id: 'alerts',
      title: 'Safety Alerts',
      icon: HelpCircle,
      questions: [
        {
          q: 'What are safety alerts?',
          a: 'Safety alerts are notifications sent by police and authorities to inform citizens about incidents, warnings, emergencies, or important community updates in their area.'
        },
        {
          q: 'How do I receive alerts?',
          a: 'Alerts are automatically sent to users based on their registered location. Ensure your location is correctly set in your profile. You can view all alerts in the "Safety Alerts" section.'
        },
        {
          q: 'Can I customize alert preferences?',
          a: 'Currently, alerts are sent based on your location. You can manage notification preferences in your profile settings to control how you receive alerts (email, in-app notifications).'
        }
      ]
    },
    {
      id: 'account',
      title: 'Account & Profile',
      icon: HelpCircle,
      questions: [
        {
          q: 'How do I update my profile?',
          a: 'Go to "Profile" from your dashboard sidebar. You can update your personal information, location, contact details, and notification preferences.'
        },
        {
          q: 'How do I change my password?',
          a: 'Go to your Profile page and look for the "Change Password" option. You\'ll need to enter your current password and set a new one.'
        },
        {
          q: 'What if I forgot my password?',
          a: 'Click "Forgot Password" on the login page. Enter your email address and you\'ll receive instructions to reset your password.'
        },
        {
          q: 'Can I change my location?',
          a: 'Yes, you can update your location in your Profile settings. This will affect which alerts you receive, so make sure it\'s accurate.'
        }
      ]
    },
    {
      id: 'emergency',
      title: 'Emergency Contacts',
      icon: Phone,
      questions: [
        {
          q: 'How do I access emergency contacts?',
          a: 'Go to "Emergency Contacts" from your dashboard. You\'ll see a list of emergency services (Police, Fire, Medical, etc.) for your location.'
        },
        {
          q: 'Are emergency contacts location-specific?',
          a: 'Yes, emergency contacts are filtered by your registered location to show the most relevant services for your area.'
        },
        {
          q: 'What should I do in an emergency?',
          a: 'For immediate emergencies, call the emergency services directly using the numbers provided. You can also create an Emergency report through the platform for non-urgent situations.'
        }
      ]
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(qa => 
      qa.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qa.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const toggleCategory = (categoryId) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const rules = {
      name: {
        required: true,
        minLength: 2,
      },
      email: {
        required: true,
        email: true,
      },
      subject: {
        required: true,
        minLength: 3,
      },
      message: {
        required: true,
        minLength: 10,
      },
    };

    const validation = validateForm(formData, rules);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    }, 1000);
  };

  const MainLayout = isAuthenticated ? Layout : PublicLayout;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Get Support</h1>
            <p className="text-lg text-gray-600">
              Find answers to common questions or contact our support team
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-8 border-b border-gray-200">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('faq')}
                className={`pb-4 px-2 font-medium transition-colors duration-200 ${
                  activeTab === 'faq'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Frequently Asked Questions
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`pb-4 px-2 font-medium transition-colors duration-200 ${
                  activeTab === 'contact'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Contact Us
              </button>
            </div>
          </div>

          {/* FAQ Tab Content */}
          {activeTab === 'faq' && (
            <div className="space-y-8">
              {/* Search Bar */}
              <div>
                <div className="relative max-w-2xl">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for help articles..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/about"
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:border-emerald-300 hover:shadow-md transition-all duration-200"
                >
                  <Book className="w-8 h-8 text-emerald-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">About SafeZone</h3>
                  <p className="text-sm text-gray-600">Learn more about our platform</p>
                </Link>
                <Link
                  to="/features"
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:border-emerald-300 hover:shadow-md transition-all duration-200"
                >
                  <HelpCircle className="w-8 h-8 text-emerald-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Features Guide</h3>
                  <p className="text-sm text-gray-600">Explore platform features</p>
                </Link>
                <div
                  onClick={() => setActiveTab('contact')}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:border-emerald-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <MessageCircle className="w-8 h-8 text-emerald-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
                  <p className="text-sm text-gray-600">Get in touch with our support team</p>
                </div>
              </div>

              {/* FAQ Sections */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                
                {filteredFAQs.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                    <p className="text-gray-600">No results found for "{searchQuery}"</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  filteredFAQs.map((category) => {
                    const Icon = category.icon;
                    const isOpen = openCategory === category.id;
                    
                    return (
                      <div key={category.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="flex items-center gap-4">
                            <Icon className="w-6 h-6 text-emerald-600" />
                            <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                            <span className="text-sm text-gray-500">({category.questions.length} questions)</span>
                          </div>
                          {isOpen ? (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                        
                        {isOpen && (
                          <div className="border-t border-gray-200">
                            {category.questions.map((qa, index) => (
                              <div
                                key={index}
                                className={`p-6 ${index !== category.questions.length - 1 ? 'border-b border-gray-100' : ''}`}
                              >
                                <h4 className="font-semibold text-gray-900 mb-2">{qa.q}</h4>
                                <p className="text-gray-600 leading-relaxed">{qa.a}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Contact Tab Content */}
          {activeTab === 'contact' && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                  <p className="text-gray-600">
                    Have questions, suggestions, or need support? We're here to help!
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                      <a href="mailto:support@safezone.rw" className="text-emerald-600 hover:text-emerald-700">
                        support@safezone.rw
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                      <a href="tel:+250788123456" className="text-emerald-600 hover:text-emerald-700">
                        +250 788 123 456
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                      <p className="text-gray-600">Kigali, Rwanda</p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Emergency Hotline</h3>
                  <p className="text-3xl font-bold text-emerald-600">112</p>
                  <p className="text-sm text-gray-600 mt-2">Available 24/7 for emergencies</p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                {success && (
                  <Alert type="success" message="Thank you! Your message has been sent successfully." />
                )}
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                  />
                  <Input
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    error={errors.subject}
                    required
                  />
                  <TextArea
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    error={errors.message}
                    required
                    rows={6}
                  />
                  <Button type="submit" variant="primary" size="lg" loading={loading}>
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;


