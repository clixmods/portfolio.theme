// ============================================================================
// BRANDING PREVIEW PAGE - Main Entry Point
// ============================================================================
// Interactive branding thumbnail editor
//
// Module Structure:
// - state.js        : Centralized state management (with localStorage persistence)
// - utils.js        : Helper functions and notifications
// - sidebar.js      : Sidebar toggle functionality
// - templates.js    : Template switching and content updates
// - editor.js       : Text editor and project selector
// - technologies.js : Technology selection and display
// - controls.js     : Resolution, zoom, and style controls
// - preview.js      : Preview rendering
// - export.js       : PNG export and clipboard
// ============================================================================

(function() {
    'use strict';

    // ========================================================================
    // INITIALIZATION
    // ========================================================================
    function init() {
        // Cache DOM elements
        window.BrandingEditor.utils.cacheElements();
        
        // Initialize all modules
        window.BrandingEditor.sidebar.init();
        window.BrandingEditor.templates.init();
        window.BrandingEditor.editor.init();
        window.BrandingEditor.technologies.init();
        window.BrandingEditor.controls.init();
        window.BrandingEditor.export.init();
        
        // Restore saved state to UI (this also syncs input fields)
        restoreSavedState();
        
        // Apply preview dimensions
        window.BrandingEditor.preview.update();
        
        // IMPORTANT: updateContent MUST be called AFTER restoreSavedState
        // to apply the restored state values to the template DOM
        window.BrandingEditor.templates.updateContent();
    }
    
    // ========================================================================
    // RESTORE SAVED STATE
    // ========================================================================
    function restoreSavedState() {
        const state = window.BrandingEditor.state;
        const templates = window.BrandingEditor.templates;
        const technologies = window.BrandingEditor.technologies;
        
        // Restore current template selection
        if (state.currentTemplate && state.currentTemplate !== 'service-card') {
            const templateCard = document.querySelector(`.template-card[data-template="${state.currentTemplate}"]`);
            if (templateCard) {
                document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
                templateCard.classList.add('active');
                templates.switch(state.currentTemplate);
            }
        }
        
        // Restore template input values
        restoreTemplateInputs();
        
        // Restore selected technologies
        if (state.selectedTechnologies && state.selectedTechnologies.length > 0) {
            state.selectedTechnologies.forEach(tech => {
                const techItem = document.querySelector(`.tech-item[data-key="${tech.key}"]`);
                if (techItem) {
                    techItem.classList.add('selected');
                }
            });
            technologies.updateDisplay();
        }
        
        // Restore resolution inputs
        const widthInput = document.getElementById('custom-width');
        const heightInput = document.getElementById('custom-height');
        if (widthInput) widthInput.value = state.width;
        if (heightInput) heightInput.value = state.height;
        
        // Update preset button active state
        const presetButtons = document.querySelectorAll('.preset-btn');
        presetButtons.forEach(btn => {
            const btnWidth = parseInt(btn.dataset.width);
            const btnHeight = parseInt(btn.dataset.height);
            if (btnWidth === state.width && btnHeight === state.height) {
                presetButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        });
    }
    
    function restoreTemplateInputs() {
        const state = window.BrandingEditor.state;
        
        // Service Card
        const serviceData = state.templates['service-card'];
        setInputValue('edit-badge', serviceData.badge);
        setInputValue('edit-title', serviceData.title);
        setInputValue('edit-subtitle', serviceData.subtitle);
        setInputValue('edit-author-title', serviceData.authorTitle);
        setTextareaValue('edit-features', serviceData.features);
        setTextareaValue('edit-code-block', serviceData.codeBlock, false);
        
        // Portfolio Card
        const portfolioData = state.templates['portfolio-card'];
        setInputValue('portfolio-title-input', portfolioData.title);
        setTextareaValue('portfolio-highlights-input', portfolioData.highlights);
        
        // Skill Highlight
        const skillData = state.templates['skill-highlight'];
        setInputValue('skill-title-input', skillData.title);
        setInputValue('skill-subtitle-input', skillData.subtitle);
        setInputValue('skill-author-title-input', skillData.authorTitle);
        
        // LinkedIn Header
        const linkedinData = state.templates['linkedin-header'];
        setInputValue('linkedin-title-input', linkedinData.title);
        setTextareaValue('linkedin-highlights-input', linkedinData.highlights);
        
        // Project Showcase
        const projectData = state.templates['project-showcase'];
        const showLogoTitle = document.getElementById('show-logo-title');
        if (showLogoTitle) showLogoTitle.checked = projectData.showLogoTitle;
    }
    
    function setInputValue(id, value) {
        const el = document.getElementById(id);
        if (el && value !== undefined) el.value = value;
    }
    
    function setTextareaValue(id, value, isArray = true) {
        const el = document.getElementById(id);
        if (el && value !== undefined) {
            el.value = isArray && Array.isArray(value) ? value.join('\n') : value;
        }
    }

    // ========================================================================
    // INITIALIZE ON DOM READY
    // ========================================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
