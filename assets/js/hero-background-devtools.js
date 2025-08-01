/**
 * HERO BACKGROUND - Utilitaires de développement et performance
 * Outils pour tester, déboguer et optimiser le fond héroïque
 */

class HeroBackgroundDevTools {
  constructor() {
    this.performance = {
      frameCount: 0,
      lastFPSCheck: 0,
      currentFPS: 0,
      averageFPS: 0,
      frameTimes: []
    };
    
    this.isMonitoring = false;
    this.statsPanel = null;
    
    // Bind automatique si en mode développement
    if (this.isDevelopment()) {
      this.init();
    }
  }
  
  /**
   * Détecte si on est en mode développement
   */
  isDevelopment() {
    return (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.search.includes('debug=true') ||
      localStorage.getItem('hero-debug') === 'true'
    );
  }
  
  /**
   * Initialisation des outils de développement
   */
  init() {
    // Attendre que le background soit prêt
    const checkBackground = () => {
      if (window.heroBackground) {
        this.bindToBackground();
        this.createStatsPanel();
        this.addKeyboardShortcuts();
        console.log('🎨 Hero Background Dev Tools activés');
        console.log('Raccourcis clavier :');
        console.log('- F1: Afficher/masquer les stats');
        console.log('- F2: Basculer surveillance FPS');
        console.log('- F3: Capture d\'écran du canvas');
        console.log('- F4: Ajuster le nombre de particules');
      } else {
        setTimeout(checkBackground, 100);
      }
    };
    
    checkBackground();
  }
  
  /**
   * Lie les outils au gestionnaire de background
   */
  bindToBackground() {
    const bg = window.heroBackground;
    if (!bg) return;
    
    // Hook dans la boucle d'animation pour monitoring
    const originalAnimate = bg.animate.bind(bg);
    bg.animate = (currentTime) => {
      if (this.isMonitoring) {
        this.trackPerformance(currentTime);
      }
      return originalAnimate(currentTime);
    };
  }
  
