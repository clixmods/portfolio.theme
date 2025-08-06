/**
 * Système de Trophées - Portfolio
 * Version: 2.0.0
 * Description: Système de gamification avec trophées débloquables
 */

(function() {
  'use strict';

  class TrophySystem {
    constructor() {
      this.trophies = [];
      this.unlockedTrophies = JSON.parse(localStorage.getItem('unlockedTrophies') || '[]');
      this.sessionStartTime = Date.now();
      this.visitStartTime = parseInt(localStorage.getItem('visitStartTime')) || Date.now();
      
      // Si c'est une nouvelle session, sauvegarder le temps de début
      if (!localStorage.getItem('visitStartTime')) {
        localStorage.setItem('visitStartTime', this.visitStartTime.toString());
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
        
        case 'theme_change':
          return this.checkTheme(condition_data);
        
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
      
      // Vérifier l'exclusion
      if (exclude_paths && exclude_paths.some(path => currentPath.includes(path) && currentPath !== path)) {
        return false;
      }
      
      // Vérifier l'inclusion
      return paths.some(path => 
        currentPath === path || 
        currentPath.includes(path) || 
        (path.includes('index') && (currentPath === '/' || currentPath.includes('index')))
      );
    }

    /**
     * Vérifie le nombre d'éléments visités
     */
    checkVisitedCount(data) {
      const { storage_key, min_count } = data;
      const visited = JSON.parse(localStorage.getItem(storage_key) || '[]');
      return visited.length >= min_count;
    }

    /**
     * Vérifie le thème actuel
     */
    checkTheme(data) {
      return localStorage.getItem('theme') === data.theme;
    }

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
      return localStorage.getItem(data.action) === 'true';
    }

    /**
     * Vérifie si une section a été vue
     */
    checkSectionViewed(data) {
      const viewedSections = JSON.parse(localStorage.getItem('viewedSections') || '[]');
      return viewedSections.includes(data.section);
    }

    /**
     * Vérifie si toutes les sections requises ont été visitées
     */
    checkAllSectionsVisited(data) {
      const viewedSections = JSON.parse(localStorage.getItem('viewedSections') || '[]');
      return data.required_sections.every(section => viewedSections.includes(section));
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
      const navigationData = JSON.parse(localStorage.getItem('speedNavigation') || '{"pages": 0, "startTime": null}');
      if (!navigationData.startTime) {
        navigationData.startTime = Date.now();
        navigationData.pages = 1;
        localStorage.setItem('speedNavigation', JSON.stringify(navigationData));
        return false;
      }
      
      const timeElapsed = (Date.now() - navigationData.startTime) / (1000 * 60); // en minutes
      return navigationData.pages >= data.min_pages && timeElapsed <= data.max_minutes;
    }

    /**
     * Initialise le système de trophées
     */
    init() {
      this.setupEventListeners();
      this.trackVisit();
      this.updateTrophyDisplay();
      this.renderTrophies();
      this.updateProgress();
      this.checkTrophies();
      
      // Vérifier les trophées toutes les 30 secondes
      setInterval(() => this.checkTrophies(), 30000);
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

        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && modal.classList.contains('active')) {
            this.closeModal();
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
          
          const socialClicks = JSON.parse(localStorage.getItem('socialClicks') || '[]');
          if (!socialClicks.includes(platform)) {
            socialClicks.push(platform);
            localStorage.setItem('socialClicks', JSON.stringify(socialClicks));
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

    /**
     * Détermine la section actuelle basée sur l'URL
     */
    getCurrentSection() {
      const path = window.location.pathname;
      if (path === '/' || path === '/portfolio/' || path.includes('index')) return 'home';
      if (path.includes('/portfolio')) return 'portfolio';
      if (path.includes('/projects')) return 'projects';
      if (path.includes('/posts')) return 'posts';
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
            this.unlockTrophy(trophy.id);
            newTrophies.push(trophy);
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
      }
    }

    /**
     * Débloque un trophée
     */
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
          navigator.vibrate(200);
        }
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
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 500);
      }, 3000);
    }

    /**
     * Met à jour l'affichage du compteur de trophées
     */
    updateTrophyDisplay() {
      const trophyCount = document.getElementById('trophy-count');
      const trophyProgress = document.getElementById('trophy-progress-bar');
      
      if (trophyCount) {
        trophyCount.textContent = `${this.unlockedTrophies.length}/${this.trophies.length}`;
      }
      
      if (trophyProgress) {
        const percentage = this.trophies.length > 0 ? (this.unlockedTrophies.length / this.trophies.length) * 100 : 0;
        trophyProgress.style.width = `${percentage}%`;
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
        const unlockDate = localStorage.getItem(`trophy_${trophy.id}_date`);
        
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
  }

  // Initialisation du système de trophées quand le DOM est chargé
  document.addEventListener('DOMContentLoaded', () => {
    window.trophySystem = new TrophySystem();
  });

  // Export pour utilisation externe
  window.TrophySystem = TrophySystem;

})();
