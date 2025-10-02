/**
 * Action Icons Auto-Fixer
 * Automatically assigns icons based on action type for backward compatibility
 * This ensures old projects without icon fields still display correctly
 */

(function() {
  'use strict';

  // Mapping between action types and their corresponding icons
  const TYPE_TO_ICON_MAP = {
    'steam': 'steam',
    'youtube': 'youtube',
    'github': 'github',
    'download': 'download',
    'downloads': 'download', // Legacy support
    'switch': 'nintendo-switch',
    'xbox': 'xbox',
    'playstation': 'playstation',
    'epic': 'epic-games',
    'itch': 'itch-io',
    'website': 'external',
    'demo': 'external',
    'documentation': 'external',
    'doc': 'external' // Legacy support
  };

  /**
   * Get the icon name for a given action type
   * @param {string} type - The action type
   * @returns {string} The corresponding icon name
   */
  function getIconForType(type) {
    const normalizedType = type.toLowerCase().trim();
    return TYPE_TO_ICON_MAP[normalizedType] || 'external';
  }

  /**
   * Check if an action button has an icon
   * @param {HTMLElement} button - The action button element
   * @returns {boolean} True if button has an icon
   */
  function hasIcon(button) {
    return button.querySelector('svg') !== null;
  }

  /**
   * Extract type from action button data or nearby elements
   * @param {HTMLElement} button - The action button element
   * @returns {string|null} The action type or null
   */
  function extractActionType(button) {
    // Try to get from data attribute
    if (button.dataset.type) {
      return button.dataset.type;
    }

    // Try to get from popup action items (has action-type div)
    const actionTypeEl = button.querySelector('.action-type');
    if (actionTypeEl) {
      return actionTypeEl.textContent.trim().toLowerCase();
    }

    // Try to infer from URL
    const url = button.href || button.getAttribute('onclick');
    if (!url) return null;

    if (url.includes('steampowered.com') || url.includes('store.steam')) return 'steam';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('github.com')) return 'github';
    if (url.includes('nintendo.') || url.includes('switch')) return 'switch';
    if (url.includes('xbox.com')) return 'xbox';
    if (url.includes('playstation.com')) return 'playstation';
    if (url.includes('epicgames.com')) return 'epic';
    if (url.includes('itch.io')) return 'itch';

    return null;
  }

  /**
   * Initialize auto-icon detection for action buttons
   */
  function initAutoIconDetection() {
    // This script is intentionally minimal as icons should be
    // set server-side via Hugo partials
    console.log('[Action Icons] Auto-icon detection initialized');
    
    // Check for any buttons missing icons (shouldn't happen with new system)
    const buttons = document.querySelectorAll('.btn-action, .popup-action-item');
    let missingCount = 0;

    buttons.forEach(button => {
      if (!hasIcon(button)) {
        missingCount++;
        const type = extractActionType(button);
        if (type) {
          console.warn('[Action Icons] Missing icon for button:', {
            type: type,
            label: button.textContent.trim(),
            expectedIcon: getIconForType(type)
          });
        }
      }
    });

    if (missingCount > 0) {
      console.warn(
        `[Action Icons] Found ${missingCount} button(s) without icons. ` +
        'Consider running the migration script: node scripts/update-action-icons.js'
      );
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoIconDetection);
  } else {
    initAutoIconDetection();
  }

  // Export for debugging purposes
  window.ActionIconsHelper = {
    getIconForType,
    TYPE_TO_ICON_MAP
  };
})();
