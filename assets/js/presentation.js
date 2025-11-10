/**
 * Presentation Page - Interactive Navigation & Carousel
 * Handles scroll-based section transitions and project carousel
 */

(function() {
  'use strict';
  
  // State management
  let currentSection = 0;
  let currentProject = 0;
  let isTransitioning = false;
  let touchStartY = 0;
  let touchEndY = 0;
  
  // DOM elements
  const sections = document.querySelectorAll('.presentation-section');
  const totalSections = sections.length;
  
  // Projects data (from HTML script tag)
  const projects = window.projectsData || [];
  
  /**
   * Generate PS5-style sector badge HTML
   */
  function generateSectorBadge(sector) {
    const sectorMap = {
      'games-professionnel': { primary: 'Game', secondary: 'Pro' },
      'games-personnel': { primary: 'Game', secondary: 'Perso' },
      'games-gamejams': { primary: 'Game', secondary: 'Jams' },
      'appsweb-professionnel': { primary: 'App', secondary: 'Pro' },
      'appsweb-etude': { primary: 'App', secondary: 'Étude' },
      'mods': { primary: 'Mods', secondary: '' },
      'tools': { primary: 'Tools', secondary: '' }
    };
    
    const sectorData = sectorMap[sector] || { 
      primary: sector.charAt(0).toUpperCase() + sector.slice(1), 
      secondary: '' 
    };
    
    let html = `<div class="ps5-sector-badge">
      <span class="sector-primary">${sectorData.primary}</span>`;
    
    if (sectorData.secondary) {
      html += `
      <span class="sector-divider"></span>
      <span class="sector-secondary">${sectorData.secondary}</span>`;
    }
    
    html += `</div>`;
    
    return html;
  }
  
  /**
   * Initialize presentation
   */
  function init() {
    if (sections.length === 0) {
      console.warn('No presentation sections found');
      return;
    }
    
    console.log('Initializing presentation with', projects.length, 'projects');
    
    setupEventListeners();
    initializePS5Header();
    initializeCarousel();
    updateCarousel();
    updateTime();
    
    // Set first section as active
    sections[0].classList.add('active');
    
    // Update time every second
    setInterval(updateTime, 1000);
    
    console.log('Presentation initialized successfully');
  }
  
  /**
   * Setup event listeners for navigation
   */
  function setupEventListeners() {
    // Mouse wheel navigation
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    // Keyboard navigation
    window.addEventListener('keydown', handleKeyboard);
    
    // Touch navigation
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Carousel controls
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    
    if (prevBtn) prevBtn.addEventListener('click', () => navigateCarousel(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigateCarousel(1));
    
    // Prevent default scroll behavior
    document.body.style.overflow = 'hidden';
  }
  
  /**
   * Handle mouse wheel scroll
   */
  function handleWheel(e) {
    if (isTransitioning) {
      e.preventDefault();
      return;
    }
    
    e.preventDefault();
    
    const delta = Math.sign(e.deltaY);
    
    // If we're on the projects section, navigate through projects first
    if (currentSection === 1) {
      if (delta > 0) {
        // Scroll down - try to go to next project first
        if (currentProject < projects.length - 1) {
          navigateCarousel(1);
          return;
        } else {
          // Already at last project, go to next section
          navigateSection(1);
        }
      } else if (delta < 0) {
        // Scroll up - try to go to previous project first
        if (currentProject > 0) {
          navigateCarousel(-1);
          return;
        } else {
          // Already at first project, go to previous section
          navigateSection(-1);
        }
      }
    } else {
      // Not on projects section, normal section navigation
      if (delta > 0) {
        navigateSection(1);
      } else if (delta < 0) {
        navigateSection(-1);
      }
    }
  }
  
  /**
   * Handle keyboard navigation
   */
  function handleKeyboard(e) {
    if (isTransitioning) return;
    
    switch(e.key) {
      case 'ArrowDown':
      case 'PageDown':
        e.preventDefault();
        navigateSection(1);
        break;
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        navigateSection(-1);
        break;
      case 'ArrowLeft':
        if (currentSection === 1) {
          e.preventDefault();
          navigateCarousel(-1);
        }
        break;
      case 'ArrowRight':
        if (currentSection === 1) {
          e.preventDefault();
          navigateCarousel(1);
        }
        break;
      case 'Home':
        e.preventDefault();
        goToSection(0);
        break;
      case 'End':
        e.preventDefault();
        goToSection(totalSections - 1);
        break;
    }
  }
  
  /**
   * Handle touch start
   */
  function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
  }
  
  /**
   * Handle touch end
   */
  function handleTouchEnd(e) {
    if (isTransitioning) return;
    
    touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY - touchEndY;
    
    // Minimum swipe distance
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0) {
        // Swipe up - go to next section
        navigateSection(1);
      } else {
        // Swipe down - go to previous section
        navigateSection(-1);
      }
    }
  }
  
  /**
   * Navigate to relative section
   */
  function navigateSection(direction) {
    const nextSection = currentSection + direction;
    
    if (nextSection >= 0 && nextSection < totalSections) {
      goToSection(nextSection);
    }
  }
  
  /**
   * Go to specific section
   */
  function goToSection(index) {
    if (isTransitioning || index === currentSection) return;
    
    isTransitioning = true;
    
    const currentSectionEl = sections[currentSection];
    const nextSectionEl = sections[index];
    
    // Add exiting class to current section
    currentSectionEl.classList.add('exiting');
    currentSectionEl.classList.remove('active');
    
    // Add active class to next section
    nextSectionEl.classList.add('active');
    nextSectionEl.classList.remove('exiting');
    
    currentSection = index;
    
    // Allow next transition after animation completes
    setTimeout(() => {
      isTransitioning = false;
      currentSectionEl.classList.remove('exiting');
    }, 800);
  }
  
  /**
   * Initialize PS5-style header with project icons
   */
  function initializePS5Header() {
    const iconsRow = document.getElementById('projectsIconsRow');
    const cardsRow = document.getElementById('projectsCardsRow');
    
    if (!iconsRow) return;
    
    // Clear existing icons
    iconsRow.innerHTML = '';
    if (cardsRow) cardsRow.innerHTML = '';
    
    // Create icon for each project
    projects.forEach((project, index) => {
      // Top icons row
      const icon = document.createElement('div');
      icon.className = 'ps5-project-icon';
      if (index === 0) icon.classList.add('active');
      
      const img = document.createElement('img');
      img.src = project.logo;
      img.alt = project.title;
      
      icon.appendChild(img);
      
      icon.addEventListener('click', () => {
        goToProject(index);
      });
      
      iconsRow.appendChild(icon);
      
      // Bottom cards row
      if (cardsRow) {
        const card = document.createElement('div');
        card.className = 'ps5-project-card';
        
        const cardImg = document.createElement('img');
        cardImg.src = project.visual.includes('youtube') ? 
          `https://img.youtube.com/vi/${project.visual.match(/embed\/([^?]+)/)?.[1]}/maxresdefault.jpg` : 
          project.visual;
        cardImg.alt = project.title;
        
        const cardTitle = document.createElement('div');
        cardTitle.className = 'card-title';
        cardTitle.textContent = project.title;
        
        card.appendChild(cardImg);
        card.appendChild(cardTitle);
        
        card.addEventListener('click', () => {
          goToProject(index);
        });
        
        cardsRow.appendChild(card);
      }
    });
  }
  
  /**
   * Update time display
   */
  function updateTime() {
    const timeEl = document.getElementById('currentTime');
    if (!timeEl) return;
    
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeEl.textContent = `${hours}:${minutes}`;
  }
  
  /**
   * Initialize carousel (deprecated - kept for compatibility)
   */
  function initializeCarousel() {
    const dotsContainer = document.getElementById('carouselDots');
    
    if (!dotsContainer) return;
    
    // Clear existing dots
    dotsContainer.innerHTML = '';
    
    // Create dot for each project
    projects.forEach((project, index) => {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot';
      if (index === 0) dot.classList.add('active');
      
      dot.addEventListener('click', () => {
        goToProject(index);
      });
      
      dotsContainer.appendChild(dot);
    });
  }
  
  /**
   * Navigate carousel
   */
  function navigateCarousel(direction) {
    let nextProject = currentProject + direction;
    
    // Loop around
    if (nextProject < 0) {
      nextProject = projects.length - 1;
    } else if (nextProject >= projects.length) {
      nextProject = 0;
    }
    
    goToProject(nextProject);
  }
  
  /**
   * Go to specific project
   */
  function goToProject(index) {
    if (index === currentProject || index < 0 || index >= projects.length) return;
    
    // Add transitioning class for animation
    const projectDisplay = document.querySelector('.project-display');
    const projectInfo = document.querySelector('.project-info');
    
    if (projectDisplay) projectDisplay.classList.add('transitioning');
    if (projectInfo) projectInfo.classList.add('transitioning');
    
    // Update PS5 header icons
    const icons = document.querySelectorAll('.ps5-project-icon');
    icons.forEach((icon, i) => {
      if (i === index) {
        icon.classList.add('active');
      } else {
        icon.classList.remove('active');
      }
    });
    
    // Update carousel dots (if present)
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    // Update after a short delay to allow fade out
    setTimeout(() => {
      currentProject = index;
      updateCarousel();
      
      // Remove transitioning class after update
      setTimeout(() => {
        if (projectDisplay) projectDisplay.classList.remove('transitioning');
        if (projectInfo) projectInfo.classList.remove('transitioning');
      }, 50);
    }, 300);
  }
  
  /**
   * Update carousel display (PS5 Hero style)
   */
  function updateCarousel() {
    const project = projects[currentProject];
    
    if (!project) {
      console.error('No project found at index', currentProject);
      return;
    }
    
    console.log('Updating PS5 hero to project:', project.title);
    
    // Update hero background
    const heroBackground = document.getElementById('ps5HeroBackground');
    if (heroBackground) {
      heroBackground.innerHTML = '';
      
      if (project.visualType === 'video') {
        const iframe = document.createElement('iframe');
        iframe.src = project.visual + '?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&playlist=' + project.visual.match(/embed\/([^?]+)/)?.[1];
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.setAttribute('frameborder', '0');
        heroBackground.appendChild(iframe);
        console.log('Hero video loaded:', project.visual);
      } else {
        heroBackground.style.backgroundImage = `url(${project.visual})`;
        console.log('Hero image loaded:', project.visual);
      }
    }
    
    // Update hero logo
    const heroLogo = document.getElementById('heroLogo');
    if (heroLogo) {
      heroLogo.src = project.logo;
      heroLogo.alt = project.title;
    }
    
    // Update hero subtitle
    const heroSubtitle = document.getElementById('heroSubtitle');
    if (heroSubtitle) {
      heroSubtitle.textContent = project.stats.split('•')[0].trim();
    }
    
    // Update sector badge
    const sectorEl = document.getElementById('projectSector');
    if (sectorEl) {
      sectorEl.innerHTML = generateSectorBadge(project.sector);
    }
  }
  
  /**
   * Update preview items in background (deprecated - kept for compatibility)
   */
  function updatePreviewItems() {
    const prevIndex = (currentProject - 1 + projects.length) % projects.length;
    const nextIndex = (currentProject + 1) % projects.length;
    
    const prevEl = document.getElementById('prevProject');
    const nextEl = document.getElementById('nextProject');
    
    if (prevEl && projects[prevIndex]) {
      prevEl.style.backgroundImage = `url(${projects[prevIndex].logo})`;
    }
    
    if (nextEl && projects[nextIndex]) {
      nextEl.style.backgroundImage = `url(${projects[nextIndex].logo})`;
    }
  }
  
  /**
   * Update carousel dots
   */
  function updateCarouselDots() {
    const dots = document.querySelectorAll('.carousel-dot');
    
    dots.forEach((dot, index) => {
      if (index === currentProject) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();
