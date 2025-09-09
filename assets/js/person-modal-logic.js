// Person Modal Logic
// Gestion complète du modal des personnes

// Tab management & person modal stats
document.addEventListener('DOMContentLoaded', function() {
    console.log('Person modal script loading...');
    console.log('People data:', window.portfolioPeople);
    console.log('Testimonials data:', window.portfolioTestimonials);
    console.log('Projects data:', window.portfolioProjects);
    
    const modal = document.getElementById('personModal');
    if (!modal) {
        console.error('Person modal element not found!');
        return;
    }
    console.log('Person modal element found:', modal);
    
    const tabButtons = modal.querySelectorAll('.nav-tab');
    const tabPanels = modal.querySelectorAll('.content-panel');
    const quickStats = document.getElementById('personModalQuickStats');

    function activateTab(target) {
        tabButtons.forEach(btn => {
            const isActive = btn.dataset.tab === target;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        tabPanels.forEach(panel => {
            const shouldShow = panel.id === 'personModalTab' + target.charAt(0).toUpperCase() + target.slice(1);
            panel.classList.toggle('active', shouldShow);
            if (shouldShow) {
                panel.removeAttribute('hidden');
            } else {
                panel.setAttribute('hidden','hidden');
            }
        });
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => activateTab(btn.dataset.tab));
        btn.addEventListener('keydown', e => {
            if (['ArrowRight','ArrowLeft'].includes(e.key)) {
                e.preventDefault();
                const arr = Array.from(tabButtons);
                const idx = arr.indexOf(btn);
                const next = e.key === 'ArrowRight' ? (idx + 1) % arr.length : (idx - 1 + arr.length) % arr.length;
                arr[next].focus();
            }
        });
    });

    // Create openPersonModal function
    window.openPersonModal = function(personId) {
        console.log('=== OPENING PERSON MODAL ===');
        console.log('Person ID:', personId);
        
        // Check data availability first
        console.log('Data check at modal opening:');
        console.log('- portfolioPeople:', window.portfolioPeople?.length || 'N/A');
        console.log('- portfolioProjects:', window.portfolioProjects?.length || 'N/A');
        console.log('- portfolioTestimonials:', window.portfolioTestimonials?.length || 'N/A');
        
        const person = window.portfolioPeople.find(p => p.id === personId);
        if (!person) {
            console.error('Person not found:', personId);
            console.log('Available people:', window.portfolioPeople?.map(p => p.id) || 'No people data');
            return;
        }
        console.log('Found person:', person);

        // Add loading state
        modal.classList.add('loading');

        // Update modal content
        document.getElementById('modalPersonName').textContent = person.name || 'Nom non spécifié';
        document.getElementById('modalPersonPosition').textContent = person.position || 'Non spécifié';
        document.getElementById('modalPersonCompany').textContent = person.company || '';
        
        const avatarImg = document.getElementById('modalPersonAvatar');
        if (person.avatar && person.avatar !== '') {
            avatarImg.src = person.avatar;
            avatarImg.style.display = 'block';
            avatarImg.onerror = function() {
                this.style.display = 'none';
            };
        } else {
            avatarImg.style.display = 'none';
        }

        // Update bio tab
        const bioContent = document.getElementById('modalPersonBio');
        bioContent.innerHTML = person.content || person.bio || 'Aucune biographie disponible.';

        // Update projects tab
        updatePersonProjects(personId);

        // Update contact buttons
        const contactButtons = document.getElementById('personModalContactButtons');
        contactButtons.innerHTML = '';
        
        const contacts = [
            { 
                label: 'Email', 
                value: person.email, 
                type: 'email',
                svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="social-icon-svg">
                    <path d="M4 7L10.94 11.3C11.59 11.74 12.41 11.74 13.06 11.3L20 7M4 6H20C20.55 6 21 6.45 21 7V17C21 17.55 20.55 18 20 18H4C3.45 18 3 17.55 3 17V7C3 6.45 3.45 6 4 6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`
            },
            { 
                label: 'LinkedIn', 
                value: person.linkedin, 
                type: 'url',
                svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="social-icon-svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`
            },
            { 
                label: 'GitHub', 
                value: person.github, 
                type: 'url',
                svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="social-icon-svg"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`
            },
            { 
                label: 'Discord', 
                value: person.discord, 
                type: 'url',
                svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="social-icon-svg"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/></svg>`
            },
            { 
                label: 'Site web', 
                value: person.website, 
                type: 'url',
                svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="social-icon-svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93ZM17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.78 20 8.65 20 12C20 14.08 19.2 15.97 17.9 17.39Z" fill="currentColor"/>
                </svg>`
            }
        ];

        contacts.forEach(contact => {
            if (contact.value && contact.value !== '' && contact.value !== '""') {
                const href = contact.type === 'email' ? `mailto:${contact.value}` : contact.value;
                const buttonEl = document.createElement('a');
                buttonEl.href = href;
                buttonEl.target = contact.type === 'url' ? '_blank' : '_self';
                buttonEl.className = 'person-modal-contact-button';
                buttonEl.title = `${contact.label}: ${contact.value}`;
                buttonEl.innerHTML = contact.svg;
                contactButtons.appendChild(buttonEl);
            }
        });

        updateStats(personId);
        activateTab('bio');
        
        // Remove loading state after content is loaded
        setTimeout(() => {
            modal.classList.remove('loading');
        }, 100);
        
        console.log('Setting modal display to flex...');
        modal.style.display = 'flex';
        console.log('Modal display after setting:', modal.style.display);
        console.log('Modal computed display:', getComputedStyle(modal).display);
        document.body.style.overflow = 'hidden';
        console.log('Modal should now be visible!');
    };

    // Create closePersonModal function
    window.closePersonModal = function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            window.closePersonModal();
        }
    });

    function updateStats(personId) {
        console.log('=== Updating stats for person:', personId);
        
        // Find testimonials for this person
        const testimonials = (window.portfolioTestimonials && Array.isArray(window.portfolioTestimonials)) 
            ? window.portfolioTestimonials.filter(t => t.personId === personId) 
            : [];
        console.log('Testimonials data:', window.portfolioTestimonials);
        console.log(`Found ${testimonials.length} testimonials for ${personId}:`, testimonials);

        // Update testimonials section in header
        const testimonialsSection = document.getElementById('modalPersonTestimonials');
        testimonialsSection.innerHTML = '';

        if (testimonials.length > 0) {
            testimonials.forEach(testimonial => {
                const testimonialEl = document.createElement('div');
                testimonialEl.className = 'person-modal-testimonial';
                
                testimonialEl.innerHTML = `
                    <div class="modal-testimonial-content">
                        <div class="modal-testimonial-quote-icon">❝</div>
                        <blockquote class="modal-testimonial-text">${testimonial.text}</blockquote>
                    </div>
                `;
                testimonialsSection.appendChild(testimonialEl);
            });
        }
    }

    function updatePersonProjects(personId) {
        console.log('=== PERSON PROJECTS FILTERING START ===');
        console.log('Filtering projects for person:', personId);
        
        // Debug: Vérifier les données disponibles
        console.log('window.portfolioProjects:', window.portfolioProjects);
        console.log('Is array?', Array.isArray(window.portfolioProjects));
        
        if (!window.portfolioProjects || !Array.isArray(window.portfolioProjects)) {
            console.warn('No projects data or not an array');
            return [];
        }

        console.log('Total projects available:', window.portfolioProjects.length);
        
        // Debug: afficher tous les projets et leurs contributeurs avec le style de skill-modal
        const personProjects = window.portfolioProjects.filter(project => {
            console.log(`\nAnalyzing project: "${project.title}"`);
            console.log(`Project contributors RAW:`, project.contributors);
            console.log(`Type:`, typeof project.contributors);
            console.log(`Is array:`, Array.isArray(project.contributors));
            
            let contributors = project.contributors;
            
            // Handle case where contributors might be a string
            if (typeof contributors === 'string') {
                try {
                    contributors = JSON.parse(contributors);
                    console.log(`Contributors after parsing:`, contributors);
                } catch (e) {
                    console.log(`❌ JSON parsing error for "${project.title}":`, e.message);
                    return false;
                }
            }
            
            if (!contributors || !Array.isArray(contributors)) {
                console.log(`❌ Project "${project.title}" rejected: invalid or missing contributors`);
                return false;
            }
            
            // Check if person is in contributors
            const hasPerson = contributors.some(contributor => {
                const exactMatch = contributor.person === personId;
                console.log(`  Comparison: "${contributor.person}" vs "${personId}" -> match: ${exactMatch} (role: ${contributor.role})`);
                return exactMatch;
            });
            
            if (hasPerson) {
                console.log(`✅ Project "${project.title}" ACCEPTED with contributors:`, contributors);
            } else {
                console.log(`❌ Project "${project.title}" rejected: person not found in contributors`);
            }
            return hasPerson;
        });
        
        console.log('=== PERSON PROJECTS FILTERING RESULT ===');
        console.log('Filtered projects found:', personProjects.length);
        personProjects.forEach(p => console.log(`- ${p.title}`));
        
        // Update projects section
        const projectsContent = document.getElementById('modalPersonProjects');
        projectsContent.innerHTML = '';

        if (personProjects.length > 0) {
            const projectsGrid = document.createElement('div');
            projectsGrid.className = 'person-modal-projects-grid';
            
            personProjects.forEach(project => {
                const projectEl = document.createElement('div');
                projectEl.className = 'person-modal-project-card';
                
                // Find this person's role in the project
                const contributor = project.contributors.find(c => c.person === personId);
                const role = contributor ? contributor.role : 'Contributeur';
                
                // Fonction pour nettoyer les valeurs avec guillemets en trop
                const clean = (value) => {
                    if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
                        return value.slice(1, -1); // Enlève les guillemets du début et de la fin
                    }
                    return value || '';
                };

                const cleanTitle = clean(project.title);
                const cleanSubtitle = clean(project.subtitle);
                const cleanDescription = clean(project.description);
                const cleanUrl = clean(project.url);
                const cleanImage = clean(project.image);

                projectEl.innerHTML = `
                    <div class="project-card-header">
                        ${cleanImage ? `
                            <div class="project-card-image">
                                <img src="${cleanImage}" alt="${cleanTitle}" loading="lazy">
                            </div>
                        ` : ''}
                        
                        <!-- Default content (visible by default) -->
                        <div class="project-card-content">
                            <h3 class="project-card-title">${cleanTitle}</h3>
                            ${cleanSubtitle ? `<p class="project-card-subtitle">${cleanSubtitle}</p>` : ''}
                            <div class="project-card-meta">
                                <span class="project-card-role">${role}</span>
                            </div>
                        </div>
                        
                        <!-- Detailed info (shown on hover) -->
                        <div class="project-card-detailed-info">
                            <div>
                                <h3 class="project-card-title">${cleanTitle}</h3>
                                ${cleanDescription ? `<p class="project-card-detailed-description">${cleanDescription}</p>` : ''}
                            </div>
                            <a href="${cleanUrl}" class="project-card-link" target="_blank">
                                Voir le projet
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                `;
                
                projectsGrid.appendChild(projectEl);
            });
            
            projectsContent.appendChild(projectsGrid);
        } else {
            projectsContent.innerHTML = `
                <div class="person-modal-no-projects">
                    <div class="no-projects-icon">🚀</div>
                    <h3>Aucun projet trouvé</h3>
                    <p>Cette personne n'a pas encore de projets référencés en tant que contributeur.</p>
                </div>
            `;
        }
    }
});
