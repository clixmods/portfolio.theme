/**
 * Personal Notifications System V2
 * Automatically triggers personalized notifications when visiting project pages
 * Messages from Clément about each specific project
 */

(function() {
  'use strict';
  
  // Protection against multiple executions
  if (window.personalNotificationsInitialized) {
    return;
  }
  
  // Storage key for tracking shown notifications
  const STORAGE_KEY = 'personalNotifications_shown';
  
  // Configuration for project notifications
  const PROJECT_NOTIFICATIONS = {
    'stone-keepers': {
      title: 'Message de Clément',
      message: 'Stone Keeper est un projet qui me tient énormément à cœur ! C\'est mon premier grand jeu que j\'ai imaginé et dirigé de A à Z. Développé en 2 mois avec une équipe passionnée, il représente pour moi bien plus qu\'un simple projet étudiant.',
      avatar: '/images/people/clement-garcia.jpg',
      delay: 2000,
      duration: 10000
    },
    'stone-keeper-2': {
      title: 'Message de Clément',
      message: 'Stone Keeper 2 a été un vrai challenge ! Réalisé en distanciel pendant mon alternance et mes études à l\'IUT, j\'ai pu pousser encore plus loin les systèmes du premier jeu avec de nouveaux outils et mécaniques.',
      avatar: '/images/people/clement-garcia.jpg',
      delay: 2000,
      duration: 10000
    },
    'terra-memoria': {
      title: 'Message de Clément',
      message: 'Terra Memoria est mon projet professionnel chez Studio La Moutarde ! Nominé aux Pégases du Jeu Vidéo 2025, c\'est une belle aventure qui m\'a permis de travailler sur un RPG complet avec une équipe incroyable.',
      avatar: '/images/people/clement-garcia.jpg',
      delay: 2000,
      duration: 10000
    },
    'stholen': {
      title: 'Message de Clément',
      message: 'Stholen est un projet d\'équipe où j\'ai pu me concentrer sur le level design et la programmation gameplay. Une belle expérience de collaboration et de création d\'univers immersif !',
      avatar: '/images/people/clement-garcia.jpg',
      delay: 2000,
      duration: 10000
    },
    'nuketown-zombies': {
      title: 'Message de Clément',
      message: 'Nuketown Zombies est une recréation fidèle de la map emblématique de Call of Duty. Un projet passionnant qui m\'a permis de perfectionner mes compétences en level design et optimisation 3D !',
      avatar: '/images/people/clement-garcia.jpg',
      delay: 2000,
      duration: 10000
    },
    'zombies-experience': {
      title: 'Message de Clément',
      message: 'Zombies Experience est le framework custom que j\'ai développé pour Black Ops 3. C\'est une base technique qui a permis de créer plusieurs maps zombies avec des systèmes complexes !',
      avatar: '/images/people/clement-garcia.jpg',
      delay: 2000,
      duration: 10000
    },
    'mori-rebirth': {
      title: 'Message de Clément',
      message: 'Mori Rebirth est l\'une de mes premières maps zombies complètes. Un projet qui m\'a appris énormément sur le level design et la création d\'ambiance immersive !',
      avatar: '/images/people/clement-garcia.jpg',
      delay: 2000,
      duration: 10000
    },
    'event-platform': {
      title: 'Message de Clément',
      message: 'Ma première grande plateforme fullstack ! Vue.js + ASP.NET Core pour gérer des événements. Un projet qui m\'a fait progresser énormément en architecture logicielle.',
      avatar: '/images/people/clement-garcia.jpg',
      delay: 2000,
      duration: 10000
    },
    'portfolio-website': {
      title: 'Message de Clément',
      message: 'Mon portfolio actuel ! Conçu avec Hugo et inspiré de macOS, c\'est un projet qui évolue constamment et qui me permet d\'expérimenter avec des designs modernes.',
      avatar: '/images/people/clement-garcia.jpg',
      delay: 2000,
      duration: 10000
    },
    'farm-remastered': {
      title: 'Message de Clément',
      message: 'FARM Remastered est l\'un de mes premiers gros projets de modding ! Une refonte complète de la map classique avec de nouvelles mécaniques et visuels améliorés.',
      avatar: '/images/people/clement-garcia.jpg',
      delay: 2000,
      duration: 10000
    }
  };
  
  // Configuration for education page notifications
  const EDUCATION_NOTIFICATIONS = {
    'bachelor-game-developer': {
      title: 'Message de Clément',
      message: 'Mon Bachelor à e-artsup a été une période incroyable ! 2 ans intensifs avec 13 projets de jeux vidéo réalisés en équipe. C\'est là que j\'ai développé mes bases solides en Unity et C#.',
      avatar: '/images/people/clement-garcia.jpg',
      delay: 2000,
      duration: 10000
    },
    'but-integration-applications-management-si': {
      title: 'Message de Clément',
      message: 'Le BUT IAMSI à l\'IUT de Montpellier m\'a permis de compléter mes compétences techniques avec une vision plus large du développement d\'applications et du management des SI. Formation que je suis actuellement en alternance !',
      avatar: '/images/people/clement-garcia.jpg',
      delay: 2000,
      duration: 10000
    },
    'licence-etude-cinema': {
      title: 'Message de Clément',
      message: 'Ma licence en études cinématographiques m\'a apporté une sensibilité artistique et narrative précieuse pour la conception de jeux vidéo. La narration visuelle est essentielle dans le game design !',
      avatar: '/images/people/clement-garcia.jpg',
      delay: 2000,
      duration: 10000
    },
    'licence-management-technologies-sciences': {
      title: 'Message de Clément',
      message: 'Cette licence m\'a donné une vision plus managériale et organisationnelle du développement, compétences essentielles pour coordonner des projets d\'équipe.',
      avatar: '/images/people/clement-garcia.jpg',
      delay: 2000,
      duration: 10000
    }
  };
  
  // Configuration for experience page notifications
  const EXPERIENCE_NOTIFICATIONS = {
    'studio-la-moutarde': {
      title: 'Message de Clément',
      message: 'Mon alternance chez Studio La Moutarde est une expérience professionnelle enrichissante ! J\'ai travaillé sur Terra Memoria (nominé aux Pégases 2025) et développé des outils internes. Une équipe passionnée et des projets ambitieux !',
      avatar: '/images/people/clement-garcia.jpg',
      delay: 2000,
      duration: 10000
    }
  };
  
  // Configuration for people modal notifications
  const PEOPLE_NOTIFICATIONS = {
    'theo-carouge': {
      title: 'Message de Clément',
      message: 'Théo est un excellent développeur et level designer avec qui j\'ai travaillé sur Stone Keeper. Sa créativité et son sérieux ont été essentiels à la réussite du projet !',
      avatar: '/images/people/clement-garcia.jpg',
      delay: 1500,
      duration: 8000
    },
    'jeremy-ferreira': {
      title: 'Message de Clément',
      message: 'Jeremy est un développeur talentueux avec qui j\'ai collaboré sur plusieurs projets Unity. Son expertise technique et sa passion pour le développement sont impressionnantes !',
      avatar: '/images/people/clement-garcia.jpg',
      delay: 1500,
      duration: 8000
    },
    'lea-hoaraux': {
      title: 'Message de Clément',
      message: 'Léa est une artiste 3D incroyablement talentueuse ! Son travail sur Stone Keeper a donné vie à l\'univers du jeu. Une collaboratrice créative et professionnelle !',
      avatar: '/images/people/clement-garcia.jpg',
      delay: 1500,
      duration: 8000
    },
    'alix-granlin': {
      title: 'Message de Clément',
      message: 'Alix a créé des environnements magnifiques pour Stone Keeper. Son sens artistique et son attention aux détails ont vraiment fait la différence !',
      avatar: '/images/people/clement-garcia.jpg',
      delay: 1500,
      duration: 8000
    },
    'xavier-gappe': {
      title: 'Message de Clément',
      message: 'Xavier est un artiste 3D et level designer très polyvalent. Sa contribution aux projets a toujours été de grande qualité !',
      avatar: '/images/people/clement-garcia.jpg',
      delay: 1500,
      duration: 8000
    }
  };
  
  /**
   * Gets the current page slug and type from URL
   * Returns { type: 'project'|'education'|'experience', slug: 'page-slug' }
   */
  function getCurrentPageInfo() {
    const path = window.location.pathname;
    
    // Check for projects
    const projectMatch = path.match(/\/projects\/([^\/]+)/);
    if (projectMatch) {
      return { type: 'project', slug: projectMatch[1] };
    }
    
    // Check for educations
    const educationMatch = path.match(/\/educations\/([^\/]+)/);
    if (educationMatch) {
      return { type: 'education', slug: educationMatch[1] };
    }
    
    // Check for experiences
    const experienceMatch = path.match(/\/experiences\/([^\/]+)/);
    if (experienceMatch) {
      return { type: 'experience', slug: experienceMatch[1] };
    }
    
    return null;
  }
  
  /**
   * Checks if notification was already shown for this page
   */
  function wasNotificationShown(pageType, pageSlug) {
    try {
      const shown = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const key = `${pageType}-${pageSlug}`;
      return shown[key] === true;
    } catch (error) {
      console.warn('Error checking notification status:', error);
      return false;
    }
  }
  
  /**
   * Marks notification as shown for a page
   */
  function markNotificationAsShown(pageType, pageSlug) {
    try {
      const shown = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const key = `${pageType}-${pageSlug}`;
      shown[key] = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shown));
    } catch (error) {
      console.warn('Error saving notification status:', error);
    }
  }
  
  /**
   * Shows a personalized toast notification
   */
  function showPersonalNotification(config) {
    console.log('🔔 showPersonalNotification called with config:', config);
    console.log('🔔 window.showNotification exists?', typeof window.showNotification);
    
    // Show toast notification
    if (typeof window.showNotification === 'function') {
      console.log('🔔 Calling window.showNotification...');
      window.showNotification(config.message, 'info', {
        avatar: config.avatar,
        title: config.title,
        duration: config.duration || 8000
      });
    } else {
      console.warn('⚠️ showNotification function not available');
    }
    
    // Add to persistent notifications list
    if (window.NotificationsManager && typeof window.NotificationsManager.addNotification === 'function') {
      console.log('🔔 Adding to persistent notifications...');
      window.NotificationsManager.addNotification(
        config.title || 'Message de Clément',
        config.message,
        'info'
      );
    } else {
      console.warn('⚠️ NotificationsManager not available');
    }
  }
  
  /**
   * Handles person modal notifications
   */
  function handlePersonModalNotification(personId) {
    console.log('🔔 Person modal opened:', personId);
    
    const notificationConfig = PEOPLE_NOTIFICATIONS[personId];
    
    if (!notificationConfig) {
      console.log('🔔 No notification configured for this person');
      return;
    }
    
    // Check if already shown
    if (wasNotificationShown('person', personId)) {
      console.log('🔔 Notification already shown for this person');
      return;
    }
    
    console.log('🔔 Scheduling person notification');
    
    const delay = notificationConfig.delay || 1500;
    
    setTimeout(() => {
      console.log('🔔 Showing person notification');
      showPersonalNotification(notificationConfig);
      markNotificationAsShown('person', personId);
    }, delay);
  }
  
  /**
   * Initializes personal notifications for current page
   */
  function initPersonalNotifications() {
    console.log('🔔 Personal Notifications: Initializing...');
    const pageInfo = getCurrentPageInfo();
    console.log('🔔 Page info detected:', pageInfo);
    
    if (!pageInfo) {
      console.log('🔔 Not on a supported page type, skipping');
      return;
    }
    
    // Get the appropriate notification config based on page type
    let notificationConfig = null;
    switch (pageInfo.type) {
      case 'project':
        notificationConfig = PROJECT_NOTIFICATIONS[pageInfo.slug];
        break;
      case 'education':
        notificationConfig = EDUCATION_NOTIFICATIONS[pageInfo.slug];
        break;
      case 'experience':
        notificationConfig = EXPERIENCE_NOTIFICATIONS[pageInfo.slug];
        break;
    }
    
    console.log('🔔 Notification config found:', notificationConfig ? 'Yes' : 'No');
    
    if (!notificationConfig) {
      console.log('🔔 No notification configured for this page');
      return;
    }
    
    // Check if already shown
    if (wasNotificationShown(pageInfo.type, pageInfo.slug)) {
      console.log('🔔 Notification already shown for this page');
      return;
    }
    
    console.log('🔔 Scheduling notification to show in', notificationConfig.delay, 'ms');
    
    // Wait for page to be fully loaded and delay before showing
    const delay = notificationConfig.delay || 2000;
    
    setTimeout(() => {
      console.log('🔔 Showing notification now...');
      showPersonalNotification(notificationConfig);
      markNotificationAsShown(pageInfo.type, pageInfo.slug);
    }, delay);
  }
  
  /**
   * Expose function to reset notifications (for testing)
   */
  window.resetPersonalNotifications = function() {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ Personal notifications reset. Refresh the page to see them again.');
  };
  
  /**
   * Wraps the openPersonModal function to trigger notifications
   */
  function setupPersonModalListener() {
    // Protection against multiple wrapping
    if (window._personModalWrapped) {
      console.log('🔔 Person modal already wrapped, skipping');
      return;
    }
    
    // Wait for openPersonModal to be available
    const checkInterval = setInterval(() => {
      if (typeof window.openPersonModal === 'function' && !window._personModalWrapped) {
        clearInterval(checkInterval);
        
        // Mark as wrapped to prevent multiple wrappings
        window._personModalWrapped = true;
        
        // Store original function
        const originalOpenPersonModal = window.openPersonModal;
        
        // Wrap it with our notification trigger
        window.openPersonModal = function(personId) {
          console.log('🔔 Intercepted openPersonModal call for:', personId);
          
          // Trigger notification
          handlePersonModalNotification(personId);
          
          // Call original function
          return originalOpenPersonModal.apply(this, arguments);
        };
        
        console.log('✅ Person modal listener setup complete');
      }
    }, 100);
    
    // Stop checking after 5 seconds
    setTimeout(() => clearInterval(checkInterval), 5000);
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initPersonalNotifications();
      setupPersonModalListener();
    });
  } else {
    initPersonalNotifications();
    setupPersonModalListener();
  }
  
  // Mark as initialized
  window.personalNotificationsInitialized = true;
  
})();
