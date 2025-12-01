import React from 'react';
import SearchInput from '../../components/SearchInput';

const VenuesTab = ({
  venueSearch,
  setVenueSearch,
  venueFilterBy,
  setVenueFilterBy,
  venueFilterCategory,
  setVenueFilterCategory,
  venueFilterStatus,
  setVenueFilterStatus,
  resetVenueFilters,
  setShowAddVenueModal,
  venuesLoading,
  venuesError,
  venues,
  categories,
  formatSentenceCase,
  startEditVenue,
  handleDeleteVenue,
  showAddVenueModal,
  showEditVenueModal,
  editingVenue,
  handleAddVenue,
  handleEditVenue
}) => {
  return (
    <div>
      <div className="border border-gray-700 rounded-lg p-4 mb-6 bg-gradient-to-br from-gray-800 to-gray-900 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div>
              <SearchInput
                value={venueSearch}
                onChange={(e) => setVenueSearch(e.target.value)}
                placeholder="Search venues..."
              />
            </div>

            <select value={venueFilterBy} onChange={(e) => setVenueFilterBy(e.target.value)} className="px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-sm text-gray-200">
              <option value="none">Filter by</option>
              <option value="category">Category</option>
              <option value="status">Status</option>
            </select>

            {venueFilterBy === 'category' && (
              <select value={venueFilterCategory} onChange={(e) => setVenueFilterCategory(e.target.value)} className="px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-sm text-gray-200">
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            )}

            {venueFilterBy === 'status' && (
              <select value={venueFilterStatus} onChange={(e) => setVenueFilterStatus(e.target.value)} className="px-4 py-3 border border-gray-200 rounded-lg bg-white text-sm">
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span onClick={resetVenueFilters} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') resetVenueFilters(); }} className="text-sm text-gray-400 hover:text-yellow-400 cursor-pointer">Clear Filters</span>
            <button onClick={() => setShowAddVenueModal(true)} className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black px-4 py-2 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Venue
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
        <div className="w-full">
          <table className="w-full table-fixed divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th style={{ width: '30%' }} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th style={{ width: '12%' }} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                <th style={{ width: '10%' }} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Capacity</th>
                <th style={{ width: '22%' }} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Location</th>
                <th style={{ width: '10%' }} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th style={{ width: '16%' }} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {venuesLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-300">Loading venues...</td>
                </tr>
              ) : venuesError ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-red-500">{venuesError}</td>
                </tr>
              ) : (() => {
                const filteredVenues = venues.filter(v => {
                  if (venueSearch && venueSearch.trim() !== '') {
                    const s = venueSearch.trim().toLowerCase();
                    const inName = (v.name || '').toString().toLowerCase().includes(s);
                    const inDesc = (v.description || '').toString().toLowerCase().includes(s);
                    const inLocation = (v.location || '').toString().toLowerCase().includes(s);
                    if (!inName && !inDesc && !inLocation) return false;
                  }
                  if (venueFilterBy === 'category' && venueFilterCategory !== 'all') {
                    if (String(v.category) !== String(venueFilterCategory) && String(v.category) !== String(categories.find(c => c.value === venueFilterCategory)?.label)) return false;
                  }
                  if (venueFilterBy === 'status' && venueFilterStatus !== 'all') {
                    const status = v.isActive ? 'Active' : 'Inactive';
                    if (status !== venueFilterStatus) return false;
                  }
                  return true;
                });

                if (filteredVenues.length === 0) {
                  return (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-300">No venues found.</td>
                    </tr>
                  );
                }

                return filteredVenues.map(venue => (
                  <tr key={venue.id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 align-top">
                      <div className="text-sm font-medium text-white">{venue.name}</div>
                      <div className="text-sm text-gray-300 mt-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>{venue.description}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 align-top">{formatSentenceCase(venue.category)}</td>
                    <td className="px-6 py-4 text-sm text-gray-300 align-top">{venue.capacity || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-300 align-top" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{venue.location}</td>
                    <td className="px-6 py-4 text-sm text-gray-300 align-top">{venue.isActive ? 'Active' : 'Inactive'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => startEditVenue(venue)} className="text-yellow-400 hover:text-yellow-300">Edit</button>
                        <button onClick={() => handleDeleteVenue(venue.id, venue.name)} className="text-red-500 hover:text-red-400">Delete</button>
                      </div>
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {showAddVenueModal && (
        <div />
      )}

      {showEditVenueModal && (
        <div />
      )}
    </div>
  );
};

export default VenuesTab;
