/**
 * HERO BACKGROUND - Gestionnaire de particules dynamiques
 * Système de particules léger avec Canvas et RequestAnimationFrame
 */

class HeroBackgroundManager {
  constructor() {
    this.canvasBack = null;      // Canvas arrière (flou)
    this.canvasFront = null;     // Canvas avant (net)
    this.ctxBack = null;
    this.ctxFront = null;
    this.particles = [];
    this.animationId = null;
    this.isRunning = false;
    
    // Configuration pour effet "poussière d'étoiles"
    this.config = {
      // Particules (réduites pour debug)
      totalParticleCount: 200,     // Réduit pour test
      particleCountMobile: 100,    // Version mobile
      ribbonProximityRatio: 0.7,   // 70% des particules près du ruban
      ribbonInfluenceZone: 120,    // Distance d'influence du ruban (120px)
      
      // Tailles et formes
      minSize: 1,                  // Taille minimale 1px
      maxSize: 2,                  // Taille standard 2px
      largeParticleRatio: 0.05,    // 5% de particules jusqu'à 4px
      largeParticleMaxSize: 4,     // Taille maximale 4px
      
      // Couleurs exactes
      colors: {
        white: { r: 255, g: 255, b: 255 },      // Blanc pur #ffffff
        blueWhite: { r: 207, g: 227, b: 255 }   // Bleu presque blanc #cfe3ff
      },
      
      // Scintillement (1 seconde de cycle)
      sparkleSpeed: 0.001,         // Vitesse pour cycle d'1 seconde
      minOpacity: 0.4,             // Opacité minimale
      maxOpacity: 1.0,             // Opacité maximale
      
      // Profondeur
      backLayerRatio: 0.6,         // 60% des particules en arrière-plan
      
      // Performance
      targetFPS: 60,
      frameInterval: 1000 / 60
    };
    
    this.lastFrameTime = 0;
    this.init();
  }
  
  /**
   * Initialisation du système
   */
  init() {
    console.log('🌌 Initialisation HeroBackgroundManager');
    
    // Vérification du support de motion
    if (this.shouldReduceMotion()) {
      console.log('⚠️ Motion réduite détectée');
      this.createStaticParticles();
      return;
    }
    
    console.log('🎯 Création du système de particules');
    this.createCanvas();
    this.createParticles();
    this.bindEvents();
    this.start();
  }
  
