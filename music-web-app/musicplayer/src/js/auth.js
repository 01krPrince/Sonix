document.addEventListener('DOMContentLoaded', function () {
    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log('Current user:', user);

    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const userProfile = document.getElementById('userProfile');
    const usernameDisplay = document.getElementById('usernameDisplay');

    if (user && user.id) {
        console.log('User is logged in with ID:', user.id);
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        userProfile.style.display = 'flex';
        usernameDisplay.textContent = user.username;

        fetchUserPlaylists(user.id);

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function () {
                sessionStorage.removeItem('user');
                window.location.href = 'login.html';
            });
        }

        setupPlaylistCreation(user);
    } else {
        console.log('No user logged in or missing user ID');
        loginBtn.style.display = 'inline-block';
        signupBtn.style.display = 'inline-block';
        userProfile.style.display = 'none';
    }
});