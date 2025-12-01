import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import SearchInput from '../components/SearchInput';
import Footer from '../components/Footer';
import { FACULTIES, FACULTY_LABELS, FACULTY_COLORS } from '../constants/eventConstants';
import { formatDate, formatTime } from '../utils/eventUtils';

const Events = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use the custom hook for event management
  const { events: allEvents, loading, error, updateFilters } = useEvents();

  // Update filters when search or faculty filter changes
  useEffect(() => {
    const filters = {};
    
    if (selectedFilter !== 'all') {
      // Map display names to backend enum values
      const facultyMap = {
        'Faculty of IT': FACULTIES.COMPUTING,
        'SLIIT Business School': FACULTIES.SLIIT_BUSINESS_SCHOOL,
        'Faculty of Engineering': FACULTIES.ENGINEERING,
        'Faculty of Humanities & Sciences': FACULTIES.HUMANITIES,
        'Faculty of Mathematics & Statistics': FACULTIES.SCIENCE,
        'William Angliss': FACULTIES.HUMANITIES // Fallback
      };
      filters.faculty = facultyMap[selectedFilter] || selectedFilter;
    }
    
    if (searchQuery.trim()) {
      filters.search = searchQuery.trim();
    }
    
    updateFilters(filters);
  }, [selectedFilter, searchQuery, updateFilters]);

  // Use real events data or fallback to empty array
  const displayEvents = allEvents.length > 0 ? allEvents : [];

  // Filter events based on selected filter and search query (client-side filtering for additional refinement)
  const filteredEvents = displayEvents.filter(event => {
    // Since we're already filtering on the server side via updateFilters,
    // this is mainly for additional client-side filtering if needed
    return true; // Let server-side filtering handle most of the work
  });

  const filterButtons = [
    { key: 'all', label: 'All Events', count: displayEvents.length, color: 'yellow' },
    { key: 'Faculty of IT', label: 'IT', count: displayEvents.filter(e => e.faculty === FACULTIES.COMPUTING).length, color: 'blue' },
    { key: 'SLIIT Business School', label: 'Business', count: displayEvents.filter(e => e.faculty === FACULTIES.SLIIT_BUSINESS_SCHOOL).length, color: 'green' },
    { key: 'Faculty of Engineering', label: 'Engineering', count: displayEvents.filter(e => e.faculty === FACULTIES.ENGINEERING).length, color: 'red' },
    { key: 'Faculty of Humanities & Sciences', label: 'Humanities', count: displayEvents.filter(e => e.faculty === FACULTIES.HUMANITIES).length, color: 'purple' },
    { key: 'Faculty of Mathematics & Statistics', label: 'Math & Stats', count: displayEvents.filter(e => e.faculty === FACULTIES.SCIENCE).length, color: 'orange' },
  ];

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };





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
                <button className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-yellow-500">Events</button>
                <button onClick={() => navigate('/clubs-and-societies')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Clubs & Societies</button>
                <button onClick={() => navigate('/career')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Career</button>
                <button onClick={() => navigate('/announcements')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Announcements</button>
                <button onClick={() => navigate('/venues')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Venues</button>
                <button onClick={() => navigate('/about')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">About</button>
                <button onClick={() => navigate('/help')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Help</button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Events Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4">Campus Events</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover and participate in exciting events happening across our campus
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-blue-600 mx-auto mt-4"></div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events by name, description, or category..."
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center items-center gap-4">
            {/* Modern Tab-style Filters */}
            <div className="flex flex-wrap gap-2 bg-gray-800/50 p-2 rounded-xl border border-gray-700">
              {filterButtons.map((filter) => {
                const getColorClasses = (color, isSelected) => {
                  const colors = {
                    yellow: isSelected ? 'bg-yellow-500 text-black' : 'text-yellow-400 hover:bg-yellow-500/10',
                    blue: isSelected ? 'bg-blue-500 text-white' : 'text-blue-400 hover:bg-blue-500/10',
                    green: isSelected ? 'bg-green-500 text-white' : 'text-green-400 hover:bg-green-500/10',
                    red: isSelected ? 'bg-red-500 text-white' : 'text-red-400 hover:bg-red-500/10',
                    purple: isSelected ? 'bg-purple-500 text-white' : 'text-purple-400 hover:bg-purple-500/10',
                    orange: isSelected ? 'bg-orange-500 text-white' : 'text-orange-400 hover:bg-orange-500/10',
                    pink: isSelected ? 'bg-pink-500 text-white' : 'text-pink-400 hover:bg-pink-500/10'
                  };
                  return colors[color] || colors.yellow;
                };

                return (
                  <button
                    key={filter.key}
                    onClick={() => setSelectedFilter(filter.key)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                      getColorClasses(filter.color, selectedFilter === filter.key)
                    }`}
                  >
                    <span>{filter.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedFilter === filter.key 
                        ? 'bg-black/20' 
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {filter.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="mb-8">
          {loading ? (
            <div className="text-center py-16">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                <span className="text-gray-400 text-lg">Loading events...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-medium text-red-400 mb-2">Error Loading Events</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button 
                onClick={fetchEvents}
                className="px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 font-medium"
              >
                Retry
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-400 mb-2">No events found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event.id)}
                  className="group bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer shadow-xl"
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGI1NTYzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkV2ZW50IEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                      }}
                    />
                    {event.featured && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-3 py-1 rounded-full text-xs font-bold">
                          Featured
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="bg-black/70 text-yellow-500 px-2 py-1 rounded-lg text-xs font-semibold">
                        {event.category}
                      </span>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors line-clamp-2">
                      {event.title}
                    </h3>

                    <p className="text-gray-300 mb-4 text-sm leading-relaxed line-clamp-3">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-yellow-500 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>{formatDate(event.date)}</span>
                      </div>

                      <div className="flex items-center text-yellow-500 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>{formatTime(event.time)}</span>
                      </div>

                      <div className="flex items-center text-yellow-500 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>{event.location}</span>
                      </div>

                      <div className="flex items-center text-gray-400 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                        </svg>
                        <span>{event.registeredCount || 0} participants</span>
                      </div>
                    </div>

                    {/* Faculty Tag */}
                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        FACULTY_COLORS[event.faculty]?.bg 
                          ? `bg-${FACULTY_COLORS[event.faculty].primary}-900/30 ${FACULTY_COLORS[event.faculty].text} border ${FACULTY_COLORS[event.faculty].border}` 
                          : 'bg-gray-900/30 text-gray-400 border border-gray-500/30'
                      }`}>
                        {FACULTY_LABELS[event.faculty] || event.faculty}
                      </span>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-500 font-semibold text-sm group-hover:text-yellow-400 transition-colors">
                          {event.hasRegistration ? 'Register Now →' : 'Learn More →'}
                        </span>
                        <span className="text-green-500 font-semibold text-sm">
                          {event.price || 'Free'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="text-center text-gray-400 text-sm">
          Showing {filteredEvents.length} of {displayEvents.length} events
          {selectedFilter !== 'all' && ` in ${selectedFilter}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      </div>

      <Footer />

    </div>
  );
};

export default Events;