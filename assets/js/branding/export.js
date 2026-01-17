// ============================================================================
// BRANDING - EXPORT MODULE
// ============================================================================
// PNG export and clipboard functionality

window.BrandingEditor = window.BrandingEditor || {};

window.BrandingEditor.export = {
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
    
    async exportAsPng() {
        const state = window.BrandingEditor.state;
        const elements = window.BrandingEditor.elements;
        const utils = window.BrandingEditor.utils;
        
        try {
            if (typeof html2canvas === 'undefined') {
                utils.showNotification('Pour exporter en PNG, faites une capture d\'ecran de la preview', 'info');
                
                // Alternative: Open preview in new window at full size
                const template = document.querySelector('.branding-template:not(.hidden)');
                if (template) {
                    const newWindow = window.open('', '_blank');
                    if (newWindow) {
                        newWindow.document.write(`
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <title>Branding Export - ${state.width}x${state.height}</title>
                                <style>
                                    * { margin: 0; padding: 0; box-sizing: border-box; }
                                    body { background: #000; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                                    .export-container { width: ${state.width}px; height: ${state.height}px; position: relative; overflow: hidden; }
                                </style>
                                <link rel="stylesheet" href="${document.querySelector('link[href*="branding"]')?.href || ''}">
                            </head>
                            <body>
                                <div class="export-container">
                                    ${template.outerHTML.replace('hidden', '')}
                                </div>
                                <script>
                                    document.querySelector('.branding-template')?.classList.remove('hidden');
                                </script>
                            </body>
                            </html>
                        `);
                    }
                }
                return;
            }

            const canvas = await html2canvas(elements.previewCanvas, {
                width: state.width,
                height: state.height,
                scale: 2,
                useCORS: true,
                allowTaint: true
            });

            const link = document.createElement('a');
            link.download = `branding-${state.currentTemplate}-${state.width}x${state.height}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            utils.showNotification('Image exportee avec succes!', 'success');
        } catch (error) {
            console.error('Export error:', error);
            utils.showNotification('Erreur lors de l\'export', 'error');
        }
    },
    
    async copyToClipboard() {
        const state = window.BrandingEditor.state;
        const elements = window.BrandingEditor.elements;
        const utils = window.BrandingEditor.utils;
        
        try {
            if (typeof html2canvas === 'undefined') {
                utils.showNotification('html2canvas requis pour copier dans le presse-papier', 'info');
                return;
            }

            const canvas = await html2canvas(elements.previewCanvas, {
                width: state.width,
                height: state.height,
                scale: 2,
                useCORS: true,
                allowTaint: true
            });

            canvas.toBlob(async (blob) => {
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]);
                    utils.showNotification('Copie dans le presse-papier!', 'success');
                } catch (err) {
                    console.error('Clipboard error:', err);
                    utils.showNotification('Erreur lors de la copie', 'error');
                }
            });
        } catch (error) {
            console.error('Copy error:', error);
            utils.showNotification('Erreur lors de la copie', 'error');
        }
    }
};
