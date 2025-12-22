/**
 * Système de Trophées - Portfolio
 * Version: 2.2.0 - Uses shared utility modules directly
 * Description: Système de gamification avec trophées débloquables
 */

(function() {
  'use strict';

  // Direct usage of Storage utility (always available via js.html)
  const getStorageValue = (key, defaultValue) => Storage.get(key, defaultValue);
  const setStorageValue = (key, value) => Storage.set(key, value);
  const getStorageRaw = (key, defaultValue = '') => Storage.getRaw(key, defaultValue);
  const setStorageRaw = (key, value) => Storage.setRaw(key, value);

  class TrophySystem {
    constructor() {
      this.trophies = [];
      this.unlockedTrophies = getStorageValue('unlockedTrophies', []);
      this.sessionStartTime = Date.now();
      this.visitStartTime = parseInt(getStorageRaw('visitStartTime')) || Date.now();
      
      // Si c'est une nouvelle session, sauvegarder le temps de début
      if (!getStorageRaw('visitStartTime')) {
        setStorageRaw('visitStartTime', this.visitStartTime.toString());
      }
      
      // Charger les données depuis le JSON et initialiser
      this.loadTrophiesData().then(() => {
        this.init();
      });
    }

    /**
     * Charge les données des trophées depuis le JSON
     */
    async loadTrophiesData() {
      try {
        // Essayer plusieurs chemins possibles pour le fichier JSON
        const possiblePaths = [
          '/data/trophies.json',
          '/portfolio/data/trophies.json',
          'data/trophies.json'
        ];
        
        let response = null;
        let lastError = null;
        
        for (const path of possiblePaths) {
          try {
            response = await fetch(path);
            if (response.ok) {
              break;
            }
          } catch (error) {
            lastError = error;
            continue;
          }
        }
        
        if (!response || !response.ok) {
          throw new Error(`Impossible de charger les trophées depuis tous les chemins testés. Dernière erreur: ${lastError?.message || 'Inconnue'}`);
        }
        
        const trophiesData = await response.json();
        this.trophies = trophiesData.filter(trophy => trophy.enabled)
                                   .sort((a, b) => a.order - b.order);
        
        console.log(`${this.trophies.length} trophées chargés depuis le JSON`);
        this.checkTrophies();
        this.updateTrophyDisplay();
        this.updateProgress();
        this.renderTrophies();
      } catch (error) {
        console.error('Erreur lors du chargement des trophées:', error);
        // Fallback avec les trophées existants
        this.trophies = this.getFallbackTrophies();
        this.checkTrophies();
        this.updateTrophyDisplay();
        this.updateProgress();
        this.renderTrophies();
      }
    }

    /**
     * Trophées de fallback en cas d'erreur de chargement
     */
    getFallbackTrophies() {
      return [
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
            const visitedProjects = getStorageValue('visitedProjects', []);
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
        // DISABLED - Light mode not implemented yet
        /*
        {
          id: 'night_owl',
          name: 'Oiseau de Nuit',
          description: 'Activez le mode sombre',
          icon: '🌙',
          rarity: 'common',
          requirement: 'Activer le mode sombre',
          condition: () => localStorage.getItem('theme') === 'dark'
        },
        */
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
          condition: () => getStorageRaw('cvDownloaded') === 'true'
        },
        {
          id: 'social_networker',
          name: 'Social Butterfly',
          description: 'Cliquez sur 2 liens de réseaux sociaux différents',
          icon: '🦋',
          rarity: 'rare',
          requirement: 'Visiter 2 réseaux sociaux',
          condition: () => {
            const socialClicks = getStorageValue('socialClicks', []);
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
            const visitedSections = getStorageValue('visitedSections', []);
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
            const unlockedTrophies = getStorageValue('unlockedTrophies', []);
            return unlockedTrophies.length >= 9; // Tous sauf celui-ci
          }
        }
      ];
    }

    /**
     * Évalue une condition de trophée selon le nouveau système JSON
     */
    evaluateCondition(trophy) {
      const { condition_type, condition_data } = trophy;
      
      switch (condition_type) {
        case 'page_visit':
          return this.checkPageVisit(condition_data);
        
        case 'visited_count':
          return this.checkVisitedCount(condition_data);
        
        // DISABLED - Light mode not implemented yet
        /*
        case 'theme_change':
          return this.checkTheme(condition_data);
        */
        
        case 'time_spent':
          return this.checkTimeSpent(condition_data);
        
        case 'action_performed':
          return this.checkActionPerformed(condition_data);
        
        case 'section_viewed':
          return this.checkSectionViewed(condition_data);
        
        case 'all_sections_visited':
          return this.checkAllSectionsVisited(condition_data);
        
        case 'all_trophies_unlocked':
          return this.checkAllTrophiesUnlocked(condition_data);
        
        case 'speed_navigation':
          return this.checkSpeedNavigation(condition_data);
        
        case 'scrolled_to_bottom':
          return this.checkScrolledToBottom(condition_data);
        
        case 'skill_modal_opened':
          return this.checkSkillModalOpened(condition_data);
        
        default:
          console.warn(`Type de condition inconnu: ${condition_type}`);
          return false;
      }
    }

    /**
     * Vérifie si une page spécifique a été visitée
     */
    checkPageVisit(data) {
      const currentPath = window.location.pathname;
      const { paths, exclude_paths } = data;
      
      // Vérifier l'exclusion d'abord
      if (exclude_paths) {
        for (const excludePath of exclude_paths) {
          // Si le chemin actuel correspond exactement à un chemin exclu, on exclut
          if (currentPath === excludePath || currentPath.endsWith(excludePath)) {
            return false;
          }
        }
      }
      
      // Vérifier l'inclusion
      return paths.some(path => {
        // Pour les posts, on veut seulement les articles individuels, pas la liste
        if (path === '/posts/') {
          return currentPath.includes('/posts/') && !currentPath.endsWith('/posts/');
        }
        
        return currentPath === path || 
               currentPath.includes(path) || 
               (path.includes('index') && (currentPath === '/' || currentPath.includes('index')));
      });
    }

    /**
     * Vérifie le nombre d'éléments visités
     */
    checkVisitedCount(data) {
      const { storage_key, min_count } = data;
      const visited = getStorageValue(storage_key, []);
      return visited.length >= min_count;
    }

    /**
     * Vérifie le thème actuel - DISABLED (Light mode not implemented yet)
     */
    /*
    checkTheme(data) {
      // Vérifier que l'utilisateur a activement changé le thème dans cette session
      return sessionStorage.getItem('themeChangedToDark') === 'true' && 
             localStorage.getItem('theme') === data.theme;
    }
    */

    /**
     * Vérifie le temps passé sur le site
     */
    checkTimeSpent(data) {
      const timeSpent = (Date.now() - this.visitStartTime) / (1000 * 60); // en minutes
      return timeSpent >= data.min_minutes;
    }

    /**
     * Vérifie si une action a été effectuée
     */
    checkActionPerformed(data) {
      const value = getStorageRaw(data.action);
      const result = value === 'true';
      console.log('📊 Check action performed:', data.action, '=', value, 'Result:', result);
      return result;
    }

    /**
     * Vérifie si une section a été vue
     */
    checkSectionViewed(data) {
      const visitedSections = getStorageValue('visitedSections', []);
      return visitedSections.includes(data.section);
    }

    /**
     * Vérifie si toutes les sections requises ont été visitées
     */
    checkAllSectionsVisited(data) {
      const visitedSections = getStorageValue('visitedSections', []);
      console.log('📊 Checking all sections visited:', {
        required: data.required_sections,
        visited: visitedSections,
        allVisited: data.required_sections.every(section => visitedSections.includes(section))
      });
      return data.required_sections.every(section => visitedSections.includes(section));
    }

    /**
     * Vérifie si tous les autres trophées ont été débloqués
     */
    checkAllTrophiesUnlocked(data) {
      const otherTrophies = this.trophies.filter(t => t.id !== 'master_explorer');
      return otherTrophies.every(trophy => this.unlockedTrophies.includes(trophy.id));
    }

    /**
     * Vérifie la navigation rapide
     */
    checkSpeedNavigation(data) {
      const navigationData = getStorageValue('speedNavigation', {"pages": 0, "startTime": null});
      
      if (!navigationData.startTime) {
        return false;
      }
      
      const timeElapsed = (Date.now() - navigationData.startTime) / (1000 * 60); // en minutes
      const hasEnoughPages = navigationData.pages >= data.min_pages;
      const isWithinTimeLimit = timeElapsed <= data.max_minutes;
      
      console.log('📊 Speed Navigation Check:', {
        pages: navigationData.pages,
        minPages: data.min_pages,
        timeElapsed: timeElapsed.toFixed(2),
        maxMinutes: data.max_minutes,
        hasEnoughPages,
        isWithinTimeLimit
      });
      
      return hasEnoughPages && isWithinTimeLimit;
    }

    /**
     * Vérifie si l'utilisateur a scrollé jusqu'en bas d'une page
     */
    checkScrolledToBottom(data) {
      // Toujours retourner true si déjà scrollé, peu importe la page actuelle
      return getStorageRaw('scrolledToBottomHome') === 'true';
    }

    /**
     * Vérifie si une modal de compétence a été ouverte
     */
    checkSkillModalOpened(data) {
      return getStorageRaw('skillModalOpened') === 'true';
    }

    /**
     * Initialise le système de trophées
     */
    init() {
      this.setupEventListeners();
      this.setupScrollListener();
      this.trackVisit();
      this.updateTrophyDisplay();
      this.renderTrophies();
      this.updateProgress();
      this.checkTrophies();
      
      // Vérifier les trophées toutes les 30 secondes
      setInterval(() => this.checkTrophies(), 30000);
    }

    /**
     * Configure le listener de scroll pour détecter quand on atteint le bas de la page
     */
    setupScrollListener() {
      const currentPath = window.location.pathname;
      // Vérifier que c'est UNIQUEMENT la page d'accueil (racine ou index.html), PAS /portfolio/
      const isHomePage = currentPath === '/' || 
                         currentPath === '/index.html' || 
                         currentPath === '/fr/' ||
                         currentPath === '/fr/index.html';
      
      if (!isHomePage) {
        console.log('📊 Scroll listener: Pas sur la page d\'accueil, pas de tracking. Path:', currentPath);
        return;
      }
      
      console.log('📊 Scroll listener: Setup sur la page d\'accueil', currentPath);
      
      // Déjà scrollé jusqu'en bas
      if (getStorageRaw('scrolledToBottomHome') === 'true') return;
      
      let scrollTimeout;
      const checkScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          
          // Vérifier si on est à moins de 100px du bas
          if (scrollTop + windowHeight >= documentHeight - 100) {
            setStorageRaw('scrolledToBottomHome', 'true');
            window.removeEventListener('scroll', checkScroll);
            setTimeout(() => this.checkTrophies(), 500);
          }
        }, 100);
      };
      
      window.addEventListener('scroll', checkScroll);
    }

    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners() {
      // Toggle modal plein écran
      const trophiesBtn = document.querySelector('.trophies-btn');
      const modal = document.querySelector('.trophies-modal');
      const closeBtn = document.querySelector('#trophies-modal-close');
      const overlay = document.querySelector('.trophies-modal-overlay');
      
      if (trophiesBtn && modal) {
        trophiesBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openModal();
        });

        // Fermer la modal
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            this.closeModal();
          });
        }

        if (overlay) {
          overlay.addEventListener('click', () => {
            this.closeModal();
          });
        }

        // Close on Escape key
        KeyboardManager.onEscape(() => {
          if (modal.classList.contains('active')) {
            this.closeModal();
            return true;
          }
          return false;
        }, { priority: 90 });
      }

      // Note: CV download tracking is handled by UnifiedModal.downloadFile()
      // which is called when clicking on .cv-option buttons in the modal

      // Track social clicks (both .social-link and .social-btn from profile badge)
      const socialSelectors = '.social-link, .social-btn, .dock-button.social-btn';
      document.querySelectorAll(socialSelectors).forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href') || '';
          const dataSocial = link.getAttribute('data-social') || '';
          let platform = 'unknown';
          
          // Try to get platform from data-social attribute first
          if (dataSocial) {
            platform = dataSocial.toLowerCase();
          } else {
            // Fallback to parsing the href
            if (href.includes('linkedin')) platform = 'linkedin';
            else if (href.includes('github')) platform = 'github';
            else if (href.includes('twitter') || href.includes('x.com')) platform = 'twitter';
            else if (href.includes('instagram')) platform = 'instagram';
            else if (href.includes('discord')) platform = 'discord';
          }
          
          console.log('📊 Social click tracked:', platform);
          
          const socialClicks = getStorageValue('socialClicks', []);
          if (!socialClicks.includes(platform)) {
            socialClicks.push(platform);
            setStorageValue('socialClicks', socialClicks);
            console.log('📊 Social clicks count:', socialClicks.length, socialClicks);
            setTimeout(() => this.checkTrophies(), 500);
          }
        });
      });
    }

    /**
     * Ouvre la modal des trophées
     */
    openModal() {
      const modal = document.querySelector('.trophies-modal');
      if (modal) {
        ModalUtils.pauseTestimonials();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.renderModalTrophies();
        this.updateModalProgress();
        this.updateStats();
      }
    }

    /**
     * Ferme la modal des trophées
     */
    closeModal() {
      const modal = document.querySelector('.trophies-modal');
      if (modal) {
        ModalUtils.resumeTestimonials();
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    /**
     * Suit la visite actuelle
     */
    trackVisit() {
      // Track start time
      if (!sessionStorage.getItem('visitStartTime')) {
        sessionStorage.setItem('visitStartTime', Date.now().toString());
      }

      // Track visited sections
      const visitedSections = getStorageValue('visitedSections', []);
      const currentSection = this.getCurrentSection();
      if (currentSection && !visitedSections.includes(currentSection)) {
        visitedSections.push(currentSection);
        setStorageValue('visitedSections', visitedSections);
        console.log(`📊 Section visitée: ${currentSection} (Total: ${visitedSections.length})`, visitedSections);
        
        // Vérifier les trophées après avoir visité une nouvelle section
        setTimeout(() => this.checkTrophies(), 500);
      }

      // Track visited projects
      const currentPath = window.location.pathname;
      if (currentPath.includes('/projects/')) {
        const pathParts = currentPath.split('/').filter(part => part.length > 0);
        const projectIndex = pathParts.indexOf('projects');
        
        // Vérifier qu'il y a un slug après /projects/
        if (projectIndex >= 0 && projectIndex < pathParts.length - 1) {
          const projectSlug = pathParts[projectIndex + 1];
          
          if (projectSlug && projectSlug.length > 0) {
            const visitedProjects = getStorageValue('visitedProjects', []);
            
            if (!visitedProjects.includes(projectSlug)) {
              visitedProjects.push(projectSlug);
              setStorageValue('visitedProjects', visitedProjects);
              console.log(`📊 Projet visité: ${projectSlug} (Total: ${visitedProjects.length})`);
              
              // Vérifier les trophées immédiatement
              setTimeout(() => this.checkTrophies(), 500);
            }
          }
        }
      }

      // Track speed navigation
      const navigationData = getStorageValue('speedNavigation', {"pages": 0, "startTime": null});
      if (!navigationData.startTime) {
        navigationData.startTime = Date.now();
        navigationData.pages = 0;
      }
      navigationData.pages = (navigationData.pages || 0) + 1;
      setStorageValue('speedNavigation', navigationData);
      
      console.log('📊 Speed Navigation Tracked:', {
        pages: navigationData.pages,
        startTime: new Date(navigationData.startTime).toLocaleTimeString()
      });
    }

    /**
     * Détermine la section actuelle basée sur l'URL
     */
    getCurrentSection() {
      const path = window.location.pathname;
      if (path === '/' || path === '/portfolio/' || path.includes('index')) return 'home';
      if (path.includes('/skills')) return 'skills';
      if (path.includes('/projects')) return 'projects';
      if (path.includes('/posts')) return 'posts';
      if (path.includes('/educations')) return 'educations';
      if (path.includes('/experiences')) return 'experiences';
      return null;
    }

    /**
     * Vérifie les conditions des trophées
     */
    checkTrophies() {
      let newTrophies = [];
      
      this.trophies.forEach(trophy => {
        if (!this.unlockedTrophies.includes(trophy.id)) {
          // Utiliser la nouvelle méthode d'évaluation ou l'ancienne condition en fallback
          const isUnlocked = trophy.condition_type ? 
            this.evaluateCondition(trophy) : 
            (trophy.condition && trophy.condition());
            
          if (isUnlocked) {
            // unlockTrophy retourne true si le trophée a été réellement débloqué
            const wasUnlocked = this.unlockTrophy(trophy.id);
            if (wasUnlocked) {
              newTrophies.push(trophy);
            }
          }
        }
      });

      if (newTrophies.length > 0) {
        this.renderTrophies();
        this.updateProgress();
        
        // Show notification for new trophies
        newTrophies.forEach((trophy, index) => {
          setTimeout(() => this.showTrophyNotification(trophy), index * 1000);
        });
        
        // Check if 100% completion is reached
        setTimeout(() => {
          this.checkCompletionMilestone();
        }, (newTrophies.length + 1) * 1000);
      }
    }

    /**
     * Vérifie si l'utilisateur a atteint 100% et affiche une notification spéciale
     */
    checkCompletionMilestone() {
      // Get only enabled trophies
      const enabledTrophies = this.trophies.filter(t => t.enabled !== false);
      const totalEnabled = enabledTrophies.length;
      const unlockedCount = this.unlockedTrophies.filter(id => {
        const trophy = this.trophies.find(t => t.id === id);
        return trophy && trophy.enabled !== false;
      }).length;
      
      const completionPercentage = totalEnabled > 0 ? (unlockedCount / totalEnabled) * 100 : 0;
      
      // Check if 100% reached and not already shown
      if (completionPercentage === 100 && !getStorageRaw('completion100Shown')) {
        console.log('🎉 100% completion reached! Showing special notification...');
        
        setStorageRaw('completion100Shown', 'true');
        
        // Show personal notification from Clément
        if (typeof window.showNotification === 'function') {
          window.showNotification(
            'Merci beaucoup d\'avoir collectionné tous les trophées ! 🏆',
            'info',
            {
              avatar: '/images/people/clement-garcia.jpg',
              title: 'Message de Clément',
              duration: 10000
            }
          );
        }
        
        // Add to persistent notifications
        if (window.NotificationsManager && typeof window.NotificationsManager.addNotification === 'function') {
          window.NotificationsManager.addNotification(
            'Message de Clément',
            'Merci beaucoup d\'avoir collectionné tous les trophées ! 🏆',
            'info'
          );
        }
      }
    }

    /**
     * Débloque un trophée
     */
    unlockTrophy(trophyId) {
      // Double vérification pour éviter les doublons
      if (this.unlockedTrophies.includes(trophyId)) {
        console.warn(`⚠️ Trophée déjà débloqué, notification ignorée: ${trophyId}`);
        return false;
      }
      
      this.unlockedTrophies.push(trophyId);
      setStorageValue('unlockedTrophies', this.unlockedTrophies);
      
      // Store unlock date
      const now = new Date();
      const dateStr = now.toLocaleDateString('fr-FR');
      setStorageRaw(`trophy_${trophyId}_date`, dateStr);
      
      // Update trophy display immediately
      this.updateTrophyDisplay();
      
      // Get trophy details for notification
      const trophy = this.trophies.find(t => t.id === trophyId);
      
      // Add vibration if supported
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
      
      console.log(`🏆 Trophée débloqué: ${trophyId}`);
      return true;
    }

    /**
     * Test: Force le déblocage d'un trophée (pour débogage)
     * Utilisation: window.trophySystem.testUnlockTrophy('trophy_id')
     */
    testUnlockTrophy(trophyId) {
      const trophy = this.trophies.find(t => t.id === trophyId);
      if (!trophy) {
        console.error(`❌ Trophée introuvable: ${trophyId}`);
        console.log('Trophées disponibles:', this.trophies.map(t => t.id));
        return;
      }
      
      if (this.unlockedTrophies.includes(trophyId)) {
        console.warn(`⚠️ Trophée déjà débloqué: ${trophyId}`);
        return;
      }
      
      console.log(`🧪 Test: Déblocage forcé du trophée "${trophy.name}"`);
      // unlockTrophy ajoute déjà la notification persistante
      const wasUnlocked = this.unlockTrophy(trophyId);
      
      if (wasUnlocked) {
        // Afficher uniquement le popup temporaire
        this.showTrophyNotification(trophy);
        this.renderTrophies();
        this.updateProgress();
      }
    }

    /**
     * Affiche la notification de nouveau trophée
     */
    showTrophyNotification(trophy) {
      // Animation du bouton de trophées
      const trophyBtn = document.querySelector('.trophies-btn');
      if (trophyBtn) {
        trophyBtn.classList.add('new-trophy');
        // Retirer la classe après l'animation
        setTimeout(() => {
          trophyBtn.classList.remove('new-trophy');
        }, 2000);
      }
      
      // Utiliser le système de notifications standard avec icône de trophée
      const message = trophy.name;
      
      if (window.NotificationsManager) {
        // Créer un data URL avec l'emoji du trophée comme "avatar"
        // On utilise un SVG avec un grand emoji comme image
        const emojiSvg = `data:image/svg+xml,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="%23FFD700" rx="20"/>
            <text x="50" y="50" font-size="60" text-anchor="middle" dominant-baseline="central">${trophy.icon}</text>
          </svg>
        `)}`;
        
        // Afficher la notification toast avec l'emoji du trophée et style doré
        window.NotificationsManager.showNotification(message, 'trophy', {
          avatar: emojiSvg,
          title: '🏆 Trophée débloqué !',
          duration: 8000
        });
        
        // Ajouter aussi à la liste persistante des notifications
        window.NotificationsManager.addNotification('🏆 Trophée débloqué', `${trophy.icon} ${message}`, 'trophy');
      } else {
        console.warn('⚠️ NotificationsManager non disponible');
      }
    }

    /**
     * Met à jour l'affichage du compteur de trophées
     */
    updateTrophyDisplay() {
      const trophyCount = document.getElementById('trophy-count');
      const trophyProgress = document.getElementById('trophy-progress-bar');
      
      if (trophyCount) {
        const percentage = this.trophies.length > 0 ? Math.round((this.unlockedTrophies.length / this.trophies.length) * 100) : 0;
        trophyCount.textContent = `${percentage}%`;
      }
      
      if (trophyProgress) {
        const percentage = this.trophies.length > 0 ? (this.unlockedTrophies.length / this.trophies.length) * 100 : 0;
        
        // Pour le SVG circulaire, utilise stroke-dashoffset
        const circumference = 150.72; // 2 * PI * 24 (rayon du cercle)
        const offset = circumference - (percentage / 100) * circumference;
        
        trophyProgress.style.strokeDashoffset = offset;
        
        // Animation fluide
        trophyProgress.style.transition = 'stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    }

    /**
     * Met à jour la barre de progression
     */
    updateProgress() {
      this.updateTrophyDisplay();
    }

    /**
     * Rend les trophées dans le dropdown (optionnel)
     */
    renderTrophies() {
      // Cette méthode peut être utilisée si vous voulez garder un petit dropdown
      // En plus de la modal plein écran
    }

    /**
     * Rend les trophées dans la modal
     */
    renderModalTrophies() {
      const trophiesGrid = document.querySelector('.trophies-grid');
      if (!trophiesGrid) return;

      trophiesGrid.innerHTML = this.trophies.map(trophy => {
        const isUnlocked = this.unlockedTrophies.includes(trophy.id);
        const unlockDate = getStorageRaw(`trophy_${trophy.id}_date`);
        
        return `
          <div class="trophy-card ${isUnlocked ? 'unlocked' : 'locked'}">
            <div class="trophy-card-header">
              <div class="trophy-card-icon ${isUnlocked ? 'unlocked' : 'locked'}">
                ${trophy.icon}
              </div>
              <div class="trophy-card-info">
                <h3 class="trophy-card-title">${trophy.name}</h3>
                <span class="trophy-card-rarity ${trophy.rarity}">${trophy.rarity}</span>
              </div>
            </div>
            <p class="trophy-card-description">${trophy.description}</p>
            <p class="trophy-card-requirement">${trophy.requirement || trophy.description}</p>
            ${isUnlocked && unlockDate ? `<div class="trophy-card-date">Débloqué le ${unlockDate}</div>` : ''}
          </div>
        `;
      }).join('');
    }

    /**
     * Met à jour la progression dans la modal
     */
    updateModalProgress() {
      const progressFill = document.querySelector('.progress-bar-fill');
      const progressText = document.querySelector('.progress-text');
      
      if (progressFill && progressText) {
        const percentage = this.trophies.length > 0 ? (this.unlockedTrophies.length / this.trophies.length) * 100 : 0;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${Math.round(percentage)}%`;
      }
    }

    /**
     * Met à jour les statistiques dans le footer de la modal
     */
    updateStats() {
      const stats = {
        total: this.trophies.length,
        unlocked: this.unlockedTrophies.length,
        completion: this.trophies.length > 0 ? Math.round((this.unlockedTrophies.length / this.trophies.length) * 100) : 0
      };

      // Mettre à jour les valeurs des statistiques
      const totalStat = document.querySelector('[data-stat="total"]');
      const unlockedStat = document.querySelector('[data-stat="unlocked"]');
      const completionStat = document.querySelector('[data-stat="completion"]');

      if (totalStat) totalStat.textContent = stats.total;
      if (unlockedStat) unlockedStat.textContent = stats.unlocked;
      if (completionStat) completionStat.textContent = `${stats.completion}%`;
    }

    /**
     * Test: Réinitialise tous les trophées (pour débogage)
     * Utilisation: window.trophySystem.resetAllTrophies()
     */
    resetAllTrophies() {
      console.log('🔄 Réinitialisation de tous les trophées...');
      this.unlockedTrophies = [];
      setStorageValue('unlockedTrophies', []);
      
      // Remove all trophy dates
      this.trophies.forEach(trophy => {
        Storage.remove(`trophy_${trophy.id}_date`);
      });
      
      this.updateTrophyDisplay();
      this.renderTrophies();
      this.updateProgress();
      console.log('✅ Tous les trophées ont été réinitialisés');
    }

    /**
     * Test: Liste tous les trophées (pour débogage)
     * Utilisation: window.trophySystem.listTrophies()
     */
    listTrophies() {
      console.log('📜 Liste des trophées:');
      console.log('='.repeat(50));
      this.trophies.forEach(trophy => {
        const isUnlocked = this.unlockedTrophies.includes(trophy.id);
        const status = isUnlocked ? '✅ Débloqué' : '🔒 Verrouillé';
        console.log(`${status} | ${trophy.icon} ${trophy.name}`);
        console.log(`   ID: ${trophy.id}`);
        console.log(`   Description: ${trophy.description}`);
        console.log(`   Rareté: ${trophy.rarity}`);
        if (isUnlocked) {
          const date = getStorageRaw(`trophy_${trophy.id}_date`);
          if (date) console.log(`   Débloqué le: ${date}`);
        }
        console.log('-'.repeat(50));
      });
      console.log(`\nTotal: ${this.trophies.length} | Débloqués: ${this.unlockedTrophies.length} | Progression: ${Math.round((this.unlockedTrophies.length / this.trophies.length) * 100)}%`);
    }

    /**
     * Test: Affiche l'aide pour les commandes de débogage
     * Utilisation: window.trophySystem.help()
     */
    help() {
      console.log('🏆 SYSTÈME DE TROPHÉES - COMMANDES DE TEST');
      console.log('='.repeat(60));
      console.log('');
      console.log('📜 Lister tous les trophées:');
      console.log('   window.trophySystem.listTrophies()');
      console.log('');
      console.log('🧪 Débloquer un trophée:');
      console.log('   window.trophySystem.testUnlockTrophy("trophy_id")');
      console.log('');
      console.log('🔄 Réinitialiser tous les trophées:');
      console.log('   window.trophySystem.resetAllTrophies()');
      console.log('');
      console.log('📊 Voir les statistiques actuelles:');
      console.log('   Débloqués: ' + this.unlockedTrophies.length + '/' + this.trophies.length);
      console.log('   Progression: ' + Math.round((this.unlockedTrophies.length / this.trophies.length) * 100) + '%');
      console.log('');
      console.log('='.repeat(60));
    }
  }

  // Initialisation du système de trophées quand le DOM est chargé
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🏆 Initializing Trophy System...');
    window.trophySystem = new TrophySystem();
    console.log('✅ Trophy System initialized:', window.trophySystem);
  });

  // Export pour utilisation externe
  window.TrophySystem = TrophySystem;

})();

