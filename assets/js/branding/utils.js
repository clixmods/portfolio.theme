// ============================================================================
// BRANDING - UTILITIES MODULE
// ============================================================================
// Helper functions and notifications

window.BrandingEditor = window.BrandingEditor || {};

window.BrandingEditor.utils = {
    showNotification: function(message, type = 'info') {
        if (typeof window.NotificationsManager !== 'undefined') {
            window.NotificationsManager.show(message, type);
            return;
        }

        const notification = document.createElement('div');
        notification.className = `branding-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },
    
    // Cache DOM elements - called once on init
    cacheElements: function() {
        const elements = window.BrandingEditor.elements;
        
        elements.previewCanvas = document.getElementById('preview-canvas');
        elements.previewContainer = document.getElementById('preview-container');
        elements.currentSize = document.querySelector('.current-size');
        elements.currentZoom = document.querySelector('.current-zoom');
        elements.sidebar = document.getElementById('editor-sidebar');
        elements.showSidebarBtn = document.getElementById('show-sidebar');
        elements.toggleSidebarBtn = document.getElementById('toggle-sidebar');
        
        // Service Card template elements
        elements.templateBg = document.getElementById('template-bg');
        elements.templateTitle = document.getElementById('template-title');
        elements.templateSubtitle = document.getElementById('template-subtitle');
        elements.templateFeatures = document.getElementById('template-features');
        elements.templateTechStack = document.getElementById('template-tech-stack');
        elements.templateAuthor = document.getElementById('template-author');
        elements.templateDecoration = document.getElementById('template-decoration');
        elements.badgeText = document.getElementById('badge-text');
        elements.badgeIcon = document.getElementById('badge-icon');
        elements.authorTitle = document.getElementById('author-title');
        elements.codeBlockContent = document.getElementById('code-block-content');
        
        // Style inputs
        elements.showGradient = document.getElementById('show-gradient');
        elements.gradientOptions = document.getElementById('gradient-options');
        elements.angleOptions = document.getElementById('angle-options');
        elements.gradientStart = document.getElementById('gradient-start');
        elements.gradientEnd = document.getElementById('gradient-end');
        elements.gradientAngle = document.getElementById('gradient-angle');
        elements.angleDisplay = document.getElementById('angle-display');
        elements.accentColor = document.getElementById('accent-color');
        elements.showAuthor = document.getElementById('show-author');
        elements.showDecoration = document.getElementById('show-decoration');
        
        // Selected techs display
        elements.selectedTechsList = document.getElementById('selected-techs-list');
        elements.clearTechs = document.getElementById('clear-techs');
    }
};
