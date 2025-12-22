/**
 * Modal Utilities Module
 * Shared functions for modal management across the application
 * Version: 1.0.0
 */

(function() {
  'use strict';

  /**
   * Modal utility functions
   */
  const ModalUtils = {
    // Modal IDs to track for "any modal open" checks
    _modalIds: ['unifiedModal', 'skillModal', 'personModal', 'cv-choice-modal', 'trophies-modal'],

    /**
     * Checks if any overlay modal is currently open
     * @param {string} excludeId - Optional modal ID to exclude from the check
     * @returns {boolean} True if any modal is open
     */
    isAnyModalOpen(excludeId = null) {
      return this._modalIds.some(id => {
        if (id === excludeId) return false;
        const el = document.getElementById(id) || document.querySelector(`.${id}`);
        if (!el) return false;
        
        // Check both inline style and computed style
        const display = el.style?.display || window.getComputedStyle(el).display;
        const isActive = el.classList.contains('active');
        
        return (display && display !== 'none') || isActive;
      });
    },

    /**
     * Registers a modal ID for tracking
     * @param {string} modalId - The modal ID to track
     */
    registerModal(modalId) {
      if (!this._modalIds.includes(modalId)) {
        this._modalIds.push(modalId);
      }
    },

    /**
     * Pauses all testimonial carousels (if they exist)
     */
    pauseTestimonials() {
      if (typeof window.pauseAllTestimonials === 'function') {
        window.pauseAllTestimonials();
      }
    },

    /**
     * Resumes all testimonial carousels (if they exist)
     */
    resumeTestimonials() {
      if (typeof window.resumeAllTestimonials === 'function') {
        window.resumeAllTestimonials();
      }
    },

    /**
     * Locks body scroll to prevent background scrolling when modal is open
     */
    lockBodyScroll() {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    },

    /**
     * Unlocks body scroll, but only if no other modals are open
     * @param {string} excludeId - Modal ID to exclude when checking if others are open
     */
    unlockBodyScroll(excludeId = null) {
      // Only unlock if no other modals are open
      if (!this.isAnyModalOpen(excludeId)) {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    },

    /**
     * Standard modal open routine
     * @param {HTMLElement} modal - The modal element
     * @param {Object} options - Options object
     * @param {boolean} options.pauseTestimonials - Whether to pause testimonials (default: true)
     * @param {boolean} options.lockScroll - Whether to lock body scroll (default: true)
     */
    openModal(modal, options = {}) {
      if (!modal) return;

      const { pauseTestimonials = true, lockScroll = true } = options;

      if (pauseTestimonials) {
        this.pauseTestimonials();
      }

      if (lockScroll) {
        this.lockBodyScroll();
      }

      // Use AnimationUtils if available
      if (window.AnimationUtils?.fadeEnter) {
        window.AnimationUtils.fadeEnter(modal, { display: 'flex' });
      } else {
        // Fallback animation
        modal.style.display = 'flex';
        modal.classList.add('active');
      }
    },

    /**
     * Standard modal close routine
     * @param {HTMLElement} modal - The modal element
     * @param {Object} options - Options object
     * @param {boolean} options.resumeTestimonials - Whether to resume testimonials (default: true)
     * @param {boolean} options.unlockScroll - Whether to unlock body scroll (default: true)
     * @param {string} options.modalId - Modal ID for checking other open modals
     * @param {Function} options.onComplete - Callback after close animation
     */
    closeModal(modal, options = {}) {
      if (!modal) return;

      const { 
        resumeTestimonials = true, 
        unlockScroll = true, 
        modalId = null,
        onComplete = null 
      } = options;

      const afterClose = () => {
        if (resumeTestimonials) {
          this.resumeTestimonials();
        }

        if (unlockScroll) {
          this.unlockBodyScroll(modalId);
        }

        if (typeof onComplete === 'function') {
          onComplete();
        }
      };

      // Use AnimationUtils if available
      if (window.AnimationUtils?.fadeExit) {
        window.AnimationUtils.fadeExit(modal, { 
          onComplete: afterClose 
        });
      } else {
        // Fallback animation
        modal.classList.remove('active');
        setTimeout(() => {
          modal.style.display = 'none';
          afterClose();
        }, 300);
      }
    },

    /**
     * Registers an Escape key handler for a modal using KeyboardManager
     * @param {Function} closeCallback - Function to call when Escape is pressed
     * @param {Function} isOpenCheck - Function that returns true if modal is open
     * @param {number} priority - Priority level (higher = first, default: 100 for modals)
     * @returns {Function} Unsubscribe function
     */
    registerEscapeHandler(closeCallback, isOpenCheck, priority = 100) {
      if (window.KeyboardManager?.onEscape) {
        return window.KeyboardManager.onEscape(closeCallback, {
          priority,
          condition: isOpenCheck
        });
      } else {
        // Fallback to direct event listener
        const handler = (e) => {
          if (e.key === 'Escape' && isOpenCheck()) {
            closeCallback();
          }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
      }
    }
  };

  // Expose globally
  window.ModalUtils = ModalUtils;

})();
