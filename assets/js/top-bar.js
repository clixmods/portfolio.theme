/**
 * Top Bar Navigation - Gestion des interactions
 * Version: 1.0.0
 * Taille: < 2kB minifié
 */

(function() {
  'use strict';
  
  // Variables globales
  let isReducedMotion = false;
  let topBar = null;
  let languageBtn = null;
  let languageDropdown = null;
  let downloadBtn = null;
  let socialBtns = [];
  let clockElement = null;
  let clockInterval = null;
  let themeToggle = null;
  let notificationsBtn = null;
  let notificationsDropdown = null;
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
    document.documentElement.style.setProperty('--top-bar-transition', `${duration} ease-out`);
  }
  
  /**
   * Gère l'ouverture/fermeture du dropdown de langue
   */
  function toggleLanguageDropdown(event) {
    event.preventDefault();
    event.stopPropagation();
    
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
    
    const selectedOption = event.currentTarget;
    const selectedLang = selectedOption.dataset.lang;
    const selectedText = selectedOption.querySelector('span:last-child').textContent;
    
    // Mise à jour du bouton actuel
    const currentLangText = languageBtn.querySelector('.button-text');
    if (currentLangText) {
      currentLangText.textContent = selectedLang.toUpperCase();
    }
    
    // Mise à jour des états actifs
    const allOptions = languageDropdown.querySelectorAll('.language-option');
    allOptions.forEach(option => option.classList.remove('active'));
    selectedOption.classList.add('active');
    
    // Fermer le dropdown
    closeLanguageDropdown();
    
    // Ici, vous pourrez ajouter la logique de changement de langue
    console.log(`Langue sélectionnée: ${selectedLang}`);
    
    // Feedback tactile
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  }
  
  /**
   * Gère les événements clavier pour l'accessibilité
   */
  function handleKeyDown(event) {
    const target = event.target;
    
    // Navigation dans le dropdown avec les flèches
    if (languageDropdown.classList.contains('active')) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLanguageDropdown();
        languageBtn.focus();
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        navigateLanguageOptions(event.key);
      } else if (event.key === 'Enter' || event.key === ' ') {
        if (target.classList.contains('language-option')) {
          event.preventDefault();
          handleLanguageSelection(event);
        }
      }
    }
    
    // Ouvrir le dropdown avec Entrée ou Espace
    if (target === languageBtn && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      toggleLanguageDropdown(event);
    }
  }
  
  /**
   * Navigation clavier dans les options de langue
   */
  function navigateLanguageOptions(direction) {
    const options = Array.from(languageDropdown.querySelectorAll('.language-option'));
    const currentFocus = document.activeElement;
    let currentIndex = options.indexOf(currentFocus);
    
    if (currentIndex === -1) {
      currentIndex = direction === 'ArrowDown' ? -1 : options.length;
    }
    
    let nextIndex;
    if (direction === 'ArrowDown') {
      nextIndex = currentIndex + 1 >= options.length ? 0 : currentIndex + 1;
    } else {
      nextIndex = currentIndex - 1 < 0 ? options.length - 1 : currentIndex - 1;
    }
    
    options[nextIndex].focus();
  }
  
  /**
   * Ajoute un effet de feedback visuel sur les boutons
   */
  function addButtonFeedback(button) {
    button.style.transform = 'translateY(0) scale(0.95)';
    
    setTimeout(() => {
      button.style.transform = '';
    }, 100);
  }
  
  /**
   * Gère le clic sur le bouton de téléchargement
   */
  function handleDownloadClick(event) {
    const button = event.currentTarget;
    addButtonFeedback(button);
    
    // Notification toast
    showToast('CV téléchargé', 'Le CV a été téléchargé avec succès', 'success');
    
    // Analytics ou tracking (optionnel)
    console.log('CV téléchargé');
    
    // Feedback tactile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }
  
  /**
   * Gère le clic sur les boutons sociaux
   */
  function handleSocialClick(event) {
    const button = event.currentTarget;
    const title = button.getAttribute('title');
    
    addButtonFeedback(button);
    
    // Analytics ou tracking (optionnel)
    console.log(`Lien social cliqué: ${title}`);
    
    // Feedback tactile
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  }
  
  /**
   * Gère le scroll pour adapter l'apparence de la top bar
   */
  function handleScroll() {
    const scrollY = window.pageYOffset;
    
    if (scrollY > 100) {
      topBar.style.setProperty('--top-bar-bg', 'rgba(47, 47, 47, 0.45)');
      topBar.style.setProperty('--top-bar-blur', '15px');
    } else {
      topBar.style.setProperty('--top-bar-bg', 'rgba(47, 47, 47, 0.35)');
      topBar.style.setProperty('--top-bar-blur', '10px');
    }
  }
  
  /**
   * Met à jour l'horloge
   */
  function updateClock() {
    if (!clockElement) return;
    
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;
    
    clockElement.textContent = time;
  }
  
  /**
   * Démarre l'horloge
   */
  function startClock() {
    updateClock(); // Mise à jour immédiate
    clockInterval = setInterval(updateClock, 1000); // Mise à jour chaque seconde
  }
  
  /**
   * Arrête l'horloge
   */
  function stopClock() {
    if (clockInterval) {
      clearInterval(clockInterval);
      clockInterval = null;
    }
  }
  
  /**
   * Gère le toggle du thème sombre/clair
   */
  function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    
    // Notification
    showToast('Thème changé', `Mode ${currentTheme === 'dark' ? 'sombre' : 'clair'} activé`, 'info');
    
    // Feedback tactile
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  }
  
  /**
   * Initialise le thème depuis le localStorage
   */
  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);
  }
  
  /**
   * Gère l'API Battery (mobile)
   */
  async function initBattery() {
    if (!('getBattery' in navigator) || !batteryIndicator) {
      return;
    }
    
    try {
      const battery = await navigator.getBattery();
      
      function updateBatteryInfo() {
        const level = Math.round(battery.level * 100);
        const isCharging = battery.charging;
        
        if (batteryLevel) {
          batteryLevel.textContent = `${level}%`;
        }
        
        if (batteryFill) {
          batteryFill.style.width = `${level}%`;
        }
        
        // États de batterie
        batteryIndicator.classList.remove('low', 'medium', 'high', 'charging');
        
        if (isCharging) {
          batteryIndicator.classList.add('charging');
        } else if (level < 20) {
          batteryIndicator.classList.add('low');
        } else if (level < 50) {
          batteryIndicator.classList.add('medium');
        } else {
          batteryIndicator.classList.add('high');
        }
        
        // Afficher sur mobile
        if (window.innerWidth <= 768) {
          batteryIndicator.style.display = 'flex';
        }
      }
      
      // Événements de batterie
      battery.addEventListener('levelchange', updateBatteryInfo);
      battery.addEventListener('chargingchange', updateBatteryInfo);
      
      updateBatteryInfo();
      
    } catch (error) {
      console.warn('Battery API non supportée:', error);
    }
  }
  
  /**
   * Système de notifications
   */
  function addNotification(title, message, type = 'info') {
    const id = Date.now();
    const notification = {
      id,
      title,
      message,
      type,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
    
    notifications.unshift(notification);
    updateNotificationsList();
    updateNotificationBadge();
    
    return id;
  }
  
  /**
   * Met à jour la liste des notifications
   */
  function updateNotificationsList() {
    const notificationsList = document.getElementById('notifications-list');
    if (!notificationsList) return;
    
    if (notifications.length === 0) {
      notificationsList.innerHTML = '<div class="no-notifications">Aucune notification</div>';
      return;
    }
    
    notificationsList.innerHTML = notifications.map(notif => `
      <div class="notification-item" data-id="${notif.id}">
        <div class="notification-icon ${notif.type}">
          ${getNotificationIcon(notif.type)}
        </div>
        <div class="notification-content">
          <div class="notification-title">${notif.title}</div>
          <div class="notification-message">${notif.message}</div>
          <div class="notification-time">${notif.time}</div>
        </div>
      </div>
    `).join('');
  }
  
  /**
   * Met à jour le badge de notifications
   */
  function updateNotificationBadge() {
    const badge = document.getElementById('notification-badge');
    if (!badge) return;
    
    if (notifications.length > 0) {
      badge.textContent = notifications.length > 99 ? '99+' : notifications.length;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }
  
  /**
   * Retourne l'icône pour le type de notification
   */
  function getNotificationIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'i'
    };
    return icons[type] || 'i';
  }
  
  /**
   * Efface toutes les notifications
   */
  function clearAllNotifications() {
    notifications = [];
    updateNotificationsList();
    updateNotificationBadge();
    closeNotificationsDropdown();
    
    showToast('Notifications', 'Toutes les notifications ont été effacées', 'info');
  }
  
  /**
   * Gère l'ouverture/fermeture du dropdown de notifications
   */
  function toggleNotificationsDropdown(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const isActive = notificationsDropdown.classList.contains('active');
    
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
    notificationsDropdown.classList.add('active');
    
    // Fermer les autres dropdowns
    closeLanguageDropdown();
    
    // Ajouter l'event listener pour fermer en cliquant ailleurs
    setTimeout(() => {
      document.addEventListener('click', closeNotificationsDropdownOutside);
    }, 0);
  }
  
  /**
   * Ferme le dropdown de notifications
   */
  function closeNotificationsDropdown() {
    notificationsDropdown.classList.remove('active');
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
   * Affiche une notification toast
   */
  function showToast(title, message, type = 'info', duration = 4000) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-header">
        <div class="toast-icon ${type}">${getNotificationIcon(type)}</div>
        <div class="toast-title">${title}</div>
        <button class="toast-close">×</button>
      </div>
      <div class="toast-message">${message}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animation d'entrée
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Gestion de la fermeture
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    });
    
    // Auto-suppression
    if (duration > 0) {
      setTimeout(() => {
        if (toast.parentNode) {
          toast.classList.remove('show');
          setTimeout(() => {
            if (toast.parentNode) {
              toast.parentNode.removeChild(toast);
            }
          }, 300);
        }
      }, duration);
    }
    
    // Ajouter à la liste des notifications
    addNotification(title, message, type);
  }
  
  /**
   * Attache tous les event listeners
   */
  function attachEventListeners() {
    // Bouton de langue
    if (languageBtn) {
      languageBtn.addEventListener('click', toggleLanguageDropdown);
    }
    
    // Options de langue
    if (languageDropdown) {
      const languageOptions = languageDropdown.querySelectorAll('.language-option');
      languageOptions.forEach(option => {
        option.addEventListener('click', handleLanguageSelection);
      });
    }
    
    // Bouton de téléchargement
    if (downloadBtn) {
      downloadBtn.addEventListener('click', handleDownloadClick);
    }
    
    // Boutons sociaux
    socialBtns.forEach(btn => {
      btn.addEventListener('click', handleSocialClick);
    });
    
    // Toggle thème
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Notifications
    if (notificationsBtn) {
      notificationsBtn.addEventListener('click', toggleNotificationsDropdown);
    }
    
    // Clear all notifications
    const clearAllBtn = document.getElementById('clear-all-notifications');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', clearAllNotifications);
    }
    
    // Événements clavier globaux
    document.addEventListener('keydown', handleKeyDown);
    
    // Scroll pour les effets visuels
    let scrollTimeout;
    window.addEventListener('scroll', function() {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(handleScroll, 10);
    });
  }
  
  /**
   * Initialise la top bar
   */
  function initTopBar() {
    topBar = document.getElementById('top-bar');
    if (!topBar) {
      console.warn('Top bar non trouvée dans le DOM');
      return;
    }
    
    // Récupération des éléments
    languageBtn = topBar.querySelector('.language-btn');
    languageDropdown = topBar.querySelector('.language-dropdown');
    downloadBtn = topBar.querySelector('.download-btn');
    socialBtns = Array.from(topBar.querySelectorAll('.social-btn'));
    clockElement = document.getElementById('clock-time');
    themeToggle = topBar.querySelector('.theme-toggle');
    notificationsBtn = topBar.querySelector('.notifications-btn');
    notificationsDropdown = document.getElementById('notifications-dropdown');
    batteryIndicator = document.getElementById('battery-indicator');
    batteryLevel = document.getElementById('battery-level');
    batteryFill = document.getElementById('battery-fill');
    
    // Vérifications
    if (!languageBtn || !languageDropdown) {
      console.warn('Éléments de langue manquants dans la top bar');
    }
    
    // Initialisation du thème
    initTheme();
    
    // Attache les event listeners
    attachEventListeners();
    
    // Démarre l'horloge
    if (clockElement) {
      startClock();
    }
    
    // Initialise la batterie sur mobile
    if (window.innerWidth <= 768) {
      initBattery();
    }
    
    // Détecte les préférences d'animation
    detectReducedMotion();
    updateAnimationDuration();
    
    // Notifications de bienvenue
    setTimeout(() => {
      showToast('Bienvenue !', 'Interface initialisée avec succès', 'success');
    }, 1000);
    
    console.log('Top bar initialisée avec succès');
  }
  
  /**
   * Point d'entrée principal
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initTopBar);
    } else {
      initTopBar();
    }
  }
  
  // Démarre l'initialisation
  init();
  
  // Export pour tests ou utilisation externe (optionnel)
  window.TopBarNavigation = {
    openLanguageDropdown,
    closeLanguageDropdown,
    startClock,
    stopClock,
    updateClock,
    toggleTheme,
    initTheme,
    showToast,
    addNotification,
    clearAllNotifications,
    reinit: initTopBar
  };
  
  // Nettoyer les intervals quand la page se ferme
  window.addEventListener('beforeunload', function() {
    stopClock();
  });
  
  // Gestion des changements de taille d'écran pour la batterie
  window.addEventListener('resize', function() {
    if (window.innerWidth <= 768 && batteryIndicator) {
      initBattery();
    }
  });
  
})();

