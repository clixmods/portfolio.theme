// ============================================================================
// BRANDING - TECHNOLOGIES MODULE
// ============================================================================
// Technology selection and display

window.BrandingEditor = window.BrandingEditor || {};

window.BrandingEditor.technologies = {
    init: function() {
        const self = this;
        const state = window.BrandingEditor.state;
        const elements = window.BrandingEditor.elements;
        const templates = window.BrandingEditor.templates;
        
        // Tab switching
        const techTabs = document.querySelectorAll('.tech-tab');
        techTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                techTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const tabId = this.dataset.tab;
                document.querySelectorAll('.tech-list').forEach(list => {
                    list.classList.add('hidden');
                });
                document.getElementById(`tech-${tabId}`)?.classList.remove('hidden');
            });
        });

        // Technology selection
        const techItems = document.querySelectorAll('.tech-item');
        techItems.forEach(item => {
            item.addEventListener('click', function() {
                const key = this.dataset.key;
                const icon = this.dataset.icon;
                const name = this.dataset.name;
                const emoji = this.dataset.emoji || '';
                
                if (this.classList.contains('selected')) {
                    this.classList.remove('selected');
                    state.selectedTechnologies = state.selectedTechnologies.filter(t => t.key !== key);
                } else {
                    this.classList.add('selected');
                    state.selectedTechnologies.push({ key, icon, name, emoji });
                }
                
                self.updateDisplay();
                templates.updateContent();
            });
        });

        // Clear all button
        if (elements.clearTechs) {
            elements.clearTechs.addEventListener('click', function() {
                state.selectedTechnologies = [];
                document.querySelectorAll('.tech-item.selected').forEach(item => {
                    item.classList.remove('selected');
                });
                self.updateDisplay();
                templates.updateContent();
            });
        }
    },
    
    find: function(key) {
        if (!window.BRANDING_DATA) return null;
        
        const allTechs = [
            ...window.BRANDING_DATA.technologies.languages,
            ...window.BRANDING_DATA.technologies.frameworks,
            ...window.BRANDING_DATA.technologies.tools,
            ...(window.BRANDING_DATA.technologies.specialties || [])
        ];
        
        return allTechs.find(t => t.key === key);
    },
    
    updateDisplay: function() {
        const state = window.BrandingEditor.state;
        const elements = window.BrandingEditor.elements;
        const templates = window.BrandingEditor.templates;
        const self = this;
        
        if (!elements.selectedTechsList) return;
        
        elements.selectedTechsList.innerHTML = '';
        
        state.selectedTechnologies.forEach((tech, index) => {
            const chip = document.createElement('span');
            chip.className = 'selected-tech';
            chip.setAttribute('data-index', index);
            
            // Reorder buttons container
            const reorderBtns = document.createElement('span');
            reorderBtns.className = 'reorder-btns';
            
            // Move up button
            if (index > 0) {
                const moveUpBtn = document.createElement('button');
                moveUpBtn.className = 'reorder-btn move-up';
                moveUpBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg>';
                moveUpBtn.title = 'Monter';
                moveUpBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    self.move(index, index - 1);
                });
                reorderBtns.appendChild(moveUpBtn);
            }
            
            // Move down button
            if (index < state.selectedTechnologies.length - 1) {
                const moveDownBtn = document.createElement('button');
                moveDownBtn.className = 'reorder-btn move-down';
                moveDownBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg>';
                moveDownBtn.title = 'Descendre';
                moveDownBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    self.move(index, index + 1);
                });
                reorderBtns.appendChild(moveDownBtn);
            }
            
            chip.appendChild(reorderBtns);
            
            if (tech.icon) {
                const img = document.createElement('img');
                img.src = tech.icon;
                img.alt = tech.name;
                chip.appendChild(img);
            } else if (tech.emoji) {
                const emojiSpan = document.createElement('span');
                emojiSpan.className = 'tech-emoji';
                emojiSpan.textContent = tech.emoji;
                chip.appendChild(emojiSpan);
            }
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = tech.name;
            chip.appendChild(nameSpan);
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-tech';
            removeBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
            removeBtn.addEventListener('click', () => {
                state.selectedTechnologies = state.selectedTechnologies.filter(t => t.key !== tech.key);
                document.querySelector(`.tech-item[data-key="${tech.key}"]`)?.classList.remove('selected');
                self.updateDisplay();
                templates.updateContent();
            });
            chip.appendChild(removeBtn);
            
            elements.selectedTechsList.appendChild(chip);
        });
    },
    
    move: function(fromIndex, toIndex) {
        const state = window.BrandingEditor.state;
        const templates = window.BrandingEditor.templates;
        
        const tech = state.selectedTechnologies[fromIndex];
        state.selectedTechnologies.splice(fromIndex, 1);
        state.selectedTechnologies.splice(toIndex, 0, tech);
        this.updateDisplay();
        templates.updateContent();
    }
};
