// Skill/technology modal management
let skillModalData = null;

// Function to open modal with skill details
function openSkillModal(name, icon, level, experience, iconType) {
    const modal = document.getElementById('skillModal');
    const modalName = document.getElementById('modalSkillName');
    const modalIcon = document.getElementById('modalSkillIcon');
    const modalLevel = document.getElementById('modalSkillLevel');
    const modalExperience = document.getElementById('modalSkillExperience');
    
    // Fill basic information
    modalName.textContent = name;
    // Level chip: hide if unspecified ('Non spécifié') or empty
    try {
        if (modalLevel) {
            let hideLevel = false;
            let levelText = '';
            if (level === null || level === undefined) {
                hideLevel = true;
            } else {
                const rawLevel = String(level).trim();
                if (!rawLevel) {
                    hideLevel = true;
                } else {
                    const normalized = rawLevel.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                    if (normalized === 'non specifie') {
                        hideLevel = true;
                    } else {
                        levelText = rawLevel;
                    }
                }
            }
            if (hideLevel) {
                modalLevel.textContent = '';
                modalLevel.style.display = 'none';
                modalLevel.hidden = true;
            } else {
                modalLevel.textContent = levelText;
                modalLevel.style.display = '';
                modalLevel.hidden = false;
            }
        }
    } catch (e) { /* no-op */ }
    // Experience chip: hide if unspecified or 0, otherwise format as "X an(s) d'expérience"
    try {
        if (modalExperience) {
            let shouldHide = false;
            let years = 0;

            if (experience === null || experience === undefined) {
                shouldHide = true;
            } else if (typeof experience === 'number') {
                years = experience;
                shouldHide = !(years > 0);
            } else {
                const raw = String(experience).trim();
                if (!raw) {
                    shouldHide = true;
                } else {
                    const normalized = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                    if (normalized === 'non specifie') {
                        shouldHide = true;
                    } else {
                        const parsed = parseFloat(raw.replace(/[^0-9.,-]/g, '').replace(',', '.'));
                        if (!isNaN(parsed)) {
                            years = parsed;
                        }
                        shouldHide = !(years > 0);
                    }
                }
            }

            if (shouldHide) {
                modalExperience.textContent = '';
                modalExperience.style.display = 'none';
                modalExperience.hidden = true;
            } else {
                const isOne = Math.abs(years - 1) < 1e-9;
                const yearsStr = Number.isInteger(years) ? years.toString() : years.toLocaleString('fr-FR', { maximumFractionDigits: 1 });
                modalExperience.textContent = `${yearsStr} ${isOne ? 'an' : 'ans'} d'expérience`;
                modalExperience.style.display = '';
                modalExperience.hidden = false;
            }
        }
    } catch (e) {
        // No-op: in case of DOM issues, fail silently as per French-first UX
    }
    
    // Handle icon
    if (iconType === 'svg') {
        modalIcon.innerHTML = `<img src="${icon}" alt="${name}" class="skill-modal-tech-icon-svg" width="48" height="48">`;
    } else {
        modalIcon.innerHTML = `<span class="skill-modal-tech-icon-emoji">${icon}</span>`;
    }
    
    // Load associated projects
    loadProjectsForSkill(name);
    
    // Load associated professional experiences
    loadExperiencesForSkill(name);
    
    // Load associated educations
    loadEducationsForSkill(name);
    
    // Pause all testimonials before showing modal
    if (typeof window.pauseAllTestimonials === 'function') {
        window.pauseAllTestimonials();
    }
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent page scrolling
}

// Function to close modal
function closeSkillModal() {
    const modal = document.getElementById('skillModal');
    
    // Resume all testimonials when closing modal
    if (typeof window.resumeAllTestimonials === 'function') {
        window.resumeAllTestimonials();
    }
    
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore page scrolling
}

