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

// ========================================
// SYSTÈME DE TROPHÉES
// ========================================
(function() {
  'use strict';

  class TrophySystem {
    constructor() {
      this.trophies = [
        {
          id: 'welcome',
          name: 'Bienvenue !',
          description: 'Visitez la page d\'accueil pour la première fois',
          icon: '🏠',
          rarity: 'common',
          requirement: 'Visiter la page d\'accueil',
          condition: () => window.location.pathname === '/' || window.location.pathname === '/portfolio/' || window.location.pathname.includes('index')
        },
        {
          id: 'portfolio_explorer',
          name: 'Explorateur de Portfolio',
          description: 'Découvrez la section portfolio',
          icon: '💼',
          rarity: 'common',
          requirement: 'Visiter la section portfolio',
          condition: () => window.location.pathname.includes('/portfolio')
        },
        {
          id: 'project_enthusiast',
          name: 'Amateur de Projets',
          description: 'Consultez 3 projets différents',
          icon: '🚀',
          rarity: 'rare',
          requirement: 'Visiter 3 projets différents',
          condition: () => {
            const visitedProjects = JSON.parse(localStorage.getItem('visitedProjects') || '[]');
            return visitedProjects.length >= 3;
          }
        },
        {
          id: 'blog_reader',
          name: 'Lecteur Assidu',
          description: 'Lisez un article de blog',
          icon: '📚',
          rarity: 'common',
          requirement: 'Lire un article de blog',
          condition: () => window.location.pathname.includes('/posts/') && !window.location.pathname.endsWith('/posts/')
        },
        {
          id: 'night_owl',
          name: 'Oiseau de Nuit',
          description: 'Activez le mode sombre',
          icon: '🌙',
          rarity: 'common',
          requirement: 'Activer le mode sombre',
          condition: () => localStorage.getItem('theme') === 'dark'
        },
        {
          id: 'time_keeper',
          name: 'Gardien du Temps',
          description: 'Restez sur le site pendant plus de 5 minutes',
          icon: '⏰',
          rarity: 'rare',
          requirement: 'Rester 5+ minutes sur le site',
          condition: () => {
            const startTime = sessionStorage.getItem('visitStartTime');
            if (!startTime) return false;
            return (Date.now() - parseInt(startTime)) > 5 * 60 * 1000;
          }
        },
        {
          id: 'cv_downloader',
          name: 'Recruteur Potentiel',
          description: 'Téléchargez le CV',
          icon: '📄',
          rarity: 'rare',
          requirement: 'Télécharger le CV',
          condition: () => localStorage.getItem('cvDownloaded') === 'true'
        },
        {
          id: 'social_networker',
          name: 'Social Butterfly',
          description: 'Cliquez sur 2 liens de réseaux sociaux différents',
          icon: '🦋',
          rarity: 'rare',
          requirement: 'Visiter 2 réseaux sociaux',
          condition: () => {
            const socialClicks = JSON.parse(localStorage.getItem('socialClicks') || '[]');
            return socialClicks.length >= 2;
          }
        },
        {
          id: 'completionist',
          name: 'Perfectionniste',
          description: 'Visitez toutes les sections du site',
          icon: '🏆',
          rarity: 'epic',
          requirement: 'Visiter toutes les sections',
          condition: () => {
            const visitedSections = JSON.parse(localStorage.getItem('visitedSections') || '[]');
            const requiredSections = ['home', 'portfolio', 'projects', 'posts'];
            return requiredSections.every(section => visitedSections.includes(section));
          }
        },
        {
          id: 'master_explorer',
          name: 'Maître Explorateur',
          description: 'Débloquez tous les autres trophées',
          icon: '👑',
          rarity: 'legendary',
          requirement: 'Débloquer tous les trophées',
          condition: () => {
            const unlockedTrophies = JSON.parse(localStorage.getItem('unlockedTrophies') || '[]');
            return unlockedTrophies.length >= 9; // Tous sauf celui-ci
          }
        }
      ];

      this.unlockedTrophies = JSON.parse(localStorage.getItem('unlockedTrophies') || '[]');
      this.init();
    }

    init() {
      this.setupEventListeners();
      this.trackVisit();
      this.renderTrophies();
      this.updateProgress();
      this.checkTrophies();
      
      // Vérifier les trophées toutes les 30 secondes
      setInterval(() => this.checkTrophies(), 30000);
    }

    setupEventListeners() {
      // Toggle dropdown
      const trophiesBtn = document.querySelector('.trophies-btn');
      const dropdown = document.querySelector('.trophies-dropdown');
      
      if (trophiesBtn && dropdown) {
        trophiesBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          dropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
          if (!dropdown.contains(e.target) && !trophiesBtn.contains(e.target)) {
            dropdown.classList.remove('active');
          }
        });
      }

      // Track CV download
      const cvBtn = document.querySelector('.cv-btn');
      if (cvBtn) {
        cvBtn.addEventListener('click', () => {
          localStorage.setItem('cvDownloaded', 'true');
          setTimeout(() => this.checkTrophies(), 500);
        });
      }

      // Track social clicks
      document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href') || '';
          let platform = 'unknown';
          
          if (href.includes('linkedin')) platform = 'linkedin';
          else if (href.includes('github')) platform = 'github';
          else if (href.includes('twitter') || href.includes('x.com')) platform = 'twitter';
          else if (href.includes('instagram')) platform = 'instagram';
          else if (href.includes('facebook')) platform = 'facebook';
          
          const socialClicks = JSON.parse(localStorage.getItem('socialClicks') || '[]');
          if (!socialClicks.includes(platform)) {
            socialClicks.push(platform);
            localStorage.setItem('socialClicks', JSON.stringify(socialClicks));
            setTimeout(() => this.checkTrophies(), 500);
          }
        });
      });
    }

    trackVisit() {
      // Track start time
      if (!sessionStorage.getItem('visitStartTime')) {
        sessionStorage.setItem('visitStartTime', Date.now().toString());
      }

      // Track visited sections
      const visitedSections = JSON.parse(localStorage.getItem('visitedSections') || '[]');
      const currentSection = this.getCurrentSection();
      if (currentSection && !visitedSections.includes(currentSection)) {
        visitedSections.push(currentSection);
        localStorage.setItem('visitedSections', JSON.stringify(visitedSections));
      }

      // Track visited projects
      if (window.location.pathname.includes('/projects/') && !window.location.pathname.endsWith('/projects/')) {
        const visitedProjects = JSON.parse(localStorage.getItem('visitedProjects') || '[]');
        const projectName = window.location.pathname.split('/').pop();
        if (projectName && !visitedProjects.includes(projectName)) {
          visitedProjects.push(projectName);
          localStorage.setItem('visitedProjects', JSON.stringify(visitedProjects));
        }
      }
    }

    getCurrentSection() {
      const path = window.location.pathname;
      if (path === '/' || path === '/portfolio/' || path.includes('index')) return 'home';
      if (path.includes('/portfolio')) return 'portfolio';
      if (path.includes('/projects')) return 'projects';
      if (path.includes('/posts')) return 'posts';
      return null;
    }

    checkTrophies() {
      let newTrophies = [];
      
      this.trophies.forEach(trophy => {
        if (!this.unlockedTrophies.includes(trophy.id) && trophy.condition()) {
          this.unlockTrophy(trophy.id);
          newTrophies.push(trophy);
        }
      });

      if (newTrophies.length > 0) {
        this.renderTrophies();
        this.updateProgress();
        
        // Show notification for new trophies
        newTrophies.forEach((trophy, index) => {
          setTimeout(() => this.showTrophyNotification(trophy), index * 1000);
        });
      }
    }

    unlockTrophy(trophyId) {
      if (!this.unlockedTrophies.includes(trophyId)) {
        this.unlockedTrophies.push(trophyId);
        localStorage.setItem('unlockedTrophies', JSON.stringify(this.unlockedTrophies));
        
        // Store unlock date
        const now = new Date();
        const dateStr = now.toLocaleDateString('fr-FR');
        localStorage.setItem(`trophy_${trophyId}_date`, dateStr);
        
        // Add vibration if supported
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      }
    }

    showTrophyNotification(trophy) {
      const notification = document.createElement('div');
      notification.className = 'new-trophy-notification';
      notification.innerHTML = `
        <span class="trophy-emoji">${trophy.icon}</span>
        <div class="trophy-name">Trophée débloqué !</div>
        <div class="trophy-desc">${trophy.name}</div>
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => notification.classList.add('show'), 100);
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 500);
      }, 3000);
    }

    renderTrophies() {
      const trophiesList = document.querySelector('.trophies-list');
      if (!trophiesList) return;

      trophiesList.innerHTML = this.trophies.map(trophy => {
        const isUnlocked = this.unlockedTrophies.includes(trophy.id);
        const unlockedDate = isUnlocked ? localStorage.getItem(`trophy_${trophy.id}_date`) || 'Récemment' : null;
        
        return `
          <div class="trophy-item ${isUnlocked ? 'unlocked' : 'locked'}">
            <div class="trophy-icon ${isUnlocked ? 'unlocked' : 'locked'}">
              ${isUnlocked ? trophy.icon : '🔒'}
            </div>
            <div class="trophy-content">
              <div class="trophy-title">${isUnlocked ? trophy.name : '???'}</div>
              <div class="trophy-description">
                ${isUnlocked ? trophy.description : 'Trophée verrouillé'}
              </div>
              <div class="trophy-requirement">${trophy.requirement}</div>
              ${isUnlocked && unlockedDate ? `<div class="trophy-date">Débloqué: ${unlockedDate}</div>` : ''}
            </div>
            <div class="trophy-rarity ${trophy.rarity}">
              ${trophy.rarity.toUpperCase()}
            </div>
          </div>
        `;
      }).join('');
    }

    updateProgress() {
      const progressBar = document.querySelector('.trophy-progress-bar');
      const progressText = document.querySelector('.trophy-progress-text');
      const countElement = document.querySelector('.trophy-count');
      
      const progress = (this.unlockedTrophies.length / this.trophies.length) * 100;
      
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
      
      if (progressText) {
        progressText.textContent = `${this.unlockedTrophies.length}/${this.trophies.length}`;
      }
      
      if (countElement) {
        countElement.textContent = `${this.unlockedTrophies.length}/${this.trophies.length}`;
      }
    }
  }

  // Initialize trophy system when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    window.trophySystem = new TrophySystem();
  });

})();
