/**
 * Animation Utility Module
 * Centralized animation helpers and performance optimizations
 * Version: 1.0.0
 */

(function() {
  'use strict';

  /**
   * Animation utilities for performance-optimized animations
   */
  const AnimationUtils = {
    /**
     * Optimizes will-change property for an element during animations
     * Applies will-change before animation and removes it after to prevent GPU memory issues
     * 
     * @param {HTMLElement} element - The element to optimize
     * @param {string} properties - CSS properties to hint (e.g., 'transform', 'transform, opacity')
     * @param {number} duration - Duration to keep will-change applied (ms), default 300
     * 
     * @example
     * AnimationUtils.optimizeWillChange(button, 'transform', 300);
     */
    optimizeWillChange(element, properties, duration = 300) {
      if (!element) return;

      // Apply will-change before animation
      element.style.willChange = properties;

      // Remove will-change after animation completes to free GPU memory
      setTimeout(() => {
        if (element) {
          element.style.willChange = 'auto';
        }
      }, duration);
    },

    /**
     * Fades in an element with configurable options
     * 
     * @param {HTMLElement} element - The element to fade in
     * @param {Object} options - Animation options
     * @param {number} options.duration - Animation duration in ms (default: 300)
     * @param {string} options.display - Display value to set (default: 'block')
     * @param {Function} options.onComplete - Callback when animation completes
     */
    fadeIn(element, options = {}) {
      if (!element) return;

      const {
        duration = 300,
        display = 'block',
        onComplete = null
      } = options;

      // Check for reduced motion preference
      const reducedMotion = window.AccessibilityUtils?.prefersReducedMotion ?? false;
      const actualDuration = reducedMotion ? 0 : duration;

      // Prepare element
      element.style.opacity = '0';
      element.style.display = display;

      // Optimize will-change
      this.optimizeWillChange(element, 'opacity', actualDuration + 50);

      // Force reflow
      element.offsetHeight;

      // Apply transition and animate
      element.style.transition = `opacity ${actualDuration}ms ease`;
      element.style.opacity = '1';

      // Cleanup and callback
      setTimeout(() => {
        element.style.transition = '';
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }, actualDuration);
    },

    /**
     * Fades out an element with configurable options
     * 
     * @param {HTMLElement} element - The element to fade out
     * @param {Object} options - Animation options
     * @param {number} options.duration - Animation duration in ms (default: 300)
     * @param {boolean} options.hide - Whether to hide element after fade (default: true)
     * @param {Function} options.onComplete - Callback when animation completes
     */
    fadeOut(element, options = {}) {
      if (!element) return;

      const {
        duration = 300,
        hide = true,
        onComplete = null
      } = options;

      // Check for reduced motion preference
      const reducedMotion = window.AccessibilityUtils?.prefersReducedMotion ?? false;
      const actualDuration = reducedMotion ? 0 : duration;

      // Optimize will-change
      this.optimizeWillChange(element, 'opacity', actualDuration + 50);

      // Apply transition and animate
      element.style.transition = `opacity ${actualDuration}ms ease`;
      element.style.opacity = '0';

      // Cleanup and callback
      setTimeout(() => {
        element.style.transition = '';
        if (hide) {
          element.style.display = 'none';
        }
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }, actualDuration);
    },

    /**
     * Applies fade enter animation classes (commonly used in modals)
     * 
     * @param {HTMLElement} element - The element to animate
     * @param {Object} options - Animation options
     * @param {number} options.duration - Animation duration in ms (default: 300)
     * @param {string} options.display - Display value to set (default: 'flex')
     * @param {Function} options.onComplete - Callback when animation completes
     */
    fadeEnter(element, options = {}) {
      if (!element) return;

      const {
        duration = 300,
        display = 'flex',
        onComplete = null
      } = options;

      element.style.display = display;
      element.classList.remove('fade-exit', 'fade-exit-active');
      element.classList.add('fade-enter');

      // Force reflow
      element.offsetHeight;

      element.classList.add('fade-enter-active');

      setTimeout(() => {
        element.classList.remove('fade-enter', 'fade-enter-active');
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }, duration);
    },

    /**
     * Applies fade exit animation classes (commonly used in modals)
     * 
     * @param {HTMLElement} element - The element to animate
     * @param {Object} options - Animation options
     * @param {number} options.duration - Animation duration in ms (default: 300)
     * @param {boolean} options.hide - Whether to hide element after animation (default: true)
     * @param {Function} options.onComplete - Callback when animation completes
     */
    fadeExit(element, options = {}) {
      if (!element) return;

      const {
        duration = 300,
        hide = true,
        onComplete = null
      } = options;

      element.classList.remove('fade-enter', 'fade-enter-active');
      element.classList.add('fade-exit');

      // Force reflow
      element.offsetHeight;

      element.classList.add('fade-exit-active');

      setTimeout(() => {
        if (hide) {
          element.style.display = 'none';
        }
        element.classList.remove('fade-exit', 'fade-exit-active');
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }, duration);
    },

    /**
     * Adds staggered animation to a list of elements
     * 
     * @param {NodeList|Array} elements - Elements to animate
     * @param {Object} options - Animation options
     * @param {string} options.className - Class to add for animation (default: 'animate-in')
     * @param {number} options.stagger - Delay between each element in ms (default: 50)
     * @param {number} options.initialDelay - Initial delay before first element (default: 0)
     */
    staggerIn(elements, options = {}) {
      if (!elements || elements.length === 0) return;

      const {
        className = 'animate-in',
        stagger = 50,
        initialDelay = 0
      } = options;

      const elementsArray = Array.from(elements);

      elementsArray.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add(className);
        }, initialDelay + (index * stagger));
      });
    },

    /**
     * Sets up hover optimization for interactive elements
     * Applies will-change on mouseenter/focus for smoother animations
     * 
     * @param {string} selector - CSS selector for elements to optimize
     * @param {string} properties - CSS properties to hint (default: 'transform')
     */
    setupHoverOptimization(selector, properties = 'transform') {
      const elements = document.querySelectorAll(selector);

      elements.forEach(element => {
        element.addEventListener('mouseenter', () => {
          this.optimizeWillChange(element, properties);
        });

        element.addEventListener('focus', () => {
          this.optimizeWillChange(element, properties);
        });
      });
    }
  };

  // Expose globally
  window.AnimationUtils = AnimationUtils;

})();
