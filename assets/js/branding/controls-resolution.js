// ============================================================================
// BRANDING - RESOLUTION & ZOOM CONTROLS MODULE
// ============================================================================
// Resolution presets, custom size, and zoom controls

window.BrandingEditor = window.BrandingEditor || {};
window.BrandingEditor.controlsResolution = {
    
    // Initialize resolution and zoom controls
    init: function() {
        this.initResolutionControls();
        this.initZoomControls();
    },
    
    // ========================================================================
    // RESOLUTION CONTROLS
    // ========================================================================
    
    initResolutionControls: function() {
        const state = window.BrandingEditor.state;
        const preview = window.BrandingEditor.preview;
        
        const presetButtons = document.querySelectorAll('.preset-btn');
        const widthInput = document.getElementById('custom-width');
        const heightInput = document.getElementById('custom-height');
        const applyBtn = document.getElementById('apply-custom-size');

        // Preset buttons
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

        // Custom size apply button
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

        // Enter key support for custom inputs
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
    
    // ========================================================================
    // ZOOM CONTROLS
    // ========================================================================
    
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
