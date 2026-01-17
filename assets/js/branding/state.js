// ============================================================================
// BRANDING - STATE MODULE
// ============================================================================
// Centralized state management for the branding editor

window.BrandingEditor = window.BrandingEditor || {};

window.BrandingEditor.state = {
    width: 1280,
    height: 720,
    zoom: 0.75,
    currentTemplate: 'service-card',
    selectedTechnologies: [],
    sidebarCollapsed: false,
    style: {
        showGradient: true,
        gradientStart: '#1a1a2e',
        gradientEnd: '#0f3460',
        gradientAngle: 135,
        accentColor: '#00d4ff',
        showAuthor: true,
        showDecoration: true
    },
    // Template-specific content
    templates: {
        'service-card': {
            badge: 'Unity Expert',
            title: 'Bug Fixes & Debugging',
            subtitle: 'Professional Unity & C# Code Repair',
            features: ['Console Errors', 'Performance Issues', 'All Platforms'],
            authorTitle: 'Commercial Game Developer',
            codeBlock: 'void FixBug() {\n  Debug.Log("Fixed!");\n}'
        },
        'project-showcase': {
            showLogoTitle: true
        },
        'portfolio-card': {
            title: 'Unity & C# Game Developer',
            highlights: ['Terra Memoria - Commercial Release', '870K+ Downloads', 'Nintendo Switch Porting']
        },
        'skill-highlight': {
            title: 'Specialise en',
            subtitle: 'Developpement de jeux video professionnels',
            authorTitle: 'Game Developer'
        },
        'linkedin-header': {
            title: 'Unity & C# Game Developer',
            highlights: ['Commercial Game Releases', 'Console Porting Expert', '870K+ Downloads']
        }
    },
    // Store current project data
    currentProject: null
};

// DOM elements cache - will be populated on init
window.BrandingEditor.elements = {};
