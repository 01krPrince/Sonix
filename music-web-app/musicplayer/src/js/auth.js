class Auth {
    constructor() {
        this.isLoggedIn = false;
        this.user = null;
        this.API_URL = 'https://sonix-s830.onrender.com';
        this.setupEventListeners();
        this.checkLoginStatus();
        this.updateUI();
    }

    // Set up event listeners for login, signup, and logout actions
    setupEventListeners() {
        const loginButton = document.getElementById('loginButton');
        const signupForm = document.getElementById('signupForm');
        const logoutBtn = document.getElementById('logoutBtn');

        if (loginButton) {
            loginButton.addEventListener('click', () => {
                this.login();
            });
        }

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.signup();
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    // Handle user login
    async login() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const messageDiv = document.getElementById('message');

        // Clear previous messages
        messageDiv.textContent = '';

        try {
            // Construct the URL with query parameters
            const url = `${this.API_URL}/api/users/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json' // This can be omitted since we're not sending a body
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Handle successful login
                this.setUserData({
                    id: data.id,
                    username: data.username,
                    email: data.email,
                    password: data.password, // Note: Storing passwords is not recommended
                    playlist: data.playlist
                });
                messageDiv.textContent = `Login successful! Welcome, ${data.username}.`;
                messageDiv.style.color = 'green';
                window.location.href = 'index.html'; // Redirect to the main page
            } else {
                const errorData = await response.text(); // Get the response body as text
                console.error('Error response:', errorData); // Log the error response
                messageDiv.textContent = 'Login failed. Please check your email and password.';
            }
        } catch (error) {
            console.error('Error:', error);
            messageDiv.textContent = 'An error occurred. Please try again later.';
        }
    }

    // Handle user signup
    async signup() {
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!username || !email || !password || !confirmPassword) {
            this.showError('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('Passwords do not match!');
            return;
        }

        const requestBody = { username, email, password, playlist: [] };

        try {
            const response = await fetch(`${this.API_URL}/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (response.ok) {
                this.setUserData(data);
                window.location.href = 'index.html';
            } else {
                this.showError(data.message || 'Failed to sign up.');
            }
        } catch (error) {
            console.error('Signup error:', error);
            this.showError('An error occurred while signing up. Please try again.');
        }
    }

    // Store user data in localStorage
    setUserData(data) {
        localStorage.setItem('token', data.id || ''); // Assuming the token is the user ID
        localStorage.setItem('user', JSON.stringify({
            username: data.username,
            email: data.email,
            password: data.password, // Note: Storing passwords is not recommended
            playlist: data.playlist
        }));
        localStorage.setItem('isLoggedIn', 'true');
    }

    // Display error messages
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-500 text-white p-3 rounded mb-4';
        errorDiv.textContent = message;

        const form = document.querySelector('form');
        form.insertBefore(errorDiv, form.firstChild);

        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    // Check and update login status
    checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const user = JSON.parse(localStorage.getItem('user'));

        this.isLoggedIn = isLoggedIn;
        this.user = user;

        if (!isLoggedIn &&
            !window.location.pathname.includes('login.html') &&
            !window.location.pathname.includes('signup.html')) {
            window.location.href = 'login.html';
        }

        this.updateUI();
    }

    // Update the UI based on login status
    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const profileBtn = document.getElementById('profileBtn');
        const shopBtn = document.getElementById('shopBtn');
        const logoutBtn = document.getElementById('logoutBtn');

        // Show all content sections regardless of login status
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('hidden');
        });

        // If any of the required buttons don't exist, return early
        if (!loginBtn || !signupBtn || !profileBtn || !logoutBtn || !shopBtn) return;

        // Update button visibility based on login status
        if (this.isLoggedIn && this.user) {
            loginBtn.classList.add('hidden');
            signupBtn.classList.add('hidden');
            profileBtn.classList.remove('hidden');
            shopBtn.classList.remove('hidden');
            logoutBtn.classList.remove('hidden');
        } else {
            loginBtn.classList.remove('hidden');
            signupBtn.classList.remove('hidden');
            profileBtn.classList.add('hidden');
            shopBtn.classList.add('hidden');
            logoutBtn.classList.add('hidden');
        }
    }

    // Handle user logout
    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token');
        this.isLoggedIn = false;
        this.user = null;
        window.location.href = 'login.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Auth();
});