// Function to load projects associated with a skill/technology
function loadProjectsForSkill(skillName) {
    const projectsList = document.getElementById('modalProjectsList');
    projectsList.innerHTML = '<div class="loading">Chargement des projets...</div>';
    
    try {
        // Use data embedded in page instead of making API request
        const projects = window.portfolioProjects || [];
        console.log('Projects retrieved from embedded data:', projects.length);
        console.log('Searching projects for skill:', skillName);
        displayProjects(projects, skillName, projectsList);
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsList.innerHTML = '<div class="no-projects">❌ Error loading projects.<br/>Please refresh the page.</div>';
    }
}

// Function to load professional experiences associated with a skill/technology
function loadExperiencesForSkill(skillName) {
    const experiencesList = document.getElementById('modalExperiencesList');
    experiencesList.innerHTML = '<div class="loading">Loading experiences...</div>';
    
    try {
        // Use data embedded in page instead of making API request
        const experiences = window.portfolioExperiences || [];
        console.log('Experiences retrieved from embedded data:', experiences.length);
        console.log('Searching experiences for skill:', skillName);
        displayExperiences(experiences, skillName, experiencesList);
    } catch (error) {
        console.error('Error loading experiences:', error);
        experiencesList.innerHTML = '<div class="skill-modal-no-experiences">❌ Error loading experiences.<br/>Please refresh the page.</div>';
    }
}

// Function to load educations associated with a skill/technology
function loadEducationsForSkill(skillName) {
    const educationsList = document.getElementById('modalEducationsList');
    educationsList.innerHTML = '<div class="loading">Loading educations...</div>';
    
    try {
        // Use data embedded in page instead of making API request
        const educations = window.portfolioEducations || [];
        console.log('Educations retrieved from embedded data:', educations.length);
        console.log('Searching educations for skill:', skillName);
        displayEducations(educations, skillName, educationsList);
    } catch (error) {
        console.error('Error loading educations:', error);
        educationsList.innerHTML = '<div class="skill-modal-no-educations">❌ Error loading educations.<br/>Please refresh the page.</div>';
    }
}

// Function to display filtered projects with new PS5 design
function displayProjects(projects, skillName, projectsList) {
    console.log('=== FILTERING START ===');
    console.log('Filtering projects for:', skillName);
    console.log('Available projects:', projects.length);
    
    const relatedProjects = projects.filter(project => {
        console.log(`\nAnalyzing project: "${project.title}"`);
        console.log(`Project technologies RAW:`, project.technologies);
        console.log(`Type:`, typeof project.technologies);
        console.log(`Is array:`, Array.isArray(project.technologies));
        
        let technologies = project.technologies;
        
        // If it's a string, try to parse it as JSON
        if (typeof technologies === 'string') {
            try {
                technologies = JSON.parse(technologies);
                console.log(`Technologies after parsing:`, technologies);
                console.log(`Type after parsing:`, typeof technologies);
                console.log(`Is array after parsing:`, Array.isArray(technologies));
            } catch (e) {
                console.log(`❌ JSON parsing error for "${project.title}":`, e.message);
                return false;
            }
        }
        
        if (!technologies || !Array.isArray(technologies)) {
            console.log(`❌ Project "${project.title}" rejected: invalid or missing technologies`);
            return false;
        }
        
        // Exact search and also case-insensitive search
        const hasSkill = technologies.some(tech => {
            const exactMatch = tech === skillName;
            const caseInsensitiveMatch = tech.toLowerCase() === skillName.toLowerCase();
            console.log(`  Comparison: "${tech}" vs "${skillName}" -> exact: ${exactMatch}, insensitive: ${caseInsensitiveMatch}`);
            return exactMatch || caseInsensitiveMatch;
        });
        
        if (hasSkill) {
            console.log(`✅ Project "${project.title}" ACCEPTED with technologies:`, technologies);
        } else {
            console.log(`❌ Project "${project.title}" rejected: no matching technology`);
        }
        return hasSkill;
    });
    
    console.log('=== FILTERING RESULT ===');
    console.log('Filtered projects found:', relatedProjects.length);
    relatedProjects.forEach(p => console.log(`- ${p.title}`));
    
    if (relatedProjects.length === 0) {
        projectsList.classList.add('empty-state');
        projectsList.innerHTML = '<div class="skill-modal-no-projects">🚀 Aucun projet trouvé pour cette technologie.<br/>De nouveaux projets arrivent bientôt !</div>';
        return;
    }
    
    // Clear list and create DOM elements properly
    projectsList.classList.remove('empty-state');
    projectsList.innerHTML = '';
    
    relatedProjects.forEach(project => {
        // Ensure technologies are an array for display
        let technologies = project.technologies;
        if (typeof technologies === 'string') {
            try {
                technologies = JSON.parse(technologies);
            } catch (e) {
                technologies = [];
            }
        }
        
        // Clean project before using it
        const cleanedProject = cleanProject(project);
        
        // Debug: display cleaned project URL
        console.log(`Project "${cleanedProject.title}" - URL: "${cleanedProject.url}"`);
        
        // Create main project tile element
        const projectTile = createProjectTile(cleanedProject, technologies);
        projectsList.appendChild(projectTile);
    });
}

