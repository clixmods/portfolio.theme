/**
 * Keyboard Manager Utility
 * Centralized keyboard event handling with priority management
 * Version: 1.0.0
 */

(function() {
  'use strict';

  /**
   * Centralized keyboard event manager
   * Handles escape key and other keyboard shortcuts with priority
   */
  const KeyboardManager = {
    // Private state
    _initialized: false,
    _escapeHandlers: [],
    _keyHandlers: {},

    /**
     * Initializes the keyboard manager
     * Called automatically on first handler registration
     */
    _init() {
      if (this._initialized) return;
      this._initialized = true;

      document.addEventListener('keydown', (e) => {
        this._handleKeyDown(e);
      });
    },

    /**
     * Internal keydown handler
     * @param {KeyboardEvent} e - The keyboard event
     */
    _handleKeyDown(e) {
      // Handle Escape key
      if (e.key === 'Escape') {
        this._handleEscape(e);
        return;
      }

      // Handle other registered keys
      const handlers = this._keyHandlers[e.key];
      if (handlers && handlers.length > 0) {
        // Sort by priority (higher first)
        const sortedHandlers = [...handlers].sort((a, b) => b.priority - a.priority);

        for (const { handler, condition } of sortedHandlers) {
          // Check condition if provided
          if (typeof condition === 'function' && !condition()) {
            continue;
          }

          try {
            const result = handler(e);
            // If handler returns true, stop propagation
            if (result === true) {
              e.preventDefault();
              e.stopPropagation();
              break;
            }
          } catch (error) {
            console.warn('KeyboardManager: Error in key handler:', error);
          }
        }
      }
    },

    /**
     * Internal Escape key handler
     * @param {KeyboardEvent} e - The keyboard event
     */
    _handleEscape(e) {
      if (this._escapeHandlers.length === 0) return;

      // Sort by priority (higher first)
      const sortedHandlers = [...this._escapeHandlers].sort((a, b) => b.priority - a.priority);

      for (const { handler, condition } of sortedHandlers) {
        // Check condition if provided
        if (typeof condition === 'function' && !condition()) {
          continue;
        }

        try {
          const result = handler(e);
          // If handler returns true, stop propagation to lower priority handlers
          if (result === true) {
            e.preventDefault();
            break;
          }
        } catch (error) {
          console.warn('KeyboardManager: Error in escape handler:', error);
        }
      }
    },

    /**
     * Registers an Escape key handler with priority
     * Higher priority handlers are called first and can stop propagation
     * 
     * @param {Function} handler - Handler function, return true to stop propagation
     * @param {Object} options - Options object
     * @param {number} options.priority - Priority level (default: 0, higher = first)
     * @param {Function} options.condition - Optional condition function that must return true for handler to run
     * @returns {Function} Unsubscribe function
     * 
     * @example
     * // Modal with high priority (closes first)
     * const unsubscribe = KeyboardManager.onEscape(() => {
     *   if (modalIsOpen) {
     *     closeModal();
     *     return true; // Stop propagation
     *   }
     *   return false;
     * }, { priority: 100 });
     * 
     * // With condition
     * KeyboardManager.onEscape(closeMenu, {
     *   priority: 50,
     *   condition: () => menuIsOpen
     * });
     */
    onEscape(handler, options = {}) {
      if (typeof handler !== 'function') {
        console.warn('KeyboardManager.onEscape: handler must be a function');
        return () => {};
      }

      this._init();

      const { priority = 0, condition = null } = options;

      const entry = { handler, priority, condition };
      this._escapeHandlers.push(entry);

      // Return unsubscribe function
      return () => {
        const index = this._escapeHandlers.indexOf(entry);
        if (index > -1) {
          this._escapeHandlers.splice(index, 1);
        }
      };
    },

    /**
     * Registers a handler for any key
     * 
     * @param {string} key - The key to listen for (e.g., 'Enter', 'ArrowUp')
     * @param {Function} handler - Handler function, return true to stop propagation
     * @param {Object} options - Options object
     * @param {number} options.priority - Priority level (default: 0)
     * @param {Function} options.condition - Optional condition function
     * @returns {Function} Unsubscribe function
     */
    onKey(key, handler, options = {}) {
      if (typeof handler !== 'function') {
        console.warn('KeyboardManager.onKey: handler must be a function');
        return () => {};
      }

      this._init();

      const { priority = 0, condition = null } = options;

      if (!this._keyHandlers[key]) {
        this._keyHandlers[key] = [];
      }

      const entry = { handler, priority, condition };
      this._keyHandlers[key].push(entry);

      // Return unsubscribe function
      return () => {
        const handlers = this._keyHandlers[key];
        if (handlers) {
          const index = handlers.indexOf(entry);
          if (index > -1) {
            handlers.splice(index, 1);
          }
        }
      };
    },

    /**
     * Temporarily disables all handlers (useful during input focus)
     * @returns {Function} Function to re-enable handlers
     */
    disable() {
      const wasInitialized = this._initialized;
      this._initialized = false;

      return () => {
        this._initialized = wasInitialized;
      };
    },

    /**
     * Gets the count of registered escape handlers (useful for debugging)
     * @returns {number} Number of registered escape handlers
     */
    getEscapeHandlerCount() {
      return this._escapeHandlers.length;
    }
  };

  // Expose globally
  window.KeyboardManager = KeyboardManager;

})();
