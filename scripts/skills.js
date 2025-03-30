document.addEventListener('DOMContentLoaded', () => {
    const skills = [
        { name: 'Rust', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Rust_programming_language_black_logo.svg/1200px-Rust_programming_language_black_logo.svg.png' },
        { name: 'PHP', img: 'https://www.php.net/images/logos/new-php-logo.svg' },
        { name: 'Tableau', img: 'https://www.tableau.com/sites/default/files/2021-01/Tableau_Logo_Blue.svg' },
        { name: 'React', img: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' },
        { name: 'Go', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Go-logo-blue.svg/1200px-Go-logo-blue.svg.png' },
        { name: 'Node.js', img: 'https://nodejs.org/static/images/logo.svg' },
        { name: 'Python', img: 'https://www.python.org/static/community_logos/python-logo-generic.svg' },
        { name: 'HTML', img: 'https://www.w3.org/html/logo/downloads/HTML5_Logo.svg' },
        { name: 'Git', img: 'https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png' },
        { name: 'MongoDB', img: 'https://www.mongodb.com/assets/images/press/logo/MongoDB_Logo_FullColorBlack_RGB.png' },
        { name: 'PostgreSQL', img: 'https://www.postgresql.org/media/img/about/press/elephant.png' },
        { name: 'Linux', img: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg' },
        { name: 'AWS', img: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
        { name: 'Docker', img: 'https://www.docker.com/wp-content/uploads/2022/03/vertical-logo-monochromatic.png' }
    ];

    const skillsGrid = document.querySelector('.skills-grid');
    const svg = document.querySelector('.skills-connections');
    const skillElements = [];
    let isDragging = false;
    let currentSkill = null;
    let connections = [];

    // Create skill elements
    skills.forEach((skill, index) => {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        
        // Add random animation delay
        const delay = Math.random() * 4; // Random delay between 0-4s
        skillItem.style.setProperty('--delay', delay);
        
        skillItem.innerHTML = `
            <img src="${skill.img}" alt="${skill.name}">
            <span>${skill.name}</span>
        `;
        
        // Position skills in a circular pattern
        const angle = (index / skills.length) * 2 * Math.PI;
        const radius = Math.min(skillsGrid.clientWidth, skillsGrid.clientHeight) * 0.35;
        const x = radius * Math.cos(angle) + skillsGrid.clientWidth / 2;
        const y = radius * Math.sin(angle) + skillsGrid.clientHeight / 2;
        
        // Add slight random offset to initial position
        const randomOffset = 20;
        const randomX = (Math.random() - 0.5) * randomOffset;
        const randomY = (Math.random() - 0.5) * randomOffset;
        
        skillItem.style.left = `${x - 60 + randomX}px`;
        skillItem.style.top = `${y - 60 + randomY}px`;
        
        skillElements.push(skillItem);
        skillsGrid.appendChild(skillItem);

        // Add drag functionality
        skillItem.addEventListener('mousedown', startDragging);
        skillItem.addEventListener('touchstart', startDragging);
    });

    // Smooth movement for connections
    function updateConnections() {
        svg.innerHTML = '';
        skillElements.forEach((skill, i) => {
            const rect1 = skill.getBoundingClientRect();
            const gridRect = skillsGrid.getBoundingClientRect();
            
            skillElements.forEach((otherSkill, j) => {
                if (i < j) {
                    const rect2 = otherSkill.getBoundingClientRect();
                    const distance = Math.hypot(
                        rect1.left - rect2.left,
                        rect1.top - rect2.top
                    );
                    
                    if (distance < 200) {
                        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        const x1 = rect1.left + rect1.width / 2 - gridRect.left;
                        const y1 = rect1.top + rect1.height / 2 - gridRect.top;
                        const x2 = rect2.left + rect2.width / 2 - gridRect.left;
                        const y2 = rect2.top + rect2.height / 2 - gridRect.top;
                        
                        // Add curved connections
                        const dx = x2 - x1;
                        const dy = y2 - y1;
                        const curvature = 0.3;
                        const cx = x1 + dx * 0.5;
                        const cy = y1 + dy * 0.5 - Math.min(Math.abs(dx), Math.abs(dy)) * curvature;
                        
                        path.setAttribute('d', `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`);
                        path.style.opacity = Math.max(0.1, 1 - distance / 200);
                        svg.appendChild(path);
                    }
                }
            });
        });
    }

    // Update the startDragging function
    function startDragging(e) {
        isDragging = true;
        currentSkill = e.currentTarget;
        currentSkill.style.animation = 'none'; // Pause floating animation while dragging
        const rect = currentSkill.getBoundingClientRect();
        
        function onMove(e) {
            if (!isDragging) return;
            
            const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
            
            const gridRect = skillsGrid.getBoundingClientRect();
            const x = clientX - gridRect.left - rect.width / 2;
            const y = clientY - gridRect.top - rect.height / 2;
            
            // Add smooth movement
            currentSkill.style.transition = 'left 0.1s, top 0.1s';
            currentSkill.style.left = `${x}px`;
            currentSkill.style.top = `${y}px`;
            
            requestAnimationFrame(updateConnections);
        }
        
        function stopDragging() {
            isDragging = false;
            currentSkill.style.transition = 'all 0.3s ease';
            currentSkill.style.animation = ''; // Resume floating animation
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', stopDragging);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', stopDragging);
        }
        
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', stopDragging);
        document.addEventListener('touchmove', onMove);
        document.addEventListener('touchend', stopDragging);
    }

    // Initial setup
    setTimeout(() => {
        updateConnections();
        // Add smooth transitions after initial positioning
        skillElements.forEach(skill => {
            skill.style.transition = 'all 0.3s ease';
        });
    }, 100);

    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateConnections, 100);
    });
}); 