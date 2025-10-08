/**
 * Mobile Menu - Hamburger menu for top dock on mobile devices
 * Handles opening/closing of mobile navigation menu
 */

(function() {
  'use strict';
  
  // DOM elements
  let menuToggle = null;
  let menuDropdown = null;
  let menuOverlay = null;
  let isOpen = false;
  
  /**
   * Initialize mobile menu
   */
  function init() {
    menuToggle = document.getElementById('mobile-menu-toggle');
    menuDropdown = document.getElementById('mobile-menu-dropdown');
    menuOverlay = document.getElementById('mobile-menu-overlay');
    
    if (!menuToggle || !menuDropdown || !menuOverlay) {
      return; // Elements not found, exit silently
    }
    
    // Attach event listeners
    menuToggle.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', closeMenu);
    
    // Close menu when clicking outside
    document.addEventListener('click', handleClickOutside);
    
    // Close menu on escape key
    document.addEventListener('keydown', handleEscapeKey);
    
    // Close menu when clicking on a link (except for buttons that open modals)
    const menuLinks = menuDropdown.querySelectorAll('.mobile-menu-item[href]');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Small delay to allow navigation to start
        setTimeout(closeMenu, 100);
      });
    });
    
    // Handle window resize - close menu if switching to desktop
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth > 768 && isOpen) {
          closeMenu();
        }
      }, 100);
    });
    
    // Sync trophy count and notification badges
    syncBadges();
    
    // Watch for changes in trophy count
    const trophyCountObserver = new MutationObserver(syncBadges);
    const trophyCountEl = document.getElementById('trophy-count');
    if (trophyCountEl) {
      trophyCountObserver.observe(trophyCountEl, {
        childList: true,
        characterData: true,
        subtree: true
      });
    }
    
    // Watch for changes in notification badge
    const notificationBadgeObserver = new MutationObserver(syncBadges);
    const notificationBadgeEl = document.getElementById('notification-badge');
    if (notificationBadgeEl) {
      notificationBadgeObserver.observe(notificationBadgeEl, {
        childList: true,
        characterData: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
      });
    }
  }
  
  /**
   * Sync trophy count and notification badges between desktop and mobile
   */
  function syncBadges() {
    // Sync trophy count
    const desktopTrophyCount = document.getElementById('trophy-count');
    const mobileTrophyCount = document.getElementById('mobile-trophy-count');
    if (desktopTrophyCount && mobileTrophyCount) {
      mobileTrophyCount.textContent = desktopTrophyCount.textContent;
    }
    
    // Sync notification badge
    const desktopNotificationBadge = document.getElementById('notification-badge');
    const mobileNotificationBadge = document.getElementById('mobile-notification-badge');
    if (desktopNotificationBadge && mobileNotificationBadge) {
      const isVisible = desktopNotificationBadge.style.display !== 'none';
      mobileNotificationBadge.style.display = isVisible ? 'inline-block' : 'none';
      mobileNotificationBadge.textContent = desktopNotificationBadge.textContent;
    }
  }
  
  /**
   * Toggle menu open/closed
   */
  function toggleMenu(event) {
    if (event) {
      event.stopPropagation();
    }
    
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }
  
  /**
   * Open menu
   */
  function openMenu() {
    isOpen = true;
    menuToggle.classList.add('is-open');
    menuDropdown.classList.add('is-open');
    menuOverlay.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Fermer le menu');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
  }
  
  /**
   * Close menu
   */
  function closeMenu() {
    isOpen = false;
    menuToggle.classList.remove('is-open');
    menuDropdown.classList.remove('is-open');
    menuOverlay.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
    
    // Restore body scroll
    document.body.style.overflow = '';
  }
  
  /**
   * Handle clicks outside menu to close it
   */
  function handleClickOutside(event) {
    if (!isOpen) return;
    
    // Check if click is outside both toggle button and dropdown
    if (!menuToggle.contains(event.target) && !menuDropdown.contains(event.target)) {
      closeMenu();
    }
  }
  
  /**
   * Handle escape key to close menu
   */
  function handleEscapeKey(event) {
    if (event.key === 'Escape' && isOpen) {
      closeMenu();
      menuToggle.focus(); // Return focus to toggle button
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
