import React from 'react';

const SettingsTab = ({
  defaultEventCapacity,
  setDefaultEventCapacity,
  registrationDeadlineDays,
  setRegistrationDeadlineDays,
  saveSettings,
  isSavingSettings
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-sm border border-gray-700">
      <h3 className="text-lg font-medium text-white mb-4">System Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Default Event Capacity</label>
          <input
            type="number"
            value={defaultEventCapacity}
            onChange={(e) => setDefaultEventCapacity(Number(e.target.value) || 0)}
            className="px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Registration Deadline (days before event)</label>
          <input
            type="number"
            value={registrationDeadlineDays}
            onChange={(e) => setRegistrationDeadlineDays(Number(e.target.value) || 0)}
            className="px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={saveSettings}
          disabled={isSavingSettings}
          className={`bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black px-4 py-2 rounded-lg font-medium ${isSavingSettings ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSavingSettings ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default SettingsTab;
