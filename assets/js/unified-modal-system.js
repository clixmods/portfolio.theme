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
        // Base template now relies on SCSS for all visuals.
        // Keep JS free of inline presentation to avoid overrides.
    },
    widths: {
        contact: '800px',
        person: '700px',
        skill: '750px',
        actions: '600px',
        discord: '500px',
        cv: '580px',
        projectWidget: '1154px', // Largeur par défaut pour tous les widgets de projet
        // Largeurs spécifiques par type de widget (ajustez selon vos besoins) :
        'projectWidget-youtube': '1154px',     // Widget YouTube videos - grille 3x3
        'projectWidget-contributors': '860px', // Widget contributeurs
        'projectWidget-gallery': '860px',     // Widget galerie
        'projectWidget-specs': '860px',       // Widget spécifications techniques
        'projectWidget-awards': '860px',      // Widget récompenses
        'projectWidget-testimonials': '960px', // Widget témoignages
        'projectWidget-tools': '860px',       // Widget outils
        'projectWidget-specialties': '860px', // Widget spécialités
        'projectWidget-clients': '900px',     // Widget clients
        'projectWidget-grade': '700px',       // Widget note académique
        'projectWidget-downloads': '850px',   // Widget téléchargements
        'projectWidget-ranking': '800px',     // Widget classement
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
                <button class="btn-action" onclick="UnifiedModal.copyToClipboard('${config.content.discordId}', this)" aria-live="polite">
                    ${UnifiedModal.getCopyIcon(18)} Copier
                </button>
            </div>
            <p class="note">Tu peux m'ajouter sur Discord ou m'envoyer un message !</p>
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
    `,

    cv: (config) => `
        <div class="unified-modal-simple-content cv-content">
            <p>Choisissez la version à télécharger :</p>
            <div class="cv-options">
                <button class="btn-action cv-option" onclick="UnifiedModal.downloadFile('/cv/clement-garcia-cv-couleur.pdf','Clément_GARCIA_CV_Couleur.pdf')">
                    <div class="cv-icon">${getDocumentIcon(32)}</div>
                    <div class="cv-text">
                        <div class="cv-title">Version couleur</div>
                        <div class="cv-desc">PDF avec design complet et couleurs</div>
                        <span class="badge">Recommandée écran</span>
                    </div>
                </button>
                <button class="btn-action cv-option" onclick="UnifiedModal.downloadFile('/cv/clement-garcia-cv-impression.pdf','Clément_GARCIA_CV_Impression.pdf')">
                    <div class="cv-icon">${getPrinterIcon(32)}</div>
                    <div class="cv-text">
                        <div class="cv-title">Version imprimable</div>
                        <div class="cv-desc">PDF noir et blanc, optimisé pour l'impression</div>
                        <span class="badge">Économise l'encre</span>
                    </div>
                </button>
            </div>
        </div>
    `,

    // New dynamic template for project widgets opened fullscreen
    projectWidget: (config) => `
        <div class="unified-modal-project-widget-wrapper" data-original-widget-id="${config.content?.widgetId || ''}">
            ${config.content?.html || '<div class="project-widget-error">Aucun contenu disponible pour ce widget.</div>'}
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

// Simple inline SVGs for CV options (stroke icons using currentColor)
function getDocumentIcon(size = 24) {
    return `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <path d="M14 2v6h6"/>
            <path d="M12 11v6"/>
            <path d="M9 14l3 3 3-3"/>
        </svg>
    `;
}

function getPrinterIcon(size = 24) {
    return `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M6 9V2h12v7"/>
            <rect x="6" y="13" width="12" height="8" rx="2"/>
            <path d="M6 17h12"/>
            <path d="M6 13h12"/>
            <path d="M6 9h12a4 4 0 0 1 4 4v4h-4"/>
        </svg>
    `;
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
    return contacts.map(contact => {
        const iconMarkup = (typeof contact.icon === 'string' && contact.icon.startsWith('/'))
            ? `<img src="${contact.icon}" alt="" width="20" height="20" style="object-fit:contain" />`
            : `${contact.icon}`;
        return `
        <div class="contact-item">
            <div class="contact-icon">${iconMarkup}</div>
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
    `}).join('');
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
    static liveRegion = null;
    static previousActiveElement = null;

    /**
     * Crée et affiche un modal unifié
     */
    static create(config) {
        const modal = this.getOrCreateModalElement();
        const content = this.generateModalContent(config);
        
        modal.innerHTML = content;
        // Ensure an ARIA live region exists inside the modal for screen reader announcements
        this.ensureLiveRegion(modal);
        // Remember trigger element for focus restoration
        this.previousActiveElement = document.activeElement;
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
            document.body.appendChild(modal);
        }
        // Accessibility semantics
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        return modal;
    }

    /**
     * Génère le contenu du modal
     */
    static generateModalContent(config) {
        const width = config.desiredWidth || MODAL_TEMPLATES.widths[config.type] || MODAL_TEMPLATES.widths.default;
        const contentTemplate = CONTENT_TEMPLATES[config.type];
        
        if (!contentTemplate) {
            console.warn(`No template found for modal type: ${config.type}`);
            return this.generateErrorContent(config.type);
        }

        const contentClass = `unified-modal-content unified-modal-content--${config.type}`;
        // Avoid inline sizing only for contact (managed by SCSS); all others including projectWidget get explicit width
        const styleAttr = (config.type === 'contact') ? '' : ` style="width: ${width};"`;
        return `
            <div class="${contentClass}"${styleAttr}>
                ${this.generateModalHeader(config)}
                ${this.generateModalBody(config, contentTemplate)}
            </div>
        `;
    }

    /**
     * Génère le header du modal
     */
    static generateModalHeader(config) {
        return `
            <div class="unified-modal-header">
                <button class="unified-modal-close" aria-label="Fermer">&times;</button>
                ${this.generateContentHeader(config)}
            </div>
        `;
    }

    /**
     * Génère le body du modal
     */
    static generateModalBody(config, contentTemplate) {
        return `
            <div class="unified-modal-body">
                ${contentTemplate(config)}
            </div>
        `;
    }

    /**
     * Génère le header du contenu
     */
    static generateContentHeader(config) {
        const hasRightContent = config.headerRight;
        
        // For Discord type, mimic demo's inline SVG color (#5865f2)
        let iconMarkup;
        if (config.rawIcon) {
            iconMarkup = config.rawIcon; // direct markup provided
        } else if (config.type === 'discord') {
            iconMarkup = `<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style="color: #5865f2;"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/></svg>`;
        } else if (config.type === 'cv') {
            iconMarkup = getDocumentIcon(48);
        } else {
            iconMarkup = generateIcon(config.icon || '', config.title, config.iconSize || 48);
        }

        return `
            <div class="unified-modal-content-header">
                <div class="unified-modal-content-header-left">
                    <div class="unified-modal-icon-large">
                        ${iconMarkup}
                    </div>
                    <div class="unified-modal-title-block">
                        <h2 id="unified-modal-title">${config.title}</h2>
                        <div class="unified-modal-chips">
                            ${generateChips(config.chips)}
                        </div>
                    </div>
                </div>
                ${hasRightContent ? `<div class=\"unified-modal-content-header-right\">${config.headerRight}</div>` : ''}
            </div>
        `;
    }

    /**
     * Open a project widget inside a unified fullscreen modal.
     * Clones the widget HTML, adapts classes, and provides a close control.
     */
    static openProjectWidget(widgetElem) {
        if (!widgetElem) return;
        const widgetId = widgetElem.getAttribute('id') || '';
        const widgetClasses = widgetElem.className;

        // Simple icon inference by class keywords
        const iconMap = [
            { key: 'contributors', icon: '👥' },
            { key: 'development-time', icon: '⏱️' },
            { key: 'gallery', icon: '🖼️' },
            { key: 'technical-specs', key2: 'technical', icon: '🛠️' },
            { key: 'awards', icon: '🏆' },
            { key: 'testimonials', icon: '💬' },
            { key: 'youtube', icon: '▶️' },
            { key: 'specialties', icon: '🧩' },
            { key: 'tools', icon: '🔧' },
            { key: 'clients-box', key2: 'clients', icon: '🏢' },
            { key: 'grade-box', key2: 'grade', icon: '📊' },
            { key: 'downloads-box', key2: 'downloads', icon: '⬇️' },
            { key: 'ranking-box', key2: 'ranking', icon: '🏅' }
        ];
        let inferredIcon = '';
        for (const entry of iconMap) {
            if (widgetClasses.includes(entry.key) || (entry.key2 && widgetClasses.includes(entry.key2))) {
                inferredIcon = entry.icon;
                break;
            }
        }

    // Fullscreen removed per new requirement; we keep all modals centered.

    // Clone widget, but we'll strip its header to avoid duplication in modal
    const clone = widgetElem.cloneNode(true);
        // Remove any expanded state to rely on modal scrolling layout
        clone.classList.remove('expanded');
        clone.classList.add('project-widget-modal-view');

        // Remove inline onclick toggles inside cloned version to avoid nested toggles
        const headers = clone.querySelectorAll('.project-widget-header');
        let extractedHeaderIconMarkup = '';
        if (headers.length) {
            // Take full outerHTML so original classes (color/background) remain
            const iconEl = headers[0].querySelector('.project-widget-icon');
            if (iconEl) {
                // Add an accessibility marker
                iconEl.setAttribute('aria-hidden', 'true');
                extractedHeaderIconMarkup = iconEl.outerHTML.trim();
            }
            headers.forEach(h => h.remove()); // remove headers inside content clone
        }

        // Remove gallery preview elements that shouldn't appear in modal
        const galleryPreviews = clone.querySelectorAll('.project-widget-gallery-preview, .gallery-preview');
        galleryPreviews.forEach(preview => preview.remove());

        // Ensure content is visible in modal
        const content = clone.querySelector('.project-widget-content');
        if (content) {
            content.style.display = 'block';
        }

        const html = clone.innerHTML;
        
        // Détection du type de widget pour la largeur spécifique
        let widgetType = 'projectWidget'; // default
        if (widgetClasses.includes('youtube')) {
            widgetType = 'projectWidget-youtube';
        } else if (widgetClasses.includes('contributors')) {
            widgetType = 'projectWidget-contributors';
        } else if (widgetClasses.includes('gallery')) {
            widgetType = 'projectWidget-gallery';
        } else if (widgetClasses.includes('technical-specs') || widgetClasses.includes('technical')) {
            widgetType = 'projectWidget-specs';
        } else if (widgetClasses.includes('awards')) {
            widgetType = 'projectWidget-awards';
        } else if (widgetClasses.includes('testimonials')) {
            widgetType = 'projectWidget-testimonials';
        } else if (widgetClasses.includes('tools')) {
            widgetType = 'projectWidget-tools';
        } else if (widgetClasses.includes('specialties')) {
            widgetType = 'projectWidget-specialties';
        } else if (widgetClasses.includes('clients-box') || widgetClasses.includes('clients')) {
            widgetType = 'projectWidget-clients';
        } else if (widgetClasses.includes('grade-box') || widgetClasses.includes('grade')) {
            widgetType = 'projectWidget-grade';
        } else if (widgetClasses.includes('downloads-box') || widgetClasses.includes('downloads')) {
            widgetType = 'projectWidget-downloads';
        } else if (widgetClasses.includes('ranking-box') || widgetClasses.includes('ranking')) {
            widgetType = 'projectWidget-ranking';
        }
        
        // Utiliser la largeur spécifique au type de widget ou la largeur par défaut
        const desiredWidth = MODAL_TEMPLATES.widths[widgetType] || MODAL_TEMPLATES.widths.projectWidget;

        // Vérifier s'il y a un titre de modal spécifique défini
        const modalTitle = widgetElem.getAttribute('data-modal-title') || 
                          widgetElem.querySelector('.project-widget-title')?.textContent?.trim() || 
                          'Widget';

        this.create({
            type: 'projectWidget',
            // Title kept for accessibility (aria-labelledby) but not visually repeated
            title: modalTitle,
            icon: inferredIcon,
            rawIcon: extractedHeaderIconMarkup || null,
            chips: [],
            desiredWidth,
            content: {
                html: `<div class=\"project-widget-modal-container\">${html}</div>`,
                widgetId: widgetId
            }
        });

        // Add a marker class to modal content for styling
        const modalRoot = document.getElementById('unifiedModal');
        if (modalRoot) {
            modalRoot.classList.add('unified-modal--projectWidget');
            modalRoot.classList.remove('unified-modal--projectWidget-full');
        }
        const modalContent = document.querySelector('#unifiedModal .unified-modal-content');
        if (modalContent) {
            modalContent.classList.add('unified-modal-content--projectWidget');
            modalContent.classList.remove('unified-modal-content--projectWidget-full');
            // Attach person link handlers for dynamically cloned contributor items
            try {
                const personElems = modalContent.querySelectorAll('[data-person-id]');
                personElems.forEach(el => {
                    // Avoid double binding
                    if (el.getAttribute('data-person-handler') === '1') return;
                    el.setAttribute('data-person-handler', '1');
                    el.style.cursor = 'pointer';
                    el.addEventListener('click', (e) => {
                        e.preventDefault();
                        const id = el.getAttribute('data-person-id');
                        if (id && typeof window.openPersonModal === 'function') {
                            window.openPersonModal(id);
                        }
                    });
                    el.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            el.click();
                        }
                    });
                    if (!el.hasAttribute('tabindex')) {
                        el.setAttribute('tabindex', '0');
                        el.setAttribute('role', 'button');
                        el.setAttribute('aria-label', 'Ouvrir le profil');
                    }
                });
            } catch(err) { /* silent */ }
        }
    }

    /**
     * Affiche le modal
     */
    static showModal(modal, config) {
        // Prepare and show with CSS-driven animation
    modal.classList.remove('fade-exit', 'fade-exit-active');
    modal.style.display = 'flex';
        modal.offsetHeight; // force reflow
        modal.classList.add('fade-enter');
        requestAnimationFrame(() => {
            modal.classList.add('fade-enter-active');
        });
        
        document.body.style.overflow = 'hidden';
        // Tie label for a11y
        modal.setAttribute('aria-labelledby', 'unified-modal-title');
        
        // Gestion de la touche Escape
        document.addEventListener('keydown', this.handleKeyDown);
        // Focus management
        this.enableFocusTrap(modal);
        this.focusFirstElement(modal);
    }

    /**
     * Cache le modal
     */
    static hideModal(modal = null) {
        const targetModal = modal || this.currentModal;
        if (!targetModal) return;

        // Animation de sortie via classes
        targetModal.classList.remove('fade-enter', 'fade-enter-active');
        targetModal.classList.add('fade-exit');
        targetModal.offsetHeight; // reflow
        targetModal.classList.add('fade-exit-active');
        
        setTimeout(() => {
            targetModal.style.display = 'none';
            // Only restore body scroll if no other overlay modal is still visible
            try {
                const ids = ['unifiedModal','skillModal','personModal'];
                const anyOpen = ids.some(id => {
                    if (id === 'unifiedModal' && targetModal.id !== 'unifiedModal') return true; // skip current only
                    const el = document.getElementById(id);
                    if (!el) return false;
                    const display = (el.style && el.style.display) ? el.style.display : window.getComputedStyle(el).display;
                    return display && display !== 'none' && el !== targetModal;
                });
                document.body.style.overflow = anyOpen ? 'hidden' : 'auto';
            } catch(e) {
                document.body.style.overflow = 'auto';
            }
            targetModal.classList.remove('fade-exit', 'fade-exit-active');
        }, 300);
        
        document.removeEventListener('keydown', this.handleKeyDown);
        this.disableFocusTrap(targetModal);
        // Restore focus to the trigger element
        if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
            try { this.previousActiveElement.focus(); } catch (e) {}
        }
        this.previousActiveElement = null;
        this.currentModal = null;
        this.liveRegion = null;
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

    // Intercept any /cv or .cv-choice-trigger click to open unified CV modal
    static setupGlobalCVInterceptor() {
        if (this._cvInterceptorAttached) return;
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="/cv"], .cv-choice-trigger');
            if (!link) return;
            // Allow normal navigation on the dedicated CV page (if it's already inside /cv/ page)
            // But here we always open modal to choose version per original behavior
            e.preventDefault();
            UnifiedModal.create({ type: 'cv', title: 'Télécharger mon CV', icon: '/images/social/website.svg' });
        });
        this._cvInterceptorAttached = true;
    }

    // ================================
    // FOCUS MANAGEMENT (Trap within modal)
    // ================================
    static focusableSelectors = [
        'a[href]','area[href]','input:not([disabled])','select:not([disabled])','textarea:not([disabled])',
        'button:not([disabled])','iframe','object','embed','[tabindex]:not([tabindex="-1"])','[contenteditable]'
    ].join(',');

    static getFocusableElements(modal) {
        return Array.from(modal.querySelectorAll(this.focusableSelectors))
            .filter(el => (el.offsetParent !== null) || el === modal);
    }

    static focusFirstElement(modal) {
        const focusables = this.getFocusableElements(modal);
        if (focusables.length) {
            focusables[0].focus();
        } else {
            modal.setAttribute('tabindex', '-1');
            modal.focus();
        }
    }

    static focusTrapHandler = (e) => {
        if (e.key !== 'Tab') return;
        const modal = this.currentModal;
        if (!modal) return;
        const focusables = this.getFocusableElements(modal);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    static enableFocusTrap(modal) {
        modal.addEventListener('keydown', this.focusTrapHandler);
    }

    static disableFocusTrap(modal) {
        modal.removeEventListener('keydown', this.focusTrapHandler);
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

    static copyToClipboard(text, triggerEl = null) {
        // Prefer modern API with fallback for broader compatibility
        const doSuccessFeedback = () => {
            // Visual feedback on the button (if provided)
            if (triggerEl) {
                if (triggerEl.classList.contains('copied')) return; // Debounce multiple clicks
                const originalHTML = triggerEl.innerHTML;
                triggerEl.dataset.originalHtml = originalHTML;
                triggerEl.classList.add('copied');
                triggerEl.innerHTML = UnifiedModal.getCheckIcon(18) + ' Copié !';
                triggerEl.setAttribute('aria-label', 'Copié dans le presse-papiers');
                // Revert after a short delay
                setTimeout(() => {
                    triggerEl.classList.remove('copied');
                    triggerEl.innerHTML = triggerEl.dataset.originalHtml || originalHTML;
                }, 1800);
            }
            // Screen reader announcement
            this.announce('Copié dans le presse-papiers');
        };

        const doErrorFeedback = (err) => {
            console.error('Failed to copy:', err);
            if (triggerEl) {
                const originalHTML = triggerEl.innerHTML;
                triggerEl.dataset.originalHtml = originalHTML;
                triggerEl.classList.add('copy-error');
                triggerEl.innerHTML = UnifiedModal.getWarningIcon(18) + ' Échec';
                triggerEl.setAttribute('aria-label', 'Échec de la copie');
                setTimeout(() => {
                    triggerEl.classList.remove('copy-error');
                    triggerEl.innerHTML = triggerEl.dataset.originalHtml || originalHTML;
                }, 1800);
            }
            this.announce('Échec de la copie');
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(doSuccessFeedback).catch((err) => {
                // Try fallback on error
                try {
                    this.fallbackCopy(text) ? doSuccessFeedback() : doErrorFeedback(err);
                } catch (e) {
                    doErrorFeedback(e);
                }
            });
        } else {
            try {
                this.fallbackCopy(text) ? doSuccessFeedback() : doErrorFeedback(new Error('Unsupported copy API'));
            } catch (e) {
                doErrorFeedback(e);
            }
        }
    }

    // Fallback using a temporary textarea
    static fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : null;
        ta.select();
        let success = false;
        try {
            success = document.execCommand('copy');
        } catch (e) {
            success = false;
        }
        document.body.removeChild(ta);
        if (selected) {
            const sel = document.getSelection();
            sel.removeAllRanges();
            sel.addRange(selected);
        }
        return success;
    }

    // Ensure a single live region exists inside the current modal
    static ensureLiveRegion(modal) {
        if (this.liveRegion && this.liveRegion.isConnected) return;
        const region = document.createElement('div');
        region.id = 'unified-modal-live-region';
        region.setAttribute('role', 'status');
        region.setAttribute('aria-live', 'polite');
        region.setAttribute('aria-atomic', 'true');
        region.style.position = 'absolute';
        region.style.width = '1px';
        region.style.height = '1px';
        region.style.margin = '-1px';
        region.style.border = '0';
        region.style.padding = '0';
        region.style.overflow = 'hidden';
        region.style.clip = 'rect(0 0 0 0)';
        modal.appendChild(region);
        this.liveRegion = region;
    }

    static announce(message) {
        const modal = this.currentModal || document.getElementById('unifiedModal');
        if (!modal) return;
        this.ensureLiveRegion(modal);
        // Clear then set to force announcement
        this.liveRegion.textContent = '';
        setTimeout(() => {
            this.liveRegion.textContent = message;
        }, 10);
    }

    // ================================
    // SVG ICON HELPERS (stroke icons using currentColor)
    // ================================
    static getCopyIcon(size = 16) {
        return `
            <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="11" height="11" rx="2" ry="2"></rect>
                <rect x="4" y="4" width="11" height="11" rx="2" ry="2"></rect>
            </svg>
        `;
    }

    static getCheckIcon(size = 16) {
        return `
            <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 13l4 4L19 7"></path>
            </svg>
        `;
    }

    static getWarningIcon(size = 16) {
        return `
            <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 3l9 16H3L12 3z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <circle cx="12" cy="17" r="1"></circle>
            </svg>
        `;
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

    // Robust download with fetch->blob and fallback
    static downloadFile(url, fileName) {
        try {
            fetch(url).then(resp => {
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                return resp.blob();
            }).then(blob => {
                if (!blob || blob.size === 0) throw new Error('Empty file');
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = fileName || '';
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
            }).catch(() => {
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName || '';
                a.target = '_blank';
                document.body.appendChild(a);
                a.click();
                a.remove();
            });
        } catch (err) {
            console.error('Download error', err);
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

// Also expose the class itself for advanced usage (toggleInfoBox relies on window.UnifiedModal.openProjectWidget)
if (typeof window !== 'undefined') {
    window.UnifiedModal = UnifiedModal;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UnifiedModal, MODAL_TEMPLATES, CONTENT_TEMPLATES };
}

// Initialize global CV interceptor after DOM ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => UnifiedModal.setupGlobalCVInterceptor());
    } else {
        UnifiedModal.setupGlobalCVInterceptor();
    }
}

// Basic HTML escape to avoid injecting unsafe text into enhanced contributors layout
function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');
}

function avatarHTMLSafe(initial) {
    return `<span>${escapeHtml(initial)}</span>`;
}