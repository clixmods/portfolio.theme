/**
 * EXPERIENCE TILES INTERACTION SCRIPT
 * ===================================
 * 
 * Ce script gère les interactions des tuiles de projets dans la section expérience
 * Il s'inspire du système PS5 pour créer des effets visuels immersifs
 */

class ExperienceTiles {
    constructor() {
        this.projectTiles = [];
        this.isInitialized = false;
        this.init();
    }

    init() {
        // Attendre que le DOM soit chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.cacheElements();
        this.bindEvents();
        this.addLoadingAnimation();
        this.isInitialized = true;
    }

    cacheElements() {
        this.projectTiles = document.querySelectorAll('.project-item');
        this.experienceSection = document.querySelector('.experience-section');
        this.tabButtons = document.querySelectorAll('.exp-tab-btn');
        this.layoutButtons = document.querySelectorAll('.layout-btn');
        this.projectsContainers = document.querySelectorAll('.projects-container');
        
        // Debug info
        console.log(`Found ${this.projectTiles.length} project tiles`);
        console.log(`Found ${this.layoutButtons.length} layout buttons`);
    }

    bindEvents() {
        // Événements pour les tuiles de projets
        this.projectTiles.forEach(tile => {
            tile.addEventListener('mouseenter', (e) => this.handleTileHover(e));
            tile.addEventListener('mouseleave', (e) => this.handleTileLeave(e));
            tile.addEventListener('mousemove', (e) => this.handleTileMouseMove(e));
        });

        // Événements pour les onglets d'expérience
        this.tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleTabChange(e));
        });

        // Événements pour les contrôles de layout
        this.layoutButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleLayoutChange(e));
        });

        // Initialiser les boutons de layout actifs
        this.initializeLayoutButtons();

        // Redimensionnement de la fenêtre
        window.addEventListener('resize', () => this.handleResize());
    }

    handleTileHover(e) {
        const tile = e.currentTarget;
        
        // Effet de glow
        tile.style.setProperty('--glow-opacity', '1');
        
        // Effet de profondeur
        tile.style.transform = 'translateY(-8px) scale(1.02)';
        tile.style.zIndex = '10';
        
        // Animation du contenu
        const content = tile.querySelector('.project-tile-content');
        const info = tile.querySelector('.project-tile-info');
        
        if (content && info) {
            content.style.opacity = '0';
            content.style.transform = 'translateY(-15px)';
            info.style.opacity = '1';
            info.style.transform = 'translateY(0)';
        }
    }

    handleTileLeave(e) {
        const tile = e.currentTarget;
        
        // Réinitialiser les effets
        tile.style.setProperty('--glow-opacity', '0');
        tile.style.transform = '';
        tile.style.zIndex = '';
        
        // Animation du contenu
        const content = tile.querySelector('.project-tile-content');
        const info = tile.querySelector('.project-tile-info');
        
        if (content && info) {
            content.style.opacity = '';
            content.style.transform = '';
            info.style.opacity = '';
            info.style.transform = '';
        }
    }

    handleTileMouseMove(e) {
        const tile = e.currentTarget;
        const rect = tile.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calcul de l'inclinaison basée sur la position de la souris
        const rotateX = (y - centerY) / centerY * -2;
        const rotateY = (x - centerX) / centerX * 2;
        
        tile.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    }

    handleTabChange(e) {
        const clickedTab = e.currentTarget;
        const category = clickedTab.dataset.category;
        
        // Mise à jour des onglets actifs
        this.tabButtons.forEach(btn => btn.classList.remove('active'));
        clickedTab.classList.add('active');
        
        // Animation de changement de timeline
        this.switchTimeline(category);
        
        // Feedback tactile (vibration sur mobile)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    switchTimeline(category) {
        const timelines = document.querySelectorAll('.experience-timeline');
        
        timelines.forEach(timeline => {
            if (timeline.id === `${category}-timeline`) {
                timeline.style.display = 'block';
                timeline.style.opacity = '0';
                timeline.style.transform = 'translateY(20px)';
                
                // Animation d'apparition
                setTimeout(() => {
                    timeline.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    timeline.style.opacity = '1';
                    timeline.style.transform = 'translateY(0)';
                }, 50);
            } else {
                timeline.style.display = 'none';
            }
        });
        
        // Ré-initialiser les tuiles pour la nouvelle timeline
        setTimeout(() => {
            this.cacheElements();
            this.bindEvents();
            this.addLoadingAnimation();
        }, 100);
    }

    addLoadingAnimation() {
        // Animation d'entrée progressive des tuiles
        this.projectTiles.forEach((tile, index) => {
            tile.style.opacity = '0';
            tile.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                tile.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                tile.style.opacity = '1';
                tile.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    handleResize() {
        // Réinitialiser les transformations lors du redimensionnement
        this.projectTiles.forEach(tile => {
            tile.style.transform = '';
        });
    }

    handleLayoutChange(e) {
        const clickedButton = e.currentTarget;
        const layout = clickedButton.dataset.layout;
        const projectsSection = clickedButton.closest('.projects-section');
        const container = projectsSection.querySelector('.projects-container');
        const layoutButtons = projectsSection.querySelectorAll('.layout-btn');
        
        // Mise à jour des boutons actifs
        layoutButtons.forEach(btn => btn.classList.remove('active'));
        clickedButton.classList.add('active');
        
        // Changement du layout
        container.className = `projects-container projects-container-${layout}`;
        
        // Animation de transition
        container.style.opacity = '0.5';
        setTimeout(() => {
            container.style.opacity = '1';
            // Ré-initialiser les événements pour les nouvelles positions
            this.cacheElements();
            this.bindEvents();
        }, 150);
        
        // Feedback tactile
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }
    }

    initializeLayoutButtons() {
        // Marquer les boutons correspondant au layout par défaut comme actifs
        this.projectsContainers.forEach(container => {
            const defaultLayout = container.dataset.defaultLayout || 'horizontal';
            const section = container.closest('.projects-section');
            const layoutButtons = section.querySelectorAll('.layout-btn');
            
            layoutButtons.forEach(btn => {
                if (btn.dataset.layout === defaultLayout) {
                    btn.classList.add('active');
                }
            });
        });
    }

    // Méthode publique pour réinitialiser les tuiles
    refresh() {
        this.cacheElements();
        this.bindEvents();
        this.addLoadingAnimation();
    }
}

// Auto-initialisation
let experienceTilesInstance;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        experienceTilesInstance = new ExperienceTiles();
    });
} else {
    experienceTilesInstance = new ExperienceTiles();
}

// Export pour usage externe
window.ExperienceTiles = ExperienceTiles;
window.experienceTilesInstance = experienceTilesInstance;
