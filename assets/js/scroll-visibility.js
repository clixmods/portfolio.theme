/**
 * Scroll Visibility Management
 * 
 * This file is kept for potential future scroll-based visibility features.
 * Currently disabled as the profile badge should always be visible.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Scroll visibility management - Profile badge always visible');
    
    // Ensure profile badge is always visible
    const profileBadge = document.getElementById('profile-badge');
    if (profileBadge) {
        profileBadge.style.opacity = '1';
        profileBadge.style.pointerEvents = 'auto';
        profileBadge.style.transform = 'translateY(0)';
    }
});
