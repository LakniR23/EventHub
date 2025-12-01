import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCareers } from '../services/careerServices';
import { getCareerImageUrl } from '../utils/imageUtils';
import SearchInput from '../components/SearchInput';
import Footer from '../components/Footer';

const Career = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample career events data (fallback while fetching from API)
  const SAMPLE_CAREERS = [
    {
      id: 1,
      title: "Google Tech Talk - AI in Software Development",
      description: "Discover how Google leverages AI to enhance software development processes and developer productivity.",
      fullDescription: "Join us for an exclusive tech talk with senior engineers from Google who will share insights into how artificial intelligence is revolutionizing software development. This session will cover machine learning applications in code review, automated testing, and developer tools that are shaping the future of programming.",
      date: "2024-12-20",
      time: "14:00",
      location: "Main Auditorium",
      company: "Google",
      industry: "Technology",
      category: "Guest Lecture",
      faculty: "Faculty of Computing",
      organizer: "Career Services",
      participants: 156,
      maxParticipants: 200,
      image: "/images/career/google-tech-talk.jpg",
      featured: true,
      requiresRegistration: true,
      price: "Free",
      tags: ["AI", "Software Development", "Tech Talk", "Google"],
      jobOpportunities: "Software Engineer positions available for new graduates and experienced professionals",
      internshipOpportunities: "Summer internship programs for undergraduate students",
      skillsRequired: "Programming skills in Java, Python, or C++. Knowledge of data structures and algorithms.",
      dresscode: "Business Casual",
      requirements: ["Valid student ID", "Resume (optional but recommended)", "Questions prepared for Q&A session"],
      agenda: [
        { time: "14:00", activity: "Registration and Networking" },
        { time: "14:30", activity: "Welcome & Company Overview" },
        { time: "15:00", activity: "AI in Software Development Presentation" },
        { time: "15:45", activity: "Q&A Session" },
        { time: "16:15", activity: "Career Opportunities Discussion" },
        { time: "16:30", activity: "Networking & Refreshments" }
      ],
      speakers: [
        {
          name: "Dr. Sarah Chen",
          role: "Senior AI Engineer at Google",
          topic: "Machine Learning in Code Review Systems",
          image: "/images/speakers/sarah-chen.jpg"
        },
        {
          name: "Michael Rodriguez",
          role: "Developer Relations Manager",
          topic: "Career Paths in Tech",
          image: "/images/speakers/michael-rodriguez.jpg"
        }
      ],
      contact: {
        email: "career.services@sliit.lk",
        phone: "+94 11 754 4801",
        coordinator: "Ms. Priya Jayasinghe"
      }
    },
    {
      id: 2,
      title: "Microsoft Azure Career Fair",
      description: "Connect with Microsoft recruiters and learn about exciting career opportunities in cloud computing.",
      fullDescription: "Microsoft is hosting a comprehensive career fair focusing on cloud computing roles. This event provides an excellent opportunity to meet with hiring managers, technical recruiters, and current employees from various Microsoft divisions.",
      date: "2024-12-18",
      time: "10:00",
      location: "Sports Complex Hall",
      company: "Microsoft",
      industry: "Technology",
      category: "Job Fair",
      faculty: "All Faculties",
      organizer: "Career Development Center",
      participants: 234,
      maxParticipants: 300,
      image: "/images/career/microsoft-career-fair.jpg",
      featured: true,
      requiresRegistration: true,
      price: "Free",
      tags: ["Cloud Computing", "Job Fair", "Microsoft", "Azure"],
      jobOpportunities: "Cloud Solution Architect, Software Engineer, DevOps Engineer, Technical Support roles",
      internshipOpportunities: "Microsoft Internship Program - 12 week paid internships",
      skillsRequired: "Experience with cloud platforms, programming languages, and strong problem-solving skills",
      dresscode: "Business Formal",
      requirements: ["Professional resume", "Portfolio of projects", "Valid identification"],
      agenda: [
        { time: "10:00", activity: "Registration and Welcome" },
        { time: "10:30", activity: "Company Presentation" },
        { time: "11:00", activity: "Individual Interviews Begin" },
        { time: "12:30", activity: "Lunch Break" },
        { time: "13:30", activity: "Technical Skills Assessment" },
        { time: "15:00", activity: "Final Interview Rounds" },
        { time: "16:00", activity: "Closing Remarks" }
      ],
      speakers: [
        {
          name: "James Wilson",
          role: "Technical Recruiter",
          topic: "Career Opportunities at Microsoft",
          image: "/images/speakers/james-wilson.jpg"
        }
      ],
      contact: {
        email: "microsoft.recruitment@sliit.lk",
        phone: "+94 11 754 4802",
        coordinator: "Mr. Ravi Perera"
      }
    },
    {
      id: 3,
      title: "Banking Industry Workshop - Commercial Bank",
      description: "Learn about career opportunities in the banking sector and essential skills for finance professionals.",
      fullDescription: "Commercial Bank of Ceylon, one of Sri Lanka's leading private banks, presents an interactive workshop about careers in banking and finance. This comprehensive session will cover various departments, career progression paths, and the skills needed to succeed in the banking industry.",
      date: "2024-12-22",
      time: "09:30",
      location: "Business School Auditorium",
      company: "Commercial Bank of Ceylon",
      industry: "Banking & Finance",
      category: "Career Workshop",
      faculty: "Faculty of Business",
      organizer: "Business Club",
      participants: 89,
      maxParticipants: 120,
      image: "/images/career/combank-workshop.jpg",
      featured: false,
      requiresRegistration: true,
      price: "Free",
      tags: ["Banking", "Finance", "Workshop", "Career Development"],
      jobOpportunities: "Management Trainee, Credit Analyst, Relationship Manager, Treasury Officer positions",
      internshipOpportunities: "6-month internship programs in various departments",
      skillsRequired: "Strong analytical skills, knowledge of finance fundamentals, excellent communication",
      dresscode: "Business Formal",
      requirements: ["Academic transcripts", "Resume", "Interest in banking career"],
      agenda: [
        { time: "09:30", activity: "Registration and Welcome Coffee" },
        { time: "10:00", activity: "Banking Industry Overview" },
        { time: "10:45", activity: "Career Paths in Banking" },
        { time: "11:30", activity: "Break" },
        { time: "11:45", activity: "Skills Development Workshop" },
        { time: "12:30", activity: "Q&A and Networking" }
      ],
      speakers: [
        {
          name: "Ms. Samanthi Fernando",
          role: "Deputy General Manager - HR",
          topic: "Career Development in Banking",
          image: "/images/speakers/samanthi-fernando.jpg"
        },
        {
          name: "Mr. Nuwan Silva",
          role: "Senior Manager - Corporate Banking",
          topic: "Skills for Success in Finance",
          image: "/images/speakers/nuwan-silva.jpg"
        }
      ],
      contact: {
        email: "hr.recruitment@combank.net",
        phone: "+94 11 244 8448",
        coordinator: "Ms. Kavitha Rajapakse"
      }
    },
    {
      id: 4,
      title: "Startup Career Expo - Innovation Hub",
      description: "Explore exciting opportunities in Sri Lanka's thriving startup ecosystem.",
      fullDescription: "The Innovation Hub presents a unique career expo featuring 15+ innovative startups from various industries. This is your chance to discover dynamic work environments, learn about equity compensation, and understand what it takes to thrive in a startup culture.",
      date: "2024-12-15",
      time: "13:00",
      location: "Innovation Center",
      company: "Multiple Startups",
      industry: "Technology/Various",
      category: "Job Fair",
      faculty: "All Faculties",
      organizer: "Entrepreneurship Society",
      participants: 167,
      maxParticipants: 200,
      image: "/images/career/startup-expo.jpg",
      featured: true,
      requiresRegistration: true,
      price: "Free",
      tags: ["Startups", "Innovation", "Entrepreneurship", "Tech"],
      jobOpportunities: "Full-stack developers, product managers, marketing specialists, business analysts",
      internshipOpportunities: "3-6 month internships with potential for full-time conversion",
      skillsRequired: "Adaptability, quick learning, multitasking, relevant technical or business skills",
      dresscode: "Smart Casual",
      requirements: ["Resume/CV", "Portfolio (for technical roles)", "Open mindset"],
      agenda: [
        { time: "13:00", activity: "Registration and Startup Fair Setup" },
        { time: "13:30", activity: "Opening Presentation - Startup Ecosystem" },
        { time: "14:00", activity: "Company Booths and Networking" },
        { time: "15:30", activity: "Panel Discussion: Life in Startups" },
        { time: "16:15", activity: "Speed Interviews" },
        { time: "17:00", activity: "Closing and Follow-up" }
      ],
      speakers: [
        {
          name: "Rohan Jayawardena",
          role: "CEO, TechStart Solutions",
          topic: "Building Your Career in Startups",
          image: "/images/speakers/rohan-jayawardena.jpg"
        },
        {
          name: "Dr. Malsha Perera",
          role: "Founder, HealthTech Innovations",
          topic: "From Idea to Market Success",
          image: "/images/speakers/malsha-perera.jpg"
        }
      ],
      contact: {
        email: "startups@innovationhub.lk",
        phone: "+94 77 123 4567",
        coordinator: "Mr. Dinesh Kumar"
      }
    },
    {
      id: 5,
      title: "Engineering Excellence - Dialog Axiata",
      description: "Discover telecommunications engineering opportunities with Sri Lanka's leading mobile operator.",
      fullDescription: "Dialog Axiata, Sri Lanka's premier mobile telecommunications provider, invites engineering students to explore career opportunities in telecommunications, network engineering, and emerging technologies like 5G and IoT.",
      date: "2024-12-25",
      time: "10:00",
      location: "Engineering Faculty Auditorium",
      company: "Dialog Axiata",
      industry: "Telecommunications",
      category: "Industry Visit",
      faculty: "Faculty of Engineering",
      organizer: "IEEE Student Branch",
      participants: 78,
      maxParticipants: 100,
      image: "/images/career/dialog-engineering.jpg",
      featured: false,
      requiresRegistration: true,
      price: "Free",
      tags: ["Telecommunications", "Engineering", "5G", "IoT"],
      jobOpportunities: "Network Engineer, RF Engineer, Software Engineer, Project Manager positions",
      internshipOpportunities: "Industrial training programs for 6-12 months",
      skillsRequired: "Strong engineering fundamentals, problem-solving skills, knowledge of telecommunications",
      dresscode: "Business Casual",
      requirements: ["Engineering background", "Academic transcripts", "Technical portfolio"],
      agenda: [
        { time: "10:00", activity: "Welcome and Company Introduction" },
        { time: "10:30", activity: "Telecommunications Industry Overview" },
        { time: "11:15", activity: "5G and Future Technologies" },
        { time: "12:00", activity: "Career Opportunities Presentation" },
        { time: "12:30", activity: "Q&A Session" },
        { time: "13:00", activity: "Networking Lunch" }
      ],
      speakers: [
        {
          name: "Eng. Chaminda Rathnayake",
          role: "Chief Technology Officer",
          topic: "Future of Telecommunications",
          image: "/images/speakers/chaminda-rathnayake.jpg"
        },
        {
          name: "Ms. Tharushi Wickramasinghe",
          role: "Network Planning Manager",
          topic: "Engineering Career Paths",
          image: "/images/speakers/tharushi-wickramasinghe.jpg"
        }
      ],
      contact: {
        email: "careers@dialog.lk",
        phone: "+94 77 777 7777",
        coordinator: "Mr. Asanka Fernando"
      }
    }
  ];

  // State for careers (initially use sample fallback)
  const [allCareerEvents, setAllCareerEvents] = useState(SAMPLE_CAREERS);
  const [loadingCareers, setLoadingCareers] = useState(false);
  const [careersError, setCareersError] = useState(null);

  const parseArrayField = (raw) => {
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

  // Format labels: replace underscores/hyphens, lowercase then sentence-case
  const formatLabel = (val) => {
    if (!val && val !== 0) return '';
    const s = String(val).replace(/[_-]+/g, ' ').toLowerCase().trim();
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  // Normalize a key for comparisons: remove underscores/hyphens, collapse whitespace, lowercase
  const normalizeKey = (val) => {
    if (val === undefined || val === null) return '';
    return String(val).replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').toLowerCase().trim();
  };

  useEffect(() => {
    let mounted = true;
    setLoadingCareers(true);
    getCareers()
      .then((data) => {
        if (!mounted) return;
        if (!data || !Array.isArray(data)) {
          setCareersError(new Error('Invalid career data from server'));
          return;
        }

        const mapped = data.map((c) => ({
          id: c.id,
          title: c.title || c.name || 'Untitled',
          description: c.description || c.about || c.fullDescription || '',
          fullDescription: c.about || c.fullDescription || c.description || '',
          date: c.date ? String(c.date) : c.date,
          time: c.startTime || c.time || '',
          location: c.location || '',
          company: c.company || '',
          industry: c.industry || '',
          category: c.category || c.type || '',
          faculty: c.faculty || 'All Faculties',
          organizer: c.organizer || '',
          participants: c.participants ?? c.registeredCount ?? 0,
          maxParticipants: c.maxParticipants ?? c.maxParticipants ?? null,
          image: getCareerImageUrl(c.imageFilename || c.image),
          featured: Boolean(c.featured),
          requiresRegistration: Boolean(c.registerUrl) || Boolean(c.requiresRegistration),
          price: c.price || 'Free',
          tags: parseArrayField(c.tags),
          agenda: c.agenda || [],
          speakers: c.speakers || [],
        }));

        setAllCareerEvents(mapped);
      })
      .catch((err) => {
        console.error('Error loading careers:', err);
        if (mounted) setCareersError(err);
      })
      .finally(() => {
        if (mounted) setLoadingCareers(false);
      });

    return () => { mounted = false; };
  }, []);

  const handleEventClick = (event) => {
    // Pass the full event object in navigation state so the details page
    // can render the exact item clicked (avoids showing static/sample data)
    navigate(`/career/${event.id}`, { state: { event } });
  };

  // Build filter buttons using the exact category list requested by the user,
  // then append faculty filters. Counts are computed using normalized keys.
  const buildFilterButtons = () => {
    const fixedCategories = [
      'Job Fair',
      'Workshop',
      'Internship',
      'Company Visit',
      'Guest Lecture',
      'Recruitment Drive',
      'Other'
    ];

    const colors = ['yellow', 'blue', 'green', 'pink', 'red', 'teal', 'orange', 'purple'];
    let colorIndex = 0;

    const buttons = [];
    buttons.push({ key: 'all', label: 'All Events', count: allCareerEvents.length, color: 'yellow' });

    fixedCategories.forEach((cat) => {
      const target = normalizeKey(cat);
      const count = allCareerEvents.filter(e => {
        const nCat = normalizeKey(e.category);
        return nCat === target || nCat.includes(target);
      }).length;
      buttons.push({ key: target, label: cat, count, color: colors[(colorIndex++) % colors.length] });
    });

    // Append faculty filters
    const facultyMap = new Map();
    allCareerEvents.forEach((e) => {
      const nFac = normalizeKey(e.faculty);
      if (!facultyMap.has(nFac)) facultyMap.set(nFac, { key: nFac, label: formatLabel(e.faculty), count: 0 });
      facultyMap.get(nFac).count += 1;
    });

    for (const [, v] of facultyMap) {
      if (v.key === 'all faculties') continue;
      buttons.push({ key: v.key, label: v.label, count: v.count, color: colors[(colorIndex++) % colors.length] });
    }

    return buttons;
  };

  const filterButtons = buildFilterButtons();

  // Filter events based on selected filter and search query
  const filteredEvents = allCareerEvents.filter(event => {
    const normSel = normalizeKey(selectedFilter);
    const normCat = normalizeKey(event.category);
    const normFac = normalizeKey(event.faculty);

    const matchesFilter = normSel === 'all' || normCat === normSel || normFac === normSel || normCat.includes(normSel) || normFac.includes(normSel);

    const q = String(searchQuery || '').toLowerCase().trim();
    const matchesSearch = q === '' ||
      String(event.title || '').toLowerCase().includes(q) ||
      String(event.description || '').toLowerCase().includes(q) ||
      String(event.company || '').toLowerCase().includes(q) ||
      String(event.industry || '').toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
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
                <button className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-yellow-500">Career</button>
                <button onClick={() => navigate('/announcements')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Announcements</button>
                <button onClick={() => navigate('/venues')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Venues</button>
                <button onClick={() => navigate('/about')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">About</button>
                <button onClick={() => navigate('/help')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Help</button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Career Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4">Career Events</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover exciting career opportunities, connect with industry leaders, and kickstart your professional journey
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-blue-600 mx-auto mt-4"></div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search career events, companies, or industries..."
            />
          </div>
        </div>

        {/* Filter Tabs (styled to match Clubs page) */}
        <div className="mb-12">
          <div className="flex justify-center">
            <div className="flex justify-center flex-wrap gap-2 bg-gray-800/50 p-2 rounded-xl border border-gray-700 max-w-5xl w-full mx-auto">
              {filterButtons.map((filter) => {
                const color = filter.color || 'yellow';
                const isSelected = selectedFilter === filter.key;

                const getColorClasses = (color, isSelected) => {
                  const colors = {
                    yellow: isSelected ? 'bg-yellow-500 text-black' : 'text-yellow-400 hover:bg-yellow-500/10',
                    blue: isSelected ? 'bg-blue-500 text-white' : 'text-blue-400 hover:bg-blue-500/10',
                    green: isSelected ? 'bg-green-500 text-white' : 'text-green-400 hover:bg-green-500/10',
                    red: isSelected ? 'bg-red-500 text-white' : 'text-red-400 hover:bg-red-500/10',
                    purple: isSelected ? 'bg-purple-500 text-white' : 'text-purple-400 hover:bg-purple-500/10',
                    orange: isSelected ? 'bg-orange-500 text-white' : 'text-orange-400 hover:bg-orange-500/10',
                    pink: isSelected ? 'bg-pink-500 text-white' : 'text-pink-400 hover:bg-pink-500/10',
                    teal: isSelected ? 'bg-teal-500 text-white' : 'text-teal-400 hover:bg-teal-500/10'
                  };
                  return colors[color] || colors.yellow;
                };

                return (
                  <button
                    key={filter.key}
                    onClick={() => setSelectedFilter(filter.key)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${getColorClasses(color, isSelected)}`}
                  >
                    <span>{filter.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-black/20' : 'bg-gray-700 text-gray-300'}`}>
                      {filter.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Career Events Grid */}
        <div className="mb-8">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-400 mb-2">No career events found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-700 hover:border-yellow-500 transition-all duration-300 cursor-pointer group hover:shadow-2xl hover:shadow-yellow-500/20 hover:scale-105"
                >
                  <div className="relative">
                    <img src={event.image} alt={event.title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute top-4 left-4">
                      {event.featured && (
                        <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-3 py-1 rounded-full text-xs font-bold">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {formatLabel(event.category)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-yellow-400 text-sm font-semibold">{event.company}</span>
                      <span className="text-gray-400 text-xs">{event.industry}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                      {event.title}
                    </h3>

                    <p className="text-gray-300 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-400 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                      </div>

                      <div className="flex items-center text-gray-400 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>

                      <div className="flex items-center text-gray-400 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 01-3 0m3 0H9m1.5-2.25h6.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {event.participants} registered • {event.faculty}
                      </div>
                    </div>

                    {event.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {event.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                      <span className="text-yellow-500 font-semibold text-sm group-hover:text-yellow-400 transition-colors">
                        {event.requiresRegistration ? 'Register Now →' : 'Learn More →'}
                      </span>
                      <span className="text-green-500 font-semibold text-sm">
                        {event.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="text-center text-gray-400 text-sm">
          Showing {filteredEvents.length} of {allCareerEvents.length} career events
          {selectedFilter !== 'all' && ` filtered by ${formatLabel(selectedFilter)}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Career;