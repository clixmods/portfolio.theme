/**
 * DEPRECATED: Legacy Discord modal implementation
 * This file is intentionally left blank and should not be referenced.
 * The unified modal system replaces this implementation (see unified-modal-system.js).
 */

(function(){
  if (typeof window !== 'undefined') {
    console.warn('[deprecated] discord-handler.js is deprecated. Use UnifiedModal.create({type:"discord", ...}) instead.');
  }
})();

/**
 * Discord Handler - Gestion du clic sur le bouton Discord
 * Affiche une modal avec l'ID Discord à copier ou copie directement dans le presse-papier
 * Version: 1.0.0
 */

(function() {
  'use strict';

  // Configuration
  const DISCORD_ID = window.discordData ? window.discordData.id : "clixmods";
  const NOTIFICATION_DURATION = 3000; // 3 seconds

  /**
   * Creates a modal to display the Discord ID
   */
  function createDiscordModal() {
    // Check if modal already exists
    const existingModal = document.querySelector('#discord-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // Create the modal
    const modal = document.createElement('div');
    modal.id = 'discord-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content discord-modal">
        <div class="modal-header">
          <h3>Mon ID Discord</h3>
          <button class="modal-close" aria-label="Fermer">&times;</button>
        </div>
        <div class="modal-body">
          <p>Voici mon ID Discord :</p>
          <div class="discord-id-container">
            <code class="discord-id">${DISCORD_ID}</code>
            <button class="copy-btn" title="Copier l'ID">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
            </button>
          </div>
          <p class="discord-note">Tu peux m'ajouter sur Discord ou m'envoyer un message !</p>
        </div>
      </div>
    `;

    // Add to DOM
    document.body.appendChild(modal);

    // Event handlers for the modal
    const closeBtn = modal.querySelector('.modal-close');
    const copyBtn = modal.querySelector('.copy-btn');

    // Close the modal
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Copy the ID
    copyBtn.addEventListener('click', function() {
      copyToClipboard(DISCORD_ID);
      closeModal();
    });

    // Close with Escape
    document.addEventListener('keydown', handleEscapeKey);

    // Display modal with animation
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
  }

  /**
   * Closes the Discord modal
   */
  function closeModal() {
    const modal = document.querySelector('#discord-modal');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.remove();
        document.removeEventListener('keydown', handleEscapeKey);
      }, 300);
    }
  }

  /**
   * Gère la touche Échap pour fermer la modal
   */
  function handleEscapeKey(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }

  /**
   * Copy text to clipboard
   */
  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      // Modern method
      navigator.clipboard.writeText(text).then(() => {
        showDiscordNotification('ID Discord copié dans le presse-papier !', 'success');
      }).catch(() => {
        fallbackCopyToClipboard(text);
      });
    } else {
      // Fallback method
      fallbackCopyToClipboard(text);
    }
  }

  /**
   * Méthode de fallback pour copier dans le presse-papier
   */
  function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      showDiscordNotification('ID Discord copié dans le presse-papier !', 'success');
    } catch (err) {
      showDiscordNotification('Impossible de copier automatiquement. ID: ' + text, 'error');
    }

    document.body.removeChild(textArea);
  }

  /**
   * Displays a notification using the site's existing system
   */
  function showDiscordNotification(message, type = 'success') {
    // Use the site's existing notification system
    if (window.showNotification && typeof window.showNotification === 'function') {
      window.showNotification(message, type, { duration: 3000 });
    } else if (window.rightDockManager && window.rightDockManager.showNotification) {
      window.rightDockManager.showNotification(message, type);
    } else {
      // Simple fallback if systems are not available
      alert(message); // Very simple fallback
    }
  }

  /**
   * Handles Discord button click
   */
  function handleDiscordClick(e) {
    e.preventDefault();
    
    // Option 1: Copy directly (for quick test)
    // copyToClipboard(DISCORD_ID);
    
    // Option 2: Open the modal (default)
    createDiscordModal();
  }

  /**
   * Initialize Discord handler
   */
  function initDiscordHandler() {
    // Wait for DOM to be loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupDiscordButton);
    } else {
      setupDiscordButton();
    }
  }

  /**
   * Configure le bouton Discord
   */
  function setupDiscordButton() {
    const discordButton = document.querySelector('a[data-social="discord"]');
    if (discordButton) {
      discordButton.addEventListener('click', handleDiscordClick);
    }
  }

  // Initialize when the script loads
  initDiscordHandler();

})();
