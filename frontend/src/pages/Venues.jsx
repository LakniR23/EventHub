import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchInput from '../components/SearchInput';
import Footer from '../components/Footer';
import { getVenues } from '../services/venueServices';
import { getVenueImageUrl } from '../utils/imageUtils';

const Venues = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCapacity, setSelectedCapacity] = useState('all');
  const [selectedFacility, setSelectedFacility] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const SAMPLE_VENUES = [
    {
      id: 1,
      name: "Main Auditorium",
      category: "Auditorium",
      capacity: 800,
      location: "Ground Floor, Main Building",
      description: "The largest auditorium in SLIIT, perfect for major events, convocations, guest lectures, and large-scale presentations. Features state-of-the-art audio-visual equipment and comfortable seating.",
      image: "/images/venues/main-auditorium.jpg",
      facilities: ["Air Conditioning", "Audio System", "Video Projection", "Stage Lighting", "Microphones", "Recording Equipment"],
      availability: "Available",
      bookingContact: "events@sliit.lk",
      directions: {
        fromMainGate: "Enter through the main gate, walk straight for 50m, the auditorium entrance is on your right in the main building ground floor.",
        fromParking: "From the main parking area, head towards the main building. The auditorium is located on the ground floor with clear signage.",
        landmarks: ["Near main reception", "Opposite to administrative offices", "Next to student services counter"]
      },
      nearbyFacilities: ["Cafeteria", "Restrooms", "Parking", "Reception"],
      events: ["Convocation Ceremonies", "Guest Lectures", "Cultural Shows", "Award Ceremonies"],
      technicalSpecs: {
        audioSystem: "Professional grade sound system with wireless microphones",
        lighting: "Stage lighting with dimmer controls",
        projection: "4K projector with large screen",
        seating: "Fixed comfortable seating for 800 people"
      }
    },
    {
      id: 2,
      name: "Lecture Hall Complex - LH 01",
      category: "Lecture Hall",
      capacity: 200,
      location: "1st Floor, Academic Block A",
      description: "Modern lecture hall with tiered seating and advanced presentation facilities. Ideal for academic seminars, workshops, and medium-sized events.",
      image: "/images/venues/lecture-hall-01.jpg",
      facilities: ["Air Conditioning", "Interactive Whiteboard", "Video Projection", "Sound System", "Wi-Fi"],
      availability: "Available",
      bookingContact: "academic@sliit.lk",
      directions: {
        fromMainGate: "Enter main gate, turn left towards Academic Block A, take stairs to 1st floor, LH 01 is the first hall on your right.",
        fromParking: "Walk towards Academic Block A (the building with glass facade), use the main entrance, go to 1st floor.",
        landmarks: ["Next to computer labs", "Opposite faculty offices", "Near student common area"]
      },
      nearbyFacilities: ["Computer Labs", "Library", "Faculty Offices", "Student Lounge"],
      events: ["Technical Workshops", "Seminars", "Project Presentations", "Guest Lectures"],
      technicalSpecs: {
        audioSystem: "Built-in sound system with handheld microphones",
        lighting: "LED lighting with adjustable brightness",
        projection: "Interactive projector with whiteboard integration",
        seating: "Tiered seating for 200 students"
      }
    },
    {
      id: 3,
      name: "Innovation Lab",
      category: "Laboratory",
      capacity: 50,
      location: "2nd Floor, Technology Center",
      description: "State-of-the-art innovation laboratory equipped with latest technology for hackathons, innovation challenges, and hands-on workshops.",
      image: "/images/venues/innovation-lab.jpg",
      facilities: ["High-Speed Internet", "Power Outlets", "Workstations", "Collaboration Tools", "Whiteboard Walls"],
      availability: "Available",
      bookingContact: "innovation@sliit.lk",
      directions: {
        fromMainGate: "Walk straight 100m, turn right at the Technology Center building, take elevator to 2nd floor, Innovation Lab is at the end of the corridor.",
        fromParking: "Head towards the modern building with solar panels (Technology Center), use the side entrance, take elevator to 2nd floor.",
        landmarks: ["Near research labs", "Opposite startup incubation center", "Next to maker space"]
      },
      nearbyFacilities: ["Research Labs", "Maker Space", "3D Printing Lab", "Startup Incubator"],
      events: ["Hackathons", "Innovation Challenges", "Tech Workshops", "Startup Pitches"],
      technicalSpecs: {
        networking: "High-speed fiber internet with redundancy",
        power: "Dedicated power outlets at each workstation",
        collaboration: "Digital collaboration boards and tools",
        workspace: "Flexible modular furniture for team activities"
      }
    },
    {
      id: 4,
      name: "Sports Complex - Indoor Hall",
      category: "Sports Facility",
      capacity: 300,
      location: "Sports Complex Building",
      description: "Multi-purpose indoor sports hall suitable for various sports events, cultural activities, and large gatherings. Features wooden flooring and professional lighting.",
      image: "/images/venues/sports-hall.jpg",
      facilities: ["Wooden Floor", "Sports Equipment", "Changing Rooms", "Scoreboard", "Sound System"],
      availability: "Available",
      bookingContact: "sports@sliit.lk",
      directions: {
        fromMainGate: "Walk straight past the main building, continue for 200m, turn left at the sports ground, the indoor hall is the large building on your right.",
        fromParking: "Exit parking towards the back of campus, walk past the outdoor courts, the indoor hall is the large building with blue roof.",
        landmarks: ["Behind outdoor basketball courts", "Near swimming pool", "Opposite gym facilities"]
      },
      nearbyFacilities: ["Outdoor Courts", "Swimming Pool", "Gym", "Changing Rooms"],
      events: ["Sports Tournaments", "Cultural Events", "Award Ceremonies", "Exhibitions"],
      technicalSpecs: {
        flooring: "Professional wooden sports flooring",
        lighting: "High-bay LED lighting suitable for sports",
        sound: "Wireless microphone system with hall speakers",
        utilities: "Separate changing rooms and equipment storage"
      }
    },
    {
      id: 5,
      name: "Open Air Theatre",
      category: "Outdoor Venue",
      capacity: 500,
      location: "Central Campus Gardens",
      description: "Beautiful outdoor amphitheater surrounded by gardens, perfect for cultural events, concerts, and outdoor ceremonies. Features natural acoustics and scenic backdrop.",
      image: "/images/venues/open-air-theatre.jpg",
      facilities: ["Natural Acoustics", "Stage Area", "Garden Setting", "Lighting", "Seating Steps"],
      availability: "Weather Dependent",
      bookingContact: "cultural@sliit.lk",
      directions: {
        fromMainGate: "Walk straight into campus, pass the main building, continue to the central garden area, the amphitheater is built into the natural slope.",
        fromParking: "Head towards the center of campus, past the cafeteria, the open air theatre is in the garden area with stone seating.",
        landmarks: ["In central gardens", "Near decorative fountain", "Surrounded by trees and landscaping"]
      },
      nearbyFacilities: ["Gardens", "Cafeteria", "Student Center", "Decorative Fountain"],
      events: ["Cultural Nights", "Music Concerts", "Drama Performances", "Outdoor Ceremonies"],
      technicalSpecs: {
        acoustics: "Natural amphitheater design with good sound projection",
        lighting: "Outdoor lighting system for evening events",
        seating: "Stone step seating integrated into landscape",
        stage: "Permanent stage area with backstage facilities"
      }
    },
    {
      id: 6,
      name: "Conference Room A",
      category: "Conference Room",
      capacity: 50,
      location: "3rd Floor, Administrative Building",
      description: "Executive conference room with premium facilities for board meetings, high-level discussions, and professional presentations.",
      image: "/images/venues/conference-room-a.jpg",
      facilities: ["Conference Table", "Video Conferencing", "Presentation Screen", "Air Conditioning", "Executive Seating"],
      availability: "Available",
      bookingContact: "admin@sliit.lk",
      directions: {
        fromMainGate: "Enter main building, take elevator to 3rd floor, turn right from elevator, Conference Room A is the second door on your left.",
        fromParking: "Enter through administrative building main entrance, take elevator to 3rd floor, follow signs to conference rooms.",
        landmarks: ["Near vice-chancellor's office", "Opposite board room", "Next to executive offices"]
      },
      nearbyFacilities: ["Executive Offices", "Board Room", "Administrative Services", "Reception"],
      events: ["Board Meetings", "Academic Conferences", "Professional Presentations", "High-level Discussions"],
      technicalSpecs: {
        videoConf: "Professional video conferencing system with multiple screens",
        presentation: "4K display with wireless presentation capabilities",
        seating: "Executive conference table seating for 50 people",
        climate: "Individual climate control system"
      }
    },
    {
      id: 7,
      name: "Computer Lab - CL 05",
      category: "Computer Lab",
      capacity: 60,
      location: "2nd Floor, Academic Block B",
      description: "Advanced computer laboratory with latest hardware and software for technical workshops, programming competitions, and IT-related events.",
      image: "/images/venues/computer-lab.jpg",
      facilities: ["High-End PCs", "High-Speed Internet", "Software Licenses", "Projection System", "Air Conditioning"],
      availability: "Available",
      bookingContact: "it@sliit.lk",
      directions: {
        fromMainGate: "Walk to Academic Block B (building with IT signage), take stairs to 2nd floor, CL 05 is at the end of the corridor on the left.",
        fromParking: "Head towards the building marked 'Computing', use the side entrance, go to 2nd floor, follow lab number signs.",
        landmarks: ["Near server room", "Opposite IT faculty offices", "Next to networking lab"]
      },
      nearbyFacilities: ["Server Room", "IT Faculty Offices", "Networking Lab", "Student IT Support"],
      events: ["Programming Contests", "Technical Workshops", "Software Demonstrations", "IT Training"],
      technicalSpecs: {
        hardware: "Latest generation PCs with high-end specifications",
        software: "Full software suite including development tools",
        networking: "Gigabit ethernet and Wi-Fi connectivity",
        projection: "Central projection system for demonstrations"
      }
    },
    {
      id: 8,
      name: "Library Seminar Hall",
      category: "Seminar Hall",
      capacity: 120,
      location: "Ground Floor, Library Building",
      description: "Quiet and comfortable seminar hall within the library complex, ideal for academic presentations, book launches, and educational workshops.",
      image: "/images/venues/library-seminar-hall.jpg",
      facilities: ["Quiet Environment", "Presentation Screen", "Audio System", "Library Access", "Study Materials"],
      availability: "Available",
      bookingContact: "library@sliit.lk",
      directions: {
        fromMainGate: "Walk towards the library building (the building with large glass windows), enter through main library entrance, seminar hall is on your immediate right.",
        fromParking: "The library is the modern building with extensive glass facade, enter main entrance, seminar hall is clearly marked.",
        landmarks: ["Inside library building", "Near library circulation desk", "Adjacent to reading areas"]
      },
      nearbyFacilities: ["Book Collection", "Digital Resources", "Study Areas", "Research Support"],
      events: ["Academic Seminars", "Book Launches", "Research Presentations", "Educational Workshops"],
      technicalSpecs: {
        acoustics: "Sound-dampened environment suitable for presentations",
        technology: "Integrated presentation system with library resources",
        seating: "Comfortable academic seating for 120 people",
        resources: "Direct access to library materials and databases"
      }
    },
    {
      id: 9,
      name: "Student Center Multipurpose Hall",
      category: "Multipurpose Hall",
      capacity: 250,
      location: "Student Center Building",
      description: "Versatile multipurpose hall in the heart of student activities, perfect for student-organized events, club meetings, and social gatherings.",
      image: "/images/venues/student-center-hall.jpg",
      facilities: ["Flexible Seating", "Sound System", "Basic Lighting", "Kitchen Access", "Storage Space"],
      availability: "Available",
      bookingContact: "students@sliit.lk",
      directions: {
        fromMainGate: "Walk straight and turn left at the student cafeteria, the Student Center is the colorful building with student artwork, multipurpose hall is on the ground floor.",
        fromParking: "Head towards the area with outdoor seating and student activities, the Student Center is the building with vibrant exterior design.",
        landmarks: ["Near student cafeteria", "Opposite student services", "Next to club offices"]
      },
      nearbyFacilities: ["Student Cafeteria", "Club Offices", "Student Services", "Recreational Areas"],
      events: ["Student Events", "Club Meetings", "Social Gatherings", "Student Competitions"],
      technicalSpecs: {
        flexibility: "Modular seating and stage setup options",
        catering: "Adjacent kitchen facilities for event catering",
        storage: "Equipment storage for student organizations",
        atmosphere: "Casual, student-friendly environment"
      }
    },
    {
      id: 10,
      name: "Engineering Workshop Hall",
      category: "Workshop Space",
      capacity: 80,
      location: "Engineering Block, Ground Floor",
      description: "Practical workshop space with industrial equipment and tools, suitable for engineering demonstrations, maker events, and hands-on workshops.",
      image: "/images/venues/engineering-workshop.jpg",
      facilities: ["Workshop Tools", "Safety Equipment", "Workbenches", "Industrial Ventilation", "Equipment Storage"],
      availability: "Available",
      bookingContact: "engineering@sliit.lk",
      directions: {
        fromMainGate: "Walk to the Engineering Block (building with industrial design), enter through the workshop entrance on the ground floor, clearly marked with safety signs.",
        fromParking: "Head towards the building with engineering equipment visible outside, use the ground floor workshop entrance.",
        landmarks: ["Near engineering labs", "Opposite material storage", "Next to fabrication area"]
      },
      nearbyFacilities: ["Engineering Labs", "Material Storage", "Fabrication Area", "Safety Equipment"],
      events: ["Engineering Demonstrations", "Maker Workshops", "Technical Training", "Project Exhibitions"],
      technicalSpecs: {
        safety: "Industrial safety equipment and protocols",
        tools: "Complete workshop tool collection",
        ventilation: "Industrial ventilation for safe workshop activities",
        workspace: "Professional workbenches and assembly areas"
      }
    }
  ];

  const [allVenuesState, setAllVenuesState] = useState(SAMPLE_VENUES);
  const [loadingVenues, setLoadingVenues] = useState(false);
  const [venuesError, setVenuesError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoadingVenues(true);
    getVenues()
      .then((data) => {
        if (!mounted) return;
        if (!data || !Array.isArray(data)) {
          setVenuesError(new Error('Invalid venues data from server'));
          return;
        }

        const mapped = data.map(v => ({
          id: v.id,
          name: v.name,
          category: v.category,
          capacity: v.capacity,
          location: v.location,
          description: v.description,
          image: getVenueImageUrl(v.image || v.imageFilename),
          facilities: Array.isArray(v.facilities) ? v.facilities : (v.facilities ? String(v.facilities).split(',').map(s => s.trim()) : []),
          availability: v.availability || (v.isActive ? 'Available' : 'Unavailable'),
          bookingContact: v.bookingContact || v.booking_contact || '',
          directions: {
            fromMainGate: v.directionsFromMainGate || v.directions?.fromMainGate || v.directionsFromMainGate || '',
            fromParking: v.directionsFromParking || v.directions?.fromParking || '',
            landmarks: Array.isArray(v.landmarks) ? v.landmarks : (v.landmarks ? String(v.landmarks).split(',').map(s=>s.trim()) : (v.directions?.landmarks || []))
          },
          nearbyFacilities: Array.isArray(v.nearbyFacilities) ? v.nearbyFacilities : (v.nearbyFacilities ? String(v.nearbyFacilities).split(',').map(s=>s.trim()) : []),
          events: Array.isArray(v.suitableEvents) ? v.suitableEvents : (v.suitableEvents ? String(v.suitableEvents).split(',').map(s=>s.trim()) : []),
          technicalSpecs: v.technicalSpecs || {},
        }));

        setAllVenuesState(mapped);
      })
      .catch((err) => {
        console.error('Error loading venues:', err);
        if (mounted) setVenuesError(err);
      })
      .finally(() => { if (mounted) setLoadingVenues(false); });

    return () => { mounted = false; };
  }, []);

  const formatSentenceCase = (value) => {
    if (!value && value !== 0) return '';
    try {
      const str = String(value).replace(/_/g, ' ').toLowerCase();
      return str.charAt(0).toUpperCase() + str.slice(1);
    } catch (err) {
      return String(value);
    }
  };

  // Filter venues based on search and filters
  const getFilteredVenues = () => {
    return allVenuesState.filter(venue => {
      const matchesSearch = searchQuery === '' || 
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || venue.category === selectedCategory;
      
      const matchesCapacity = selectedCapacity === 'all' || 
        (selectedCapacity === 'small' && venue.capacity <= 50) ||
        (selectedCapacity === 'medium' && venue.capacity > 50 && venue.capacity <= 200) ||
        (selectedCapacity === 'large' && venue.capacity > 200);
      
      const matchesFacility = selectedFacility === 'all' || 
        venue.facilities.some(facility => facility.toLowerCase().includes(selectedFacility.toLowerCase()));
      
      return matchesSearch && matchesCategory && matchesCapacity && matchesFacility;
    });
  };

  const filteredVenues = getFilteredVenues();

  const openVenueDetails = (venue) => {
    // Navigate to a dedicated venue details route and pass the venue in state
    navigate(`/venues/${venue.id}`, { state: { venue } });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Auditorium': 'bg-purple-500',
      'Lecture Hall': 'bg-blue-500',
      'Laboratory': 'bg-green-500',
      'Sports Facility': 'bg-orange-500',
      'Outdoor Venue': 'bg-teal-500',
      'Conference Room': 'bg-red-500',
      'Computer Lab': 'bg-indigo-500',
      'Seminar Hall': 'bg-yellow-500',
      'Multipurpose Hall': 'bg-pink-500',
      'Workshop Space': 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
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
                <button onClick={() => navigate('/clubs-and-societies')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Clubs & Societies</button>
                <button onClick={() => navigate('/career')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Career</button>
                <button onClick={() => navigate('/announcements')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Announcements</button>
                <button className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-yellow-500">Venues</button>
                <button onClick={() => navigate('/about')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">About</button>
                <button onClick={() => navigate('/help')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Help</button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Venues Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4">SLIIT Event Venues</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover and book the perfect venue for your event. Explore our comprehensive facilities with detailed locations and directions.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-blue-600 mx-auto mt-4"></div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="max-w-2xl mx-auto">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search venues by name, location, or description..."
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="all">All Categories</option>
              <option value="Auditorium">Auditoriums</option>
              <option value="Lecture Hall">Lecture Halls</option>
              <option value="Laboratory">Laboratories</option>
              <option value="Sports Facility">Sports Facilities</option>
              <option value="Outdoor Venue">Outdoor Venues</option>
              <option value="Conference Room">Conference Rooms</option>
              <option value="Computer Lab">Computer Labs</option>
              <option value="Seminar Hall">Seminar Halls</option>
              <option value="Multipurpose Hall">Multipurpose Halls</option>
              <option value="Workshop Space">Workshop Spaces</option>
            </select>

            {/* Capacity Filter */}
            <select
              value={selectedCapacity}
              onChange={(e) => setSelectedCapacity(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="all">All Capacities</option>
              <option value="small">Small (1-50)</option>
              <option value="medium">Medium (51-200)</option>
              <option value="large">Large (200+)</option>
            </select>

            {/* Facility Filter */}
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="all">All Facilities</option>
              <option value="Air Conditioning">Air Conditioning</option>
              <option value="Audio System">Audio System</option>
              <option value="Video Projection">Video Projection</option>
              <option value="Wi-Fi">Wi-Fi</option>
              <option value="Stage">Stage</option>
              <option value="Parking">Parking</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedCapacity('all');
                setSelectedFacility('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Venues Grid */}
        {filteredVenues.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-xl font-medium text-gray-400 mb-2">No venues found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVenues.map((venue) => (
              <div
                key={venue.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                onClick={() => openVenueDetails(venue)}
              >
                {/* Venue Image */}
                <div className="relative h-48 bg-gray-700">
                  {venue.image && (
                    <img src={venue.image} alt={venue.name} className="absolute inset-0 w-full h-full object-cover" onError={(e)=>{e.target.onerror=null; e.target.src='/images/venues/default-venue.jpg'}} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 ${getCategoryColor(venue.category)} text-white text-xs font-semibold rounded-full`}>
                      {formatSentenceCase(venue.category)}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      venue.availability === 'Available' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-yellow-500 text-black'
                    }`}>
                      {venue.availability}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-sm">{venue.location}</span>
                    </div>
                  </div>
                </div>

                {/* Venue Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {venue.name}
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {venue.description}
                  </p>

                  {/* Capacity and Facilities */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-yellow-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                      </svg>
                      <span className="text-sm font-medium">{venue.capacity} people</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {venue.facilities.length} facilities
                    </div>
                  </div>

                  {/* Key Facilities */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {venue.facilities.slice(0, 3).map((facility, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                        {facility}
                      </span>
                    ))}
                    {venue.facilities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded">
                        +{venue.facilities.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openVenueDetails(venue);
                      }}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `mailto:${venue.bookingContact}?subject=Venue Booking Request - ${venue.name}`;
                      }}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Summary */}
        <div className="text-center text-gray-400 text-sm mt-8">
          Showing {filteredVenues.length} of {allVenuesState.length} venues
        </div>
      </div>

      <Footer />

      {/* Venue Details Modal */}
              {selectedVenue && (
        <div className="fixed inset-0 backdrop-blur-[3px] bg-gray-900/40 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-yellow-400 mb-2">{selectedVenue.name}</h2>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 ${getCategoryColor(selectedVenue.category)} text-white text-sm font-semibold rounded-full`}>
                    {formatSentenceCase(selectedVenue.category)}
                  </span>
                  <span className="text-gray-300 text-sm">{selectedVenue.location}</span>
                </div>
              </div>
              <button
                onClick={closeVenueDetails}
                className="text-gray-400 hover:text-white p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Venue Image */}
              <div className="h-64 bg-gray-700 rounded-lg mb-6 relative">
                {selectedVenue.image && (
                  <img src={selectedVenue.image} alt={selectedVenue.name} className="absolute inset-0 w-full h-full object-cover rounded-lg" onError={(e)=>{e.target.onerror=null; e.target.src='/images/venues/default-venue.jpg'}} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                      </svg>
                      <span className="font-medium">{selectedVenue.capacity} people</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedVenue.availability === 'Available' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-yellow-500 text-black'
                    }`}>
                      {selectedVenue.availability}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                <p className="text-gray-300 leading-relaxed">{selectedVenue.description}</p>
              </div>

              {/* Facilities */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Facilities & Equipment</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedVenue.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-gray-300 text-sm">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Directions */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-white">Directions & Location</h3>
                  <button
                    onClick={() => setShowDirections(!showDirections)}
                    className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
                  >
                    {showDirections ? 'Hide' : 'Show'} Detailed Directions
                  </button>
                </div>
                
                {showDirections && (
                  <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                    <div>
                      <h4 className="text-yellow-400 font-medium mb-2">From Main Gate:</h4>
                      <p className="text-gray-300 text-sm">{selectedVenue.directions.fromMainGate}</p>
                    </div>
                    <div>
                      <h4 className="text-yellow-400 font-medium mb-2">From Parking:</h4>
                      <p className="text-gray-300 text-sm">{selectedVenue.directions.fromParking}</p>
                    </div>
                    <div>
                      <h4 className="text-yellow-400 font-medium mb-2">Landmarks:</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        {selectedVenue.directions.landmarks.map((landmark, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                            </svg>
                            {landmark}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Nearby Facilities */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Nearby Facilities</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedVenue.nearbyFacilities.map((facility, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-900/30 text-blue-400 border border-blue-500/30 rounded-full text-sm">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suitable Events */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Suitable Events</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedVenue.events.map((event, index) => (
                    <span key={index} className="px-3 py-1 bg-green-900/30 text-green-400 border border-green-500/30 rounded-full text-sm">
                      {event}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Technical Specifications</h3>
                <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                  {Object.entries(selectedVenue.technicalSpecs).map(([key, value]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-yellow-400 font-medium w-32 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-gray-300 text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact and Booking */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => window.location.href = `mailto:${selectedVenue.bookingContact}?subject=Venue Booking Request - ${selectedVenue.name}&body=Hi, I would like to book ${selectedVenue.name} for an event. Please provide availability and booking details.`}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  Book This Venue
                </button>
                <button
                  onClick={() => window.location.href = `mailto:${selectedVenue.bookingContact}?subject=Venue Inquiry - ${selectedVenue.name}`}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Contact for Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Venues;