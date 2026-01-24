// ============================================================================
// BRANDING - SERVICE CARD CONTROLS MODULE
// ============================================================================
// Service card template-specific size and style controls

window.BrandingEditor = window.BrandingEditor || {};
window.BrandingEditor.controlsServiceCard = {
    
    // Initialize service card size controls
    init: function() {
        const state = window.BrandingEditor.state;
        const self = this;
        
        // Ensure service-card template data exists
        if (!state.templates['service-card']) {
            state.templates['service-card'] = {};
        }
        const serviceData = state.templates['service-card'];
        
        // Title size slider
        const titleSize = document.getElementById('service-title-size');
        const titleSizeDisplay = document.getElementById('service-title-size-display');
        if (titleSize) {
            titleSize.value = serviceData.titleSize || 1.8;
            if (titleSizeDisplay) titleSizeDisplay.textContent = `${serviceData.titleSize || 1.8}rem`;
            
            titleSize.addEventListener('input', function() {
                serviceData.titleSize = parseFloat(this.value);
                if (titleSizeDisplay) titleSizeDisplay.textContent = `${this.value}rem`;
                self.updateStyles();
            });
        }
        
        // Subtitle size slider
        const subtitleSize = document.getElementById('service-subtitle-size');
        const subtitleSizeDisplay = document.getElementById('service-subtitle-size-display');
        if (subtitleSize) {
            subtitleSize.value = serviceData.subtitleSize || 1;
            if (subtitleSizeDisplay) subtitleSizeDisplay.textContent = `${serviceData.subtitleSize || 1}rem`;
            
            subtitleSize.addEventListener('input', function() {
                serviceData.subtitleSize = parseFloat(this.value);
                if (subtitleSizeDisplay) subtitleSizeDisplay.textContent = `${this.value}rem`;
                self.updateStyles();
            });
        }
        
        // Badge size slider
        const badgeSize = document.getElementById('service-badge-size');
        const badgeSizeDisplay = document.getElementById('service-badge-size-display');
        if (badgeSize) {
            badgeSize.value = serviceData.badgeSize || 0.85;
            if (badgeSizeDisplay) badgeSizeDisplay.textContent = `${serviceData.badgeSize || 0.85}rem`;
            
            badgeSize.addEventListener('input', function() {
                serviceData.badgeSize = parseFloat(this.value);
                if (badgeSizeDisplay) badgeSizeDisplay.textContent = `${this.value}rem`;
                self.updateStyles();
            });
        }
        
        // Feature size slider
        const featureSize = document.getElementById('service-feature-size');
        const featureSizeDisplay = document.getElementById('service-feature-size-display');
        if (featureSize) {
            featureSize.value = serviceData.featureSize || 0.95;
            if (featureSizeDisplay) featureSizeDisplay.textContent = `${serviceData.featureSize || 0.95}rem`;
            
            featureSize.addEventListener('input', function() {
                serviceData.featureSize = parseFloat(this.value);
                if (featureSizeDisplay) featureSizeDisplay.textContent = `${this.value}rem`;
                self.updateStyles();
            });
        }
        
        // Tech icon size slider
        const techSize = document.getElementById('service-tech-size');
        const techSizeDisplay = document.getElementById('service-tech-size-display');
        if (techSize) {
            techSize.value = serviceData.techIconSize || 36;
            if (techSizeDisplay) techSizeDisplay.textContent = `${serviceData.techIconSize || 36}px`;
            
            techSize.addEventListener('input', function() {
                serviceData.techIconSize = parseInt(this.value);
                if (techSizeDisplay) techSizeDisplay.textContent = `${this.value}px`;
                self.updateStyles();
            });
        }
        
        // Tech grid gap slider
        const techGap = document.getElementById('service-tech-gap');
        const techGapDisplay = document.getElementById('service-tech-gap-display');
        if (techGap) {
            techGap.value = serviceData.techGap || 0.75;
            if (techGapDisplay) techGapDisplay.textContent = `${serviceData.techGap || 0.75}rem`;
            
            techGap.addEventListener('input', function() {
                serviceData.techGap = parseFloat(this.value);
                if (techGapDisplay) techGapDisplay.textContent = `${this.value}rem`;
                self.updateStyles();
            });
        }
        
        // Tech alignment select
        const techAlign = document.getElementById('service-tech-align');
        if (techAlign) {
            techAlign.value = serviceData.techAlign || 'flex-start';
            
            techAlign.addEventListener('change', function() {
                serviceData.techAlign = this.value;
                self.updateStyles();
            });
        }
        
        // Tech max columns slider
        const techCols = document.getElementById('service-tech-cols');
        const techColsDisplay = document.getElementById('service-tech-cols-display');
        if (techCols) {
            techCols.value = serviceData.techMaxCols || 0;
            if (techColsDisplay) techColsDisplay.textContent = serviceData.techMaxCols ? `${serviceData.techMaxCols}` : 'Auto';
            
            techCols.addEventListener('input', function() {
                serviceData.techMaxCols = parseInt(this.value);
                if (techColsDisplay) techColsDisplay.textContent = this.value === '0' ? 'Auto' : this.value;
                self.updateStyles();
            });
        }
        
        // Content padding slider
        const padding = document.getElementById('service-padding');
        const paddingDisplay = document.getElementById('service-padding-display');
        if (padding) {
            padding.value = serviceData.contentPadding || 2;
            if (paddingDisplay) paddingDisplay.textContent = `${serviceData.contentPadding || 2}rem`;
            
            padding.addEventListener('input', function() {
                serviceData.contentPadding = parseFloat(this.value);
                if (paddingDisplay) paddingDisplay.textContent = `${this.value}rem`;
                self.updateStyles();
            });
        }
        
        // Apply initial styles
        this.updateStyles(true);
    },
    
    // Synchronize controls with state
    syncWithState: function() {
        const state = window.BrandingEditor.state;
        const serviceData = state.templates['service-card'] || {};
        
        const titleSize = document.getElementById('service-title-size');
        const titleSizeDisplay = document.getElementById('service-title-size-display');
        const subtitleSize = document.getElementById('service-subtitle-size');
        const subtitleSizeDisplay = document.getElementById('service-subtitle-size-display');
        const badgeSize = document.getElementById('service-badge-size');
        const badgeSizeDisplay = document.getElementById('service-badge-size-display');
        const featureSize = document.getElementById('service-feature-size');
        const featureSizeDisplay = document.getElementById('service-feature-size-display');
        const techSize = document.getElementById('service-tech-size');
        const techSizeDisplay = document.getElementById('service-tech-size-display');
        const padding = document.getElementById('service-padding');
        const paddingDisplay = document.getElementById('service-padding-display');
        
        if (titleSize) titleSize.value = serviceData.titleSize || 1.8;
        if (titleSizeDisplay) titleSizeDisplay.textContent = `${serviceData.titleSize || 1.8}rem`;
        if (subtitleSize) subtitleSize.value = serviceData.subtitleSize || 1;
        if (subtitleSizeDisplay) subtitleSizeDisplay.textContent = `${serviceData.subtitleSize || 1}rem`;
        if (badgeSize) badgeSize.value = serviceData.badgeSize || 0.85;
        if (badgeSizeDisplay) badgeSizeDisplay.textContent = `${serviceData.badgeSize || 0.85}rem`;
        if (featureSize) featureSize.value = serviceData.featureSize || 0.95;
        if (featureSizeDisplay) featureSizeDisplay.textContent = `${serviceData.featureSize || 0.95}rem`;
        if (techSize) techSize.value = serviceData.techIconSize || 36;
        if (techSizeDisplay) techSizeDisplay.textContent = `${serviceData.techIconSize || 36}px`;
        
        // Grid controls sync
        const techGap = document.getElementById('service-tech-gap');
        const techGapDisplay = document.getElementById('service-tech-gap-display');
        const techAlign = document.getElementById('service-tech-align');
        const techCols = document.getElementById('service-tech-cols');
        const techColsDisplay = document.getElementById('service-tech-cols-display');
        
        if (techGap) techGap.value = serviceData.techGap || 0.75;
        if (techGapDisplay) techGapDisplay.textContent = `${serviceData.techGap || 0.75}rem`;
        if (techAlign) techAlign.value = serviceData.techAlign || 'flex-start';
        if (techCols) techCols.value = serviceData.techMaxCols || 0;
        if (techColsDisplay) techColsDisplay.textContent = serviceData.techMaxCols ? `${serviceData.techMaxCols}` : 'Auto';
        
        if (padding) padding.value = serviceData.contentPadding || 2;
        if (paddingDisplay) paddingDisplay.textContent = `${serviceData.contentPadding || 2}rem`;
    },
    
    // Update service card styles via CSS custom properties
    updateStyles: function(skipSave) {
        const state = window.BrandingEditor.state;
        const serviceData = state.templates['service-card'] || {};
        const template = document.getElementById('template-service-card');
        
        if (!template) return;
        
        // Apply CSS custom properties to the template element
        template.style.setProperty('--service-title-size', `${serviceData.titleSize || 1.8}rem`);
        template.style.setProperty('--service-subtitle-size', `${serviceData.subtitleSize || 1}rem`);
        template.style.setProperty('--service-badge-size', `${serviceData.badgeSize || 0.85}rem`);
        template.style.setProperty('--service-feature-size', `${serviceData.featureSize || 0.95}rem`);
        template.style.setProperty('--service-tech-size', `${serviceData.techIconSize || 36}px`);
        template.style.setProperty('--service-tech-gap', `${serviceData.techGap || 0.75}rem`);
        template.style.setProperty('--service-tech-align', serviceData.techAlign || 'flex-start');
        template.style.setProperty('--service-padding', `${serviceData.contentPadding || 2}rem`);
        
        // Apply grid layout when max columns is set
        const techStack = template.querySelector('.template-tech-stack');
        if (techStack) {
            const maxCols = serviceData.techMaxCols || 0;
            if (maxCols > 0) {
                techStack.style.display = 'grid';
                techStack.style.gridTemplateColumns = `repeat(${maxCols}, min-content)`;
                techStack.style.justifyContent = serviceData.techAlign || 'flex-start';
            } else {
                techStack.style.display = 'flex';
                techStack.style.gridTemplateColumns = '';
            }
        }
        
        if (!skipSave) window.BrandingEditor.saveState();
    }
};
