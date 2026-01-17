// ============================================================================
// BRANDING - EXPORT MODULE
// ============================================================================
// PNG export and clipboard functionality
// Uses html2canvas for high-quality rendering at actual dimensions

window.BrandingEditor = window.BrandingEditor || {};

window.BrandingEditor.export = {
    isExporting: false,
    imageCache: new Map(), // Cache for converted images
    
    init: function() {
        const exportPngBtn = document.getElementById('export-png');
        const copyClipboardBtn = document.getElementById('copy-clipboard');

        if (exportPngBtn) {
            exportPngBtn.addEventListener('click', this.exportAsPng.bind(this));
        }

        if (copyClipboardBtn) {
            copyClipboardBtn.addEventListener('click', this.copyToClipboard.bind(this));
        }
    },
    
    /**
     * Prepare canvas for export by removing scale transform
     * Returns the original transform and margin values for restoration
     */
    prepareForExport: function() {
        const elements = window.BrandingEditor.elements;
        if (!elements.previewCanvas) return null;
        
        // Store original styles
        const originalStyles = {
            transform: elements.previewCanvas.style.transform,
            margin: elements.previewCanvas.style.margin,
            transformOrigin: elements.previewCanvas.style.transformOrigin
        };
        
        // Reset to actual size for capture
        elements.previewCanvas.style.transform = 'none';
        elements.previewCanvas.style.margin = '0';
        elements.previewCanvas.style.transformOrigin = 'top left';
        
        return originalStyles;
    },
    
    /**
     * Restore canvas to its original scaled state
     */
    restoreAfterExport: function(originalStyles) {
        const elements = window.BrandingEditor.elements;
        if (!elements.previewCanvas || !originalStyles) return;
        
        elements.previewCanvas.style.transform = originalStyles.transform;
        elements.previewCanvas.style.margin = originalStyles.margin;
        elements.previewCanvas.style.transformOrigin = originalStyles.transformOrigin;
    },
    
    /**
     * Fetch and convert an image URL to base64 data URL
     */
    imageToBase64: async function(url) {
        // Check cache first
        if (this.imageCache.has(url)) {
            return this.imageCache.get(url);
        }
        
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result;
                    this.imageCache.set(url, base64);
                    resolve(base64);
                };
                reader.onerror = () => resolve(url); // Fallback to original URL
                reader.readAsDataURL(blob);
            });
        } catch (e) {
            console.warn('Could not convert image to base64:', url, e);
            return url; // Fallback to original URL
        }
    },
    
    /**
     * Pre-convert all images in the preview to base64
     * This ensures html2canvas can render them correctly
     */
    preloadImages: async function() {
        const elements = window.BrandingEditor.elements;
        if (!elements.previewCanvas) return [];
        
        const images = elements.previewCanvas.querySelectorAll('img');
        const conversions = [];
        
        for (const img of images) {
            if (img.src && !img.src.startsWith('data:')) {
                conversions.push({
                    element: img,
                    originalSrc: img.src,
                    promise: this.imageToBase64(img.src)
                });
            }
        }
        
        // Convert all images
        const results = await Promise.all(conversions.map(c => c.promise));
        
        // Apply base64 sources
        conversions.forEach((conv, i) => {
            conv.element.src = results[i];
        });
        
        return conversions; // Return for restoration
    },
    
    /**
     * Restore original image sources after export
     */
    restoreImages: function(conversions) {
        conversions.forEach(conv => {
            conv.element.src = conv.originalSrc;
        });
    },
    
    /**
     * Generate a canvas-based grain texture for export
     * (html2canvas doesn't support SVG feTurbulence filters)
     * Creates a subtle film grain effect matching the original SVG filter
     */
    generateGrainCanvas: function(width, height) {
        const canvas = document.createElement('canvas');
        // Use actual dimensions to avoid tiling artifacts
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Create fine noise pattern similar to feTurbulence fractalNoise
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;
        
        // Multi-octave noise for more natural grain
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                // Create varied noise with multiple frequencies
                const noise1 = Math.random();
                const noise2 = Math.random() * 0.5;
                const combined = (noise1 + noise2) / 1.5;
                const value = Math.floor(combined * 255);
                
                data[i] = value;     // R
                data[i + 1] = value; // G
                data[i + 2] = value; // B
                data[i + 3] = 255;   // Full alpha
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL('image/png');
    },
    
    /**
     * Convert SVG to base64 data URL for reliable rendering
     */
    svgToDataUrl: async function(svgElement) {
        return new Promise((resolve) => {
            try {
                const svgData = new XMLSerializer().serializeToString(svgElement);
                const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(svgBlob);
                
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width || 32;
                    canvas.height = img.height || 32;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    URL.revokeObjectURL(url);
                    resolve(canvas.toDataURL('image/png'));
                };
                img.onerror = function() {
                    URL.revokeObjectURL(url);
                    resolve(null);
                };
                img.src = url;
            } catch (e) {
                resolve(null);
            }
        });
    },
    
    /**
     * Generate the canvas using html2canvas
     */
    generateCanvas: async function() {
        const state = window.BrandingEditor.state;
        const elements = window.BrandingEditor.elements;
        const self = this;
        
        if (typeof html2canvas === 'undefined') {
            throw new Error('html2canvas not loaded');
        }
        
        // Pre-convert all images to base64 (fixes CORS issues with SVGs)
        const imageConversions = await this.preloadImages();
        
        // Prepare for export (remove scale transform)
        const originalStyles = this.prepareForExport();
        
        // Pre-generate grain texture (will use DOM opacity)
        const grainDataUrl = this.generateGrainCanvas(state.width, state.height);
        
        // Wait for DOM reflow
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        
        try {
            const canvas = await html2canvas(elements.previewCanvas, {
                width: state.width,
                height: state.height,
                scale: 2, // 2x resolution for crisp output
                useCORS: true,
                allowTaint: true,
                backgroundColor: null, // Preserve transparency if any
                logging: false,
                x: 0,
                y: 0,
                scrollX: 0,
                scrollY: 0,
                windowWidth: state.width,
                windowHeight: state.height,
                // Handle cloned document modifications
                onclone: function(clonedDoc) {
                    const clonedCanvas = clonedDoc.getElementById('preview-canvas');
                    if (clonedCanvas) {
                        // Ensure cloned element has correct dimensions and positioning
                        clonedCanvas.style.width = state.width + 'px';
                        clonedCanvas.style.height = state.height + 'px';
                        clonedCanvas.style.transform = 'none';
                        clonedCanvas.style.margin = '0';
                        clonedCanvas.style.position = 'absolute';
                        clonedCanvas.style.top = '0';
                        clonedCanvas.style.left = '0';
                        clonedCanvas.style.overflow = 'hidden';
                    }
                    
                    // Copy grain settings from original DOM
                    const originalGrain = document.getElementById('template-grain');
                    const clonedGrain = clonedDoc.getElementById('template-grain');
                    if (clonedGrain && originalGrain) {
                        const isHidden = originalGrain.classList.contains('hidden') || 
                                        window.getComputedStyle(originalGrain).display === 'none';
                        if (!isHidden) {
                            // Get computed opacity from original
                            const computedOpacity = window.getComputedStyle(originalGrain).opacity;
                            clonedGrain.style.backgroundImage = `url(${grainDataUrl})`;
                            clonedGrain.style.backgroundSize = 'cover';
                            clonedGrain.style.backgroundRepeat = 'no-repeat';
                            clonedGrain.style.opacity = computedOpacity;
                            clonedGrain.style.mixBlendMode = 'overlay';
                        } else {
                            clonedGrain.style.display = 'none';
                        }
                    }
                    
                    // Copy tech stack icon sizes from original DOM
                    const originalTechIcons = document.querySelectorAll('.template-tech-stack img');
                    const clonedTechIcons = clonedDoc.querySelectorAll('.template-tech-stack img');
                    clonedTechIcons.forEach(function(icon, index) {
                        if (originalTechIcons[index]) {
                            const computed = window.getComputedStyle(originalTechIcons[index]);
                            icon.style.width = computed.width;
                            icon.style.height = computed.height;
                            icon.style.objectFit = 'contain';
                        }
                    });
                    
                    // Copy wave settings from original DOM (not recalculate)
                    const originalWaves = document.getElementById('template-waves');
                    const clonedWaves = clonedDoc.getElementById('template-waves');
                    if (clonedWaves && originalWaves) {
                        const isHidden = originalWaves.classList.contains('hidden');
                        if (!isHidden) {
                            clonedWaves.classList.remove('hidden');
                            // Copy computed styles from original
                            const computedWaves = window.getComputedStyle(originalWaves);
                            clonedWaves.style.opacity = computedWaves.opacity;
                            clonedWaves.style.transform = computedWaves.transform;
                            
                            // Copy wave SVG heights
                            const originalSvgs = originalWaves.querySelectorAll('.wave-svg');
                            const clonedSvgs = clonedWaves.querySelectorAll('.wave-svg');
                            clonedSvgs.forEach(function(svg, index) {
                                if (originalSvgs[index]) {
                                    svg.style.height = window.getComputedStyle(originalSvgs[index]).height;
                                }
                            });
                        } else {
                            clonedWaves.classList.add('hidden');
                        }
                    }
                    
                    // Copy canvas content from particles
                    const originalParticles = document.getElementById('branding-particles-canvas');
                    const clonedParticles = clonedDoc.getElementById('branding-particles-canvas');
                    if (originalParticles && clonedParticles && originalParticles.width > 0) {
                        try {
                            const ctx = clonedParticles.getContext('2d');
                            clonedParticles.width = originalParticles.width;
                            clonedParticles.height = originalParticles.height;
                            ctx.drawImage(originalParticles, 0, 0);
                        } catch (e) {
                            console.warn('Could not copy particles canvas:', e);
                        }
                    }
                }
            });
            
            return canvas;
        } finally {
            // Always restore original styles and images
            this.restoreAfterExport(originalStyles);
            this.restoreImages(imageConversions);
        }
    },
    
    /**
     * Generate filename based on template and dimensions
     */
    generateFilename: function() {
        const state = window.BrandingEditor.state;
        const templateNames = {
            'service-card': 'fiverr-service',
            'project-showcase': 'project',
            'portfolio-card': 'portfolio',
            'skill-highlight': 'skills',
            'linkedin-header': 'linkedin-header'
        };
        const templateName = templateNames[state.currentTemplate] || state.currentTemplate;
        const timestamp = new Date().toISOString().slice(0, 10);
        return `branding-${templateName}-${state.width}x${state.height}-${timestamp}.png`;
    },
    
    async exportAsPng() {
        const utils = window.BrandingEditor.utils;
        
        // Prevent multiple simultaneous exports
        if (this.isExporting) {
            utils.showNotification('Export en cours...', 'info');
            return;
        }
        
        this.isExporting = true;
        const exportBtn = document.getElementById('export-png');
        if (exportBtn) {
            exportBtn.disabled = true;
            exportBtn.classList.add('loading');
        }
        
        try {
            if (typeof html2canvas === 'undefined') {
                utils.showNotification('Chargement de la bibliotheque d\'export...', 'info');
                // Try loading dynamically
                await this.loadHtml2Canvas();
            }

            utils.showNotification('Generation de l\'image...', 'info');
            
            const canvas = await this.generateCanvas();
            
            // Create download link
            const link = document.createElement('a');
            link.download = this.generateFilename();
            link.href = canvas.toDataURL('image/png', 1.0);
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            utils.showNotification('Image exportee avec succes!', 'success');
        } catch (error) {
            console.error('Export error:', error);
            utils.showNotification('Erreur lors de l\'export: ' + error.message, 'error');
        } finally {
            this.isExporting = false;
            if (exportBtn) {
                exportBtn.disabled = false;
                exportBtn.classList.remove('loading');
            }
        }
    },
    
    async copyToClipboard() {
        const utils = window.BrandingEditor.utils;
        
        // Prevent multiple simultaneous operations
        if (this.isExporting) {
            utils.showNotification('Operation en cours...', 'info');
            return;
        }
        
        this.isExporting = true;
        const copyBtn = document.getElementById('copy-clipboard');
        if (copyBtn) {
            copyBtn.disabled = true;
            copyBtn.classList.add('loading');
        }
        
        try {
            if (typeof html2canvas === 'undefined') {
                utils.showNotification('Chargement de la bibliotheque...', 'info');
                await this.loadHtml2Canvas();
            }
            
            // Check clipboard API support
            if (!navigator.clipboard || !navigator.clipboard.write) {
                utils.showNotification('Votre navigateur ne supporte pas la copie d\'images', 'error');
                return;
            }

            utils.showNotification('Generation de l\'image...', 'info');
            
            const canvas = await this.generateCanvas();

            // Convert to blob and copy to clipboard
            const blob = await new Promise((resolve, reject) => {
                canvas.toBlob((b) => {
                    if (b) resolve(b);
                    else reject(new Error('Failed to create blob'));
                }, 'image/png', 1.0);
            });
            
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            
            utils.showNotification('Image copiee dans le presse-papier!', 'success');
        } catch (error) {
            console.error('Copy error:', error);
            
            // Handle specific clipboard errors
            if (error.name === 'NotAllowedError') {
                utils.showNotification('Permission refusee. Cliquez dans la page puis reessayez.', 'error');
            } else {
                utils.showNotification('Erreur lors de la copie: ' + error.message, 'error');
            }
        } finally {
            this.isExporting = false;
            if (copyBtn) {
                copyBtn.disabled = false;
                copyBtn.classList.remove('loading');
            }
        }
    },
    
    /**
     * Dynamically load html2canvas if not available
     */
    async loadHtml2Canvas() {
        return new Promise((resolve, reject) => {
            if (typeof html2canvas !== 'undefined') {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js';
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load html2canvas'));
            document.head.appendChild(script);
        });
    }
};
