// ============================================================================
// BRANDING - CONTROLS MODULE (Main Entry Point)
// ============================================================================
// Orchestrates all control modules: effects, linkedin, resolution
// Delegates to specialized sub-modules for specific functionality

window.BrandingEditor = window.BrandingEditor || {};

window.BrandingEditor.controls = {
    
    init: function() {
        // Initialize toggle groups (UI behavior)
        this.initToggleGroups();
        
        // Initialize style controls (gradient, accent, visibility)
        this.initStyleOptions();
        
        // Initialize sub-modules (with safety checks)
        if (window.BrandingEditor.controlsEffects) {
            window.BrandingEditor.controlsEffects.init();
        } else {
            console.error('[BrandingEditor] controlsEffects module not found');
        }
        
        if (window.BrandingEditor.controlsLinkedin) {
            window.BrandingEditor.controlsLinkedin.init();
        } else {
            console.error('[BrandingEditor] controlsLinkedin module not found');
        }
        
        if (window.BrandingEditor.controlsServiceCard) {
            window.BrandingEditor.controlsServiceCard.init();
        } else {
            console.error('[BrandingEditor] controlsServiceCard module not found');
        }
        
        if (window.BrandingEditor.controlsPortfolioCard) {
            window.BrandingEditor.controlsPortfolioCard.init();
        } else {
            console.error('[BrandingEditor] controlsPortfolioCard module not found');
        }
        
        if (window.BrandingEditor.controlsSkillHighlight) {
            window.BrandingEditor.controlsSkillHighlight.init();
        } else {
            console.error('[BrandingEditor] controlsSkillHighlight module not found');
        }
        
        if (window.BrandingEditor.controlsProjectShowcase) {
            window.BrandingEditor.controlsProjectShowcase.init();
        } else {
            console.error('[BrandingEditor] controlsProjectShowcase module not found');
        }
        
        if (window.BrandingEditor.controlsResolution) {
            window.BrandingEditor.controlsResolution.init();
        } else {
            console.error('[BrandingEditor] controlsResolution module not found');
        }
        
        // Apply initial state values to UI and effects
        this.applyInitialState();
    },
    
    // ========================================================================
    // TOGGLE GROUPS (Collapsible sections)
    // ========================================================================
    
    initToggleGroups: function() {
        const toggleGroups = document.querySelectorAll('.style-toggle-group');
        
        toggleGroups.forEach(function(group) {
            const header = group.querySelector('.style-toggle-header');
            const expandBtn = group.querySelector('.toggle-expand-btn');
            const checkbox = group.querySelector('input[type="checkbox"]');
            
            if (!header || !expandBtn) return;
            
            // Toggle expansion when clicking header (except on checkbox)
            header.addEventListener('click', function(e) {
                if (e.target.type === 'checkbox') return;
                
                const isExpanded = group.classList.contains('expanded');
                group.classList.toggle('expanded');
                expandBtn.setAttribute('aria-expanded', !isExpanded);
            });
            
            // Prevent checkbox click from toggling the group
            if (checkbox) {
                checkbox.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
            }
        });
    },
    
    // ========================================================================
    // INITIAL STATE SYNCHRONIZATION
    // ========================================================================
    
    applyInitialState: function() {
        const state = window.BrandingEditor.state;
        
        // Sync gradient controls
        const showGradient = document.getElementById('show-gradient');
        const gradientStart = document.getElementById('gradient-start');
        const gradientEnd = document.getElementById('gradient-end');
        const gradientAngle = document.getElementById('gradient-angle');
        const angleDisplay = document.getElementById('angle-display');
        
        if (showGradient) showGradient.checked = state.style.showGradient;
        if (gradientStart) gradientStart.value = state.style.gradientStart;
        if (gradientEnd) gradientEnd.value = state.style.gradientEnd;
        if (gradientAngle) gradientAngle.value = state.style.gradientAngle;
        if (angleDisplay) angleDisplay.textContent = `${state.style.gradientAngle}°`;
        
        // Sync accent color
        const accentColor = document.getElementById('accent-color');
        if (accentColor) accentColor.value = state.style.accentColor;
        
        // Sync show/hide toggles
        const showAuthor = document.getElementById('show-author');
        const showDecoration = document.getElementById('show-decoration');
        if (showAuthor) showAuthor.checked = state.style.showAuthor;
        if (showDecoration) showDecoration.checked = state.style.showDecoration;
        
        // Sync sub-modules with state (with safety checks)
        if (window.BrandingEditor.controlsEffects && window.BrandingEditor.controlsEffects.syncWithState) {
            window.BrandingEditor.controlsEffects.syncWithState();
        }
        if (window.BrandingEditor.controlsLinkedin && window.BrandingEditor.controlsLinkedin.syncWithState) {
            window.BrandingEditor.controlsLinkedin.syncWithState();
        }
        if (window.BrandingEditor.controlsServiceCard && window.BrandingEditor.controlsServiceCard.syncWithState) {
            window.BrandingEditor.controlsServiceCard.syncWithState();
        }
        if (window.BrandingEditor.controlsPortfolioCard && window.BrandingEditor.controlsPortfolioCard.syncWithState) {
            window.BrandingEditor.controlsPortfolioCard.syncWithState();
        }
        if (window.BrandingEditor.controlsSkillHighlight && window.BrandingEditor.controlsSkillHighlight.syncWithState) {
            window.BrandingEditor.controlsSkillHighlight.syncWithState();
        }
        if (window.BrandingEditor.controlsProjectShowcase && window.BrandingEditor.controlsProjectShowcase.syncWithState) {
            window.BrandingEditor.controlsProjectShowcase.syncWithState();
        }
        
        // Apply all effects (skipSave=true to avoid saving during init)
        this.updateStyle(true);
        if (window.BrandingEditor.controlsEffects && window.BrandingEditor.controlsEffects.applyAll) {
            window.BrandingEditor.controlsEffects.applyAll(true);
        }
        if (window.BrandingEditor.controlsLinkedin && window.BrandingEditor.controlsLinkedin.updateStyles) {
            window.BrandingEditor.controlsLinkedin.updateStyles(true);
        }
        if (window.BrandingEditor.controlsServiceCard && window.BrandingEditor.controlsServiceCard.updateStyles) {
            window.BrandingEditor.controlsServiceCard.updateStyles(true);
        }
        if (window.BrandingEditor.controlsPortfolioCard && window.BrandingEditor.controlsPortfolioCard.updateStyles) {
            window.BrandingEditor.controlsPortfolioCard.updateStyles(true);
        }
        if (window.BrandingEditor.controlsSkillHighlight && window.BrandingEditor.controlsSkillHighlight.updateStyles) {
            window.BrandingEditor.controlsSkillHighlight.updateStyles(true);
        }
        if (window.BrandingEditor.controlsProjectShowcase && window.BrandingEditor.controlsProjectShowcase.updateStyles) {
            window.BrandingEditor.controlsProjectShowcase.updateStyles(true);
        }
    },
    
    // ========================================================================
    // STYLE OPTIONS (Gradient, Accent, Visibility)
    // ========================================================================
    
    initStyleOptions: function() {
        const elements = window.BrandingEditor.elements;
        const state = window.BrandingEditor.state;
        const self = this;
        
        // Show/hide gradient toggle
        if (elements.showGradient) {
            elements.showGradient.addEventListener('change', function() {
                state.style.showGradient = this.checked;
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
    
    // ========================================================================
    // STYLE UPDATE (Background, accent, visibility)
    // ========================================================================
    
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
    
    // ========================================================================
    // DELEGATED METHODS (for backward compatibility)
    // ========================================================================
    
    // These methods delegate to sub-modules for components that call them directly
    
    updateGrainEffect: function(skipSave) {
        if (window.BrandingEditor.controlsEffects) {
            window.BrandingEditor.controlsEffects.updateGrainEffect(skipSave);
        }
    },
    
    updateWavesEffect: function(skipSave) {
        if (window.BrandingEditor.controlsEffects) {
            window.BrandingEditor.controlsEffects.updateWavesEffect(skipSave);
        }
    },
    
    updateParticlesEffect: function(skipSave, forceRecreate) {
        if (window.BrandingEditor.controlsEffects) {
            window.BrandingEditor.controlsEffects.updateParticlesEffect(skipSave, forceRecreate);
        }
    },
    
    updateLinkedinStyles: function(skipSave) {
        if (window.BrandingEditor.controlsLinkedin) {
            window.BrandingEditor.controlsLinkedin.updateStyles(skipSave);
        }
    }
};
