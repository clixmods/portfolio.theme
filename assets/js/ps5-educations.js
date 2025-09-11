/**
 * PS5-Style Educations Interactive Script
 * Gère les interactions, animations et effets pour la page des formations
 */

class PS5EducationsManager {
    constructor() {
        this.currentEducation = null;
        this.bgElement = document.getElementById('education-bg');
        this.tiles = document.querySelectorAll('.ps5-education-tile');
        this.isHovering = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupAnimations();
    }
    
    setupEventListeners() {
        // Gestion du hover sur les tiles
        this.tiles.forEach(tile => {
            tile.addEventListener('mouseenter', (e) => this.handleTileHover(e));
            tile.addEventListener('mouseleave', (e) => this.handleTileLeave(e));
            tile.addEventListener('click', (e) => this.handleTileClick(e));
        });
        
        // Gestion du redimensionnement
        window.addEventListener('resize', () => this.handleResize());
        
        // Gestion du scroll pour les effets parallax
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    }
    
    setupAnimations() {
        // Animation d'entrée des tiles
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideUpFade 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                    entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
                }
            });
        }, observerOptions);
        
        this.tiles.forEach(tile => {
            tile.style.opacity = '0';
            tile.style.transform = 'translateY(50px)';
            observer.observe(tile);
        });
        
        // Ajout des keyframes CSS
        this.addAnimationStyles();
    }
    
    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUpFade {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            .ps5-education-tile.pulse {
                animation: pulse 0.6s ease-in-out;
            }
        `;
        document.head.appendChild(style);
    }
    
    handleTileHover(e) {
        const tile = e.currentTarget;
        const educationId = tile.dataset.educationId;
        const institution = tile.dataset.institution;
        
        this.isHovering = true;
        this.currentEducation = educationId;
        
        // Animation de la tile
        tile.style.transform = 'translateY(-12px) scale(1.03)';
        tile.style.zIndex = '10';
        
        // Effet de parallax sur les autres tiles
        this.tiles.forEach(otherTile => {
            if (otherTile !== tile) {
                otherTile.style.transform = 'translateY(4px) scale(0.98)';
                otherTile.style.opacity = '0.7';
            }
        });
        
        // Effet de fond dynamique (si une image est disponible)
        this.updateBackground(tile);
        
        // Feedback haptic (si supporté)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        console.log(`Hovering over education: ${institution}`);
    }
    
    handleTileLeave(e) {
        const tile = e.currentTarget;
        
        this.isHovering = false;
        
        // Reset de la tile
        setTimeout(() => {
            if (!this.isHovering) {
                tile.style.transform = '';
                tile.style.zIndex = '';
                
                // Reset des autres tiles
                this.tiles.forEach(otherTile => {
                    otherTile.style.transform = '';
                    otherTile.style.opacity = '';
                });
                
                // Reset du fond
                this.resetBackground();
            }
        }, 100);
    }
    
    handleTileClick(e) {
        const tile = e.currentTarget;
        const link = tile.querySelector('.ps5-tile-link');
        
        // Animation de clic
        tile.classList.add('pulse');
        setTimeout(() => {
            tile.classList.remove('pulse');
        }, 600);
        
        // Navigation (si pas déjà gérée par le lien)
        if (link && !e.target.closest('a')) {
            // Délai pour l'animation
            setTimeout(() => {
                window.location.href = link.href;
            }, 300);
        }
    }
    
    updateBackground(tile) {
        if (!this.bgElement) return;
        
        const img = tile.querySelector('.ps5-tile-image img');
        if (img && img.src) {
            this.bgElement.style.backgroundImage = `url(${img.src})`;
            this.bgElement.style.opacity = '0.3';
        } else {
            // Couleur de fallback basée sur l'institution
            const institution = tile.dataset.institution || '';
            const color = this.getInstitutionColor(institution);
            this.bgElement.style.background = `linear-gradient(135deg, ${color}aa, ${color}44)`;
            this.bgElement.style.opacity = '0.2';
        }
    }
    
    resetBackground() {
        if (!this.bgElement) return;
        
        setTimeout(() => {
            if (!this.isHovering) {
                this.bgElement.style.opacity = '0';
            }
        }, 200);
    }
    
    getInstitutionColor(institution) {
        // Couleurs basées sur le hash du nom de l'institution
        const colors = [
            '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', 
            '#ef4444', '#8b5a2b', '#6366f1', '#ec4899'
        ];
        
        let hash = 0;
        for (let i = 0; i < institution.length; i++) {
            hash = institution.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        return colors[Math.abs(hash) % colors.length];
    }
    
    handleResize() {
        // Recalcul des positions si nécessaire
        if (window.innerWidth <= 768) {
            // Mode mobile : reset des transformations
            this.tiles.forEach(tile => {
                tile.style.transform = '';
                tile.style.opacity = '';
            });
        }
    }
    
    handleScroll() {
        // Effet parallax subtil sur le header
        const header = document.querySelector('.educations-page-header');
        if (header) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            header.style.transform = `translateY(${rate}px)`;
        }
    }
    
    // Méthode publique pour filtrer les formations
    filterEducations(status) {
        this.tiles.forEach(tile => {
            const tileStatus = tile.dataset.status;
            
            if (status === 'all' || tileStatus === status) {
                tile.style.display = '';
                tile.style.animation = 'slideUpFade 0.4s ease forwards';
            } else {
                tile.style.opacity = '0';
                tile.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    tile.style.display = 'none';
                }, 200);
            }
        });
    }
    
    // Méthode pour rechercher dans les formations
    searchEducations(query) {
        const searchTerm = query.toLowerCase();
        
        this.tiles.forEach(tile => {
            const title = tile.querySelector('.ps5-tile-title')?.textContent.toLowerCase() || '';
            const institution = tile.querySelector('.ps5-tile-institution')?.textContent.toLowerCase() || '';
            const description = tile.querySelector('.ps5-tile-description')?.textContent.toLowerCase() || '';
            
            const matches = title.includes(searchTerm) || 
                          institution.includes(searchTerm) || 
                          description.includes(searchTerm);
            
            if (matches) {
                tile.style.display = '';
                tile.style.opacity = '1';
                tile.style.transform = '';
            } else {
                tile.style.opacity = '0.3';
                tile.style.transform = 'scale(0.95)';
            }
        });
    }
}

// Initialisation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    const educationsManager = new PS5EducationsManager();
    
    // Expose les méthodes publiques pour utilisation externe
    window.EducationsManager = educationsManager;
    
    console.log('PS5 Educations Manager initialized');
});

// Gestion des performances
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Préchargement des images en arrière-plan
        document.querySelectorAll('.ps5-education-tile img[loading="lazy"]').forEach(img => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const image = entry.target;
                        image.loading = 'eager';
                        observer.unobserve(image);
                    }
                });
            });
            observer.observe(img);
        });
    });
}
