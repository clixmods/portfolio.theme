/**
 * Initialization Guard Utility
 * Prevents multiple executions of initialization functions
 * Version: 1.0.0
 */

(function() {
  'use strict';

  /**
   * Creates an initialization guard for a named module
   * Prevents multiple executions by tracking initialization state
   * 
   * @param {string} name - Unique name for the module (e.g., 'rightDock', 'notifications')
   * @param {Function} initFn - The initialization function to run once
   * @returns {boolean} True if initialization was performed, false if already initialized
   * 
   * @example
   * // Instead of:
   * if (window.myModuleInitialized) return;
   * window.myModuleInitialized = true;
   * // ... init code
   * 
   * // Use:
   * initGuard('myModule', function() {
   *   // ... init code
   * });
   */
  function initGuard(name, initFn) {
    const key = `${name}Initialized`;
    
    if (window[key]) {
      return false;
    }
    
    window[key] = true;
    
    if (typeof initFn === 'function') {
      initFn();
    }
    
    return true;
  }

  /**
   * Checks if a module has been initialized
   * 
   * @param {string} name - The module name to check
   * @returns {boolean} True if module has been initialized
   */
  function isInitialized(name) {
    return window[`${name}Initialized`] === true;
  }

  /**
   * Resets the initialization state for a module (useful for testing)
   * 
   * @param {string} name - The module name to reset
   */
  function resetInitialization(name) {
    delete window[`${name}Initialized`];
  }

  // Expose globally
  window.initGuard = initGuard;
  window.isInitialized = isInitialized;
  window.resetInitialization = resetInitialization;

})();
