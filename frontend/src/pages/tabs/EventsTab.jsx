import React from 'react';
import SearchInput from '../../components/SearchInput';

// Restricted category list as requested by the user
const RESTRICTED_CATEGORIES = [
  { value: 'CULTURAL', label: 'Cultural' },
  { value: 'CONCERTS', label: 'Concerts' },
  { value: 'MUSICAL', label: 'Musical' },
  { value: 'THEATRE_DRAMA', label: 'Theatre/Drama' },
  { value: 'DANCE_PERFORMANCES', label: 'Dance Performances' },
  { value: 'ART_EXHIBITIONS', label: 'Art Exhibitions' },
  { value: 'FILM_SCREENINGS', label: 'Film Screenings' },
  { value: 'COMEDY_SHOWS', label: 'Comedy Shows' },
  { value: 'FESTIVALS', label: 'Festivals' },
  { value: 'CHARITY_DEDICATION', label: 'Charity/Dedication Campaigns' },
  { value: 'DONATION_DRIVES', label: 'Donation Drives' },
  { value: 'COMMUNITY_GATHERINGS', label: 'Community Gatherings' },
  { value: 'CULTURAL_FAIRS', label: 'Cultural Fairs' },
  { value: 'OPEN_MIC_NIGHTS', label: 'Open Mic Nights' },
  { value: 'TALENT_SHOWS', label: 'Talent Shows' },
  { value: 'BOOK_READINGS', label: 'Book Readings/Signings' },
  { value: 'FOOD_FESTIVALS', label: 'Food Festivals' },
  { value: 'FASHION_SHOWS', label: 'Fashion Shows' },
  { value: 'FUNDRAISING_EVENTS', label: 'Fundraising Events' },
  { value: 'WORKSHOPS_CREATIVE', label: 'Workshops (Creative, Art, Music)' },
  { value: 'SPORTS_EVENTS', label: 'Sports Events (Friendly Matches, Tournaments)' }
];

const EventsTab = ({
  searchQuery,
  setSearchQuery,
  eventFilterBy,
  setEventFilterBy,
  eventFilterCategory,
  setEventFilterCategory,
  eventFilterFaculty,
  setEventFilterFaculty,
  eventFilterDateFrom,
  setEventFilterDateFrom,
  eventFilterDateTo,
  setEventFilterDateTo,
  resetEventFilters,
  setShowAddModal,
  loading,
  error,
  filteredEvents,
  categories,
  formatSentenceCase,
  getStatusColor,
  startEditEvent,
  handleDeleteEvent,
  fetchEvents,
}) => {
  return (
    <div>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg shadow-sm border border-gray-700 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div>
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
              />
            </div>

            <select value={eventFilterBy} onChange={(e) => setEventFilterBy(e.target.value)} className="px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-sm text-gray-200">
              <option value="none">Filter by</option>
              <option value="category">Category</option>
              <option value="faculty">Faculty</option>
              <option value="date">Date</option>
            </select>

            {eventFilterBy === 'category' && (
              <select value={eventFilterCategory} onChange={(e) => setEventFilterCategory(e.target.value)} className="px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-sm text-gray-200">
                <option value="all">All Categories</option>
                {RESTRICTED_CATEGORIES.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            )}

            {eventFilterBy === 'faculty' && (
              <select value={eventFilterFaculty} onChange={(e) => setEventFilterFaculty(e.target.value)} className="px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-sm text-gray-200">
                <option value="all">All Faculties</option>
                {/* parent app should pass `faculties` options if needed */}
              </select>
            )}

            {eventFilterBy === 'date' && (
              <>
                <input type="date" value={eventFilterDateFrom} onChange={(e) => setEventFilterDateFrom(e.target.value)} className="px-3 py-3 border border-gray-700 rounded-lg bg-gray-800 text-sm text-gray-200" />
                <input type="date" value={eventFilterDateTo} onChange={(e) => setEventFilterDateTo(e.target.value)} className="px-3 py-3 border border-gray-700 rounded-lg bg-gray-800 text-sm text-gray-200" />
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span onClick={resetEventFilters} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') resetEventFilters(); }} className="text-sm text-gray-400 hover:text-yellow-400 cursor-pointer">Clear Filters</span>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Event
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Registrations</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
                      <span className="text-gray-300">Loading events...</span>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="text-red-400">
                      <p className="font-medium">Error Loading Events</p>
                      <p className="text-sm mt-1">{error}</p>
                      <button
                        onClick={fetchEvents}
                        className="mt-3 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg hover:from-yellow-400 hover:to-yellow-500"
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && !error && filteredEvents.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-300">
                    No events found. Click "Add Event" to create your first event.
                  </td>
                </tr>
              )}

              {!loading && !error && filteredEvents.length > 0 && (
                filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-white">{event.title}</div>
                          <div className="text-sm text-gray-300">{event.organizer}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-100">{new Date(event.date).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-300">{event.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {formatSentenceCase(categories.find(c => c.value === event.category)?.label || event.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                      {event.registeredCount} / {event.maxParticipants}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => startEditEvent(event)}
                          className="text-yellow-400 hover:text-yellow-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id, event.title)}
                          className="text-red-500 hover:text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventsTab;
