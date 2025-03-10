class Auth {
    constructor() {
        this.isLoggedIn = false;
        this.user = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('loginBtn').addEventListener('click', () => this.login());
        document.getElementById('signupBtn').addEventListener('click', () => this.signup());
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
    }

    login() {
        const email = prompt('Enter your email:');
        const password = prompt('Enter your password:');

        if (email && password) {
            this.isLoggedIn = true;
            this.user = { email };
            this.updateUI();
        }
    }

    signup() {
        const email = prompt('Enter your email:');
        const password = prompt('Enter your password:');
        const confirmPassword = prompt('Confirm your password:');

        if (password === confirmPassword) {
            this.isLoggedIn = true;
            this.user = { email };
            this.updateUI();
        }
    }

    logout() {
        this.isLoggedIn = false;
        this.user = null;
        this.updateUI();
    }

    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const logoutBtn = document.getElementById('logoutBtn');

        if (this.isLoggedIn) {
            loginBtn.classList.add('hidden');
            signupBtn.classList.add('hidden');
            logoutBtn.classList.remove('hidden');
        } else {
            loginBtn.classList.remove('hidden');
            signupBtn.classList.remove('hidden');
            logoutBtn.classList.add('hidden');
        }
    }
}