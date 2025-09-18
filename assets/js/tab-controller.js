/**
 * TabController - Reusable class for managing tab systems
 * 
 * Features:
 * - Active state management
 * - Content show/hide with multiple animation types
 * - Description updates
 * - Card animations for filtered content
 * - Keyboard navigation support
 * - Flexible content targeting
 * 
 * Usage:
 * const tabs = new TabController('.tab-btn', {
 *   contentSelector: '.tab-content',
 *   animationType: 'fade',
 *   updateDescription: true
 * });
 */

class TabController {
    constructor(tabSelector, options = {}) {
        // Default configuration
        this.config = {
            // Content management
            contentSelector: '.tab-content',      // Target content elements
            contentAttribute: 'data-category',    // Attribute to match tabs/content
            
            // Content visibility management
            useHiddenAttribute: false,            // Use hidden attribute instead of style.display
            contentMatchingStrategy: 'attribute', // 'attribute' or 'id-pattern'
            idPattern: null,                      // Pattern for ID-based matching (e.g., 'prefix{Category}')
            
            // Animation types: 'none', 'fade', 'slide', 'cards'
            animationType: 'none',
            animationDuration: 300,
            
            // Description updates
            updateDescription: false,
            descriptionSelector: null,
            descriptions: {},
            
            // Card animations (for 'cards' type)
            cardSelector: '.card',
            cardAnimationDelay: 90,
            
            // Accessibility
            enableKeyboardNav: true,
            
            // Callbacks
            onTabChange: null,
            onAnimationComplete: null,
            
            ...options
        };

        // DOM elements
        this.tabs = document.querySelectorAll(tabSelector);
        this.contentElements = this.config.contentSelector ? 
            document.querySelectorAll(this.config.contentSelector) : [];
        this.descriptionElement = this.config.descriptionSelector ? 
            document.querySelector(this.config.descriptionSelector) : null;

        // State
        this.currentTab = null;
        this.isAnimating = false;

        // Initialize
        if (this.tabs.length === 0) {
            console.warn(`TabController: No tabs found with selector "${tabSelector}"`);
            return;
        }

        this.init();
    }

    /**
     * Initialize the tab controller
     */
    init() {
        this.setupEventListeners();
        this.initializeActiveTab();
        this.setupAccessibility();
    }

