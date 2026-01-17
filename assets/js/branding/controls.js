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
        
        // Sync hero controls
        const showHero = document.getElementById('show-hero');
        const heroWaveHeight = document.getElementById('hero-wave-height');
        const heroWaveHeightDisplay = document.getElementById('hero-wave-height-display');
        const heroWaveSpeed = document.getElementById('hero-wave-speed');
        const heroWaveSpeedDisplay = document.getElementById('hero-wave-speed-display');
        const heroOpacity = document.getElementById('hero-opacity');
        const heroOpacityDisplay = document.getElementById('hero-opacity-display');
        const heroOptions = document.getElementById('hero-options');
        const heroSpeedOptions = document.getElementById('hero-speed-options');
        const heroOpacityOptions = document.getElementById('hero-opacity-options');
        
        if (showHero) showHero.checked = state.style.showHero;
        if (heroWaveHeight) heroWaveHeight.value = state.style.heroWaveHeight;
        if (heroWaveHeightDisplay) heroWaveHeightDisplay.textContent = `${state.style.heroWaveHeight}px`;
        if (heroWaveSpeed) heroWaveSpeed.value = state.style.heroWaveSpeed;
        if (heroWaveSpeedDisplay) heroWaveSpeedDisplay.textContent = `${state.style.heroWaveSpeed}s`;
        if (heroOpacity) heroOpacity.value = state.style.heroOpacity;
        if (heroOpacityDisplay) heroOpacityDisplay.textContent = `${Math.round(state.style.heroOpacity * 100)}%`;
        if (heroOptions) heroOptions.classList.toggle('hidden', !state.style.showHero);
        if (heroSpeedOptions) heroSpeedOptions.classList.toggle('hidden', !state.style.showHero);
        if (heroOpacityOptions) heroOpacityOptions.classList.toggle('hidden', !state.style.showHero);
        
        // Apply all effects (skipSave=true to avoid saving during init)
        this.updateStyle(true);
        this.updateGrainEffect(true);
        this.updateHeroEffect(true);
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
        
        // Hero toggle
        const showHero = document.getElementById('show-hero');
        const heroOptions = document.getElementById('hero-options');
        const heroSpeedOptions = document.getElementById('hero-speed-options');
        const heroOpacityOptions = document.getElementById('hero-opacity-options');
        
        if (showHero) {
            showHero.addEventListener('change', function() {
                state.style.showHero = this.checked;
                if (heroOptions) heroOptions.classList.toggle('hidden', !this.checked);
                if (heroSpeedOptions) heroSpeedOptions.classList.toggle('hidden', !this.checked);
                if (heroOpacityOptions) heroOpacityOptions.classList.toggle('hidden', !this.checked);
                self.updateHeroEffect();
            });
        }
        
        // Wave height
        const heroWaveHeight = document.getElementById('hero-wave-height');
        const heroWaveHeightDisplay = document.getElementById('hero-wave-height-display');
        
        if (heroWaveHeight) {
            heroWaveHeight.addEventListener('input', function() {
                state.style.heroWaveHeight = parseInt(this.value);
                if (heroWaveHeightDisplay) {
                    heroWaveHeightDisplay.textContent = `${this.value}px`;
                }
                self.updateHeroEffect();
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
                self.updateHeroEffect();
            });
        }
        
        // Hero opacity
        const heroOpacity = document.getElementById('hero-opacity');
        const heroOpacityDisplay = document.getElementById('hero-opacity-display');
        
        if (heroOpacity) {
            heroOpacity.addEventListener('input', function() {
                state.style.heroOpacity = parseFloat(this.value);
                if (heroOpacityDisplay) {
                    heroOpacityDisplay.textContent = `${Math.round(this.value * 100)}%`;
                }
                self.updateHeroEffect();
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
    
    updateHeroEffect: function(skipSave) {
        const state = window.BrandingEditor.state;
        const heroOverlay = document.getElementById('template-hero');
        
        if (!heroOverlay) return;
        
        if (state.style.showHero) {
            heroOverlay.classList.remove('hidden');
            
            // Update wave height
            const waves = heroOverlay.querySelector('.hero-waves');
            if (waves) {
                waves.style.height = `${state.style.heroWaveHeight}px`;
            }
            
            // Update wave opacity
            const wavePaths = heroOverlay.querySelectorAll('.wave');
            wavePaths.forEach(wave => {
                wave.style.opacity = state.style.heroOpacity;
            });
            
            // Update animation speed
            wavePaths.forEach((wave, index) => {
                const delay = index * -2;
                wave.style.animation = `wave-drift ${state.style.heroWaveSpeed}s ease-in-out infinite`;
                wave.style.animationDelay = `${delay}s`;
            });
        } else {
            heroOverlay.classList.add('hidden');
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
