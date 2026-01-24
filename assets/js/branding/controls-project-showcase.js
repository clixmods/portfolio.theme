// ============================================================================
// BRANDING - PROJECT SHOWCASE CONTROLS MODULE
// ============================================================================
// Project showcase template-specific size and style controls

window.BrandingEditor = window.BrandingEditor || {};
window.BrandingEditor.controlsProjectShowcase = {
    
    // Initialize project showcase size controls
    init: function() {
        const state = window.BrandingEditor.state;
        const self = this;
        
        // Ensure project-showcase template data exists
        if (!state.templates['project-showcase']) {
            state.templates['project-showcase'] = {};
        }
        const projectData = state.templates['project-showcase'];
        
        // Title size slider
        const titleSize = document.getElementById('project-title-size');
        const titleSizeDisplay = document.getElementById('project-title-size-display');
        if (titleSize) {
            titleSize.value = projectData.titleSize || 2.5;
            if (titleSizeDisplay) titleSizeDisplay.textContent = `${projectData.titleSize || 2.5}rem`;
            
            titleSize.addEventListener('input', function() {
                projectData.titleSize = parseFloat(this.value);
                if (titleSizeDisplay) titleSizeDisplay.textContent = `${this.value}rem`;
                self.updateStyles();
            });
        }
        
        // Subtitle size slider
        const subtitleSize = document.getElementById('project-subtitle-size');
        const subtitleSizeDisplay = document.getElementById('project-subtitle-size-display');
        if (subtitleSize) {
            subtitleSize.value = projectData.subtitleSize || 1.1;
            if (subtitleSizeDisplay) subtitleSizeDisplay.textContent = `${projectData.subtitleSize || 1.1}rem`;
            
            subtitleSize.addEventListener('input', function() {
                projectData.subtitleSize = parseFloat(this.value);
                if (subtitleSizeDisplay) subtitleSizeDisplay.textContent = `${this.value}rem`;
                self.updateStyles();
            });
        }
        
        // Logo size slider
        const logoSize = document.getElementById('project-logo-size');
        const logoSizeDisplay = document.getElementById('project-logo-size-display');
        if (logoSize) {
            logoSize.value = projectData.logoSize || 120;
            if (logoSizeDisplay) logoSizeDisplay.textContent = `${projectData.logoSize || 120}px`;
            
            logoSize.addEventListener('input', function() {
                projectData.logoSize = parseInt(this.value);
                if (logoSizeDisplay) logoSizeDisplay.textContent = `${this.value}px`;
                self.updateStyles();
            });
        }
        
        // Tech icon size slider
        const techSize = document.getElementById('project-tech-size');
        const techSizeDisplay = document.getElementById('project-tech-size-display');
        if (techSize) {
            techSize.value = projectData.techIconSize || 40;
            if (techSizeDisplay) techSizeDisplay.textContent = `${projectData.techIconSize || 40}px`;
            
            techSize.addEventListener('input', function() {
                projectData.techIconSize = parseInt(this.value);
                if (techSizeDisplay) techSizeDisplay.textContent = `${this.value}px`;
                self.updateStyles();
            });
        }
        
        // Tech grid gap slider
        const techGap = document.getElementById('project-tech-gap');
        const techGapDisplay = document.getElementById('project-tech-gap-display');
        if (techGap) {
            techGap.value = projectData.techGap || 0.5;
            if (techGapDisplay) techGapDisplay.textContent = `${projectData.techGap || 0.5}rem`;
            
            techGap.addEventListener('input', function() {
                projectData.techGap = parseFloat(this.value);
                if (techGapDisplay) techGapDisplay.textContent = `${this.value}rem`;
                self.updateStyles();
            });
        }
        
        // Tech alignment select
        const techAlign = document.getElementById('project-tech-align');
        if (techAlign) {
            techAlign.value = projectData.techAlign || 'flex-start';
            
            techAlign.addEventListener('change', function() {
                projectData.techAlign = this.value;
                self.updateStyles();
            });
        }
        
        // Tech max columns slider
        const techCols = document.getElementById('project-tech-cols');
        const techColsDisplay = document.getElementById('project-tech-cols-display');
        if (techCols) {
            techCols.value = projectData.techMaxCols || 0;
            if (techColsDisplay) techColsDisplay.textContent = projectData.techMaxCols ? `${projectData.techMaxCols}` : 'Auto';
            
            techCols.addEventListener('input', function() {
                projectData.techMaxCols = parseInt(this.value);
                if (techColsDisplay) techColsDisplay.textContent = this.value === '0' ? 'Auto' : this.value;
                self.updateStyles();
            });
        }
        
        // Status badge size slider
        const statusSize = document.getElementById('project-status-size');
        const statusSizeDisplay = document.getElementById('project-status-size-display');
        if (statusSize) {
            statusSize.value = projectData.statusSize || 0.85;
            if (statusSizeDisplay) statusSizeDisplay.textContent = `${projectData.statusSize || 0.85}rem`;
            
            statusSize.addEventListener('input', function() {
                projectData.statusSize = parseFloat(this.value);
                if (statusSizeDisplay) statusSizeDisplay.textContent = `${this.value}rem`;
                self.updateStyles();
            });
        }
        
        // Content padding slider
        const padding = document.getElementById('project-padding');
        const paddingDisplay = document.getElementById('project-padding-display');
        if (padding) {
            padding.value = projectData.contentPadding || 2;
            if (paddingDisplay) paddingDisplay.textContent = `${projectData.contentPadding || 2}rem`;
            
            padding.addEventListener('input', function() {
                projectData.contentPadding = parseFloat(this.value);
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
        const projectData = state.templates['project-showcase'] || {};
        
        const titleSize = document.getElementById('project-title-size');
        const titleSizeDisplay = document.getElementById('project-title-size-display');
        const subtitleSize = document.getElementById('project-subtitle-size');
        const subtitleSizeDisplay = document.getElementById('project-subtitle-size-display');
        const logoSize = document.getElementById('project-logo-size');
        const logoSizeDisplay = document.getElementById('project-logo-size-display');
        const techSize = document.getElementById('project-tech-size');
        const techSizeDisplay = document.getElementById('project-tech-size-display');
        const statusSize = document.getElementById('project-status-size');
        const statusSizeDisplay = document.getElementById('project-status-size-display');
        const padding = document.getElementById('project-padding');
        const paddingDisplay = document.getElementById('project-padding-display');
        
        if (titleSize) titleSize.value = projectData.titleSize || 2.5;
        if (titleSizeDisplay) titleSizeDisplay.textContent = `${projectData.titleSize || 2.5}rem`;
        if (subtitleSize) subtitleSize.value = projectData.subtitleSize || 1.1;
        if (subtitleSizeDisplay) subtitleSizeDisplay.textContent = `${projectData.subtitleSize || 1.1}rem`;
        if (logoSize) logoSize.value = projectData.logoSize || 120;
        if (logoSizeDisplay) logoSizeDisplay.textContent = `${projectData.logoSize || 120}px`;
        if (techSize) techSize.value = projectData.techIconSize || 40;
        if (techSizeDisplay) techSizeDisplay.textContent = `${projectData.techIconSize || 40}px`;
        
        // Grid controls sync
        const techGap = document.getElementById('project-tech-gap');
        const techGapDisplay = document.getElementById('project-tech-gap-display');
        const techAlign = document.getElementById('project-tech-align');
        const techCols = document.getElementById('project-tech-cols');
        const techColsDisplay = document.getElementById('project-tech-cols-display');
        
        if (techGap) techGap.value = projectData.techGap || 0.5;
        if (techGapDisplay) techGapDisplay.textContent = `${projectData.techGap || 0.5}rem`;
        if (techAlign) techAlign.value = projectData.techAlign || 'flex-start';
        if (techCols) techCols.value = projectData.techMaxCols || 0;
        if (techColsDisplay) techColsDisplay.textContent = projectData.techMaxCols ? `${projectData.techMaxCols}` : 'Auto';
        
        if (statusSize) statusSize.value = projectData.statusSize || 0.85;
        if (statusSizeDisplay) statusSizeDisplay.textContent = `${projectData.statusSize || 0.85}rem`;
        if (padding) padding.value = projectData.contentPadding || 2;
        if (paddingDisplay) paddingDisplay.textContent = `${projectData.contentPadding || 2}rem`;
    },
    
    // Update project showcase styles via CSS custom properties
    updateStyles: function(skipSave) {
        const state = window.BrandingEditor.state;
        const projectData = state.templates['project-showcase'] || {};
        const template = document.getElementById('template-project-showcase');
        
        if (!template) return;
        
        // Apply CSS custom properties to the template element
        template.style.setProperty('--project-title-size', `${projectData.titleSize || 2.5}rem`);
        template.style.setProperty('--project-subtitle-size', `${projectData.subtitleSize || 1.1}rem`);
        template.style.setProperty('--project-logo-size', `${projectData.logoSize || 120}px`);
        template.style.setProperty('--project-tech-size', `${projectData.techIconSize || 40}px`);
        template.style.setProperty('--project-tech-gap', `${projectData.techGap || 0.5}rem`);
        template.style.setProperty('--project-tech-align', projectData.techAlign || 'flex-start');
        template.style.setProperty('--project-status-size', `${projectData.statusSize || 0.85}rem`);
        template.style.setProperty('--project-padding', `${projectData.contentPadding || 2}rem`);
        
        // Apply grid layout when max columns is set
        const techStack = template.querySelector('.project-techs');
        if (techStack) {
            const maxCols = projectData.techMaxCols || 0;
            if (maxCols > 0) {
                techStack.style.display = 'grid';
                techStack.style.gridTemplateColumns = `repeat(${maxCols}, min-content)`;
                techStack.style.justifyContent = projectData.techAlign || 'flex-start';
            } else {
                techStack.style.display = 'flex';
                techStack.style.gridTemplateColumns = '';
            }
        }
        
        if (!skipSave) window.BrandingEditor.saveState();
    }
};
