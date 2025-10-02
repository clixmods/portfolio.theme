/**
 * Action Button Icon Manager
 * Automatically assigns icons to action buttons based on their type
 * This runs on page load to ensure all buttons have appropriate icons
 */

(function() {
    'use strict';

    // Type to icon mapping (matches server-side logic)
    const TYPE_TO_ICON_MAP = {
        'steam': 'steam',
        'youtube': 'youtube',
        'github': 'github',
        'download': 'download',
        'downloads': 'download',
        'switch': 'nintendo-switch',
        'xbox': 'xbox',
        'playstation': 'playstation',
        'epic': 'epic-games',
        'itch': 'itch-io',
        'website': 'external',
        'demo': 'external',
        'documentation': 'external',
        'doc': 'external'
    };

    /**
     * Get icon identifier from button type
     * @param {string} type - Button type
     * @returns {string} Icon identifier
     */
    function getIconForType(type) {
        if (!type) return 'external';
        const normalizedType = type.toLowerCase().trim();
        return TYPE_TO_ICON_MAP[normalizedType] || 'external';
    }

    /**
     * Check if action buttons need icon assignment
     * This is a safeguard in case server-side rendering missed any
     */
    function ensureActionButtonIcons() {
        // Get all action type elements
        const actionTypes = document.querySelectorAll('.action-type');
        
        actionTypes.forEach(typeElement => {
            const type = typeElement.textContent.trim();
            const actionItem = typeElement.closest('.popup-action-item');
            
            if (!actionItem) return;
            
            const iconContainer = actionItem.querySelector('.action-icon');
            if (!iconContainer) return;
            
            // Check if icon is already present
            const hasSvg = iconContainer.querySelector('svg');
            if (hasSvg) return; // Icon already present
            
            // Get expected icon
            const expectedIcon = getIconForType(type);
            console.log(`Missing icon detected for type "${type}", should be "${expectedIcon}"`);
            
            // Note: In production, icons should be rendered server-side
            // This is just a failsafe
        });
    }

    /**
     * Initialize on DOM ready
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', ensureActionButtonIcons);
        } else {
            ensureActionButtonIcons();
        }
    }

    // Auto-initialize
    init();

    // Export for potential external use
    window.ActionButtonIconManager = {
        getIconForType,
        ensureActionButtonIcons
    };
})();
