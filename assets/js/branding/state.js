// ============================================================================
// BRANDING - STATE MODULE
// ============================================================================
// Centralized state management for the branding editor
// Includes localStorage persistence for user modifications

window.BrandingEditor = window.BrandingEditor || {};

// Storage key for localStorage
const STORAGE_KEY = 'branding-editor-state';

// Default state values
const defaultState = {
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
        showDecoration: true,
        // Grain effect
        showGrain: true,
        grainOpacity: 0.15,
        grainSize: 1,
        // Hero background (animated waves)
        showHero: false,
        heroWaveHeight: 120,
        heroWaveSpeed: 8,
        heroOpacity: 0.3
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

// Deep merge helper function - recursively merges source into target
function deepMerge(target, source) {
    const output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                } else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            } else {
                // For arrays and primitives, use source value directly
                output[key] = source[key];
            }
        });
    }
    return output;
}

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

// Load state from localStorage, merged with defaults
function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Deep merge: defaults as base, saved values override
            const merged = deepMerge(defaultState, parsed);
            console.log('[BrandingEditor] Loaded state from localStorage:', merged);
            return merged;
        }
    } catch (e) {
        console.warn('Failed to load branding editor state:', e);
    }
    console.log('[BrandingEditor] Using default state');
    return JSON.parse(JSON.stringify(defaultState));
}

// Initialize state from localStorage or defaults
window.BrandingEditor.state = loadState();

// Save state to localStorage
window.BrandingEditor.saveState = function() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(window.BrandingEditor.state));
    } catch (e) {
        console.warn('Failed to save branding editor state:', e);
    }
};

// Reset state to defaults
window.BrandingEditor.resetState = function() {
    window.BrandingEditor.state = JSON.parse(JSON.stringify(defaultState));
    localStorage.removeItem(STORAGE_KEY);
    // Reload page to apply reset
    location.reload();
};

// DOM elements cache - will be populated on init
window.BrandingEditor.elements = {};
