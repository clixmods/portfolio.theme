// Person Modal Logic
// Gestion complète du modal des personnes

// Tab management & person modal stats
document.addEventListener('DOMContentLoaded', function() {
    console.log('Person modal script loading...');
    console.log('People data:', window.portfolioPeople);
    console.log('Projects data:', window.portfolioProjects);
    console.log('Testimonials data:', window.portfolioTestimonials);
    
    const modal = document.getElementById('personModal');
    if (!modal) {
        console.error('Person modal element not found!');
        return;
    }
    console.log('Person modal element found:', modal);
    
    const tabButtons = modal.querySelectorAll('.person-modal-tab');
    const tabPanels = modal.querySelectorAll('.person-modal-tab-panel');
    const counts = {
        projects: document.getElementById('personModalProjectsCount')
    };
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

        // Update modal content
        document.getElementById('modalPersonName').textContent = person.name || 'Nom non spécifié';
        document.getElementById('modalPersonPosition').textContent = person.position || 'Non spécifié';
        document.getElementById('modalPersonCompany').textContent = person.company || '';
        
        const avatarImg = document.getElementById('modalPersonAvatar');
        if (person.avatar && person.avatar !== '') {
            avatarImg.src = person.avatar;
            avatarImg.style.display = 'block';
        } else {
            avatarImg.style.display = 'none';
        }

        // Update bio tab
        const bioContent = document.getElementById('modalPersonBio');
        bioContent.innerHTML = person.content || person.bio || 'Aucune biographie disponible.';

        // Update contact buttons
        const contactButtons = document.getElementById('personModalContactButtons');
        contactButtons.innerHTML = '';
        
        const contacts = [
            { label: 'Email', value: person.email, icon: '📧', type: 'email' },
            { label: 'LinkedIn', value: person.linkedin, icon: '💼', type: 'url' },
            { label: 'GitHub', value: person.github, icon: '🐱', type: 'url' },
            { label: 'Site web', value: person.website, icon: '🌐', type: 'url' }
        ];

        contacts.forEach(contact => {
            if (contact.value && contact.value !== '' && contact.value !== '""') {
                const href = contact.type === 'email' ? `mailto:${contact.value}` : contact.value;
                const buttonEl = document.createElement('a');
                buttonEl.href = href;
                buttonEl.target = contact.type === 'url' ? '_blank' : '_self';
                buttonEl.className = 'person-modal-contact-button';
                buttonEl.title = `${contact.label}: ${contact.value}`;
                buttonEl.innerHTML = `<span class="icon">${contact.icon}</span>`;
                contactButtons.appendChild(buttonEl);
            }
        });

        updateStats(personId);
        activateTab('projects');
        
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
        console.log('=== Searching projects for person:', personId);
        console.log('Total projects available:', window.portfolioProjects?.length || 0);
        
        // Find projects where this person contributed
        const projects = (window.portfolioProjects || []).filter(project => {
            console.log(`Checking project: ${project.title}`);
            console.log(`  Contributors:`, project.contributors);
            
            // Check if person appears in any contributors
            const hasContributor = project.contributors && project.contributors.some(contributor => {
                console.log(`    Comparing "${contributor.person}" === "${personId}"`);
                return contributor.person === personId;
            });
            
            console.log(`  Has contributor ${personId}:`, hasContributor);
            return hasContributor;
        });
        
        console.log(`Found ${projects.length} projects for ${personId}:`, projects.map(p => p.title));

        if (counts.projects) {
            counts.projects.textContent = projects.length > 0 ? projects.length : '0';
        }

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
                testimonialEl.className = 'person-modal-testimonial-header';
                
                testimonialEl.innerHTML = `
                    <div class="testimonial-quote">
                        <blockquote>"${testimonial.text}"</blockquote>
                    </div>
                `;
                testimonialsSection.appendChild(testimonialEl);
            });
        }

        // Update projects list
        const projectsList = document.getElementById('modalPersonProjectsList');
        projectsList.innerHTML = '';

        if (projects.length === 0) {
            projectsList.innerHTML = '<p class="empty-state">Aucun projet trouvé pour cette personne.</p>';
        } else {
            projects.forEach(project => {
                const projectEl = document.createElement('div');
                projectEl.className = 'person-modal-project-card';
                
                // Find the person's role in this project
                const contributor = project.contributors?.find(c => c.person === personId);
                const role = contributor ? contributor.role : 'Contributeur';
                
                projectEl.innerHTML = `
                    <div class="project-image">
                        <img src="${project.image || '/images/placeholder-project.jpg'}" alt="${project.title}" loading="lazy">
                    </div>
                    <div class="project-info">
                        <h3><a href="${project.url}">${project.title}</a></h3>
                        <p class="project-subtitle">${project.subtitle || project.description || ''}</p>
                        <p class="project-role"><strong>Rôle:</strong> ${role}</p>
                        <div class="project-meta">
                            <span class="project-year">${project.year}</span>
                            ${project.sector ? `<span class="project-sector">${project.sector}</span>` : ''}
                        </div>
                    </div>
                `;
                projectsList.appendChild(projectEl);
            });
        }

        // Update quick stats
        if (quickStats) {
            quickStats.innerHTML = '';
            const stats = [
                { label: 'Projets', value: projects.length, icon: '💼'}
            ];
            stats.forEach(s => {
                const el = document.createElement('div');
                el.className = 'person-modal-stat-chip';
                el.innerHTML = `<span class="icon">${s.icon}</span><span class="val">${s.value}</span><span class="lbl">${s.label}</span>`;
                quickStats.appendChild(el);
            });
        }
    }
});
