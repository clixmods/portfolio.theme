# Branding Editor - JavaScript Modules

Interactive branding thumbnail editor with modular architecture.

## Module Structure

| File | Description |
|------|-------------|
| `state.js` | Centralized state management with localStorage persistence |
| `utils.js` | Helper functions, DOM caching, notifications |
| `sidebar.js` | Sidebar toggle functionality |
| `preview.js` | Preview canvas updates |
| `templates.js` | Template switching and content rendering |
| `editor.js` | Text editor and project selector |
| `technologies.js` | Technology selection and reordering |
| `controls.js` | Main controls entry point, gradient, accent, visibility |
| `controls-effects.js` | Grain, Waves, Particles effect controls |
| `controls-linkedin.js` | LinkedIn template-specific size controls |
| `controls-service-card.js` | Service card template-specific size controls |
| `controls-portfolio-card.js` | Portfolio card template-specific size controls |
| `controls-skill-highlight.js` | Skill highlight template-specific size controls |
| `controls-project-showcase.js` | Project showcase template-specific size controls |
| `controls-resolution.js` | Resolution presets, custom size, zoom |
| `export.js` | PNG export and clipboard copy |
| `branding.js` | Main entry point, initialization |

## Architecture

Uses a namespaced module pattern with `window.BrandingEditor`:

```javascript
window.BrandingEditor = {
    state: { ... },           // Application state
    elements: { ... },        // Cached DOM elements
    utils: { ... },           // Helper functions
    sidebar: { ... },         // Sidebar module
    preview: { ... },         // Preview module
    templates: { ... },       // Templates module
    editor: { ... },          // Editor module
    technologies: { ... },    // Technologies module
    controls: { ... },        // Main controls (orchestrator)
    controlsEffects: { ... }, // Grain, Waves, Particles
    controlsLinkedin: { ... },// LinkedIn-specific controls
    controlsServiceCard: { ... }, // Service card-specific controls
    controlsPortfolioCard: { ... }, // Portfolio card-specific controls
    controlsSkillHighlight: { ... }, // Skill highlight-specific controls
    controlsProjectShowcase: { ... }, // Project showcase-specific controls
    controlsResolution: { ... }, // Resolution and zoom
    export: { ... }           // Export module
};
```

## Load Order

Scripts must be loaded in this order (handled by Hugo template):

1. `state.js` - State initialization
2. `utils.js` - Utilities and DOM caching
3. `sidebar.js` - Sidebar functionality
4. `preview.js` - Preview updates
5. `templates.js` - Template management
6. `editor.js` - Text and project editing
7. `technologies.js` - Tech selection
8. `controls-effects.js` - Effect controls (before main controls)
9. `controls-linkedin.js` - LinkedIn controls (before main controls)
10. `controls-service-card.js` - Service card controls (before main controls)
11. `controls-portfolio-card.js` - Portfolio card controls (before main controls)
12. `controls-skill-highlight.js` - Skill highlight controls (before main controls)
13. `controls-project-showcase.js` - Project showcase controls (before main controls)
14. `controls-resolution.js` - Resolution controls (before main controls)
15. `controls.js` - Main controls orchestrator
16. `export.js` - Export functionality
17. `branding.js` - Main initialization

## Data Flow

1. User interactions trigger module functions
2. State is updated in `window.BrandingEditor.state`
3. `templates.updateContent()` re-renders the preview
4. `preview.update()` adjusts canvas size/zoom
