/**
 * Personal Notifications System
 * Messages personnalisés de Clément pour certaines pages
 * Version: 1.0.0
 */

(function() {
  'use strict';

  // Configuration des messages personnalisés par page
  const personalMessages = {
    // Projet Stone Keeper
    'stone-keepers': {
      title: "Message de Clément",
      message: "Stone Keeper est l'un de mes premiers projets perso, c'est un mélange de l'univers de l'Atlantide basé sur mon film d'enfance Atlantide, l'Empire Perdu et du jeu Tunic",
      type: "info",
      icon: "💬"
    },
    
    // Projet Farm (carte zombies)
    'farm-remastered': {
      title: "Message de Clément", 
      message: "Première carte zombies que j'ai publiée sur le workshop. Je m'étais donné en challenge 1 mois pour la faire, j'en suis content",
      type: "info",
      icon: "💬"
    },
    
    // Profil d'Agathe
    'agathe-roux': {
      title: "Message de Clément",
      message: "Agathe est une super artiste, très dévouée et passionnée. J'ai malheureusement pas fait plus de projets avec elle, il faut que je me rattrape",
      type: "info", 
      icon: "💬"
    }
  };

  /**
   * Détermine l'identifiant de la page actuelle
   */
  function getCurrentPageId() {
    const path = window.location.pathname;
    
    // Pour les projets: /projects/nom-du-projet/
    if (path.includes('/projects/')) {
      const projectMatch = path.match(/\/projects\/([^\/]+)\/?/);
      if (projectMatch) {
        return projectMatch[1];
      }
    }
    
    // Pour les profils de personnes: /people/nom-personne/
    if (path.includes('/people/')) {
      const personMatch = path.match(/\/people\/([^\/]+)\/?/);
      if (personMatch) {
        return personMatch[1];
      }
    }
    
    return null;
  }

  // Variable pour éviter les doubles notifications
  let notificationShown = false;

  /**
   * Utilise le système de toast existant qui marche déjà (comme le changement de thème)
   */
  function showPersonalToast(config) {
    console.log('🎨 showPersonalToast avec le système existant:', config);
    
    // Utiliser exactement le même système que le changement de thème
    const personalMessage = `${config.icon} Message de Clément: ${config.message}`;
    
    // Essayer d'utiliser showNotification du right-dock (comme pour le thème)
    if (window.showNotification && typeof window.showNotification === 'function') {
      console.log('✅ Utilisation du système toast existant (showNotification)');
      window.showNotification(personalMessage, config.type);
      return;
    }
    
    // Fallback via rightDockManager
    if (window.rightDockManager && window.rightDockManager.showNotification) {
      console.log('✅ Utilisation du système toast existant (rightDockManager)');
      window.rightDockManager.showNotification(personalMessage, config.type);
      return;
    }
    
    console.log('❌ Aucun système de toast trouvé - on affiche quand même');
  }

  /**
   * Affiche la notification personnalisée si elle existe
   */
  function showPersonalNotificationIfExists() {
    // Éviter les doublons
    if (notificationShown) {
      console.log('⚠️ Personal Notifications - Notification déjà affichée, abandon');
      return;
    }

    const pageId = getCurrentPageId();
    
    console.log('🔍 Personal Notifications - Page ID détecté:', pageId);
    console.log('🔍 Personal Notifications - Messages disponibles:', Object.keys(personalMessages));
    
    if (!pageId) {
      console.log('❌ Personal Notifications - Aucun ID de page détecté');
      return;
    }
    
    if (!personalMessages[pageId]) {
      console.log('❌ Personal Notifications - Aucun message configuré pour cette page');
      return;
    }
    
    const config = personalMessages[pageId];
    console.log('✅ Personal Notifications - Configuration trouvée:', config);
    
    // Marquer comme en cours de traitement
    notificationShown = true;
    
    // Fonction pour essayer d'afficher la notification avec retry
    function tryShowNotification(attempts = 0) {
      const maxAttempts = 15;
      
      console.log(`🕐 Personal Notifications - Tentative ${attempts + 1}/${maxAttempts}`);
      console.log('🔍 Personal Notifications - window.addNotification disponible?', !!window.addNotification);
      console.log('🔍 Personal Notifications - rightDockManager disponible?', !!window.rightDockManager);
      console.log('🔍 Personal Notifications - showNotification disponible?', !!window.showNotification);
      
      // Utiliser les DEUX systèmes comme le fait le changement de thème
      if (window.addNotification && typeof window.addNotification === 'function') {
        console.log('✅ Personal Notifications - Utilisation des systèmes combinés');
        
        // 1. Notification flottante personnalisée avec avatar
        showPersonalToast(config);
        
        // 2. Ajouter à la liste du dropdown
        window.addNotification(config.title, config.message, config.type);
        return;
      }
      
      // Utiliser le système de notifications du right dock
      if (window.rightDockManager && window.rightDockManager.addNotification) {
        console.log('✅ Personal Notifications - Utilisation de rightDockManager combiné');
        
        // 1. Notification flottante personnalisée avec avatar
        showPersonalToast(config);
        
        // 2. Ajouter à la liste du dropdown
        window.rightDockManager.addNotification(config.title, config.message, config.type);
        return;
      }
      
      // Fallback sur la fonction globale showNotification uniquement
      if (window.showNotification) {
        console.log('✅ Personal Notifications - Utilisation de showNotification fallback seul');
        window.showNotification(`${config.icon} ${config.message}`, config.type, 8000);
        return;
      }
      
      // Toast notification si disponible  
      if (window.showToast) {
        console.log('✅ Personal Notifications - Utilisation de showToast fallback');
        window.showToast(config.title, config.message, config.type);
        return;
      }
      
      // Si aucun système n'est disponible et qu'on a encore des tentatives
      if (attempts < maxAttempts) {
        console.log(`⏳ Personal Notifications - Retry dans 400ms... (${attempts + 1}/${maxAttempts})`);
        setTimeout(() => tryShowNotification(attempts + 1), 400);
        return;
      }
      
      // Fallback simple en dernier recours
      console.log('⚠️ Personal Notifications - Aucun système de notification trouvé après toutes les tentatives, utilisation du fallback');
      console.log(`${config.icon} ${config.title}: ${config.message}`);
      
      // Créer une notification simple en dernier recours
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #007acc, #0099ff);
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        z-index: 10002;
        max-width: 350px;
        box-shadow: 0 8px 25px rgba(0, 122, 204, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.4;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      `;
      notification.innerHTML = `${config.icon} <strong>${config.title}:</strong><br>${config.message}`;
      document.body.appendChild(notification);
      
      // Animation d'entrée
      requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
      });
      
      // Auto-supprimer après 8 secondes
      setTimeout(() => {
        if (notification.parentElement) {
          notification.style.transform = 'translateX(100%)';
          setTimeout(() => {
            if (notification.parentElement) {
              notification.remove();
            }
          }, 300);
        }
      }, 8000);
    }
    
    // Commencer à essayer d'afficher la notification après un petit délai
    setTimeout(() => tryShowNotification(), 1000);
  }

  /**
   * Initialisation
   */
  function initPersonalNotifications() {
    // Vérifier si on est sur une page qui a un message personnalisé
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showPersonalNotificationIfExists);
    } else {
      showPersonalNotificationIfExists();
    }
  }

  // Protection contre les exécutions multiples
  if (window.personalNotificationsInitialized) {
    console.log('⚠️ Personal notifications already initialized, skipping...');
    return;
  }
  
  window.personalNotificationsInitialized = true;
  
  // Initialiser le système
  initPersonalNotifications();
  
  // Aussi initialiser au window.onload pour être sûr
  window.addEventListener('load', () => {
    console.log('🔄 Personal notifications - window.onload triggered, re-checking...');
    showPersonalNotificationIfExists();
  });
  
  // Debug info
  console.log('✅ Personal notifications system initialized');
  
})();
