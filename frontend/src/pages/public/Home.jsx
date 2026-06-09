import React, { useState } from 'react';
import { Shield, AlertCircle, Bell, Users, MapPin, BarChart3, Lock, Smartphone, Zap, Building2, UserCheck, HeartPulse, Globe, CheckCircle, Star, Quote, ArrowRight, Play, Clock, TrendingUp, Award, ChevronLeft, ChevronRight, Mail, Phone, Facebook, Twitter, Linkedin, Instagram, Menu, X } from 'lucide-react';

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const testimonials = [
    {
      name: "Marie Uwera",
      role: "Community Leader, Kigali",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
      text: "SafeZone has transformed how we respond to incidents in our neighborhood. The real-time alerts keep everyone informed and safe.",
      rating: 5
    },
    {
      name: "Jean Baptiste",
      role: "Police Officer, Musanze",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
      text: "This platform bridges the gap between law enforcement and citizens. We can now respond faster and more effectively to incidents.",
      rating: 5
    },
    {
      name: "Grace Mukamana",
      role: "Resident, Rubavu",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      text: "I feel much safer knowing I can report incidents instantly and receive alerts about my area. SafeZone is a game-changer!",
      rating: 5
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">SafeZone</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-slate-700 hover:text-emerald-600 transition">Services</a>
              <a href="#how-it-works" className="text-slate-700 hover:text-emerald-600 transition">How It Works</a>
              <a href="#features" className="text-slate-700 hover:text-emerald-600 transition">Features</a>
              <a href="#testimonials" className="text-slate-700 hover:text-emerald-600 transition">Testimonials</a>
              <a href="/login" className="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition">Login</a>
              <a href="/register" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/30">Get Started</a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200">
              <div className="flex flex-col gap-4">
                <a href="#services" className="text-slate-700 hover:text-emerald-600 transition py-2" onClick={() => setMobileMenuOpen(false)}>Services</a>
                <a href="#how-it-works" className="text-slate-700 hover:text-emerald-600 transition py-2" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
                <a href="#features" className="text-slate-700 hover:text-emerald-600 transition py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
                <a href="#testimonials" className="text-slate-700 hover:text-emerald-600 transition py-2" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
                <div className="flex gap-4 pt-4 border-t border-slate-200">
                  <a href="/login" className="flex-1 px-4 py-2 text-center text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition">Login</a>
                  <a href="/register" className="flex-1 px-4 py-2 text-center bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">Get Started</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-slate-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4" />
                Rwanda's Most Trusted Safety Platform
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Protecting Communities
                <span className="block bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">Together, Safer</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Connect with your neighbors, report incidents instantly, and receive real-time safety alerts. 
                SafeZone empowers every Rwandan to contribute to a safer nation.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="/register" className="px-8 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-xl shadow-emerald-600/30 font-semibold inline-flex items-center gap-2">
                  Start Protecting Your Area
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a href="#how-it-works" className="px-8 py-4 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition border-2 border-slate-200 font-semibold inline-flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  See How It Works
                </a>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-slate-900">15K+</div>
                  <div className="text-sm text-slate-600">Active Users</div>
                </div>
                <div className="w-px h-12 bg-slate-200"></div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">98%</div>
                  <div className="text-sm text-slate-600">Response Rate</div>
                </div>
                <div className="w-px h-12 bg-slate-200"></div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">24/7</div>
                  <div className="text-sm text-slate-600">Monitoring</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-3xl blur-3xl opacity-20"></div>
              <img 
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop" 
                alt="Community Safety Team" 
                className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Avg Response Time</div>
                    <div className="text-2xl font-bold text-slate-900">{"<"}90 sec</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <div className="text-sm font-bold text-slate-900">5,420 Reports Today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">15,000+</div>
              <div className="text-emerald-100">Registered Citizens</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">8,500+</div>
              <div className="text-emerald-100">Incidents Resolved</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">250+</div>
              <div className="text-emerald-100">Active Police Officers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">30</div>
              <div className="text-emerald-100">Districts Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
              Simple & Effective
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How SafeZone Works</h2>
            <p className="text-xl text-slate-600">Four simple steps to a safer community</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 md:order-1">
              <img 
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop" 
                alt="Register Account" 
                className="rounded-3xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">1</div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Create Your Account</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">Sign up in under 2 minutes with your phone number or email. Verify your identity and set your location preferences to receive relevant alerts.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">2</div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Report Incidents Instantly</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">Spot something suspicious? Tap the report button, add details, photos, or location. Your report reaches authorities within seconds, ensuring rapid response.</p>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop" 
                alt="Report Incidents" 
                className="rounded-3xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 md:order-1">
              <img 
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop" 
                alt="Real-time Alerts" 
                className="rounded-3xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">3</div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Receive Real-Time Alerts</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">Get instant notifications about incidents, emergencies, and safety updates in your area. Stay informed and take precautionary measures when needed.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">4</div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Build a Safer Community</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">Connect with neighbors, collaborate with local authorities, and contribute to making your community safer. Together, we create a secure environment for everyone.</p>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop" 
                alt="Community Building" 
                className="rounded-3xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Comprehensive Safety Solutions</h2>
            <p className="text-xl text-slate-600">Everything you need to keep your community secure</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group p-8 bg-white rounded-2xl border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <AlertCircle className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Incident Reporting</h3>
              <p className="text-slate-600 leading-relaxed">Report emergencies, crimes, or suspicious activities with one tap. Include photos, videos, and location for faster response.</p>
            </div>
            
            <div className="group p-8 bg-white rounded-2xl border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Bell className="w-7 h-7 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Safety Alerts</h3>
              <p className="text-slate-600 leading-relaxed">Receive location-based alerts about incidents near you. Get notified about weather warnings, road closures, and security threats.</p>
            </div>
            
            <div className="group p-8 bg-white rounded-2xl border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <HeartPulse className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Emergency SOS</h3>
              <p className="text-slate-600 leading-relaxed">Quick access to police, fire, medical, and rescue services. One-button SOS sends your location to emergency responders.</p>
            </div>
            
            <div className="group p-8 bg-white rounded-2xl border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Users className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Community Connect</h3>
              <p className="text-slate-600 leading-relaxed">Join local safety groups, participate in neighborhood watch programs, and collaborate with community leaders.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose SafeZone */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=500&fit=crop" 
                alt="Why SafeZone" 
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-slate-900">Why Choose SafeZone?</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                SafeZone isn't just another app—it's a movement to transform community safety across Rwanda.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Built for Rwanda</h4>
                    <p className="text-slate-600">Designed specifically for Rwanda's administrative structure, supporting all provinces, districts, sectors, and cells.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Lightning Fast Response</h4>
                    <p className="text-slate-600">Our advanced routing system ensures reports reach the nearest authorities in under 90 seconds.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Complete Privacy Protection</h4>
                    <p className="text-slate-600">Your data is encrypted end-to-end. Report anonymously when needed while maintaining full accountability.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Government Endorsed</h4>
                    <p className="text-slate-600">Officially recognized and supported by local authorities for reliable, coordinated safety efforts.</p>
                  </div>
                </div>
              </div>

              <a href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/30 font-semibold">
                Join SafeZone Today
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-slate-600">Advanced technology for community safety</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all">
              <MapPin className="w-10 h-10 text-emerald-600 mb-4" />
              <h4 className="text-lg font-bold text-slate-900 mb-2">GPS Location Tracking</h4>
              <p className="text-slate-600">Automatic location detection ensures accurate incident reporting and faster emergency response coordination.</p>
            </div>
            
            <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all">
              <BarChart3 className="w-10 h-10 text-emerald-600 mb-4" />
              <h4 className="text-lg font-bold text-slate-900 mb-2">Crime Analytics Dashboard</h4>
              <p className="text-slate-600">View crime trends, hotspots, and safety statistics for your area with interactive maps and charts.</p>
            </div>
            
            <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all">
              <Bell className="w-10 h-10 text-emerald-600 mb-4" />
              <h4 className="text-lg font-bold text-slate-900 mb-2">Multi-Channel Notifications</h4>
              <p className="text-slate-600">Receive alerts via SMS, push notifications, and email. Never miss critical safety information.</p>
            </div>
            
            <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all">
              <Lock className="w-10 h-10 text-emerald-600 mb-4" />
              <h4 className="text-lg font-bold text-slate-900 mb-2">Secure Data Encryption</h4>
              <p className="text-slate-600">Military-grade encryption protects your personal information and sensitive reports from unauthorized access.</p>
            </div>
            
            <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all">
              <Smartphone className="w-10 h-10 text-emerald-600 mb-4" />
              <h4 className="text-lg font-bold text-slate-900 mb-2">Offline Mode Support</h4>
              <p className="text-slate-600">Report incidents even without internet. Data syncs automatically when connection is restored.</p>
            </div>
            
            <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all">
              <Award className="w-10 h-10 text-emerald-600 mb-4" />
              <h4 className="text-lg font-bold text-slate-900 mb-2">Community Recognition</h4>
              <p className="text-slate-600">Earn badges and recognition for active participation in making your community safer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
              Trusted by Thousands
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-slate-600">Real stories from real people making a difference</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-emerald-50 to-white p-8 lg:p-12 rounded-3xl shadow-xl relative">
              <Quote className="absolute top-8 left-8 w-12 h-12 text-emerald-200" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-6 mb-6">
                  <img 
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">{testimonials[currentTestimonial].name}</h4>
                    <p className="text-slate-600">{testimonials[currentTestimonial].role}</p>
                    <div className="flex gap-1 mt-2">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                
                <p className="text-lg text-slate-700 leading-relaxed italic">
                  "{testimonials[currentTestimonial].text}"
                </p>
              </div>

              <div className="flex justify-center gap-4 mt-8">
                <button 
                  onClick={prevTestimonial}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-emerald-50 transition shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6 text-slate-700" />
                </button>
                <button 
                  onClick={nextTestimonial}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-emerald-50 transition shadow-lg"
                >
                  <ChevronRight className="w-6 h-6 text-slate-700" />
                </button>
              </div>

              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentTestimonial ? 'bg-emerald-600 w-8' : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Trusted Partners</h2>
            <p className="text-xl text-slate-600">Working together for a safer Rwanda</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-3">Government Agencies</h4>
              <p className="text-slate-600">Working with local and national government for policy support and coordination.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-3">Law Enforcement</h4>
              <p className="text-slate-600">Partnership with Rwanda National Police for rapid response and investigation.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartPulse className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-3">Emergency Services</h4>
              <p className="text-slate-600">Integration with medical, fire, and rescue services for complete emergency coverage.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-3">Community Organizations</h4>
              <p className="text-slate-600">Collaboration with NGOs and community groups for grassroots safety initiatives.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-emerald-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Make Your Community Safer?</h2>
          <p className="text-xl text-emerald-100 mb-10 leading-relaxed">
            Join thousands of citizens, police officers, and community leaders 
            using SafeZone to create safer communities across Rwanda.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/register" className="px-8 py-4 bg-white text-emerald-600 rounded-xl hover:bg-emerald-50 transition shadow-xl font-semibold inline-flex items-center gap-2">
              Sign Up Now — It's Free
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="/contact" className="px-8 py-4 bg-transparent text-white rounded-xl hover:bg-white/10 transition border-2 border-white font-semibold inline-flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contact Sales
            </a>
          </div>
          <p className="text-emerald-200 mt-6 text-sm">No credit card required • Free forever for citizens</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Shield className="w-8 h-8 text-emerald-400" />
                <span className="text-2xl font-bold text-white">SafeZone</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Empowering communities across Rwanda with real-time safety solutions. Together, we build a safer nation.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="/" className="hover:text-emerald-400 transition">Home</a></li>
                <li><a href="/about" className="hover:text-emerald-400 transition">About Us</a></li>
                <li><a href="#features" className="hover:text-emerald-400 transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-emerald-400 transition">How It Works</a></li>
                <li><a href="/contact" className="hover:text-emerald-400 transition">Contact</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Services</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-emerald-400 transition">Incident Reporting</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Safety Alerts</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Emergency SOS</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Community Watch</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Analytics</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <span>Kigali, Rwanda</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-400" />
                  <span>+250 788 000 000</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-emerald-400" />
                  <span>support@safezone.rw</span>
                </li>
              </ul>
              <div className="mt-6">
                <h5 className="font-semibold text-white mb-2">Emergency Hotline</h5>
                <p className="text-2xl font-bold text-emerald-400">112</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 text-sm">
                © {new Date().getFullYear()} SafeZone. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <a href="/privacy" className="hover:text-emerald-400 transition">Privacy Policy</a>
                <a href="/terms" className="hover:text-emerald-400 transition">Terms of Service</a>
                <a href="/contact" className="hover:text-emerald-400 transition">Get Support</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
