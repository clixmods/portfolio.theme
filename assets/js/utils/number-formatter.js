/**
 * Number formatting utilities according to locale
 * Supports French (800 000) and English (800,000) formats
 */

class NumberFormatter {
    constructor() {
        // Detect site language
        this.locale = this.detectLocale();
    }

    /**
     * Detect current locale from Hugo
     * @returns {string} Language code (fr, en, etc.)
     */
    detectLocale() {
        // Try several detection methods
        if (typeof window !== 'undefined') {
            // 1. From HTML lang attribute
            const htmlLang = document.documentElement.lang;
            if (htmlLang) return htmlLang;

            // 2. From URL (/en/...)
            const pathLang = window.location.pathname.match(/^\/([a-z]{2})\//);
            if (pathLang) return pathLang[1];

            // 3. From injected Hugo variable
            if (window.hugoSite && window.hugoSite.language) {
                return window.hugoSite.language;
            }
        }

        // Default: French
        return 'fr';
    }

    /**
     * Format a number according to locale
     * @param {number} number - Number to format
     * @param {object} options - Formatting options
     * @returns {string} Formatted number
     */
    format(number, options = {}) {
        // Robust conversion and validation
        const numericValue = typeof number === 'string' ? parseFloat(number) : number;
        
        if (typeof numericValue !== 'number' || !isFinite(numericValue)) {
            console.warn('NumberFormatter.format: Invalid number:', number);
            return String(number);
        }

        const {
            minimumFractionDigits = 0,
            maximumFractionDigits = 0,
            useGrouping = true
        } = options;

        try {
            // Use Intl.NumberFormat API if available
            if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
                return new Intl.NumberFormat(this.locale, {
                    minimumFractionDigits,
                    maximumFractionDigits,
                    useGrouping
                }).format(numericValue);
            }

            // Manual fallback
            return this.manualFormat(numericValue, options);
        } catch (error) {
            console.warn('NumberFormatter.format error:', error, 'for number:', number);
            return this.manualFormat(numericValue, options);
        }
    }

    /**
     * Manual formatting in case of absence of Intl.NumberFormat
     * @param {number} number - Number to format
     * @param {object} options - Formatting options
     * @returns {string} Formatted number
     */
    manualFormat(number, options = {}) {
        const { useGrouping = true } = options;
        
        // Additional validation
        if (typeof number !== 'number' || !isFinite(number)) {
            return String(number);
        }
        
        if (!useGrouping) {
            return String(Math.round(number));
        }

        const parts = String(Math.round(number)).split('.');
        const integerPart = parts[0];
        const decimalPart = parts[1];

        // Add thousand separators according to locale
        const separator = this.locale === 'fr' ? ' ' : ',';
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

        return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
    }

    /**
     * Format a number with suffix (K, M, B)
     * @param {number} number - Number to format
     * @param {object} options - Formatting options
     * @returns {string} Number formatted with suffix
     */
    formatWithSuffix(number, options = {}) {
        const { precision = 1 } = options;

        if (number < 1000) {
            return this.format(number);
        }

        const suffixes = this.locale === 'fr' ? 
            ['', 'K', 'M', 'Md', 'B'] : 
            ['', 'K', 'M', 'B', 'T'];

        const magnitude = Math.floor(Math.log10(Math.abs(number)) / 3);
        const scaledNumber = number / Math.pow(1000, magnitude);

        const formattedNumber = this.format(scaledNumber, { 
            maximumFractionDigits: precision 
        });

        return `${formattedNumber}${suffixes[magnitude] || ''}`;
    }

    /**
     * Automatically calculate percentage
     * @param {number} part - Part
     * @param {number} total - Total
     * @param {number} precision - Decimal precision
     * @returns {number} Percentage
     */
    calculatePercentage(part, total, precision = 1) {
        if (!total || total === 0) return 0;
        const percentage = (part / total) * 100;
        return Math.round(percentage * Math.pow(10, precision)) / Math.pow(10, precision);
    }

    /**
     * Format a percentage
     * @param {number} percentage - Percentage to format
     * @param {number} precision - Decimal precision
     * @returns {string} Formatted percentage
     */
    formatPercentage(percentage, precision = 1) {
        return this.format(percentage, { maximumFractionDigits: precision }) + '%';
    }
}

// Global instance
window.NumberFormatter = window.NumberFormatter || new NumberFormatter();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NumberFormatter;
}