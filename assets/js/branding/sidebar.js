// ============================================================================
// BRANDING - SIDEBAR MODULE
// ============================================================================
// Sidebar toggle functionality

window.BrandingEditor = window.BrandingEditor || {};

window.BrandingEditor.sidebar = {
    init: function() {
        const elements = window.BrandingEditor.elements;
        const state = window.BrandingEditor.state;
        
        if (elements.toggleSidebarBtn) {
            elements.toggleSidebarBtn.addEventListener('click', this.toggle.bind(this));
        }
        if (elements.showSidebarBtn) {
            elements.showSidebarBtn.addEventListener('click', this.show.bind(this));
        }
    },
    
    toggle: function() {
        const elements = window.BrandingEditor.elements;
        const state = window.BrandingEditor.state;
        
        state.sidebarCollapsed = !state.sidebarCollapsed;
        if (elements.sidebar) {
            elements.sidebar.classList.toggle('collapsed', state.sidebarCollapsed);
        }
        if (elements.showSidebarBtn) {
            elements.showSidebarBtn.classList.toggle('hidden', !state.sidebarCollapsed);
        }
    },
    
    show: function() {
        const elements = window.BrandingEditor.elements;
        const state = window.BrandingEditor.state;
        
        state.sidebarCollapsed = false;
        if (elements.sidebar) {
            elements.sidebar.classList.remove('collapsed');
        }
        if (elements.showSidebarBtn) {
            elements.showSidebarBtn.classList.add('hidden');
        }
    }
};
