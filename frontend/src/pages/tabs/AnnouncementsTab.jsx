import React from 'react';
import SearchInput from '../../components/SearchInput';

const AnnouncementsTab = ({
  annSearch,
  setAnnSearch,
  annFilterBy,
  setAnnFilterBy,
  annFilterType,
  setAnnFilterType,
  annFilterPriority,
  setAnnFilterPriority,
  annFilterFaculty,
  setAnnFilterFaculty,
  annFilterDateFrom,
  setAnnFilterDateFrom,
  annFilterDateTo,
  setAnnFilterDateTo,
  resetAnnouncementFilters,
  setShowAddAnnouncementModal,
  announcements,
  announcementsLoading,
  announcementsError,
  startEditAnnouncement,
  handleDeleteAnnouncement,
  formatSentenceCase,
  faculties
}) => {
  return (
    <div className="space-y-6">
      <div className="border border-gray-700 rounded-lg p-4 mb-6 bg-gradient-to-br from-gray-800 to-gray-900 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div>
              <SearchInput
                value={annSearch}
                onChange={(e) => setAnnSearch(e.target.value)}
                placeholder="Search announcements..."
              />
            </div>

            <select value={annFilterBy} onChange={(e) => setAnnFilterBy(e.target.value)} className="px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-sm text-gray-200">
              <option value="none">Filter by</option>
              <option value="type">Type</option>
              <option value="priority">Priority</option>
              <option value="faculty">Faculty</option>
              <option value="date">Date</option>
            </select>

            {annFilterBy === 'type' && (
              <select value={annFilterType} onChange={(e) => setAnnFilterType(e.target.value)} className="px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-sm text-gray-200">
                <option value="all">All Types</option>
                {Array.from(new Set(announcements.map(a => a.category || a.type || a.tag).filter(Boolean))).map(t => (
                  <option key={t} value={t}>{formatSentenceCase(t)}</option>
                ))}
              </select>
            )}

            {annFilterBy === 'priority' && (
              <select value={annFilterPriority} onChange={(e) => setAnnFilterPriority(e.target.value)} className="px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-sm text-gray-200">
                <option value="all">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            )}

            {annFilterBy === 'faculty' && (
              <select value={annFilterFaculty} onChange={(e) => setAnnFilterFaculty(e.target.value)} className="px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-sm text-gray-200">
                <option value="all">All Faculties</option>
                {faculties.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            )}

            {annFilterBy === 'date' && (
              <>
                <input type="date" value={annFilterDateFrom} onChange={(e) => setAnnFilterDateFrom(e.target.value)} className="px-3 py-3 border border-gray-700 rounded-lg bg-gray-800 text-sm text-gray-200" />
                <input type="date" value={annFilterDateTo} onChange={(e) => setAnnFilterDateTo(e.target.value)} className="px-3 py-3 border border-gray-700 rounded-lg bg-gray-800 text-sm text-gray-200" />
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span onClick={resetAnnouncementFilters} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') resetAnnouncementFilters(); }} className="text-sm text-gray-400 hover:text-yellow-400 cursor-pointer">Clear Filters</span>
            <button onClick={() => setShowAddAnnouncementModal(true)} className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black px-4 py-2 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Announcement
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">All Announcements</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Faculty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {announcementsLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-300">Loading announcements...</td>
                </tr>
              ) : announcementsError ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-red-500">{announcementsError}</td>
                </tr>
              ) : !Array.isArray(announcements) ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-red-500">Unexpected data format for announcements.</td>
                </tr>
              ) : announcements.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-300">No announcements found.</td>
                </tr>
              ) : (
                (() => {
                  const filtered = announcements.filter(a => {
                    if (annSearch && annSearch.trim() !== '') {
                      const s = annSearch.trim().toLowerCase();
                      const inTitle = (a.title || '').toString().toLowerCase().includes(s);
                      const inDesc = (a.description || a.content || '').toString().toLowerCase().includes(s);
                      if (!inTitle && !inDesc) return false;
                    }
                    if (annFilterType !== 'all') {
                      const t = a.category || a.type || a.tag || '';
                      if (String(t) !== String(annFilterType)) return false;
                    }
                    if (annFilterPriority !== 'all') {
                      if (String(a.priority) !== String(annFilterPriority)) return false;
                    }
                    if (annFilterFaculty !== 'all') {
                      if (String(a.faculty) !== String(annFilterFaculty)) return false;
                    }
                    if (annFilterDateFrom) {
                      const from = new Date(annFilterDateFrom);
                      const ad = a.date ? new Date(a.date) : null;
                      if (!ad || ad < from) return false;
                    }
                    if (annFilterDateTo) {
                      const to = new Date(annFilterDateTo);
                      const ad = a.date ? new Date(a.date) : null;
                      if (!ad || ad > to) return false;
                    }
                    return true;
                  });

                  if (filtered.length === 0) {
                    return (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">No announcements found for the selected filters.</td>
                      </tr>
                    );
                  }

                  return filtered.map((announcement) => (
                    <tr key={announcement.id} className="hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-white">
                              {announcement.title}
                              {(announcement.priority === 'High' || announcement.tag === 'URGENT' || announcement.isUrgent) && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">URGENT</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-300 max-w-xs truncate">{announcement.description || announcement.content}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{formatSentenceCase(announcement.category || announcement.type || announcement.tag)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${announcement.priority === 'High' ? 'bg-red-100 text-red-800' : announcement.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{announcement.priority}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{announcement.faculty}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{announcement.date ? new Date(announcement.date).toLocaleDateString() : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{announcement.views}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button onClick={() => startEditAnnouncement(announcement)} className="text-yellow-400 hover:text-yellow-300">Edit</button>
                          <button onClick={() => handleDeleteAnnouncement(announcement.id, announcement.title)} className="text-red-500 hover:text-red-400">Delete</button>
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
    </div>
  );
};

export default AnnouncementsTab;
