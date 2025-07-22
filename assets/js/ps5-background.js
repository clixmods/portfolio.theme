/**
 * PS5 Projects Background Manager
 * Gère le changement de fond d'écran au survol des tuiles de projets
 */

class PS5BackgroundManager {
    constructor() {
        this.pageElement = document.querySelector('.ps5-projects-page');
        this.projectTiles = document.querySelectorAll('.ps5-project-tile');
        this.currentBackgroundUrl = null;
        this.hoverTimeout = null;
        this.resetTimeout = null;
        
        this.init();
    }

    init() {
        if (!this.pageElement || !this.projectTiles.length) return;

        this.projectTiles.forEach(tile => {
            tile.addEventListener('mouseenter', this.handleTileHover.bind(this));
            tile.addEventListener('mouseleave', this.handleTileLeave.bind(this));
        });
    }

    handleTileHover(event) {
        const tile = event.currentTarget;
        const backgroundImage = tile.dataset.backgroundImage;
        
        // Annuler le timeout de reset si il existe
        if (this.resetTimeout) {
            clearTimeout(this.resetTimeout);
            this.resetTimeout = null;
        }

        // Délai avant de changer le fond pour éviter les changements trop rapides
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }

        this.hoverTimeout = setTimeout(() => {
            if (backgroundImage && backgroundImage !== this.currentBackgroundUrl) {
                // Supprimer la classe active de toutes les tuiles
                this.projectTiles.forEach(t => t.classList.remove('is-background-active'));
                
                // Ajouter la classe active à la tuile courante
                tile.classList.add('is-background-active');
                
                this.setBackground(backgroundImage);
            }
        }, 200); // Délai de 200ms
    }

    handleTileLeave(event) {
        // Annuler le timeout de hover si l'utilisateur quitte rapidement
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }

        // Programmer le reset du fond après un délai
        this.resetTimeout = setTimeout(() => {
            this.resetBackground();
        }, 500); // Délai de 500ms avant de revenir au fond normal
    }

    setBackground(imageUrl) {
        if (!imageUrl || imageUrl === this.currentBackgroundUrl) return;

        this.currentBackgroundUrl = imageUrl;
        
        // Précharger l'image
        const img = new Image();
        img.onload = () => {
            // Appliquer le nouveau fond avec transition
            this.pageElement.style.backgroundImage = `url('${imageUrl}')`;
            this.pageElement.classList.add('has-project-bg');
            
            // Ajouter un effet de flou progressif
            this.pageElement.style.filter = 'blur(0.5px)';
            setTimeout(() => {
                this.pageElement.style.filter = 'none';
            }, 300);
        };
        img.onerror = () => {
            console.warn(`Impossible de charger l'image de fond: ${imageUrl}`);
        };
        img.src = imageUrl;
    }

    resetBackground() {
        if (!this.currentBackgroundUrl) return;

        // Supprimer la classe active de toutes les tuiles
        this.projectTiles.forEach(tile => tile.classList.remove('is-background-active'));

        // Transition de sortie
        this.pageElement.style.filter = 'blur(0.5px)';
        
        setTimeout(() => {
            this.pageElement.style.backgroundImage = '';
            this.pageElement.classList.remove('has-project-bg');
            this.pageElement.style.filter = 'none';
            this.currentBackgroundUrl = null;
        }, 200);
    }

    // Méthode pour ajouter dynamiquement des images de fond
    addProjectBackground(projectId, imageUrl) {
        const tile = document.querySelector(`[data-project-id="${projectId}"]`);
        if (tile) {
            tile.dataset.backgroundImage = imageUrl;
        }
    }

    // Méthode pour supprimer une image de fond
    removeProjectBackground(projectId) {
        const tile = document.querySelector(`[data-project-id="${projectId}"]`);
        if (tile) {
            delete tile.dataset.backgroundImage;
        }
    }
}

// Fonction utilitaire pour initialiser le gestionnaire de fond
function initPS5BackgroundManager() {
    // Attendre que le DOM soit complètement chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new PS5BackgroundManager();
        });
    } else {
        new PS5BackgroundManager();
    }
}

// Configuration des images de fond par défaut
const defaultProjectBackgrounds = {
    'aspiro-shop': '/images/projects/aspiro-shop-bg.jpg',
    'assault-of-order': '/images/projects/assault-of-order-bg.jpg',
    'blazor-app': '/images/projects/blazor-app-bg.jpg',
    'event-platform': '/images/projects/event-platform-bg.jpg',
    'farm-remastered': '/images/projects/farm-remastered-bg.jpg',
    'galaxian': '/images/projects/galaxian-bg.jpg',
    'its-not-supposed': '/images/projects/its-not-supposed-bg.jpg',
    'mori-rebirth': '/images/projects/mori-rebirth-bg.jpg',
    'nuketown-zombies': '/images/projects/nuketown-zombies-bg.jpg',
    'portfolio-website': '/images/projects/portfolio-website-bg.jpg',
    'stholen': '/images/projects/stholen-bg.jpg',
    'stone-keepers': '/images/projects/stone-keepers-bg.jpg',
    'symfony-directory': '/images/projects/symfony-directory-bg.jpg',
    'terra-memoria': '/images/projects/terra-memoria-bg.jpg',
    'unity-editor-tools': '/images/projects/unity-editor-tools-bg.jpg',
    'zombies-experience': '/images/projects/zombies-experience-bg.jpg'
};

// Auto-configuration des fonds de projets
function autoConfigureProjectBackgrounds() {
    const manager = new PS5BackgroundManager();
    
    // Appliquer les fonds par défaut
    Object.entries(defaultProjectBackgrounds).forEach(([projectId, imageUrl]) => {
        manager.addProjectBackground(projectId, imageUrl);
    });
}

// Initialiser automatiquement
initPS5BackgroundManager();

// Exporter pour utilisation globale
window.PS5BackgroundManager = PS5BackgroundManager;
window.initPS5BackgroundManager = initPS5BackgroundManager;
window.autoConfigureProjectBackgrounds = autoConfigureProjectBackgrounds;
