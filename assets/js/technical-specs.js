// Technical Specifications Enhancement Script
// Améliore l'expérience utilisateur des spécifications techniques cliquables

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Technical Specifications Enhancement loaded');
    
    // Ajouter des tooltips aux pills cliquables
    const clickableTechs = document.querySelectorAll('.tech-pill-spec.clickable-tech');
    
    clickableTechs.forEach(function(pill) {
        // Ajouter un title pour le tooltip
        pill.setAttribute('title', 'Cliquez pour voir les détails et projets associés');
        
        // Ajouter un effet de feedback visuel au clic
        pill.addEventListener('click', function() {
            // Petit effet de "flash" pour confirmer le clic
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
        
        // Log pour debug
        console.log('📊 Tech pill enhanced:', pill.textContent.trim());
    });
    
    // Améliorer l'accessibilité avec le support clavier
    clickableTechs.forEach(function(pill) {
        pill.setAttribute('tabindex', '0');
        pill.setAttribute('role', 'button');
        pill.setAttribute('aria-label', 'Voir les détails de ' + pill.textContent.trim());
        
        pill.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    console.log('✅ Enhanced', clickableTechs.length, 'clickable technology pills');
});

// Fonction pour animer l'entrée des spécifications techniques
function animateTechnicalSpecs() {
    // Support both legacy and new prefixed class names during migration
    const specItems = document.querySelectorAll('.project-widget-spec-item, .spec-item');
    
    specItems.forEach(function(item, index) {
        // Petit délai pour chaque item
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Lancer l'animation quand la section devient visible
const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            animateTechnicalSpecs();
            observer.unobserve(entry.target);
        }
    });
});

// Observer la section des spécifications techniques
document.addEventListener('DOMContentLoaded', function() {
    const techSpecsList = document.querySelector('.project-widget-technical-specs-list, .technical-specs-list');
    if (techSpecsList) {
        observer.observe(techSpecsList);
    }
});

// Fonction de débogage pour vérifier les données passées à openSkillModal
window.debugSkillModal = function(name, icon, level, experience, iconType) {
    console.log('=== DEBUG SKILL MODAL ===');
    console.log('Name:', name);
    console.log('Icon:', icon);
    console.log('Level:', level);
    console.log('Experience:', experience);
    console.log('IconType:', iconType);
    console.log('=========================');
    
    // Appeler la fonction originale
    if (typeof openSkillModal === 'function') {
        openSkillModal(name, icon, level, experience, iconType);
    } else {
        console.error('openSkillModal function not found!');
    }
};
