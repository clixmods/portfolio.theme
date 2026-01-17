// ============================================================================
// BRANDING - EXPORT MODULE
// ============================================================================
// PNG export and clipboard functionality
// Uses html-to-image for high-quality rendering with better SVG support
// Fallback to manual Canvas API if needed

window.BrandingEditor = window.BrandingEditor || {};

window.BrandingEditor.export = {
    isExporting: false,
    imageCache: new Map(), // Cache for converted images
    libraryLoaded: false,
    
    init: function() {
        const exportPngBtn = document.getElementById('export-png');
        const copyClipboardBtn = document.getElementById('copy-clipboard');

        if (exportPngBtn) {
            exportPngBtn.addEventListener('click', this.exportAsPng.bind(this));
        }

        if (copyClipboardBtn) {
            copyClipboardBtn.addEventListener('click', this.copyToClipboard.bind(this));
        }
        
        // Preload library
        this.loadHtmlToImage().catch(() => {});
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
            transformOrigin: elements.previewCanvas.style.transformOrigin,
            position: elements.previewCanvas.style.position,
            top: elements.previewCanvas.style.top,
            left: elements.previewCanvas.style.left
        };
        
        // Reset to actual size for capture
        elements.previewCanvas.style.transform = 'none';
        elements.previewCanvas.style.margin = '0';
        elements.previewCanvas.style.transformOrigin = 'top left';
        elements.previewCanvas.style.position = 'relative';
        
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
        elements.previewCanvas.style.position = originalStyles.position;
        elements.previewCanvas.style.top = originalStyles.top;
        elements.previewCanvas.style.left = originalStyles.left;
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
                reader.onerror = () => resolve(url);
                reader.readAsDataURL(blob);
            });
        } catch (e) {
            console.warn('Could not convert image to base64:', url, e);
            return url;
        }
    },
    
    /**
     * Pre-convert all images in the preview to base64
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
        
        const results = await Promise.all(conversions.map(c => c.promise));
        
        conversions.forEach((conv, i) => {
            conv.element.src = results[i];
        });
        
        return conversions;
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
     */
    generateGrainCanvas: function(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const noise1 = Math.random();
                const noise2 = Math.random() * 0.5;
                const combined = (noise1 + noise2) / 1.5;
                const value = Math.floor(combined * 255);
                
                data[i] = value;
                data[i + 1] = value;
                data[i + 2] = value;
                data[i + 3] = 255;
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
        return canvas;
    },
    
    /**
     * Load html-to-image library dynamically
     */
    async loadHtmlToImage() {
        if (this.libraryLoaded && window.htmlToImage) {
            return;
        }
        
        return new Promise((resolve, reject) => {
            if (window.htmlToImage) {
                this.libraryLoaded = true;
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/html-to-image@1.11.11/dist/html-to-image.js';
            script.onload = () => {
                this.libraryLoaded = true;
                resolve();
            };
            script.onerror = () => reject(new Error('Failed to load html-to-image'));
            document.head.appendChild(script);
        });
    },
    
    /**
     * Capture particles canvas content as image
     */
    captureParticlesCanvas: function() {
        const particlesCanvas = document.getElementById('branding-particles-canvas');
        if (!particlesCanvas || particlesCanvas.width === 0) {
            return null;
        }
        
        try {
            return particlesCanvas.toDataURL('image/png');
        } catch (e) {
            console.warn('Could not capture particles canvas:', e);
            return null;
        }
    },
    
    /**
     * Generate the final image using html-to-image with manual composition
     */
    generateCanvas: async function() {
        const state = window.BrandingEditor.state;
        const elements = window.BrandingEditor.elements;
        
        await this.loadHtmlToImage();
        
        if (!window.htmlToImage) {
            throw new Error('html-to-image not loaded');
        }
        
        // Pre-convert all images to base64
        const imageConversions = await this.preloadImages();
        
        // Capture particles before modifying DOM
        const particlesDataUrl = this.captureParticlesCanvas();
        
        // Prepare for export (remove scale transform)
        const originalStyles = this.prepareForExport();
        
        // Hide grain overlay temporarily (will composite manually)
        const grainOverlay = document.getElementById('template-grain');
        const grainWasVisible = grainOverlay && !grainOverlay.classList.contains('hidden');
        const grainOpacity = grainOverlay ? window.getComputedStyle(grainOverlay).opacity : '0.15';
        if (grainOverlay) {
            grainOverlay.style.visibility = 'hidden';
        }
        
        // Wait for DOM reflow
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        
        try {
            // Use html-to-image with high quality settings
            const dataUrl = await window.htmlToImage.toPng(elements.previewCanvas, {
                width: state.width,
                height: state.height,
                pixelRatio: 2,
                backgroundColor: null,
                cacheBust: true,
                skipAutoScale: true,
                style: {
                    transform: 'none',
                    margin: '0',
                    width: state.width + 'px',
                    height: state.height + 'px'
                },
                filter: (node) => {
                    // Skip hidden elements
                    if (node.classList && node.classList.contains('hidden')) {
                        return false;
                    }
                    // Skip grain (will composite manually)
                    if (node.id === 'template-grain') {
                        return false;
                    }
                    return true;
                }
            });
            
            // Now composite with grain and particles manually
            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = state.width * 2;
            finalCanvas.height = state.height * 2;
            const ctx = finalCanvas.getContext('2d');
            
            // Draw base image
            const baseImage = await this.loadImage(dataUrl);
            ctx.drawImage(baseImage, 0, 0);
            
            // Draw particles if visible
            const particlesContainer = document.getElementById('template-particles');
            const particlesVisible = particlesContainer && !particlesContainer.classList.contains('hidden');
            if (particlesVisible && particlesDataUrl) {
                const particlesImage = await this.loadImage(particlesDataUrl);
                ctx.drawImage(particlesImage, 0, 0, finalCanvas.width, finalCanvas.height);
            }
            
            // Composite grain overlay
            if (grainWasVisible) {
                const grainCanvas = this.generateGrainCanvas(finalCanvas.width, finalCanvas.height);
                ctx.globalCompositeOperation = 'overlay';
                ctx.globalAlpha = parseFloat(grainOpacity) || 0.15;
                ctx.drawImage(grainCanvas, 0, 0);
                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = 1;
            }
            
            return finalCanvas;
        } finally {
            // Restore everything
            this.restoreAfterExport(originalStyles);
            this.restoreImages(imageConversions);
            if (grainOverlay) {
                grainOverlay.style.visibility = '';
            }
        }
    },
    
    /**
     * Helper to load image from data URL
     */
    loadImage: function(dataUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = dataUrl;
        });
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
    }
};
