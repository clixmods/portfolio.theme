// ============================================================================
// BRANDING - PREVIEW MODULE
// ============================================================================
// Preview rendering and updates

window.BrandingEditor = window.BrandingEditor || {};

window.BrandingEditor.preview = {
    update: function() {
        const state = window.BrandingEditor.state;
        const elements = window.BrandingEditor.elements;
        
        if (!elements.previewCanvas) return;

        // Calculate scaled dimensions for container sizing
        const scaledWidth = state.width * state.zoom;
        const scaledHeight = state.height * state.zoom;

        // Set canvas size (actual size, not scaled)
        elements.previewCanvas.style.width = `${state.width}px`;
        elements.previewCanvas.style.height = `${state.height}px`;
        elements.previewCanvas.style.transform = `scale(${state.zoom})`;
        
        // Use a wrapper approach: set margin to compensate for scale from center
        // This ensures the canvas stays properly contained
        const marginH = (state.width - scaledWidth) / 2;
        const marginV = (state.height - scaledHeight) / 2;
        elements.previewCanvas.style.margin = `${marginV}px ${marginH}px`;

        if (elements.currentSize) {
            elements.currentSize.textContent = `${state.width} x ${state.height}`;
        }
        if (elements.currentZoom) {
            elements.currentZoom.textContent = `${Math.round(state.zoom * 100)}%`;
        }

        if (elements.previewContainer) {
            elements.previewContainer.style.minHeight = `${scaledHeight + 60}px`;
        }
    }
};
