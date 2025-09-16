/**
 * CV Version Choice Modal
 * Allows users to choose between color or print-friendly version
 */

class CVChoiceModal {
  constructor() {
    this.modal = null;
    this.init();
  }

  init() {
    // Create modal HTML structure
    this.createModal();
    this.bindEvents();
  }

  createModal() {
    // Create modal if it doesn't already exist
    if (!document.querySelector('.cv-choice-modal')) {
      const modalHTML = `
        <div class="cv-choice-modal-overlay"></div>
        <div class="cv-choice-modal">
          <div class="cv-choice-modal-content">
            <h2>📄 Télécharger mon CV</h2>
            <p>Quelle version souhaitez-vous télécharger ?</p>
            
            <div class="cv-choice-options">
              <div class="cv-choice-option" data-version="color">
                <div class="cv-choice-icon">🎨</div>
                <h3>Version couleur</h3>
                <p>PDF avec design complet et couleurs</p>
                <span class="cv-choice-recommended">📱 Recommandée pour l'écran</span>
              </div>
              
              <div class="cv-choice-option" data-version="print">
                <div class="cv-choice-icon">🖨️</div>
                <h3>Version imprimable</h3>
                <p>PDF noir et blanc, optimisé pour l'impression</p>
                <span class="cv-choice-recommended">💰 Économise l'encre</span>
              </div>
            </div>
            
            <div class="cv-choice-actions">
              <button class="cv-choice-cancel">Annuler</button>
            </div>
          </div>
        </div>
      `;
      
      // Inject into DOM
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      this.modal = document.querySelector('.cv-choice-modal');
    }
  }

  bindEvents() {
    // Event handlers for CV links - uses capture to intercept before other handlers
    document.addEventListener('click', (e) => {
      // Check if it's a CV link or element with cv-choice-trigger
      const cvLink = e.target.closest('a[href^="/cv"]') || e.target.closest('.cv-choice-trigger');
      
      if (cvLink) {
        e.preventDefault();
        e.stopPropagation();
        this.openModal();
        return false;
      }

      // Choice options
      const option = e.target.closest('.cv-choice-option');
      if (option) {
        const version = option.dataset.version;
        this.selectVersion(version);
        return;
      }

      // Cancel button
      if (e.target.matches('.cv-choice-cancel')) {
        this.closeModal();
        return;
      }

      // Overlay click
      if (e.target.matches('.cv-choice-modal-overlay')) {
        this.closeModal();
        return;
      }
    }, true); // Use capture to intercept before other handlers

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && this.modal.classList.contains('active')) {
        this.closeModal();
      }
    });
  }

  openModal() {
    if (this.modal) {
      // Pause other modals if necessary
      if (typeof window.pauseAllTestimonials === 'function') {
        window.pauseAllTestimonials();
      }
      
      this.modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Focus on first option
      setTimeout(() => {
        const firstOption = this.modal.querySelector('.cv-choice-option');
        if (firstOption) {
          firstOption.focus();
        }
      }, 100);
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.classList.remove('active');
      document.body.style.overflow = '';
      
      // Resume testimonials if necessary
      if (typeof window.resumeAllTestimonials === 'function') {
        window.resumeAllTestimonials();
      }
    }
  }

  selectVersion(version) {
    // Environment detection (local vs production)
    const isLocal = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' || 
                   window.location.port !== '';
    
    let targetUrl;
    let pdfUrl;
    let fileName;
    
    switch (version) {
      case 'color':
        targetUrl = '/cv/';
        pdfUrl = '/cv/clement-garcia-cv-couleur.pdf';
        fileName = 'Clément_GARCIA_CV_Couleur.pdf';
        break;
      case 'print':
        targetUrl = '/cv/print/';
        pdfUrl = '/cv/clement-garcia-cv-impression.pdf';
        fileName = 'Clément_GARCIA_CV_Impression.pdf';
        break;
      default:
        console.warn('Unknown version:', version);
        return;
    }
    
    // Close modal
    this.closeModal();
    
    // Different behavior based on environment
    setTimeout(() => {
      if (isLocal) {
        // Local: navigate to CV pages
        window.location.href = targetUrl;
      } else {
        // Production: download PDFs
        this.downloadPDF(pdfUrl, fileName);
      }
    }, 200); // Small delay for closing animation
  }

  downloadPDF(url, fileName) {
    // Create temporary download link
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    
    // Add to DOM, click and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Initialize modal on page load
document.addEventListener('DOMContentLoaded', () => {
  new CVChoiceModal();
});

// Export for global use
window.CVChoiceModal = CVChoiceModal;