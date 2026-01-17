// ============================================================================
// BRANDING PREVIEW PAGE - Main Entry Point
// ============================================================================
// Interactive branding thumbnail editor
//
// Module Structure:
// - state.js        : Centralized state management
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
        
        // Apply initial state
        window.BrandingEditor.preview.update();
        window.BrandingEditor.templates.updateContent();
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
