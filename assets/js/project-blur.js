/**
 * PROJECT HERO BLUR EFFECT
 * 
 * Gère l'effet de blur progressif du background hero quand on scroll
 * vers la section de contenu texte
 */

document.addEventListener('DOMContentLoaded', function() {
    const projectHero = document.querySelector('.project-hero');
    const transitionElement = document.querySelector('.hero-to-content-transition');
    
    if (!projectHero || !transitionElement) return;
    
    let isScrolling = false;
    
    function updateBlurEffect() {
        if (isScrolling) return;
        
        isScrolling = true;
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const heroHeight = projectHero.offsetHeight;
            const transitionStart = heroHeight * 0.6; // Commence à 60% du hero
            const transitionEnd = heroHeight;
            
            // Calcule le pourcentage de progression dans la zone de transition
            let blurProgress = 0;
            if (scrollY >= transitionStart) {
                blurProgress = Math.min(
                    (scrollY - transitionStart) / (transitionEnd - transitionStart), 
                    1
                );
            }
            
            // Applique le blur progressif avec une courbe d'easing
            const blurValue = blurProgress * blurProgress * 20; // Easing quadratique
            const opacity = Math.min(blurProgress * 1.5, 1); // Opacité progressive
            
            // Applique l'effet sur le pseudo-élément ::after du hero
            projectHero.style.setProperty('--blur-intensity', `${blurValue}px`);
            projectHero.style.setProperty('--blur-opacity', opacity);
            
            // Met à jour le backdrop-filter de la transition
            if (transitionElement.style) {
                transitionElement.style.setProperty('--transition-blur', `${blurValue * 0.3}px`);
            }
            
            isScrolling = false;
        });
    }
    
    // Événements de scroll optimisés
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateBlurEffect();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Initialisation
    updateBlurEffect();
});