// Fonction pour afficher les expériences professionnelles filtrées
function displayExperiences(experiences, skillName, experiencesList) {
    console.log('=== DÉBUT DU FILTRAGE DES EXPÉRIENCES ===');
    console.log('Filtrage des expériences pour:', skillName);
    console.log('Expériences disponibles:', experiences.length);
    
    const relatedExperiences = experiences.filter(experience => {
        console.log(`\nAnalyse de l'expérience: "${experience.title}" chez ${experience.company}`);
        console.log(`Technologies de l'expérience:`, experience.technologies);
        
        let technologies = experience.technologies;
        
        // Si c'est une string, essayer de la parser en JSON
        if (typeof technologies === 'string') {
            try {
                technologies = JSON.parse(technologies);
                console.log(`Technologies après parsing:`, technologies);
            } catch (e) {
                console.log(`❌ Erreur de parsing JSON pour "${experience.title}":`, e.message);
                return false;
            }
        }
        
        if (!technologies || !Array.isArray(technologies)) {
            console.log(`❌ Expérience "${experience.title}" rejetée: technologies invalides ou manquantes`);
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
            console.log(`✅ Expérience "${experience.title}" ACCEPTÉE avec technologies:`, technologies);
        } else {
            console.log(`❌ Expérience "${experience.title}" rejetée: aucune technologie correspondante`);
        }
        return hasSkill;
    });
    
    console.log('=== RÉSULTAT DU FILTRAGE DES EXPÉRIENCES ===');
    console.log('Expériences filtrées trouvées:', relatedExperiences.length);
    relatedExperiences.forEach(e => console.log(`- ${e.title} chez ${e.company}`));
    
    if (relatedExperiences.length === 0) {
        experiencesList.classList.add('empty-state');
        experiencesList.innerHTML = '<div class="skill-modal-no-experiences">💼 Aucune expérience professionnelle trouvée pour cette technologie.<br/>Cette compétence a été développée dans un contexte personnel ou académique.</div>';
        return;
    }
    
    // Vider la liste et créer les éléments DOM proprement
    experiencesList.classList.remove('empty-state');
    experiencesList.innerHTML = '';
    
    relatedExperiences.forEach(experience => {
        // S'assurer que les technologies sont un tableau pour l'affichage
        let technologies = experience.technologies;
        if (typeof technologies === 'string') {
            try {
                technologies = JSON.parse(technologies);
            } catch (e) {
                technologies = [];
            }
        }
        
        // Nettoyer l'expérience avant de l'utiliser
        const cleanedExperience = cleanExperience(experience);
        
        // Debug: afficher l'URL de l'expérience nettoyée
        console.log(`Expérience "${cleanedExperience.title}" - URL: "${cleanedExperience.url}"`);
        
        // Créer l'élément principal de l'expérience
        const experienceItem = createExperienceItem(cleanedExperience, technologies);
        experiencesList.appendChild(experienceItem);
    });
}

