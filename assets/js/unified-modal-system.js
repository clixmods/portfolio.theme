/**
 * UNIFIED MODAL SYSTEM - REFACTORED
 * Modular and reusable system for all modal types
 * Replaces old specific modals with a unified and configurable system
 */

// ================================
// CONFIGURATION AND TEMPLATES
// ================================

/**
 * Modal templates configuration
 */
const MODAL_TEMPLATES = {
    base: {
        containerStyles: `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            backdrop-filter: blur(10px);
        `,
        contentStyles: `
            max-width: 90vw;
            max-height: 90vh;
            margin: 5vh auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            overflow: hidden;
            position: relative;
        `,
        headerStyles: `
            position: absolute;
            top: 16px;
            right: 16px;
            z-index: 1;
        `,
        closeButtonStyles: `
            background: rgba(0, 0, 0, 0.1);
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
            transition: background 0.2s ease;
        `,
        bodyStyles: `padding: 32px;`,
        contentHeaderStyles: `
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
        `,
        contentHeaderLeftStyles: `
            display: flex;
            align-items: center;
            flex: 1;
        `,
        iconStyles: `margin-right: 16px;`,
        titleStyles: `margin: 0; font-size: 24px; font-weight: 600;`,
        chipsStyles: `margin-top: 8px;`
    },
    widths: {
        contact: '800px',
        person: '700px',
        skill: '750px',
        actions: '600px',
        discord: '500px',
        default: '600px'
    }
};

/**
 * Type-specific content templates
 */
const CONTENT_TEMPLATES = {
    contact: (config) => `
        <div class="unified-modal-two-columns">
            <div class="contact-info-column">
                <h4>📋 Mes coordonnées</h4>
                <div class="contact-info">
                    ${generateContactItems(config.content?.contacts || getDefaultContactData())}
                </div>
            </div>
            <div class="contact-form-column">
                <h4>✉️ Envoyez-moi un message</h4>
                <div class="contact-form-content">
                    ${generateContactForm(config.content?.form)}
                </div>
            </div>
        </div>
    `,
    
    discord: (config) => `
        <div class="unified-modal-simple-content">
            <p>Voici mon ID Discord :</p>
            <div class="discord-id-display">
                <code class="discord-id">${config.content.discordId}</code>
                <button class="btn-action primary" onclick="UnifiedModal.copyToClipboard('${config.content.discordId}')">
                    <span class="icon">📋</span> Copier
                </button>
            </div>
            <p class="note">Tu peux m'ajouter sur Discord ou m'envoyer un message !</p>
            <div class="simple-actions">
                <button class="btn-action accent" onclick="UnifiedModal.openDiscordApp()">
                    <span class="icon">💬</span> Ouvrir Discord
                </button>
            </div>
        </div>
    `,
    
    actions: (config) => `
        <div class="unified-modal-simple-content">
            <div class="actions-list">
                ${config.content.actions.map(generateActionItem).join('')}
            </div>
        </div>
    `,
    
    skill: (config) => `
        ${config.tabs ? generateTabSystem(config.tabs) : ''}
        <div class="unified-modal-panels">
            ${config.tabs ? config.tabs.map(tab => generateTabPanel(tab, config.content[tab.key])).join('') : generateSkillContent(config.content)}
        </div>
    `,
    
    person: (config) => `
        ${config.tabs ? generateTabSystem(config.tabs) : ''}
        <div class="unified-modal-panels">
            ${config.tabs ? config.tabs.map(tab => generateTabPanel(tab, config.content[tab.key])).join('') : generatePersonContent(config.content)}
        </div>
    `
};

// ================================
// COMPONENT GENERATORS
// ================================

/**
 * Generate an icon (image or emoji)
 */
function generateIcon(icon, alt = '', size = 48) {
    if (icon.startsWith('/')) {
        return `<img src="${icon}" alt="${alt}" width="${size}" height="${size}" style="object-fit: cover;" />`;
    }
    return `<span style="font-size: ${size}px">${icon}</span>`;
}

/**
 * Generate status chips
 */
function generateChips(chips) {
    if (!chips || !Array.isArray(chips)) return '';
    return chips.map(chip => {
        const type = typeof chip === 'object' ? chip.type || '' : '';
        const text = typeof chip === 'object' ? chip.text : chip;
        const className = type ? `chip ${type}` : 'chip';
        return `<span class="${className}">${text}</span>`;
    }).join('');
}

/**
 * Generate tab system
 */
