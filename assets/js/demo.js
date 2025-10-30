// ============================================================================
// DEMO PAGE JAVASCRIPT
// ============================================================================
// Scripts specific to demo.html page for interactions and functionalities

/**
 * Demo page initialization
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 Demo Page - Initialisation des fonctionnalités...');
    
    // Initialization of different systems
    initDemoTabs();
    initExperienceTabs();
    initEducationTabs();
    initBlogTabs();
    initUnifiedModalTabs();
    initDemoActionButtons();
    initModalCloseButtons();
    initDiscordCopyFeature();
    
    console.log('✅ Demo Page - Toutes les fonctionnalités initialisées');
});

// ============================================================================
// MAIN TABS SYSTEM (PROJECTS)
// ============================================================================

/**
 * Initialize the main tabs system with subtabs
 */
function initDemoTabs() {
    const demoTabs = document.querySelectorAll('.demo-tabs .tab-btn');
    const demoGamesSubtabs = document.getElementById('demo-games-subtabs');
    const demoAppswebSubtabs = document.getElementById('demo-appsweb-subtabs');
    const demoSubtabBtns = document.querySelectorAll('.sub-tabs .sub-tab-btn');
    const projectsDemoText = document.getElementById('projects-demo-text');
    
    // Main tabs handler
    demoTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.demoCategory;
            
            // Update buttons
            demoTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            
            // Subtabs management
            showDemoSubtabs(category);
            
            // Update demonstration text
            updateDemoText(category);
        });
    });
    
    // Subtabs handler
    demoSubtabBtns.forEach(subtab => {
        subtab.addEventListener('click', () => {
            const subcategory = subtab.dataset.demoSubcategory;
            
            // Determine parent category
            let parentCategory = 'all';
            if (subcategory.startsWith('games-')) {
                parentCategory = 'games';
            } else if (subcategory.startsWith('appsweb-')) {
                parentCategory = 'appsweb';
            }
            
            // Update subtabs of the same category
            const parentContainer = subtab.closest('.sub-tabs');
            const siblings = parentContainer.querySelectorAll('.sub-tab-btn');
            siblings.forEach(s => s.classList.remove('active'));
            subtab.classList.add('active');
            
            // Update text
            updateDemoText(parentCategory, subcategory);
        });
    });
    
    /**
     * Displays appropriate subtabs according to category
     */
    function showDemoSubtabs(category) {
        const demoTabsContainer = document.querySelector('.demo-tabs');
        
        // Hide all subtabs
        [demoGamesSubtabs, demoAppswebSubtabs].forEach(container => {
            if (container) container.style.display = 'none';
        });
        
        // Remove integration class
        if (demoTabsContainer) {
            demoTabsContainer.classList.remove('has-subtabs');
        }
        
        // Display appropriate subtabs
        if (category === 'games' && demoGamesSubtabs) {
            demoGamesSubtabs.style.display = 'flex';
            if (demoTabsContainer) demoTabsContainer.classList.add('has-subtabs');
            
            // Reset to "All"
            const allBtn = demoGamesSubtabs.querySelector('[data-demo-subcategory="games-all"]');
            demoGamesSubtabs.querySelectorAll('.sub-tab-btn').forEach(btn => btn.classList.remove('active'));
            if (allBtn) allBtn.classList.add('active');
            
        } else if (category === 'appsweb' && demoAppswebSubtabs) {
            demoAppswebSubtabs.style.display = 'flex';
            if (demoTabsContainer) demoTabsContainer.classList.add('has-subtabs');
            
            // Reset to "All"
            const allBtn = demoAppswebSubtabs.querySelector('[data-demo-subcategory="appsweb-all"]');
            demoAppswebSubtabs.querySelectorAll('.sub-tab-btn').forEach(btn => btn.classList.remove('active'));
            if (allBtn) allBtn.classList.add('active');
        }
    }
    
    /**
     * Updates the demo text according to the selection
     */
    function updateDemoText(category, subcategory = null) {
        const icons = {
            'all': '📦', 
            'games': '🎮', 
            'appsweb': '🌐', 
            'mods': '🧩', 
            'tools': '🛠️'
        };
        
        const subIcons = {
            'games-all': '📦', 
            'games-professionnel': '💼', 
            'games-personnel': '🎯', 
            'games-gamejams': '⚡',
            'appsweb-all': '📦', 
            'appsweb-professionnel': '🏢', 
            'appsweb-etude': '🎓'
        };
        
        let text = '';
        if (subcategory && subcategory !== category + '-all') {
            const subName = subcategory.replace('games-', '').replace('appsweb-', '');
            text = `${subIcons[subcategory]} Filtrage par ${subName} dans ${category}`;
        } else {
            text = `${icons[category]} Affichage de ${category === 'all' ? 'tous les projets' : category}`;
        }
        
        if (projectsDemoText) projectsDemoText.textContent = text;
    }

    // Initialization
    updateDemoText('all');
}

