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
        
        // Logo/title toggle for project template
        if (elements.showLogoTitle) {
            elements.showLogoTitle.addEventListener('change', function() {
                state.style.showLogoTitle = this.checked;
                templates.updateProjectTitleVisibility();
            });
        }
    },
    
    updateStyle: function() {
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