// Fonction pour nettoyer un objet expérience de tous ses guillemets superflus
function cleanExperience(experience) {
    const cleaned = {};
    for (const [key, value] of Object.entries(experience)) {
        cleaned[key] = cleanJsonValue(value);
    }
    return cleaned;
}

// Fonction pour afficher les formations filtrées
function displayEducations(educations, skillName, educationsList) {
    console.log('=== DÉBUT DU FILTRAGE DES FORMATIONS ===');
    console.log('Filtrage des formations pour:', skillName);
    console.log('Formations disponibles:', educations.length);
    
    const relatedEducations = educations.filter(education => {
        console.log(`\nAnalyse de la formation: "${education.title}" à ${education.institution}`);
        console.log(`Technologies de la formation:`, education.technologies);
        
        let technologies = education.technologies;
        
        // Si c'est une string, essayer de la parser en JSON
        if (typeof technologies === 'string') {
            try {
                technologies = JSON.parse(technologies);
                console.log(`Technologies après parsing:`, technologies);
            } catch (e) {
                console.log(`❌ Erreur de parsing JSON pour "${education.title}":`, e.message);
                return false;
            }
        }
        
        if (!technologies || !Array.isArray(technologies)) {
            console.log(`❌ Formation "${education.title}" rejetée: technologies invalides ou manquantes`);
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
            console.log(`✅ Formation "${education.title}" ACCEPTÉE avec technologies:`, technologies);
        } else {
            console.log(`❌ Formation "${education.title}" rejetée: aucune technologie correspondante`);
        }
        return hasSkill;
    });
    
    console.log('=== RÉSULTAT DU FILTRAGE DES FORMATIONS ===');
    console.log('Formations filtrées trouvées:', relatedEducations.length);
    relatedEducations.forEach(e => console.log(`- ${e.title} à ${e.institution}`));
    
    if (relatedEducations.length === 0) {
        educationsList.classList.add('empty-state');
        educationsList.innerHTML = '<div class="skill-modal-no-educations">🎓 Aucune formation trouvée pour cette technologie.<br/>Cette compétence a été développée de manière autodidacte ou professionnelle.</div>';
        return;
    }
    
    // Vider la liste et créer les éléments DOM proprement
    educationsList.classList.remove('empty-state');
    educationsList.innerHTML = '';
    
    relatedEducations.forEach(education => {
        // S'assurer que les technologies sont un tableau pour l'affichage
        let technologies = education.technologies;
        if (typeof technologies === 'string') {
            try {
                technologies = JSON.parse(technologies);
            } catch (e) {
                technologies = [];
            }
        }
        
        // Nettoyer la formation avant de l'utiliser
        const cleanedEducation = cleanEducation(education);
        
        // Debug: afficher l'URL de la formation nettoyée
        console.log(`Formation "${cleanedEducation.title}" - URL: "${cleanedEducation.url}"`);
        
        // Créer l'élément principal de la formation
        const educationItem = createEducationItem(cleanedEducation, technologies);
        educationsList.appendChild(educationItem);
    });
}

// Fonction pour nettoyer un objet formation de tous ses guillemets superflus
function cleanEducation(education) {
    const cleaned = {};
    for (const [key, value] of Object.entries(education)) {
        cleaned[key] = cleanJsonValue(value);
    }
    return cleaned;
}

