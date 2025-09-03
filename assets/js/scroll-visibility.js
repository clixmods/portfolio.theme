/**
 * Scroll Visibility Management
 * 
 * Gère la visibilité des éléments selon la position de scroll :
 * - Cache le profile-badge et les boutons CV/Contact du top-dock dans la section hero
 * - Les réaffiche quand on sort de la section hero
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Scroll visibility management loaded');

    // Attendre un peu pour que tous les éléments soient chargés
    setTimeout(() => {
        initScrollVisibility();
    }, 100);
});

function initScrollVisibility() {
    // Éléments à gérer
    const profileBadge = document.getElementById('profile-badge');
    const topDock = document.getElementById('top-dock');
    const heroSection = document.getElementById('profil'); // Section hero
    
    console.log('Profile badge:', profileBadge);
    console.log('Top dock:', topDock);
    console.log('Hero section:', heroSection);
    
    // Boutons spécifiques dans le top-dock à cacher
    const downloadBtn = topDock?.querySelector('.download-btn');
    const contactBtn = topDock?.querySelector('.contact-btn');
    
    console.log('Download button:', downloadBtn);
    console.log('Contact button:', contactBtn);
    
    if (!heroSection) {
        console.warn('Hero section not found');
        return;
    }

    // Application des styles de transition CSS dès le début
    if (profileBadge) {
        profileBadge.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    [downloadBtn, contactBtn].forEach(btn => {
        if (btn) {
            btn.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        }
    });

    // Fonction pour gérer la visibilité
    function updateVisibility(isInHero) {
        console.log(`Updating visibility - In Hero: ${isInHero}`);
        
        // Gestion du profile-badge
        if (profileBadge) {
            if (isInHero) {
                profileBadge.style.opacity = '0';
                profileBadge.style.pointerEvents = 'none';
                profileBadge.style.transform = 'translateY(-10px)';
            } else {
                profileBadge.style.opacity = '1';
                profileBadge.style.pointerEvents = 'auto';
                profileBadge.style.transform = 'translateY(0)';
            }
        }
        
        // Gestion des boutons CV et Contact dans le top-dock
        const primaryGroup = topDock?.querySelector('.primary-actions-group');
        const separator = topDock?.querySelector('.dock-separator');
        
        [downloadBtn, contactBtn].forEach(btn => {
            if (btn) {
                if (isInHero) {
                    btn.style.opacity = '0';
                    btn.style.pointerEvents = 'none';
                    btn.style.transform = 'scale(0.8) translateY(-5px)';
                } else {
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = 'auto';
                    btn.style.transform = 'scale(1) translateY(0)';
                }
            }
        });
        
        // Gestion complète de l'espace pour éliminer les gaps
        if (isInHero) {
            // Après la transition, masquer complètement les éléments
            setTimeout(() => {
                if (primaryGroup) {
                    primaryGroup.style.display = 'none';
                }
                if (separator) {
                    separator.style.display = 'none';
                }
            }, 220); // Après la transition width/opacity
        } else {
            // Réafficher immédiatement avant la transition
            if (primaryGroup) {
                primaryGroup.style.display = 'flex';
            }
            if (separator) {
                separator.style.display = 'block';
            }
        }
        
        // Gestion de la taille et position du dock avec animation de fusion/détachement
        if (topDock) {
            if (isInHero) {
                // Mode compact - fusion vers la gauche
                topDock.classList.remove('is-detaching');
                topDock.classList.add('is-compact');
            } else {
                // Mode normal - détachement vers le centre
                topDock.classList.add('is-detaching');
                topDock.classList.remove('is-compact');
                
                // Retire la classe d'animation après la transition (réduit à 300ms)
                setTimeout(() => {
                    topDock.classList.remove('is-detaching');
                }, 300);
            }
        }
        
        // Force la mise à jour du dock principal si nécessaire
        if (window.DockNavigation && typeof window.DockNavigation.reinit === 'function') {
            // Délai réduit pour une meilleure réactivité
            setTimeout(() => {
                window.DockNavigation.reinit();
            }, 50);
        }
    }

    // Observer pour détecter quand on est dans la section hero
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px -10% 0px', // Réduit la marge pour une meilleure détection
        threshold: [0, 0.1, 0.5, 0.9, 1] // Plusieurs seuils pour plus de précision
    };

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const isInHero = entry.isIntersecting && entry.intersectionRatio > 0.1;
            updateVisibility(isInHero);
        });
    }, observerOptions);

    // Observer la section hero
    heroObserver.observe(heroSection);

    // Gestion du scroll pour un contrôle plus précis - optimisée pour les performances
    let ticking = false;
    let lastKnownState = null;
    let scrollTimeout = null;
    
    function handleScroll() {
        // Debounce pour éviter trop d'appels
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        if (!ticking) {
            requestAnimationFrame(() => {
                const heroRect = heroSection.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                // Détermine si on est "dans" la section hero de manière plus précise
                const isInHeroViewport = heroRect.top < windowHeight * 0.9 && heroRect.bottom > windowHeight * 0.1;
                
                // Éviter les mises à jour inutiles
                if (lastKnownState !== isInHeroViewport) {
                    console.log(`State change detected: ${lastKnownState} -> ${isInHeroViewport}`);
                    
                    updateVisibility(isInHeroViewport);
                    lastKnownState = isInHeroViewport;
                }
                
                ticking = false;
            });
            ticking = true;
        }
        
        // Timeout de sécurité
        scrollTimeout = setTimeout(() => {
            ticking = false;
        }, 16); // ~60fps
    }
    
    // Écoute du scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Vérification initiale de la position
    setTimeout(() => {
        handleScroll();
        console.log('Initial state check completed');
    }, 200);
    
    // Force une vérification après un délai plus long pour s'assurer que tout fonctionne
    setTimeout(() => {
        const heroRect = heroSection.getBoundingClientRect();
        const isVisible = heroRect.top < window.innerHeight * 0.9 && heroRect.bottom > window.innerHeight * 0.1;
        console.log('Final verification - Hero visible:', isVisible);
        
        if (!isVisible && profileBadge && profileBadge.style.opacity === '0') {
            console.log('Forcing profile badge to show');
            updateVisibility(false);
        }
    }, 1000);
    
    // Fonction de debug pour forcer l'affichage (disponible dans la console)
    window.debugShowAllElements = function() {
        console.log('Forcing all elements to show');
        if (profileBadge) {
            profileBadge.style.opacity = '1';
            profileBadge.style.pointerEvents = 'auto';
            profileBadge.style.transform = 'translateY(0)';
        }
        [downloadBtn, contactBtn].forEach(btn => {
            if (btn) {
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
                btn.style.transform = 'scale(1) translateY(0)';
            }
        });
        const primaryGroup = topDock?.querySelector('.primary-actions-group');
        const separator = topDock?.querySelector('.dock-separator');
        if (primaryGroup) {
            primaryGroup.style.display = 'flex';
        }
        if (separator) {
            separator.style.display = 'block';
        }
        if (topDock) {
            topDock.classList.remove('is-compact', 'is-detaching');
        }
    };
    
    // Fonction pour tester l'animation de fusion
    window.debugTestMerge = function() {
        console.log('Testing dock merge animation');
        if (topDock) {
            topDock.classList.remove('is-detaching');
            topDock.classList.add('is-compact');
        }
    };
    
    // Fonction pour tester l'animation de détachement
    window.debugTestDetach = function() {
        console.log('Testing dock detach animation');
        if (topDock) {
            topDock.classList.add('is-detaching');
            topDock.classList.remove('is-compact');
            setTimeout(() => {
                topDock.classList.remove('is-detaching');
            }, 300);
        }
    };
    
    // Fonction pour réinitialiser complètement le système
    window.debugResetScrollVisibility = function() {
        console.log('Resetting scroll visibility system');
        handleScroll();
        if (window.DockNavigation && typeof window.DockNavigation.reinit === 'function') {
            window.DockNavigation.reinit();
        }
    };
}
