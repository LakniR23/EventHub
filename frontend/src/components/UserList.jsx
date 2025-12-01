import React, { useEffect, useState } from 'react';
import { getUsers, updateUser, deleteUser } from '../services/userServices';

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const usersData = await getUsers();
            setUsers(usersData);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id) => {
        try {
            const updatedUser = await updateUser(id, {
                name: 'Updated Name',
                email: 'updated@example.com',
                password: 'newpassword'
            });
            console.log('Updated user:', updatedUser);
            // Refresh the user list after successful update
            await fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
            setError(error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteUser(id);
            console.log('Deleted user with id:', id);
            // Update the state by filtering out the deleted user
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
            setError(error.message);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '20px' }}>
                <h2>User List</h2>
                <p>Loading users...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px' }}>
                <h2>User List</h2>
                <p style={{ color: 'red' }}>Error: {error}</p>
                <button onClick={fetchUsers}>Retry</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>User List</h2>
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {users.map(user => (
                        <li key={user.id} style={{ 
                            marginBottom: '10px', 
                            padding: '10px', 
                            border: '1px solid #ccc', 
                            borderRadius: '5px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <strong>{user.name}</strong> - {user.email}
                            </div>
                            <div>
                                <button 
                                    onClick={() => handleUpdate(user.id)}
                                    style={{ marginRight: '10px', padding: '5px 10px' }}
                                >
                                    Update
                                </button>
                                <button 
                                    onClick={() => handleDelete(user.id)}
                                    style={{ padding: '5px 10px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '3px' }}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default UserList;