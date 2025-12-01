import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getVenueById } from '../services/venueServices';

const VenueDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const normalizeVenue = (v) => ({
    id: v?.id ?? (id ? parseInt(id) : undefined),
    name: v?.name ?? 'Unknown Venue',
    category: v?.category ?? 'Venue',
    capacity: v?.capacity ?? 0,
    location: v?.location ?? '',
    description: v?.description ?? '',
    image: v?.image ?? '/images/venues/default-venue.jpg',
    // helper: if value is JSON string or array or comma/newline separated, return array
    facilities: (function(val){
      const parseFlexibleArray = (input) => {
        if (!input && input !== 0) return [];
        if (Array.isArray(input)) {
          // flatten elements that are JSON strings
          const flattened = [];
          input.forEach(el => {
            if (typeof el === 'string') {
              const s = el.trim();
              if (s.startsWith('[') || s.startsWith('{')) {
                try {
                  const p = JSON.parse(s);
                  if (Array.isArray(p)) flattened.push(...p);
                  else if (typeof p === 'string') flattened.push(p);
                } catch (e) {
                  flattened.push(s);
                }
              } else if (/^".*"$/.test(s)) {
                try { flattened.push(JSON.parse(s)); } catch(e) { flattened.push(s.replace(/^"|"$/g,'')); }
              } else {
                flattened.push(s);
              }
            } else {
              flattened.push(el);
            }
          });
          return flattened.filter(Boolean);
        }
        if (typeof input === 'string') {
          const s = input.trim();
          try {
            if (s.startsWith('[') || s.startsWith('{')) {
              const parsed = JSON.parse(s);
              return Array.isArray(parsed) ? parsed : [];
            }
          } catch (e) {}
          return s.split(/\r?\n|,/).map(x => x.trim()).filter(Boolean);
        }
        return [];
      };
      return parseFlexibleArray(v?.facilities);
    })(v?.facilities),
    availability: (v?.availability || 'UNKNOWN'),
    bookingContact: v?.bookingContact ?? v?.booking_contact ?? '',
    directions: (function(src){
      // support either nested directions object or flat fields
      const fromMain = src?.directionsFromMainGate ?? src?.fromMainGate ?? src?.directions?.fromMainGate ?? '';
      const fromParking = src?.directionsFromParking ?? src?.fromParking ?? src?.directions?.fromParking ?? '';
      const landmarksRaw = src?.directions?.landmarks ?? src?.landmarks ?? src?.landmarksList ?? src?.landmarksRaw ?? '';
      let landmarks = [];
      if (Array.isArray(landmarksRaw)) landmarks = landmarksRaw;
      else if (typeof landmarksRaw === 'string') {
        try { if (landmarksRaw.trim().startsWith('[')) landmarks = JSON.parse(landmarksRaw); else landmarks = landmarksRaw.split(/\r?\n|,/).map(s=>s.trim()).filter(Boolean); } catch(e){ landmarks = landmarksRaw.split(/\r?\n|,/).map(s=>s.trim()).filter(Boolean); }
      }
      return { fromMainGate: fromMain, fromParking: fromParking, landmarks };
    })(v),
    nearbyFacilities: (function(val){
      const parseFlexibleArray = (input) => {
        if (!input && input !== 0) return [];
        if (Array.isArray(input)) {
          const out = [];
          input.forEach(el => {
            if (typeof el === 'string') {
              try {
                if (el.trim().startsWith('[') || el.trim().startsWith('{')) {
                  const p = JSON.parse(el);
                  if (Array.isArray(p)) out.push(...p);
                  else out.push(p);
                } else out.push(el.trim());
              } catch(e) { out.push(el.trim()); }
            } else out.push(el);
          });
          return out.filter(Boolean);
        }
        if (typeof input === 'string') {
          const s = input.trim();
          try { if (s.startsWith('[') || s.startsWith('{')) return JSON.parse(s); } catch(e) {}
          return s.split(/\r?\n|,/).map(x=>x.trim()).filter(Boolean);
        }
        return [];
      };
      return parseFlexibleArray(v?.nearbyFacilities);
    })(v?.nearbyFacilities),
    events: (function(val){
      const parseFlexibleArray = (input) => {
        if (!input && input !== 0) return [];
        if (Array.isArray(input)) {
          const out = [];
          input.forEach(el => {
            if (typeof el === 'string') {
              try { if (el.trim().startsWith('[') || el.trim().startsWith('{')) { const p = JSON.parse(el); if (Array.isArray(p)) out.push(...p); else out.push(p); } else out.push(el.trim()); } catch(e) { out.push(el.trim()); }
            } else out.push(el);
          });
          return out.filter(Boolean);
        }
        if (typeof input === 'string') {
          const s = input.trim();
          try { if (s.startsWith('[') || s.startsWith('{')) return JSON.parse(s); } catch(e) {}
          return s.split(/\r?\n|,/).map(x=>x.trim()).filter(Boolean);
        }
        return [];
      };
      return parseFlexibleArray(v?.suitableEvents || v?.events);
    })(v?.suitableEvents || v?.events),
    accessibilityFeatures: (function(val){
      const parseFlexibleArray = (input) => {
        if (!input && input !== 0) return [];
        if (Array.isArray(input)) {
          const out = [];
          input.forEach(el => {
            if (typeof el === 'string') {
              try { if (el.trim().startsWith('[') || el.trim().startsWith('{')) { const p = JSON.parse(el); if (Array.isArray(p)) out.push(...p); else out.push(p); } else out.push(el.trim()); } catch(e) { out.push(el.trim()); }
            } else out.push(el);
          });
          return out.filter(Boolean);
        }
        if (typeof input === 'string') {
          const s = input.trim();
          try { if (s.startsWith('[') || s.startsWith('{')) return JSON.parse(s); } catch(e) {}
          return s.split(/\r?\n|,/).map(x=>x.trim()).filter(Boolean);
        }
        return [];
      };
      return parseFlexibleArray(v?.accessibilityFeatures);
    })(v?.accessibilityFeatures),
    hourlyRate: (function(){ const r = v?.hourlyRate ?? v?.hourly_rate; if (r===null || r===undefined || r==='') return null; const n = Number(r); return Number.isFinite(n) ? n : null })(),
    dailyRate: (function(){ const r = v?.dailyRate ?? v?.daily_rate; if (r===null || r===undefined || r==='') return null; const n = Number(r); return Number.isFinite(n) ? n : null })(),
    floor: v?.floor ?? null,
    building: v?.building ?? null,
    roomNumber: v?.roomNumber ?? v?.room_number ?? null,
    bookingInstructions: v?.bookingInstructions ?? v?.booking_instructions ?? '',
    specialRequirements: v?.specialRequirements ?? v?.special_requirements ?? '',
    technicalSpecs: (function(ts){
      if (!ts) return {};
      if (typeof ts === 'object') return ts;
      if (typeof ts === 'string') {
        try { if (ts.trim().startsWith('{') || ts.trim().startsWith('[')) return JSON.parse(ts); } catch(e) {}
        // parse key:value per line
        const obj = {};
        ts.split(/\r?\n/).map(l=>l.trim()).filter(Boolean).forEach(line => {
          const idx = line.indexOf(':');
          if (idx > 0) {
            const key = line.slice(0, idx).trim();
            const val = line.slice(idx+1).trim();
            obj[key] = val;
          }
        });
        return obj;
      }
      return {};
    })(v?.technicalSpecs ?? v?.technical_specs ?? v?.technicalSpecsRaw),
    contactPerson: v?.contactPerson ?? v?.contact_person ?? '',
    contactEmail: v?.contactEmail ?? v?.contact_email ?? '',
    contactPhone: v?.contactPhone ?? v?.contact_phone ?? ''
  });

  const formatSentenceCase = (value) => {
    if (!value && value !== 0) return '';
    try {
      const str = String(value).replace(/_/g, ' ').toLowerCase();
      return str.charAt(0).toUpperCase() + str.slice(1);
    } catch (err) {
      return String(value);
    }
  };

  const safeParseJson = (s) => {
    if (!s && s !== 0) return null;
    if (typeof s !== 'string') return null;
    try { return JSON.parse(s); } catch (e) { return null; }
  };

  const badgeLabel = (val) => {
    if (val === null || val === undefined) return '';
    if (Array.isArray(val)) return val.join(', ');
    if (typeof val === 'object') return Object.values(val).join(', ');
    if (typeof val === 'string') {
      const t = val.trim();
      if (t.startsWith('[') || t.startsWith('{')) {
        const parsed = safeParseJson(t);
        if (parsed) return Array.isArray(parsed) ? parsed.join(', ') : (typeof parsed === 'object' ? Object.values(parsed).join(', ') : String(parsed));
      }
      // also handle quoted string like '"aaa"'
      if (/^".*"$/.test(t)) {
        try { return JSON.parse(t); } catch(e) { return t.replace(/^"|"$/g,''); }
      }
      return t;
    }
    return String(val);
  };

  useEffect(() => {
    let didSet = false;

    const tryLoad = async () => {
      // If we have a route id try to fetch full object from API (preferred)
      if (id) {
        try {
          const full = await getVenueById(id);
          if (full) {
            setVenue(normalizeVenue(full));
            didSet = true;
            return;
          }
        } catch (err) {
          // network error or not found - we'll fall back to location.state below
          console.warn('Failed to fetch venue by id, falling back to route state:', err?.message || err);
        }
      }

      if (location && location.state && location.state.venue) {
        setVenue(normalizeVenue(location.state.venue));
        didSet = true;
        return;
      }
    };

    tryLoad();

    const SAMPLE_VENUES_FALLBACK = [
      {
        id: 1,
        name: 'Main Auditorium',
        category: 'Auditorium',
        capacity: 800,
        location: 'Ground Floor, Main Building',
        description: 'The largest auditorium in SLIIT, perfect for major events, convocations, guest lectures, and large-scale presentations.',
        image: '/images/venues/main-auditorium.jpg',
        facilities: ['Air Conditioning','Audio System','Video Projection']
      },
      {
        id: 2,
        name: 'Lecture Hall Complex - LH 01',
        category: 'Lecture Hall',
        capacity: 200,
        location: '1st Floor, Academic Block A',
        description: 'Modern lecture hall with tiered seating and advanced presentation facilities.',
        image: '/images/venues/lecture-hall-01.jpg',
        facilities: ['Air Conditioning','Interactive Whiteboard']
      }
    ];

    // If nothing set after a short delay, use fallback sample (only for dev/demo)
    setTimeout(() => {
      if (!didSet) {
        const parsedId = parseInt(id);
        const found = SAMPLE_VENUES_FALLBACK.find(v => v.id === parsedId);
        if (found) setVenue(normalizeVenue(found));
      }
    }, 350);
  }, [id, location]);

  if (!venue) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-yellow-500 mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-white mb-2">Venue Not Found</h2>
          <p className="text-gray-400 mb-6">The venue you're looking for doesn't exist or could not be loaded.</p>
          <button
            onClick={() => navigate('/venues')}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200"
          >
            Back to Venues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header (matching Venues page) */}
      <header className="bg-black shadow-lg sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="shrink-0 cursor-pointer" onClick={() => navigate('/') }>
              <h1 className="text-2xl font-bold text-yellow-500">EventHub</h1>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button onClick={() => navigate('/')} className="text-yellow-500 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Home</button>
                <button onClick={() => navigate('/events')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Events</button>
                <button onClick={() => navigate('/clubs-and-societies')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Clubs & Societies</button>
                <button onClick={() => navigate('/career')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Career</button>
                <button onClick={() => navigate('/announcements')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Announcements</button>
                <button onClick={() => navigate('/venues')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-yellow-500">Venues</button>
                <button onClick={() => navigate('/about')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">About</button>
                <button onClick={() => navigate('/help')} className="text-yellow-500 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium hover:border-b-2 hover:border-yellow-500">Help</button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative h-96 overflow-hidden rounded-2xl shadow-lg">
          {venue.image && (
            <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" onError={(e)=>{e.target.onerror=null; e.target.src='/images/venues/default-venue.jpg'}} />
          )}
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="absolute top-6 left-6 z-20 flex items-center gap-4">
            <button onClick={() => navigate('/venues')} className="flex items-center gap-3 text-yellow-400 hover:text-yellow-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Venues</span>
            </button>

            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${String(venue.availability).toUpperCase() === 'AVAILABLE' ? 'bg-green-500 text-black' : 'bg-yellow-500 text-black'}`}>
              {String(venue.availability).toUpperCase() === 'AVAILABLE' ? 'Open for Booking' : 'Check Availability'}
            </span>
          </div>

          <div className="absolute left-8 bottom-10 z-20 text-white max-w-4xl">
            <h1 className="text-2xl md:text-4xl lg:text-7xl font-extrabold tracking-tight leading-tight">{venue.name}</h1>
            <p className="text-xl text-gray-300 mt-3 max-w-3xl">{venue.description || venue.location}</p>

            <div className="mt-6 flex items-center gap-8 text-yellow-400">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
                <span className="font-medium">{venue.capacity} capacity</span>
              </div>

              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM6 7h8v2H6V7z"/>
                </svg>
                <span className="font-medium">{formatSentenceCase(venue.category)}</span>
              </div>

              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                <span className="font-medium">{venue.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left - Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">Description</h2>
              <p className="text-gray-300 leading-relaxed">{venue.description}</p>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">Facilities & Equipment</h2>
              <div className="flex flex-wrap gap-2">
                {(venue.facilities || []).map((f,i)=> (
                  <span key={i} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">{badgeLabel(f)}</span>
                ))}
                {(venue.accessibilityFeatures || []).map((a,i) => (
                  <span key={`acc-${i}`} className="px-3 py-1 bg-indigo-800 text-indigo-200 rounded-full text-sm">{badgeLabel(a)}</span>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-2xl font-bold text-yellow-400">Directions & Location</h2>
                <button onClick={() => setShowDirections(!showDirections)} className="text-yellow-400 text-sm">{showDirections ? 'Hide' : 'Show'} Detailed Directions</button>
              </div>
              {showDirections && (
                <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                  <div>
                    <h4 className="text-yellow-400 font-medium mb-2">From Main Gate:</h4>
                    <p className="text-gray-300 text-sm">{venue.directions?.fromMainGate}</p>
                  </div>
                  <div>
                    <h4 className="text-yellow-400 font-medium mb-2">From Parking:</h4>
                    <p className="text-gray-300 text-sm">{venue.directions?.fromParking}</p>
                  </div>
                  <div>
                    <h4 className="text-yellow-400 font-medium mb-2">Landmarks:</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                        {(venue.directions?.landmarks || []).map((lm, idx) => (
                          <li key={idx} className="flex items-center gap-2">{badgeLabel(lm)}</li>
                        ))}
                      </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">Technical Specifications</h2>
              <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                {Object.entries(venue.technicalSpecs || {}).length === 0 ? (
                  <p className="text-gray-400">No technical specifications provided.</p>
                ) : (
                  Object.entries(venue.technicalSpecs || {}).map(([key, value]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-yellow-400 font-medium w-40 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-gray-300 text-sm">{value}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">Rates & Location</h2>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>Hourly Rate</span>
                  <span className="font-semibold text-white">{venue.hourlyRate != null ? `LKR ${venue.hourlyRate}` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Daily Rate</span>
                  <span className="font-semibold text-white">{venue.dailyRate != null ? `LKR ${venue.dailyRate}` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Building / Floor</span>
                  <span className="font-semibold text-white">{venue.building || '—'} / {venue.floor || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Room Number</span>
                  <span className="font-semibold text-white">{venue.roomNumber || '—'}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">Nearby Facilities & Suitable Events</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {(venue.nearbyFacilities || []).map((n, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-900/30 text-blue-400 border border-blue-500/30 rounded-full text-sm">{badgeLabel(n)}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {(venue.events || []).map((e, i) => (
                  <span key={i} className="px-3 py-1 bg-green-900/30 text-green-400 border border-green-500/30 rounded-full text-sm">{badgeLabel(e)}</span>
                ))}
              </div>
              {(venue.accessibilityFeatures || []).length > 0 && (
                <div className="mt-4">
                  <h4 className="text-yellow-400 font-medium mb-2">Accessibility</h4>
                  <div className="flex flex-wrap gap-2">{(venue.accessibilityFeatures || []).map((a,i) => <span key={i} className="px-3 py-1 bg-indigo-800 text-indigo-200 rounded-full text-sm">{badgeLabel(a)}</span>)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Right - Booking / Contact */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
                <h3 className="text-xl font-bold text-yellow-400 mb-2">Book This Venue</h3>
                <p className="text-gray-300 mb-4">Capacity: <span className="text-white font-semibold">{venue.capacity}</span></p>
                <p className="text-gray-300 mb-4">Availability: <span className={`font-semibold ${String(venue.availability).toUpperCase() === 'AVAILABLE' ? 'text-green-400' : 'text-yellow-400'}`}>{formatSentenceCase(venue.availability)}</span></p>
                <div className="mb-4 w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full" style={{ width: `${Math.min(100, (venue.capacity ?  (venue.capacity/1000) * 100 : 0))}%` }}></div>
                </div>
                <button
                  onClick={() => window.location.href = `mailto:${venue.bookingContact}?subject=Venue Booking Request - ${venue.name}`}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-3 rounded-xl font-bold hover:shadow-2xl transition-all duration-200"
                >
                  Request Booking
                </button>
                <button
                  onClick={() => window.location.href = `mailto:${venue.bookingContact}?subject=Venue Inquiry - ${venue.name}`}
                  className="w-full mt-3 bg-gray-700 text-white py-3 rounded-xl font-medium"
                >
                  Contact for Details
                </button>

                <div className="mt-6 pt-4 border-t border-gray-700 text-sm text-gray-300 space-y-2">
                  <p className="mb-1">Booking Contact:</p>
                  <p className="font-semibold text-white">{venue.bookingContact || 'Not provided'}</p>
                  {venue.contactPerson && <p className="text-gray-300">Person: <span className="font-semibold text-white">{venue.contactPerson}</span></p>}
                  {venue.contactEmail && <p className="text-gray-300">Email: <span className="font-semibold text-white">{venue.contactEmail}</span></p>}
                  {venue.contactPhone && <p className="text-gray-300">Phone: <span className="font-semibold text-white">{venue.contactPhone}</span></p>}
                  {venue.bookingInstructions && <div className="mt-2 text-gray-300"><h5 className="text-yellow-400 font-medium">Booking Instructions</h5><p className="text-sm">{venue.bookingInstructions}</p></div>}
                  {venue.specialRequirements && <div className="mt-2 text-gray-300"><h5 className="text-yellow-400 font-medium">Special Requirements</h5><p className="text-sm">{venue.specialRequirements}</p></div>}
                </div>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                <h4 className="text-lg font-bold text-white mb-3">Quick Info</h4>
                <div className="space-y-3 text-gray-300 text-sm">
                  <div className="flex justify-between">
                    <span>Category</span>
                    <span className="text-white">{formatSentenceCase(venue.category)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacity</span>
                    <span className="text-white">{venue.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location</span>
                    <span className="text-white">{venue.location}</span>
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

export default VenueDetails;
