/**
 * Accessibility Utility Module
 * Centralized accessibility features and media query detection
 * Version: 1.0.0
 */

(function() {
  'use strict';

  /**
   * Accessibility utilities for handling user preferences
   */
  const AccessibilityUtils = {
    // Private state
    _reducedMotion: null,
    _reducedMotionListeners: [],
    _mediaQuery: null,

    /**
     * Initializes the accessibility utilities
     * Called automatically on first access to prefersReducedMotion
     */
    _init() {
      if (this._mediaQuery !== null) return;

      this._mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this._reducedMotion = this._mediaQuery.matches;

      // Listen for preference changes
      this._mediaQuery.addEventListener('change', (e) => {
        this._reducedMotion = e.matches;
        this._notifyReducedMotionListeners(e.matches);
      });
    },

    /**
     * Notifies all registered listeners of reduced motion changes
     * @param {boolean} isReduced - Whether reduced motion is preferred
     */
    _notifyReducedMotionListeners(isReduced) {
      this._reducedMotionListeners.forEach(callback => {
        try {
          callback(isReduced);
        } catch (error) {
          console.warn('AccessibilityUtils: Error in reduced motion listener:', error);
        }
      });
    },

    /**
     * Gets whether the user prefers reduced motion
     * @returns {boolean} True if user prefers reduced motion
     */
    get prefersReducedMotion() {
      if (this._reducedMotion === null) {
        this._init();
      }
      return this._reducedMotion;
    },

    /**
     * Registers a callback for reduced motion preference changes
     * @param {Function} callback - Function to call when preference changes, receives boolean
     * @returns {Function} Unsubscribe function
     * 
     * @example
     * const unsubscribe = AccessibilityUtils.onReducedMotionChange((isReduced) => {
     *   updateAnimationDuration(isReduced ? '50ms' : '150ms');
     * });
     * // Later: unsubscribe();
     */
    onReducedMotionChange(callback) {
      if (typeof callback !== 'function') {
        console.warn('AccessibilityUtils.onReducedMotionChange: callback must be a function');
        return () => {};
      }

      // Initialize if needed
      if (this._reducedMotion === null) {
        this._init();
      }

      this._reducedMotionListeners.push(callback);

      // Return unsubscribe function
      return () => {
        const index = this._reducedMotionListeners.indexOf(callback);
        if (index > -1) {
          this._reducedMotionListeners.splice(index, 1);
        }
      };
    },

    /**
     * Gets the appropriate animation duration based on reduced motion preference
     * @param {string} normalDuration - Duration when animations are allowed (e.g., '300ms')
     * @param {string} reducedDuration - Duration when reduced motion is preferred (e.g., '0ms')
     * @returns {string} The appropriate duration
     */
    getAnimationDuration(normalDuration = '300ms', reducedDuration = '50ms') {
      return this.prefersReducedMotion ? reducedDuration : normalDuration;
    },

    /**
     * Updates a CSS custom property based on reduced motion preference
     * @param {string} propertyName - CSS custom property name (e.g., '--dock-transition')
     * @param {string} normalValue - Value when animations are allowed
     * @param {string} reducedValue - Value when reduced motion is preferred
     */
    updateCSSProperty(propertyName, normalValue, reducedValue) {
      const value = this.prefersReducedMotion ? reducedValue : normalValue;
      document.documentElement.style.setProperty(propertyName, value);
    },

    /**
     * Sets up automatic CSS property updates for reduced motion
     * @param {string} propertyName - CSS custom property name
     * @param {string} normalValue - Value when animations are allowed
     * @param {string} reducedValue - Value when reduced motion is preferred
     * @returns {Function} Unsubscribe function
     */
    setupCSSPropertySync(propertyName, normalValue, reducedValue) {
      // Set initial value
      this.updateCSSProperty(propertyName, normalValue, reducedValue);

      // Listen for changes
      return this.onReducedMotionChange(() => {
        this.updateCSSProperty(propertyName, normalValue, reducedValue);
      });
    }
  };

  // Expose globally
  window.AccessibilityUtils = AccessibilityUtils;

})();
