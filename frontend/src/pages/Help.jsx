import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchInput from '../components/SearchInput';
import Footer from '../components/Footer';

const Help = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const location = useLocation();

  useEffect(() => {
    if (location && location.state && location.state.activeSection) {
      setActiveSection(location.state.activeSection);
    }
  }, [location]);

  const faqs = [
    {
      id: 1,
      category: 'events',
      question: "How do I register for an event?",
      answer: "To register for an event, navigate to the Events page, find your desired event, and click on it to view details. On the event details page, you'll find a 'Register Now' button. Click it, fill out the registration form with your details, and submit. You'll receive a confirmation email once registered."
    },
    {
      id: 2,
      category: 'events',
      question: "Can I cancel my event registration?",
      answer: "Yes, you can cancel your registration up to 24 hours before the event starts. Go to your Profile page, find the event under 'My Registrations', and click 'Cancel Registration'. Some events may have specific cancellation policies, which will be mentioned in the event details."
    },
    {
      id: 3,
      category: 'events',
      question: "How do I create a new event?",
      answer: "To create a new event, go to the Events page and click the 'Add Event' button (available to authorized users). Fill out all required information including title, description, date, time, location, and other details. Your event will be reviewed by our team before being published on the platform."
    },
    {
      id: 4,
      category: 'clubs',
      question: "How can I join a club or society?",
      answer: "Visit the Clubs & Societies page, browse through available clubs, and click on the one you're interested in. On the club details page, you'll find a 'Join Club' button. Some clubs may have specific requirements or an application process, which will be detailed on their page."
    },
    {
      id: 5,
      category: 'clubs',
      question: "Can I create a new club?",
      answer: "Yes! If you want to start a new club, you can submit a proposal through our system. Go to the Clubs & Societies page and click 'Propose New Club'. You'll need to provide details about the club's purpose, activities, and have at least 10 founding members. The proposal will be reviewed by the Student Affairs office."
    },
    {
      id: 6,
      category: 'career',
      question: "How do I access career opportunities?",
      answer: "Visit the Career page to find industry visits, career weeks, job fairs, and internship opportunities. You can filter by type, company, or date. Click on any opportunity to view details and registration information. Some events may require you to upload your CV or meet specific eligibility criteria."
    },
    {
      id: 7,
      category: 'career',
      question: "What should I bring to career fairs?",
      answer: "For career fairs, bring multiple printed copies of your updated CV, dress professionally, prepare an elevator pitch about yourself, research participating companies beforehand, and bring a notebook to take notes. Some fairs may also require you to pre-register and bring your student ID."
    },
    {
      id: 8,
      category: 'announcements',
      question: "How do I stay updated with announcements?",
      answer: "Check the Announcements page regularly for the latest updates. You can filter announcements by type, faculty, or date. Important announcements are also sent via email to your SLIIT email address. Consider downloading our mobile app for push notifications."
    },
    {
      id: 9,
      category: 'venues',
      question: "How do I book a venue for my event?",
      answer: "Venue booking is handled through the Student Affairs office. You can view available venues on the Venues page to help you choose. Contact the venue coordinator mentioned in the venue details, or visit the Student Affairs office with your event proposal. Booking should be done at least 2 weeks in advance."
    },
    {
      id: 10,
      category: 'technical',
      question: "The website is not loading properly. What should I do?",
      answer: "Try refreshing the page, clearing your browser cache, or using a different browser. If the problem persists, check your internet connection. For continued issues, report it to our technical support at support@eventhub.lk with details about your browser and the specific problem."
    },
    {
      id: 11,
      category: 'general',
      question: "Who can use EventHub?",
      answer: "EventHub is primarily designed for SLIIT students, faculty, and staff. Some events may be open to external participants, which will be clearly mentioned in the event details. You need a valid SLIIT email address to register and participate in most activities."
    },
    {
      id: 12,
      category: 'general',
      question: "Is there a mobile app for EventHub?",
      answer: "Yes! The EventHub mobile app is available on both Google Play Store and Apple App Store. Search for 'SLIIT EventHub' to download. The app provides real-time notifications, event reminders, and easy access to all platform features."
    },
    {
      id: 13,
      category: 'general',
      question: "How do I provide feedback or suggestions?",
      answer: "We welcome your feedback! You can send suggestions to feedback@eventhub.lk, use the contact form on this page, or speak directly with any EventHub team member. You can also participate in our periodic feedback surveys sent via email."
    }
  ];

  const guides = [
    {
      id: 1,
      title: "Getting Started with EventHub",
      description: "Complete guide for new users",
      steps: [
        "Create your profile using your SLIIT email address",
        "Complete your profile with accurate information",
        "Explore the Events page to see upcoming activities",
        "Browse Clubs & Societies to find groups that match your interests",
        "Check Career opportunities for internships and job fairs",
        "Stay updated with Announcements for important news",
        "Download the mobile app for notifications"
      ]
    },
    {
      id: 2,
      title: "Event Registration Process",
      description: "Step-by-step guide to register for events",
      steps: [
        "Navigate to the Events page",
        "Use filters to find events that interest you",
        "Click on an event to view full details",
        "Check eligibility requirements and event capacity",
        "Click 'Register Now' button",
        "Fill out the registration form completely",
        "Submit the form and wait for confirmation email",
        "Add the event to your calendar"
      ]
    },
    {
      id: 3,
      title: "Joining Clubs and Societies",
      description: "How to become a member of student organizations",
      steps: [
        "Visit the Clubs & Societies page",
        "Browse or search for clubs that match your interests",
        "Read about each club's activities and requirements",
        "Click on a club to view detailed information",
        "Check membership requirements and fees (if any)",
        "Click 'Join Club' and complete the application",
        "Attend orientation or introduction events",
        "Participate actively in club activities"
      ]
    },
    {
      id: 4,
      title: "Career Opportunities Guide",
      description: "Making the most of career services",
      steps: [
        "Visit the Career page regularly",
        "Update your CV and keep it ready",
        "Register for career fairs and industry visits",
        "Prepare for networking opportunities",
        "Practice your elevator pitch",
        "Research companies before events",
        "Follow up on connections made",
        "Apply for internships and job opportunities"
      ]
    }
  ];

  const contactMethods = [
    {
      title: "General Support",
      description: "For general questions and platform support",
      methods: [
        { type: "Email", value: "support@eventhub.lk", icon: "📧" },
        { type: "Phone", value: "+94 11 754 4800", icon: "📞" },
        { type: "Office Hours", value: "Mon-Fri: 8:30 AM - 5:00 PM", icon: "🕒" }
      ]
    },
    {
      title: "Technical Issues",
      description: "For website bugs and technical problems",
      methods: [
        { type: "Email", value: "technical@eventhub.lk", icon: "📧" },
        { type: "IT Help Desk", value: "+94 11 754 4850", icon: "📞" },
        { type: "Live Chat", value: "Available on website", icon: "💬" }
      ]
    },
    {
      title: "Event Organizers",
      description: "Support for event creation and management",
      methods: [
        { type: "Email", value: "events@eventhub.lk", icon: "📧" },
        { type: "Events Team", value: "+94 11 754 4820", icon: "📞" },
        { type: "Office", value: "Student Affairs - Room 205", icon: "🏢" }
      ]
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black shadow-lg sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="shrink-0 cursor-pointer" onClick={() => navigate('/')}>
              <h1 className="text-2xl font-bold text-yellow-500">EventHub</h1>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button onClick={() => navigate('/')} className="text-yellow-500 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Home</button>
                <button onClick={() => navigate('/events')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Events</button>
                <button onClick={() => navigate('/clubs-and-societies')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Clubs & Societies</button>
                <button onClick={() => navigate('/career')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Career</button>
                <button onClick={() => navigate('/announcements')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Announcements</button>
                <button onClick={() => navigate('/venues')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Venues</button>
                <button onClick={() => navigate('/about')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">About</button>
                <button className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-yellow-500">Help</button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Help Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-yellow-400 mb-6">Help Center</h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Find answers to your questions, learn how to use EventHub effectively, and get the support you need 
              to make the most of your SLIIT experience.
            </p>
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-yellow-500 to-blue-600 mx-auto"></div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-12 border-b border-gray-700">
          {[
            { id: 'faq', label: 'FAQs', icon: '❓' },
            { id: 'guides', label: 'User Guides', icon: '📖' },
            { id: 'contact', label: 'Contact Support', icon: '🆘' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-6 py-3 mx-2 mb-4 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                activeSection === tab.id
                  ? 'bg-yellow-500 text-black'
                  : 'text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* FAQ Section */}
        {activeSection === 'faq' && (
          <div className="space-y-8">
            {/* Search and Filter */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Search FAQs</label>
                  <div className="relative">
                      <SearchInput
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search questions and answers..."
                      />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Filter by Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="events">Events</option>
                    <option value="clubs">Clubs & Societies</option>
                    <option value="career">Career</option>
                    <option value="announcements">Announcements</option>
                    <option value="venues">Venues</option>
                    <option value="technical">Technical</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-medium text-gray-400 mb-2">No FAQs found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                filteredFaqs.map((faq) => (
                  <div key={faq.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 overflow-hidden">
                    <details className="group">
                      <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                            Q
                          </div>
                          <h3 className="text-lg font-medium text-white group-open:text-yellow-400 transition-colors">
                            {faq.question}
                          </h3>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-6 pb-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            A
                          </div>
                          <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    </details>
                  </div>
                ))
              )}
            </div>

            <div className="text-center text-gray-400 text-sm">
              Showing {filteredFaqs.length} of {faqs.length} frequently asked questions
            </div>
          </div>
        )}

        {/* Guides Section */}
        {activeSection === 'guides' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-yellow-400 mb-4">User Guides</h2>
              <p className="text-xl text-gray-300">Step-by-step instructions to help you navigate EventHub</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {guides.map((guide) => (
                <div key={guide.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-yellow-400 mb-3">{guide.title}</h3>
                    <p className="text-gray-300">{guide.description}</p>
                  </div>
                  
                  <div className="space-y-4">
                    {guide.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-sm">
                          {index + 1}
                        </div>
                        <p className="text-gray-300 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Section */}
        {activeSection === 'contact' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-yellow-400 mb-4">Contact Support</h2>
              <p className="text-xl text-gray-300">Get in touch with our support team for personalized assistance</p>
            </div>

            {/* Contact Methods */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {contactMethods.map((method, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300">
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">{method.title}</h3>
                  <p className="text-gray-300 mb-4">{method.description}</p>
                  
                  <div className="space-y-3">
                    {method.methods.map((contact, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-xl">{contact.icon}</span>
                        <div>
                          <p className="text-sm text-gray-400">{contact.type}</p>
                          <p className="text-white font-medium">{contact.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">Send us a Message</h3>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="your.email@sliit.lk"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Category</label>
                    <select className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
                      <option value="general">General Support</option>
                      <option value="technical">Technical Issue</option>
                      <option value="events">Event Related</option>
                      <option value="clubs">Clubs & Societies</option>
                      <option value="career">Career Services</option>
                      <option value="feedback">Feedback/Suggestion</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Priority</label>
                    <select className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Subject *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Brief description of your issue or question"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Message *</label>
                  <textarea
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Please provide detailed information about your issue, including any error messages or steps you've already tried..."
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>

            {/* Response Time Info */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">ℹ️</div>
                <div>
                  <h4 className="text-lg font-bold text-blue-400 mb-2">Response Times</h4>
                  <ul className="text-gray-300 space-y-1">
                    <li>• <strong>Urgent issues:</strong> Within 2-4 hours during business hours</li>
                    <li>• <strong>High priority:</strong> Within 24 hours</li>
                    <li>• <strong>Medium/Low priority:</strong> Within 2-3 business days</li>
                    <li>• <strong>General inquiries:</strong> Within 5 business days</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Resources */}
        <div className="mt-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-yellow-400 mb-6 text-center">Additional Resources</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <a href="#" className="text-center p-4 rounded-lg hover:bg-gray-800/50 transition-colors">
              <div className="text-3xl mb-2">📱</div>
              <h4 className="text-white font-medium mb-1">Mobile App</h4>
              <p className="text-gray-400 text-sm">Download for iOS & Android</p>
            </a>
            <a href="#" className="text-center p-4 rounded-lg hover:bg-gray-800/50 transition-colors">
              <div className="text-3xl mb-2">📹</div>
              <h4 className="text-white font-medium mb-1">Video Tutorials</h4>
              <p className="text-gray-400 text-sm">Step-by-step walkthroughs</p>
            </a>
            <a href="#" className="text-center p-4 rounded-lg hover:bg-gray-800/50 transition-colors">
              <div className="text-3xl mb-2">💬</div>
              <h4 className="text-white font-medium mb-1">Community Forum</h4>
              <p className="text-gray-400 text-sm">Connect with other users</p>
            </a>
            <a href="#" className="text-center p-4 rounded-lg hover:bg-gray-800/50 transition-colors">
              <div className="text-3xl mb-2">📚</div>
              <h4 className="text-white font-medium mb-1">Knowledge Base</h4>
              <p className="text-gray-400 text-sm">Detailed articles & guides</p>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Help;