// Fonction pour créer un élément d'expérience professionnelle
function createExperienceItem(cleanedExperience, technologies) {
    console.log(`Création de l'élément expérience pour:`, cleanedExperience);
    
    // Conteneur principal
    const experienceItem = document.createElement('div');
    experienceItem.className = 'skill-modal-experience-item';
    
    // En-tête avec logo et informations principales
    const header = document.createElement('div');
    header.className = 'skill-modal-experience-header';
    
    // Logo de l'entreprise
    if (cleanedExperience.logo) {
        const logoContainer = document.createElement('div');
        logoContainer.className = 'skill-modal-experience-logo';
        
        const logo = document.createElement('img');
        logo.src = cleanedExperience.logo;
        logo.alt = cleanedExperience.company;
        logo.loading = 'lazy';
        logo.onerror = function() {
            this.style.display = 'none';
            logoContainer.innerHTML = '<div class="skill-modal-experience-logo-placeholder">🏢</div>';
        };
        
        logoContainer.appendChild(logo);
        header.appendChild(logoContainer);
    } else {
        const logoPlaceholder = document.createElement('div');
        logoPlaceholder.className = 'skill-modal-experience-logo';
        logoPlaceholder.innerHTML = '<div class="skill-modal-experience-logo-placeholder">🏢</div>';
        header.appendChild(logoPlaceholder);
    }
    
    // Informations principales
    const info = document.createElement('div');
    info.className = 'skill-modal-experience-info';
    
    const title = document.createElement('h4');
    title.className = 'skill-modal-experience-title';
    title.textContent = cleanedExperience.title;
    
    const company = document.createElement('p');
    company.className = 'skill-modal-experience-company';
    company.textContent = cleanedExperience.company;
    
    const type = document.createElement('span');
    type.className = 'skill-modal-experience-type';
    type.textContent = cleanedExperience.type || 'Poste';
    
    const period = document.createElement('span');
    period.className = 'skill-modal-experience-period';
    
    // Formater les dates
    let periodText = '';
    if (cleanedExperience.start_date) {
        const startDate = new Date(cleanedExperience.start_date);
        periodText = startDate.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
        
        if (cleanedExperience.end_date) {
            const endDate = new Date(cleanedExperience.end_date);
            periodText += ' - ' + endDate.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
        } else {
            periodText += ' - Présent';
        }
    }
    period.textContent = periodText;
    
    info.appendChild(title);
    info.appendChild(company);
    info.appendChild(type);
    info.appendChild(period);
    
    header.appendChild(info);
    experienceItem.appendChild(header);
    
    // Description
    if (cleanedExperience.description) {
        const description = document.createElement('p');
        description.className = 'skill-modal-experience-description';
        description.textContent = cleanedExperience.description;
        experienceItem.appendChild(description);
    }
    
    // Technologies utilisées dans cette expérience
    if (technologies && technologies.length > 0) {
        const techContainer = document.createElement('div');
        techContainer.className = 'skill-modal-experience-technologies';
        
        const techLabel = document.createElement('span');
        techLabel.className = 'skill-modal-experience-tech-label';
        techLabel.textContent = 'Technologies utilisées:';
        techContainer.appendChild(techLabel);
        
        const techList = document.createElement('div');
        techList.className = 'skill-modal-experience-tech-list';
        
        technologies.forEach(tech => {
            const techItem = document.createElement('span');
            techItem.className = 'skill-modal-experience-tech-item';
            techItem.textContent = tech;
            techList.appendChild(techItem);
        });
        
        techContainer.appendChild(techList);
        experienceItem.appendChild(techContainer);
    }
    
    // Lien vers l'expérience détaillée
    if (cleanedExperience.url) {
        const linkContainer = document.createElement('div');
        linkContainer.className = 'skill-modal-experience-actions';
        
        const experienceLink = document.createElement('a');
        experienceLink.href = cleanedExperience.url;
        experienceLink.className = 'skill-modal-experience-link';
        experienceLink.textContent = '📄 Voir les détails';
        
        linkContainer.appendChild(experienceLink);
        experienceItem.appendChild(linkContainer);
    }
    
    return experienceItem;
}

