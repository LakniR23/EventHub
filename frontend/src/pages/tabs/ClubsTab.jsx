import React from 'react';
import SearchInput from '../../components/SearchInput';

const ClubsTab = ({
  clubSearchQuery,
  setClubSearchQuery,
  clubFilterBy,
  setClubFilterBy,
  clubFilterCategory,
  setClubFilterCategory,
  clubFilterFaculty,
  setClubFilterFaculty,
  clubFilterStatus,
  setClubFilterStatus,
  clubFilterDateFrom,
  setClubFilterDateFrom,
  clubFilterDateTo,
  setClubFilterDateTo,
  resetClubFilters,
  setShowAddClubModal,
  clubsLoading,
  clubsError,
  filteredClubs,
  clubCategories,
  faculties,
  startEditClub,
  handleDeleteClub
}) => {
  return (
    <div>
      <div className="border border-gray-700 rounded-lg p-4 mb-6 bg-gradient-to-br from-gray-800 to-gray-900 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div>
              <SearchInput
                value={clubSearchQuery}
                onChange={(e) => setClubSearchQuery(e.target.value)}
                placeholder="Search clubs..."
              />
            </div>

            <select value={clubFilterBy} onChange={(e) => setClubFilterBy(e.target.value)} className="px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-sm text-gray-200">
              <option value="none">Filter by</option>
              <option value="category">Category</option>
              <option value="faculty">Faculty</option>
              <option value="status">Status</option>
              <option value="date">Date</option>
            </select>

            {clubFilterBy === 'category' && (
              <select value={clubFilterCategory} onChange={(e) => setClubFilterCategory(e.target.value)} className="px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-sm text-gray-200">
                <option value="all">All Categories</option>
                {clubCategories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            )}

            {clubFilterBy === 'faculty' && (
              <select value={clubFilterFaculty} onChange={(e) => setClubFilterFaculty(e.target.value)} className="px-4 py-3 border border-gray-200 rounded-lg bg-white text-sm">
                <option value="all">All Faculties</option>
                {faculties.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            )}

            {clubFilterBy === 'status' && (
              <select value={clubFilterStatus} onChange={(e) => setClubFilterStatus(e.target.value)} className="px-4 py-3 border border-gray-200 rounded-lg bg-white text-sm">
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            )}

            {clubFilterBy === 'date' && (
              <>
                <input type="date" value={clubFilterDateFrom} onChange={(e) => setClubFilterDateFrom(e.target.value)} className="px-3 py-3 border border-gray-200 rounded-lg bg-white text-sm" />
                <input type="date" value={clubFilterDateTo} onChange={(e) => setClubFilterDateTo(e.target.value)} className="px-3 py-3 border border-gray-200 rounded-lg bg-white text-sm" />
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span onClick={resetClubFilters} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') resetClubFilters(); }} className="text-sm text-gray-400 hover:text-yellow-400 cursor-pointer">Clear Filters</span>
            <button
              onClick={() => setShowAddClubModal(true)}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Club
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Club</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Faculty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Members</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {clubsLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="text-gray-500">Loading clubs...</span>
                    </div>
                  </td>
                </tr>
              ) : clubsError ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="text-red-500">
                      <p className="font-medium">Error Loading Clubs</p>
                      <p className="text-sm mt-1">{clubsError}</p>
                    </div>
                  </td>
                </tr>
              ) : filteredClubs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-300">
                    No clubs found. Click "Add Club" to create your first club.
                  </td>
                </tr>
              ) : (
                filteredClubs.map((club) => (
                <tr key={club.id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-white">{club.name}</div>
                        <div className="text-sm text-gray-300 max-w-xs truncate">{club.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {club.category || 'Not Specified'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {club.faculty || 'Not Specified'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {club.memberCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      club.status === 'Active' ? 'bg-green-100 text-green-800' :
                      club.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                      club.status === 'Suspended' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {club.status || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEditClub(club)}
                        className="text-yellow-400 hover:text-yellow-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClub(club.id, club.name)}
                        className="text-red-500 hover:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))) }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClubsTab;
