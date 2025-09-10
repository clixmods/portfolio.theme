/**
 * Right Dock Navigation - Gestion des interactions
 * Version: 1.0.0
 */

(function() {
  'use strict';
  
  // Protection contre les exécutions multiples
  if (window.rightDockInitialized) {
    console.log('⚠️ Right dock already initialized, skipping...');
    return;
  }
  
  // Variables globales
  let isReducedMotion = false;
  let rightDock = null;
  let languageBtn = null;
  let languageDropdown = null;
  let themeToggle = null;
  let notificationsBtn = null;
  let notificationsDropdown = null;
  let trophiesBtn = null;
  let batteryIndicator = null;
  let batteryLevel = null;
  let batteryFill = null;
  let notifications = [];
  let currentTheme = 'dark';
  
  /**
   * Détecte si l'utilisateur préfère les animations réduites
   */
  function detectReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    isReducedMotion = mediaQuery.matches;
    
    // Écoute les changements de préférence
    mediaQuery.addEventListener('change', function(e) {
      isReducedMotion = e.matches;
      updateAnimationDuration();
    });
  }
  
  /**
   * Met à jour la durée des animations selon les préférences
   */
  function updateAnimationDuration() {
    const duration = isReducedMotion ? '50ms' : '150ms';
    document.documentElement.style.setProperty('--right-dock-transition', `${duration} ease-out`);
  }
  
  /**
   * Gère l'ouverture/fermeture du dropdown de langue
   */
  function toggleLanguageDropdown(event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (!languageBtn || !languageDropdown) {
      console.error('❌ Missing elements for language dropdown');
      return;
    }
    
    const isActive = languageBtn.classList.contains('active');
    
    if (isActive) {
      closeLanguageDropdown();
    } else {
      openLanguageDropdown();
    }
  }
  
  /**
   * Ouvre le dropdown de langue
   */
  function openLanguageDropdown() {
    languageBtn.classList.add('active');
    languageDropdown.classList.add('active');
    
    // Ajouter l'event listener pour fermer en cliquant ailleurs
    setTimeout(() => {
      document.addEventListener('click', closeLanguageDropdownOutside);
    }, 0);
  }
  
  /**
   * Ferme le dropdown de langue
   */
  function closeLanguageDropdown() {
    languageBtn.classList.remove('active');
    languageDropdown.classList.remove('active');
    
    // Retirer l'event listener
    document.removeEventListener('click', closeLanguageDropdownOutside);
  }
  
  /**
   * Ferme le dropdown si on clique en dehors
   */
  function closeLanguageDropdownOutside(event) {
    if (!languageBtn.contains(event.target) && !languageDropdown.contains(event.target)) {
      closeLanguageDropdown();
    }
  }
  
  /**
   * Gère la sélection d'une langue
   */
  function handleLanguageSelection(event) {
    event.preventDefault();
    
    const selectedOption = event.target.closest('.language-option');
    if (!selectedOption) return;
    
    const selectedLang = selectedOption.dataset.lang;
    const selectedText = selectedOption.querySelector('span:last-child').textContent;
    const selectedFlag = selectedOption.querySelector('.flag').textContent;
    
    // Mise à jour du bouton
    updateLanguageButton(selectedText, selectedFlag);
    
    // Marquer l'option comme active
    const allOptions = languageDropdown.querySelectorAll('.language-option');
    allOptions.forEach(option => option.classList.remove('active'));
    selectedOption.classList.add('active');
    
    // Fermer le dropdown
    closeLanguageDropdown();
    
    // Redirection vers la page dans la nouvelle langue
    window.location.href = selectedOption.href;
  }
  
  /**
   * Met à jour le bouton de langue
   */
  function updateLanguageButton(text, flag) {
    const flagElement = languageBtn.querySelector('.language-flag');
    if (flagElement) {
      flagElement.textContent = flag;
    }
  }
  
  /**
   * Gère le toggle du thème
   */
  function handleThemeToggle(event) {
    event.preventDefault();
    
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Mise à jour de l'attribut data-theme sur le body
    document.body.setAttribute('data-theme', currentTheme);
    
    // Sauvegarde dans localStorage
    localStorage.setItem('theme', currentTheme);
    
    // Animation du bouton
    themeToggle.style.transform = 'scale(0.9)';
    setTimeout(() => {
      themeToggle.style.transform = '';
    }, 150);
    
    // Notification de changement
    const themeMessage = currentTheme === 'dark' ? '🌙 Mode sombre activé' : '☀️ Mode clair activé';
    showNotification(themeMessage, 'success');
    addNotification('Thème changé', themeMessage, 'success');
  }
  
  /**
   * Gère l'ouverture/fermeture du dropdown de notifications
   */
  function toggleNotificationsDropdown(event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (!notificationsBtn || !notificationsDropdown) {
      console.error('❌ Missing elements for notifications dropdown');
      return;
    }
    
    const isActive = notificationsBtn.classList.contains('active');
    
    if (isActive) {
      closeNotificationsDropdown();
    } else {
      openNotificationsDropdown();
    }
  }
  
  /**
   * Ouvre le dropdown de notifications
   */
  function openNotificationsDropdown() {
    notificationsBtn.classList.add('active');
    notificationsDropdown.classList.add('active');
    
    // Ajouter classe sur body pour masquer les toasts
    document.body.classList.add('notifications-menu-open');
    
    // Marquer les notifications comme lues
    markNotificationsAsRead();
    
    // Ajouter l'event listener pour fermer en cliquant ailleurs
    setTimeout(() => {
      document.addEventListener('click', closeNotificationsDropdownOutside);
    }, 0);
  }
  
  /**
   * Ferme le dropdown de notifications
   */
  function closeNotificationsDropdown() {
    notificationsBtn.classList.remove('active');
    notificationsDropdown.classList.remove('active');
    
    // Enlever classe sur body pour réafficher les toasts
    document.body.classList.remove('notifications-menu-open');
    
    // Retirer l'event listener
    document.removeEventListener('click', closeNotificationsDropdownOutside);
  }
  
  /**
   * Ferme le dropdown si on clique en dehors
   */
  function closeNotificationsDropdownOutside(event) {
    if (!notificationsBtn.contains(event.target) && !notificationsDropdown.contains(event.target)) {
      closeNotificationsDropdown();
    }
  }
  
  /**
   * Marque toutes les notifications comme lues
   */
  function markNotificationsAsRead() {
    notifications.forEach(notification => {
      notification.read = true;
    });
    updateNotificationBadge();
  }
  
  /**
   * Met à jour le badge de notifications
   */
  function updateNotificationBadge() {
    const badge = document.getElementById('notification-badge');
    const unreadCount = notifications.filter(n => !n.read).length;
    
    if (unreadCount > 0) {
      badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }
  
  /**
   * Ajoute une nouvelle notification
   */
  function addNotification(title, message, type = 'info') {
    const notification = {
      id: Date.now(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false
    };
    
    notifications.unshift(notification);
    updateNotificationsList();
    updateNotificationBadge();
    
    // Limite le nombre de notifications stockées
    if (notifications.length > 50) {
      notifications = notifications.slice(0, 50);
    }
  }
  
  /**
   * Met à jour la liste des notifications
   */
  function updateNotificationsList() {
    const notificationsList = document.getElementById('notifications-list');
    
    if (notifications.length === 0) {
      notificationsList.innerHTML = '<div class="no-notifications">Aucune notification</div>';
      return;
    }
    
    notificationsList.innerHTML = notifications.map(notification => `
      <div class="notification-item ${notification.type} ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
        <div class="notification-icon">${getNotificationTypeIcon(notification.type)}</div>
        <div class="notification-content">
          <div class="notification-title">${notification.title}</div>
          <div class="notification-message">${notification.message}</div>
          <div class="notification-time">${formatTime(notification.timestamp)}</div>
        </div>
        <button class="notification-close" onclick="removeNotification(${notification.id})">×</button>
      </div>
    `).join('');
  }
  
  /**
   * Retourne l'icône appropriée selon le type de notification
   */
  function getNotificationTypeIcon(type) {
    const icons = {
      'info': 'ℹ️',
      'success': '✅',
      'warning': '⚠️',
      'error': '❌',
      'trophy': '🏆'
    };
    return icons[type] || icons['info'];
  }
  
  /**
   * Supprime une notification
   */
  function removeNotification(id) {
    notifications = notifications.filter(n => n.id !== id);
    updateNotificationsList();
    updateNotificationBadge();
  }
  
  /**
   * Efface toutes les notifications
   */
  function clearAllNotifications() {
    notifications = [];
    updateNotificationsList();
    updateNotificationBadge();
    closeNotificationsDropdown();
  }
  
  /**
   * Formate un timestamp
   */
  function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `il y a ${minutes}m`;
    if (hours < 24) return `il y a ${hours}h`;
    return date.toLocaleDateString();
  }
  
  /**
   * Affiche une notification toast
   */
  function showNotification(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      console.warn('Toast container not found');
      return;
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-message">${message}</span>
      <button class="toast-close" aria-label="Fermer">×</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animation d'entrée
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    
    // Gestion du bouton de fermeture
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));
    
    // Auto-remove après 5 secondes
    setTimeout(() => {
      removeToast(toast);
    }, 5000);
  }
  
  /**
   * Supprime un toast
   */
  function removeToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }
  
  /**
   * Créer une notification de trophée
   * Système de notifications intégré au right-dock
   */
  function createTrophyNotificationCompat(trophy) {
    // Créer la notification dans le style du système de trophées
    const notification = document.createElement('div');
    notification.className = 'new-trophy-notification';
    notification.innerHTML = `
      <span class="trophy-emoji">${trophy.icon}</span>
      <div class="trophy-name">Trophée débloqué !</div>
      <div class="trophy-desc">${trophy.name}</div>
    `;
    
    // Ajouter au right-dock
    const rightDockContainer = document.getElementById('right-dock');
    (rightDockContainer || document.body).appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 500);
    }, 3000);
  }
  
  /**
   * Initialise le thème au chargement
   */
  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.body.setAttribute('data-theme', currentTheme);
  }
  
  /**
   * Initialise les éléments du DOM
   */
  function initElements() {
    console.log('🔍 Searching for right dock elements...');
    
    rightDock = document.getElementById('right-dock');
    if (!rightDock) {
      console.error('❌ Right dock element not found (#right-dock)');
      return false;
    }
    console.log('✅ Right dock found:', rightDock);
    
    // Éléments du right dock
    languageBtn = rightDock.querySelector('.language-btn');
    languageDropdown = document.getElementById('language-dropdown');
    themeToggle = rightDock.querySelector('.theme-toggle');
    notificationsBtn = rightDock.querySelector('.notifications-btn');
    notificationsDropdown = document.getElementById('notifications-dropdown');
    trophiesBtn = rightDock.querySelector('.trophies-btn');
    
    console.log('🔍 Element status:');
    console.log('  - Language button:', languageBtn ? '✅' : '❌', languageBtn);
    console.log('  - Language dropdown:', languageDropdown ? '✅' : '❌', languageDropdown);
    console.log('  - Theme toggle:', themeToggle ? '✅' : '❌', themeToggle);
    console.log('  - Notifications button:', notificationsBtn ? '✅' : '❌', notificationsBtn);
    console.log('  - Notifications dropdown:', notificationsDropdown ? '✅' : '❌', notificationsDropdown);
    console.log('  - Trophies button:', trophiesBtn ? '✅' : '❌', trophiesBtn);
    
    // Éléments globaux
    batteryIndicator = document.getElementById('battery-indicator');
    batteryLevel = document.getElementById('battery-level');
    batteryFill = document.getElementById('battery-fill');
    
    return true;
  }
  
  /**
   * Initialise les event listeners
   */
  function initEventListeners() {
    console.log('🔧 Initializing event listeners...');
    
    // Langue
    if (languageBtn && languageDropdown) {
      console.log('✅ Adding language button listener');
      // Supprimer les anciens listeners au cas où
      languageBtn.removeEventListener('click', toggleLanguageDropdown);
      languageBtn.addEventListener('click', toggleLanguageDropdown);
      
      languageDropdown.removeEventListener('click', handleLanguageSelection);
      languageDropdown.addEventListener('click', handleLanguageSelection);
    } else {
      console.log('❌ Language elements missing - Button:', !!languageBtn, 'Dropdown:', !!languageDropdown);
    }
    
    // Thème
    if (themeToggle) {
      console.log('✅ Adding theme toggle listener');
      themeToggle.removeEventListener('click', handleThemeToggle);
      themeToggle.addEventListener('click', handleThemeToggle);
    } else {
      console.log('❌ Theme toggle not found');
    }
    
    // Notifications
    if (notificationsBtn && notificationsDropdown) {
      console.log('✅ Adding notifications button listener');
      notificationsBtn.removeEventListener('click', toggleNotificationsDropdown);
      notificationsBtn.addEventListener('click', toggleNotificationsDropdown);
    } else {
      console.log('❌ Notifications elements missing - Button:', !!notificationsBtn, 'Dropdown:', !!notificationsDropdown);
    }
    
    // Clear all notifications
    const clearAllBtn = document.getElementById('clear-all-notifications');
    if (clearAllBtn) {
      clearAllBtn.removeEventListener('click', clearAllNotifications);
      clearAllBtn.addEventListener('click', clearAllNotifications);
    }
    
    // Trophées (si pas déjà géré par trophies.js)
    if (trophiesBtn && !window.trophiesManager) {
      trophiesBtn.addEventListener('click', function() {
        console.log('Trophées clicked - should be handled by trophies.js');
      });
    }
    
    console.log('🔧 Event listeners initialization complete');
  }
  
  /**
   * Initialisation principale
   */
  function init() {
    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    console.log('🔧 Initializing Right Dock...');
    
    detectReducedMotion();
    initTheme();
    
    if (!initElements()) {
      console.warn('❌ Right dock initialization failed - elements not found');
      return;
    }
    
    initEventListeners();
    updateAnimationDuration();
    
    console.log('✅ Right Dock initialized successfully');
    
    // Marquer comme initialisé
    window.rightDockInitialized = true;
    
    // Ajouter une notification de bienvenue
    setTimeout(() => {
      addNotification(
        '👋 Bienvenue !',
        'Interface dock maintenant active',
        'success'
      );
    }, 1000);
  }
  
  // Exposer certaines fonctions globalement
  window.rightDockManager = {
    addNotification,
    removeNotification,
    clearAllNotifications,
    showNotification,
    createTrophyNotificationCompat
  };
  
  // Exposer la fonction removeNotification globalement pour le HTML
  window.removeNotification = removeNotification;
  
  // Démarrer l'initialisation
  init();
  
})();