  /**
   * Vérifie si l'utilisateur préfère moins d'animations
   */
  shouldReduceMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  /**
   * Création du canvas principal (unifié)
   */
  createCanvas() {
    // Supprimer les canvas existants
    const existingCanvases = document.querySelectorAll('#hero-particles-canvas, #hero-particles-canvas-back, #hero-particles-canvas-front');
    existingCanvases.forEach(canvas => canvas.remove());
    
    const heroBackground = document.querySelector('.hero-background');
    const container = heroBackground || document.body;
    
    // Canvas principal unifié
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'hero-particles-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -1;
      pointer-events: none;
    `;
    this.ctx = this.canvas.getContext('2d');
    container.appendChild(this.canvas);
    
    this.resizeCanvas();
    
    console.log('Canvas créé:', this.canvas.id);
  }
  
  /**
   * Redimensionnement du canvas
   */
  resizeCanvas() {
    if (!this.canvas) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    
    console.log('Canvas redimensionné:', rect.width + 'x' + rect.height);
  }
  
  /**
   * Création des particules
   */
  createParticles() {
    const isMobile = window.innerWidth <= 768;
    const ambientCount = isMobile ? this.config.particleCountMobile : this.config.particleCount;
    const ribbonCount = isMobile ? this.config.ribbonParticleCountMobile : this.config.ribbonParticleCount;
    
    this.particles = [];
    
    // Particules d'ambiance normales
    for (let i = 0; i < ambientCount; i++) {
      this.particles.push(this.createParticle());
    }
    
    // Nombreuses particules flottantes près du ruban
    for (let i = 0; i < ribbonCount; i++) {
      this.particles.push(this.createFloatingRibbonParticle());
    }
  }
  
  /**
   * Création de particules flottantes près du ruban
   */
  createFloatingRibbonParticle() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const ribbonY = screenHeight * 0.30; // Position de la vague soyeuse (~30%)
    const ribbonAngle = 15 * Math.PI / 180;
    
    // Position aléatoire le long de la zone du ruban
    const x = Math.random() * screenWidth;
    const ribbonOffset = (x - screenWidth * 0.3) * Math.tan(ribbonAngle);
    const baseY = ribbonY + ribbonOffset;
    
    // Variation autour de la position du ruban
    const yVariation = (Math.random() - 0.5) * this.config.ribbonInfluenceZone;
    
    return {
      x: x,
      y: baseY + yVariation,
      size: Math.random() * 1.5 + 0.5, // Particules plus petites
      opacity: Math.random() * (this.config.maxOpacity - this.config.minOpacity) + this.config.minOpacity,
      sparklePhase: Math.random() * Math.PI * 2,
      sparkleSpeed: this.config.sparkleSpeed * (0.3 + Math.random() * 0.7), // Variation de vitesse
      color: Math.random() > 0.7 ? this.config.colors.blue : this.config.colors.white,
      isFloatingRibbonParticle: true,
      drift: {
        x: (Math.random() - 0.5) * 0.05, // Dérive très lente
        y: (Math.random() - 0.5) * 0.03  // Dérive verticale très lente
      },
      floatPhase: Math.random() * Math.PI * 2,
      floatSpeed: 0.001 + Math.random() * 0.002, // Flottement très lent
      floatAmplitude: 10 + Math.random() * 20 // Amplitude du flottement
    };
  }
  
  /**
   * Création d'une particule individuelle
   */
  createParticle() {
    // Distribution pondérée : 70% près du ruban, 30% aléatoire
    const isNearRibbon = Math.random() < 0.7;
    const ribbonY = window.innerHeight * 0.30; // Position de la vague soyeuse
    
    // Taille : 1-4px avec rares particules plus grandes
    let size = Math.random() * 3 + 1; // Base 1-4px
    if (Math.random() < 0.05) { // 5% chance d'avoir une grande particule
      size = Math.random() * 2 + 4; // 4-6px
    }
    
    // Couleurs : blanc ou bleu clair
    const isBlue = Math.random() < 0.3; // 30% bleu, 70% blanc
    const color = isBlue ? '#cfe3ff' : '#ffffff';
    
    return {
      x: Math.random() * window.innerWidth,
      y: isNearRibbon 
        ? ribbonY + (Math.random() - 0.5) * 120 // Zone de 120px autour du ruban
        : Math.random() * window.innerHeight,
      size: size,
      alpha: 0.6 + Math.random() * 0.4, // Alpha 0.6-1.0 (plus visible)
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.002 + Math.random() * 0.003, // Plus rapide
      color: color,
      drift: {
        x: (Math.random() - 0.5) * 0.2, // Dérive plus visible
        y: (Math.random() - 0.5) * 0.1
      }
    };
  }
  
  /**
   * Création de particules statiques (mode réduit)
   */
  createStaticParticles() {
    const container = document.querySelector('.particles-css');
    if (!container) return;
    
    const count = window.innerWidth <= 768 ? 20 : 30;
    
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = `particle ${Math.random() > 0.6 ? 'particle--blue' : 'particle--white'}`;
      
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 2;
      
      particle.style.cssText = `
        left: ${x}%;
        top: ${y}%;
        --delay: ${delay}s;
      `;
      
      container.appendChild(particle);
    }
  }
  
  /**
   * Mise à jour des particules
   */
  updateParticles(deltaTime) {
    this.particles.forEach((particle, index) => {
      if (particle.isFloatingRibbonParticle) {
        this.updateFloatingRibbonParticle(particle, deltaTime);
      } else {
        this.updateRegularParticle(particle, deltaTime);
      }
    });
  }
  
  /**
   * Mise à jour d'une particule normale
   */
  updateRegularParticle(particle, deltaTime) {
    // Scintillement (twinkling)
    particle.twinklePhase += particle.twinkleSpeed * deltaTime;
    const baseAlpha = 0.3 + Math.random() * 0.7;
    particle.alpha = baseAlpha * (0.3 + 0.7 * Math.abs(Math.sin(particle.twinklePhase)));
    
    // Dérive subtile
    particle.x += particle.drift.x * deltaTime * 0.1;
    particle.y += particle.drift.y * deltaTime * 0.1;
    
    // Rebouclage des particules
    if (particle.x < -10) particle.x = window.innerWidth + 10;
    if (particle.x > window.innerWidth + 10) particle.x = -10;
    if (particle.y < -10) particle.y = window.innerHeight + 10;
    if (particle.y > window.innerHeight + 10) particle.y = -10;
  }
  
  /**
   * Mise à jour d'une particule flottante près du ruban
   */
  updateFloatingRibbonParticle(particle, deltaTime) {
    // Scintillement très lent
    particle.sparklePhase += particle.sparkleSpeed * deltaTime;
    particle.opacity = this.config.minOpacity + 
      (this.config.maxOpacity - this.config.minOpacity) * 
      (0.5 + 0.5 * Math.sin(particle.sparklePhase));
    
    // Flottement très lent et organique
    particle.floatPhase += particle.floatSpeed * deltaTime;
    const floatX = Math.sin(particle.floatPhase) * particle.floatAmplitude * 0.1;
    const floatY = Math.cos(particle.floatPhase * 0.7) * particle.floatAmplitude * 0.1;
    
    // Dérive très lente
    particle.x += (particle.drift.x * deltaTime * 0.02) + (floatX * deltaTime * 0.001);
    particle.y += (particle.drift.y * deltaTime * 0.02) + (floatY * deltaTime * 0.001);
    
    // Rebouclage doux - garde les particules dans la zone du ruban
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    if (particle.x < -50) {
      particle.x = screenWidth + 50;
    } else if (particle.x > screenWidth + 50) {
      particle.x = -50;
    }
    
    if (particle.y < -50) {
      particle.y = screenHeight + 50;
    } else if (particle.y > screenHeight + 50) {
      particle.y = -50;
    }
  }
  
  /**
   * Rendu des particules (simplifié)
   */
  render() {
    if (!this.ctx || !this.canvas) return;
    
    // Nettoyer le canvas
    this.ctx.clearRect(0, 0, this.canvas.width / (window.devicePixelRatio || 1), this.canvas.height / (window.devicePixelRatio || 1));
    
    // Rendu de chaque particule
    this.particles.forEach(particle => {
      if (particle.alpha <= 0) return;
      
      this.ctx.save();
      this.ctx.globalAlpha = particle.alpha;
      this.ctx.fillStyle = particle.color;
      this.ctx.shadowColor = particle.color;
      this.ctx.shadowBlur = particle.size * 2;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
    
    // Debug info
    if (this.particles.length > 0) {
      console.log('Particules rendues:', this.particles.length);
    }
  }
  
  /**
   * Boucle d'animation principale
   */
  animate(currentTime) {
    if (!this.isRunning) return;
    
    // Limitation du framerate
    if (currentTime - this.lastFrameTime < this.config.frameInterval) {
      this.animationId = requestAnimationFrame(this.animate.bind(this));
      return;
    }
    
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;
    
    this.updateParticles(deltaTime);
    this.render();
    
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }
  
  /**
   * Démarrage de l'animation
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }
  
  /**
   * Arrêt de l'animation
   */
  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  /**
   * Gestion des événements
   */
  bindEvents() {
    // Redimensionnement
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Changement de visibilité
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Économie d'énergie
    window.addEventListener('blur', () => this.stop());
    window.addEventListener('focus', () => {
      if (!this.shouldReduceMotion()) this.start();
    });
  }
  
  /**
   * Gestion du redimensionnement
   */
  handleResize() {
    if (this.canvas) {
      this.resizeCanvas();
      this.createParticles(); // Recréer les particules pour la nouvelle taille
    }
  }
  
  /**
   * Gestion du changement de visibilité
   */
  handleVisibilityChange() {
    if (document.hidden) {
      this.stop();
    } else if (!this.shouldReduceMotion()) {
      this.start();
    }
  }
  
  /**
   * Nettoyage des ressources
   */
  destroy() {
    this.stop();
    
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    
    window.removeEventListener('resize', this.handleResize.bind(this));
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }
}

// Initialisation automatique quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 DOM ready, initialisation du background');
  
  // Attendre que le héros soit en place
  const initBackground = () => {
    const heroElement = document.querySelector('.hero-background');
    console.log('🎯 Élément hero trouvé:', !!heroElement);
    
    if (heroElement || document.body) {
      console.log('✅ Création de HeroBackgroundManager');
      window.heroBackground = new HeroBackgroundManager();
    } else {
      console.log('❌ Pas d\'élément hero trouvé');
    }
  };
  
  // Init immédiate ou différée
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackground);
  } else {
    initBackground();
  }
});

// Export pour utilisation modulaire si nécessaire
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeroBackgroundManager;
}
