/**
 * Data Utilities Module
 * Shared functions for data cleaning and JSON parsing
 * Version: 1.0.0
 */

(function() {
  'use strict';

  /**
   * Data utility functions for cleaning and parsing
   */
  const DataUtils = {
    /**
     * Cleans a JSON string value that may have extra quotes
     * @param {*} value - The value to clean
     * @returns {*} The cleaned value
     * 
     * @example
     * DataUtils.cleanJsonValue('"hello"') // returns 'hello'
     * DataUtils.cleanJsonValue('hello') // returns 'hello'
     * DataUtils.cleanJsonValue(123) // returns 123
     */
    cleanJsonValue(value) {
      if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
        return value.slice(1, -1);
      }
      return value;
    },

    /**
     * Cleans all string properties of an object
     * @param {Object} obj - The object to clean
     * @returns {Object} The cleaned object
     */
    cleanObject(obj) {
      if (!obj || typeof obj !== 'object') return obj;

      const cleaned = {};
      for (const [key, value] of Object.entries(obj)) {
        cleaned[key] = this.cleanJsonValue(value);
      }
      return cleaned;
    },

    /**
     * Parses a technologies array that might be a JSON string
     * @param {string|Array} technologies - Technologies as string or array
     * @returns {Array} Parsed technologies array
     * 
     * @example
     * DataUtils.parseTechnologies('["Unity", "C#"]') // returns ['Unity', 'C#']
     * DataUtils.parseTechnologies(['Unity', 'C#']) // returns ['Unity', 'C#']
     * DataUtils.parseTechnologies(undefined) // returns []
     */
    parseTechnologies(technologies) {
      if (!technologies) return [];
      
      if (Array.isArray(technologies)) {
        return technologies;
      }
      
      if (typeof technologies === 'string') {
        try {
          const parsed = JSON.parse(technologies);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          // If not valid JSON, try splitting by comma
          return technologies.split(',').map(t => t.trim()).filter(Boolean);
        }
      }
      
      return [];
    },

    /**
     * Safely parses JSON with fallback
     * @param {string} jsonString - The JSON string to parse
     * @param {*} defaultValue - Default value if parsing fails
     * @returns {*} Parsed value or default
     */
    safeJsonParse(jsonString, defaultValue = null) {
      if (!jsonString || typeof jsonString !== 'string') {
        return defaultValue;
      }
      
      try {
        return JSON.parse(jsonString);
      } catch (e) {
        console.warn('DataUtils.safeJsonParse failed:', e.message);
        return defaultValue;
      }
    },

    /**
     * Cleans a project object by removing extra quotes from all string fields
     * @param {Object} project - The project object
     * @returns {Object} Cleaned project object
     */
    cleanProject(project) {
      if (!project) return project;
      
      return {
        ...project,
        title: this.cleanJsonValue(project.title),
        subtitle: this.cleanJsonValue(project.subtitle),
        description: this.cleanJsonValue(project.description),
        featured_image: this.cleanJsonValue(project.featured_image),
        technologies: this.parseTechnologies(project.technologies),
        programming_languages: this.parseTechnologies(project.programming_languages),
        frameworks_engines: this.parseTechnologies(project.frameworks_engines)
      };
    },

    /**
     * Cleans an experience object
     * @param {Object} experience - The experience object
     * @returns {Object} Cleaned experience object
     */
    cleanExperience(experience) {
      if (!experience) return experience;
      
      return {
        ...experience,
        title: this.cleanJsonValue(experience.title),
        company: this.cleanJsonValue(experience.company),
        description: this.cleanJsonValue(experience.description),
        location: this.cleanJsonValue(experience.location),
        technologies: this.parseTechnologies(experience.technologies)
      };
    },

    /**
     * Cleans an education object
     * @param {Object} education - The education object
     * @returns {Object} Cleaned education object
     */
    cleanEducation(education) {
      if (!education) return education;
      
      return {
        ...education,
        title: this.cleanJsonValue(education.title),
        school: this.cleanJsonValue(education.school),
        description: this.cleanJsonValue(education.description),
        location: this.cleanJsonValue(education.location)
      };
    },

    /**
     * Normalizes a data array by cleaning all items
     * @param {Array} items - Array of items to clean
     * @param {string} type - Type of items ('project', 'experience', 'education')
     * @returns {Array} Cleaned items array
     */
    normalizeDataArray(items, type = 'project') {
      if (!Array.isArray(items)) return [];
      
      const cleaners = {
        project: (item) => this.cleanProject(item),
        experience: (item) => this.cleanExperience(item),
        education: (item) => this.cleanEducation(item)
      };
      
      const cleaner = cleaners[type] || ((item) => this.cleanObject(item));
      return items.map(cleaner);
    }
  };

  // Expose globally
  window.DataUtils = DataUtils;

})();