    /**
     * Set up event listeners for tabs
     */
    setupEventListeners() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.handleTabClick(e));
            
            if (this.config.enableKeyboardNav) {
                tab.addEventListener('keydown', (e) => this.handleKeyDown(e));
            }
        });
    }

    /**
     * Handle tab click
     */
    handleTabClick(event) {
        if (this.isAnimating) return;
        
        const tab = event.currentTarget;
        const category = tab.getAttribute(this.config.contentAttribute);
        
        if (category) {
            this.switchToTab(tab, category);
        }
    }

    /**
     * Handle keyboard navigation
     */
    handleKeyDown(event) {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        
        event.preventDefault();
        const tabsArray = Array.from(this.tabs);
        const currentIndex = tabsArray.indexOf(event.currentTarget);
        
        let targetIndex;
        switch (event.key) {
            case 'ArrowLeft':
                targetIndex = currentIndex > 0 ? currentIndex - 1 : tabsArray.length - 1;
                break;
            case 'ArrowRight':
                targetIndex = currentIndex < tabsArray.length - 1 ? currentIndex + 1 : 0;
                break;
            case 'Home':
                targetIndex = 0;
                break;
            case 'End':
                targetIndex = tabsArray.length - 1;
                break;
        }
        
        if (targetIndex !== undefined) {
            tabsArray[targetIndex].focus();
            tabsArray[targetIndex].click();
        }
    }

    /**
     * Switch to a specific tab
     */
    switchToTab(tab, category) {
        if (this.currentTab === tab) return;
        
        // Update active states
        this.updateActiveStates(tab);
        
        // Update description if enabled
        if (this.config.updateDescription) {
            this.updateDescription(category);
        }
        
        // Handle content switching based on animation type
        this.switchContent(category);
        
        // Update current tab
        this.currentTab = tab;
        
        // Call callback if provided
        if (this.config.onTabChange) {
            this.config.onTabChange(category, tab);
        }
    }

    /**
     * Update active states of tabs
     */
    updateActiveStates(activeTab) {
        this.tabs.forEach(tab => {
            const isActive = tab === activeTab;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive.toString());
        });
    }

    /**
     * Update description text
     */
    updateDescription(category) {
        if (this.descriptionElement && this.config.descriptions[category]) {
            this.descriptionElement.textContent = this.config.descriptions[category];
        }
    }

    /**
     * Switch content based on animation type
     */
    switchContent(category) {
        switch (this.config.animationType) {
            case 'fade':
                this.switchContentFade(category);
                break;
            case 'slide':
                this.switchContentSlide(category);
                break;
            case 'cards':
                this.switchContentCards(category);
                break;
            default:
                this.switchContentSimple(category);
        }
    }

    /**
     * Simple show/hide content switching
     */
    switchContentSimple(category) {
        this.contentElements.forEach(element => {
            const shouldShow = this.shouldShowElement(element, category);
            this.setElementVisibility(element, shouldShow);
        });
    }

    /**
     * Determine if an element should be shown for the given category
     */
    shouldShowElement(element, category) {
        if (category === 'all') return true;
        
        if (this.config.contentMatchingStrategy === 'id-pattern' && this.config.idPattern) {
            const expectedId = this.config.idPattern.replace('{Category}', 
                category.charAt(0).toUpperCase() + category.slice(1));
            return element.id === expectedId;
        }
        
        const elementCategory = element.getAttribute(this.config.contentAttribute);
        return elementCategory === category;
    }

    /**
     * Set element visibility using the configured method
     */
    setElementVisibility(element, shouldShow) {
        if (this.config.useHiddenAttribute) {
            element.classList.toggle('active', shouldShow);
            if (shouldShow) {
                element.removeAttribute('hidden');
            } else {
                element.setAttribute('hidden', 'hidden');
            }
        } else {
            element.style.display = shouldShow ? 'block' : 'none';
        }
    }

    /**
     * Fade animation content switching
     */
    switchContentFade(category) {
        this.isAnimating = true;
        
        this.contentElements.forEach(element => {
            const shouldShow = this.shouldShowElement(element, category);
            
            if (shouldShow) {
                element.style.display = 'block';
                element.style.opacity = '0';
                element.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    element.style.transition = `opacity ${this.config.animationDuration}ms ease, transform ${this.config.animationDuration}ms ease`;
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 50);
            } else {
                element.style.transition = `opacity ${this.config.animationDuration}ms ease, transform ${this.config.animationDuration}ms ease`;
                element.style.opacity = '0';
                element.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    element.style.display = 'none';
                }, this.config.animationDuration);
            }
        });
        
        setTimeout(() => {
            this.isAnimating = false;
            if (this.config.onAnimationComplete) {
                this.config.onAnimationComplete(category);
            }
        }, this.config.animationDuration + 50);
    }

    /**
     * Slide animation content switching (like experiences timeline)
     */
    switchContentSlide(category) {
        this.isAnimating = true;
        
        // Hide all elements first
        this.contentElements.forEach(element => {
            const elementCategory = element.getAttribute(this.config.contentAttribute);
            if (elementCategory !== category) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    element.style.display = 'none';
                }, this.config.animationDuration);
            }
        });
        
        // Show target element
        setTimeout(() => {
            this.contentElements.forEach(element => {
                const elementCategory = element.getAttribute(this.config.contentAttribute);
                if (elementCategory === category) {
                    element.style.display = 'block';
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, 50);
                }
            });
            
            setTimeout(() => {
                this.isAnimating = false;
                if (this.config.onAnimationComplete) {
                    this.config.onAnimationComplete(category);
                }
            }, this.config.animationDuration);
        }, this.config.animationDuration);
    }

    /**
     * Card-based content switching with staggered animations
     */
    switchContentCards(category) {
        this.isAnimating = true;
        const cards = document.querySelectorAll(this.config.cardSelector);
        
        cards.forEach(card => {
            const cardCategory = card.getAttribute(this.config.contentAttribute);
            const shouldShow = cardCategory === category;
            
            if (shouldShow) {
                card.style.display = 'flex';
                card.classList.remove('hiding');
                card.classList.add('showing');
            } else {
                card.classList.remove('showing');
                card.classList.add('hiding');
                setTimeout(() => {
                    if (card.classList.contains('hiding')) {
                        card.style.display = 'none';
                    }
                }, 400);
            }
        });
        
        // Animate visible cards with stagger
        setTimeout(() => {
            const visibleCards = Array.from(cards).filter(card => 
                card.getAttribute(this.config.contentAttribute) === category && 
                getComputedStyle(card).display !== 'none'
            );
            
            visibleCards.forEach((card, index) => {
                card.classList.add('tile-ready');
                setTimeout(() => {
                    card.classList.add('tile-visible');
                }, index * this.config.cardAnimationDelay);
            });
            
            setTimeout(() => {
                this.isAnimating = false;
                if (this.config.onAnimationComplete) {
                    this.config.onAnimationComplete(category);
                }
            }, visibleCards.length * this.config.cardAnimationDelay + 200);
        }, 100);
    }

    /**
     * Initialize the first active tab
     */
    initializeActiveTab() {
        const activeTab = Array.from(this.tabs).find(tab => tab.classList.contains('active'));
        if (activeTab) {
            const category = activeTab.getAttribute(this.config.contentAttribute);
            if (category) {
                this.currentTab = activeTab;
                this.switchContent(category);
                
                if (this.config.updateDescription) {
                    this.updateDescription(category);
                }
            }
        }
    }

    /**
     * Setup accessibility attributes
     */
    setupAccessibility() {
        this.tabs.forEach((tab, index) => {
            tab.setAttribute('role', 'tab');
            tab.setAttribute('tabindex', index === 0 ? '0' : '-1');
            tab.setAttribute('aria-selected', tab.classList.contains('active').toString());
        });

        // Setup content elements
        this.contentElements.forEach(element => {
            element.setAttribute('role', 'tabpanel');
        });
    }

    /**
     * Public method to switch to a specific category
     */
    activateTab(category) {
        const targetTab = Array.from(this.tabs).find(tab => 
            tab.getAttribute(this.config.contentAttribute) === category
        );
        
        if (targetTab) {
            this.switchToTab(targetTab, category);
        }
    }

    /**
     * Public method to get current active category
     */
    getCurrentCategory() {
        return this.currentTab ? this.currentTab.getAttribute(this.config.contentAttribute) : null;
    }

    /**
     * Destroy the tab controller
     */
    destroy() {
        this.tabs.forEach(tab => {
            tab.removeEventListener('click', this.handleTabClick);
            tab.removeEventListener('keydown', this.handleKeyDown);
        });
    }
}

// Export for global use
window.TabController = TabController;
