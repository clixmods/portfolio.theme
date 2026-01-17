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
    },
    
    switch: function(templateId) {
        const state = window.BrandingEditor.state;
        const elements = window.BrandingEditor.elements;
        
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
        
        // Show text editor for all templates except project-showcase
        if (textEditorSection) {
            textEditorSection.style.display = (templateId === 'project-showcase') ? 'none' : 'block';
        }
        
        // Show project selector for project-showcase and portfolio-card templates
        if (projectSelectorSection) {
            const showProjectSelector = (templateId === 'project-showcase' || templateId === 'portfolio-card');
            projectSelectorSection.style.display = showProjectSelector ? 'block' : 'none';
        }
        
        // Show logo/title option only for project-showcase template
        if (elements.logoTitleOption) {
            elements.logoTitleOption.style.display = (templateId === 'project-showcase') ? 'flex' : 'none';
        }
        
        // Show code block field only for service-card template
        if (elements.codeBlockField) {
            elements.codeBlockField.style.display = (templateId === 'service-card') ? 'flex' : 'none';
        }

        // Update template-specific content
        this.updateContent();
    },
    
    updateProjectTitleVisibility: function() {
        const state = window.BrandingEditor.state;
        const projectTitle = document.getElementById('project-title');
        const projectLogoContainer = document.getElementById('project-logo-container');
        
        if (projectTitle && state.currentProject) {
            const hasLogo = state.currentProject.logo && projectLogoContainer && projectLogoContainer.style.display !== 'none';
            projectTitle.style.display = (!hasLogo || state.style.showLogoTitle) ? 'block' : 'none';
        }
    },
    
    updateContent: function() {
        const state = window.BrandingEditor.state;
        const elements = window.BrandingEditor.elements;

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
                } else if (tech.emoji) {
                    const emojiSpan = document.createElement('span');
                    emojiSpan.className = 'tech-emoji-preview';
                    emojiSpan.textContent = tech.emoji;
                    emojiSpan.title = tech.name;
                    elements.templateTechStack.appendChild(emojiSpan);
                }
            });
        }

        // Update author title
        if (elements.authorTitle) {
            elements.authorTitle.textContent = state.content.authorTitle;
        }
        
        // Update code block
        if (elements.codeBlockContent) {
            elements.codeBlockContent.textContent = state.content.codeBlock;
        }

        // Update skill template icons
        const skillIconsGrid = document.getElementById('skill-icons-grid');
        if (skillIconsGrid && state.currentTemplate === 'skill-highlight') {
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
                } else if (tech.emoji) {
                    const emojiSpan = document.createElement('span');
                    emojiSpan.className = 'tech-emoji-preview';
                    emojiSpan.textContent = tech.emoji;
                    emojiSpan.title = tech.name;
                    portfolioTechStack.appendChild(emojiSpan);
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
};
