/**
 * Storage Utility Module
 * Centralized localStorage/sessionStorage access with error handling
 * Version: 1.0.0
 */

(function() {
  'use strict';

  /**
   * Safe wrapper for localStorage operations with JSON serialization
   */
  const Storage = {
    /**
     * Gets a value from localStorage with JSON parsing
     * @param {string} key - The storage key
     * @param {*} defaultValue - Default value if key doesn't exist or parsing fails
     * @returns {*} The parsed value or defaultValue
     */
    get(key, defaultValue = null) {
      try {
        const value = localStorage.getItem(key);
        if (value === null) {
          return defaultValue;
        }
        return JSON.parse(value);
      } catch (error) {
        console.warn(`Storage.get error for "${key}":`, error);
        return defaultValue;
      }
    },

    /**
     * Sets a value in localStorage with JSON serialization
     * @param {string} key - The storage key
     * @param {*} value - The value to store (will be JSON stringified)
     * @returns {boolean} True if successful, false otherwise
     */
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.warn(`Storage.set error for "${key}":`, error);
        return false;
      }
    },

    /**
     * Removes a value from localStorage
     * @param {string} key - The storage key to remove
     * @returns {boolean} True if successful, false otherwise
     */
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.warn(`Storage.remove error for "${key}":`, error);
        return false;
      }
    },

    /**
     * Checks if a key exists in localStorage
     * @param {string} key - The storage key
     * @returns {boolean} True if key exists
     */
    has(key) {
      try {
        return localStorage.getItem(key) !== null;
      } catch (error) {
        console.warn(`Storage.has error for "${key}":`, error);
        return false;
      }
    },

    /**
     * Gets a raw string value without JSON parsing
     * @param {string} key - The storage key
     * @param {string} defaultValue - Default value if key doesn't exist
     * @returns {string} The raw string value
     */
    getRaw(key, defaultValue = '') {
      try {
        const value = localStorage.getItem(key);
        return value !== null ? value : defaultValue;
      } catch (error) {
        console.warn(`Storage.getRaw error for "${key}":`, error);
        return defaultValue;
      }
    },

    /**
     * Sets a raw string value without JSON serialization
     * @param {string} key - The storage key
     * @param {string} value - The string value to store
     * @returns {boolean} True if successful
     */
    setRaw(key, value) {
      try {
        localStorage.setItem(key, String(value));
        return true;
      } catch (error) {
        console.warn(`Storage.setRaw error for "${key}":`, error);
        return false;
      }
    }
  };

  /**
   * Safe wrapper for sessionStorage operations with JSON serialization
   */
  const SessionStorage = {
    /**
     * Gets a value from sessionStorage with JSON parsing
     * @param {string} key - The storage key
     * @param {*} defaultValue - Default value if key doesn't exist or parsing fails
     * @returns {*} The parsed value or defaultValue
     */
    get(key, defaultValue = null) {
      try {
        const value = sessionStorage.getItem(key);
        if (value === null) {
          return defaultValue;
        }
        return JSON.parse(value);
      } catch (error) {
        console.warn(`SessionStorage.get error for "${key}":`, error);
        return defaultValue;
      }
    },

    /**
     * Sets a value in sessionStorage with JSON serialization
     * @param {string} key - The storage key
     * @param {*} value - The value to store (will be JSON stringified)
     * @returns {boolean} True if successful, false otherwise
     */
    set(key, value) {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.warn(`SessionStorage.set error for "${key}":`, error);
        return false;
      }
    },

    /**
     * Removes a value from sessionStorage
     * @param {string} key - The storage key to remove
     * @returns {boolean} True if successful, false otherwise
     */
    remove(key) {
      try {
        sessionStorage.removeItem(key);
        return true;
      } catch (error) {
        console.warn(`SessionStorage.remove error for "${key}":`, error);
        return false;
      }
    },

    /**
     * Checks if a key exists in sessionStorage
     * @param {string} key - The storage key
     * @returns {boolean} True if key exists
     */
    has(key) {
      try {
        return sessionStorage.getItem(key) !== null;
      } catch (error) {
        console.warn(`SessionStorage.has error for "${key}":`, error);
        return false;
      }
    },

    /**
     * Gets a raw string value without JSON parsing
     * @param {string} key - The storage key
     * @param {string} defaultValue - Default value if key doesn't exist
     * @returns {string} The raw string value
     */
    getRaw(key, defaultValue = '') {
      try {
        const value = sessionStorage.getItem(key);
        return value !== null ? value : defaultValue;
      } catch (error) {
        console.warn(`SessionStorage.getRaw error for "${key}":`, error);
        return defaultValue;
      }
    },

    /**
     * Sets a raw string value without JSON serialization
     * @param {string} key - The storage key
     * @param {string} value - The string value to store
     * @returns {boolean} True if successful
     */
    setRaw(key, value) {
      try {
        sessionStorage.setItem(key, String(value));
        return true;
      } catch (error) {
        console.warn(`SessionStorage.setRaw error for "${key}":`, error);
        return false;
      }
    }
  };

  // Expose globally
  window.Storage = Storage;
  window.SessionStorage = SessionStorage;

})();
