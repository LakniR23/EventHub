import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { getClubs } from '../services/clubServices';
import { getClubImageUrl, createPlaceholderImage } from '../utils/imageUtils';
import SearchInput from '../components/SearchInput';

const ClubsAndSocieties = () => {
  const navigate = useNavigate();

  // Filters & Search states
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [allClubsAndSocieties, setAllClubsAndSocieties] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(false);
  const [clubsError, setClubsError] = useState(null);

  // Helper: parse activities safely
  const parseActivities = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return String(raw).split(',').map(s => s.trim()).filter(Boolean);
  };

  useEffect(() => {
    let mounted = true;
    setLoadingClubs(true);
    setClubsError(null);

    getClubs()
      .then((data) => {
        console.log('API clubs data raw:', data);

        if (!mounted) return;

        if (!data || !Array.isArray(data)) {
          setClubsError(new Error('Invalid club data from server'));
          setAllClubsAndSocieties([]);
          return;
        }

        const mapped = data.map((c) => {
          let contact = {};
          if (typeof c.contactInfo === 'string') {
            try {
              contact = JSON.parse(c.contactInfo);
            } catch {
              contact = {};
            }
          } else if (typeof c.contactInfo === 'object' && c.contactInfo !== null) {
            contact = c.contactInfo;
          }

          const imageUrl = getClubImageUrl(c.image || c.imageFilename || c.imageUrl) || createPlaceholderImage(c.name);
          const activities = parseActivities(c.keyActivities);

          return {
            id: c.id,
            name: c.name || 'Unnamed Club',
            description: c.description || 'No description available',
            type: c.type || c.category || 'Special Interest',
            faculty: c.faculty || 'General',
            category: c.category || 'General',
            members: Number(c.memberCount ?? c.members ?? 0),
            isOpen: c.status ? String(c.status).toLowerCase() === 'active' : true,
            contact,
            image: imageUrl,
            imageFilename: c.imageFilename,
            established: c.establishedYear || c.established || 'N/A',
            activities
          };
        });

        console.log('Mapped clubs:', mapped);
        setAllClubsAndSocieties(mapped);
        setClubsError(null);
      })
      .catch((err) => {
        console.error('Error loading clubs:', err);
        if (mounted) {
          setClubsError(err);
          setAllClubsAndSocieties([]);
        }
      })
      .finally(() => {
        if (mounted) setLoadingClubs(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Category matching function
  const matchesStandardCategory = (club, filterId) => {
    const cat = (club.category || '').toString().toLowerCase();
    const type = (club.type || '').toString().toLowerCase();
    const activities = (Array.isArray(club.activities) ? club.activities.join(' ') : '').toLowerCase();

    switch (filterId) {
      case 'academic':
        return cat.includes('academic') || type.includes('academic');
      case 'sports':
        return cat.includes('sport') || type.includes('sport');
      case 'cultural':
        return cat.includes('cultural') || cat.includes('literature') || cat.includes('arts') || cat.includes('entertainment') || type.includes('cultural');
      case 'technical':
        return cat.includes('technical') || cat.includes('technology') || type.includes('technical');
      case 'social-service':
        return cat.includes('service') || type.includes('service') || cat.includes('community');
      case 'professional':
        return cat.includes('professional') || type.includes('professional');
      case 'special-interest':
        return type.includes('special') || cat.includes('special');
      case 'leadership':
        return activities.includes('leadership') || type.includes('main student body') || type.includes('leadership');
      default:
        return false;
    }
  };

  // Filter clubs according to all filters and search
  const filteredClubsAndSocieties = allClubsAndSocieties.filter(club => {
    const matchesFilter = selectedFilter === 'all' || matchesStandardCategory(club, selectedFilter);
    const matchesFaculty = selectedFaculty === 'all' || club.faculty === selectedFaculty;
    const matchesType = selectedType === 'all' || club.type === selectedType;

    const matchesSearch = searchQuery === '' ||
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (club.activities && club.activities.some(activity =>
        activity.toLowerCase().includes(searchQuery.toLowerCase())
      ));

    return matchesFilter && matchesFaculty && matchesType && matchesSearch;
  });

  // Filter categories with counts
  const filterCategories = [
    { id: 'all', label: 'All Clubs', icon: '📚' },
    { id: 'academic', label: 'Academic', icon: '🎓' },
    { id: 'sports', label: 'Sports', icon: '⚽' },
    { id: 'cultural', label: 'Cultural', icon: '🎭' },
    { id: 'technical', label: 'Technical', icon: '💻' },
    { id: 'social-service', label: 'Social Service', icon: '🤝' },
    { id: 'professional', label: 'Professional', icon: '🏅' },
    { id: 'special-interest', label: 'Special Interest', icon: '🎯' },
    { id: 'leadership', label: 'Leadership', icon: '🧭' }
  ].map(fc => ({
    ...fc,
    count: allClubsAndSocieties.filter(c => fc.id === 'all' ? true : matchesStandardCategory(c, fc.id)).length
  }));

  const colorMap = {
    all: 'yellow',
    academic: 'blue',
    sports: 'emerald',
    cultural: 'pink',
    technical: 'red',
    'social-service': 'purple',
    professional: 'orange',
    'special-interest': 'teal',
    leadership: 'indigo'
  };

  // For dropdown options:
  const facultyOptions = [
    { value: 'all', label: 'All Faculties' },
    { value: 'General', label: 'General' },
    { value: 'Faculty of Computing', label: 'Faculty of Computing' },
    { value: 'Faculty of Engineering', label: 'Faculty of Engineering' },
    { value: 'SLIIT Business School', label: 'SLIIT Business School' },
    { value: 'Faculty of Humanities & Sciences', label: 'Faculty of Humanities & Sciences' },
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'Main Student Body', label: 'Main Student Body' },
    { value: 'Faculty Community', label: 'Faculty Community' },
    { value: 'Technical Community', label: 'Technical Community' },
    { value: 'Service Club', label: 'Service Club' },
    { value: 'Professional Society', label: 'Professional Society' },
    { value: 'Cultural Society', label: 'Cultural Society' },
    { value: 'Special Interest', label: 'Special Interest' },
    { value: 'Media Unit', label: 'Media Unit' },
    { value: 'Research Community', label: 'Research Community' },
    { value: 'International Organization', label: 'International Organization' },
    { value: 'Academic Community', label: 'Academic Community' },
  ];

  // Handler for club click
  const handleClubClick = (club) => {
    if (!club || !club.id) {
      console.error('Invalid club data:', club);
      return;
    }
    console.log('Navigating to club:', club.id, club.name);
    navigate(`/clubs/${club.id}`, { state: { club } });
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
                <button onClick={() => navigate('/events')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Events</button>
                <button className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-yellow-500">Clubs & Societies</button>
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

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4">Clubs & Societies</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover and join amazing clubs and societies that match your interests and help you grow
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-blue-600 mx-auto mt-4"></div>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-6 max-w-3xl mx-auto">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clubs and societies..."
          />

          <div className="flex justify-center gap-4">
            <select
              value={selectedFaculty}
              onChange={e => setSelectedFaculty(e.target.value)}
              className="bg-gray-800 text-yellow-400 px-4 py-2 rounded"
            >
              {facultyOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="bg-gray-800 text-yellow-400 px-4 py-2 rounded"
            >
              {typeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Filter Tabs */}
          <div className="mt-6">
            <div className="flex justify-center flex-wrap gap-2 bg-gray-800/50 p-2 rounded-xl border border-gray-700 max-w-5xl mx-auto">
              {filterCategories.map(({ id, label, count }) => {
                const isSelected = selectedFilter === id;

                const colors = {
                  yellow: isSelected ? 'bg-yellow-500 text-black' : 'text-yellow-400 hover:bg-yellow-500/10',
                  blue: isSelected ? 'bg-blue-500 text-white' : 'text-blue-400 hover:bg-blue-500/10',
                  emerald: isSelected ? 'bg-emerald-500 text-white' : 'text-emerald-400 hover:bg-emerald-500/10',
                  red: isSelected ? 'bg-red-500 text-white' : 'text-red-400 hover:bg-red-500/10',
                  purple: isSelected ? 'bg-purple-500 text-white' : 'text-purple-400 hover:bg-purple-500/10',
                  orange: isSelected ? 'bg-orange-500 text-white' : 'text-orange-400 hover:bg-orange-500/10',
                  pink: isSelected ? 'bg-pink-500 text-white' : 'text-pink-400 hover:bg-pink-500/10',
                  teal: isSelected ? 'bg-teal-500 text-white' : 'text-teal-400 hover:bg-teal-500/10',
                  indigo: isSelected ? 'bg-indigo-500 text-white' : 'text-indigo-400 hover:bg-indigo-500/10'
                };

                const colorClass = colors[colorMap[id] || 'yellow'];

                return (
                  <button
                    key={id}
                    onClick={() => setSelectedFilter(id)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${colorClass}`}
                  >
                    <span>{label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-black/20' : 'bg-gray-700 text-gray-300'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Clubs List */}
        <div className="mb-8">
          {loadingClubs ? (
            <div className="text-center py-16">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                <span className="text-gray-400 text-lg">Loading clubs...</span>
              </div>
            </div>
          ) : clubsError ? (
            <div className="text-center py-16">
              <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-medium text-red-400 mb-2">Error Loading Clubs</h3>
              <p className="text-gray-500 mb-4">{clubsError.message || 'Failed to load clubs'}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 font-medium"
              >
                Retry
              </button>
            </div>
          ) : filteredClubsAndSocieties.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No clubs found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                  setSelectedFaculty('all');
                  setSelectedType('all');
                }}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredClubsAndSocieties.map((club, index) => (
                <div
                  key={club.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClubClick(club);
                  }}
                  className="group bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-yellow-500/60 hover:shadow-xl hover:shadow-yellow-500/20 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div className="flex items-center space-x-6">
                    {/* Avatar Section */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                        <span className="text-black text-2xl font-bold">
                          {club.name.charAt(0)}
                        </span>
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300 mb-1">
                            {club.name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              {club.faculty}
                            </span>
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              Est. {club.established}
                            </span>
                          </div>
                        </div>

                        {/* Status & Members */}
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                            club.isOpen 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/40' 
                              : 'bg-red-500/20 text-red-400 border border-red-500/40'
                          }`}>
                            {club.isOpen ? '● Open' : '● Closed'}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="flex -space-x-1">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border-2 border-gray-800 flex items-center justify-center">
                                  <span className="text-black text-xs font-bold">
                                    {club.name.charAt(i - 1) || '?'}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <span className="text-yellow-400 font-semibold">
                              {club.members} members
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2 group-hover:text-gray-200 transition-colors duration-300">
                        {club.description}
                      </p>

                      {/* Tags & Activities */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-medium border border-purple-500/30">
                            {club.type}
                          </span>
                          {club.activities && club.activities.slice(0, 3).map((activity, idx) => (
                            <span key={idx} className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/30">
                              {activity}
                            </span>
                          ))}
                          {club.activities && club.activities.length > 3 && (
                            <span className="text-gray-400 px-3 py-1 text-sm">
                              +{club.activities.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Action Arrow */}
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <div className="flex items-center text-yellow-400 font-medium">
                            <span className="mr-2">Explore Club</span>
                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subtle background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ClubsAndSocieties;
