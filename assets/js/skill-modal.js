// Gestion des modals pour les compétences/technologies
let skillModalData = null;

// Fonction pour ouvrir la modal avec les détails d'une compétence
function openSkillModal(name, icon, level, experience, iconType) {
    const modal = document.getElementById('skillModal');
    const modalName = document.getElementById('modalSkillName');
    const modalIcon = document.getElementById('modalSkillIcon');
    const modalLevel = document.getElementById('modalSkillLevel');
    const modalExperience = document.getElementById('modalSkillExperience');
    
    // Remplir les informations de base
    modalName.textContent = name;
    modalLevel.textContent = level || 'Non spécifié';
    modalExperience.textContent = experience || 'Non spécifié';
    
    // Gérer l'icône
    if (iconType === 'svg') {
        modalIcon.innerHTML = `<img src="${icon}" alt="${name}" class="modal-tech-icon-svg" width="48" height="48">`;
    } else {
        modalIcon.innerHTML = `<span class="modal-tech-icon-emoji">${icon}</span>`;
    }
    
    // Charger les projets associés
    loadProjectsForSkill(name);
    
    // Afficher la modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Empêcher le scroll de la page
}

// Fonction pour fermer la modal
function closeSkillModal() {
    const modal = document.getElementById('skillModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Rétablir le scroll de la page
}

// Fonction pour charger les projets associés à une compétence/technologie
function loadProjectsForSkill(skillName) {
    const projectsList = document.getElementById('modalProjectsList');
    projectsList.innerHTML = '<div class="loading">Chargement des projets...</div>';
    
    try {
        // Utiliser les données intégrées dans la page au lieu de faire une requête API
        const projects = window.portfolioProjects || [];
        console.log('Projets récupérés depuis les données intégrées:', projects.length);
        console.log('Recherche de projets pour la compétence:', skillName);
        displayProjects(projects, skillName, projectsList);
    } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
        projectsList.innerHTML = '<div class="no-projects">❌ Erreur lors du chargement des projets.<br/>Veuillez rafraîchir la page.</div>';
    }
}

// Fonction pour afficher les projets filtrés avec le nouveau design PS5
function displayProjects(projects, skillName, projectsList) {
    console.log('=== DÉBUT DU FILTRAGE ===');
    console.log('Filtrage des projets pour:', skillName);
    console.log('Projets disponibles:', projects.length);
    
    const relatedProjects = projects.filter(project => {
        console.log(`\nAnalyse du projet: "${project.title}"`);
        console.log(`Technologies du projet RAW:`, project.technologies);
        console.log(`Type:`, typeof project.technologies);
        console.log(`Est un tableau:`, Array.isArray(project.technologies));
        
        let technologies = project.technologies;
        
        // Si c'est une string, essayer de la parser en JSON
        if (typeof technologies === 'string') {
            try {
                technologies = JSON.parse(technologies);
                console.log(`Technologies après parsing:`, technologies);
                console.log(`Type après parsing:`, typeof technologies);
                console.log(`Est un tableau après parsing:`, Array.isArray(technologies));
            } catch (e) {
                console.log(`❌ Erreur de parsing JSON pour "${project.title}":`, e.message);
                return false;
            }
        }
        
        if (!technologies || !Array.isArray(technologies)) {
            console.log(`❌ Projet "${project.title}" rejeté: technologies invalides ou manquantes`);
            return false;
        }
        
        // Recherche exacte et aussi recherche insensible à la casse
        const hasSkill = technologies.some(tech => {
            const exactMatch = tech === skillName;
            const caseInsensitiveMatch = tech.toLowerCase() === skillName.toLowerCase();
            console.log(`  Comparaison: "${tech}" vs "${skillName}" -> exact: ${exactMatch}, insensible: ${caseInsensitiveMatch}`);
            return exactMatch || caseInsensitiveMatch;
        });
        
        if (hasSkill) {
            console.log(`✅ Projet "${project.title}" ACCEPTÉ avec technologies:`, technologies);
        } else {
            console.log(`❌ Projet "${project.title}" rejeté: aucune technologie correspondante`);
        }
        return hasSkill;
    });
    
    console.log('=== RÉSULTAT DU FILTRAGE ===');
    console.log('Projets filtrés trouvés:', relatedProjects.length);
    relatedProjects.forEach(p => console.log(`- ${p.title}`));
    
    if (relatedProjects.length === 0) {
        projectsList.innerHTML = '<div class="no-projects">🚀 Aucun projet trouvé pour cette technologie.<br/>De nouveaux projets arrivent bientôt !</div>';
        return;
    }
    
    // Générer le HTML pour les cartes de projets style PS5
    const projectsHTML = relatedProjects.map(project => {
        // S'assurer que les technologies sont un tableau pour l'affichage
        let technologies = project.technologies;
        if (typeof technologies === 'string') {
            try {
                technologies = JSON.parse(technologies);
            } catch (e) {
                technologies = [];
            }
        }
        
        return `
        <div class="modal-project-card">
            <div class="modal-project-image">
                <img src="${project.background_image || project.image || '/images/placeholder-project.jpg'}" alt="${project.title}" loading="lazy">
                <div class="modal-project-overlay"></div>
            </div>
            <div class="modal-project-content">
                <h4 class="modal-project-title">${project.title}</h4>
                <p class="modal-project-subtitle">${project.subtitle || project.description || 'Découvrez ce projet innovant et ses fonctionnalités.'}</p>
                <div class="modal-project-tech">
                    ${technologies.slice(0, 3).map(tech => `<span class="modal-project-tech-item">${tech}</span>`).join('')}
                    ${technologies.length > 3 ? `<span class="modal-project-tech-item">+${technologies.length - 3}</span>` : ''}
                </div>
                <div class="modal-project-meta">
                    <span class="modal-project-year">${project.year || new Date().getFullYear()}</span>
                    ${project.url ? `<a href="${project.url}" class="modal-project-link">
                        Voir le projet
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </a>` : ''}
                </div>
            </div>
        </div>
    `;
    }).join('');
    
    projectsList.innerHTML = projectsHTML;
}

