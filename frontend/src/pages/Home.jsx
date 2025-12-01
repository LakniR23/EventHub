import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useEvents } from '../hooks/useEvents';
import { getClubs } from '../services/clubServices';
import { getClubImageUrl } from '../utils/imageUtils';

const Home = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const collageImages = [
    { src: '/images/codefest.jpg', alt: 'CodeFest' },
    { src: '/images/dance.jpg', alt: 'Thaala Event' },
    { src: '/images/sport.jpg', alt: 'Inter-University Sports Tournament' },
    { src: '/images/SLIITs-Got-Talent-2023-2.jpg', alt: "SLIIT's Got Talent" },
    { src: '/images/rotaract.jpg', alt: 'Rotaract Club Installation' },
    { src: '/images/wiraamaya 1.jpg', alt: 'Wiraamaya Event' },
    { src: '/images/xmas.jpg', alt: 'Christmas Celebration' },
    { src: '/images/blood.jpg', alt: 'Blood Donation Campaign' },
  ];

  // Static fallback events (used only if API returns none)
  const staticEvents = [
    {
      id: 'tech-summit',
      title: 'Tech Innovation Summit',
      date: '2025-12-15',
      location: 'Main Auditorium',
      time: '9:00 AM - 5:00 PM',
      description:
        'Join industry leaders and innovators for a day of cutting-edge technology discussions and networking opportunities.',
    },
    {
      id: 'career-fair',
      title: 'Career Fair 2024',
      date: '2025-12-22',
      location: 'Exhibition Hall',
      time: '10:00 AM - 4:00 PM',
      description:
        'Connect with top employers and explore internship and job opportunities across various industries.',
    },
    {
      id: 'christmas',
      title: 'Christmas Celebration',
      date: '2025-12-25',
      location: 'Student Center',
      time: '7:00 PM - 11:00 PM',
      description:
        'Join us for a festive celebration with music, games, food, and special performances by student groups.',
    },
    {
      id: 'sports-tournament',
      title: 'Sports Tournament',
      date: '2026-01-10',
      location: 'Sports Complex',
      time: '8:00 AM - 6:00 PM',
      description:
        'Annual inter-faculty sports tournament featuring cricket, football, basketball, and more competitive events.',
    },
  ];

  // Use live events from the API when available
  const { events: fetchedEvents = [], loading: eventsLoading } = useEvents();

  // helper: returns days difference (eventDate - today) in days
  // parse YYYY-MM-DD safely into local date to avoid timezone shift problems
  const daysUntil = (isoDate) => {
    if (!isoDate) return Infinity;
    const parts = isoDate.split('T')[0].split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const eventDate = new Date(year, month, day);
      const today = new Date();
      const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const diffMs = eventDate - startToday;
      return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }
    // fallback to Date parsing
    const d = new Date(isoDate);
    const today = new Date();
    const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffMs = d - startToday;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  // Use API events for statistics, but fall back to static for display if no API events
  const eventsForStats = Array.isArray(fetchedEvents) && fetchedEvents.length > 0 ? fetchedEvents : [];
  const sourceEvents = Array.isArray(fetchedEvents) && fetchedEvents.length > 0 ? fetchedEvents : staticEvents;

  // only show events that occur within the next 7 days (including today)
  const upcomingEvents = (sourceEvents || []).filter((e) => {
    const diff = daysUntil(e.date);
    return diff >= 0 && diff <= 7;
  });

  // Compute event statistics by faculty using real API data only
  const countByFaculty = (keywords = []) => {
    if (!Array.isArray(eventsForStats)) return 0;
    return eventsForStats.filter((ev) => {
      if (!ev || !ev.faculty) return false;
      const f = String(ev.faculty).toLowerCase();
      return keywords.some((kw) => f.includes(kw));
    }).length;
  };

  const computingCount = countByFaculty(['computing', 'computer']);
  const businessCount = countByFaculty(['business', 'commerce', 'management', 'sliit_business_school']);
  const humanitiesCount = countByFaculty(['humanities', 'science', 'sciences']);
  const engineeringCount = countByFaculty(['engineering', 'engineer']);
  const mathCount = countByFaculty(['math', 'mathematics', 'statistics', 'stats']);
  const anglissCount = countByFaculty(['angliss', 'william']);
  const totalEventsCount = eventsForStats.length;

  const formatShortDate = (isoDate) => {
    const d = new Date(isoDate);
    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    return `${month} ${d.getDate()}`;
  };

  // --- Clubs preview for Home (show same clubs as Clubs page) ---
  const [homeClubs, setHomeClubs] = useState([]);
  const [homeLoading, setHomeLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setHomeLoading(true);
    getClubs()
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data)) {
          const mapped = data.map((c) => ({
            id: c.id,
            name: c.name || 'Unnamed Club',
            description: c.description || '',
            image: getClubImageUrl(c.image || c.imageFilename || c.imageUrl),
            isOpen: c.status ? String(c.status).toLowerCase() === 'active' : true,
            members: c.memberCount ?? c.members ?? 0,
            established: c.establishedYear || c.established || ''
          }));
          setHomeClubs(mapped);
        }
      })
      .catch((err) => {
        console.error('Error loading clubs for home:', err);
      })
      .finally(() => {
        if (mounted) setHomeLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  const displayClubs = (homeClubs && homeClubs.length > 0)
    ? homeClubs.slice(0, 8)
    : [
        { id: 'cs', name: 'Computer Society', description: 'Innovate with technology, hackathons and coding competitions.', image: '/images/fcsc.jpg', isOpen: true, members: 120, established: '2016' },
        { id: 'drama', name: 'Drama Society', description: 'Express creativity through theatre performances.', image: '/images/drama.jpg', isOpen: true, members: 40, established: '2017' },
        { id: 'sports', name: 'Sports Club', description: 'Stay fit and compete in inter-faculty tournaments.', image: '/images/sport.jpg', isOpen: true, members: 200, established: '2015' },
        { id: 'rotaract', name: 'Rotaract Club', description: 'Community service projects and leadership development.', image: '/images/rotaract.jpg', isOpen: true, members: 45, established: '2017' }
      ];

  const handleClubClick = (club) => {
    navigate(`/clubs/${club.id}`, { state: { club } });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black shadow-lg">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="shrink-0">
              <h1 className="text-2xl font-bold text-yellow-500">EventHub</h1>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#home" className="text-yellow-500 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-yellow-500">Home</a>
                <button onClick={() => navigate('/events')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Events</button>
                <button onClick={() => navigate('/clubs-and-societies')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Clubs & Societies</button>
                <button onClick={() => navigate('/career')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Career</button>
                <button onClick={() => navigate('/announcements')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Announcements</button>
                <button onClick={() => navigate('/venues')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Venues</button>
                <button onClick={() => navigate('/about')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">About</button>
                <button onClick={() => navigate('/help')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Help</button>
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
                <a href="#home" className="text-yellow-500 block px-3 py-2 rounded-md text-base font-medium border-l-4 border-yellow-500 bg-blue-50">Home</a>
                <button onClick={() => navigate('/events')} className="text-gray-700 hover:text-yellow-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Events</button>
                <button onClick={() => navigate('/clubs-and-societies')} className="text-gray-700 hover:text-yellow-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Clubs & Societies</button>
                <button onClick={() => navigate('/career')} className="text-gray-700 hover:text-yellow-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Career</button>
                <button onClick={() => navigate('/announcements')} className="text-gray-700 hover:text-yellow-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Announcements</button>
                <button onClick={() => navigate('/venues')} className="text-gray-700 hover:text-yellow-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Venues</button>
                <button onClick={() => navigate('/about')} className="text-gray-700 hover:text-yellow-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium w-full text-left">About</button>
                <button onClick={() => navigate('/help')} className="text-gray-700 hover:text-yellow-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Help</button>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  {/* Admin login removed from mobile menu by request */}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Event Collage Section */}
      <div className="relative w-full h-80 md:h-96 lg:h-[450px] bg-gradient-to-r from-blue-900 to-black">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Collage Grid */}
        <div className="relative z-10 h-full p-4 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 h-full max-w-6xl mx-auto">
            {collageImages.map((image, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 ${
                  index === 0 ? 'col-span-2 row-span-2' : ''
                } ${
                  index === 3 ? 'md:col-span-2' : ''
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmY2NjY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-2 left-2 text-white text-sm font-medium">
                    {image.alt}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
       {/* Welcome Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="text-center px-4 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-yellow-400" 
                style={{ 
                  textShadow: '1px 1px 0px rgba(255,255,255,0.3), -1px -1px 0px rgba(0,0,0,0.8), 2px 2px 0px rgba(0,0,0,0.6), 3px 3px 0px rgba(0,0,0,0.4), 4px 4px 0px rgba(0,0,0,0.2), 5px 5px 10px rgba(0,0,0,0.8)', 
                  WebkitTextStroke: '1px rgba(0,0,0,0.5)'
                }}>
              Welcome to EventHub
            </h2>
            <p className="text-base md:text-lg lg:text-xl max-w-2xl mx-auto text-white font-semibold"
               style={{ 
                 textShadow: '1px 1px 0px rgba(255,255,255,0.2), -1px -1px 0px rgba(0,0,0,0.8), 2px 2px 0px rgba(0,0,0,0.6), 3px 3px 0px rgba(0,0,0,0.4), 4px 4px 8px rgba(0,0,0,0.7)', 
                 WebkitTextStroke: '0.5px rgba(0,0,0,0.6)'
               }}>
              Discover amazing events, competitions, and activities happening at our campus
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-black">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-4">Upcoming Events</h2>
      <p className="text-lg text-gray-300 max-w-2xl mx-auto">Don't miss out on these exciting events happening soon at our campus</p>
    </div>

    <div className="relative">
      {/* Navigation Arrows */}
      <button 
        onClick={() => {
          const container = document.getElementById('events-slider');
          container.scrollBy({ left: -320, behavior: 'smooth' });
        }}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-yellow-500 hover:text-yellow-400 p-3 rounded-full transition-all duration-200 hover:scale-110 border border-yellow-500/30"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        onClick={() => {
          const container = document.getElementById('events-slider');
          container.scrollBy({ left: 320, behavior: 'smooth' });
        }}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-yellow-500 hover:text-yellow-400 p-3 rounded-full transition-all duration-200 hover:scale-110 border border-yellow-500/30"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Events Slider Container */}
      <div 
        id="events-slider"
        className="flex overflow-x-auto scrollbar-hide gap-8 px-12 p-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {upcomingEvents && upcomingEvents.length > 0 ? (
          upcomingEvents.map((ev) => (
            <div key={ev.id} className="group relative shrink-0 w-80 snap-start">
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 transform hover:scale-105 h-full flex flex-col">
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="bg-black/20 px-3 py-1 rounded-full">
                      <span className="text-yellow-500 font-bold text-sm">{formatShortDate(ev.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                    {ev.title}
                  </h3>

                  <div className="flex items-center text-yellow-500 mb-3">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">{ev.location}</span>
                  </div>

                  <p className="text-gray-300 mb-4 text-sm leading-relaxed flex-1">
                    {ev.description}
                  </p>

                  <div className="flex items-center text-yellow-500 mb-4">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-semibold">{ev.time}</span>
                  </div>

                  <div className="pt-4 border-t border-gray-700 mt-auto">
                    <span className="text-yellow-500 font-semibold text-sm cursor-pointer hover:text-yellow-400 transition-colors">
                      Stay Tuned
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full flex items-center justify-center">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 text-center max-w-2xl">
              <h3 className="text-xl font-bold text-white mb-2">No upcoming events</h3>
              <p className="text-gray-300">There are no newly added events scheduled within the next 7 days.</p>
            </div>
          </div>
        )}
      </div>
      
      {/* View All Events Button */}
      <div className="text-center mt-12">
        <button 
          onClick={() => navigate('/events')}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          View All Events
        </button>
      </div>
    </div>
  </div>
</section>

      {/* Faculty Events Statistics Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-4">Events by Faculty</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">Discover the vibrant activity across all faculties this year</p>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-blue-600 mx-auto mt-4"></div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            
            {/* Total Clubs */}
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-center border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-yellow-500 mb-2">{homeClubs.length || 24}</h3>
              <p className="text-gray-300 font-medium">Total Clubs</p>
            </div>

            {/* Faculty of Computing */}
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-center border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-blue-400 mb-2">{computingCount}</h3>
              <p className="text-gray-300 font-medium">Computing Events</p>
            </div>

            {/* Business School */}
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-center border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-400 mb-2">{businessCount}</h3>
              <p className="text-gray-300 font-medium">Business Events</p>
            </div>

            {/* Faculty of Humanities & Sciences */}
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-center border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-purple-400 mb-2">{humanitiesCount}</h3>
              <p className="text-gray-300 font-medium">Humanities Events</p>
            </div>

            {/* Faculty of Engineering */}
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-center border border-gray-700 hover:border-red-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-red-400 mb-2">{engineeringCount}</h3>
              <p className="text-gray-300 font-medium">Engineering Events</p>
            </div>

            {/* Faculty of Mathematics & Statistics */}
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-center border border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-orange-400 mb-2">{mathCount}</h3>
              <p className="text-gray-300 font-medium">Math & Stats Events</p>
            </div>

            {/* William Angliss */}
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-center border border-gray-700 hover:border-pink-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-pink-400 mb-2">{anglissCount}</h3>
              <p className="text-gray-300 font-medium">William Angliss Events</p>
            </div>

            {/* Total Events This Year */}
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-center border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 hover:transform hover:scale-105 md:col-span-3 lg:col-span-1">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-yellow-500 mb-2">{totalEventsCount}</h3>
              <p className="text-gray-300 font-medium">Total Events 2024</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">Statistics updated as of {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            <div className="flex justify-center items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-yellow-500 font-medium text-sm">Live Data</span>
            </div>
          </div>
        </div>
      </section>

      {/* Clubs and Societies Section - Creative Hexagonal Design */}
      <section className="py-16 bg-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
  <div className="absolute top-20 left-10 w-32 h-32 border-2 border-yellow-500 transform rotate-45"></div>
  <div className="absolute top-40 right-20 w-24 h-24 border-2 border-blue-900 rounded-full"></div>
  <div className="absolute bottom-20 left-1/3 w-20 h-20 border-2 border-yellow-500 transform rotate-12"></div>
</div>

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
  <div className="text-center mb-16">
    <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 mb-6">
      Clubs & Societies
    </h2>
    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
      Discover your passion through our diverse community of student organizations
    </p>
    <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-blue-900 mx-auto mt-4"></div>
  </div>

  {/* Modern Cards with Hover Effects */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
    {displayClubs.map((club, idx) => (
      <div
        key={club.id || idx}
        onClick={() => handleClubClick(club)}
        className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 h-80 hover:transform hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-yellow-500/30 shadow-xl cursor-pointer"
      >
        <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full opacity-20 group-hover:opacity-30 transition-opacity" style={{ background: idx % 2 === 0 ? undefined : undefined }}></div>
        <div className="relative z-10 h-full flex flex-col">
          <div className="mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3" style={{ background: 'linear-gradient(90deg,#f59e0b,#fbbf24)' }}>
              <span className="text-black font-bold text-lg">{(club.name || '').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{club.name}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {club.description}
            </p>
          </div>
          <div className="mt-auto pt-4 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <span className={`font-semibold text-sm ${club.isOpen ? 'text-green-400' : 'text-gray-500'}`}>
                {club.isOpen ? 'Open for Registration' : 'Closed'}
              </span>
              <div className={`w-2 h-2 rounded-full ${club.isOpen ? 'bg-green-500' : 'bg-gray-500'}`}></div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>

          {/* Interactive Join Button */}
          <div className="text-center">
            <div className="relative inline-block">
              <button
                onClick={() => navigate('/clubs-and-societies')}
                className="relative bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black px-6 py-2 text-sm font-semibold uppercase tracking-wide transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <span className="relative z-10">Explore All Clubs</span>
                <div className="absolute inset-0 bg-blue-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
              {/* Decorative Elements */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-l border-t border-yellow-500"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 border-r border-t border-yellow-500"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l border-b border-yellow-500"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r border-b border-yellow-500"></div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
