# Branding Editor - JavaScript Modules

Interactive branding thumbnail editor with modular architecture.

## Module Structure

| File | Lines | Description |
|------|-------|-------------|
| `state.js` | ~40 | Centralized state management |
| `utils.js` | ~80 | Helper functions, DOM caching, notifications |
| `sidebar.js` | ~50 | Sidebar toggle functionality |
| `preview.js` | ~30 | Preview canvas updates |
| `templates.js` | ~200 | Template switching and content rendering |
| `editor.js` | ~180 | Text editor and project selector |
| `technologies.js` | ~180 | Technology selection and reordering |
| `controls.js` | ~200 | Resolution, zoom, and style controls |
| `export.js` | ~120 | PNG export and clipboard copy |
| `branding.js` | ~50 | Main entry point, initialization |

## Architecture

Uses a namespaced module pattern with `window.BrandingEditor`:

```javascript
window.BrandingEditor = {
    state: { ... },      // Application state
    elements: { ... },   // Cached DOM elements
    utils: { ... },      // Helper functions
    sidebar: { ... },    // Sidebar module
    preview: { ... },    // Preview module
    templates: { ... },  // Templates module
    editor: { ... },     // Editor module
    technologies: { ... }, // Technologies module
    controls: { ... },   // Controls module
    export: { ... }      // Export module
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
8. `controls.js` - UI controls
9. `export.js` - Export functionality
10. `branding.js` - Main initialization

## Data Flow

1. User interactions trigger module functions
2. State is updated in `window.BrandingEditor.state`
3. `templates.updateContent()` re-renders the preview
4. `preview.update()` adjusts canvas size/zoom
