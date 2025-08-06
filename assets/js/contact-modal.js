/**
 * Contact Modal - Gestion de la modal de contact globale
 * Version: 1.0.0
 */

(function() {
  'use strict';
  
  let contactModal = null;
  let contactModalTrigger = null;
  let contactSectionTrigger = null;
  let contactModalClose = null;
  let contactModalOverlay = null;
  let contactModalForm = null;
  let isOpen = false;
  
  /**
   * Initialise les éléments DOM
   */
  function initElements() {
    contactModal = document.getElementById('contact-modal');
    contactModalTrigger = document.getElementById('contact-modal-trigger');
    contactSectionTrigger = document.getElementById('contact-section-trigger');
    contactModalClose = contactModal?.querySelector('.contact-modal-close');
    contactModalOverlay = contactModal?.querySelector('.contact-modal-overlay');
    contactModalForm = document.getElementById('contact-modal-form');
  }
  
  /**
   * Ouvre la modal de contact
   */
  function openContactModal() {
    if (!contactModal || isOpen) return;
    
    isOpen = true;
    contactModal.classList.add('active');
    contactModal.setAttribute('aria-hidden', 'false');
    
    // Focus sur le premier input
    const firstInput = contactModal.querySelector('input');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
    
    // Empêche le scroll du body
    document.body.style.overflow = 'hidden';
    
    // Événement clavier pour fermer avec Escape
    document.addEventListener('keydown', handleEscapeKey);
  }
  
  /**
   * Ferme la modal de contact
   */
  function closeContactModal() {
    if (!contactModal || !isOpen) return;
    
    isOpen = false;
    contactModal.classList.remove('active');
    contactModal.setAttribute('aria-hidden', 'true');
    
    // Remet le scroll du body
    document.body.style.overflow = '';
    
    // Retire l'événement clavier
    document.removeEventListener('keydown', handleEscapeKey);
    
    // Remet le focus sur le déclencheur
    if (contactModalTrigger) {
      contactModalTrigger.focus();
    }
  }
  
  /**
   * Gère la fermeture avec la touche Escape
   */
  function handleEscapeKey(event) {
    if (event.key === 'Escape') {
      closeContactModal();
    }
  }
  
  /**
   * Gère le clic sur l'overlay
   */
  function handleOverlayClick(event) {
    if (event.target === contactModalOverlay) {
      closeContactModal();
    }
  }
  
  /**
   * Gère la navigation par tabulation dans la modal
   */
  function handleTabNavigation(event) {
    if (!isOpen || event.key !== 'Tab') return;
    
    const focusableElements = contactModal.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }
  
  /**
   * Gère la soumission du formulaire
   */
  function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(contactModalForm);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };
    
    // Validation simple
    if (!data.name || !data.email || !data.message) {
      showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }
    
    // Simulation d'envoi (remplacer par votre logique d'envoi)
    submitForm(data);
  }
  
  /**
   * Simule l'envoi du formulaire
   */
  function submitForm(data) {
    const submitButton = contactModalForm.querySelector('.contact-modal-submit');
    const originalText = submitButton.innerHTML;
    
    // Désactive le bouton et affiche un état de chargement
    submitButton.disabled = true;
    submitButton.innerHTML = '<span>Envoi en cours...</span>';
    
    // Simulation d'une requête
    setTimeout(() => {
      // Génère un lien mailto avec les données
      const mailtoLink = `mailto:clement.g.developer@gmail.com?subject=${encodeURIComponent(data.subject || 'Contact depuis le portfolio')}&body=${encodeURIComponent(
        `Nom: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
      )}`;
      
      // Ouvre le client mail
      window.location.href = mailtoLink;
      
      // Remet le bouton à l'état normal
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
      
      // Affiche une notification de succès
      showNotification('Votre client mail s\'est ouvert avec le message pré-rempli !', 'success');
      
      // Ferme la modal après un délai
      setTimeout(() => {
        closeContactModal();
        contactModalForm.reset();
      }, 1500);
      
    }, 1000);
  }
  
  /**
   * Affiche une notification
   */
  function showNotification(message, type = 'info') {
    // Utilise le système de toast existant si disponible
    if (window.showToast) {
      window.showToast('Contact', message, type);
      return;
    }
    
    // Fallback avec alert
    alert(message);
  }
  
  /**
   * Attache tous les événements
   */
  function attachEvents() {
    if (!contactModal) return;
    
    // Boutons d'ouverture
    if (contactModalTrigger) {
      contactModalTrigger.addEventListener('click', openContactModal);
    }
    
    if (contactSectionTrigger) {
      contactSectionTrigger.addEventListener('click', openContactModal);
    }
    
    // Boutons du dock (peuvent être ajoutés dynamiquement)
    document.addEventListener('click', function(event) {
      if (event.target.classList.contains('contact-modal-trigger') || 
          event.target.closest('.contact-modal-trigger')) {
        event.preventDefault();
        openContactModal();
      }
    });
    
    // Bouton de fermeture
    if (contactModalClose) {
      contactModalClose.addEventListener('click', closeContactModal);
    }
    
    // Clic sur l'overlay
    if (contactModalOverlay) {
      contactModalOverlay.addEventListener('click', handleOverlayClick);
    }
    
    // Navigation par tabulation
    contactModal.addEventListener('keydown', handleTabNavigation);
    
    // Soumission du formulaire
    if (contactModalForm) {
      contactModalForm.addEventListener('submit', handleFormSubmit);
    }
  }
  
  /**
   * Initialise la modal de contact
   */
  function initContactModal() {
    initElements();
    
    if (!contactModal) {
      console.warn('Contact modal not found');
      return;
    }
    
    attachEvents();
    
    // Initialise l'état ARIA
    contactModal.setAttribute('aria-hidden', 'true');
    
    console.log('Contact modal initialized');
  }
  
  /**
   * Point d'entrée principal
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initContactModal);
    } else {
      initContactModal();
    }
  }
  
  // Expose les fonctions globalement si nécessaire
  window.contactModal = {
    open: openContactModal,
    close: closeContactModal
  };
  
  // Démarre l'initialisation
  init();
  
})();
