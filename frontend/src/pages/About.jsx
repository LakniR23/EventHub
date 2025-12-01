import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const About = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('mission');

  const teamMembers = [
    {
      id: 1,
      name: "Sarah De Silva",
      position: "EventHub Director",
      department: "Student Affairs",
      image: "/images/team/sarah.jpg",
      bio: "Sarah leads the EventHub initiative with over 8 years of experience in student engagement and event management. She's passionate about creating memorable experiences for the SLIIT community.",
      email: "sarah.desilva@sliit.lk",
      linkedin: "linkedin.com/in/sarah-desilva"
    },
    {
      id: 2,
      name: "Kamal Perera",
      position: "Technical Events Coordinator",
      department: "Faculty of Computing",
      image: "/images/team/kamal.jpg",
      bio: "Kamal specializes in organizing technical events, hackathons, and coding competitions. He bridges the gap between academia and industry through innovative event programming.",
      email: "kamal.perera@sliit.lk",
      linkedin: "linkedin.com/in/kamal-perera"
    },
    {
      id: 3,
      name: "Priyanka Jayawardena",
      position: "Cultural Events Manager",
      department: "Student Services",
      image: "/images/team/priyanka.jpg",
      bio: "Priyanka brings creativity and cultural diversity to EventHub, organizing festivals, art exhibitions, and cultural celebrations that showcase student talents.",
      email: "priyanka.jayawardena@sliit.lk",
      linkedin: "linkedin.com/in/priyanka-jayawardena"
    },
    {
      id: 4,
      name: "Roshan Fernando",
      position: "Sports & Recreation Coordinator",
      department: "Athletics Department",
      image: "/images/team/roshan.jpg",
      bio: "Roshan manages all sports events, tournaments, and recreational activities. He's a former national-level athlete who promotes healthy competition and fitness.",
      email: "roshan.fernando@sliit.lk",
      linkedin: "linkedin.com/in/roshan-fernando"
    },
    {
      id: 5,
      name: "Dilani Samaraweera",
      position: "Workshop & Skills Development Lead",
      department: "Professional Development",
      image: "/images/team/dilani.jpg",
      bio: "Dilani designs and coordinates skill development workshops, career seminars, and professional training programs to enhance student employability.",
      email: "dilani.samaraweera@sliit.lk",
      linkedin: "linkedin.com/in/dilani-samaraweera"
    },
    {
      id: 6,
      name: "Ananda Silva",
      position: "Community Outreach Manager",
      department: "External Relations",
      image: "/images/team/ananda.jpg",
      bio: "Prof. Silva manages partnerships with industry, alumni engagement, and community service projects that connect SLIIT with the broader community.",
      email: "ananda.silva@sliit.lk",
      linkedin: "linkedin.com/in/prof-ananda-silva"
    }
  ];

  const achievements = [
    {
      year: "2024",
      title: "Best University Event Platform",
      description: "Recognized by the Sri Lankan University Students' Union for excellence in event management and student engagement."
    },
    {
      year: "2024",
      title: "Digital Innovation Award",
      description: "Awarded for implementing cutting-edge technology in campus event management and student services."
    },
    {
      year: "2023",
      title: "Community Engagement Excellence",
      description: "Honored for outstanding contribution to community development through student-led initiatives."
    },
    {
      year: "2023",
      title: "Sustainability Champion",
      description: "Recognized for promoting eco-friendly practices in event management and waste reduction initiatives."
    }
  ];

  const statistics = [
    { number: "500+", label: "Events Organized", icon: "🎯" },
    { number: "25,000+", label: "Student Participants", icon: "👥" },
    { number: "100+", label: "Industry Partners", icon: "🤝" },
    { number: "50+", label: "Clubs & Societies", icon: "🏆" },
    { number: "98%", label: "Satisfaction Rate", icon: "⭐" },
    { number: "24/7", label: "Platform Availability", icon: "🔄" }
  ];

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
                <button className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-yellow-500">About</button>
                <button onClick={() => navigate('/help')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Help</button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* About Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-yellow-400 mb-6">About EventHub</h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Empowering the SLIIT community through exceptional events, meaningful connections, and unforgettable experiences. 
              We are the bridge between academic excellence and vibrant campus life.
            </p>
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-yellow-500 to-blue-600 mx-auto"></div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-12 border-b border-gray-700">
          {[
            { id: 'mission', label: 'Our Mission' },
            { id: 'team', label: 'Our Team' },
            { id: 'achievements', label: 'Achievements' },
            { id: 'statistics', label: 'Impact' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-6 py-3 mx-2 mb-4 rounded-lg font-medium transition-all duration-300 ${
                activeSection === tab.id
                  ? 'bg-yellow-500 text-black'
                  : 'text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mission Section */}
        {activeSection === 'mission' && (
          <div className="space-y-12">
            {/* Mission Statement */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-yellow-400 mb-6">Our Mission</h2>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    At EventHub, we believe that memorable experiences shape exceptional individuals. Our mission is to create, 
                    coordinate, and celebrate events that foster learning, creativity, leadership, and community spirit among 
                    SLIIT students.
                  </p>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    We strive to provide a platform where every student can discover their passion, showcase their talents, 
                    and build lasting connections that extend far beyond their university years.
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-6 border border-yellow-500/20">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-xl font-bold text-yellow-400 mb-3">Our Vision</h3>
                    <p className="text-gray-300">
                      To be the premier student engagement platform that transforms campus life through innovative, 
                      inclusive, and impactful events.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Values */}
            <div>
              <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">Our Core Values</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: "🤝",
                    title: "Community",
                    description: "Building bridges between students, faculty, and industry through meaningful interactions and collaborative experiences."
                  },
                  {
                    icon: "💡",
                    title: "Innovation",
                    description: "Embracing creativity and cutting-edge technology to deliver unique, engaging, and memorable event experiences."
                  },
                  {
                    icon: "🌟",
                    title: "Excellence",
                    description: "Committed to the highest standards of quality, professionalism, and attention to detail in every event we organize."
                  },
                  {
                    icon: "🌍",
                    title: "Inclusivity",
                    description: "Creating welcoming spaces where every student feels valued, represented, and empowered to participate fully."
                  },
                  {
                    icon: "🚀",
                    title: "Growth",
                    description: "Fostering personal and professional development through challenging opportunities and skill-building experiences."
                  },
                  {
                    icon: "💚",
                    title: "Sustainability",
                    description: "Promoting environmentally conscious practices and social responsibility in all our events and operations."
                  }
                ].map((value, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300">
                    <div className="text-4xl mb-4 text-center">{value.icon}</div>
                    <h3 className="text-xl font-bold text-yellow-400 mb-3 text-center">{value.title}</h3>
                    <p className="text-gray-300 text-center leading-relaxed">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Team Section */}
        {activeSection === 'team' && (
          <div>
            <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">Meet Our Team</h2>
            <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
              Our dedicated team of professionals works tirelessly to bring you the best events and experiences. 
              Get to know the people behind EventHub.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 group">
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-black">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 className="text-xl font-bold text-yellow-400 mb-2">{member.name}</h3>
                    <p className="text-blue-400 font-medium mb-1">{member.position}</p>
                    <p className="text-gray-400 text-sm">{member.department}</p>
                  </div>
                  
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">{member.bio}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-400 text-sm">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                      {member.email}
                    </div>
                    <div className="flex items-center text-blue-400 text-sm hover:text-blue-300 cursor-pointer">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
                      </svg>
                      {member.linkedin}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Section */}
        {activeSection === 'achievements' && (
          <div>
            <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">Our Achievements</h2>
            <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
              Recognition and awards that reflect our commitment to excellence in student engagement and event management.
            </p>
            
            <div className="space-y-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="relative">
                  {/* Timeline line */}
                  {index !== achievements.length - 1 && (
                    <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-yellow-500 to-blue-500"></div>
                  )}
                  
                  <div className="flex items-start">
                    {/* Year badge */}
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-sm z-10">
                      {achievement.year}
                    </div>
                    
                    {/* Achievement content */}
                    <div className="ml-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 flex-1">
                      <h3 className="text-xl font-bold text-yellow-400 mb-3">{achievement.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Statistics Section */}
        {activeSection === 'statistics' && (
          <div>
            <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">Our Impact</h2>
            <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
              Numbers that showcase the reach and impact of EventHub in the SLIIT community and beyond.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
              {statistics.map((stat, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 text-center group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">{stat.number}</div>
                  <div className="text-gray-300 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Additional Impact Information */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6 text-center">Making a Difference</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-bold text-white mb-4">Student Development</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      Enhanced leadership skills through event organizing opportunities
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      Improved networking and professional connections
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      Developed project management and teamwork capabilities
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      Increased cultural awareness and diversity appreciation
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-4">Community Impact</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      Stronger industry-academia partnerships
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      Enhanced SLIIT brand recognition and reputation
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      Contributions to local community development
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      Environmental sustainability initiatives
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-300">
              Have questions, suggestions, or want to collaborate? We'd love to hear from you!
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Email Us</h3>
              <p className="text-gray-300">info@eventhub.lk</p>
              <p className="text-gray-300">support@eventhub.lk</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Call Us</h3>
              <p className="text-gray-300">+94 11 754 4800</p>
              <p className="text-gray-300">+94 77 123 4567</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Visit Us</h3>
              <p className="text-gray-300">Student Affairs Office</p>
              <p className="text-gray-300">SLIIT Campus, Malabe</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />

    </div>
  );
};

export default About;