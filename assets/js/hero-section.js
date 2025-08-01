/**
 * HERO SECTION - Scripts d'interaction
 * Gestion des interactions de la section héroïque
 */

document.addEventListener('DOMContentLoaded', function() {
  // Smooth scroll pour les liens CTA
  const ctaLinks = document.querySelectorAll('.cta-primary, .cta-secondary');
  
  ctaLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Vérifier si c'est un lien ancre
      if (href && href.startsWith('#')) {
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Smooth scroll vers la section
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Ajouter une classe d'animation à la section cible
          targetElement.classList.add('section-highlight');
          setTimeout(() => {
            targetElement.classList.remove('section-highlight');
          }, 2000);
        }
      }
    });
  });
  
  // Gestion du scroll indicator
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function() {
      // Scroll vers la première section après le hero
      const firstSection = document.querySelector('.profile-section, .container section:first-child, .main-content section:first-child');
      if (firstSection) {
        firstSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        // Fallback : scroll d'une hauteur d'écran
        window.scrollBy({
          top: window.innerHeight,
          behavior: 'smooth'
        });
      }
    });
  }
  
  // Animation d'apparition des éléments hero au chargement
  const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-cta, .scroll-indicator');
  
  // Observer d'intersection pour l'animation d'entrée
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  // Ajouter les animations d'entrée avec délai
  heroElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    element.style.transitionDelay = `${index * 0.2}s`;
    
    observer.observe(element);
  });
  
  // Parallax subtil pour le contenu hero pendant le scroll
  let ticking = false;
  
  function updateHeroParallax() {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && scrolled < window.innerHeight) {
      const parallaxOffset = scrolled * 0.3;
      heroContent.style.transform = `translateY(${parallaxOffset}px)`;
    }
    
    ticking = false;
  }
  
  function requestParallaxUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateHeroParallax);
      ticking = true;
    }
  }
  
  // Activer le parallax seulement si pas de motion réduite
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', requestParallaxUpdate);
  }
  
  // Masquer/afficher le scroll indicator selon la position
  function updateScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      const scrolled = window.pageYOffset;
      const windowHeight = window.innerHeight;
      
      if (scrolled > windowHeight * 0.1) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
      } else {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.pointerEvents = 'auto';
      }
    }
  }
  
  window.addEventListener('scroll', updateScrollIndicator);
  
  // Effet de typing pour le titre (optionnel)
  function addTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && heroTitle.textContent) {
      const text = heroTitle.textContent;
      const typingSpeed = 100; // ms par caractère
      
      heroTitle.textContent = '';
      heroTitle.style.borderRight = '2px solid #4fd1c7';
      
      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          heroTitle.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, typingSpeed);
        } else {
          // Supprimer le curseur après la fin
          setTimeout(() => {
            heroTitle.style.borderRight = 'none';
          }, 1000);
        }
      };
      
      // Démarrer l'effet après un court délai
      setTimeout(typeWriter, 1000);
    }
  }
  
  // Décommenter pour activer l'effet de typing
  // addTypingEffect();
});

// CSS pour les animations via JavaScript
const animationStyles = `
  .animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  
  .section-highlight {
    animation: sectionHighlight 2s ease-out;
  }
  
  @keyframes sectionHighlight {
    0% {
      background: rgba(79, 209, 199, 0.1);
      transform: scale(1.01);
    }
    100% {
      background: transparent;
      transform: scale(1);
    }
  }
`;

// Injecter les styles d'animation
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);