// ============================================================================
// EXPERIENCE TABS
// ============================================================================

/**
 * Initialize experience section tabs
 */
function initExperienceTabs() {
    const expTabs = document.querySelectorAll('.experience-tabs .tab-btn');
    const expPanels = document.querySelectorAll('[data-tab]');
    
    expTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            // Update buttons
            expTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update panels (only those in the experience section)
            const expSection = tab.closest('.demo-section');
            const panels = expSection.querySelectorAll('.demo-tab-panel[data-tab]');
            panels.forEach(panel => {
                panel.classList.toggle('active', panel.dataset.tab === tabName);
            });
        });
    });
}

// ============================================================================
// EDUCATION TABS
// ============================================================================

/**
 * Initialize education section tabs
 */
function initEducationTabs() {
    const eduTabs = document.querySelectorAll('.education-tabs .tab-btn');
    eduTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            eduTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}

// ============================================================================
// BLOG TABS
// ============================================================================

/**
 * Initialize blog section tabs
 */
function initBlogTabs() {
    const blogTabs = document.querySelectorAll('.blog-tabs .tab-btn');
    blogTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            blogTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}

// ============================================================================
// UNIFIED DEMO MODALS
// ============================================================================

/**
 * Initialize unified modal tabs
 */
function initUnifiedModalTabs() {
    const unifiedModalContainers = document.querySelectorAll('.unified-modal-demo');
    
    unifiedModalContainers.forEach(modalContainer => {
        const tabs = modalContainer.querySelectorAll('.unified-modal-tabs .tab-btn');
        
        // Only if this modal has tabs
        if (tabs.length > 0) {
            tabs.forEach(tab => {
                tab.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetTab = this.dataset.tab;
                    
                    // Deactivate all tabs of this modal only
                    tabs.forEach(t => {
                        t.classList.remove('active');
                        t.setAttribute('aria-selected', 'false');
                    });
                    
                    // Hide all panels of this modal
                    modalContainer.querySelectorAll('.unified-modal-panel').forEach(p => {
                        p.classList.remove('active');
                    });
                    
                    // Activate the clicked tab
                    this.classList.add('active');
                    this.setAttribute('aria-selected', 'true');
                    
                    // Display the corresponding panel
                    const targetPanel = modalContainer.querySelector(`[data-panel="${targetTab}"]`);
                    if (targetPanel) {
                        targetPanel.classList.add('active');
                    }
                });
            });
        }
    });
}

// ============================================================================
// DEMO ACTION BUTTONS
// ============================================================================

/**
 * Initialize action button handlers (prevents real actions)
 */
function initDemoActionButtons() {
    const demoActionButtons = document.querySelectorAll('.unified-modal-demo .btn-action');
    demoActionButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.textContent.trim();
            
            // Visual feedback animation
            this.style.transform = 'scale(0.95)';
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.style.transform = '';
                this.style.opacity = '';
            }, 150);
            
            // Log to show the action
            console.log(`Démo - Action: ${action}`);
            
            // Optional visual notification
            showDemoNotification(`Action simulée: ${action}`);
        });
    });
}

// ============================================================================
// MODAL CLOSE BUTTONS
// ============================================================================

/**
 * Initialize close button handlers
 */
function initModalCloseButtons() {
    const closeButtons = document.querySelectorAll('.unified-modal-demo .unified-modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Démo - Modal fermé');
            
            // Visual feedback animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            showDemoNotification('Modal fermé (démonstration)');
        });
    });
}

// ============================================================================
// DISCORD COPY FUNCTIONALITY
// ============================================================================

/**
 * Initialize Discord ID copy functionality
 */
function initDiscordCopyFeature() {
    const copyDiscordBtn = document.querySelector('.unified-modal-demo .discord-id-display .btn-action');
    if (copyDiscordBtn) {
        copyDiscordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const discordId = this.parentElement.querySelector('.discord-id').textContent;
            
            // Attempt real copy
            if (navigator.clipboard) {
                navigator.clipboard.writeText(discordId).then(() => {
                    showCopySuccess(this);
                }).catch(() => {
                    showCopyFallback(this, discordId);
                });
            } else {
                showCopyFallback(this, discordId);
            }
        });
    }
}

