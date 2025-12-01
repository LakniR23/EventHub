import React from 'react';
import SearchInput from '../../components/SearchInput';
import CareerForm from '../../components/forms/CareerForm';

const CareerTab = ({
  careers,
  careersLoading,
  careersError,
  startEditCareer,
  handleDeleteCareer,
  setShowAddCareerModal,
  setShowEditCareerModal,
  showAddCareerModal,
  showEditCareerModal,
  editingCareer,
  handleAddCareer,
  handleEditCareer,
  searchQuery,
  setSearchQuery,
  careerFilterBy,
  setCareerFilterBy,
  careerFilterType,
  setCareerFilterType,
  careerFilterDateFrom,
  setCareerFilterDateFrom,
  careerFilterDateTo,
  setCareerFilterDateTo,
  resetCareerFilters,
  formatSentenceCase
}) => {
  return (
    <div className="space-y-6">
      <div className="border border-gray-700 rounded-lg p-4 mb-6 bg-gradient-to-br from-gray-800 to-gray-900 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div>
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search careers..."
              />
            </div>

            <select value={careerFilterBy} onChange={(e) => setCareerFilterBy(e.target.value)} className="px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-sm text-gray-200">
              <option value="none">Filter by</option>
              <option value="type">Type</option>
              <option value="date">Date</option>
            </select>

            {careerFilterBy === 'type' && (
              <select value={careerFilterType} onChange={(e) => setCareerFilterType(e.target.value)} className="px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-sm text-gray-200">
                <option value="all">All Types</option>
                {Array.from(new Set((careers || []).map(c => c.type).filter(Boolean))).map(t => (
                  <option key={t} value={t}>{formatSentenceCase(t)}</option>
                ))}
              </select>
            )}

            {careerFilterBy === 'date' && (
              <>
                <input type="date" value={careerFilterDateFrom} onChange={(e) => setCareerFilterDateFrom(e.target.value)} className="px-3 py-3 border border-gray-700 rounded-lg bg-gray-800 text-sm text-gray-200" />
                <input type="date" value={careerFilterDateTo} onChange={(e) => setCareerFilterDateTo(e.target.value)} className="px-3 py-3 border border-gray-700 rounded-lg bg-gray-800 text-sm text-gray-200" />
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span onClick={resetCareerFilters} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') resetCareerFilters(); }} className="text-sm text-gray-400 hover:text-yellow-400 cursor-pointer">Clear Filters</span>
            <button onClick={() => setShowAddCareerModal(true)} className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black px-4 py-2 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Career
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">All Career Events</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {careersLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-300">Loading careers...</td>
                </tr>
              ) : careersError ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-red-500">{careersError}</td>
                </tr>
              ) : !Array.isArray(careers) || careers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-300">No career entries found.</td>
                </tr>
              ) : (
                (() => {
                  const filtered = (careers || []).filter(c => {
                    if (searchQuery && String(searchQuery).trim() !== '') {
                      const s = String(searchQuery).trim().toLowerCase();
                      const inTitle = (c.title || '').toString().toLowerCase().includes(s);
                      const inDesc = (c.description || '').toString().toLowerCase().includes(s);
                      if (!inTitle && !inDesc) return false;
                    }
                    if (careerFilterBy === 'type') {
                      if (careerFilterType !== 'all') {
                        if (String(c.type) !== String(careerFilterType)) return false;
                      }
                    }
                    if (careerFilterBy === 'date') {
                      if (careerFilterDateFrom) {
                        const from = new Date(careerFilterDateFrom);
                        const cd = c.date ? new Date(c.date) : null;
                        if (!cd || cd < from) return false;
                      }
                      if (careerFilterDateTo) {
                        const to = new Date(careerFilterDateTo);
                        const cd = c.date ? new Date(c.date) : null;
                        if (!cd || cd > to) return false;
                      }
                    }
                    return true;
                  });

                  if (filtered.length === 0) {
                    return (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-300">No career entries found for the selected filters.</td>
                      </tr>
                    );
                  }

                  return filtered.map(career => (
                    <tr key={career.id} className="hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{career.title}</div>
                        <div className="text-sm text-gray-300 truncate max-w-xs">{career.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{career.company || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{career.date ? new Date(career.date).toLocaleDateString() : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{career.type ? formatSentenceCase(career.type) : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button onClick={() => startEditCareer(career)} className="text-yellow-400 hover:text-yellow-300">Edit</button>
                          <button onClick={() => handleDeleteCareer(career.id, career.title)} className="text-red-500 hover:text-red-400">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ));
                })()
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddCareerModal && (
        <CareerForm isOpen={showAddCareerModal} onClose={() => setShowAddCareerModal(false)} onSubmit={handleAddCareer} mode="add" />
      )}

      {showEditCareerModal && (
        <CareerForm isOpen={showEditCareerModal} onClose={() => setShowEditCareerModal(false)} onSubmit={handleEditCareer} initialData={editingCareer} mode="edit" />
      )}
    </div>
  );
};

export default CareerTab;
