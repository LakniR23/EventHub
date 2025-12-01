import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getClubImageUrl, createPlaceholderImage } from '../utils/imageUtils';
import { getClub } from '../services/clubServices';
import { getClubPhotos } from '../services/photoServices';
import { useCustomAlert } from '../hooks/useCustomAlert';
import CustomAlert from '../components/CustomAlert';

const ClubDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroSrc, setHeroSrc] = useState('');
  const [activeTab, setActiveTab] = useState('about');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clubPhotos, setClubPhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    phone: '',
    motivation: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  const { alert, showAlert, hideAlert, showSuccess, showError } = useCustomAlert();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    }
    
    if (!formData.studentId.trim()) {
      errors.studentId = 'Student ID is required';
    } else if (!/^[A-Z]{2}\d{8}$/.test(formData.studentId.trim().toUpperCase())) {
      errors.studentId = 'Student ID must be in format: IT12345678';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s()-]{10,}$/.test(formData.phone.trim())) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    return errors;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showError('Validation Error', 'Please fix the form errors before submitting');
      return;
    }
    
    // Simulate successful form submission
    showSuccess('Application Submitted!', `Welcome to ${club.name}! You will receive a confirmation email shortly.`);
    
    // Reset form
    setFormData({
      fullName: '',
      studentId: '',
      email: '',
      phone: '',
      motivation: ''
    });
    setFormErrors({});
  };

  const parseActivities = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // ignore
    }
    return String(raw).split(',').map(s => s.trim()).filter(Boolean);
  };

  const parseContact = (raw) => {
    if (!raw) return {};
    if (typeof raw === 'object') return raw;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return {};
    }
  };

  const parseAchievements = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // ignore
    }
    return String(raw).split(',').map(s => s.trim()).filter(Boolean);
  };

  const fetchClubPhotos = async (clubId) => {
    if (!clubId) return;
    
    try {
      setPhotosLoading(true);
      const photos = await getClubPhotos(clubId);
      setClubPhotos(Array.isArray(photos) ? photos : []);
    } catch (error) {
      console.error('Error fetching club photos:', error);
      setClubPhotos([]);
    } finally {
      setPhotosLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    // If the user navigated here by clicking a card, prefer the passed
    // club object in location.state so we render the exact item clicked.
    if (location && location.state && location.state.club) {
      const incoming = location.state.club;
      const normalize = (c) => ({
        id: c.id ?? (id ? parseInt(id) : undefined),
        name: c.name ?? 'Unnamed Club',
        description: c.description ?? '',
        fullDescription: c.fullDescription ?? c.description ?? '',
        type: c.type ?? 'Special Interest',
        faculty: c.faculty ?? 'General',
        category: c.category ?? '',
        members: c.members ?? c.memberCount ?? 0,
        isOpen: typeof c.isOpen === 'boolean' ? c.isOpen : true,
        contact: typeof c.contact === 'string' ? JSON.parse(c.contact || '{}') : (c.contact ?? {}),
        image: c.image ?? '/images/default-club.jpg',
        gallery: c.gallery ?? [],
        established: c.established ?? '',
        activities: c.activities ?? [],
        achievements: parseAchievements(c.achievements),
        upcomingEvents: c.upcomingEvents ?? [],
        pastEvents: c.pastEvents ?? []
      });

      setClub(normalize(incoming));
      setLoading(false);
      return;
    }

    // Otherwise, fetch from backend
    if (id) {
      setLoading(true);
      setError(null);

      getClub(id)
        .then((data) => {
          if (!mounted) return;

          const clubData = {
            id: data.id,
            name: data.name || 'Unnamed Club',
            description: data.description || 'No description available',
            fullDescription: data.description || 'No description available',
            type: data.type || data.category || 'Special Interest',
            faculty: data.faculty || 'General',
            category: data.category || 'General',
            members: data.memberCount ?? 0,
            isOpen: data.status ? String(data.status).toLowerCase() === 'active' : true,
            contact: typeof data.contactInfo === 'string' ? JSON.parse(data.contactInfo || '{}') : (data.contactInfo || {}),
            image: data.imageUrl || data.image || (data.imageFilename ? `http://localhost:5000/uploads/club-photos/${data.imageFilename}` : null),
            gallery: [],
            established: data.establishedYear || 'N/A',
            activities: parseActivities(data.keyActivities),
            achievements: parseAchievements(data.achievements),
            upcomingEvents: [],
            pastEvents: []
          };

          setClub(clubData);
        })
        .catch((err) => {
          if (!mounted) return;
          console.error('Error fetching club details:', err);
          setError(err.message || 'Failed to load club details');
        })
        .finally(() => {
          if (mounted) setLoading(false);
        });
    }

    return () => { mounted = false; };
  }, [id, location]);

  // Fetch club photos when club is loaded
  useEffect(() => {
    if (club && club.id) {
      fetchClubPhotos(club.id);
    }
  }, [club]);

  // Resolve the hero image source independent of the club.image string so
  // the details page probes backend/public locations and falls back to a
  // generated placeholder (initials) when image file isn't available.
  useEffect(() => {
    let mounted = true;
    if (!club) return undefined;

    const API_ORIGIN = 'http://localhost:5000';

    (async () => {
      const filename = club.image || '';
      const candidates = [];
      const asString = String(filename || '');
      const basename = asString.split('/').filter(Boolean).pop();

      if (asString.startsWith('http://') || asString.startsWith('https://')) candidates.push(asString);
      if (asString.startsWith('/')) {
        candidates.push(`${API_ORIGIN}${asString}`);
        candidates.push(asString);
      }
      if (asString.includes('/') && !asString.startsWith('/')) candidates.push(`${API_ORIGIN}/${asString}`);
      if (basename) {
        candidates.push(`${API_ORIGIN}/uploads/${basename}`);
        candidates.push(`/images/clubs/${basename}`);
        candidates.push(`/images/${basename}`);
      }

      // Also include the helper-resolved URL
      const resolved = getClubImageUrl(asString || basename || '');
      if (resolved && !candidates.includes(resolved)) candidates.unshift(resolved);

      try {
        for (const url of candidates) {
          if (!url) continue;
          try {
            const res = await fetch(url, { method: 'GET' });
            if (!mounted) return;
            if (res.ok) {
              setHeroSrc(url);
              return;
            }
          } catch (e) {
            // ignore and try next
          }
        }
      } finally {
        if (mounted) setHeroSrc(createPlaceholderImage(club.name || 'Club'));
      }
    })();

    return () => { mounted = false; };
  }, [club]);

  // determine active top-nav item based on current pathname
  const pathname = location && location.pathname ? location.pathname : (typeof window !== 'undefined' ? window.location.pathname : '');
  const homeActive = pathname === '/' || pathname === '/home';
  const clubsActive = /club/i.test(pathname) || pathname.includes('clubs');

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            <span className="text-gray-400 text-lg">Loading club details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-red-500 mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Club</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/clubs-and-societies')}
              className="bg-gray-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-600 transition-all duration-200"
            >
              Back to Clubs
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-yellow-500 mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-white mb-2">Club Not Found</h2>
          <p className="text-gray-400 mb-6">The club you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/clubs-and-societies')}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200"
          >
            Back to Clubs
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
                <button onClick={() => navigate('/')} className={
                  homeActive
                    ? 'text-yellow-500 border-b-2 border-yellow-500 px-3 py-2 rounded-md text-sm font-medium'
                    : 'text-yellow-500 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500'
                }>Home</button>
                <button onClick={() => navigate('/events')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Events</button>
                <button onClick={() => navigate('/clubs-and-societies')} className={
                  clubsActive
                    ? 'text-yellow-500 border-b-2 border-yellow-500 px-3 py-2 rounded-md text-sm font-medium'
                    : 'text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500'
                }>Clubs & Societies</button>
                <button onClick={() => navigate('/career')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Career</button>
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
                <button onClick={() => { navigate('/'); toggleMenu(); }} className="text-yellow-500 block px-3 py-2 rounded-md text-base font-medium border-l-4 border-yellow-500 bg-blue-50">Home</button>
                <button onClick={() => { navigate('/events'); toggleMenu(); }} className="text-gray-700 hover:text-yellow-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Events</button>
                <button onClick={() => { navigate('/clubs-and-societies'); toggleMenu(); }} className="text-gray-700 hover:text-yellow-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Clubs & Societies</button>
                <button onClick={() => { navigate('/career'); toggleMenu(); }} className="text-gray-700 hover:text-yellow-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Career</button>
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

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/clubs-and-societies')}
                className="flex items-center text-yellow-500 hover:text-yellow-400 transition-colors mr-6"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Clubs
              </button>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${club.isOpen
                ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}>
                {club.isOpen ? '● Open for Registration' : '● Registration Closed'}
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-8">
            {/* Club Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl flex items-center justify-center shadow-xl">
                <span className="text-black text-3xl font-bold">
                  {club.name.charAt(0)}
                </span>
              </div>
            </div>

            {/* Club Information */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">{club.name}</h1>
              <p className="text-xl text-gray-300 max-w-4xl mb-6 leading-relaxed">{club.description}</p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center text-yellow-400 mb-2">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                    <span className="text-sm font-medium">Members</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{club.members}</span>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center text-blue-400 mb-2">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Established</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{club.established}</span>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center text-purple-400 mb-2">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Faculty</span>
                  </div>
                  <span className="text-lg font-bold text-white">{club.faculty}</span>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center text-green-400 mb-2">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Type</span>
                  </div>
                  <span className="text-lg font-bold text-white">{club.type}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'about', label: 'About', icon: '📋' },
              { id: 'gallery', label: 'Gallery', icon: '📸' },
              { id: 'contact', label: 'Join Us', icon: '👥' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center transition-colors ${activeTab === tab.id
                  ? 'border-yellow-500 text-yellow-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-4">About {club.name}</h2>
                  <p className="text-gray-300 leading-relaxed">{club.fullDescription}</p>
                </div>

                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">Key Activities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {club.activities.map((activity, index) => (
                      <div key={index} className="flex items-center bg-gray-700/50 rounded-lg p-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                        <span className="text-gray-300">{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">Achievements</h3>
                  <div className="space-y-3">
                    {club.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start">
                        <div className="text-yellow-500 mr-3 mt-1">🏆</div>
                        <span className="text-gray-300">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">Quick Info</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white">{club.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Faculty:</span>
                      <span className="text-white">{club.faculty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Members:</span>
                      <span className="text-white">{club.members}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Established:</span>
                      <span className="text-white">{club.established}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={`font-semibold ${club.isOpen ? 'text-green-400' : 'text-red-400'}`}>
                        {club.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                  </div>
                </div>

                {club.isOpen && (
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-6 text-black">
                    <h3 className="text-xl font-bold mb-2">Ready to Join?</h3>
                    <p className="mb-4">Become part of our amazing community!</p>
                    <button
                      onClick={() => setActiveTab('contact')}
                      className="w-full bg-black text-yellow-500 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                    >
                      Join Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Photo Gallery</h2>
            
            {photosLoading && (
              <div className="text-center py-16">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                  <span className="text-gray-300">Loading photos...</span>
                </div>
              </div>
            )}

            {!photosLoading && clubPhotos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubPhotos.map((photo, index) => (
                  <div key={photo.id || index} className="relative group overflow-hidden rounded-2xl aspect-square">
                    <img
                      src={photo.url}
                      alt={photo.caption || `${club.name} gallery ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGI1NTYzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkdhbGxlcnkgSW1hZ2U8L3RleHQ+PC9zdmc+';
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
                <p className="text-gray-400">Gallery will be updated with club activities soon!</p>
              </div>
            )}
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Get in Touch</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-yellow-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <div>
                        <p className="text-white font-medium">Email</p>
                        <p className="text-gray-400">{club.contact?.email || `${club.name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10)}@sliit.lk`}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-yellow-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <div>
                        <p className="text-white font-medium">Phone</p>
                        <p className="text-gray-400">{club.contact?.phone || '+94 11 754 4801'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Contacts */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">Key Contacts</h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h4 className="text-white font-semibold">{club.contact?.president || 'Contact Club'}</h4>
                      <p className="text-gray-400 text-sm">President</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-gray-300 text-sm">{club.contact?.presidentEmail || club.contact?.email || `${club.name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10)}@sliit.lk`}</p>
                        <p className="text-gray-300 text-sm">{club.contact?.presidentPhone || club.contact?.phone || '+94 11 754 4801'}</p>
                      </div>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="text-white font-semibold">{club.contact?.coordinator || 'Faculty Coordinator'}</h4>
                      <p className="text-gray-400 text-sm">Faculty Coordinator</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-gray-300 text-sm">{club.contact?.coordinatorEmail || 'admin@sliit.lk'}</p>
                        <p className="text-gray-300 text-sm">{club.contact?.coordinatorPhone || '+94 11 754 4801'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Membership Form */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Join {club.name}</h3>
                {club.isOpen ? (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:border-transparent ${
                          formErrors.fullName 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-600 focus:ring-yellow-500'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {formErrors.fullName && (
                        <p className="text-red-400 text-sm mt-1">{formErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Student ID *</label>
                      <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:border-transparent ${
                          formErrors.studentId 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-600 focus:ring-yellow-500'
                        }`}
                        placeholder="IT12345678"
                      />
                      {formErrors.studentId && (
                        <p className="text-red-400 text-sm mt-1">{formErrors.studentId}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:border-transparent ${
                          formErrors.email 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-600 focus:ring-yellow-500'
                        }`}
                        placeholder="your.email@sliit.lk"
                      />
                      {formErrors.email && (
                        <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:border-transparent ${
                          formErrors.phone 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-600 focus:ring-yellow-500'
                        }`}
                        placeholder="+94 77 123 4567"
                      />
                      {formErrors.phone && (
                        <p className="text-red-400 text-sm mt-1">{formErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Why do you want to join?</label>
                      <textarea
                        name="motivation"
                        value={formData.motivation}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Tell us your motivation..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                    >
                      Submit Application
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🔒</div>
                    <h4 className="text-xl font-bold text-white mb-2">Registration Closed</h4>
                    <p className="text-gray-400 mb-6">We're not accepting new members at the moment. Please check back later or contact us for more information.</p>
                    <div className="space-y-3">
                      <a
                        href={`mailto:${club.contact?.email || `${club.name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10)}@sliit.lk`}`}
                        className="block w-full bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                      >
                        Send Email
                      </a>
                      <a
                        href={`tel:${club.contact?.phone || '+94117544801'}`}
                        className="block w-full bg-yellow-500 text-black py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                      >
                        Call Us
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Alert Component */}
      <CustomAlert
        isOpen={alert.isOpen}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        confirmText={alert.confirmText}
        showIcon={alert.showIcon}
        showConfirm={alert.showConfirm}
        onConfirm={hideAlert}
        onClose={hideAlert}
      />
    </div>
  );
};

export default ClubDetails;