// ============================================================================
// BRANDING - EDITOR MODULE
// ============================================================================
// Text editor and project selector functionality

window.BrandingEditor = window.BrandingEditor || {};

window.BrandingEditor.editor = {
    init: function() {
        this.initTextEditor();
        this.initProjectSelector();
    },
    
    initTextEditor: function() {
        const elements = window.BrandingEditor.elements;
        const state = window.BrandingEditor.state;
        const templates = window.BrandingEditor.templates;

        // Badge input
        if (elements.editBadge) {
            elements.editBadge.addEventListener('input', function() {
                state.content.badge = this.value;
                templates.updateContent();
            });
        }

        // Title input
        if (elements.editTitle) {
            elements.editTitle.addEventListener('input', function() {
                state.content.title = this.value;
                templates.updateContent();
            });
        }

        // Subtitle input
        if (elements.editSubtitle) {
            elements.editSubtitle.addEventListener('input', function() {
                state.content.subtitle = this.value;
                templates.updateContent();
            });
        }

        // Features textarea
        if (elements.editFeatures) {
            elements.editFeatures.addEventListener('input', function() {
                state.content.features = this.value.split('\n').filter(f => f.trim());
                templates.updateContent();
            });
        }

        // Author title input
        if (elements.editAuthorTitle) {
            elements.editAuthorTitle.addEventListener('input', function() {
                state.content.authorTitle = this.value;
                templates.updateContent();
            });
        }
        
        // Code block textarea
        if (elements.editCodeBlock) {
            elements.editCodeBlock.addEventListener('input', function() {
                state.content.codeBlock = this.value;
                templates.updateContent();
            });
        }
    },
    
    initProjectSelector: function() {
        const self = this;
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
                
                self.selectProject(this.dataset);
            });
        });
    },
    
    selectProject: function(projectData) {
        const state = window.BrandingEditor.state;
        const templates = window.BrandingEditor.templates;
        
        // Store current project data
        state.currentProject = projectData;
        
        const projectTitle = document.getElementById('project-title');
        const projectSubtitle = document.getElementById('project-subtitle');
        const projectLogo = document.getElementById('project-logo');
        const projectLogoContainer = document.getElementById('project-logo-container');
        const projectImageOverlay = document.getElementById('project-image-overlay');
        const projectTechs = document.getElementById('project-techs');
        const projectStatus = document.getElementById('project-status');

        if (projectTitle) {
            projectTitle.textContent = projectData.title || 'Project Title';
            templates.updateProjectTitleVisibility();
        }
        if (projectSubtitle) {
            projectSubtitle.textContent = projectData.subtitle || '';
        }
        
        // Handle logo - reset if no logo provided
        if (projectLogo) {
            if (projectData.logo) {
                projectLogo.src = projectData.logo;
                projectLogo.style.display = 'block';
                if (projectLogoContainer) {
                    projectLogoContainer.style.display = 'flex';
                }
            } else {
                projectLogo.src = '';
                projectLogo.style.display = 'none';
                if (projectLogoContainer) {
                    projectLogoContainer.style.display = 'none';
                }
            }
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
                
                const tech = window.BrandingEditor.technologies.find(techKey.trim());
                if (tech && tech.icon) {
                    const img = document.createElement('img');
                    img.src = tech.icon;
                    img.alt = tech.name;
                    img.title = tech.name;
                    projectTechs.appendChild(img);
                }
            });
        }
        
        // Also update portfolio card if it's the current template
        if (state.currentTemplate === 'portfolio-card') {
            this.updatePortfolioCardWithProject(projectData);
        }
    },
    
    updatePortfolioCardWithProject: function(projectData) {
        const portfolioHighlights = document.getElementById('portfolio-highlights');
        
        if (portfolioHighlights && projectData) {
            portfolioHighlights.innerHTML = '';
            
            if (projectData.title) {
                const projectTag = document.createElement('span');
                projectTag.className = 'highlight-tag';
                projectTag.textContent = projectData.title;
                portfolioHighlights.appendChild(projectTag);
            }
            
            if (projectData.status) {
                const statusTag = document.createElement('span');
                statusTag.className = 'highlight-tag';
                statusTag.textContent = projectData.status;
                portfolioHighlights.appendChild(statusTag);
            }
        }
    }
};
