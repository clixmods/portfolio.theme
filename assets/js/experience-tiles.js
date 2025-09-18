/**
 * EXPERIENCE TILES INTERACTION SCRIPT
 * ===================================
 * 
 * This script handles project tiles interactions in the experience section
 * It draws inspiration from the PS5 system to create immersive visual effects
 */

class ExperienceTiles {
    constructor() {
        this.projectTiles = [];
        this.isInitialized = false;
        this.init();
    }

    init() {
        // Wait for DOM to be loaded
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
    }

    bindEvents() {
        // Events for project tiles only - tabs are handled by TabController
        this.projectTiles.forEach(tile => {
            tile.addEventListener('mouseenter', (e) => this.handleTileHover(e));
            tile.addEventListener('mouseleave', (e) => this.handleTileLeave(e));
            tile.addEventListener('mousemove', (e) => this.handleTileMouseMove(e));
        });

        // Window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    handleTileHover(e) {
        const tile = e.currentTarget;
        
        // Glow effect
        tile.style.setProperty('--glow-opacity', '1');
        
        // Depth effect
        tile.style.transform = 'translateY(-8px) scale(1.02)';
        tile.style.zIndex = '10';
        
        // Content animation
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
        
        // Reset effects
        tile.style.setProperty('--glow-opacity', '0');
        tile.style.transform = '';
        tile.style.zIndex = '';
        
        // Content animation
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
        
        // Calculate tilt based on mouse position
        const rotateX = (y - centerY) / centerY * -2;
        const rotateY = (x - centerX) / centerX * 2;
        
        tile.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    }

    // Tab handling is now managed by TabController in main.js

    switchTimeline(category) {
        const timelines = document.querySelectorAll('.experience-timeline');
        
        timelines.forEach(timeline => {
            if (timeline.id === `${category}-timeline`) {
                timeline.style.display = 'block';
                timeline.style.opacity = '0';
                timeline.style.transform = 'translateY(20px)';
                
                // Appearance animation
                setTimeout(() => {
                    timeline.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    timeline.style.opacity = '1';
                    timeline.style.transform = 'translateY(0)';
                }, 50);
            } else {
                timeline.style.display = 'none';
            }
        });
        
        // Re-initialize tiles for the new timeline
        setTimeout(() => {
            this.cacheElements();
            this.bindEvents();
            this.addLoadingAnimation();
        }, 100);
    }

    addLoadingAnimation() {
        // Progressive entry animation for tiles
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
        // Reset transformations on resize
        this.projectTiles.forEach(tile => {
            tile.style.transform = '';
        });
    }

    // Public method to reinitialize tiles
    refresh() {
        this.cacheElements();
        this.bindEvents();
        this.addLoadingAnimation();
    }
}

// Auto-initialization
let experienceTilesInstance;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        experienceTilesInstance = new ExperienceTiles();
    });
} else {
    experienceTilesInstance = new ExperienceTiles();
}

// Export for external usage
window.ExperienceTiles = ExperienceTiles;
window.experienceTilesInstance = experienceTilesInstance;
