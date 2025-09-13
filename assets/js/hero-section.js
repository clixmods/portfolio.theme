/**
 * Hero Section Interactive JavaScript
 * 
 * This script handles interactions for the new hero centered layout:
 * - Navigation pills hover effects
 * - Action buttons click events
 * - Technology badges animations
 * - Smooth scrolling functionality
 * 
 * Author: Portfolio Theme
 * Date: 2025
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Hero section JavaScript loaded');

    // Status Badge Click for More Info (Optional)
    const statusBadge = document.querySelector('.status-badge');
    if (statusBadge) {
        statusBadge.addEventListener('click', function() {
            // Add a small pulse effect on click
            this.style.transform = 'translateX(-50%) scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'translateX(-50%) scale(1)';
            }, 200);
        });
    }

    // Navigation pills interaction - REMOVED (existing dock system)

    // Action buttons interaction
    const primaryBtn = document.querySelector('.btn-primary');
    const secondaryBtn = document.querySelector('.btn-secondary');

    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            console.log('Primary action clicked: Contact');
            // Ouvre la modal de contact
            let contactModalTrigger = document.getElementById('contact-modal-trigger');
            if (!contactModalTrigger) {
                // Fallback : cherche par ID alternatif
                contactModalTrigger = document.getElementById('contact-modal-trigger-dock');
            }
            if (!contactModalTrigger) {
                // Fallback : cherche par classe
                contactModalTrigger = document.querySelector('.contact-modal-trigger');
            }
            
            if (contactModalTrigger) {
                contactModalTrigger.click();
            } else {
                // Fallback : utilise la fonction globale de contact modal si disponible
                if (window.contactModal && window.contactModal.open) {
                    window.contactModal.open();
                } else {
                    // Dernier fallback : scroll vers la section contact si elle existe
                    const contactSection = document.querySelector('#contact');
                    if (contactSection) {
                        contactSection.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            }
        });
    }

    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', function() {
            console.log('Secondary action clicked: Télécharger CV');
            // Go to CV page with auto-print in current language
            const path = window.location.pathname || '/';
            const isEn = path.startsWith('/en/');
            const target = isEn ? '/en/cv/?download=1' : '/cv/?download=1';
            window.location.href = target;
        });
    }

    // Technology badges hover animation
    const techBadges = document.querySelectorAll('.tech-badge');
    techBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-1px) scale(1)';
        });

        badge.addEventListener('click', function() {
            console.log('Technology badge clicked:', this.textContent);
            // Add navigation to technology-specific content
        });
    });

    // Course cards interaction - Navigation vers tes sections
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        card.addEventListener('click', function() {
            const courseName = this.querySelector('h3').textContent;
            console.log('Course card clicked:', courseName);
            
            // Navigation based on card content
            let targetSection = null;
            if (courseName.includes('Jeux')) {
                targetSection = document.querySelector('#projets');
            } else if (courseName.includes('Web')) {
                targetSection = document.querySelector('#projets');
            } else if (courseName.includes('Outils')) {
                targetSection = document.querySelector('#projets');
            } else if (courseName.includes('Projet')) {
                targetSection = document.querySelector('#experiences');
            }
            
            if (targetSection) {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll indicator functionality
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            // Smooth scroll to the next section
            const nextSection = document.querySelector('#recommandations, main .main-content section:first-child');
            if (nextSection) {
                nextSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Avatar click for easter egg
    const heroAvatar = document.querySelector('.hero-profile-image');
    if (heroAvatar) {
        let clickCount = 0;
        heroAvatar.addEventListener('click', function() {
            clickCount++;
            this.style.transform = `scale(${1 + clickCount * 0.05})`;
            
            if (clickCount >= 5) {
                // Easter egg after 5 clicks
                this.style.filter = 'hue-rotate(360deg)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                    this.style.filter = 'none';
                    clickCount = 0;
                }, 1000);
            }
        });
    }

    // Add floating animation to avatar badge
    const avatarBadge = document.querySelector('.avatar-badge');
    if (avatarBadge) {
        setInterval(() => {
            avatarBadge.style.animation = 'none';
            setTimeout(() => {
                avatarBadge.style.animation = 'bounce 1s ease-in-out';
            }, 10);
        }, 5000);
    }

    // Subtle gradient text animation for hero actions
    const heroActions = document.querySelectorAll('.hero-action');
    
    // Initial setup - hide actions for dramatic reveal
    heroActions.forEach((action, index) => {
        action.style.opacity = '0';
        action.style.transform = 'translateY(20px)';
    });
    
    // Staggered reveal animation
    heroActions.forEach((action, index) => {
        setTimeout(() => {
            action.style.transition = 'all 0.6s ease-out';
            action.style.opacity = '1';
            action.style.transform = 'translateY(0)';
            
        }, index * 300); // 300ms delay between each word
    });
    
    // Subtle interactive effects
    heroActions.forEach((action, index) => {
        action.addEventListener('mouseenter', function() {
            this.style.animationDuration = '2s';
        });
        
        action.addEventListener('mouseleave', function() {
            this.style.animationDuration = '4s';
        });
    });

    // Parallax effect for course cards on scroll (subtle)
    let isScrolling = false;
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                const scrollY = window.scrollY;
                const courseCards = document.querySelectorAll('.course-card');
                
                courseCards.forEach((card, index) => {
                    const offset = scrollY * 0.1 * (index + 1);
                    card.style.transform = `translateY(${offset}px)`;
                });
                
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
});

// CSS Animation keyframes (added dynamically)
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .tech-badge:hover {
        cursor: pointer;
    }

    .course-card:hover {
        cursor: pointer;
    }

    .hero-scroll-indicator:hover {
        cursor: pointer;
        color: #ff6b35;
    }

    .hero-profile-image:hover {
        cursor: pointer;
    }
`;
document.head.appendChild(style);
