import React from 'react';
import SearchInput from '../../components/SearchInput';

const UsersTab = ({
  userSearchQuery,
  setUserSearchQuery,
  setShowAddUserModal,
  usersLoading,
  usersError,
  filteredUsers,
  startEditUser,
  handleDeleteUser
}) => {
  return (
    <div>
      <div className="border border-gray-700 rounded-lg p-4 mb-6 bg-gradient-to-br from-gray-800 to-gray-900 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div>
              <SearchInput
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="Search users by name or email..."
              />
            </div>
          </div>

          <div>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add User
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {usersLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="text-gray-300">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : usersError ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">
                    <div className="text-red-500">
                      <p className="font-medium">Error Loading Users</p>
                      <p className="text-sm mt-1">{usersError}</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-300">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-white">{user.name}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-300">{user.email}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => startEditUser(user)} className="text-yellow-400 hover:text-yellow-300">Edit</button>
                      <button onClick={() => handleDeleteUser(user.id, user.name)} className="text-red-500 hover:text-red-400">Delete</button>
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

export default UsersTab;