// Fonction pour créer un élément de formation
function createEducationItem(cleanedEducation, technologies) {
    console.log(`Création de l'élément formation pour:`, cleanedEducation);
    
    // Conteneur principal
    const educationItem = document.createElement('div');
    educationItem.className = 'skill-modal-education-item';
    
    // En-tête avec icône et informations principales
    const header = document.createElement('div');
    header.className = 'skill-modal-education-header';
    
    // Icône de la formation
    const iconContainer = document.createElement('div');
    iconContainer.className = 'skill-modal-education-icon';
    
    if (cleanedEducation.icon) {
        iconContainer.innerHTML = `<span class="skill-modal-education-icon-emoji">${cleanedEducation.icon}</span>`;
    } else {
        iconContainer.innerHTML = '<span class="skill-modal-education-icon-placeholder">🎓</span>';
    }
    
    // Si une couleur est définie, l'appliquer comme bordure
    if (cleanedEducation.color) {
        iconContainer.style.borderColor = cleanedEducation.color;
        iconContainer.style.boxShadow = `0 0 10px ${cleanedEducation.color}33`;
    }
    
    header.appendChild(iconContainer);
    
    // Informations principales
    const info = document.createElement('div');
    info.className = 'skill-modal-education-info';
    
    const title = document.createElement('h4');
    title.className = 'skill-modal-education-title';
    title.textContent = cleanedEducation.title;
    
    const institution = document.createElement('p');
    institution.className = 'skill-modal-education-institution';
    let institutionText = cleanedEducation.institution;
    if (cleanedEducation.city) {
        institutionText += ` - ${cleanedEducation.city}`;
    }
    institution.textContent = institutionText;
    
    const status = document.createElement('span');
    status.className = 'skill-modal-education-status';
    status.textContent = cleanedEducation.status || cleanedEducation.grade || 'Formation';
    
    const period = document.createElement('span');
    period.className = 'skill-modal-education-period';
    
    // Formater les dates
    let periodText = '';
    if (cleanedEducation.start_date) {
        const startDate = new Date(cleanedEducation.start_date);
        periodText = startDate.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
        
        if (cleanedEducation.end_date) {
            const endDate = new Date(cleanedEducation.end_date);
            periodText += ' - ' + endDate.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
        }
    }
    period.textContent = periodText;
    
    info.appendChild(title);
    info.appendChild(institution);
    info.appendChild(status);
    info.appendChild(period);
    
    header.appendChild(info);
    educationItem.appendChild(header);
    
    // Description
    if (cleanedEducation.description) {
        const description = document.createElement('p');
        description.className = 'skill-modal-education-description';
        description.textContent = cleanedEducation.description;
        educationItem.appendChild(description);
    }
    
    // Technologies utilisées dans cette formation
    if (technologies && technologies.length > 0) {
        const techContainer = document.createElement('div');
        techContainer.className = 'skill-modal-education-technologies';
        
        const techLabel = document.createElement('span');
        techLabel.className = 'skill-modal-education-tech-label';
        techLabel.textContent = 'Technologies étudiées:';
        techContainer.appendChild(techLabel);
        
        const techList = document.createElement('div');
        techList.className = 'skill-modal-education-tech-list';
        
        technologies.forEach(tech => {
            const techItem = document.createElement('span');
            techItem.className = 'skill-modal-education-tech-item';
            techItem.textContent = tech;
            techList.appendChild(techItem);
        });
        
        techContainer.appendChild(techList);
        educationItem.appendChild(techContainer);
    }
    
    // Lien vers la formation détaillée
    if (cleanedEducation.url) {
        const linkContainer = document.createElement('div');
        linkContainer.className = 'skill-modal-education-actions';
        
        const educationLink = document.createElement('a');
        educationLink.href = cleanedEducation.url;
        educationLink.className = 'skill-modal-education-link';
        educationLink.textContent = '📚 Voir les détails';
        
        linkContainer.appendChild(educationLink);
        educationItem.appendChild(linkContainer);
    }
    
    return educationItem;
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
    projectTile.className = 'project-item skill-modal-project-tile';
    
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
    
    // Normaliser les données des expériences pour s'assurer que les technologies sont des tableaux
    if (window.portfolioExperiences && Array.isArray(window.portfolioExperiences)) {
        window.portfolioExperiences = window.portfolioExperiences.map(experience => {
            if (experience.technologies && typeof experience.technologies === 'string') {
                try {
                    experience.technologies = JSON.parse(experience.technologies);
                } catch (e) {
                    console.error(`Erreur lors du parsing des technologies pour ${experience.title}:`, e);
                    experience.technologies = [];
                }
            }
            return experience;
        });
        console.log('Données des expériences normalisées!');
    }
    
    // Normaliser les données des formations pour s'assurer que les technologies sont des tableaux
    if (window.portfolioEducations && Array.isArray(window.portfolioEducations)) {
        window.portfolioEducations = window.portfolioEducations.map(education => {
            if (education.technologies && typeof education.technologies === 'string') {
                try {
                    education.technologies = JSON.parse(education.technologies);
                } catch (e) {
                    console.error(`Erreur lors du parsing des technologies pour ${education.title}:`, e);
                    education.technologies = [];
                }
            }
            return education;
        });
        console.log('Données des formations normalisées!');
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
    
    // Déboguer les données des expériences chargées
    console.log('Données des expériences chargées:', window.portfolioExperiences?.length || 0);
    if (window.portfolioExperiences?.length > 0) {
        console.log('Première expérience exemple:', window.portfolioExperiences[0]);
        
        // Afficher TOUTES les expériences avec leurs technologies
        console.log('=== LISTE COMPLÈTE DES EXPÉRIENCES ET LEURS TECHNOLOGIES ===');
        window.portfolioExperiences.forEach((experience, index) => {
            console.log(`${index + 1}. ${experience.title} chez ${experience.company}:`);
            console.log(`   Technologies RAW:`, experience.technologies);
            console.log(`   Type de technologies:`, typeof experience.technologies);
            console.log(`   Est un tableau:`, Array.isArray(experience.technologies));
            
            if (Array.isArray(experience.technologies)) {
                console.log(`   Nombre d'éléments:`, experience.technologies.length);
                experience.technologies.forEach((tech, techIndex) => {
                    console.log(`     ${techIndex + 1}. "${tech}" (type: ${typeof tech})`);
                });
            }
            console.log('   ---');
        });
        
        console.log('Technologies d\'expériences disponibles:', 
            [...new Set(window.portfolioExperiences.flatMap(e => e.technologies || []))].sort()
        );
    }
    
    // Déboguer les données des formations chargées
    console.log('Données des formations chargées:', window.portfolioEducations?.length || 0);
    if (window.portfolioEducations?.length > 0) {
        console.log('Première formation exemple:', window.portfolioEducations[0]);
        
        // Afficher TOUTES les formations avec leurs technologies
        console.log('=== LISTE COMPLÈTE DES FORMATIONS ET LEURS TECHNOLOGIES ===');
        window.portfolioEducations.forEach((education, index) => {
            console.log(`${index + 1}. ${education.title} à ${education.institution}:`);
            console.log(`   Technologies RAW:`, education.technologies);
            console.log(`   Type de technologies:`, typeof education.technologies);
            console.log(`   Est un tableau:`, Array.isArray(education.technologies));
            
            if (Array.isArray(education.technologies)) {
                console.log(`   Nombre d'éléments:`, education.technologies.length);
                education.technologies.forEach((tech, techIndex) => {
                    console.log(`     ${techIndex + 1}. "${tech}" (type: ${typeof tech})`);
                });
            }
            console.log('   ---');
        });
        
        console.log('Technologies de formations disponibles:', 
            [...new Set(window.portfolioEducations.flatMap(e => e.technologies || []))].sort()
        );
    }
});