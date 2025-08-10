// PS5 Projects Page Interactive Features

class PS5ProjectsPage {
    constructor() {
        this.currentSector = 'all';
        this.projects = [];
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.initializeProjects();
        this.setupParallax();
        this.setupIntersectionObserver();
        this.addLoadingAnimation();
    }

    cacheElements() {
        this.sectorButtons = document.querySelectorAll('.ps5-sector-btn');
        this.projectTiles = document.querySelectorAll('.ps5-project-tile');
        this.projectsGrid = document.querySelector('.ps5-projects-tiles');
    // Le header peut être supprimé sur certaines déclinaisons de page
    this.header = document.querySelector('.ps5-header');
    this.headerBg = document.querySelector('.ps5-header-bg');
    }

    bindEvents() {
        // Navigation par secteurs
        this.sectorButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSectorChange(e));
        });

        // Gestion du scroll pour l'effet parallax
        window.addEventListener('scroll', () => this.handleScroll());

        // Gestion des tuiles interactives
        this.projectTiles.forEach(tile => {
            tile.addEventListener('mouseenter', (e) => this.handleTileHover(e));
            tile.addEventListener('mouseleave', (e) => this.handleTileLeave(e));
            tile.addEventListener('mousemove', (e) => this.handleTileMouseMove(e));
        });

        // Navigation clavier
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Redimensionnement
        window.addEventListener('resize', () => this.handleResize());
    }

    initializeProjects() {
        this.projects = Array.from(this.projectTiles).map(tile => ({
            element: tile,
            sector: tile.dataset.sector,
            title: tile.querySelector('.ps5-tile-title').textContent,
            featured: tile.querySelector('.ps5-tile-badge') !== null
        }));
    }

    handleSectorChange(e) {
        if (this.isAnimating) return;

        const button = e.currentTarget;
        const newSector = button.dataset.sector;

        if (newSector === this.currentSector) return;

        // Mise à jour de l'état actif
        this.sectorButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Animation de filtrage
        this.filterProjects(newSector);
        this.currentSector = newSector;

        // Feedback sonore simulé (vibration sur mobile)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    async filterProjects(sector) {
        this.isAnimating = true;

        // Phase 1: Masquer les cartes non-correspondantes
        const hidingCards = this.projects.filter(project => 
            sector !== 'all' && project.sector !== sector
        );

        const showingCards = this.projects.filter(project => 
            sector === 'all' || project.sector === sector
        );

        // Animation de sortie
        hidingCards.forEach(project => {
            project.element.classList.add('hiding');
        });

        // Attendre la fin de l'animation de sortie
        await new Promise(resolve => setTimeout(resolve, 300));

        // Masquer complètement les cartes
        hidingCards.forEach(project => {
            project.element.style.display = 'none';
            project.element.classList.remove('hiding');
        });

        // Phase 2: Réorganiser la grille et afficher les nouvelles tuiles
        showingCards.forEach((project, index) => {
            project.element.style.display = 'block';
            project.element.style.animationDelay = `${index * 0.1}s`;
            project.element.classList.add('showing');
        });

        // Nettoyer les classes d'animation
        setTimeout(() => {
            showingCards.forEach(project => {
                project.element.classList.remove('showing');
                project.element.style.animationDelay = '';
            });
            this.isAnimating = false;
        }, 600);

        // Mettre à jour les statistiques
        this.updateStats(sector);
    }

    updateStats(sector) {
        const stats = document.querySelectorAll('.ps5-stat-number');
        const filteredCount = sector === 'all' ? 
            this.projects.length : 
            this.projects.filter(p => p.sector === sector).length;

        // Animation des chiffres
        stats.forEach((stat, index) => {
            const targetValue = index === 0 ? filteredCount : 
                this.projects.filter(p => p.sector === ['games', 'apps-web', 'mods-tools'][index - 1]).length;
            
            this.animateCounter(stat, parseInt(stat.textContent), targetValue);
        });
    }

    animateCounter(element, start, end) {
        const duration = 1000;
        const startTime = Date.now();

        const updateCounter = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * easeOut);
            
            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    }

    handleScroll() {
        if (!this.header) return; // header absent -> ignorer
        const scrollY = window.scrollY;
        const headerHeight = this.header.offsetHeight || 1;
        if (scrollY < headerHeight && this.headerBg) {
            const parallaxSpeed = 0.5;
            this.headerBg.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
            const opacity = 1 - (scrollY / headerHeight);
            this.header.style.opacity = Math.max(opacity, 0.3);
        }
    }

    handleTileHover(e) {
        const tile = e.currentTarget;
        
        // Ajouter un effet de glow subtil
        tile.style.setProperty('--glow-opacity', '1');
    // Son de hover désactivé (suppression demandée)

        // Fond dynamique
        const bgEl = document.getElementById('project-bg');
        if (bgEl) {
            const img = tile.getAttribute('data-background-image') || tile.querySelector('img')?.src;
            if (img) {
                // Appliquer nouvelle image
                bgEl.style.backgroundImage = `url('${img}')`;
                bgEl.classList.add('visible');
            }
        }
    }

    handleTileLeave(e) {
        const tile = e.currentTarget;
        tile.style.setProperty('--glow-opacity', '0');
        tile.style.transform = '';
        const bgEl = document.getElementById('project-bg');
        if (bgEl) {
            // On garde l'image jusqu'au prochain survol – commenter pour fade out
            // bgEl.classList.remove('visible');
        }
    }

    handleTileMouseMove(e) {
        const tile = e.currentTarget;
        const rect = tile.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calcul de l'inclinaison basée sur la position de la souris (plus subtile pour les tuiles)
        const rotateX = (y - centerY) / centerY * -5;
        const rotateY = (x - centerX) / centerX * 5;
        
        tile.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    }

    handleKeyboard(e) {
        // Navigation clavier entre les secteurs
        if (e.key >= '1' && e.key <= '4') {
            const index = parseInt(e.key) - 1;
            const button = this.sectorButtons[index];
            if (button) {
                button.click();
            }
        }

        // Échap pour revenir à "tous"
        if (e.key === 'Escape') {
            const allButton = document.querySelector('[data-sector="all"]');
            if (allButton) {
                allButton.click();
            }
        }
    }

    handleResize() {
        // Recalculer les animations et layouts si nécessaire
        this.projectTiles.forEach(tile => {
            tile.style.transform = '';
        });
    }

    setupParallax() {
        // Configuration de l'effet parallax pour les éléments de fond
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            
            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;
                const rate = scrollY * speed;
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }

    setupIntersectionObserver() {
        // Observer pour les animations à l'entrée dans le viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('ps5-animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observer toutes les tuiles
        this.projectTiles.forEach(tile => {
            observer.observe(tile);
        });

        // Observer les éléments de statistiques
        const stats = document.querySelectorAll('.ps5-stat');
        stats.forEach(stat => {
            observer.observe(stat);
        });
    }

    addLoadingAnimation() {
        // Animation d'entrée progressive des tuiles
        this.projectTiles.forEach((tile, index) => {
            tile.style.opacity = '0';
            tile.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                tile.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                tile.style.opacity = '1';
                tile.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    playHoverSound() { /* Désactivé */ }

    // Méthode pour ajouter des effets de particules
    createParticleEffect(x, y) {
        const particle = document.createElement('div');
        particle.className = 'ps5-particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        document.body.appendChild(particle);
        
        // Animation et suppression
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }

    // Méthode pour les statistiques en temps réel
    updateRealTimeStats() {
        const visibleTiles = Array.from(this.projectTiles).filter(tile => 
            getComputedStyle(tile).display !== 'none'
        );

        const gamesCount = visibleTiles.filter(tile => tile.dataset.sector === 'games').length;
        const appsCount = visibleTiles.filter(tile => tile.dataset.sector === 'apps-web').length;
        const modsCount = visibleTiles.filter(tile => tile.dataset.sector === 'mods-tools').length;

        // Mettre à jour l'affichage des stats
        this.updateStatsDisplay({
            total: visibleTiles.length,
            games: gamesCount,
            apps: appsCount,
            mods: modsCount
        });
    }

    updateStatsDisplay(stats) {
        const statElements = document.querySelectorAll('.ps5-stat-number');
        const values = [stats.total, stats.games, stats.apps, stats.mods];
        
        statElements.forEach((element, index) => {
            if (values[index] !== undefined) {
                this.animateCounter(element, parseInt(element.textContent), values[index]);
            }
        });
    }
}

// CSS pour les animations supplémentaires
const additionalStyles = `
.ps5-particle {
    position: fixed;
    width: 4px;
    height: 4px;
    background: radial-gradient(circle, var(--ps5-blue), transparent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 1000;
    animation: ps5-particle-float 1s ease-out forwards;
}

@keyframes ps5-particle-float {
    0% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
    100% {
        opacity: 0;
        transform: translateY(-100px) scale(0);
    }
}

.ps5-animate-in {
    animation: ps5-fade-in-up 0.6s ease-out;
}

@keyframes ps5-fade-in-up {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.ps5-project-tile {
    --glow-opacity: 0;
    position: relative;
}

.ps5-project-tile::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, var(--ps5-blue), var(--ps5-mods), var(--ps5-apps), var(--ps5-blue));
    border-radius: var(--ps5-border-radius);
    opacity: var(--glow-opacity);
    z-index: -1;
    transition: opacity 0.3s ease;
    filter: blur(10px);
}
`;

// Injection des styles supplémentaires
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialisation quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PS5ProjectsPage();
    });
} else {
    new PS5ProjectsPage();
}
