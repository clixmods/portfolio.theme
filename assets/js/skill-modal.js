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
async function loadProjectsForSkill(skillName) {
    const projectsList = document.getElementById('modalProjectsList');
    projectsList.innerHTML = '<div class="loading">Chargement des projets...</div>';
    
    try {
        // Essayer d'abord de récupérer depuis l'endpoint JSON
        const response = await fetch('/data/projects/');
        if (response.ok) {
            const projects = await response.json();
            displayProjects(projects, skillName, projectsList);
        } else {
            throw new Error('API non disponible');
        }
    } catch (error) {
        console.log('Chargement depuis API échoué, utilisation des données DOM:', error);
        // Fallback: chercher les projets dans les données déjà présentes sur la page
        loadProjectsFromDOM(skillName, projectsList);
    }
}

// Fonction pour afficher les projets filtrés avec le nouveau design PS5
function displayProjects(projects, skillName, projectsList) {
    const relatedProjects = projects.filter(project => 
        project.technologies && project.technologies.includes(skillName)
    );
    
    if (relatedProjects.length === 0) {
        projectsList.innerHTML = '<div class="no-projects">🚀 Aucun projet trouvé pour cette technologie.<br/>De nouveaux projets arrivent bientôt !</div>';
        return;
    }
    
    // Générer le HTML pour les cartes de projets style PS5
    const projectsHTML = relatedProjects.map(project => `
        <div class="modal-project-card" onclick="window.open('${project.url}', '_blank')">
            <div class="modal-project-image">
                <img src="${project.background_image || project.image || '/images/placeholder-project.jpg'}" alt="${project.title}" loading="lazy">
                <div class="modal-project-overlay"></div>
            </div>
            <div class="modal-project-content">
                <h4 class="modal-project-title">${project.title}</h4>
                <p class="modal-project-subtitle">${project.subtitle || project.description || 'Découvrez ce projet innovant et ses fonctionnalités.'}</p>
                <div class="modal-project-tech">
                    ${project.technologies.slice(0, 3).map(tech => `<span class="modal-project-tech-item">${tech}</span>`).join('')}
                    ${project.technologies.length > 3 ? `<span class="modal-project-tech-item">+${project.technologies.length - 3}</span>` : ''}
                </div>
                <div class="modal-project-meta">
                    <span class="modal-project-year">${project.year || new Date().getFullYear()}</span>
                    ${project.url ? `<a href="${project.url}" class="modal-project-link" target="_blank" onclick="event.stopPropagation()">
                        Voir le projet
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </a>` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    projectsList.innerHTML = projectsHTML;
}

// Fonction alternative pour charger les projets depuis le DOM (si l'API n'est pas disponible)
function loadProjectsFromDOM(skillName, projectsList) {
    // Simuler des projets basés sur les données que nous connaissons
    const knownProjects = {
        "C#": [
            { 
                title: "Terra Memoria", 
                subtitle: "JRPG - Studio La Moutarde", 
                description: "Fin de production d'un jeu vidéo commercial sur Unity", 
                technologies: ["Unity", "C#", "Nintendo Switch", "Steam"], 
                url: "/projects/terra-memoria/",
                background_image: "/images/projects/terra-memoria/terra-memoria-background.jpg",
                image: "/images/projects/terra-memoria/terra-memoria-background.jpg",
                year: "2024"
            },
            { 
                title: "Unity Editor Tools", 
                subtitle: "Outils de développement personnalisés", 
                description: "Collection d'outils Unity pour améliorer le workflow de développement", 
                technologies: ["Unity", "C#", "Editor Scripting"], 
                url: "/projects/unity-editor-tools/",
                image: "/images/projects/unity-tools.jpg",
                year: "2023"
            },
            { 
                title: "My Game Showcase", 
                subtitle: "Plateforme web", 
                description: "Plateforme moderne de présentation de jeux avec interface interactive", 
                technologies: ["Blazor", ".NET 8", "C#"], 
                url: "/projects/my-game-showcase/",
                image: "/images/projects/game-showcase.jpg",
                year: "2024"
            }
        ],
        "Unity": [
            { 
                title: "Terra Memoria", 
                subtitle: "JRPG - Studio La Moutarde", 
                description: "Fin de production d'un jeu vidéo commercial sur Unity", 
                technologies: ["Unity", "C#", "Nintendo Switch", "Steam"], 
                url: "/projects/terra-memoria/",
                background_image: "/images/projects/terra-memoria/terra-memoria-background.jpg",
                image: "/images/projects/terra-memoria/terra-memoria-background.jpg",
                year: "2024"
            },
            { 
                title: "Bubble Wars", 
                subtitle: "Puzzle multijoueur", 
                description: "Jeu de puzzle multijoueur dynamique et addictif", 
                technologies: ["Unity", "C#", "Game Design"], 
                url: "/projects/bubble-wars/",
                image: "/images/projects/bubble-wars.jpg",
                year: "2023"
            },
            { 
                title: "Witchable", 
                subtitle: "Aventure magique", 
                description: "Aventure magique avec des mécaniques de sorts uniques", 
                technologies: ["Unity", "C#", "Game Design"], 
                url: "/projects/witchable/",
                image: "/images/projects/witchable.jpg",
                year: "2023"
            }
        ],
        "Blazor": [
            { 
                title: "My Game Showcase", 
                subtitle: "Plateforme web moderne", 
                description: "Plateforme web moderne construite avec les dernières technologies", 
                technologies: ["Blazor", ".NET 8", "FastEndpoint"], 
                url: "/projects/my-game-showcase/",
                image: "/images/projects/game-showcase.jpg",
                year: "2024"
            }
        ],
        "Game Design": [
            { 
                title: "Bubble Wars", 
                subtitle: "Design de mécaniques", 
                description: "Design de mécaniques de puzzle innovantes et équilibrées", 
                technologies: ["Unity", "C#", "Game Design"], 
                url: "/projects/bubble-wars/",
                image: "/images/projects/bubble-wars.jpg",
                year: "2023"
            },
            { 
                title: "Mystic Koni", 
                subtitle: "Puzzles mystiques", 
                description: "Conception de puzzles mystiques avec progression narrative", 
                technologies: ["Unity", "C#", "Puzzle Design"], 
                url: "/projects/mystic-koni/",
                image: "/images/projects/mystic-koni.jpg",
                year: "2022"
            }
        ],
        "Level Design": [
            { 
                title: "Snide", 
                subtitle: "Niveaux 2D", 
                description: "Conception de niveaux 2D avec courbe de difficulté progressive", 
                technologies: ["Unity", "C#", "Level Design"], 
                url: "/projects/snide/",
                image: "/images/projects/snide.jpg",
                year: "2022"
            },
            { 
                title: "Stay in the Light", 
                subtitle: "Environnements d'horreur", 
                description: "Design d'environnements d'horreur immersifs et terrifiants", 
                technologies: ["Unity", "C#", "Level Design"], 
                url: "/projects/stay-in-the-light/",
                image: "/images/projects/stay-in-light.jpg",
                year: "2021"
            }
        ]
    };
    
    const relatedProjects = knownProjects[skillName] || [];
    
    if (relatedProjects.length === 0) {
        projectsList.innerHTML = '<div class="no-projects">🚀 Aucun projet trouvé pour cette technologie.<br/>De nouveaux projets arrivent bientôt !</div>';
        return;
    }
    
    // Générer le HTML pour les cartes de projets style PS5
    const projectsHTML = relatedProjects.map(project => `
        <div class="modal-project-card" onclick="window.open('${project.url}', '_blank')">
            <div class="modal-project-image">
                <img src="${project.background_image || project.image || '/images/placeholder-project.jpg'}" alt="${project.title}" loading="lazy">
                <div class="modal-project-overlay"></div>
            </div>
            <div class="modal-project-content">
                <h4 class="modal-project-title">${project.title}</h4>
                <p class="modal-project-subtitle">${project.subtitle || project.description}</p>
                <div class="modal-project-tech">
                    ${project.technologies.slice(0, 3).map(tech => `<span class="modal-project-tech-item">${tech}</span>`).join('')}
                    ${project.technologies.length > 3 ? `<span class="modal-project-tech-item">+${project.technologies.length - 3}</span>` : ''}
                </div>
                <div class="modal-project-meta">
                    <span class="modal-project-year">${project.year}</span>
                    ${project.url ? `<a href="${project.url}" class="modal-project-link" target="_blank" onclick="event.stopPropagation()">
                        Voir le projet
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </a>` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
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
});
