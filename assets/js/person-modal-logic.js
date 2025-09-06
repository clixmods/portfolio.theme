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
        console.log('openPersonModal called with:', personId);
        const person = window.portfolioPeople.find(p => p.id === personId);
        if (!person) {
            console.error('Person not found:', personId);
            console.log('Available people:', window.portfolioPeople.map(p => p.id));
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
                svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="social-icon-svg"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h20.728C23.268 3.821 24 4.553 24 5.457zM16.545 10.182L12 13.773L7.455 10.182L12 6.545l4.545 3.637z"/></svg>`
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
                svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="social-icon-svg"><path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.567 7.813h-2.506c-.465-1.697-1.14-3.24-1.98-4.54a9.252 9.252 0 013.239 2.627c.329.396.617.839.813 1.271v.642zm-2.506 8.374h2.506c-.196.432-.484.875-.813 1.271a9.252 9.252 0 01-3.239 2.627c.84-1.3 1.515-2.843 1.98-4.54v-.358zm-9.061 0h2.506c.465 1.697 1.14 3.24 1.98 4.54a9.252 9.252 0 01-3.239-2.627c-.329-.396-.617-.839-.813-1.271v-.642zm2.506-8.374H6.0c.196-.432.484-.875.813-1.271a9.252 9.252 0 013.239-2.627c-.84 1.3-1.515 2.843-1.98 4.54v.358zm1.348 6.643h3.291c-.465 1.978-1.13 3.704-1.646 4.842-.515-1.138-1.18-2.864-1.645-4.842zm0-1.731h3.291c.465-1.978 1.13-3.704 1.645-4.842.516 1.138 1.181 2.864 1.646 4.842H9.854z"/></svg>`
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
        console.log('=== Updating projects for person:', personId);
        
        // Find projects where this person is a contributor
        const personProjects = (window.portfolioProjects && Array.isArray(window.portfolioProjects)) 
            ? window.portfolioProjects.filter(project => 
                project.contributors && project.contributors.some(contributor => contributor.person === personId)
              ) 
            : [];
        
        console.log(`Found ${personProjects.length} projects for ${personId}:`, personProjects);

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
                
                // Create status badge
                const statusClass = project.status ? project.status.toLowerCase().replace(/\s+/g, '-') : '';
                
                projectEl.innerHTML = `
                    <div class="project-card-header">
                        ${project.image ? `<div class="project-card-image">
                            <img src="${project.image}" alt="${project.title}" loading="lazy">
                        </div>` : ''}
                        <div class="project-card-content">
                            <h3 class="project-card-title">${project.title}</h3>
                            ${project.subtitle ? `<p class="project-card-subtitle">${project.subtitle}</p>` : ''}
                            <div class="project-card-meta">
                                <span class="project-card-role">${role}</span>
                                ${project.status ? `<span class="project-card-status status-${statusClass}">${project.status}</span>` : ''}
                            </div>
                        </div>
                    </div>
                    ${project.description ? `<p class="project-card-description">${project.description}</p>` : ''}
                    <div class="project-card-footer">
                        <a href="${project.url}" class="project-card-link" target="_blank">
                            Voir le projet
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M7 17L17 7M17 7H7M17 7V17"/>
                            </svg>
                        </a>
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
