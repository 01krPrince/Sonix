// Check if user is logged in
const checkAuth = () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        window.location.href = 'login.html';
    }
    return token;
};

// Fetch user profile data
const fetchUserProfile = async () => {
    const token = checkAuth();
    try {
        const response = await fetch('http://localhost:8080/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }
        const userData = await response.json();
        displayUserProfile(userData);
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
};

// Display user profile data
const displayUserProfile = (userData) => {
    document.getElementById('username').textContent = userData.username;
    document.getElementById('userEmail').textContent = userData.email;
};

// Handle logout
const handleLogout = () => {
    localStorage.removeItem('userToken');
    window.location.href = 'login.html';
};

// Update profile
const updateProfile = async (formData) => {
    const token = checkAuth();
    try {
        const response = await fetch('http://localhost:8080/api/users/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        const updatedData = await response.json();
        displayUserProfile(updatedData);
        alert('Profile updated successfully!');
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile');
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchUserProfile();
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Edit profile button
    const editProfileBtn = document.querySelector('button[data-action="edit-profile"]');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            // Implement edit profile modal or form
            const newUsername = prompt('Enter new username:');
            if (newUsername) {
                updateProfile({ username: newUsername });
            }
        });
    }
});