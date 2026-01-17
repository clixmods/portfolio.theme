// ============================================================================
// BRANDING PREVIEW PAGE - JavaScript Controller
// ============================================================================
// Full interactive editor for branding thumbnails
// Handles templates, text editing, technology selection, and export

(function() {
    'use strict';

    // ========================================================================
    // STATE MANAGEMENT
    // ========================================================================
    const state = {
        width: 1280,
        height: 720,
        zoom: 0.75,
        currentTemplate: 'service-card',
        selectedTechnologies: [],
        sidebarCollapsed: false,
        style: {
            gradientStart: '#1a1a2e',
            gradientEnd: '#0f3460',
            gradientAngle: 135,
            accentColor: '#00d4ff',
            showAuthor: true,
            showDecoration: true
        },
        content: {
            badge: 'Unity Expert',
            title: 'Bug Fixes & Debugging',
            subtitle: 'Professional Unity & C# Code Repair',
            features: ['Console Errors', 'Performance Issues', 'All Platforms'],
            authorTitle: 'Commercial Game Developer'
        }
    };

    // ========================================================================
    // DOM ELEMENTS CACHE
    // ========================================================================
    const elements = {};

    // ========================================================================
    // INITIALIZATION
    // ========================================================================
    function init() {
        cacheElements();
        initSidebar();
        initTemplateSelector();
        initTextEditor();
        initProjectSelector();
        initTechnologySelector();
        initStyleOptions();
        initResolutionControls();
        initZoomControls();
        initExportButtons();
        
        // Apply initial state
        updatePreview();
        updateTemplateContent();
    }

    function cacheElements() {
        elements.previewCanvas = document.getElementById('preview-canvas');
        elements.previewContainer = document.getElementById('preview-container');
        elements.currentSize = document.querySelector('.current-size');
        elements.currentZoom = document.querySelector('.current-zoom');
        elements.sidebar = document.getElementById('editor-sidebar');
        elements.showSidebarBtn = document.getElementById('show-sidebar');
        elements.toggleSidebarBtn = document.getElementById('toggle-sidebar');
        
        // Template elements
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
        
        // Editor inputs
        elements.editBadge = document.getElementById('edit-badge');
        elements.editTitle = document.getElementById('edit-title');
        elements.editSubtitle = document.getElementById('edit-subtitle');
        elements.editFeatures = document.getElementById('edit-features');
        elements.editAuthorTitle = document.getElementById('edit-author-title');
        
        // Style inputs
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

    // ========================================================================
    // SIDEBAR TOGGLE
    // ========================================================================
    function initSidebar() {
        if (elements.toggleSidebarBtn) {
            elements.toggleSidebarBtn.addEventListener('click', toggleSidebar);
        }
        if (elements.showSidebarBtn) {
            elements.showSidebarBtn.addEventListener('click', showSidebar);
        }
    }

    function toggleSidebar() {
        state.sidebarCollapsed = !state.sidebarCollapsed;
        if (elements.sidebar) {
            elements.sidebar.classList.toggle('collapsed', state.sidebarCollapsed);
        }
        if (elements.showSidebarBtn) {
            elements.showSidebarBtn.classList.toggle('hidden', !state.sidebarCollapsed);
        }
    }

    function showSidebar() {
        state.sidebarCollapsed = false;
        if (elements.sidebar) {
            elements.sidebar.classList.remove('collapsed');
        }
        if (elements.showSidebarBtn) {
            elements.showSidebarBtn.classList.add('hidden');
        }
    }

    // ========================================================================
    // TEMPLATE SELECTOR
    // ========================================================================
    function initTemplateSelector() {
        const templateCards = document.querySelectorAll('.template-card');
        
        templateCards.forEach(card => {
            card.addEventListener('click', function() {
                templateCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                
                const templateId = this.dataset.template;
                switchTemplate(templateId);
            });
        });
    }

    function switchTemplate(templateId) {
        state.currentTemplate = templateId;

        // Hide all templates
        document.querySelectorAll('.branding-template').forEach(t => {
            t.classList.add('hidden');
        });

        // Show selected template
        const selectedTemplate = document.getElementById(`template-${templateId}`);
        if (selectedTemplate) {
            selectedTemplate.classList.remove('hidden');
        }

        // Show/hide relevant editor sections based on template
        const textEditorSection = document.getElementById('text-editor-section');
        const projectSelectorSection = document.getElementById('project-selector-section');
        
        if (textEditorSection) {
            textEditorSection.style.display = (templateId === 'project-showcase') ? 'none' : 'block';
        }
        if (projectSelectorSection) {
            projectSelectorSection.style.display = (templateId === 'project-showcase') ? 'block' : 'none';
        }

        // Update template-specific content
        updateTemplateContent();
    }

    // ========================================================================
    // TEXT EDITOR
    // ========================================================================
    function initTextEditor() {
        // Badge input
        if (elements.editBadge) {
            elements.editBadge.addEventListener('input', function() {
                state.content.badge = this.value;
                updateTemplateContent();
            });
        }

        // Title input
        if (elements.editTitle) {
            elements.editTitle.addEventListener('input', function() {
                state.content.title = this.value;
                updateTemplateContent();
            });
        }

        // Subtitle input
        if (elements.editSubtitle) {
            elements.editSubtitle.addEventListener('input', function() {
                state.content.subtitle = this.value;
                updateTemplateContent();
            });
        }

        // Features textarea
        if (elements.editFeatures) {
            elements.editFeatures.addEventListener('input', function() {
                state.content.features = this.value.split('\n').filter(f => f.trim());
                updateTemplateContent();
            });
        }

        // Author title input
        if (elements.editAuthorTitle) {
            elements.editAuthorTitle.addEventListener('input', function() {
                state.content.authorTitle = this.value;
                updateTemplateContent();
            });
        }
    }

    // ========================================================================
    // PROJECT SELECTOR
    // ========================================================================
    function initProjectSelector() {
        const projectSearch = document.getElementById('project-search');
        const projectItems = document.querySelectorAll('.project-item');

        // Search filter
        if (projectSearch) {
            projectSearch.addEventListener('input', function() {
                const query = this.value.toLowerCase();
                projectItems.forEach(item => {
                    const name = item.dataset.title?.toLowerCase() || '';
                    item.style.display = name.includes(query) ? 'flex' : 'none';
                });
            });
        }

        // Project selection
        projectItems.forEach(item => {
            item.addEventListener('click', function() {
                projectItems.forEach(i => i.classList.remove('selected'));
                this.classList.add('selected');
                
                selectProject(this.dataset);
            });
        });
    }

    function selectProject(projectData) {
        const projectTitle = document.getElementById('project-title');
        const projectSubtitle = document.getElementById('project-subtitle');
        const projectLogo = document.getElementById('project-logo');
        const projectImageOverlay = document.getElementById('project-image-overlay');
        const projectTechs = document.getElementById('project-techs');
        const projectStatus = document.getElementById('project-status');

        if (projectTitle) {
            projectTitle.textContent = projectData.title || 'Project Title';
        }
        if (projectSubtitle) {
            projectSubtitle.textContent = projectData.subtitle || '';
        }
        if (projectLogo && projectData.logo) {
            projectLogo.src = projectData.logo;
            projectLogo.style.display = 'block';
        }
        if (projectImageOverlay && projectData.image) {
            projectImageOverlay.style.backgroundImage = `url(${projectData.image})`;
        }
        if (projectStatus && projectData.status) {
            const badge = projectStatus.querySelector('.status-badge');
            if (badge) {
                badge.textContent = projectData.status;
            }
        }

        // Build technology stack
        if (projectTechs) {
            projectTechs.innerHTML = '';
            
            const languages = projectData.languages ? projectData.languages.split(',') : [];
            const frameworks = projectData.frameworks ? projectData.frameworks.split(',') : [];
            
            const allTechs = [...languages, ...frameworks];
            
            allTechs.forEach(techKey => {
                if (!techKey) return;
                
                // Find tech in data
                const tech = findTechnology(techKey.trim());
                if (tech && tech.icon) {
                    const img = document.createElement('img');
                    img.src = tech.icon;
                    img.alt = tech.name;
                    img.title = tech.name;
                    projectTechs.appendChild(img);
                }
            });
        }
    }

    function findTechnology(key) {
        if (!window.BRANDING_DATA) return null;
        
        const allTechs = [
            ...window.BRANDING_DATA.technologies.languages,
            ...window.BRANDING_DATA.technologies.frameworks,
            ...window.BRANDING_DATA.technologies.tools
        ];
        
        return allTechs.find(t => t.key === key);
    }

    // ========================================================================
    // TECHNOLOGY SELECTOR
    // ========================================================================
    function initTechnologySelector() {
        // Tab switching
        const techTabs = document.querySelectorAll('.tech-tab');
        techTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                techTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const tabId = this.dataset.tab;
                document.querySelectorAll('.tech-list').forEach(list => {
                    list.classList.add('hidden');
                });
                document.getElementById(`tech-${tabId}`)?.classList.remove('hidden');
            });
        });

        // Technology selection
        const techItems = document.querySelectorAll('.tech-item');
        techItems.forEach(item => {
            item.addEventListener('click', function() {
                const key = this.dataset.key;
                const icon = this.dataset.icon;
                const name = this.dataset.name;
                
                if (this.classList.contains('selected')) {
                    // Remove from selection
                    this.classList.remove('selected');
                    state.selectedTechnologies = state.selectedTechnologies.filter(t => t.key !== key);
                } else {
                    // Add to selection
                    this.classList.add('selected');
                    state.selectedTechnologies.push({ key, icon, name });
                }
                
                updateSelectedTechsDisplay();
                updateTemplateContent();
            });
        });

        // Clear all button
        if (elements.clearTechs) {
            elements.clearTechs.addEventListener('click', function() {
                state.selectedTechnologies = [];
                document.querySelectorAll('.tech-item.selected').forEach(item => {
                    item.classList.remove('selected');
                });
                updateSelectedTechsDisplay();
                updateTemplateContent();
            });
        }
    }

    function updateSelectedTechsDisplay() {
        if (!elements.selectedTechsList) return;
        
        elements.selectedTechsList.innerHTML = '';
        
        state.selectedTechnologies.forEach(tech => {
            const chip = document.createElement('span');
            chip.className = 'selected-tech';
            
            if (tech.icon) {
                const img = document.createElement('img');
                img.src = tech.icon;
                img.alt = tech.name;
                chip.appendChild(img);
            }
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = tech.name;
            chip.appendChild(nameSpan);
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-tech';
            removeBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
            removeBtn.addEventListener('click', () => {
                state.selectedTechnologies = state.selectedTechnologies.filter(t => t.key !== tech.key);
                document.querySelector(`.tech-item[data-key="${tech.key}"]`)?.classList.remove('selected');
                updateSelectedTechsDisplay();
                updateTemplateContent();
            });
            chip.appendChild(removeBtn);
            
            elements.selectedTechsList.appendChild(chip);
        });
    }

    // ========================================================================
    // STYLE OPTIONS
    // ========================================================================
    function initStyleOptions() {
        // Gradient controls
        if (elements.gradientStart) {
            elements.gradientStart.addEventListener('input', function() {
                state.style.gradientStart = this.value;
                updateTemplateStyle();
            });
        }
        if (elements.gradientEnd) {
            elements.gradientEnd.addEventListener('input', function() {
                state.style.gradientEnd = this.value;
                updateTemplateStyle();
            });
        }
        if (elements.gradientAngle) {
            elements.gradientAngle.addEventListener('input', function() {
                state.style.gradientAngle = parseInt(this.value);
                if (elements.angleDisplay) {
                    elements.angleDisplay.textContent = `${this.value}°`;
                }
                updateTemplateStyle();
            });
        }

        // Accent color
        if (elements.accentColor) {
            elements.accentColor.addEventListener('input', function() {
                state.style.accentColor = this.value;
                updateTemplateStyle();
            });
        }

        // Show/hide options
        if (elements.showAuthor) {
            elements.showAuthor.addEventListener('change', function() {
                state.style.showAuthor = this.checked;
                updateTemplateStyle();
            });
        }
        if (elements.showDecoration) {
            elements.showDecoration.addEventListener('change', function() {
                state.style.showDecoration = this.checked;
                updateTemplateStyle();
            });
        }
    }

    function updateTemplateStyle() {
        // Update all template backgrounds
        document.querySelectorAll('.template-bg').forEach(bg => {
            bg.style.background = `linear-gradient(${state.style.gradientAngle}deg, ${state.style.gradientStart}, ${state.style.gradientEnd})`;
        });

        // Update accent color (CSS variable)
        document.documentElement.style.setProperty('--branding-accent', state.style.accentColor);

        // Update highlight colors
        document.querySelectorAll('.branding-template .highlight').forEach(el => {
            el.style.color = state.style.accentColor;
        });

        // Show/hide author sections
        document.querySelectorAll('.template-author').forEach(author => {
            author.classList.toggle('hidden', !state.style.showAuthor);
        });

        // Show/hide decorations
        if (elements.templateDecoration) {
            elements.templateDecoration.classList.toggle('hidden', !state.style.showDecoration);
        }
    }

    // ========================================================================
    // UPDATE TEMPLATE CONTENT
    // ========================================================================
    function updateTemplateContent() {
        // Update badge
        if (elements.badgeText) {
            elements.badgeText.textContent = state.content.badge;
        }

        // Update title with highlight
        if (elements.templateTitle) {
            const titleParts = state.content.title.split(' ');
            if (titleParts.length > 1) {
                elements.templateTitle.innerHTML = `<span class="highlight" style="color: ${state.style.accentColor}">${titleParts[0]}</span> ${titleParts.slice(1).join(' ')}`;
            } else {
                elements.templateTitle.innerHTML = `<span class="highlight" style="color: ${state.style.accentColor}">${state.content.title}</span>`;
            }
        }

        // Update subtitle
        if (elements.templateSubtitle) {
            elements.templateSubtitle.textContent = state.content.subtitle;
        }

        // Update features
        if (elements.templateFeatures) {
            elements.templateFeatures.innerHTML = state.content.features.map(feature => `
                <div class="feature">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>${feature}</span>
                </div>
            `).join('');
            
            // Apply accent color to checkmarks
            elements.templateFeatures.querySelectorAll('svg').forEach(svg => {
                svg.style.color = state.style.accentColor;
            });
        }

        // Update tech stack
        if (elements.templateTechStack) {
            elements.templateTechStack.innerHTML = '';
            state.selectedTechnologies.forEach(tech => {
                if (tech.icon) {
                    const img = document.createElement('img');
                    img.src = tech.icon;
                    img.alt = tech.name;
                    img.title = tech.name;
                    elements.templateTechStack.appendChild(img);
                }
            });
        }

        // Update author title
        if (elements.authorTitle) {
            elements.authorTitle.textContent = state.content.authorTitle;
        }

        // Update skill template icons
        const skillIconsGrid = document.getElementById('skill-icons-grid');
        if (skillIconsGrid && state.currentTemplate === 'skill-highlight') {
            skillIconsGrid.innerHTML = '';
            state.selectedTechnologies.slice(0, 4).forEach(tech => {
                if (tech.icon) {
                    const container = document.createElement('div');
                    container.className = 'skill-icon-large';
                    const img = document.createElement('img');
                    img.src = tech.icon;
                    img.alt = tech.name;
                    container.appendChild(img);
                    skillIconsGrid.appendChild(container);
                }
            });
        }

        // Update portfolio card tech stack
        const portfolioTechStack = document.getElementById('portfolio-tech-stack');
        if (portfolioTechStack && state.currentTemplate === 'portfolio-card') {
            portfolioTechStack.innerHTML = '';
            state.selectedTechnologies.forEach(tech => {
                if (tech.icon) {
                    const img = document.createElement('img');
                    img.src = tech.icon;
                    img.alt = tech.name;
                    img.title = tech.name;
                    portfolioTechStack.appendChild(img);
                }
            });
        }

        // Update badge icon based on first selected technology
        if (elements.badgeIcon && state.selectedTechnologies.length > 0) {
            elements.badgeIcon.src = state.selectedTechnologies[0].icon;
        }
    }

    // ========================================================================
    // RESOLUTION CONTROLS
    // ========================================================================
    function initResolutionControls() {
        const presetButtons = document.querySelectorAll('.preset-btn');
        const widthInput = document.getElementById('custom-width');
        const heightInput = document.getElementById('custom-height');
        const applyBtn = document.getElementById('apply-custom-size');

        presetButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                presetButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                state.width = parseInt(this.dataset.width);
                state.height = parseInt(this.dataset.height);

                if (widthInput) widthInput.value = state.width;
                if (heightInput) heightInput.value = state.height;

                updatePreview();
            });
        });

        if (applyBtn) {
            applyBtn.addEventListener('click', function() {
                const width = parseInt(widthInput.value);
                const height = parseInt(heightInput.value);

                if (width >= 100 && width <= 3840 && height >= 100 && height <= 2160) {
                    state.width = width;
                    state.height = height;
                    presetButtons.forEach(b => b.classList.remove('active'));
                    updatePreview();
                }
            });
        }

        // Enter key support
        [widthInput, heightInput].forEach(input => {
            if (input) {
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        applyBtn?.click();
                    }
                });
            }
        });
    }

    // ========================================================================
    // ZOOM CONTROLS
    // ========================================================================
    function initZoomControls() {
        const zoomButtons = document.querySelectorAll('.zoom-btn');

        zoomButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                zoomButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const zoomValue = this.dataset.zoom;

                if (zoomValue === 'fit') {
                    const containerWidth = elements.previewContainer.clientWidth - 40;
                    const containerHeight = elements.previewContainer.clientHeight - 40;
                    const scaleX = containerWidth / state.width;
                    const scaleY = containerHeight / state.height;
                    state.zoom = Math.min(scaleX, scaleY, 1);
                } else {
                    state.zoom = parseFloat(zoomValue);
                }

                updatePreview();
            });
        });
    }

    // ========================================================================
    // PREVIEW UPDATE
    // ========================================================================
    function updatePreview() {
        if (!elements.previewCanvas) return;

        elements.previewCanvas.style.width = `${state.width}px`;
        elements.previewCanvas.style.height = `${state.height}px`;
        elements.previewCanvas.style.transform = `scale(${state.zoom})`;
        elements.previewCanvas.style.transformOrigin = 'top left';

        if (elements.currentSize) {
            elements.currentSize.textContent = `${state.width} x ${state.height}`;
        }
        if (elements.currentZoom) {
            elements.currentZoom.textContent = `${Math.round(state.zoom * 100)}%`;
        }

        if (elements.previewContainer) {
            elements.previewContainer.style.minHeight = `${state.height * state.zoom + 60}px`;
        }
    }

    // ========================================================================
    // EXPORT FUNCTIONALITY
    // ========================================================================
    function initExportButtons() {
        const exportPngBtn = document.getElementById('export-png');
        const copyClipboardBtn = document.getElementById('copy-clipboard');

        if (exportPngBtn) {
            exportPngBtn.addEventListener('click', exportAsPng);
        }

        if (copyClipboardBtn) {
            copyClipboardBtn.addEventListener('click', copyToClipboard);
        }
    }

    async function exportAsPng() {
        try {
            if (typeof html2canvas === 'undefined') {
                showNotification('Pour exporter en PNG, faites une capture d\'ecran de la preview', 'info');
                
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
                                <link rel="stylesheet" href="${document.querySelector('link[href*="branding-preview"]')?.href || ''}">
                            </head>
                            <body>
                                <div class="export-container">
                                    ${template.outerHTML.replace('hidden', '')}
                                </div>
                                <script>
                                    // Remove hidden class from the cloned template
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

            showNotification('Image exportee avec succes!', 'success');
        } catch (error) {
            console.error('Export error:', error);
            showNotification('Erreur lors de l\'export', 'error');
        }
    }

    async function copyToClipboard() {
        try {
            if (typeof html2canvas === 'undefined') {
                showNotification('html2canvas requis pour copier dans le presse-papier', 'info');
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
                    showNotification('Copie dans le presse-papier!', 'success');
                } catch (err) {
                    console.error('Clipboard error:', err);
                    showNotification('Erreur lors de la copie', 'error');
                }
            });
        } catch (error) {
            console.error('Copy error:', error);
            showNotification('Erreur lors de la copie', 'error');
        }
    }

    // ========================================================================
    // NOTIFICATIONS
    // ========================================================================
    function showNotification(message, type = 'info') {
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
    }

    // ========================================================================
    // INITIALIZE ON DOM READY
    // ========================================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
