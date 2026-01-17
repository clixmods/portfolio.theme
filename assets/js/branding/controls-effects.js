// ============================================================================
// BRANDING - EFFECTS CONTROLS MODULE
// ============================================================================
// Grain, Waves (Hero), and Particles effect controls

window.BrandingEditor = window.BrandingEditor || {};
window.BrandingEditor.controlsEffects = {
    
    // Particles instance reference
    particles: null,
    
    // Initialize all effect controls
    init: function() {
        this.initGrainControls();
        this.initHeroControls();
        this.initParticlesControls();
    },
    
    // Synchronize effect controls with state
    syncWithState: function() {
        const state = window.BrandingEditor.state;
        
        // Sync grain controls
        const showGrain = document.getElementById('show-grain');
        const grainOpacity = document.getElementById('grain-opacity');
        const grainOpacityDisplay = document.getElementById('grain-opacity-display');
        const grainSize = document.getElementById('grain-size');
        const grainSizeDisplay = document.getElementById('grain-size-display');
        
        if (showGrain) showGrain.checked = state.style.showGrain;
        if (grainOpacity) grainOpacity.value = state.style.grainOpacity;
        if (grainOpacityDisplay) grainOpacityDisplay.textContent = `${Math.round(state.style.grainOpacity * 100)}%`;
        if (grainSize) grainSize.value = state.style.grainSize;
        if (grainSizeDisplay) grainSizeDisplay.textContent = `${state.style.grainSize}x`;
        
        // Sync hero/waves controls
        const showHero = document.getElementById('show-hero');
        const heroOpacity = document.getElementById('hero-opacity');
        const heroOpacityDisplay = document.getElementById('hero-opacity-display');
        const heroWaveSpeed = document.getElementById('hero-wave-speed');
        const heroWaveSpeedDisplay = document.getElementById('hero-wave-speed-display');
        const heroWaveHeight = document.getElementById('hero-wave-height');
        const heroWaveHeightDisplay = document.getElementById('hero-wave-height-display');
        const heroWaveScale = document.getElementById('hero-wave-scale');
        const heroWaveScaleDisplay = document.getElementById('hero-wave-scale-display');
        const heroPositionX = document.getElementById('hero-position-x');
        const heroPositionXDisplay = document.getElementById('hero-position-x-display');
        const heroPositionY = document.getElementById('hero-position-y');
        const heroPositionYDisplay = document.getElementById('hero-position-y-display');
        
        if (showHero) showHero.checked = state.style.showHero;
        if (heroOpacity) heroOpacity.value = state.style.heroOpacity;
        if (heroOpacityDisplay) heroOpacityDisplay.textContent = `${Math.round(state.style.heroOpacity * 100)}%`;
        if (heroWaveSpeed) heroWaveSpeed.value = state.style.heroWaveSpeed || 12;
        if (heroWaveSpeedDisplay) heroWaveSpeedDisplay.textContent = `${state.style.heroWaveSpeed || 12}s`;
        if (heroWaveHeight) heroWaveHeight.value = state.style.heroWaveHeight || 40;
        if (heroWaveHeightDisplay) heroWaveHeightDisplay.textContent = `${state.style.heroWaveHeight || 40}%`;
        if (heroWaveScale) heroWaveScale.value = state.style.heroWaveScale || 1;
        if (heroWaveScaleDisplay) heroWaveScaleDisplay.textContent = `${state.style.heroWaveScale || 1}x`;
        if (heroPositionX) heroPositionX.value = state.style.heroPositionX || 0;
        if (heroPositionXDisplay) heroPositionXDisplay.textContent = `${state.style.heroPositionX || 0}%`;
        if (heroPositionY) heroPositionY.value = state.style.heroPositionY || 0;
        if (heroPositionYDisplay) heroPositionYDisplay.textContent = `${state.style.heroPositionY || 0}%`;
        
        // Sync particles controls
        const showParticles = document.getElementById('show-particles');
        const particlesSeed = document.getElementById('particles-seed');
        const particlesCount = document.getElementById('particles-count');
        const particlesCountDisplay = document.getElementById('particles-count-display');
        const particlesSpeed = document.getElementById('particles-speed');
        const particlesSpeedDisplay = document.getElementById('particles-speed-display');
        const particlesOpacity = document.getElementById('particles-opacity');
        const particlesOpacityDisplay = document.getElementById('particles-opacity-display');
        const particlesSize = document.getElementById('particles-size');
        const particlesSizeDisplay = document.getElementById('particles-size-display');
        const particlesPositionX = document.getElementById('particles-position-x');
        const particlesPositionXDisplay = document.getElementById('particles-position-x-display');
        const particlesPositionY = document.getElementById('particles-position-y');
        const particlesPositionYDisplay = document.getElementById('particles-position-y-display');
        
        if (showParticles) showParticles.checked = state.style.showParticles;
        if (particlesSeed) particlesSeed.value = state.style.particlesSeed || 123;
        if (particlesCount) particlesCount.value = state.style.particlesCount || 60;
        if (particlesCountDisplay) particlesCountDisplay.textContent = state.style.particlesCount || 60;
        if (particlesSpeed) particlesSpeed.value = state.style.particlesSpeed || 1.0;
        if (particlesSpeedDisplay) particlesSpeedDisplay.textContent = `${state.style.particlesSpeed || 1.0}x`;
        if (particlesOpacity) particlesOpacity.value = state.style.particlesOpacity;
        if (particlesOpacityDisplay) particlesOpacityDisplay.textContent = `${Math.round(state.style.particlesOpacity * 100)}%`;
        if (particlesSize) particlesSize.value = state.style.particlesSize || 1;
        if (particlesSizeDisplay) particlesSizeDisplay.textContent = `${state.style.particlesSize || 1}x`;
        if (particlesPositionX) particlesPositionX.value = state.style.particlesPositionX || 0;
        if (particlesPositionXDisplay) particlesPositionXDisplay.textContent = `${state.style.particlesPositionX || 0}%`;
        if (particlesPositionY) particlesPositionY.value = state.style.particlesPositionY || 0;
        if (particlesPositionYDisplay) particlesPositionYDisplay.textContent = `${state.style.particlesPositionY || 0}%`;
    },
    
    // Apply all effects (called during initialization)
    applyAll: function(skipSave) {
        this.updateGrainEffect(skipSave);
        this.updateWavesEffect(skipSave);
        this.updateParticlesEffect(skipSave);
    },
    
    // ========================================================================
    // GRAIN CONTROLS
    // ========================================================================
    
    initGrainControls: function() {
        const state = window.BrandingEditor.state;
        const self = this;
        
        // Grain toggle
        const showGrain = document.getElementById('show-grain');
        if (showGrain) {
            showGrain.addEventListener('change', function() {
                state.style.showGrain = this.checked;
                self.updateGrainEffect();
            });
        }
        
        // Grain opacity
        const grainOpacity = document.getElementById('grain-opacity');
        const grainOpacityDisplay = document.getElementById('grain-opacity-display');
        if (grainOpacity) {
            grainOpacity.addEventListener('input', function() {
                state.style.grainOpacity = parseFloat(this.value);
                if (grainOpacityDisplay) {
                    grainOpacityDisplay.textContent = `${Math.round(this.value * 100)}%`;
                }
                self.updateGrainEffect();
            });
        }
        
        // Grain size
        const grainSize = document.getElementById('grain-size');
        const grainSizeDisplay = document.getElementById('grain-size-display');
        if (grainSize) {
            grainSize.addEventListener('input', function() {
                state.style.grainSize = parseFloat(this.value);
                if (grainSizeDisplay) {
                    grainSizeDisplay.textContent = `${this.value}x`;
                }
                self.updateGrainEffect();
            });
        }
    },
    
    updateGrainEffect: function(skipSave) {
        const state = window.BrandingEditor.state;
        const grainOverlay = document.getElementById('template-grain');
        
        if (!grainOverlay) return;
        
        if (state.style.showGrain) {
            grainOverlay.classList.remove('hidden');
            grainOverlay.style.opacity = state.style.grainOpacity;
            const size = 200 * state.style.grainSize;
            grainOverlay.style.backgroundSize = `${size}px ${size}px`;
        } else {
            grainOverlay.classList.add('hidden');
        }
        
        if (!skipSave) window.BrandingEditor.saveState();
    },
    
    // ========================================================================
    // HERO/WAVES CONTROLS
    // ========================================================================
    
    initHeroControls: function() {
        const state = window.BrandingEditor.state;
        const self = this;
        
        // Waves toggle
        const showHero = document.getElementById('show-hero');
        if (showHero) {
            showHero.addEventListener('change', function() {
                state.style.showHero = this.checked;
                self.updateWavesEffect();
            });
        }
        
        // Wave opacity
        const heroOpacity = document.getElementById('hero-opacity');
        const heroOpacityDisplay = document.getElementById('hero-opacity-display');
        if (heroOpacity) {
            heroOpacity.addEventListener('input', function() {
                state.style.heroOpacity = parseFloat(this.value);
                if (heroOpacityDisplay) {
                    heroOpacityDisplay.textContent = `${Math.round(this.value * 100)}%`;
                }
                self.updateWavesEffect();
            });
        }
        
        // Wave speed
        const heroWaveSpeed = document.getElementById('hero-wave-speed');
        const heroWaveSpeedDisplay = document.getElementById('hero-wave-speed-display');
        if (heroWaveSpeed) {
            heroWaveSpeed.addEventListener('input', function() {
                state.style.heroWaveSpeed = parseInt(this.value);
                if (heroWaveSpeedDisplay) {
                    heroWaveSpeedDisplay.textContent = `${this.value}s`;
                }
                self.updateWavesEffect();
            });
        }
        
        // Wave height
        const heroWaveHeight = document.getElementById('hero-wave-height');
        const heroWaveHeightDisplay = document.getElementById('hero-wave-height-display');
        if (heroWaveHeight) {
            heroWaveHeight.addEventListener('input', function() {
                state.style.heroWaveHeight = parseInt(this.value);
                if (heroWaveHeightDisplay) {
                    heroWaveHeightDisplay.textContent = `${this.value}%`;
                }
                self.updateWavesEffect();
            });
        }
        
        // Wave scale
        const heroWaveScale = document.getElementById('hero-wave-scale');
        const heroWaveScaleDisplay = document.getElementById('hero-wave-scale-display');
        if (heroWaveScale) {
            heroWaveScale.addEventListener('input', function() {
                state.style.heroWaveScale = parseFloat(this.value);
                if (heroWaveScaleDisplay) {
                    heroWaveScaleDisplay.textContent = `${this.value}x`;
                }
                self.updateWavesEffect();
            });
        }
        
        // Wave position X
        const heroPositionX = document.getElementById('hero-position-x');
        const heroPositionXDisplay = document.getElementById('hero-position-x-display');
        if (heroPositionX) {
            heroPositionX.addEventListener('input', function() {
                state.style.heroPositionX = parseInt(this.value);
                if (heroPositionXDisplay) {
                    heroPositionXDisplay.textContent = `${this.value}%`;
                }
                self.updateWavesEffect();
            });
        }
        
        // Wave position Y
        const heroPositionY = document.getElementById('hero-position-y');
        const heroPositionYDisplay = document.getElementById('hero-position-y-display');
        if (heroPositionY) {
            heroPositionY.addEventListener('input', function() {
                state.style.heroPositionY = parseInt(this.value);
                if (heroPositionYDisplay) {
                    heroPositionYDisplay.textContent = `${this.value}%`;
                }
                self.updateWavesEffect();
            });
        }
    },
    
    updateWavesEffect: function(skipSave) {
        const state = window.BrandingEditor.state;
        const wavesOverlay = document.getElementById('template-waves');
        
        if (!wavesOverlay) {
            console.warn('Waves overlay not found');
            return;
        }
        
        if (state.style.showHero) {
            wavesOverlay.classList.remove('hidden');
            
            // Apply opacity
            wavesOverlay.style.opacity = state.style.heroOpacity;
            
            // Apply height
            const waveSvgs = wavesOverlay.querySelectorAll('.wave-svg');
            waveSvgs.forEach(svg => {
                svg.style.height = `${state.style.heroWaveHeight}%`;
            });
            
            // Apply scale
            const scale = state.style.heroWaveScale || 1;
            wavesOverlay.style.transform = `scale(${scale}) translate(${state.style.heroPositionX || 0}%, ${state.style.heroPositionY || 0}%)`;
            
            // Apply animation speed via CSS variable
            const baseSpeed = state.style.heroWaveSpeed;
            wavesOverlay.style.setProperty('--wave-speed-1', `${baseSpeed}s`);
            wavesOverlay.style.setProperty('--wave-speed-2', `${baseSpeed * 0.83}s`);
            wavesOverlay.style.setProperty('--wave-speed-3', `${baseSpeed * 1.17}s`);
            
        } else {
            wavesOverlay.classList.add('hidden');
        }
        
        if (!skipSave) window.BrandingEditor.saveState();
    },
    
    // ========================================================================
    // PARTICLES CONTROLS
    // ========================================================================
    
    initParticlesControls: function() {
        const state = window.BrandingEditor.state;
        const self = this;
        
        // Particles toggle
        const showParticles = document.getElementById('show-particles');
        if (showParticles) {
            showParticles.addEventListener('change', function() {
                state.style.showParticles = this.checked;
                self.updateParticlesEffect();
            });
        }
        
        // Particles seed
        const particlesSeed = document.getElementById('particles-seed');
        const particlesSeedRandom = document.getElementById('particles-seed-random');
        if (particlesSeed) {
            particlesSeed.addEventListener('change', function() {
                state.style.particlesSeed = parseInt(this.value);
                self.updateParticlesEffect(false, true);
            });
        }
        if (particlesSeedRandom) {
            particlesSeedRandom.addEventListener('click', function() {
                const newSeed = Math.floor(Math.random() * 9999) + 1;
                particlesSeed.value = newSeed;
                state.style.particlesSeed = newSeed;
                self.updateParticlesEffect(false, true);
            });
        }
        
        // Particles count
        const particlesCount = document.getElementById('particles-count');
        const particlesCountDisplay = document.getElementById('particles-count-display');
        if (particlesCount) {
            particlesCount.addEventListener('input', function() {
                state.style.particlesCount = parseInt(this.value);
                if (particlesCountDisplay) {
                    particlesCountDisplay.textContent = this.value;
                }
                self.updateParticlesEffect(false, true);
            });
        }
        
        // Particles speed
        const particlesSpeed = document.getElementById('particles-speed');
        const particlesSpeedDisplay = document.getElementById('particles-speed-display');
        if (particlesSpeed) {
            particlesSpeed.addEventListener('input', function() {
                state.style.particlesSpeed = parseFloat(this.value);
                if (particlesSpeedDisplay) {
                    particlesSpeedDisplay.textContent = `${this.value}x`;
                }
                self.updateParticlesEffect();
            });
        }
        
        // Particles opacity
        const particlesOpacity = document.getElementById('particles-opacity');
        const particlesOpacityDisplay = document.getElementById('particles-opacity-display');
        if (particlesOpacity) {
            particlesOpacity.addEventListener('input', function() {
                state.style.particlesOpacity = parseFloat(this.value);
                if (particlesOpacityDisplay) {
                    particlesOpacityDisplay.textContent = `${Math.round(this.value * 100)}%`;
                }
                self.updateParticlesEffect();
            });
        }
        
        // Particles size
        const particlesSize = document.getElementById('particles-size');
        const particlesSizeDisplay = document.getElementById('particles-size-display');
        if (particlesSize) {
            particlesSize.addEventListener('input', function() {
                state.style.particlesSize = parseFloat(this.value);
                if (particlesSizeDisplay) {
                    particlesSizeDisplay.textContent = `${this.value}x`;
                }
                self.updateParticlesEffect(false, true);
            });
        }
        
        // Particles position X
        const particlesPositionX = document.getElementById('particles-position-x');
        const particlesPositionXDisplay = document.getElementById('particles-position-x-display');
        if (particlesPositionX) {
            particlesPositionX.addEventListener('input', function() {
                state.style.particlesPositionX = parseInt(this.value);
                if (particlesPositionXDisplay) {
                    particlesPositionXDisplay.textContent = `${this.value}%`;
                }
                self.updateParticlesEffect();
            });
        }
        
        // Particles position Y
        const particlesPositionY = document.getElementById('particles-position-y');
        const particlesPositionYDisplay = document.getElementById('particles-position-y-display');
        if (particlesPositionY) {
            particlesPositionY.addEventListener('input', function() {
                state.style.particlesPositionY = parseInt(this.value);
                if (particlesPositionYDisplay) {
                    particlesPositionYDisplay.textContent = `${this.value}%`;
                }
                self.updateParticlesEffect();
            });
        }
    },
    
    updateParticlesEffect: function(skipSave, forceRecreate) {
        const state = window.BrandingEditor.state;
        const particlesOverlay = document.getElementById('template-particles');
        const self = this;
        
        if (!particlesOverlay) {
            console.warn('Particles overlay not found');
            return;
        }
        
        if (state.style.showParticles) {
            // Show container FIRST so dimensions can be calculated
            particlesOverlay.classList.remove('hidden');
            
            // Apply position transform
            const posX = state.style.particlesPositionX || 0;
            const posY = state.style.particlesPositionY || 0;
            particlesOverlay.style.transform = `translate(${posX}%, ${posY}%)`;
            
            // Use requestAnimationFrame to ensure DOM has updated before initializing
            requestAnimationFrame(() => {
                // Destroy and recreate if forceRecreate is true (seed/params changed)
                if (forceRecreate && self.particles) {
                    self.particles.destroy();
                    self.particles = null;
                }
                
                // Initialize BrandingParticles if not already done
                if (!self.particles && window.BrandingParticles) {
                    try {
                        self.particles = new window.BrandingParticles(particlesOverlay, {
                            seed: state.style.particlesSeed,
                            count: state.style.particlesCount,
                            speed: state.style.particlesSpeed,
                            size: state.style.particlesSize || 1
                        });
                    } catch (e) {
                        console.warn('Failed to initialize BrandingParticles:', e);
                    }
                }
                
                // Update particles settings
                if (self.particles) {
                    self.particles.play();
                    self.particles.setOpacity(state.style.particlesOpacity);
                    self.particles.setSpeed(state.style.particlesSpeed);
                    if (self.particles.setSize) {
                        self.particles.setSize(state.style.particlesSize || 1);
                    }
                }
            });
        } else {
            particlesOverlay.classList.add('hidden');
            
            // Pause particles when hidden for performance
            if (this.particles) {
                this.particles.pause();
            }
        }
        
        if (!skipSave) window.BrandingEditor.saveState();
    }
};
