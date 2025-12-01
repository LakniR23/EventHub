import React from 'react';

const AnalyticsTab = ({ events, categories }) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-sm border border-gray-700">
      <h3 className="text-lg font-medium text-white mb-4">Event Analytics</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-300">Total Events</div>
              <div className="text-2xl font-bold text-white">{events.length}</div>
            </div>
            <div className="text-yellow-400 bg-yellow-900/10 rounded-full p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14"/></svg>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-300">Active Events</div>
              <div className="text-2xl font-bold text-white">{events.filter(e => e.status === 'Active').length}</div>
            </div>
            <div className="text-green-400 bg-green-900/5 rounded-full p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4"/></svg>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-300">Avg Registrations</div>
              <div className="text-2xl font-bold text-white">{Math.round(events.reduce((sum, event) => sum + (event.registeredCount || 0), 0) / (events.length || 1))}</div>
            </div>
            <div className="text-purple-400 bg-purple-900/5 rounded-full p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18"/></svg>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-300">Most Popular</div>
              <div className="text-lg font-semibold text-white max-w-xs truncate">{events.slice().sort((a,b)=>b.registeredCount - a.registeredCount)[0]?.title || '-'}</div>
            </div>
            <div className="text-yellow-300 bg-yellow-900/5 rounded-full p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3-.895-3-2 1.343-2 3-2z"/></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Events by Category</h4>
        <div className="space-y-3">
          {categories.slice(1, 9).map(cat => {
            const count = events.filter(e => e.category === cat.value || e.category === cat.label).length;
            const pct = events.length ? Math.round((count / events.length) * 100) : 0;
            return (
              <div key={cat.value} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-300 w-48 truncate">{cat.label}</span>
                  <span className="text-sm text-gray-400">{count}</span>
                </div>
                <div className="flex-1 ml-4">
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div style={{width: `${pct}%`}} className="h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
                <div className="w-12 text-right text-sm text-gray-400 ml-4">{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
