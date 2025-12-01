import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const CareerEventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'registration' | 'photos'
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const [registrationData, setRegistrationData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    studentId: '',
    faculty: '',
    year: '',
    gpa: '',
    resume: null,
    coverLetter: '',
    motivation: '',
    skills: '',
    experience: '',
    expectations: ''
  });

  // Career events data (same as in Career.jsx)
  const careerEventsData = {
    1: {
      id: 1,
      title: "Google Sri Lanka Industry Visit",
      description: "Exclusive visit to Google's Colombo office to explore career opportunities in tech and learn about cutting-edge projects.",
      fullDescription: "Join us for an exclusive behind-the-scenes tour of Google Sri Lanka's state-of-the-art Colombo office. This industry visit offers students a unique opportunity to interact with Google engineers, product managers, and HR professionals. Learn about Google's innovative projects, company culture, and exciting career paths in technology. The visit includes office tours, technical presentations, networking sessions, and Q&A with Google employees.",
      date: "2024-12-28",
      endDate: "2024-12-28",
      time: "9:00 AM - 4:00 PM",
      location: "Google Sri Lanka, Colombo 03",
      faculty: "Faculty of Computing",
      image: "/images/google-visit.jpg",
      category: "Industry Visit",
      organizer: "Career Services",
      participants: 45,
      maxParticipants: 50,
      price: "Free",
      featured: true,
      requiresRegistration: true,
      company: "Google Sri Lanka",
      industry: "Technology",
      jobOpportunities: "Software Engineer, Product Manager, Data Scientist, UX Designer",
      internshipOpportunities: "Available for final year students",
      skillsRequired: "Programming, Problem Solving, Communication",
      dresscode: "Business Casual",
      tags: ["Tech Giants", "Software Engineering", "Innovation"],
      requirements: [
        "Must be a 2nd year student or above",
        "Good academic standing",
        "Submit resume and cover letter"
      ],
      agenda: [
        { time: "9:00 AM", activity: "Registration and Welcome" },
        { time: "9:30 AM", activity: "Company Overview Presentation" },
        { time: "10:30 AM", activity: "Office Tour" },
        { time: "12:00 PM", activity: "Lunch with Google Engineers" },
        { time: "1:30 PM", activity: "Technical Sessions" },
        { time: "3:00 PM", activity: "Career Opportunities Panel" },
        { time: "3:45 PM", activity: "Q&A and Networking" }
      ],
      speakers: [
        { name: "Kasun Perera", role: "Senior Software Engineer", topic: "Building Scalable Systems at Google" },
        { name: "Priya Fernando", role: "Product Manager", topic: "Product Development Lifecycle" },
        { name: "Rajith Silva", role: "HR Business Partner", topic: "Career Growth at Google" }
      ],
      contact: {
        email: "career@sliit.lk",
        phone: "+94 11 754 4801",
        coordinator: "Ms. Sandhya Wickramasinghe"
      }
    },
    2: {
      id: 2,
      title: "Banking & Finance Career Week 2024",
      description: "Week-long career exploration program featuring leading banks and financial institutions in Sri Lanka.",
      fullDescription: "The Banking & Finance Career Week is a comprehensive program designed to connect business students with top financial institutions in Sri Lanka. This week-long event features company presentations, mock interviews, CV workshops, networking sessions, and on-the-spot job interviews. Participating organizations include Commercial Bank, Sampath Bank, DFCC Bank, and leading financial services companies.",
      date: "2025-01-15",
      endDate: "2025-01-19",
      time: "9:00 AM - 5:00 PM",
      location: "SLIIT Business School Auditorium",
      faculty: "SLIIT Business School",
      image: "/images/banking-career-week.jpg",
      category: "Career Week",
      organizer: "Business School Career Center",
      participants: 156,
      maxParticipants: 200,
      price: "Free",
      featured: true,
      requiresRegistration: true,
      company: "Multiple Financial Institutions",
      industry: "Banking & Finance",
      jobOpportunities: "Management Trainee, Credit Analyst, Investment Advisor, Risk Manager",
      internshipOpportunities: "Summer internships available",
      skillsRequired: "Financial Analysis, Communication, Leadership",
      dresscode: "Formal Business Attire",
      tags: ["Banking", "Finance", "Career Fair", "Job Opportunities"],
      requirements: [
        "Business/Finance students preferred",
        "Minimum GPA of 3.0",
        "Professional resume required",
        "Register by January 10th"
      ],
      agenda: [
        { time: "Day 1", activity: "Banking Industry Overview & Company Presentations" },
        { time: "Day 2", activity: "CV Writing & Interview Skills Workshop" },
        { time: "Day 3", activity: "Mock Interviews & Assessment Centers" },
        { time: "Day 4", activity: "Networking Sessions & Job Fair" },
        { time: "Day 5", activity: "Final Interviews & Closing Ceremony" }
      ],
      speakers: [
        { name: "Arjuna Herath", role: "CEO", topic: "Future of Banking in Sri Lanka" },
        { name: "Dilini Rajapakse", role: "Head of HR", topic: "Building a Career in Finance" },
        { name: "Chaminda Silva", role: "Senior Manager", topic: "Digital Banking Transformation" }
      ],
      contact: {
        email: "business.career@sliit.lk",
        phone: "+94 11 754 4802",
        coordinator: "Mr. Rohan Jayawardena"
      }
    },
    3: {
      id: 3,
      title: "Microsoft Azure Cloud Career Day",
      description: "Specialized career event focusing on cloud computing opportunities and Azure certifications.",
      fullDescription: "Dive deep into the world of cloud computing with Microsoft's Azure platform. This specialized career day features hands-on workshops, certification guidance, and direct interaction with Microsoft Azure professionals. Learn about cloud architecture, DevOps, data engineering, and AI/ML opportunities in the cloud space. Perfect for students interested in cloud technology careers.",
      date: "2025-01-25",
      endDate: "2025-01-25",
      time: "8:30 AM - 6:00 PM",
      location: "SLIIT IT Complex - Cloud Lab",
      faculty: "Faculty of Computing",
      image: "/images/azure-career-day.jpg",
      category: "Industry Visit",
      organizer: "Microsoft Student Partners",
      participants: 32,
      maxParticipants: 40,
      price: "Free",
      featured: false,
      requiresRegistration: true,
      company: "Microsoft",
      industry: "Cloud Computing",
      jobOpportunities: "Cloud Solutions Architect, DevOps Engineer, Data Engineer, AI Specialist",
      internshipOpportunities: "Microsoft internship programs available",
      skillsRequired: "Cloud Fundamentals, Programming, System Administration",
      dresscode: "Smart Casual",
      tags: ["Cloud Computing", "Azure", "Microsoft", "Certification"],
      requirements: [
        "Basic understanding of cloud concepts",
        "Programming experience preferred",
        "Laptop required for workshops"
      ],
      agenda: [
        { time: "8:30 AM", activity: "Registration & Azure Fundamentals Overview" },
        { time: "10:00 AM", activity: "Hands-on Azure Workshop" },
        { time: "12:00 PM", activity: "Lunch & Networking" },
        { time: "1:30 PM", activity: "Azure Career Paths Presentation" },
        { time: "3:00 PM", activity: "Certification Guidance Session" },
        { time: "4:30 PM", activity: "Mock Technical Interview" },
        { time: "5:30 PM", activity: "Closing & Certificate Distribution" }
      ],
      speakers: [
        { name: "Tharindu Wickramasinghe", role: "Cloud Solutions Architect", topic: "Building Career in Cloud" },
        { name: "Nelum Rathnayake", role: "Senior DevOps Engineer", topic: "DevOps with Azure" }
      ],
      contact: {
        email: "msp@sliit.lk",
        phone: "+94 11 754 4803",
        coordinator: "Mr. Chamara Perera"
      }
    }
  };

  // Helper function to safely parse speakers data
  const parseSpeakers = (speakersData) => {
    if (!speakersData) return [];
    if (Array.isArray(speakersData)) return speakersData;
    
    try {
      const parsed = JSON.parse(speakersData);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('Failed to parse speakers data:', error);
      return [];
    }
  };

  useEffect(() => {
    // If the user navigated here by clicking a card, prefer the passed
    // event object in location.state to render the exact item they clicked.
    if (location && location.state && location.state.event) {
      const eventData = location.state.event;
      // Parse speakers data safely
      setEvent({
        ...eventData,
        speakers: parseSpeakers(eventData.speakers)
      });
      setLoading(false);
      return;
    }

    // Otherwise, fall back to the internal sample mapping (existing behavior)
    // Simulate loading
    setTimeout(() => {
      const eventData = careerEventsData[parseInt(id)];
      if (eventData) {
        setEvent({
          ...eventData,
          speakers: parseSpeakers(eventData.speakers)
        });
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleRegistrationChange = (e) => {
    const { name, value, type, files } = e.target;
    setRegistrationData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    console.log('Registration submitted:', registrationData);
    alert('Registration submitted successfully! You will receive a confirmation email shortly.');
    setActiveTab('details');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading career event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Career Event Not Found</h2>
          <p className="text-gray-400 mb-6">The career event you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/career')}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200"
          >
            Back to Career Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black shadow-lg">
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
                <button onClick={() => navigate('/career')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-yellow-500">Career</button>
                <button onClick={() => navigate('/announcements')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Announcements</button>
                <button onClick={() => navigate('/venues')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Venues</button>
                <button onClick={() => navigate('/about')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">About</button>
                <a href="#help" className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Help</a>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-yellow-500 hover:text-yellow-400 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500"
              >
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                <button onClick={() => { navigate('/'); toggleMenu(); }} className="text-gray-700 hover:text-yellow-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Home</button>
                <button onClick={() => { navigate('/events'); toggleMenu(); }} className="text-gray-700 hover:text-yellow-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Events</button>
                <button onClick={() => { navigate('/clubs-and-societies'); toggleMenu(); }} className="text-gray-700 hover:text-yellow-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Clubs & Societies</button>
                <button onClick={() => { navigate('/career'); toggleMenu(); }} className="text-yellow-500 block px-3 py-2 rounded-md text-base font-medium border-l-4 border-yellow-500 bg-blue-50">Career</button>
                <button onClick={() => { navigate('/announcements'); toggleMenu(); }} className="text-gray-700 hover:text-yellow-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Announcements</button>
                <button onClick={() => { navigate('/venues'); toggleMenu(); }} className="text-gray-700 hover:text-yellow-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Venues</button>
                <button onClick={() => { navigate('/about'); toggleMenu(); }} className="text-gray-700 hover:text-yellow-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium w-full text-left">About</button>
                <button onClick={() => { navigate('/help'); toggleMenu(); }} className="text-gray-700 hover:text-yellow-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Help</button>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <button onClick={() => { navigate('/admin/login'); toggleMenu(); }} className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium w-full text-left border border-blue-300">Admin Login</button>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => navigate('/career')}
          className="flex items-center text-yellow-500 hover:text-yellow-400 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Career Events
        </button>
      </div>

      {/* Event Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzRiNTU2MyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzYiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DYXJlZXIgRXZlbnQgSW1hZ2U8L3RleHQ+PC9zdmc+';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        
        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                event.category === 'Industry Visit' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-green-600 text-white'
              }`}>
                {event.category}
              </span>
              {event.featured && (
                <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-full text-sm font-bold">
                  Featured
                </span>
              )}
              <span className="bg-gray-800/80 text-gray-300 px-4 py-2 rounded-full text-sm">
                {event.industry}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">{event.title}</h1>
            <p className="text-xl text-gray-200 max-w-3xl">{event.description}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs (admin-dashboard style) */}
        <div className="mb-6">
          <nav className="border-b border-gray-800">
            <div role="tablist" aria-label="Event sections" className="flex space-x-8">
              <button
                role="tab"
                aria-selected={activeTab === 'details'}
                onClick={() => setActiveTab('details')}
                className={`pb-3 text-sm font-semibold ${activeTab === 'details' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-300 hover:text-gray-200'}`}
              >Details</button>

              <button
                role="tab"
                aria-selected={activeTab === 'registration'}
                onClick={() => setActiveTab('registration')}
                className={`pb-3 text-sm font-semibold ${activeTab === 'registration' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-300 hover:text-gray-200'}`}
              >Registration</button>

              <button
                role="tab"
                aria-selected={activeTab === 'photos'}
                onClick={() => setActiveTab('photos')}
                className={`pb-3 text-sm font-semibold ${activeTab === 'photos' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-300 hover:text-gray-200'}`}
              >Photos</button>
            </div>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Event Details - Left Column */}
          {activeTab === 'details' && (
            <div className="lg:col-span-2 space-y-8">
              {/* Event Information */}
              <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">Event Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Date</p>
                      <p className="text-white font-semibold">
                        {new Date(event.date).toLocaleDateString()}
                        {event.endDate !== event.date && (
                          <span> - {new Date(event.endDate).toLocaleDateString()}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Time</p>
                      <p className="text-white font-semibold">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Location</p>
                      <p className="text-white font-semibold">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Company</p>
                      <p className="text-white font-semibold">{event.company}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Participants</p>
                      <p className="text-white font-semibold">{event.participants}/{event.maxParticipants}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Price</p>
                      <p className="text-green-500 font-semibold">{event.price}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Description */}
              <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">About This Event</h2>
                <p className="text-gray-300 leading-relaxed text-lg">{event.fullDescription}</p>
              </div>

              {/* Career Opportunities */}
              <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">Career Opportunities</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Job Opportunities</h3>
                    <p className="text-gray-300">{event.jobOpportunities}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Internship Opportunities</h3>
                    <p className="text-gray-300">{event.internshipOpportunities}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Skills Required</h3>
                    <p className="text-gray-300">{event.skillsRequired}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Dress Code</h3>
                    <p className="text-gray-300">{event.dresscode}</p>
                  </div>
                </div>
              </div>

              {/* Event Agenda */}
              <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">Event Agenda</h2>
                <div className="space-y-4">
                  {(event.agenda || []).map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-500 text-black rounded-full text-sm font-semibold">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-yellow-400 font-semibold">{item.time}</p>
                        <p className="text-white">{item.activity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Speakers */}
              {event.speakers && Array.isArray(event.speakers) && event.speakers.length > 0 && (
                <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
                  <h2 className="text-2xl font-bold text-yellow-400 mb-6">Featured Speakers</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {event.speakers.map((speaker, index) => (
                      <div key={index} className="bg-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">{speaker.name || 'Speaker Name'}</h3>
                        <p className="text-yellow-400 mb-3">{speaker.role || 'Role'}</p>
                        <p className="text-gray-300 text-sm">{speaker.topic || 'Topic'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">Requirements</h2>
                <ul className="space-y-3">
                  {(event.requirements || []).map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Registration / Photos Inline for tabs */}
          {activeTab === 'registration' && (
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-yellow-400">Event Registration</h2>
                </div>
                <form onSubmit={handleRegistrationSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={registrationData.firstName}
                        onChange={handleRegistrationChange}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={registrationData.lastName}
                        onChange={handleRegistrationChange}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={registrationData.email}
                        onChange={handleRegistrationChange}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={registrationData.phone}
                        onChange={handleRegistrationChange}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Student ID *</label>
                      <input
                        type="text"
                        name="studentId"
                        value={registrationData.studentId}
                        onChange={handleRegistrationChange}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Faculty *</label>
                      <select
                        name="faculty"
                        value={registrationData.faculty}
                        onChange={handleRegistrationChange}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                      >
                        <option value="">Select Faculty</option>
                        <option value="Faculty of Computing">Faculty of Computing</option>
                        <option value="Faculty of Engineering">Faculty of Engineering</option>
                        <option value="SLIIT Business School">SLIIT Business School</option>
                        <option value="Faculty of Humanities & Sciences">Faculty of Humanities & Sciences</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Year of Study *</label>
                      <select
                        name="year"
                        value={registrationData.year}
                        onChange={handleRegistrationChange}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                      >
                        <option value="">Select Year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Final Year">Final Year</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">GPA</label>
                      <input
                        type="text"
                        name="gpa"
                        value={registrationData.gpa}
                        onChange={handleRegistrationChange}
                        placeholder="e.g., 3.75"
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Resume (PDF)</label>
                    <input
                      type="file"
                      name="resume"
                      accept=".pdf"
                      onChange={handleRegistrationChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Why do you want to attend this event?</label>
                    <textarea
                      name="motivation"
                      value={registrationData.motivation}
                      onChange={handleRegistrationChange}
                      rows="3"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Relevant Skills</label>
                    <textarea
                      name="skills"
                      value={registrationData.skills}
                      onChange={handleRegistrationChange}
                      rows="2"
                      placeholder="List your relevant skills and technologies"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Previous Experience</label>
                    <textarea
                      name="experience"
                      value={registrationData.experience}
                      onChange={handleRegistrationChange}
                      rows="2"
                      placeholder="Internships, projects, or relevant experience"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">What do you hope to gain from this event?</label>
                    <textarea
                      name="expectations"
                      value={registrationData.expectations}
                      onChange={handleRegistrationChange}
                      rows="2"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                    <button
                      type="button"
                      onClick={() => setActiveTab('details')}
                      className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                    >
                      Submit Registration
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">Event Photos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(event.photos || []).length > 0 ? (
                    (event.photos).map((p, idx) => (
                      <img key={idx} src={p} alt={`${event.title} - ${idx+1}`} className="w-full h-40 object-cover rounded-lg" onError={(e) => e.target.src = event.image} />
                    ))
                  ) : (
                    <img src={event.image} alt={event.title} className="w-full h-64 object-cover rounded-lg" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Registration Sidebar - Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Registration Card */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-xl">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-yellow-400 mb-2">Register Now</h3>
                  <p className="text-gray-300">Secure your spot for this career event</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Price:</span>
                    <span className="text-2xl font-bold text-green-500">{event.price}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Available Spots:</span>
                    <span className="text-white font-semibold">{event.maxParticipants - event.participants}</span>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all"
                      style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400 text-center">
                    {event.participants} out of {event.maxParticipants} spots filled
                  </p>
                </div>

                {event.requiresRegistration ? (
                  <button
                    onClick={() => setActiveTab('registration')}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-yellow-500/25 transition-all duration-200 transform hover:scale-105"
                  >
                    Register for Event
                  </button>
                ) : (
                  <button className="w-full bg-gray-600 text-gray-300 py-4 rounded-xl font-bold text-lg cursor-not-allowed">
                    No Registration Required
                  </button>
                )}

                {/* Contact Information */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-4">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <a
                        href={`mailto:${event.contact?.email || ''}`}
                        className="text-gray-300 hover:text-yellow-400 transition-colors"
                      >
                        {event.contact?.email || 'Not provided'}
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <a
                        href={`tel:${event.contact?.phone || ''}`}
                        className="text-gray-300 hover:text-yellow-400 transition-colors"
                      >
                        {event.contact?.phone || 'Not provided'}
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300">{event.contact?.coordinator || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-6">
                  <div className="flex flex-wrap gap-2">
                    {(event.tags || []).map((tag, index) => (
                      <span key={index} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default CareerEventDetails;