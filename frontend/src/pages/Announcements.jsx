import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnnouncements } from '../services/announcementServices';
import SearchInput from '../components/SearchInput';
import Footer from '../components/Footer';

const Announcements = () => {
  const navigate = useNavigate();
  const [selectedSort, setSelectedSort] = useState('newest');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');


  // Sample announcements data - EventHub specific (fallback)
  const SAMPLE_ANNOUNCEMENTS = [
    {
      id: 1,
      title: "CodeFest 2024 - Registration Now Open!",
      content: "Exciting news! Registration for CodeFest 2024, our annual coding competition, is now officially open. This premier event features hackathons, algorithm challenges, and tech talks by industry experts. Early bird registration ends January 20th with a special discount. Don't miss out on this incredible opportunity to showcase your coding skills and network with industry professionals.",
      type: "Registration",
      priority: "High",
      faculty: "Faculty of Computing",
      author: "EventHub Team",
      date: "2025-01-15",
      time: "09:30 AM",
      expiryDate: "2025-02-10",
      attachments: ["CodeFest_2024_Guidelines.pdf", "Registration_Form.pdf"],
      targetAudience: "All Students",
      contact: {
        name: "Ms. Sarah De Silva",
        email: "events@eventhub.lk",
        phone: "+94 11 754 4801"
      },
      isUrgent: true,
      views: 1250
    },
    {
      id: 2,
      title: "Tech Summit 2024 - Speaker Lineup Announced",
      content: "We're thrilled to reveal the amazing speaker lineup for Tech Summit 2024! Industry leaders from Google, Microsoft, and local tech giants will be sharing their insights. The event will cover AI, blockchain, cybersecurity, and emerging technologies. Limited seats available - secure your spot now!",
      type: "Event Update",
      priority: "Medium",
      faculty: "Faculty of Computing",
      author: "EventHub Team",
      date: "2025-01-12",
      time: "02:15 PM",
      expiryDate: "2025-03-15",
      attachments: ["Speaker_Profiles.pdf", "Event_Schedule.pdf"],
      targetAudience: "Students and Industry Professionals",
      contact: {
        name: "Mr. Kamal Perera",
        email: "techsummit@eventhub.lk",
        phone: "+94 11 754 4802"
      },
      isUrgent: false,
      views: 850
    },
    {
      id: 3,
      title: "Cultural Night 2024 - Registration Closing Soon",
      content: "Last chance to register for Cultural Night 2024! This spectacular event will showcase the diverse talents of our student community with dance, music, drama, and art performances. Registration closes January 18th. Participants will compete for exciting prizes and the chance to represent SLIIT in inter-university competitions.",
      type: "Registration",
      priority: "High",
      faculty: "General",
      author: "Cultural Committee",
      date: "2025-01-10",
      time: "11:45 AM",
      expiryDate: "2025-01-18",
      attachments: ["Performance_Guidelines.pdf", "Registration_Form.docx"],
      targetAudience: "All Students",
      contact: {
        name: "Ms. Priyanka Jayawardena",
        email: "cultural@eventhub.lk",
        phone: "+94 11 754 4803"
      },
      isUrgent: true,
      views: 2100
    },
    {
      id: 4,
      title: "Photography Exhibition - Photos from Recent Events Released",
      content: "The official photographs from our recent EventHub activities including Freshers' Welcome, Sports Day, and Innovation Challenge are now available! High-resolution images can be downloaded from our gallery. Tag yourself and share your favorite moments with friends. Professional prints are also available upon request.",
      type: "Photo Release",
      priority: "Low",
      faculty: "General",
      author: "EventHub Media Team",
      date: "2025-01-08",
      time: "04:30 PM",
      expiryDate: "2025-03-31",
      attachments: ["Photo_Gallery_Links.pdf"],
      targetAudience: "Event Participants",
      contact: {
        name: "Mr. Roshan Fernando",
        email: "media@eventhub.lk",
        phone: "+94 11 754 4804"
      },
      isUrgent: false,
      views: 950
    },
    {
      id: 5,
      title: "Innovation Challenge 2024 - Judging Panel Announced",
      content: "Meet the prestigious judging panel for Innovation Challenge 2024! Our panel includes startup founders, venture capitalists, and industry experts who will evaluate your innovative projects. The competition focuses on solutions for sustainability, healthcare, education, and technology. Prepare your presentations and get ready to impress!",
      type: "Event Update",
      priority: "Medium",
      faculty: "Faculty of Engineering",
      author: "Innovation Committee",
      date: "2025-01-06",
      time: "10:00 AM",
      expiryDate: "2025-02-20",
      attachments: ["Judge_Profiles.pdf", "Evaluation_Criteria.pdf"],
      targetAudience: "Challenge Participants",
      contact: {
        name: "Eng. Madhavi Wickramasinghe",
        email: "innovation@eventhub.lk",
        phone: "+94 11 754 4805"
      },
      isUrgent: false,
      views: 680
    },
    {
      id: 6,
      title: "Sports Tournament 2024 - Team Registration Extended",
      content: "Due to popular demand, we're extending the team registration deadline for Sports Tournament 2024! Form your teams for cricket, football, basketball, volleyball, and badminton. Individual events include athletics, swimming, and table tennis. Medical clearance certificates are required for all participants. Let the games begin!",
      type: "Registration",
      priority: "Medium",
      faculty: "General",
      author: "Sports Committee",
      date: "2025-01-04",
      time: "01:20 PM",
      expiryDate: "2025-01-25",
      attachments: ["Sports_Rules.pdf", "Medical_Form.pdf"],
      targetAudience: "All Students",
      contact: {
        name: "Mr. Nimala Rajapakse",
        email: "sports@eventhub.lk",
        phone: "+94 11 754 4806"
      },
      isUrgent: false,
      views: 1450
    },
    {
      id: 7,
      title: "Career Fair 2024 - Company Participation Confirmed",
      content: "Major companies have confirmed their participation in Career Fair 2024! Leading employers from IT, engineering, finance, and other sectors will be present. Prepare your CVs, dress professionally, and get ready for on-the-spot interviews. Career guidance sessions and CV review workshops will be held prior to the fair.",
      type: "Career Event",
      priority: "High",
      faculty: "General",
      author: "Career Development Center",
      date: "2025-01-02",
      time: "03:45 PM",
      expiryDate: "2025-02-15",
      attachments: ["Participating_Companies.pdf", "CV_Guidelines.pdf"],
      targetAudience: "Final Year Students",
      contact: {
        name: "Prof. Sunil Jayasekara",
        email: "careers@eventhub.lk",
        phone: "+94 11 754 4807"
      },
      isUrgent: true,
      views: 1820
    },
    {
      id: 8,
      title: "EventHub Mobile App - Now Available for Download",
      content: "The official EventHub mobile app is now live on Google Play Store and Apple App Store! Get real-time notifications about event registrations, updates, and announcements. Access event schedules, venue maps, and connect with other participants. Download now and never miss an event update again!",
      type: "App Launch",
      priority: "High",
      faculty: "General",
      author: "EventHub Development Team",
      date: "2024-12-28",
      time: "05:15 PM",
      expiryDate: "2025-12-31",
      attachments: ["App_Features.pdf", "Download_Links.pdf"],
      targetAudience: "All Users",
      contact: {
        name: "Mr. Kamal Gunasekara",
        email: "support@eventhub.lk",
        phone: "+94 11 754 4808"
      },
      isUrgent: true,
      views: 1850
    },
    {
      id: 9,
      title: "Workshop Series 2024 - New Skill Development Sessions Added",
      content: "Exciting new workshops have been added to our 2024 lineup! Learn Python programming, digital marketing, graphic design, public speaking, and leadership skills. All workshops are free for registered students and include certificates of completion. Industry experts will conduct these hands-on sessions.",
      type: "Workshop",
      priority: "Medium",
      faculty: "General",
      author: "Skills Development Team",
      date: "2024-12-25",
      time: "11:00 AM",
      expiryDate: "2025-06-30",
      attachments: ["Workshop_Schedule.pdf", "Registration_Links.pdf"],
      targetAudience: "All Students",
      contact: {
        name: "Ms. Dilani Samaraweera",
        email: "workshops@eventhub.lk",
        phone: "+94 11 754 4809"
      },
      isUrgent: false,
      views: 920
    },
    {
      id: 10,
      title: "Annual Awards Ceremony - Nominations Now Open",
      content: "It's time to recognize outstanding achievements! Nominations are now open for the Annual EventHub Awards Ceremony. Categories include Best Event Organizer, Most Creative Project, Outstanding Leadership, and Community Service Excellence. Nominate yourself or your peers who have made significant contributions to campus life.",
      type: "Awards",
      priority: "Medium",
      faculty: "General",
      author: "Awards Committee",
      date: "2024-12-20",
      time: "02:30 PM",
      expiryDate: "2025-02-28",
      attachments: ["Nomination_Form.pdf", "Award_Categories.pdf"],
      targetAudience: "All Students and Staff",
      contact: {
        name: "Prof. Ananda Silva",
        email: "awards@eventhub.lk",
        phone: "+94 11 754 4810"
      },
      isUrgent: false,
      views: 750
    }
  ];

  const [allAnnouncements, setAllAnnouncements] = useState(SAMPLE_ANNOUNCEMENTS);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [announcementsError, setAnnouncementsError] = useState(null);

  const parseAttachments = (raw) => {
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

  useEffect(() => {
    let mounted = true;
    setLoadingAnnouncements(true);
    getAnnouncements()
      .then((data) => {
        if (!mounted) return;
        if (!data || !Array.isArray(data)) {
          setAnnouncementsError(new Error('Invalid announcements data'));
          return;
        }

        const mapped = data.map(a => ({
          id: a.id,
          title: a.title || a.tag || 'Untitled',
          content: a.description || a.content || '',
          type: a.category || a.type || a.tag || '',
          priority: a.priority || 'Low',
          faculty: a.faculty || 'General',
          author: a.author || '',
          date: a.date ? String(a.date) : new Date().toISOString(),
          time: a.time || '',
          expiryDate: a.expiresAt || a.expiryDate || null,
          attachments: parseAttachments(a.attachments),
          targetAudience: a.targetAudience || a.target || 'All Students',
          contact: {
            email: a.contactEmail || a.contact?.email || '',
            phone: a.contactPhone || a.contact?.phone || '',
            name: a.contactPerson || a.contact?.name || ''
          },
          isUrgent: (a.priority || '').toLowerCase() === 'high',
          views: a.views ?? 0
        }));

        setAllAnnouncements(mapped);
      })
      .catch((err) => {
        console.error('Error fetching announcements:', err);
        if (mounted) setAnnouncementsError(err);
      })
      .finally(() => {
        if (mounted) setLoadingAnnouncements(false);
      });

    return () => { mounted = false; };
  }, []);

  // Filter and sort announcements
  const getFilteredAnnouncements = () => {
    let filtered = allAnnouncements.filter(announcement => {
      const matchesSearch = searchQuery === '' || 
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFaculty = selectedFaculty === 'all' || announcement.faculty === selectedFaculty;
      const matchesType = selectedType === 'all' || announcement.type === selectedType;
      const matchesPriority = selectedPriority === 'all' || announcement.priority === selectedPriority;
      
      const announcementDate = new Date(announcement.date);
      const matchesMonth = selectedMonth === 'all' || (announcementDate.getMonth() + 1).toString() === selectedMonth;
      const matchesYear = selectedYear === 'all' || announcementDate.getFullYear().toString() === selectedYear;
      
      return matchesSearch && matchesFaculty && matchesType && matchesPriority && matchesMonth && matchesYear;
    });

    // Sort announcements
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      switch (selectedSort) {
        case 'oldest':
          return dateA - dateB;
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'views':
          return b.views - a.views;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default: // newest
          return dateB - dateA;
      }
    });

    return filtered;
  };

  const filteredAnnouncements = getFilteredAnnouncements();



  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Registration':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zM8 6a2 2 0 114 0v1H8V6zM6.68 9.01A1 1 0 016 10v1a1 1 0 001.68.69L10 9.41l2.32 2.28A1 1 0 0014 11v-1a1 1 0 00-.68-.99L10 6.83 6.68 9.01z" clipRule="evenodd"/>
          </svg>
        );
      case 'Event Update':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
          </svg>
        );
      case 'Photo Release':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
          </svg>
        );
      case 'Career Event':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
            <path d="M2 13.692A22.955 22.955 0 0110 15a22.955 22.955 0 018-1.308V18a2 2 0 01-2 2H4a2 2 0 01-2-2v-4.308z"/>
          </svg>
        );
      case 'Workshop':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
          </svg>
        );
      case 'Awards':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        );
      case 'App Launch':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM12 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zM12 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z" clipRule="evenodd"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
        );
    }
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
                <button className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-yellow-500">Announcements</button>
                <button onClick={() => navigate('/venues')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Venues</button>
                <button onClick={() => navigate('/about')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">About</button>
                <button onClick={() => navigate('/help')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Help</button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Announcements Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4">Campus Announcements</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stay updated with the latest news, updates, and important information from SLIIT
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-blue-600 mx-auto mt-4"></div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search announcements by title, content, or author..."
            />
          </div>
        </div>

        {/* Filters and Add Button */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
            {/* Filter Controls */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 flex-1">
              {/* Sort By */}
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="priority">By Priority</option>
                <option value="views">Most Viewed</option>
                <option value="alphabetical">Alphabetical</option>
              </select>

              {/* Faculty Filter */}
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="all">All Categories</option>
                <option value="General">General Events</option>
                <option value="Faculty of Computing">Computing Events</option>
                <option value="Faculty of Engineering">Engineering Events</option>
                <option value="SLIIT Business School">Business Events</option>
                <option value="Faculty of Humanities & Sciences">Other Faculty Events</option>
              </select>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="all">All Types</option>
                <option value="Registration">Registration</option>
                <option value="Event Update">Event Update</option>
                <option value="Photo Release">Photo Release</option>
                <option value="Career Event">Career Event</option>
                <option value="Workshop">Workshop</option>
                <option value="Awards">Awards</option>
                <option value="App Launch">App Launch</option>
              </select>

              {/* Priority Filter */}
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="all">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>

              {/* Month Filter */}
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="all">All Months</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>

              {/* Year Filter */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="all">All Years</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>


          </div>
        </div>

        {/* Announcements Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-500 via-blue-500 to-purple-500"></div>

          {filteredAnnouncements.length === 0 ? (
            <div className="text-center py-16">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-400 mb-2">No announcements found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredAnnouncements.map((announcement) => (
                <div key={announcement.id} className="relative flex items-start">
                  {/* Timeline Dot */}
                  <div className={`absolute left-6 w-4 h-4 rounded-full ${getPriorityColor(announcement.priority)} ring-4 ring-black z-10`}></div>
                  
                  {/* Announcement Content */}
                  <div className="ml-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 w-full group">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-gray-700 rounded-lg text-yellow-400 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                          {getTypeIcon(announcement.type)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                            {announcement.title}
                            {announcement.isUrgent && (
                              <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse">
                                URGENT
                              </span>
                            )}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                              </svg>
                              {new Date(announcement.date).toLocaleDateString()} at {announcement.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                              </svg>
                              {announcement.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                              </svg>
                              {announcement.views} views
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Priority and Type Badges */}
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getPriorityColor(announcement.priority)}`}>
                          {announcement.priority}
                        </span>
                        <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                          {announcement.type}
                        </span>
                        <span className="px-3 py-1 bg-blue-900/30 text-blue-400 border border-blue-500/30 rounded-full text-xs">
                          {announcement.faculty}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mb-4">
                      <p className="text-gray-300 leading-relaxed">
                        {announcement.content}
                      </p>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <span className="text-gray-400 text-sm">Target Audience:</span>
                        <p className="text-white font-medium">{announcement.targetAudience}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Expires:</span>
                        <p className="text-white font-medium">{new Date(announcement.expiryDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Attachments */}
                    {announcement.attachments && announcement.attachments.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Attachments:</h4>
                        <div className="flex flex-wrap gap-2">
                          {announcement.attachments.map((attachment, index) => (
                            <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 cursor-pointer transition-colors">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                              </svg>
                              {attachment}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contact Info */}
                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                          </svg>
                          {announcement.contact.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                          </svg>
                          {announcement.contact.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                          </svg>
                          {announcement.contact.name}
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
        <div className="text-center text-gray-400 text-sm mt-8">
          Showing {filteredAnnouncements.length} of {allAnnouncements.length} announcements
        </div>
      </div>

      <Footer />

    </div>
  );
};

export default Announcements;