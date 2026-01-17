// ============================================================================
// BRANDING - TEMPLATES MODULE
// ============================================================================
// Template switching and content updates

window.BrandingEditor = window.BrandingEditor || {};

window.BrandingEditor.templates = {
    init: function() {
        const templateCards = document.querySelectorAll('.template-card');
        const self = this;
        
        templateCards.forEach(card => {
            card.addEventListener('click', function() {
                templateCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                
                const templateId = this.dataset.template;
                self.switch(templateId);
            });
        });
        
        // Initialize template-specific input listeners
        this.initTemplateInputs();
    },
    
    initTemplateInputs: function() {
        const self = this;
        const state = window.BrandingEditor.state;
        
        // Service Card inputs
        this.bindInput('edit-badge', 'service-card', 'badge');
        this.bindInput('edit-title', 'service-card', 'title');
        this.bindInput('edit-subtitle', 'service-card', 'subtitle');
        this.bindInput('edit-author-title', 'service-card', 'authorTitle');
        this.bindTextarea('edit-features', 'service-card', 'features', true);
        this.bindTextarea('edit-code-block', 'service-card', 'codeBlock', false);
        
        // Portfolio Card inputs
        this.bindInput('portfolio-title-input', 'portfolio-card', 'title');
        this.bindTextarea('portfolio-highlights-input', 'portfolio-card', 'highlights', true);
        
        // Skill Highlight inputs
        this.bindInput('skill-title-input', 'skill-highlight', 'title');
        this.bindInput('skill-subtitle-input', 'skill-highlight', 'subtitle');
        this.bindInput('skill-author-title-input', 'skill-highlight', 'authorTitle');
        
        // LinkedIn Header inputs
        this.bindInput('linkedin-title-input', 'linkedin-header', 'title');
        this.bindTextarea('linkedin-highlights-input', 'linkedin-header', 'highlights', true);
        
        // Project showcase logo/title toggle
        const showLogoTitle = document.getElementById('show-logo-title');
        if (showLogoTitle) {
            showLogoTitle.addEventListener('change', function() {
                state.templates['project-showcase'].showLogoTitle = this.checked;
                self.updateProjectTitleVisibility();
                window.BrandingEditor.saveState();
            });
        }
    },
    
    bindInput: function(elementId, templateKey, propKey) {
        const self = this;
        const state = window.BrandingEditor.state;
        const el = document.getElementById(elementId);
        if (el) {
            el.addEventListener('input', function() {
                state.templates[templateKey][propKey] = this.value;
                self.updateContent();
                window.BrandingEditor.saveState();
            });
        }
    },
    
    bindTextarea: function(elementId, templateKey, propKey, isArray) {
        const self = this;
        const state = window.BrandingEditor.state;
        const el = document.getElementById(elementId);
        if (el) {
            el.addEventListener('input', function() {
                if (isArray) {
                    state.templates[templateKey][propKey] = this.value.split('\n').filter(line => line.trim());
                } else {
                    state.templates[templateKey][propKey] = this.value;
                }
                self.updateContent();
                window.BrandingEditor.saveState();
            });
        }
    },
    
    switch: function(templateId) {
        const state = window.BrandingEditor.state;
        
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

        // Hide all template params sections
        document.querySelectorAll('.template-params').forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show current template params section
        const paramsSection = document.getElementById(`params-${templateId}`);
        if (paramsSection) {
            paramsSection.classList.remove('hidden');
        }

        // Update template-specific content
        this.updateContent();
        
        // Save state
        window.BrandingEditor.saveState();
    },
    
    updateProjectTitleVisibility: function() {
        const state = window.BrandingEditor.state;
        const projectTitle = document.getElementById('project-title');
        const projectLogoContainer = document.getElementById('project-logo-container');
        
        if (projectTitle && state.currentProject) {
            const hasLogo = state.currentProject.logo && projectLogoContainer && projectLogoContainer.style.display !== 'none';
            const showLogoTitle = state.templates['project-showcase'].showLogoTitle;
            projectTitle.style.display = (!hasLogo || showLogoTitle) ? 'block' : 'none';
        }
    },
    
    updateContent: function() {
        const state = window.BrandingEditor.state;
        const elements = window.BrandingEditor.elements;
        const currentTemplateData = state.templates[state.currentTemplate] || {};
        
        console.log('[BrandingEditor] updateContent called for:', state.currentTemplate);
        console.log('[BrandingEditor] Template data:', state.templates[state.currentTemplate]);

        // ================================================================
        // SERVICE CARD TEMPLATE
        // ================================================================
        if (state.currentTemplate === 'service-card') {
            const data = state.templates['service-card'];
            
            // Update badge
            if (elements.badgeText) {
                elements.badgeText.textContent = data.badge;
            }

            // Update title with highlight
            if (elements.templateTitle) {
                const titleParts = data.title.split(' ');
                if (titleParts.length > 1) {
                    elements.templateTitle.innerHTML = `<span class="highlight" style="color: ${state.style.accentColor}">${titleParts[0]}</span> ${titleParts.slice(1).join(' ')}`;
                } else {
                    elements.templateTitle.innerHTML = `<span class="highlight" style="color: ${state.style.accentColor}">${data.title}</span>`;
                }
            }

            // Update subtitle
            if (elements.templateSubtitle) {
                elements.templateSubtitle.textContent = data.subtitle;
            }

            // Update features
            if (elements.templateFeatures) {
                elements.templateFeatures.innerHTML = data.features.map(feature => `
                    <div class="feature">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>${feature}</span>
                    </div>
                `).join('');
                
                elements.templateFeatures.querySelectorAll('svg').forEach(svg => {
                    svg.style.color = state.style.accentColor;
                });
            }

            // Update author title
            if (elements.authorTitle) {
                elements.authorTitle.textContent = data.authorTitle;
            }
            
            // Update code block
            if (elements.codeBlockContent) {
                elements.codeBlockContent.textContent = data.codeBlock;
            }
        }

        // ================================================================
        // PORTFOLIO CARD TEMPLATE
        // ================================================================
        if (state.currentTemplate === 'portfolio-card') {
            const data = state.templates['portfolio-card'];
            
            const portfolioTitle = document.getElementById('portfolio-title');
            if (portfolioTitle) {
                portfolioTitle.textContent = data.title;
            }
            
            const portfolioHighlights = document.getElementById('portfolio-highlights');
            if (portfolioHighlights) {
                portfolioHighlights.innerHTML = data.highlights.map(h => 
                    `<span class="highlight-tag">${h}</span>`
                ).join('');
            }
            
            // Update tech stack
            const portfolioTechStack = document.getElementById('portfolio-tech-stack');
            if (portfolioTechStack) {
                portfolioTechStack.innerHTML = '';
                state.selectedTechnologies.forEach(tech => {
                    if (tech.icon) {
                        const img = document.createElement('img');
                        img.src = tech.icon;
                        img.alt = tech.name;
                        img.title = tech.name;
                        portfolioTechStack.appendChild(img);
                    } else if (tech.emoji) {
                        const emojiSpan = document.createElement('span');
                        emojiSpan.className = 'tech-emoji-preview';
                        emojiSpan.textContent = tech.emoji;
                        emojiSpan.title = tech.name;
                        portfolioTechStack.appendChild(emojiSpan);
                    }
                });
            }
        }

        // ================================================================
        // SKILL HIGHLIGHT TEMPLATE
        // ================================================================
        if (state.currentTemplate === 'skill-highlight') {
            const data = state.templates['skill-highlight'];
            
            const skillTitle = document.getElementById('skill-title');
            if (skillTitle) {
                const titleParts = data.title.split(' ');
                if (titleParts.length > 1) {
                    skillTitle.innerHTML = `<span class="highlight" style="color: ${state.style.accentColor}">${titleParts[0]}</span> ${titleParts.slice(1).join(' ')}`;
                } else {
                    skillTitle.innerHTML = `<span class="highlight" style="color: ${state.style.accentColor}">${data.title}</span>`;
                }
            }
            
            const skillSubtitle = document.getElementById('skill-subtitle');
            if (skillSubtitle) {
                skillSubtitle.textContent = data.subtitle;
            }
            
            const skillAuthorTitle = document.querySelector('#skill-author .author-title');
            if (skillAuthorTitle) {
                skillAuthorTitle.textContent = data.authorTitle;
            }
            
            // Update skill icons grid
            const skillIconsGrid = document.getElementById('skill-icons-grid');
            if (skillIconsGrid) {
                skillIconsGrid.innerHTML = '';
                state.selectedTechnologies.slice(0, 4).forEach(tech => {
                    const container = document.createElement('div');
                    container.className = 'skill-icon-large';
                    if (tech.icon) {
                        const img = document.createElement('img');
                        img.src = tech.icon;
                        img.alt = tech.name;
                        container.appendChild(img);
                    } else if (tech.emoji) {
                        const emojiSpan = document.createElement('span');
                        emojiSpan.className = 'skill-emoji';
                        emojiSpan.textContent = tech.emoji;
                        container.appendChild(emojiSpan);
                    }
                    skillIconsGrid.appendChild(container);
                });
            }
        }

        // ================================================================
        // LINKEDIN HEADER TEMPLATE
        // ================================================================
        if (state.currentTemplate === 'linkedin-header') {
            const data = state.templates['linkedin-header'];
            
            const linkedinTitle = document.getElementById('linkedin-header-title');
            if (linkedinTitle) {
                linkedinTitle.textContent = data.title;
            }
            
            // Update highlights
            const highlights = data.highlights.slice(0, 3);
            highlights.forEach((text, i) => {
                const el = document.getElementById(`linkedin-highlight-${i + 1}`);
                if (el) {
                    el.textContent = text;
                    el.style.display = text ? 'block' : 'none';
                }
            });
            
            // Update tech stack
            const linkedinHeaderTechs = document.getElementById('linkedin-header-techs');
            if (linkedinHeaderTechs) {
                linkedinHeaderTechs.innerHTML = '';
                state.selectedTechnologies.slice(0, 6).forEach(tech => {
                    if (tech.icon) {
                        const img = document.createElement('img');
                        img.src = tech.icon;
                        img.alt = tech.name;
                        img.title = tech.name;
                        linkedinHeaderTechs.appendChild(img);
                    } else if (tech.emoji) {
                        const emojiSpan = document.createElement('span');
                        emojiSpan.className = 'tech-emoji-preview';
                        emojiSpan.textContent = tech.emoji;
                        emojiSpan.title = tech.name;
                        linkedinHeaderTechs.appendChild(emojiSpan);
                    }
                });
            }
        }

        // ================================================================
        // SERVICE CARD - Tech stack and badge icon (shared)
        // ================================================================
        if (state.currentTemplate === 'service-card') {
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
                    } else if (tech.emoji) {
                        const emojiSpan = document.createElement('span');
                        emojiSpan.className = 'tech-emoji-preview';
                        emojiSpan.textContent = tech.emoji;
                        emojiSpan.title = tech.name;
                        elements.templateTechStack.appendChild(emojiSpan);
                    }
                });
            }

            // Update badge icon based on first selected technology
            if (elements.badgeIcon && state.selectedTechnologies.length > 0) {
                const firstTech = state.selectedTechnologies[0];
                if (firstTech.icon) {
                    elements.badgeIcon.src = firstTech.icon;
                    elements.badgeIcon.style.display = 'block';
                } else {
                    elements.badgeIcon.style.display = 'none';
                }
            }
        }
    }
};