function generateTabSystem(tabs) {
    if (!tabs || tabs.length === 0) return '';
    
    return `
        <div class="tabs unified-modal-tabs">
            ${tabs.map((tab, index) => `
                <button class="tab-btn ${index === 0 ? 'active' : ''}" data-tab="${tab.key}">
                    <span class="tab-icon">${tab.icon}</span>
                    <span class="tab-label">${tab.label}</span>
                    ${tab.count !== undefined ? `<span class="count">${tab.count}</span>` : ''}
                </button>
            `).join('')}
        </div>
    `;
}

/**
 * Generate tab panel
 */
function generateTabPanel(tab, content) {
    const isActive = tab.active === true;
    return `
        <div class="unified-modal-panel ${isActive ? 'active' : ''}" data-panel="${tab.key}">
            ${content || `<p>Contenu du tab ${tab.label}</p>`}
        </div>
    `;
}

/**
 * Generate action item
 */
function generateActionItem(action) {
    const buttonClass = getActionButtonClass(action.action);
    const actionHandler = `UnifiedModal.handleAction('${action.action}', '${action.url || ''}', '${action.title}')`;
    
    return `
        <div class="action-item">
            <div class="action-icon">${action.icon}</div>
            <div class="action-content">
                <div class="action-title">${action.title}</div>
                <div class="action-desc">${action.desc}</div>
            </div>
            <button class="btn-action ${buttonClass}" onclick="${actionHandler}">
                ${getActionButtonText(action)}
            </button>
        </div>
    `;
}

/**
 * Génère les éléments de contact
 */
function generateContactItems(contacts) {
    return contacts.map(contact => `
        <div class="contact-item">
            <div class="contact-icon">${contact.icon}</div>
            <div class="contact-details">
                <div class="contact-title">${contact.title}</div>
                <div class="contact-value">${contact.value}</div>
            </div>
            ${contact.link ? `
                <a href="${contact.link}" class="contact-link" ${contact.external ? 'target="_blank"' : ''}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M8 12L16 12" stroke="currentColor" stroke-width="2"/>
                        <path d="M12 8L16 12L12 16" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </a>
            ` : ''}
        </div>
    `).join('');
}

/**
 * Génère le formulaire de contact
 */
function generateContactForm(formConfig = {}) {
    return `
        <form class="contact-form" onsubmit="UnifiedModal.handleContactSubmit(event)">
            <div class="form-group">
                <label>Nom complet</label>
                <input type="text" name="name" placeholder="Votre nom" required />
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" placeholder="votre@email.com" required />
            </div>
            <div class="form-group">
                <label>Sujet</label>
                <input type="text" name="subject" placeholder="Objet de votre message" />
            </div>
            <div class="form-group">
                <label>Message</label>
                <textarea name="message" rows="4" placeholder="Votre message..." required></textarea>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-action primary">
                    <span class="icon">📤</span> Envoyer
                </button>
            </div>
        </form>
    `;
}

/**
 * Génère le contenu pour un modal de compétence
 */
function generateSkillContent(content) {
    if (!content) return '<p>Aucun contenu disponible</p>';
    
    return `
        <div class="skill-content">
            ${content.description ? `<div class="skill-description">${content.description}</div>` : ''}
            ${content.projects ? generateProjectsGrid(content.projects) : ''}
            ${content.experiences ? generateExperiencesList(content.experiences) : ''}
        </div>
    `;
}

/**
 * Génère le contenu pour un modal de personne
 */
function generatePersonContent(content) {
    if (!content) return '<p>Aucun contenu disponible</p>';
    
    return `
        <div class="person-content">
            ${content.bio ? `<div class="person-bio">${content.bio}</div>` : ''}
            ${content.skills ? generateSkillsList(content.skills) : ''}
            ${content.projects ? generateProjectsGrid(content.projects) : ''}
        </div>
    `;
}

// ================================
// UTILITY FUNCTIONS
// ================================

function getActionButtonClass(action) {
    const classMap = {
        'video': 'accent',
        'download': 'primary',
        'github': 'secondary',
        'docs': 'secondary'
    };
    return classMap[action] || '';
}

function getActionButtonText(action) {
    if (action.buttonText) return action.buttonText;
    return action.title.split(' ')[0];
}

