/**
 * Widget initialization with number formatting and automatic calculations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ensure NumberFormatter is available
    if (typeof window.NumberFormatter === 'undefined') {
        console.warn('NumberFormatter not available, skipping number formatting');
        return;
    }

    const formatter = window.NumberFormatter;

    /**
     * Format remaining elements with data-count (if needed as fallback)
     */
    function formatNumbers() {
        // This function is now mainly a fallback
        // Main formatting is done server-side Hugo
        const countElements = document.querySelectorAll('[data-count]:not([data-formatted="true"])');
        
        if (countElements.length === 0) return;
        
        console.log('Formatage JS en fallback pour', countElements.length, 'éléments');
        
        countElements.forEach(element => {
            const countString = element.dataset.count;
            const count = parseInt(countString, 10);
            
            if (isNaN(count) || !countString) return;

            try {
                const formattedNumber = formatter.format(count);
                const currentText = element.textContent || element.innerText || '';
                
                // Replace only if the raw number is still present
                if (currentText.includes(countString) && !currentText.includes(' ')) {
                    const updatedText = currentText.replace(countString, formattedNumber);
                    element.textContent = updatedText;
                }
                
                element.dataset.formatted = 'true';
                
            } catch (error) {
                console.error('Error formatting number:', error, element);
            }
        });
    }

    /**
     * Calculate and display percentages automatically (fallback only)
     */
    function calculatePercentages() {
        // This function is now mainly a fallback
        // Main calculation is done server-side Hugo
        const percentageElements = document.querySelectorAll('[data-part][data-total]:empty');
        
        if (percentageElements.length === 0) return;
        
        console.log('Calcul JS en fallback pour', percentageElements.length, 'pourcentages');
        
        percentageElements.forEach(element => {
            const part = parseInt(element.dataset.part, 10);
            const total = parseInt(element.dataset.total, 10);
            
            if (isNaN(part) || isNaN(total) || total === 0) {
                element.style.display = 'none';
                return;
            }

            const percentage = formatter.calculatePercentage(part, total, 1);
            const formattedPercentage = formatter.formatPercentage(percentage, 1);
            
            element.textContent = `${formattedPercentage} du total`;
            element.style.display = 'block';
        });
    }

    /**
     * Add CSS classes according to position in ranking
     */
    function enhanceRankingDisplay() {
        const positionElements = document.querySelectorAll('.position-number');
        
        positionElements.forEach(element => {
            const positionText = element.textContent || element.innerText;
            const position = parseInt(positionText, 10);
            
            if (isNaN(position)) return;

            // Add classes for special styling
            element.classList.remove('position-1', 'position-2', 'position-3', 'position-top10');
            
            if (position === 1) {
                element.classList.add('position-1');
            } else if (position === 2) {
                element.classList.add('position-2');
            } else if (position === 3) {
                element.classList.add('position-3');
            } else if (position <= 10) {
                element.classList.add('position-top10');
            }
        });
    }

    /**
     * Initialize all widgets
     */
    function initializeWidgets() {
        // Number formatting is now done server-side
        // These functions only serve as fallback
        formatNumbers();
        calculatePercentages();
        enhanceRankingDisplay();
    }

    // Initialization on load
    initializeWidgets();

    // Reset when modals open (in case of dynamic content)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.project-widget')) {
            // Delay to allow opening animation to complete
            setTimeout(initializeWidgets, 100);
        }
    });

    // Observe DOM changes for dynamic content
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function(mutations) {
            let shouldUpdate = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    const hasRelevantNodes = Array.from(mutation.addedNodes).some(node => 
                        node.nodeType === Node.ELEMENT_NODE && (
                            node.querySelector && (
                                node.querySelector('[data-count]') ||
                                node.querySelector('[data-part]') ||
                                node.querySelector('.position-number')
                            )
                        )
                    );
                    
                    if (hasRelevantNodes) {
                        shouldUpdate = true;
                    }
                }
            });
            
            if (shouldUpdate) {
                initializeWidgets();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
});