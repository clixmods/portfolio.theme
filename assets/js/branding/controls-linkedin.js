// ============================================================================
// BRANDING - LINKEDIN CONTROLS MODULE
// ============================================================================
// LinkedIn header template-specific size and style controls

window.BrandingEditor = window.BrandingEditor || {};
window.BrandingEditor.controlsLinkedin = {
    
    // Initialize LinkedIn header size controls
    init: function() {
        const state = window.BrandingEditor.state;
        const self = this;
        
        // Ensure linkedin-header template data exists
        if (!state.templates['linkedin-header']) {
            state.templates['linkedin-header'] = {};
        }
        const linkedinData = state.templates['linkedin-header'];
        
        // Name size slider
        const nameSize = document.getElementById('linkedin-name-size');
        const nameSizeDisplay = document.getElementById('linkedin-name-size-display');
        if (nameSize) {
            nameSize.value = linkedinData.nameSize || 2;
            if (nameSizeDisplay) nameSizeDisplay.textContent = `${linkedinData.nameSize || 2}rem`;
            
            nameSize.addEventListener('input', function() {
                linkedinData.nameSize = parseFloat(this.value);
                if (nameSizeDisplay) nameSizeDisplay.textContent = `${this.value}rem`;
                self.updateStyles();
            });
        }
        
        // Title size slider
        const titleSize = document.getElementById('linkedin-title-size');
        const titleSizeDisplay = document.getElementById('linkedin-title-size-display');
        if (titleSize) {
            titleSize.value = linkedinData.titleSize || 1;
            if (titleSizeDisplay) titleSizeDisplay.textContent = `${linkedinData.titleSize || 1}rem`;
            
            titleSize.addEventListener('input', function() {
                linkedinData.titleSize = parseFloat(this.value);
                if (titleSizeDisplay) titleSizeDisplay.textContent = `${this.value}rem`;
                self.updateStyles();
            });
        }
        
        // Highlight size slider
        const highlightSize = document.getElementById('linkedin-highlight-size');
        const highlightSizeDisplay = document.getElementById('linkedin-highlight-size-display');
        if (highlightSize) {
            highlightSize.value = linkedinData.highlightSize || 0.85;
            if (highlightSizeDisplay) highlightSizeDisplay.textContent = `${linkedinData.highlightSize || 0.85}rem`;
            
            highlightSize.addEventListener('input', function() {
                linkedinData.highlightSize = parseFloat(this.value);
                if (highlightSizeDisplay) highlightSizeDisplay.textContent = `${this.value}rem`;
                self.updateStyles();
            });
        }
        
        // Avatar size slider
        const avatarSize = document.getElementById('linkedin-avatar-size');
        const avatarSizeDisplay = document.getElementById('linkedin-avatar-size-display');
        if (avatarSize) {
            avatarSize.value = linkedinData.avatarSize || 100;
            if (avatarSizeDisplay) avatarSizeDisplay.textContent = `${linkedinData.avatarSize || 100}px`;
            
            avatarSize.addEventListener('input', function() {
                linkedinData.avatarSize = parseInt(this.value);
                if (avatarSizeDisplay) avatarSizeDisplay.textContent = `${this.value}px`;
                self.updateStyles();
            });
        }
        
        // Tech icon size slider
        const techSize = document.getElementById('linkedin-tech-size');
        const techSizeDisplay = document.getElementById('linkedin-tech-size-display');
        if (techSize) {
            techSize.value = linkedinData.techIconSize || 44;
            if (techSizeDisplay) techSizeDisplay.textContent = `${linkedinData.techIconSize || 44}px`;
            
            techSize.addEventListener('input', function() {
                linkedinData.techIconSize = parseInt(this.value);
                if (techSizeDisplay) techSizeDisplay.textContent = `${this.value}px`;
                self.updateStyles();
            });
        }
        
        // Tech grid gap slider
        const techGap = document.getElementById('linkedin-tech-gap');
        const techGapDisplay = document.getElementById('linkedin-tech-gap-display');
        if (techGap) {
            techGap.value = linkedinData.techGap || 0.5;
            if (techGapDisplay) techGapDisplay.textContent = `${linkedinData.techGap || 0.5}rem`;
            
            techGap.addEventListener('input', function() {
                linkedinData.techGap = parseFloat(this.value);
                if (techGapDisplay) techGapDisplay.textContent = `${this.value}rem`;
                self.updateStyles();
            });
        }
        
        // Tech alignment select
        const techAlign = document.getElementById('linkedin-tech-align');
        if (techAlign) {
            techAlign.value = linkedinData.techAlign || 'center';
            
            techAlign.addEventListener('change', function() {
                linkedinData.techAlign = this.value;
                self.updateStyles();
            });
        }
        
        // Tech max columns slider
        const techCols = document.getElementById('linkedin-tech-cols');
        const techColsDisplay = document.getElementById('linkedin-tech-cols-display');
        if (techCols) {
            techCols.value = linkedinData.techMaxCols || 0;
            if (techColsDisplay) techColsDisplay.textContent = linkedinData.techMaxCols ? `${linkedinData.techMaxCols}` : 'Auto';
            
            techCols.addEventListener('input', function() {
                linkedinData.techMaxCols = parseInt(this.value);
                if (techColsDisplay) techColsDisplay.textContent = this.value === '0' ? 'Auto' : this.value;
                self.updateStyles();
            });
        }
        
        // Content padding slider
        const padding = document.getElementById('linkedin-padding');
        const paddingDisplay = document.getElementById('linkedin-padding-display');
        if (padding) {
            padding.value = linkedinData.contentPadding || 2;
            if (paddingDisplay) paddingDisplay.textContent = `${linkedinData.contentPadding || 2}rem`;
            
            padding.addEventListener('input', function() {
                linkedinData.contentPadding = parseFloat(this.value);
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
        const linkedinData = state.templates['linkedin-header'] || {};
        
        const linkedinNameSize = document.getElementById('linkedin-name-size');
        const linkedinNameSizeDisplay = document.getElementById('linkedin-name-size-display');
        const linkedinTitleSize = document.getElementById('linkedin-title-size');
        const linkedinTitleSizeDisplay = document.getElementById('linkedin-title-size-display');
        const linkedinHighlightSize = document.getElementById('linkedin-highlight-size');
        const linkedinHighlightSizeDisplay = document.getElementById('linkedin-highlight-size-display');
        const linkedinAvatarSize = document.getElementById('linkedin-avatar-size');
        const linkedinAvatarSizeDisplay = document.getElementById('linkedin-avatar-size-display');
        const linkedinTechSize = document.getElementById('linkedin-tech-size');
        const linkedinTechSizeDisplay = document.getElementById('linkedin-tech-size-display');
        const linkedinPadding = document.getElementById('linkedin-padding');
        const linkedinPaddingDisplay = document.getElementById('linkedin-padding-display');
        
        if (linkedinNameSize) linkedinNameSize.value = linkedinData.nameSize || 2;
        if (linkedinNameSizeDisplay) linkedinNameSizeDisplay.textContent = `${linkedinData.nameSize || 2}rem`;
        if (linkedinTitleSize) linkedinTitleSize.value = linkedinData.titleSize || 1;
        if (linkedinTitleSizeDisplay) linkedinTitleSizeDisplay.textContent = `${linkedinData.titleSize || 1}rem`;
        if (linkedinHighlightSize) linkedinHighlightSize.value = linkedinData.highlightSize || 0.85;
        if (linkedinHighlightSizeDisplay) linkedinHighlightSizeDisplay.textContent = `${linkedinData.highlightSize || 0.85}rem`;
        if (linkedinAvatarSize) linkedinAvatarSize.value = linkedinData.avatarSize || 100;
        if (linkedinAvatarSizeDisplay) linkedinAvatarSizeDisplay.textContent = `${linkedinData.avatarSize || 100}px`;
        if (linkedinTechSize) linkedinTechSize.value = linkedinData.techIconSize || 44;
        if (linkedinTechSizeDisplay) linkedinTechSizeDisplay.textContent = `${linkedinData.techIconSize || 44}px`;
        
        // Grid controls sync
        const techGap = document.getElementById('linkedin-tech-gap');
        const techGapDisplay = document.getElementById('linkedin-tech-gap-display');
        const techAlign = document.getElementById('linkedin-tech-align');
        const techCols = document.getElementById('linkedin-tech-cols');
        const techColsDisplay = document.getElementById('linkedin-tech-cols-display');
        
        if (techGap) techGap.value = linkedinData.techGap || 0.5;
        if (techGapDisplay) techGapDisplay.textContent = `${linkedinData.techGap || 0.5}rem`;
        if (techAlign) techAlign.value = linkedinData.techAlign || 'center';
        if (techCols) techCols.value = linkedinData.techMaxCols || 0;
        if (techColsDisplay) techColsDisplay.textContent = linkedinData.techMaxCols ? `${linkedinData.techMaxCols}` : 'Auto';
        
        if (linkedinPadding) linkedinPadding.value = linkedinData.contentPadding || 2;
        if (linkedinPaddingDisplay) linkedinPaddingDisplay.textContent = `${linkedinData.contentPadding || 2}rem`;
    },
    
    // Update LinkedIn header styles via CSS custom properties
    updateStyles: function(skipSave) {
        const state = window.BrandingEditor.state;
        const linkedinData = state.templates['linkedin-header'] || {};
        const template = document.getElementById('template-linkedin-header');
        
        if (!template) return;
        
        // Apply CSS custom properties to the template element
        template.style.setProperty('--linkedin-name-size', `${linkedinData.nameSize || 2}rem`);
        template.style.setProperty('--linkedin-title-size', `${linkedinData.titleSize || 1}rem`);
        template.style.setProperty('--linkedin-highlight-size', `${linkedinData.highlightSize || 0.85}rem`);
        template.style.setProperty('--linkedin-avatar-size', `${linkedinData.avatarSize || 100}px`);
        template.style.setProperty('--linkedin-tech-size', `${linkedinData.techIconSize || 44}px`);
        template.style.setProperty('--linkedin-tech-gap', `${linkedinData.techGap || 0.5}rem`);
        template.style.setProperty('--linkedin-tech-align', linkedinData.techAlign || 'center');
        template.style.setProperty('--linkedin-padding', `${linkedinData.contentPadding || 2}rem`);
        
        // Apply grid layout when max columns is set
        const techStack = template.querySelector('.linkedin-header-techs');
        if (techStack) {
            const maxCols = linkedinData.techMaxCols || 0;
            if (maxCols > 0) {
                techStack.style.display = 'grid';
                techStack.style.gridTemplateColumns = `repeat(${maxCols}, min-content)`;
                techStack.style.justifyContent = linkedinData.techAlign || 'center';
            } else {
                techStack.style.display = 'flex';
                techStack.style.gridTemplateColumns = '';
            }
        }
        
        if (!skipSave) window.BrandingEditor.saveState();
    }
};
