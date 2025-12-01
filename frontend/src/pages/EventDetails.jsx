import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import CustomAlert from '../components/CustomAlert';
import ConfirmAlert from '../components/ConfirmAlert';
import { eventsAPI } from '../services/api';
import { getPhotos } from '../services/photoServices';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'registration' | 'photos'
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [regConfirmPresence, setRegConfirmPresence] = useState(false);
  const [regErrors, setRegErrors] = useState({});
  const [regReceiptFile, setRegReceiptFile] = useState(null);
  const [regReceiptPreview, setRegReceiptPreview] = useState(null);
  const [regReceiptError, setRegReceiptError] = useState('');
  const [alertState, setAlertState] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', message: '', onConfirm: null, type: 'warning' });
  const [eventPhotos, setEventPhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(false);

  // determine if the event end date/time has passed
  const now = new Date();
  let isPastEvent = false;
  if (event) {
    const rawEnd = event.endDate || event.date;
    if (rawEnd) {
      let end = new Date(rawEnd);
      if (isNaN(end)) {
        // try combining date and time if available (e.g. "9:00 AM - 6:00 PM")
        if (event.date && event.time && event.time.includes('-')) {
          const endTime = event.time.split('-')[1].trim();
          const combined = `${event.date} ${endTime}`;
          const parsed = new Date(combined);
          if (!isNaN(parsed)) end = parsed;
        }
      }

      if (!isNaN(end)) {
        // if end only had a date (00:00 time), treat as end of day
        if (end.getHours() === 0 && end.getMinutes() === 0 && end.getSeconds() === 0) {
          end.setHours(23, 59, 59, 999);
        }
        isPastEvent = now > end;
      }
    }
  }

  // Fetch event photos
  const fetchEventPhotos = async (eventId) => {
    if (!eventId) return;
    
    try {
      setPhotosLoading(true);
      const photos = await getPhotos(eventId, null);
      setEventPhotos(Array.isArray(photos) ? photos : []);
    } catch (error) {
      console.error('Error fetching event photos:', error);
      setEventPhotos([]);
    } finally {
      setPhotosLoading(false);
    }
  };

  // Fetch event details from API
  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  // Fetch event photos when event is loaded
  useEffect(() => {
    if (event && event.id) {
      fetchEventPhotos(event.id);
    }
  }, [event]);

  // Support both `hasRegistration` (schema) and legacy `requiresRegistration` (sample data)
  const registrationEnabled = event?.hasRegistration ?? event?.requiresRegistration ?? true;

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const eventData = await eventsAPI.getById(parseInt(id));
      setEvent(eventData);
    } catch (err) {
      setError('Failed to fetch event details. Please try again.');
      console.error('Error fetching event details:', err);
      // Fallback to sample data for demo
      const sampleEvents = [
    {
      id: 1,
      title: "CodeFest 2024",
      description: "Annual coding competition featuring hackathons, algorithm challenges, and tech talks by industry experts. This premier event brings together the brightest minds in technology to compete, learn, and network. Participants will work on real-world problems, showcase their coding skills, and have the opportunity to win exciting prizes.",
      fullDescription: "CodeFest 2024 is our flagship annual coding competition that has grown to become one of the most anticipated tech events on campus. This year's theme focuses on 'Innovation for Tomorrow' where participants will tackle challenges related to sustainable technology, AI ethics, and digital transformation.\n\nThe event spans two days with multiple tracks including competitive programming, web development challenges, mobile app development, and a special AI/ML track. Industry experts from leading tech companies will serve as judges and mentors throughout the competition.\n\nDay 1 features individual coding challenges and workshops, while Day 2 focuses on team-based hackathon projects. All skill levels are welcome, from beginners to advanced programmers.",
      date: "2024-12-15",
      endDate: "2024-12-16",
      time: "9:00 AM - 6:00 PM",
      location: "Main Auditorium",
      faculty: "Faculty of IT",
      image: "/images/codefest.jpg",
      category: "Competition",
      organizer: "Computer Society",
      participants: 150,
      maxParticipants: 200,
      price: "Free",
      featured: true,
      requiresRegistration: true,
      tags: ["Coding", "Hackathon", "AI", "Web Development"],
      requirements: ["Laptop with development environment", "University ID", "Team of 2-4 members (for hackathon)"],
      prizes: ["1st Place: $1000 + Internship Opportunities", "2nd Place: $500 + Tech Gadgets", "3rd Place: $250 + Certificates"],
      agenda: [
        { time: "9:00 AM", activity: "Registration & Welcome Coffee" },
        { time: "10:00 AM", activity: "Opening Ceremony & Keynote" },
        { time: "11:00 AM", activity: "Coding Challenges Begin" },
        { time: "1:00 PM", activity: "Lunch Break" },
        { time: "2:00 PM", activity: "Hackathon Project Work" },
        { time: "5:00 PM", activity: "Project Presentations" },
        { time: "6:00 PM", activity: "Awards Ceremony & Networking" }
      ],
      speakers: [
        { name: "Dr. Sarah Johnson", role: "CTO at TechCorp", topic: "Future of AI" },
        { name: "Mike Chen", role: "Senior Developer at Google", topic: "Clean Code Practices" }
      ],
      contact: {
        email: "codefest@sliit.lk",
        phone: "+94 11 123 4567",
        coordinator: "Alex Thompson"
      }
    },
    {
      id: 2,
      title: "Business Innovation Summit",
      description: "Entrepreneurship and business strategy conference with startup pitches and networking sessions.",
      fullDescription: "The Business Innovation Summit is a comprehensive conference designed to inspire and educate the next generation of entrepreneurs and business leaders. This event brings together successful entrepreneurs, industry experts, and investors to share insights and opportunities.\n\nAttendees will participate in interactive workshops, panel discussions, startup pitch competitions, and extensive networking sessions. The summit covers various aspects of modern business including digital transformation, sustainable business practices, and emerging market trends.",
      date: "2024-12-20",
      time: "10:00 AM - 5:00 PM",
      location: "Business School Auditorium",
      faculty: "SLIIT Business School",
      image: "/images/business-summit.jpg",
      category: "Conference",
      organizer: "Business Society",
      participants: 200,
      maxParticipants: 250,
      price: "Free",
      featured: false,
      requiresRegistration: false,
      tags: ["Business", "Entrepreneurship", "Networking", "Innovation"],
      requirements: ["University ID", "Business attire recommended"],
      prizes: ["Best Startup Pitch: $2000 funding", "Innovation Award: Mentorship program"],
      agenda: [
        { time: "10:00 AM", activity: "Registration & Networking Breakfast" },
        { time: "11:00 AM", activity: "Keynote: Future of Business" },
        { time: "12:00 PM", activity: "Panel: Startup Success Stories" },
        { time: "1:00 PM", activity: "Lunch & Networking" },
        { time: "2:30 PM", activity: "Startup Pitch Competition" },
        { time: "4:00 PM", activity: "Investor Roundtable" },
        { time: "5:00 PM", activity: "Closing & Awards" }
      ],
      speakers: [
        { name: "Emily Rodriguez", role: "Startup Founder", topic: "Building from Zero" },
        { name: "David Park", role: "Venture Capitalist", topic: "Investment Trends" }
      ],
      contact: {
        email: "business@sliit.lk",
        phone: "+94 11 234 5678",
        coordinator: "Sarah Wilson"
      }
    }
      ];
      
      const eventData = sampleEvents.find(e => e.id === parseInt(id));
      setEvent(eventData);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    // Prevent opening registration when organizer hasn't enabled registrations
    if (!isRegistered && !registrationEnabled) {
      setAlertState({ isOpen: true, title: 'Registration Disabled', message: 'Registration is not enabled for this event by the organizer.', type: 'info' });
      return;
    }

    // Prevent opening registration after the event has passed
    if (!isRegistered && isPastEvent) {
      setAlertState({ isOpen: true, title: 'Registration Closed', message: 'Registration is closed because the event date/time has passed.', type: 'info' });
      return;
    }

    // If already registered, ask for confirmation to unregister
    if (isRegistered) {
      setConfirmState({
        isOpen: true,
        title: 'Confirm Unregister',
        message: `Do you want to unregister from "${event.title}"?`,
        type: 'danger',
        onConfirm: () => {
          setIsRegistered(false);
          setAlertState({ isOpen: true, title: 'Unregistered', message: `Successfully unregistered from ${event.title}.`, type: 'success' });
        }
      });
    } else {
      // switch to the registration tab and scroll to its top
      setActiveTab('registration');
      // wait for the registration section to render, then scroll
      setTimeout(() => {
        const el = document.getElementById('registration-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // fallback: scroll to top of page
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 120);
    }
  };

  const submitRegistration = async (e) => {
    e.preventDefault();
    // basic client-side validation with inline errors
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneDigits = (regPhone || '').replace(/\D/g, '');

    if (!regName.trim()) errors.name = 'Name is required.';
    if (!regNumber.trim()) errors.registrationNumber = 'Registration number is required.';
    if (!regEmail.trim()) errors.email = 'Email is required.';
    else if (!emailRegex.test(regEmail)) errors.email = 'Enter a valid email address.';
    if (!regPhone.trim()) errors.phone = 'Phone is required.';
    else if (phoneDigits.length < 7) errors.phone = 'Enter a valid phone number.';
    if (!regConfirmPresence) errors.confirmPresence = 'You must confirm your presence.';

    if (Object.keys(errors).length > 0) {
      setRegErrors(errors);
      return;
    }
    setRegErrors({});
    setRegReceiptError('');

    try {
      // If this is a paid event, ensure receipt is present and convert to base64
      let receiptBase64 = null;
      const isPaid = event?.price && typeof event.price === 'string' && event.price.toLowerCase().includes('paid');
      if (isPaid) {
        if (!regReceiptFile) {
          setRegReceiptError('Payment receipt is required for paid events.');
          return;
        }
        // convert file to base64
        receiptBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(regReceiptFile);
        });
      }

      // POST to backend registrations endpoint
      const payload = {
        eventId: event?.id,
        name: regName,
        registrationNumber: regNumber,
        email: regEmail,
        phone: regPhone,
        confirmPresence: regConfirmPresence,
        receipt: receiptBase64,
      };

      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errTxt = await res.text();
        throw new Error(errTxt || 'Registration failed');
      }

      setIsRegistered(true);
      // reset form and switch back to details tab
      setActiveTab('details');
      setRegName('');
      setRegEmail('');
      setRegPhone('');
      setRegNumber('');
      setRegConfirmPresence(false);
      if (regReceiptPreview && regReceiptPreview.startsWith('blob:')) URL.revokeObjectURL(regReceiptPreview);
      setRegReceiptFile(null);
      setRegReceiptPreview(null);
      setRegReceiptError('');
      setAlertState({ isOpen: true, title: 'Registered', message: 'Registration successful — you are now registered for this event.', type: 'success' });
    } catch (err) {
      console.error('Registration failed', err);
      setAlertState({ isOpen: true, title: 'Registration Failed', message: (err && err.message) ? err.message : 'Registration failed. Please try again later.', type: 'error' });
    }
  };

  const closeInlineRegistration = () => {
    setActiveTab('details');
    setRegErrors({});
    if (regReceiptPreview && regReceiptPreview.startsWith('blob:')) URL.revokeObjectURL(regReceiptPreview);
    setRegReceiptFile(null);
    setRegReceiptPreview(null);
    setRegReceiptError('');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      setAlertState({ isOpen: true, title: 'Link Copied', message: 'Event link copied to clipboard!', type: 'success' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Event</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={fetchEventDetails}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/events')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Event Not Found</h2>
          <p className="text-gray-400 mb-6">The event you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/events')}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-300"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

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
                <button onClick={() => navigate('/events')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-yellow-500">Events</button>
                <button onClick={() => navigate('/clubs-and-societies')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Clubs & Societies</button>
                <button onClick={() => navigate('/career')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Career</button>
                <button onClick={() => navigate('/announcements')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Announcements</button>
                <button onClick={() => navigate('/venues')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Venues</button>
                <button onClick={() => navigate('/about')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">About</button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => navigate('/events')}
          className="flex items-center text-yellow-500 hover:text-yellow-400 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </button>
      </div>

      {/* Event Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGI1NTYzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMiIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkV2ZW50IEltYWdlPC90ZXh0Pjwvc3ZnPg==';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        
        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center mb-4">
              {event.featured && (
                <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-3 py-1 rounded-full text-sm font-bold mr-3 mb-2">
                  Featured Event
                </span>
              )}
              <span className="bg-blue-900/80 text-yellow-500 px-3 py-1 rounded-full text-sm font-semibold mr-3 mb-2">
                {event.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold mb-2 ${
                event.faculty === 'Faculty of IT' 
                  ? 'bg-blue-900/30 text-blue-400 border border-blue-500/30' 
                  : 'bg-green-900/30 text-green-400 border border-green-500/30'
              }`}>
                {event.faculty}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">{event.title}</h1>
            <p className="text-xl text-gray-300 max-w-3xl">{event.description}</p>
          </div>
        </div>
      </div>

      {/* Event Details Content */}
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
                onClick={() => { if (registrationEnabled) setActiveTab('registration'); }}
                aria-disabled={!registrationEnabled}
                title={!registrationEnabled ? 'Registration is disabled for this event' : 'Registration'}
                className={`pb-3 text-sm font-semibold ${activeTab === 'registration' ? 'text-yellow-400 border-b-2 border-yellow-400' : (!registrationEnabled ? 'text-gray-600 cursor-not-allowed opacity-60' : 'text-gray-300 hover:text-gray-200')}`}
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
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'details' && (
              <>
                {/* About Section */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 mb-8 border border-gray-700">
                  <h2 className="text-2xl font-bold text-yellow-400 mb-6">About This Event</h2>
                  <div className="prose prose-gray max-w-none">
                    {event.fullDescription ? (
                      event.fullDescription.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="text-gray-300 mb-4 leading-relaxed">
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <p className="text-gray-300 leading-relaxed">{event.description}</p>
                    )}
                  </div>
                </div>

                {/* Event Agenda */}
                {event.agenda && (
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 mb-8 border border-gray-700">
                    <h2 className="text-2xl font-bold text-yellow-400 mb-6">Event Agenda</h2>
                    <div className="space-y-4">
                      {event.agenda.map((item, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg">
                          <div className="bg-yellow-500 text-black px-3 py-1 rounded-lg font-semibold text-sm whitespace-nowrap">
                            {item.time}
                          </div>
                          <div className="text-gray-300">{item.activity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Speakers */}
                {event.speakers && (
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 mb-8 border border-gray-700">
                    <h2 className="text-2xl font-bold text-yellow-400 mb-6">Featured Speakers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {event.speakers.map((speaker, index) => (
                        <div key={index} className="bg-gray-800/50 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-white mb-2">{speaker.name}</h3>
                          <p className="text-yellow-500 mb-2">{speaker.role}</p>
                          <p className="text-gray-400 text-sm">{speaker.topic}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {event.requirements && (
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 mb-8 border border-gray-700">
                    <h2 className="text-2xl font-bold text-yellow-400 mb-6">Requirements</h2>
                    <ul className="space-y-2">
                      {event.requirements.map((req, index) => (
                        <li key={index} className="flex items-center text-gray-300">
                          <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prizes */}
                {event.prizes && (
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
                    <h2 className="text-2xl font-bold text-yellow-400 mb-6">Prizes & Awards</h2>
                    <div className="space-y-3">
                      {event.prizes.map((prize, index) => (
                        <div key={index} className="flex items-center text-gray-300">
                          <svg className="w-5 h-5 text-yellow-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {prize}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'registration' && (
              <div id="registration-section" className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">Register for this event</h3>
                <form onSubmit={submitRegistration} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Full name</label>
                    <input aria-invalid={regErrors.name ? 'true' : 'false'} value={regName} onChange={(e) => setRegName(e.target.value)} className="w-full px-3 py-2 rounded-md bg-black/40 border border-gray-600 text-white" placeholder="Your full name" />
                    {regErrors.name && <p className="text-xs text-red-400 mt-1">{regErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Registration number</label>
                    <input aria-invalid={regErrors.registrationNumber ? 'true' : 'false'} value={regNumber} onChange={(e) => setRegNumber(e.target.value)} className="w-full px-3 py-2 rounded-md bg-black/40 border border-gray-600 text-white" placeholder="e.g. IT23123456" />
                    {regErrors.registrationNumber && <p className="text-xs text-red-400 mt-1">{regErrors.registrationNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Email</label>
                    <input aria-invalid={regErrors.email ? 'true' : 'false'} value={regEmail} onChange={(e) => setRegEmail(e.target.value)} type="email" className="w-full px-3 py-2 rounded-md bg-black/40 border border-gray-600 text-white" placeholder="it23123456@my.sliit.lk" />
                    {regErrors.email && <p className="text-xs text-red-400 mt-1">{regErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Phone</label>
                    <input aria-invalid={regErrors.phone ? 'true' : 'false'} value={regPhone} onChange={(e) => setRegPhone(e.target.value)} className="w-full px-3 py-2 rounded-md bg-black/40 border border-gray-600 text-white" placeholder="+1 555 555 5555" />
                    {regErrors.phone && <p className="text-xs text-red-400 mt-1">{regErrors.phone}</p>}
                  </div>

                  {event?.price && typeof event.price === 'string' && event.price.toLowerCase().includes('paid') && (
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Payment receipt (image or PDF)</label>
                      <div className="flex items-center gap-3">
                        <label htmlFor="receipt-upload-inline" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-200 cursor-pointer hover:bg-gray-700">
                          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4v8z"/></svg>
                          <span>{regReceiptFile ? 'Change file' : 'Upload receipt'}</span>
                        </label>
                        <input id="receipt-upload-inline" type="file" accept="image/*,.pdf" onChange={(e) => {
                          const f = e.target.files && e.target.files[0];
                          if (f) {
                            if (regReceiptPreview && regReceiptPreview.startsWith('blob:')) URL.revokeObjectURL(regReceiptPreview);
                            setRegReceiptFile(f);
                            const previewUrl = f.type.startsWith('image/') ? URL.createObjectURL(f) : null;
                            setRegReceiptPreview(previewUrl || f.name);
                            setRegReceiptError('');
                          } else {
                            if (regReceiptPreview && regReceiptPreview.startsWith('blob:')) URL.revokeObjectURL(regReceiptPreview);
                            setRegReceiptFile(null);
                            setRegReceiptPreview(null);
                          }
                        }} className="hidden" />

                        {regReceiptFile && (
                          <div className="flex items-center gap-3">
                            {regReceiptPreview && regReceiptPreview.startsWith('blob:') ? (
                              <img src={regReceiptPreview} alt="Receipt preview" className="max-h-20 rounded-md border border-gray-700" />
                            ) : (
                              <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-md border border-gray-700">
                                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M6 2a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V8l-5-6H6z"/></svg>
                                <div className="text-sm text-gray-200">{regReceiptFile.name}</div>
                              </div>
                            )}

                            <button type="button" onClick={() => {
                              if (regReceiptPreview && regReceiptPreview.startsWith('blob:')) URL.revokeObjectURL(regReceiptPreview);
                              setRegReceiptFile(null);
                              setRegReceiptPreview(null);
                            }} className="text-sm text-red-400 hover:text-red-300">Remove</button>
                          </div>
                        )}
                      </div>

                      {regReceiptError && <p className="text-xs text-red-400 mt-2">{regReceiptError}</p>}
                    </div>
                  )}

                  <div className="flex items-start space-x-2">
                    <div className="flex items-center">
                      <input id="confirmPresenceInline" type="checkbox" checked={regConfirmPresence} onChange={(e) => setRegConfirmPresence(e.target.checked)} className="h-4 w-4 text-yellow-500 rounded mt-1" />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="confirmPresenceInline" className="text-sm text-gray-300">I confirm I will be present at the event</label>
                      {regErrors.confirmPresence && <p className="text-xs text-red-400 mt-1">{regErrors.confirmPresence}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button type="button" onClick={closeInlineRegistration} className="px-4 py-2 rounded-md bg-gray-700 text-gray-200">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded-md bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold">Submit</button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'photos' && (
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">Event Photos</h2>
                
                {photosLoading && (
                  <div className="text-center py-16">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                      <span className="text-gray-300">Loading photos...</span>
                    </div>
                  </div>
                )}

                {!photosLoading && eventPhotos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {eventPhotos.map((photo, index) => (
                      <div key={photo.id || index} className="relative group overflow-hidden rounded-lg aspect-video">
                        <img 
                          src={photo.url} 
                          alt={photo.caption || `${event.title} - ${index + 1}`} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGI1NTYzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkV2ZW50IFBob3RvPC90ZXh0Pjwvc3ZnPg==';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="text-center">
                            <svg className="w-8 h-8 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            {photo.photographer && (
                              <p className="text-white text-sm">📸 {photo.photographer}</p>
                            )}
                            {photo.caption && (
                              <p className="text-white text-xs mt-1">{photo.caption}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !photosLoading && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📸</div>
                    <h3 className="text-2xl font-bold text-white mb-2">No photos yet</h3>
                    <p className="text-gray-400">Photos will be uploaded after the event!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">

            {/* Event Details Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 mb-8 border border-gray-700">
              <h3 className="text-xl font-bold text-yellow-400 mb-6">Event Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-yellow-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-white font-medium">Date</div>
                    <div className="text-gray-400">{new Date(event.date).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-yellow-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-white font-medium">Time</div>
                    <div className="text-gray-400">{event.time}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-yellow-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-white font-medium">Location</div>
                    <div className="text-gray-400">{event.location}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-yellow-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                  <div>
                    <div className="text-white font-medium">Organizer</div>
                    <div className="text-gray-400">{event.organizer}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {event.tags && (
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 mb-8 border border-gray-700">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            {event.contact && (
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-white font-medium">Coordinator</div>
                    <div className="text-gray-400">{event.contact.coordinator}</div>
                  </div>
                  <div>
                    <div className="text-white font-medium">Email</div>
                    <a href={`mailto:${event.contact.email}`} className="text-yellow-500 hover:text-yellow-400">
                      {event.contact.email}
                    </a>
                  </div>
                  <div>
                    <div className="text-white font-medium">Phone</div>
                    <a href={`tel:${event.contact.phone}`} className="text-yellow-500 hover:text-yellow-400">
                      {event.contact.phone}
                    </a>
                  </div>
                </div>
              </div>
            )}
            {/* Registration/Action Card placed under Contact Information (sidebar) */}
            <div className="mt-6">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-3 md:p-4 mb-4 border border-gray-700 w-full">
                <div className="text-center mb-2">
                  <div className="text-lg md:text-xl font-bold text-green-500 mb-0">{event.price}</div>
                  <div className="text-gray-400 text-xs">{event.participants}{event.requiresRegistration && event.maxParticipants ? `/${event.maxParticipants}` : ''} participants</div>
                </div>

                <div className="md:flex md:items-center md:space-x-3">
                  <button
                    onClick={handleRegister}
                    disabled={(!registrationEnabled && !isRegistered) || isPastEvent}
                    aria-disabled={(!registrationEnabled && !isRegistered) || isPastEvent}
                    title={!registrationEnabled && !isRegistered ? 'Registration is disabled for this event' : isPastEvent ? 'Event has passed' : ''}
                    className={`flex-1 py-1.5 rounded-md font-semibold text-sm transition-all duration-200 mb-2 md:mb-0 ${
                      isRegistered
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black'
                    } ${((!registrationEnabled && !isRegistered) || isPastEvent) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isRegistered ? 'Cancel' : 'Register'}
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex-1 py-1.5 rounded-md border border-gray-600 text-sm text-gray-300 hover:border-yellow-500 hover:text-yellow-500 transition-colors duration-200"
                  >
                    Share
                  </button>
                </div>
              </div>
    
              
            </div>
          </div>
        </div>
      </div>
      

      <CustomAlert
        isOpen={alertState.isOpen}
        onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
      />

      <ConfirmAlert
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => { if (confirmState.onConfirm) confirmState.onConfirm(); }}
        title={confirmState.title}
        message={confirmState.message}
        type={confirmState.type}
        confirmText="Yes"
        cancelText="No"
      />

      <Footer />
    </div>
  );
};

export default EventDetails;