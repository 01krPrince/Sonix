class Auth {
    constructor() {
        this.checkAuthState();
        this.setupLogoutHandler();
    }

    checkAuthState() {
        const user = this.getCurrentUser();
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const profileBtn = document.getElementById('profileBtn');

        if (user) {
            // User is logged in
            loginBtn.classList.add('hidden');
            signupBtn.classList.add('hidden');
            profileBtn.classList.remove('hidden');
            
            // Set profile picture in nav bar
            const profilePic = profileBtn.querySelector('img');
            profilePic.src = user.profilePic || 'profile.jpg';
            profilePic.alt = user.username;
            
            // Set dropdown menu information
            const dropdownProfilePic = document.getElementById('dropdownProfilePic');
            const dropdownUsername = document.getElementById('dropdownUsername');
            const dropdownEmail = document.getElementById('dropdownEmail');
            
            if (dropdownProfilePic) dropdownProfilePic.src = user.profilePic || 'profile.jpg';
            if (dropdownUsername) dropdownUsername.textContent = user.username;
            if (dropdownEmail) dropdownEmail.textContent = user.email;
        } else {
            // User is not logged in
            loginBtn.classList.remove('hidden');
            signupBtn.classList.remove('hidden');
            profileBtn.classList.add('hidden');
        }
    }

    getCurrentUser() {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    }

    setupLogoutHandler() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    login(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password) {
                    const user = {
                        email: email,
                        username: email.split('@')[0],
                        profilePic: 'profile.jpg'
                    };
                    localStorage.setItem('user', JSON.stringify(user));
                    this.checkAuthState();
                    resolve(user);
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 1000);
        });
    }

    signup(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password) {
                    const user = {
                        email: email,
                        username: email.split('@')[0],
                        profilePic: 'profile.jpg'
                    };
                    localStorage.setItem('user', JSON.stringify(user));
                    this.checkAuthState();
                    resolve(user);
                } else {
                    reject(new Error('Invalid input'));
                }
            }, 1000);
        });
    }

    logout() {
        localStorage.removeItem('user');
        this.checkAuthState();
        window.location.href = 'index.html';
    }
}
