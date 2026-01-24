// ============================================================================
// BRANDING - SKILL HIGHLIGHT CONTROLS MODULE
// ============================================================================
// Skill highlight template-specific size and style controls

window.BrandingEditor = window.BrandingEditor || {};
window.BrandingEditor.controlsSkillHighlight = {
    
    // Initialize skill highlight size controls
    init: function() {
        const state = window.BrandingEditor.state;
        const self = this;
        
        // Ensure skill-highlight template data exists
        if (!state.templates['skill-highlight']) {
            state.templates['skill-highlight'] = {};
        }
        const skillData = state.templates['skill-highlight'];
        
        // Title size slider
        const titleSize = document.getElementById('skill-title-size');
        const titleSizeDisplay = document.getElementById('skill-title-size-display');
        if (titleSize) {
            titleSize.value = skillData.titleSizeValue || 2;
            if (titleSizeDisplay) titleSizeDisplay.textContent = `${skillData.titleSizeValue || 2}rem`;
            
            titleSize.addEventListener('input', function() {
                skillData.titleSizeValue = parseFloat(this.value);
                if (titleSizeDisplay) titleSizeDisplay.textContent = `${this.value}rem`;
                self.updateStyles();
            });
        }
        
        // Subtitle size slider
        const subtitleSize = document.getElementById('skill-subtitle-size');
        const subtitleSizeDisplay = document.getElementById('skill-subtitle-size-display');
        if (subtitleSize) {
            subtitleSize.value = skillData.subtitleSize || 1.1;
            if (subtitleSizeDisplay) subtitleSizeDisplay.textContent = `${skillData.subtitleSize || 1.1}rem`;
            
            subtitleSize.addEventListener('input', function() {
                skillData.subtitleSize = parseFloat(this.value);
                if (subtitleSizeDisplay) subtitleSizeDisplay.textContent = `${this.value}rem`;
                self.updateStyles();
            });
        }
        
        // Skill icon size slider
        const iconSize = document.getElementById('skill-icon-size');
        const iconSizeDisplay = document.getElementById('skill-icon-size-display');
        if (iconSize) {
            iconSize.value = skillData.iconSize || 80;
            if (iconSizeDisplay) iconSizeDisplay.textContent = `${skillData.iconSize || 80}px`;
            
            iconSize.addEventListener('input', function() {
                skillData.iconSize = parseInt(this.value);
                if (iconSizeDisplay) iconSizeDisplay.textContent = `${this.value}px`;
                self.updateStyles();
            });
        }
        
        // Author avatar size slider
        const avatarSize = document.getElementById('skill-avatar-size');
        const avatarSizeDisplay = document.getElementById('skill-avatar-size-display');
        if (avatarSize) {
            avatarSize.value = skillData.avatarSize || 50;
            if (avatarSizeDisplay) avatarSizeDisplay.textContent = `${skillData.avatarSize || 50}px`;
            
            avatarSize.addEventListener('input', function() {
                skillData.avatarSize = parseInt(this.value);
                if (avatarSizeDisplay) avatarSizeDisplay.textContent = `${this.value}px`;
                self.updateStyles();
            });
        }
        
        // Icon grid gap slider
        const gridGap = document.getElementById('skill-grid-gap');
        const gridGapDisplay = document.getElementById('skill-grid-gap-display');
        if (gridGap) {
            gridGap.value = skillData.gridGap || 1.5;
            if (gridGapDisplay) gridGapDisplay.textContent = `${skillData.gridGap || 1.5}rem`;
            
            gridGap.addEventListener('input', function() {
                skillData.gridGap = parseFloat(this.value);
                if (gridGapDisplay) gridGapDisplay.textContent = `${this.value}rem`;
                self.updateStyles();
            });
        }
        
        // Grid alignment select
        const gridAlign = document.getElementById('skill-grid-align');
        if (gridAlign) {
            gridAlign.value = skillData.gridAlign || 'center';
            
            gridAlign.addEventListener('change', function() {
                skillData.gridAlign = this.value;
                self.updateStyles();
            });
        }
        
        // Grid max columns slider
        const gridCols = document.getElementById('skill-grid-cols');
        const gridColsDisplay = document.getElementById('skill-grid-cols-display');
        if (gridCols) {
            gridCols.value = skillData.gridMaxCols || 0;
            if (gridColsDisplay) gridColsDisplay.textContent = skillData.gridMaxCols ? `${skillData.gridMaxCols}` : 'Auto';
            
            gridCols.addEventListener('input', function() {
                skillData.gridMaxCols = parseInt(this.value);
                if (gridColsDisplay) gridColsDisplay.textContent = this.value === '0' ? 'Auto' : this.value;
                self.updateStyles();
            });
        }
        
        // Content padding slider
        const padding = document.getElementById('skill-padding');
        const paddingDisplay = document.getElementById('skill-padding-display');
        if (padding) {
            padding.value = skillData.contentPadding || 2;
            if (paddingDisplay) paddingDisplay.textContent = `${skillData.contentPadding || 2}rem`;
            
            padding.addEventListener('input', function() {
                skillData.contentPadding = parseFloat(this.value);
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
        const skillData = state.templates['skill-highlight'] || {};
        
        const titleSize = document.getElementById('skill-title-size');
        const titleSizeDisplay = document.getElementById('skill-title-size-display');
        const subtitleSize = document.getElementById('skill-subtitle-size');
        const subtitleSizeDisplay = document.getElementById('skill-subtitle-size-display');
        const iconSize = document.getElementById('skill-icon-size');
        const iconSizeDisplay = document.getElementById('skill-icon-size-display');
        const avatarSize = document.getElementById('skill-avatar-size');
        const avatarSizeDisplay = document.getElementById('skill-avatar-size-display');
        const gridGap = document.getElementById('skill-grid-gap');
        const gridGapDisplay = document.getElementById('skill-grid-gap-display');
        const padding = document.getElementById('skill-padding');
        const paddingDisplay = document.getElementById('skill-padding-display');
        
        if (titleSize) titleSize.value = skillData.titleSizeValue || 2;
        if (titleSizeDisplay) titleSizeDisplay.textContent = `${skillData.titleSizeValue || 2}rem`;
        if (subtitleSize) subtitleSize.value = skillData.subtitleSize || 1.1;
        if (subtitleSizeDisplay) subtitleSizeDisplay.textContent = `${skillData.subtitleSize || 1.1}rem`;
        if (iconSize) iconSize.value = skillData.iconSize || 80;
        if (iconSizeDisplay) iconSizeDisplay.textContent = `${skillData.iconSize || 80}px`;
        if (avatarSize) avatarSize.value = skillData.avatarSize || 50;
        if (avatarSizeDisplay) avatarSizeDisplay.textContent = `${skillData.avatarSize || 50}px`;
        if (gridGap) gridGap.value = skillData.gridGap || 1.5;
        if (gridGapDisplay) gridGapDisplay.textContent = `${skillData.gridGap || 1.5}rem`;
        
        // Grid controls sync
        const gridAlign = document.getElementById('skill-grid-align');
        const gridCols = document.getElementById('skill-grid-cols');
        const gridColsDisplay = document.getElementById('skill-grid-cols-display');
        
        if (gridAlign) gridAlign.value = skillData.gridAlign || 'center';
        if (gridCols) gridCols.value = skillData.gridMaxCols || 0;
        if (gridColsDisplay) gridColsDisplay.textContent = skillData.gridMaxCols ? `${skillData.gridMaxCols}` : 'Auto';
        
        if (padding) padding.value = skillData.contentPadding || 2;
        if (paddingDisplay) paddingDisplay.textContent = `${skillData.contentPadding || 2}rem`;
    },
    
    // Update skill highlight styles via CSS custom properties
    updateStyles: function(skipSave) {
        const state = window.BrandingEditor.state;
        const skillData = state.templates['skill-highlight'] || {};
        const template = document.getElementById('template-skill-highlight');
        
        if (!template) return;
        
        // Apply CSS custom properties to the template element
        template.style.setProperty('--skill-title-size', `${skillData.titleSizeValue || 2}rem`);
        template.style.setProperty('--skill-subtitle-size', `${skillData.subtitleSize || 1.1}rem`);
        template.style.setProperty('--skill-icon-size', `${skillData.iconSize || 80}px`);
        template.style.setProperty('--skill-avatar-size', `${skillData.avatarSize || 50}px`);
        template.style.setProperty('--skill-grid-gap', `${skillData.gridGap || 1.5}rem`);
        template.style.setProperty('--skill-grid-align', skillData.gridAlign || 'center');
        template.style.setProperty('--skill-padding', `${skillData.contentPadding || 2}rem`);
        
        // Apply grid layout when max columns is set
        const grid = template.querySelector('.skill-icons-grid');
        if (grid) {
            const maxCols = skillData.gridMaxCols || 0;
            if (maxCols > 0) {
                grid.style.display = 'grid';
                grid.style.gridTemplateColumns = `repeat(${maxCols}, min-content)`;
                grid.style.justifyContent = skillData.gridAlign || 'center';
            } else {
                grid.style.display = 'flex';
                grid.style.gridTemplateColumns = '';
            }
        }
        
        if (!skipSave) window.BrandingEditor.saveState();
    }
};
