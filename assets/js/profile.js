/**
 * Profile Section Interactive Features
 * 
 * Handles floating tiles interactions and dynamic background changes
 */

document.addEventListener('DOMContentLoaded', function() {
    const profileSection = document.querySelector('.profile-section');
    const floatingTiles = document.querySelectorAll('.floating-tile');
    
    // Project background images mapping
    const projectBackgrounds = {
        'terra-memoria': '/images/projects/terra-memoria/terra-memoria-background.jpg',
        'my-game-showcase': '/images/projects/my-game-showcase/artbook.webp',
        'nuketown-zombies': '/images/projects/nuketown/nuketown-zombies.jpg',
        'unity-tools': '/images/projects/unity-tools.jpg',
        'witchable': '/images/projects/witchable/witchable-bg.jpg',
        'stone-keepers': '/images/projects/stone-keepers/stone-keepers-bg.jpg',
        'galaxian': '/images/projects/galaxian/galaxian-bg.jpg',
        'portfolio-widgets': '/images/projects/portfolio-widget-system/widgets-bg.jpg'
    };
    
    // Add hover effects for floating tiles
    floatingTiles.forEach(tile => {
        const projectKey = tile.getAttribute('data-project');
        
        tile.addEventListener('mouseenter', function() {
            // Change background if project has one
            if (projectBackgrounds[projectKey]) {
                profileSection.style.setProperty('--project-bg', `url(${projectBackgrounds[projectKey]})`);
                profileSection.classList.add('has-project-bg');
                profileSection.querySelector('::before').style.backgroundImage = `url(${projectBackgrounds[projectKey]})`;
            }
            
            // Add floating effect to other tiles
            floatingTiles.forEach(otherTile => {
                if (otherTile !== tile) {
                    otherTile.style.opacity = '0.6';
                    otherTile.style.transform += ' scale(0.9)';
                }
            });
        });
        
        tile.addEventListener('mouseleave', function() {
            // Reset background
            profileSection.classList.remove('has-project-bg');
            
            // Reset other tiles
            floatingTiles.forEach(otherTile => {
                if (otherTile !== tile) {
                    otherTile.style.opacity = '';
                    otherTile.style.transform = otherTile.style.transform.replace(' scale(0.9)', '');
                }
            });
        });
    });
    
    // Add orbital movement effect
    function updateOrbitalPosition() {
        floatingTiles.forEach((tile, index) => {
            const angle = (Date.now() * 0.0002 + (index * (360 / floatingTiles.length))) % 360;
            const radius = 200;
            const centerX = radius;
            const centerY = radius;
            
            const x = centerX + Math.cos(angle * Math.PI / 180) * radius;
            const y = centerY + Math.sin(angle * Math.PI / 180) * radius;
            
            tile.style.left = `${x - 35}px`;
            tile.style.top = `${y - 35}px`;
        });
        
        requestAnimationFrame(updateOrbitalPosition);
    }
    
    // Start orbital animation
    updateOrbitalPosition();
});
