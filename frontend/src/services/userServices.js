const API_BASE_URL = 'http://localhost:5000/api';

// Generic API call function with better error handling
const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

export const getUsers = async() => {
    try {
        const response = await apiCall('/users');
        return Array.isArray(response) ? response : (response.data || []);
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
    }
};

export const createUser = async(userData) => {
    try {
        // Validate required fields
        if (!userData.name || !userData.email || !userData.password) {
            throw new Error('Name, email, and password are required');
        }

        const response = await apiCall('/users', {
            method: 'POST',
            body:JSON.stringify(userData),
        });
        
        return response.data || response;
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error(error.message || 'Failed to create user');
    }
};

export const getUserById = async(id) => {
    try {
        const response = await apiCall(`/users/${id}`);
        return response.data || response;
    } catch (error) {
        console.error(`Error fetching user ${id}:`, error);
        throw new Error('User not found');
    }
};

export const updateUser = async(id, userData) => {
    try {
        const response = await apiCall(`/users/${id}`, {
            method:'PUT',
            body:JSON.stringify(userData),
        });
        
        return response.data || response;
    } catch (error) {
        console.error(`Error updating user ${id}:`, error);
        throw new Error('Failed to update user');
    }
};

export const deleteUser = async(id) => {
    try {
        const response = await apiCall(`/users/${id}`, {
            method:'DELETE',
        });
        
        return response;
    } catch (error) {
        console.error(`Error deleting user ${id}:`, error);
        throw new Error('Failed to delete user');
    }
};

export const adminLogin = async(credentials) => {
    try {
        if (!credentials.email || !credentials.password) {
            throw new Error('Email and password are required');
        }

        const response = await apiCall('/admin/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        
        return response;
    } catch (error) {
        console.error('Login error:', error);
        throw new Error(error.message || 'Login failed');
    }
};

// Additional user utility functions
export const validateUserData = (userData) => {
    const errors = {};
    
    if (!userData.name || userData.name.trim() === '') {
        errors.name = 'Name is required';
    } else if (userData.name.length < 2) {
        errors.name = 'Name must be at least 2 characters';
    }
    
    if (!userData.email || userData.email.trim() === '') {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    if (!userData.password || userData.password.trim() === '') {
        errors.password = 'Password is required';
    } else if (userData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const searchUsers = async(query) => {
    try {
        const users = await getUsers();
        const searchTerm = query.toLowerCase();
        
        return users.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
    } catch (error) {
        console.error('Error searching users:', error);
        throw new Error('Failed to search users');
    }
};

export default {
    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    adminLogin,
    validateUserData,
    searchUsers
};