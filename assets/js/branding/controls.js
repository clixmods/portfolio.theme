// ============================================================================
// BRANDING - CONTROLS MODULE
// ============================================================================
// Resolution, zoom, and style controls

window.BrandingEditor = window.BrandingEditor || {};

window.BrandingEditor.controls = {
    init: function() {
        this.initStyleOptions();
        this.initResolutionControls();
        this.initZoomControls();
        
        // Apply initial state values to UI and effects
        this.applyInitialState();
    },
    
    // Synchronize UI inputs with state and apply all effects
    applyInitialState: function() {
        const state = window.BrandingEditor.state;
        
        // Sync gradient controls
        const showGradient = document.getElementById('show-gradient');
        const gradientStart = document.getElementById('gradient-start');
        const gradientEnd = document.getElementById('gradient-end');
        const gradientAngle = document.getElementById('gradient-angle');
        const angleDisplay = document.getElementById('angle-display');
        const gradientOptions = document.getElementById('gradient-options');
        const angleOptions = document.getElementById('angle-options');
        
        if (showGradient) showGradient.checked = state.style.showGradient;
        if (gradientStart) gradientStart.value = state.style.gradientStart;
        if (gradientEnd) gradientEnd.value = state.style.gradientEnd;
        if (gradientAngle) gradientAngle.value = state.style.gradientAngle;
        if (angleDisplay) angleDisplay.textContent = `${state.style.gradientAngle}°`;
        if (gradientOptions) gradientOptions.style.display = state.style.showGradient ? 'flex' : 'none';
        if (angleOptions) angleOptions.style.display = state.style.showGradient ? 'flex' : 'none';
        
        // Sync accent color
        const accentColor = document.getElementById('accent-color');
        if (accentColor) accentColor.value = state.style.accentColor;
        
        // Sync show/hide toggles
        const showAuthor = document.getElementById('show-author');
        const showDecoration = document.getElementById('show-decoration');
        if (showAuthor) showAuthor.checked = state.style.showAuthor;
        if (showDecoration) showDecoration.checked = state.style.showDecoration;
        
        // Sync grain controls
        const showGrain = document.getElementById('show-grain');
        const grainOpacity = document.getElementById('grain-opacity');
        const grainOpacityDisplay = document.getElementById('grain-opacity-display');
        const grainSize = document.getElementById('grain-size');
        const grainSizeDisplay = document.getElementById('grain-size-display');
        const grainOptions = document.getElementById('grain-options');
        const grainSizeOptions = document.getElementById('grain-size-options');
        
        if (showGrain) showGrain.checked = state.style.showGrain;
        if (grainOpacity) grainOpacity.value = state.style.grainOpacity;
        if (grainOpacityDisplay) grainOpacityDisplay.textContent = `${Math.round(state.style.grainOpacity * 100)}%`;
        if (grainSize) grainSize.value = state.style.grainSize;
        if (grainSizeDisplay) grainSizeDisplay.textContent = `${state.style.grainSize}x`;
        if (grainOptions) grainOptions.classList.toggle('hidden', !state.style.showGrain);
        if (grainSizeOptions) grainSizeOptions.classList.toggle('hidden', !state.style.showGrain);
        
        // Sync hero/waves controls (SVG waves)
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
        
        // All wave option containers
        const waveOptionContainers = [
            'hero-opacity-options', 'hero-speed-options', 'hero-height-options',
            'hero-scale-options', 'hero-position-x-options', 'hero-position-y-options'
        ];
        
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
        waveOptionContainers.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.toggle('hidden', !state.style.showHero);
        });
        
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
        
        // All particle option containers
        const particleOptionContainers = [
            'particles-seed-options', 'particles-count-options', 'particles-speed-options', 'particles-opacity-options',
            'particles-size-options', 'particles-position-x-options', 'particles-position-y-options'
        ];
        
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
        particleOptionContainers.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.toggle('hidden', !state.style.showParticles);
        });
        
        // Apply all effects (skipSave=true to avoid saving during init)
        this.updateStyle(true);
        this.updateGrainEffect(true);
        this.updateWavesEffect(true);
        this.updateParticlesEffect(true);
    },
    
    initStyleOptions: function() {
        const elements = window.BrandingEditor.elements;
        const state = window.BrandingEditor.state;
        const templates = window.BrandingEditor.templates;
        const self = this;
        
        // Show/hide gradient toggle
        if (elements.showGradient) {
            elements.showGradient.addEventListener('change', function() {
                state.style.showGradient = this.checked;
                if (elements.gradientOptions) {
                    elements.gradientOptions.style.display = this.checked ? 'flex' : 'none';
                }
                if (elements.angleOptions) {
                    elements.angleOptions.style.display = this.checked ? 'flex' : 'none';
                }
                self.updateStyle();
            });
        }
        
        // Gradient controls
        if (elements.gradientStart) {
            elements.gradientStart.addEventListener('input', function() {
                state.style.gradientStart = this.value;
                self.updateStyle();
            });
        }
        if (elements.gradientEnd) {
            elements.gradientEnd.addEventListener('input', function() {
                state.style.gradientEnd = this.value;
                self.updateStyle();
            });
        }
        if (elements.gradientAngle) {
            elements.gradientAngle.addEventListener('input', function() {
                state.style.gradientAngle = parseInt(this.value);
                if (elements.angleDisplay) {
                    elements.angleDisplay.textContent = `${this.value}°`;
                }
                self.updateStyle();
            });
        }

        // Accent color
        if (elements.accentColor) {
            elements.accentColor.addEventListener('input', function() {
                state.style.accentColor = this.value;
                self.updateStyle();
            });
        }

        // Show/hide options
        if (elements.showAuthor) {
            elements.showAuthor.addEventListener('change', function() {
                state.style.showAuthor = this.checked;
                self.updateStyle();
            });
        }
        if (elements.showDecoration) {
            elements.showDecoration.addEventListener('change', function() {
                state.style.showDecoration = this.checked;
                self.updateStyle();
            });
        }

        // Grain effect controls
        this.initGrainControls();
        
        // Hero background controls
        this.initHeroControls();
        
        // Reset button
        const resetBtn = document.getElementById('reset-editor');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                if (confirm('Reinitialiser tous les parametres aux valeurs par defaut ?')) {
                    window.BrandingEditor.resetState();
                }
            });
        }
    },
    
    initGrainControls: function() {
        const elements = window.BrandingEditor.elements;
        const state = window.BrandingEditor.state;
        const self = this;
        
        // Grain toggle
        const showGrain = document.getElementById('show-grain');
        const grainOptions = document.getElementById('grain-options');
        const grainSizeOptions = document.getElementById('grain-size-options');
        
        if (showGrain) {
            showGrain.addEventListener('change', function() {
                state.style.showGrain = this.checked;
                if (grainOptions) grainOptions.classList.toggle('hidden', !this.checked);
                if (grainSizeOptions) grainSizeOptions.classList.toggle('hidden', !this.checked);
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
    
    initHeroControls: function() {
        const state = window.BrandingEditor.state;
        const self = this;
        
        // All wave option containers
        const waveOptionContainers = [
            'hero-opacity-options', 'hero-speed-options', 'hero-height-options',
            'hero-scale-options', 'hero-position-x-options', 'hero-position-y-options'
        ];
        
        // Waves toggle
        const showHero = document.getElementById('show-hero');
        
        if (showHero) {
            showHero.addEventListener('change', function() {
                state.style.showHero = this.checked;
                waveOptionContainers.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.classList.toggle('hidden', !this.checked);
                });
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
        
        // All particle option containers
        const particleOptionContainers = [
            'particles-seed-options', 'particles-count-options', 'particles-speed-options', 'particles-opacity-options',
            'particles-size-options', 'particles-position-x-options', 'particles-position-y-options'
        ];
        
        // Particles toggle
        const showParticles = document.getElementById('show-particles');
        
        if (showParticles) {
            showParticles.addEventListener('change', function() {
                state.style.showParticles = this.checked;
                particleOptionContainers.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.classList.toggle('hidden', !this.checked);
                });
                self.updateParticlesEffect();
            });
        }
        
        // Particles seed
        const particlesSeed = document.getElementById('particles-seed');
        const particlesSeedRandom = document.getElementById('particles-seed-random');
        
        if (particlesSeed) {
            particlesSeed.addEventListener('change', function() {
                state.style.particlesSeed = parseInt(this.value);
                self.updateParticlesEffect(false, true); // Force recreate
            });
        }
        
        if (particlesSeedRandom) {
            particlesSeedRandom.addEventListener('click', function() {
                const newSeed = Math.floor(Math.random() * 9999) + 1;
                particlesSeed.value = newSeed;
                state.style.particlesSeed = newSeed;
                self.updateParticlesEffect(false, true); // Force recreate
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
                self.updateParticlesEffect(false, true); // Force recreate
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
                self.updateParticlesEffect(false, true); // Force recreate
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
    
    updateParticlesEffect: function(skipSave, forceRecreate) {
        const state = window.BrandingEditor.state;
        const particlesOverlay = document.getElementById('template-particles');
        
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
                if (forceRecreate && this.particles) {
                    this.particles.destroy();
                    this.particles = null;
                }
                
                // Initialize BrandingParticles if not already done
                if (!this.particles && window.BrandingParticles) {
                    try {
                        this.particles = new window.BrandingParticles(particlesOverlay, {
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
                if (this.particles) {
                    this.particles.play();
                    this.particles.setOpacity(state.style.particlesOpacity);
                    this.particles.setSpeed(state.style.particlesSpeed);
                    if (this.particles.setSize) {
                        this.particles.setSize(state.style.particlesSize || 1);
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
    },
    
    updateStyle: function(skipSave) {
        const state = window.BrandingEditor.state;
        const elements = window.BrandingEditor.elements;
        
        // Update all template backgrounds based on gradient toggle
        document.querySelectorAll('.template-bg').forEach(bg => {
            if (state.style.showGradient) {
                bg.style.background = `linear-gradient(${state.style.gradientAngle}deg, ${state.style.gradientStart}, ${state.style.gradientEnd})`;
            } else {
                bg.style.background = 'transparent';
            }
        });

        // Update accent color (CSS variable)
        document.documentElement.style.setProperty('--branding-accent', state.style.accentColor);

        // Update highlight colors
        document.querySelectorAll('.branding-template .highlight').forEach(el => {
            el.style.color = state.style.accentColor;
        });
        
        // Update fluid waves accent color if initialized
        if (this.fluidWaves) {
            this.fluidWaves.updateAccentColor(state.style.accentColor);
        }

        // Show/hide author sections
        document.querySelectorAll('.template-author').forEach(author => {
            author.classList.toggle('hidden', !state.style.showAuthor);
        });

        // Show/hide decorations
        if (elements.templateDecoration) {
            elements.templateDecoration.classList.toggle('hidden', !state.style.showDecoration);
        }
        
        if (!skipSave) window.BrandingEditor.saveState();
    },
    
    initResolutionControls: function() {
        const state = window.BrandingEditor.state;
        const preview = window.BrandingEditor.preview;
        
        const presetButtons = document.querySelectorAll('.preset-btn');
        const widthInput = document.getElementById('custom-width');
        const heightInput = document.getElementById('custom-height');
        const applyBtn = document.getElementById('apply-custom-size');

        presetButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                presetButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                state.width = parseInt(this.dataset.width);
                state.height = parseInt(this.dataset.height);

                if (widthInput) widthInput.value = state.width;
                if (heightInput) heightInput.value = state.height;

                preview.update();
                window.BrandingEditor.saveState();
            });
        });

        if (applyBtn) {
            applyBtn.addEventListener('click', function() {
                const width = parseInt(widthInput.value);
                const height = parseInt(heightInput.value);

                if (width >= 100 && width <= 3840 && height >= 100 && height <= 2160) {
                    state.width = width;
                    state.height = height;
                    presetButtons.forEach(b => b.classList.remove('active'));
                    preview.update();
                    window.BrandingEditor.saveState();
                }
            });
        }

        // Enter key support
        [widthInput, heightInput].forEach(input => {
            if (input) {
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        applyBtn?.click();
                    }
                });
            }
        });
    },
    
    initZoomControls: function() {
        const state = window.BrandingEditor.state;
        const elements = window.BrandingEditor.elements;
        const preview = window.BrandingEditor.preview;
        
        const zoomButtons = document.querySelectorAll('.zoom-btn');

        zoomButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                zoomButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const zoomValue = this.dataset.zoom;

                if (zoomValue === 'fit') {
                    const containerWidth = elements.previewContainer.clientWidth - 40;
                    const containerHeight = elements.previewContainer.clientHeight - 40;
                    const scaleX = containerWidth / state.width;
                    const scaleY = containerHeight / state.height;
                    state.zoom = Math.min(scaleX, scaleY, 1);
                } else {
                    state.zoom = parseFloat(zoomValue);
                }

                preview.update();
            });
        });
    }
};
