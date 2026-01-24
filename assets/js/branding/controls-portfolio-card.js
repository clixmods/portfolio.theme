// ============================================================================
// BRANDING - PORTFOLIO CARD CONTROLS MODULE
// ============================================================================
// Portfolio card template-specific size and style controls

window.BrandingEditor = window.BrandingEditor || {};
window.BrandingEditor.controlsPortfolioCard = {
    
    // Initialize portfolio card size controls
    init: function() {
        const state = window.BrandingEditor.state;
        const self = this;
        
        // Ensure portfolio-card template data exists
        if (!state.templates['portfolio-card']) {
            state.templates['portfolio-card'] = {};
        }
        const portfolioData = state.templates['portfolio-card'];
        
        // Name size slider
        const nameSize = document.getElementById('portfolio-name-size');
        const nameSizeDisplay = document.getElementById('portfolio-name-size-display');
        if (nameSize) {
            nameSize.value = portfolioData.nameSize || 2.2;
            if (nameSizeDisplay) nameSizeDisplay.textContent = `${portfolioData.nameSize || 2.2}rem`;
            
            nameSize.addEventListener('input', function() {
                portfolioData.nameSize = parseFloat(this.value);
                if (nameSizeDisplay) nameSizeDisplay.textContent = `${this.value}rem`;
                self.updateStyles();
            });
        }
        
        // Title size slider
        const titleSize = document.getElementById('portfolio-title-size');
        const titleSizeDisplay = document.getElementById('portfolio-title-size-display');
        if (titleSize) {
            titleSize.value = portfolioData.titleSize || 1.1;
            if (titleSizeDisplay) titleSizeDisplay.textContent = `${portfolioData.titleSize || 1.1}rem`;
            
            titleSize.addEventListener('input', function() {
                portfolioData.titleSize = parseFloat(this.value);
                if (titleSizeDisplay) titleSizeDisplay.textContent = `${this.value}rem`;
                self.updateStyles();
            });
        }
        
        // Highlight size slider
        const highlightSize = document.getElementById('portfolio-highlight-size');
        const highlightSizeDisplay = document.getElementById('portfolio-highlight-size-display');
        if (highlightSize) {
            highlightSize.value = portfolioData.highlightSize || 0.85;
            if (highlightSizeDisplay) highlightSizeDisplay.textContent = `${portfolioData.highlightSize || 0.85}rem`;
            
            highlightSize.addEventListener('input', function() {
                portfolioData.highlightSize = parseFloat(this.value);
                if (highlightSizeDisplay) highlightSizeDisplay.textContent = `${this.value}rem`;
                self.updateStyles();
            });
        }
        
        // Avatar size slider
        const avatarSize = document.getElementById('portfolio-avatar-size');
        const avatarSizeDisplay = document.getElementById('portfolio-avatar-size-display');
        if (avatarSize) {
            avatarSize.value = portfolioData.avatarSize || 120;
            if (avatarSizeDisplay) avatarSizeDisplay.textContent = `${portfolioData.avatarSize || 120}px`;
            
            avatarSize.addEventListener('input', function() {
                portfolioData.avatarSize = parseInt(this.value);
                if (avatarSizeDisplay) avatarSizeDisplay.textContent = `${this.value}px`;
                self.updateStyles();
            });
        }
        
        // Tech icon size slider
        const techSize = document.getElementById('portfolio-tech-size');
        const techSizeDisplay = document.getElementById('portfolio-tech-size-display');
        if (techSize) {
            techSize.value = portfolioData.techIconSize || 48;
            if (techSizeDisplay) techSizeDisplay.textContent = `${portfolioData.techIconSize || 48}px`;
            
            techSize.addEventListener('input', function() {
                portfolioData.techIconSize = parseInt(this.value);
                if (techSizeDisplay) techSizeDisplay.textContent = `${this.value}px`;
                self.updateStyles();
            });
        }
        
        // Tech grid gap slider
        const techGap = document.getElementById('portfolio-tech-gap');
        const techGapDisplay = document.getElementById('portfolio-tech-gap-display');
        if (techGap) {
            techGap.value = portfolioData.techGap || 0.75;
            if (techGapDisplay) techGapDisplay.textContent = `${portfolioData.techGap || 0.75}rem`;
            
            techGap.addEventListener('input', function() {
                portfolioData.techGap = parseFloat(this.value);
                if (techGapDisplay) techGapDisplay.textContent = `${this.value}rem`;
                self.updateStyles();
            });
        }
        
        // Tech alignment select
        const techAlign = document.getElementById('portfolio-tech-align');
        if (techAlign) {
            techAlign.value = portfolioData.techAlign || 'center';
            
            techAlign.addEventListener('change', function() {
                portfolioData.techAlign = this.value;
                self.updateStyles();
            });
        }
        
        // Tech max columns slider
        const techCols = document.getElementById('portfolio-tech-cols');
        const techColsDisplay = document.getElementById('portfolio-tech-cols-display');
        if (techCols) {
            techCols.value = portfolioData.techMaxCols || 0;
            if (techColsDisplay) techColsDisplay.textContent = portfolioData.techMaxCols ? `${portfolioData.techMaxCols}` : 'Auto';
            
            techCols.addEventListener('input', function() {
                portfolioData.techMaxCols = parseInt(this.value);
                if (techColsDisplay) techColsDisplay.textContent = this.value === '0' ? 'Auto' : this.value;
                self.updateStyles();
            });
        }
        
        // Content padding slider
        const padding = document.getElementById('portfolio-padding');
        const paddingDisplay = document.getElementById('portfolio-padding-display');
        if (padding) {
            padding.value = portfolioData.contentPadding || 2;
            if (paddingDisplay) paddingDisplay.textContent = `${portfolioData.contentPadding || 2}rem`;
            
            padding.addEventListener('input', function() {
                portfolioData.contentPadding = parseFloat(this.value);
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
        const portfolioData = state.templates['portfolio-card'] || {};
        
        const nameSize = document.getElementById('portfolio-name-size');
        const nameSizeDisplay = document.getElementById('portfolio-name-size-display');
        const titleSize = document.getElementById('portfolio-title-size');
        const titleSizeDisplay = document.getElementById('portfolio-title-size-display');
        const highlightSize = document.getElementById('portfolio-highlight-size');
        const highlightSizeDisplay = document.getElementById('portfolio-highlight-size-display');
        const avatarSize = document.getElementById('portfolio-avatar-size');
        const avatarSizeDisplay = document.getElementById('portfolio-avatar-size-display');
        const techSize = document.getElementById('portfolio-tech-size');
        const techSizeDisplay = document.getElementById('portfolio-tech-size-display');
        const padding = document.getElementById('portfolio-padding');
        const paddingDisplay = document.getElementById('portfolio-padding-display');
        
        if (nameSize) nameSize.value = portfolioData.nameSize || 2.2;
        if (nameSizeDisplay) nameSizeDisplay.textContent = `${portfolioData.nameSize || 2.2}rem`;
        if (titleSize) titleSize.value = portfolioData.titleSize || 1.1;
        if (titleSizeDisplay) titleSizeDisplay.textContent = `${portfolioData.titleSize || 1.1}rem`;
        if (highlightSize) highlightSize.value = portfolioData.highlightSize || 0.85;
        if (highlightSizeDisplay) highlightSizeDisplay.textContent = `${portfolioData.highlightSize || 0.85}rem`;
        if (avatarSize) avatarSize.value = portfolioData.avatarSize || 120;
        if (avatarSizeDisplay) avatarSizeDisplay.textContent = `${portfolioData.avatarSize || 120}px`;
        if (techSize) techSize.value = portfolioData.techIconSize || 48;
        if (techSizeDisplay) techSizeDisplay.textContent = `${portfolioData.techIconSize || 48}px`;
        
        // Grid controls sync
        const techGap = document.getElementById('portfolio-tech-gap');
        const techGapDisplay = document.getElementById('portfolio-tech-gap-display');
        const techAlign = document.getElementById('portfolio-tech-align');
        const techCols = document.getElementById('portfolio-tech-cols');
        const techColsDisplay = document.getElementById('portfolio-tech-cols-display');
        
        if (techGap) techGap.value = portfolioData.techGap || 0.75;
        if (techGapDisplay) techGapDisplay.textContent = `${portfolioData.techGap || 0.75}rem`;
        if (techAlign) techAlign.value = portfolioData.techAlign || 'center';
        if (techCols) techCols.value = portfolioData.techMaxCols || 0;
        if (techColsDisplay) techColsDisplay.textContent = portfolioData.techMaxCols ? `${portfolioData.techMaxCols}` : 'Auto';
        
        if (padding) padding.value = portfolioData.contentPadding || 2;
        if (paddingDisplay) paddingDisplay.textContent = `${portfolioData.contentPadding || 2}rem`;
    },
    
    // Update portfolio card styles via CSS custom properties
    updateStyles: function(skipSave) {
        const state = window.BrandingEditor.state;
        const portfolioData = state.templates['portfolio-card'] || {};
        const template = document.getElementById('template-portfolio-card');
        
        if (!template) return;
        
        // Apply CSS custom properties to the template element
        template.style.setProperty('--portfolio-name-size', `${portfolioData.nameSize || 2.2}rem`);
        template.style.setProperty('--portfolio-title-size', `${portfolioData.titleSize || 1.1}rem`);
        template.style.setProperty('--portfolio-highlight-size', `${portfolioData.highlightSize || 0.85}rem`);
        template.style.setProperty('--portfolio-avatar-size', `${portfolioData.avatarSize || 120}px`);
        template.style.setProperty('--portfolio-tech-size', `${portfolioData.techIconSize || 48}px`);
        template.style.setProperty('--portfolio-tech-gap', `${portfolioData.techGap || 0.75}rem`);
        template.style.setProperty('--portfolio-tech-align', portfolioData.techAlign || 'center');
        template.style.setProperty('--portfolio-padding', `${portfolioData.contentPadding || 2}rem`);
        
        // Apply grid layout when max columns is set
        const techStack = template.querySelector('.template-tech-stack');
        if (techStack) {
            const maxCols = portfolioData.techMaxCols || 0;
            if (maxCols > 0) {
                techStack.style.display = 'grid';
                techStack.style.gridTemplateColumns = `repeat(${maxCols}, min-content)`;
                techStack.style.justifyContent = portfolioData.techAlign || 'center';
            } else {
                techStack.style.display = 'flex';
                techStack.style.gridTemplateColumns = '';
            }
        }
        
        if (!skipSave) window.BrandingEditor.saveState();
    }
};
