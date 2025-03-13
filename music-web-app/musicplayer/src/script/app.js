// class Auth {
//     constructor() {
//         this.isLoggedIn = false;
//         this.user = null;
//         this.setupEventListeners();
//         this.checkLoginStatus();
//     }

//     setupEventListeners() {
//         const loginForm = document.getElementById('loginForm');
//         const signupForm = document.getElementById('signupForm');
//         const logoutBtn = document.getElementById('logoutBtn');

//         if (loginForm) {
//             loginForm.addEventListener('submit', (e) => {
//                 e.preventDefault();
//                 this.login();
//             });
//         }

//         if (signupForm) {
//             signupForm.addEventListener('submit', (e) => {
//                 e.preventDefault();
//                 this.signup();
//             });
//         }

//         if (logoutBtn) {
//             logoutBtn.addEventListener('click', () => this.logout());
//         }
//     }

//     login() {
//         const email = document.getElementById('email').value;
//         const password = document.getElementById('password').value;

//         if (email && password) {
//             const userData = {
//                 email,
//                 username: email.split('@')[0]
//             };
            
//             localStorage.setItem('user', JSON.stringify(userData));
//             localStorage.setItem('isLoggedIn', 'true');
            
//             window.location.href = 'index.html';
//         }
//     }

//     signup() {
//         const username = document.getElementById('username').value;
//         const email = document.getElementById('email').value;
//         const password = document.getElementById('password').value;
//         const confirmPassword = document.getElementById('confirmPassword').value;

//         if (password !== confirmPassword) {
//             alert('Passwords do not match!');
//             return;
//         }

//         const userData = {
//             username,
//             email
//         };

//         localStorage.setItem('user', JSON.stringify(userData));
//         localStorage.setItem('isLoggedIn', 'true');
        
//         window.location.href = 'index.html';
//     }

//     logout() {
//         localStorage.removeItem('user');
//         localStorage.removeItem('isLoggedIn');
//         this.isLoggedIn = false;
//         this.user = null;
//         window.location.href = 'login.html';
//     }

//     checkLoginStatus() {
//         const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
//         const user = JSON.parse(localStorage.getItem('user'));

//         this.isLoggedIn = isLoggedIn;
//         this.user = user;

//         if (!isLoggedIn && 
//             !window.location.pathname.includes('login.html') && 
//             !window.location.pathname.includes('signup.html')) {
//             window.location.href = 'login.html';
//         }

//         this.updateUI();
//     }

//     updateUI() {
//         const loginBtn = document.getElementById('loginBtn');
//         const signupBtn = document.getElementById('signupBtn');
//         const logoutBtn = document.getElementById('logoutBtn');

//         if (!loginBtn || !signupBtn || !logoutBtn) return;

//         if (this.isLoggedIn) {
//             loginBtn.classList.add('hidden');
//             signupBtn.classList.add('hidden');
//             logoutBtn.classList.remove('hidden');
//         } else {
//             loginBtn.classList.remove('hidden');
//             signupBtn.classList.remove('hidden');
//             logoutBtn.classList.add('hidden');
//         }
//     }
// }

// const auth = new Auth();