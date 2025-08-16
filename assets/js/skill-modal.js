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
    
    // Vider la liste et créer les éléments DOM proprement
    projectsList.innerHTML = '';
    
    relatedProjects.forEach(project => {
        // S'assurer que les technologies sont un tableau pour l'affichage
        let technologies = project.technologies;
        if (typeof technologies === 'string') {
            try {
                technologies = JSON.parse(technologies);
            } catch (e) {
                technologies = [];
            }
        }
        
        // Nettoyer le projet avant de l'utiliser
        const cleanedProject = cleanProject(project);
        
        // Debug: afficher l'URL du projet nettoyée
        console.log(`Projet "${cleanedProject.title}" - URL: "${cleanedProject.url}"`);
        
        // Créer l'élément principal de la tuile de projet
        const projectTile = createProjectTile(cleanedProject, technologies);
        projectsList.appendChild(projectTile);
    });
}

// Fonction pour nettoyer les guillemets superflus des valeurs JSON
function cleanJsonValue(value) {
    if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
        return value.slice(1, -1); // Supprimer le premier et dernier caractère
    }
    return value;
}

// Fonction pour nettoyer un objet projet de tous ses guillemets superflus
function cleanProject(project) {
    const cleaned = {};
    for (const [key, value] of Object.entries(project)) {
        cleaned[key] = cleanJsonValue(value);
    }
    return cleaned;
}

// Fonction pour créer une tuile de projet avec des éléments DOM
function createProjectTile(cleanedProject, technologies) {
    console.log(`Création de la tuile pour:`, cleanedProject);
    
    // Conteneur principal
    const projectTile = document.createElement('div');
    projectTile.className = 'project-item modal-project-tile';
    
    // Icône de tuile
    const tileIcon = document.createElement('div');
    tileIcon.className = 'project-tile-icon';
    tileIcon.textContent = '🎯';
    projectTile.appendChild(tileIcon);
    
    // Conteneur de l'image
    const imageContainer = document.createElement('div');
    imageContainer.className = 'project-tile-image';
    
    const image = document.createElement('img');
    image.src = cleanedProject.image || '/images/placeholder-project.jpg';
    image.alt = cleanedProject.title;
    image.loading = 'lazy';
    image.onerror = function() {
        this.src = '/images/placeholder-project.jpg';
    };
    
    const overlay = document.createElement('div');
    overlay.className = 'project-tile-overlay';
    
    imageContainer.appendChild(image);
    imageContainer.appendChild(overlay);
    projectTile.appendChild(imageContainer);
    
    // Contenu par défaut (visible par défaut)
    const defaultContent = document.createElement('div');
    defaultContent.className = 'project-tile-content';
    
    const title = document.createElement('h6');
    title.className = 'project-name';
    title.textContent = cleanedProject.title;
    
    const description = document.createElement('p');
    description.className = 'project-desc';
    description.textContent = cleanedProject.subtitle || cleanedProject.description || 'Découvrez ce projet innovant et ses fonctionnalités.';
    
    defaultContent.appendChild(title);
    defaultContent.appendChild(description);
    projectTile.appendChild(defaultContent);
    
    // Informations détaillées (affichées au hover)
    const detailedInfo = document.createElement('div');
    detailedInfo.className = 'project-tile-info';
    
    const infoContent = document.createElement('div');
    infoContent.className = 'project-tile-info-content';
    
    const detailTitle = document.createElement('h6');
    detailTitle.className = 'project-name';
    detailTitle.textContent = cleanedProject.title;
    
    const detailDescription = document.createElement('p');
    detailDescription.className = 'project-detailed-desc';
    detailDescription.textContent = cleanedProject.description || cleanedProject.subtitle || 'Découvrez ce projet innovant et ses fonctionnalités.';
    
    infoContent.appendChild(detailTitle);
    infoContent.appendChild(detailDescription);
    
    // Technologies
    if (technologies && technologies.length > 0) {
        const techContainer = document.createElement('div');
        techContainer.className = 'project-tile-tech';
        
        technologies.slice(0, 4).forEach(tech => {
            const techItem = document.createElement('span');
            techItem.className = 'project-tile-tech-item';
            techItem.textContent = tech;
            techContainer.appendChild(techItem);
        });
        
        if (technologies.length > 4) {
            const moreItem = document.createElement('span');
            moreItem.className = 'project-tile-tech-item';
            moreItem.textContent = `+${technologies.length - 4}`;
            techContainer.appendChild(moreItem);
        }
        
        infoContent.appendChild(techContainer);
    }
    
    // Actions du projet
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'project-tile-actions';
    
    if (cleanedProject.url) {
        const projectLink = document.createElement('a');
        projectLink.href = cleanedProject.url;
        projectLink.className = 'project-tile-btn';
        projectLink.onclick = function(event) {
            event.stopPropagation();
        };
        
        // Créer le SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '12');
        svg.setAttribute('height', '12');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'currentColor');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z');
        
        svg.appendChild(path);
        projectLink.appendChild(svg);
        projectLink.appendChild(document.createTextNode(' Voir projet'));
        
        actionsContainer.appendChild(projectLink);
    } else {
        const confidentialSpan = document.createElement('span');
        confidentialSpan.className = 'project-tile-btn';
        confidentialSpan.style.opacity = '0.6';
        
        // Créer le SVG pour confidentiel
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '12');
        svg.setAttribute('height', '12');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'currentColor');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10.1V11.1C14.8,11.6 14.4,12 13.9,12H10.1C9.6,12 9.2,11.6 9.2,11.1V10.1C9.2,8.6 10.6,7 12,7Z');
        
        svg.appendChild(path);
        confidentialSpan.appendChild(svg);
        confidentialSpan.appendChild(document.createTextNode(' Confidentiel'));
        
        actionsContainer.appendChild(confidentialSpan);
    }
    
    infoContent.appendChild(actionsContainer);
    detailedInfo.appendChild(infoContent);
    projectTile.appendChild(detailedInfo);
    
    return projectTile;
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