// Fermer la modal en cliquant sur Échap
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSkillModal();
    }
});

// Empêcher la fermeture de la modal en cliquant à l'intérieur
document.addEventListener('DOMContentLoaded', function() {
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Normaliser les données des projets pour s'assurer que les technologies sont des tableaux
    if (window.portfolioProjects && Array.isArray(window.portfolioProjects)) {
        window.portfolioProjects = window.portfolioProjects.map(project => {
            if (project.technologies && typeof project.technologies === 'string') {
                try {
                    project.technologies = JSON.parse(project.technologies);
                } catch (e) {
                    console.error(`Erreur lors du parsing des technologies pour ${project.title}:`, e);
                    project.technologies = [];
                }
            }
            return project;
        });
        console.log('Données des projets normalisées!');
    }
    
    // Déboguer les données des projets chargées
    console.log('Données des projets chargées:', window.portfolioProjects?.length || 0);
    if (window.portfolioProjects?.length > 0) {
        console.log('Premier projet exemple:', window.portfolioProjects[0]);
        
        // Afficher TOUS les projets avec leurs technologies
        console.log('=== LISTE COMPLÈTE DES PROJETS ET LEURS TECHNOLOGIES ===');
        window.portfolioProjects.forEach((project, index) => {
            console.log(`${index + 1}. ${project.title}:`);
            console.log(`   Technologies RAW:`, project.technologies);
            console.log(`   Type de technologies:`, typeof project.technologies);
            console.log(`   Est un tableau:`, Array.isArray(project.technologies));
            
            // Si c'est une string, essayer de la parser
            if (typeof project.technologies === 'string') {
                try {
                    const parsed = JSON.parse(project.technologies);
                    console.log(`   Technologies parsées:`, parsed);
                    console.log(`   Type après parsing:`, typeof parsed);
                    console.log(`   Est un tableau après parsing:`, Array.isArray(parsed));
                } catch (e) {
                    console.log(`   Erreur de parsing:`, e.message);
                }
            }
            
            if (Array.isArray(project.technologies)) {
                console.log(`   Nombre d'éléments:`, project.technologies.length);
                project.technologies.forEach((tech, techIndex) => {
                    console.log(`     ${techIndex + 1}. "${tech}" (type: ${typeof tech})`);
                });
            }
            console.log('   ---');
        });
        
        console.log('Technologies disponibles:', 
            [...new Set(window.portfolioProjects.flatMap(p => p.technologies || []))].sort()
        );
        
        // Test spécifique pour Stone Keeper 2
        const stoneKeeper2 = window.portfolioProjects.find(p => p.title === "Stone Keeper 2");
        if (stoneKeeper2) {
            console.log('Stone Keeper 2 trouvé:', stoneKeeper2);
            console.log('Ses technologies:', stoneKeeper2.technologies);
        } else {
            console.log('Stone Keeper 2 NON trouvé dans les données');
        }
    }
});