function getDefaultContactData() {
    return [
        {
            icon: '📧',
            title: 'Email',
            value: 'clement.g.developer@gmail.com',
            link: 'mailto:clement.g.developer@gmail.com'
        },
        {
            icon: '💼',
            title: 'LinkedIn',
            value: 'linkedin.com/in/clixmods',
            link: 'https://linkedin.com/in/clixmods',
            external: true
        },
        {
            icon: '💬',
            title: 'Discord',
            value: 'clixmods',
            link: 'discord://'
        },
        {
            icon: '📍',
            title: 'Localisation',
            value: 'Montpellier, France'
        }
    ];
}

function generateProjectsGrid(projects) {
    if (!projects || projects.length === 0) return '';
    
    return `
        <div class="projects-grid">
            ${projects.map(project => `
                <div class="project-card">
                    <h4>${project.title}</h4>
                    <p>${project.description}</p>
                    <div class="card-actions">
                        <button class="btn-action primary" onclick="UnifiedModal.viewProject('${project.slug}')">
                            Voir le projet
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function generateExperiencesList(experiences) {
    if (!experiences || experiences.length === 0) return '';
    
    return `
        <div class="experiences-list">
            ${experiences.map(exp => `
                <div class="experience-item">
                    <h4>${exp.title}</h4>
                    <p>${exp.description}</p>
                    <div class="item-actions">
                        <button class="btn-action accent" onclick="UnifiedModal.viewExperience('${exp.slug}')">
                            Voir l'expérience
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function generateSkillsList(skills) {
    if (!skills || skills.length === 0) return '';
    
    return `
        <div class="skills-list">
            ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
    `;
}

// ================================
// MAIN UNIFIED MODAL CLASS
// ================================

/**
 * Main class for managing unified modals
 */
class UnifiedModal {
    static currentModal = null;

    /**
     * Crée et affiche un modal unifié
     */
    static create(config) {
        const modal = this.getOrCreateModalElement();
        const content = this.generateModalContent(config);
        
        modal.innerHTML = content;
        this.showModal(modal, config);
        this.attachEventListeners(modal);
        this.currentModal = modal;
        
        return modal;
    }

    /**
     * Récupère ou crée l'élément modal
     */
    static getOrCreateModalElement() {
        let modal = document.getElementById('unifiedModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'unifiedModal';
            modal.className = 'unified-modal';
            modal.style.cssText = MODAL_TEMPLATES.base.containerStyles;
            document.body.appendChild(modal);
        }
        return modal;
    }

    /**
     * Génère le contenu du modal
     */
    static generateModalContent(config) {
        const width = MODAL_TEMPLATES.widths[config.type] || MODAL_TEMPLATES.widths.default;
        const contentTemplate = CONTENT_TEMPLATES[config.type];
        
        if (!contentTemplate) {
            console.warn(`No template found for modal type: ${config.type}`);
            return this.generateErrorContent(config.type);
        }

        return `
            <div class="unified-modal-content" style="${MODAL_TEMPLATES.base.contentStyles} width: ${width};">
                ${this.generateModalHeader()}
                ${this.generateModalBody(config, contentTemplate)}
            </div>
        `;
    }

    /**
     * Génère le header du modal
     */
    static generateModalHeader() {
        return `
            <div class="unified-modal-header" style="${MODAL_TEMPLATES.base.headerStyles}">
                <button class="unified-modal-close" style="${MODAL_TEMPLATES.base.closeButtonStyles}">&times;</button>
            </div>
        `;
    }

    /**
     * Génère le body du modal
     */
    static generateModalBody(config, contentTemplate) {
        return `
            <div class="unified-modal-body" style="${MODAL_TEMPLATES.base.bodyStyles}">
                ${this.generateContentHeader(config)}
                ${contentTemplate(config)}
            </div>
        `;
    }

    /**
     * Génère le header du contenu
     */
    static generateContentHeader(config) {
        const hasRightContent = config.headerRight;
        
        return `
            <div class="unified-modal-content-header" style="${MODAL_TEMPLATES.base.contentHeaderStyles}">
                <div class="unified-modal-content-header-left" style="${MODAL_TEMPLATES.base.contentHeaderLeftStyles}">
                    <div class="unified-modal-icon-large" style="${MODAL_TEMPLATES.base.iconStyles}">
                        ${generateIcon(config.icon, config.title, config.iconSize || 48)}
                    </div>
                    <div class="unified-modal-title-block">
                        <h2 style="${MODAL_TEMPLATES.base.titleStyles}">${config.title}</h2>
                        <div class="unified-modal-chips" style="${MODAL_TEMPLATES.base.chipsStyles}">
                            ${generateChips(config.chips)}
                        </div>
                    </div>
                </div>
                ${hasRightContent ? `<div class="unified-modal-content-header-right">${config.headerRight}</div>` : ''}
            </div>
        `;
    }

    /**
     * Affiche le modal
     */
    static showModal(modal, config) {
        // Animation d'entrée
        modal.style.display = 'block';
        modal.style.opacity = '0';
        
        requestAnimationFrame(() => {
            modal.style.transition = 'opacity 0.3s ease';
            modal.style.opacity = '1';
        });
        
        document.body.style.overflow = 'hidden';
        
        // Gestion de la touche Escape
        document.addEventListener('keydown', this.handleKeyDown);
    }

    /**
     * Cache le modal
     */
    static hideModal(modal = null) {
        const targetModal = modal || this.currentModal;
        if (!targetModal) return;

        // Animation de sortie
        targetModal.style.transition = 'opacity 0.3s ease';
        targetModal.style.opacity = '0';
        
        setTimeout(() => {
            targetModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
        
        document.removeEventListener('keydown', this.handleKeyDown);
        this.currentModal = null;
    }

    /**
     * Gestion des événements clavier
     */
    static handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            this.hideModal();
        }
    }

    /**
     * Attache les event listeners
     */
    static attachEventListeners(modal) {
        // Bouton de fermeture
        const closeBtn = modal.querySelector('.unified-modal-close');
        if (closeBtn) {
            closeBtn.onclick = () => this.hideModal(modal);
        }

        // Fermeture en cliquant à l'extérieur
        modal.onclick = (e) => {
            if (e.target === modal) {
                this.hideModal(modal);
            }
        };

        // Gestion des tabs
        this.setupTabSystem(modal);
        
        // Gestion des formulaires
        this.setupFormHandlers(modal);
    }

    /**
     * Configure le système de tabs
     */
    static setupTabSystem(modal) {
        const tabButtons = modal.querySelectorAll('.tab-btn');
        const panels = modal.querySelectorAll('.unified-modal-panel');
        
        tabButtons.forEach(btn => {
            btn.onclick = () => {
                const targetTab = btn.dataset.tab;
                
                // Désactiver tous les tabs et panels
                tabButtons.forEach(b => b.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                
                // Activer le tab et panel sélectionnés
                btn.classList.add('active');
                const targetPanel = modal.querySelector(`[data-panel="${targetTab}"]`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            };
        });
    }

    /**
     * Configure les gestionnaires de formulaires
     */
    static setupFormHandlers(modal) {
        const forms = modal.querySelectorAll('form');
        forms.forEach(form => {
            if (!form.onsubmit) {
                form.onsubmit = this.handleContactSubmit;
            }
        });
    }

    /**
     * Génère un contenu d'erreur
     */
    static generateErrorContent(type) {
        return `
            <div class="unified-modal-content error-content">
                <div class="error-message">
                    <h3>Erreur</h3>
                    <p>Template non trouvé pour le type: ${type}</p>
                </div>
            </div>
        `;
    }

    // ================================
    // HANDLERS D'ACTIONS
    // ================================

    static copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard:', text);
            // TODO: Afficher une notification de succès
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    }

    static openDiscordApp() {
        window.open('discord://', '_blank');
    }

    static handleAction(actionType, url, title) {
        console.log('Action:', actionType, url, title);
        
        switch(actionType) {
            case 'download':
                if (url) window.open(url, '_blank');
                break;
            case 'github':
                if (url) window.open(url, '_blank');
                break;
            case 'docs':
                if (url) window.open(url, '_blank');
                break;
            case 'video':
                if (url) window.open(url, '_blank');
                break;
            default:
                console.log('Unhandled action:', actionType);
        }
    }

    static handleContactSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        
        console.log('Contact form submitted:', data);
        
        // TODO: Implémenter l'envoi réel du formulaire
        alert('Message envoyé ! (TODO: implémenter l\'envoi réel)');
    }

    static viewProject(slug) {
        window.location.href = `/projects/${slug}`;
    }

    static viewExperience(slug) {
        window.location.href = `/experiences/${slug}`;
    }
}

// ================================
// PUBLIC API - GLOBAL FUNCTIONS
// ================================

/**
 * Global function to create a unified modal
 * Maintains compatibility with the old system
 */
window.createUnifiedModal = function(config) {
    return UnifiedModal.create(config);
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UnifiedModal, MODAL_TEMPLATES, CONTENT_TEMPLATES };
}