  /**
   * Crée le panneau de statistiques
   */
  createStatsPanel() {
    this.statsPanel = document.createElement('div');
    this.statsPanel.id = 'hero-stats-panel';
    this.statsPanel.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: #4fd1c7;
      padding: 15px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      z-index: 9999;
      min-width: 200px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(79, 209, 199, 0.3);
      display: none;
    `;
    
    document.body.appendChild(this.statsPanel);
    this.updateStatsPanel();
  }
  
  /**
   * Met à jour le panneau de statistiques
   */
  updateStatsPanel() {
    if (!this.statsPanel || !window.heroBackground) return;
    
    const bg = window.heroBackground;
    const stats = `
      <div style="margin-bottom: 10px; color: #40e0d0; font-weight: bold;">🎨 Hero Background Stats</div>
      <div>FPS: ${this.performance.currentFPS}</div>
      <div>Particules: ${bg.particles ? bg.particles.length : 0}</div>
      <div>Canvas: ${bg.canvas ? bg.canvas.width + 'x' + bg.canvas.height : 'N/A'}</div>
      <div>Viewport: ${window.innerWidth}x${window.innerHeight}</div>
      <div>Animation: ${bg.isRunning ? '▶️ Active' : '⏸️ Pause'}</div>
      <div>Mode réduit: ${bg.shouldReduceMotion() ? '✅ Oui' : '❌ Non'}</div>
      <div style="margin-top: 10px; font-size: 10px; opacity: 0.7;">
        F1: Stats | F2: FPS | F3: Screenshot | F4: Particules
      </div>
    `;
    
    this.statsPanel.innerHTML = stats;
    
    // Auto-refresh toutes les 500ms
    setTimeout(() => this.updateStatsPanel(), 500);
  }
  
  /**
   * Suivi des performances
   */
  trackPerformance(currentTime) {
    this.performance.frameCount++;
    
    // Calcul FPS
    if (currentTime - this.performance.lastFPSCheck >= 1000) {
      this.performance.currentFPS = Math.round(
        this.performance.frameCount * 1000 / (currentTime - this.performance.lastFPSCheck)
      );
      
      this.performance.frameTimes.push(this.performance.currentFPS);
      if (this.performance.frameTimes.length > 60) {
        this.performance.frameTimes.shift();
      }
      
      this.performance.averageFPS = Math.round(
        this.performance.frameTimes.reduce((a, b) => a + b, 0) / this.performance.frameTimes.length
      );
      
      this.performance.frameCount = 0;
      this.performance.lastFPSCheck = currentTime;
      
      // Alerte si FPS trop bas
      if (this.performance.currentFPS < 30) {
        console.warn(`⚠️ FPS faible détecté: ${this.performance.currentFPS}fps`);
      }
    }
  }
  
  /**
   * Raccourcis clavier pour le debug
   */
  addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Seulement si pas dans un input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch(e.key) {
        case 'F1':
          e.preventDefault();
          this.toggleStatsPanel();
          break;
          
        case 'F2':
          e.preventDefault();
          this.toggleFPSMonitoring();
          break;
          
        case 'F3':
          e.preventDefault();
          this.captureScreenshot();
          break;
          
        case 'F4':
          e.preventDefault();
          this.adjustParticleCount();
          break;
      }
    });
  }
  
  /**
   * Affiche/masque le panneau de stats
   */
  toggleStatsPanel() {
    if (!this.statsPanel) return;
    
    const isVisible = this.statsPanel.style.display !== 'none';
    this.statsPanel.style.display = isVisible ? 'none' : 'block';
    
    console.log(`📊 Panneau de stats: ${isVisible ? 'masqué' : 'affiché'}`);
  }
  
  /**
   * Active/désactive le monitoring FPS
   */
  toggleFPSMonitoring() {
    this.isMonitoring = !this.isMonitoring;
    
    if (this.isMonitoring) {
      this.performance.frameCount = 0;
      this.performance.lastFPSCheck = performance.now();
      console.log('📈 Surveillance FPS activée');
    } else {
      console.log('📈 Surveillance FPS désactivée');
      console.log(`Moyenne FPS: ${this.performance.averageFPS}`);
    }
  }
  
  /**
   * Capture d'écran du canvas
   */
  captureScreenshot() {
    const bg = window.heroBackground;
    if (!bg || !bg.canvas) {
      console.warn('❌ Canvas non disponible pour la capture');
      return;
    }
    
    try {
      const dataURL = bg.canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `hero-background-${Date.now()}.png`;
      link.href = dataURL;
      link.click();
      
      console.log('📸 Capture d\'écran sauvegardée');
    } catch (error) {
      console.error('❌ Erreur lors de la capture:', error);
    }
  }
  
  /**
   * Interface pour ajuster le nombre de particules
   */
  adjustParticleCount() {
    const bg = window.heroBackground;
    if (!bg) return;
    
    const current = bg.particles ? bg.particles.length : 0;
    const newCount = prompt(`Nombre de particules actuel: ${current}\nNouveau nombre:`, current);
    
    if (newCount && !isNaN(newCount)) {
      const count = parseInt(newCount);
      bg.config.particleCount = count;
      bg.createParticles();
      console.log(`🎯 Nombre de particules ajusté: ${count}`);
    }
  }
  
  /**
   * Génère un rapport de performance
   */
  generatePerformanceReport() {
    const bg = window.heroBackground;
    const report = {
      timestamp: new Date().toISOString(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio
      },
      background: {
        isRunning: bg ? bg.isRunning : false,
        particleCount: bg && bg.particles ? bg.particles.length : 0,
        canvasSize: bg && bg.canvas ? {
          width: bg.canvas.width,
          height: bg.canvas.height
        } : null
      },
      performance: {
        currentFPS: this.performance.currentFPS,
        averageFPS: this.performance.averageFPS,
        frameTimesCount: this.performance.frameTimes.length
      },
      browser: {
        userAgent: navigator.userAgent,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      }
    };
    
    console.log('📋 Rapport de performance:', report);
    return report;
  }
  
  /**
   * Tests automatisés de performance
   */
  async runPerformanceTests() {
    console.log('🧪 Début des tests de performance...');
    
    const tests = [
      { name: 'Particules minimum', count: 10 },
      { name: 'Particules normales', count: 50 },
      { name: 'Particules maximum', count: 100 }
    ];
    
    const results = [];
    
    for (const test of tests) {
      console.log(`Test: ${test.name} (${test.count} particules)`);
      
      // Configuration
      window.heroBackground.config.particleCount = test.count;
      window.heroBackground.createParticles();
      
      // Mesure sur 3 secondes
      this.isMonitoring = true;
      this.performance.frameTimes = [];
      
      await this.sleep(3000);
      
      results.push({
        name: test.name,
        particleCount: test.count,
        averageFPS: this.performance.averageFPS,
        minFPS: Math.min(...this.performance.frameTimes),
        maxFPS: Math.max(...this.performance.frameTimes)
      });
    }
    
    this.isMonitoring = false;
    console.log('📊 Résultats des tests:', results);
    
    return results;
  }
  
  /**
   * Utilitaire pour attendre
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialisation automatique des outils de développement
if (typeof window !== 'undefined') {
  window.heroBackgroundDevTools = new HeroBackgroundDevTools();
}

// Export pour utilisation modulaire
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeroBackgroundDevTools;
}