/**
 * Display copy success
 */
function showCopySuccess(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="icon">✅</span> Copié !';
    setTimeout(() => {
        button.innerHTML = originalText;
    }, 2000);
}

/**
 * Display fallback copy (simulation)
 */
function showCopyFallback(button, discordId) {
    console.log(`Discord ID copié (simulation): ${discordId}`);
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="icon">✅</span> Copié !';
    setTimeout(() => {
        button.innerHTML = originalText;
    }, 2000);
}

// ============================================================================
// NOTIFICATION UTILITIES
// ============================================================================

/**
 * Display a temporary notification for demonstrations
 */
function showDemoNotification(message, duration = 3000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'demo-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--demo-glass-bg, rgba(255, 255, 255, 0.1));
        color: var(--demo-text-primary, white);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        border: 1px solid var(--demo-glass-border, rgba(255, 255, 255, 0.2));
        backdrop-filter: blur(10px);
        z-index: 10000;
        font-size: 0.9rem;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Entry animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Exit animation and removal
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// ============================================================================
// DEBUG UTILITIES
// ============================================================================

/**
 * Debug function to display demo information
 */
function debugDemo() {
    console.group('🎨 Demo Page - Informations de débogage');
    console.log('Onglets principaux:', document.querySelectorAll('.demo-tabs .tab-btn').length);
    console.log('Sous-onglets:', document.querySelectorAll('.sub-tabs .sub-tab-btn').length);
    console.log('Modals unifiés:', document.querySelectorAll('.unified-modal-demo').length);
    console.log('Boutons d\'action demo:', document.querySelectorAll('.unified-modal-demo .btn-action').length);
    console.groupEnd();
}

// Exposer la fonction de débogage globalement pour les développeurs
window.debugDemo = debugDemo;

// ============================================================================
// MODAL TEST FUNCTIONS
// ============================================================================

/**
 * Test opening the skill modal
 */
function openTestSkillModal() {
    if (typeof openSkillModal === 'function') {
        openSkillModal('C#', '/images/technologies/CSharp.svg', '', '4', 'svg');
    } else {
        showDemoNotification('Skill Modal fonction non disponible. Allez sur la page d\'accueil et cliquez sur C# dans les compétences.');
    }
}

/**
 * Test opening the contact modal
 */
function openTestContactModal() {
    if (typeof window.UnifiedModal !== 'undefined') {
        window.UnifiedModal.create({
            type: 'contact',
            title: 'Contactez-moi',
            icon: '📬',
            content: {
                contacts: [
                    { icon: '📧', title: 'Email', value: 'clement.g.developer@gmail.com', link: 'mailto:clement.g.developer@gmail.com' },
                    { icon: '/images/social/linkedin.svg', title: 'LinkedIn', value: 'linkedin.com/in/clixmods', link: 'https://linkedin.com/in/clixmods', external: true },
                    { icon: '📍', title: 'Localisation', value: 'Montpellier' }
                ]
            }
        });
    } else {
        showDemoNotification('Unified Modal non disponible.');
    }
}

/**
 * Test opening the person modal
 */
function openTestPersonModal() {
    if (typeof openPersonModal === 'function') {
        // Utiliser le profil principal
        openPersonModal('clement-garcia');
    } else {
        showDemoNotification('Person Modal fonction non disponible. Visitez la section testimonials pour voir les modals de personnes.');
    }
}

/**
 * Test opening the Discord modal
 */
function openTestDiscordModal() {
    if (typeof window.UnifiedModal !== 'undefined') {
        window.UnifiedModal.create({
            type: 'discord',
            title: 'Mon Discord',
            icon: '/images/social/discord.svg',
            content: { discordId: 'clixmods' }
        });
    }
}

/**
 * Test opening the actions popup
 */
function openTestActionsPopup() {
    // Look for a "..." button in the page or create a test popup
    const moreButton = document.querySelector('.btn-more, .more-actions-btn');
    if (moreButton) {
        moreButton.click();
    } else {
        showDemoNotification('Actions Popup: Allez sur une page de projet et cliquez sur le bouton "..." pour voir le popup d\'actions.');
    }
}

// Exposer les fonctions de test globalement
window.openTestSkillModal = openTestSkillModal;
window.openTestContactModal = openTestContactModal;
window.openTestPersonModal = openTestPersonModal;
window.openTestDiscordModal = openTestDiscordModal;
window.openTestActionsPopup = openTestActionsPopup;