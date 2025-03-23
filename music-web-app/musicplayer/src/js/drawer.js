document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    function openDrawer() {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // Open drawer when clicking menu button
    mobileMenuBtn.addEventListener('click', openDrawer);

    // Close drawer when clicking overlay
    overlay.addEventListener('click', closeDrawer);

    // Close drawer when clicking a playlist or home button
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 1024) { // Only on mobile
            if (e.target.closest('#favoritesBtn') || 
                e.target.closest('button[data-playlist-id]') ||
                e.target.closest('#createPlaylist')) {
                closeDrawer();
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) { // lg breakpoint
            closeDrawer();
        }
    });
}); 