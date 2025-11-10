document.addEventListener('DOMContentLoaded', () => {
    const projectSquares = document.querySelectorAll('.project-square');
    
    projectSquares.forEach(square => {
        square.addEventListener('click', () => {
            // Only handle clicks on mobile
            if (window.innerWidth <= 768) {
                const inner = square.querySelector('.project-inner');
                inner.classList.add('flipped');
                
                // Auto flip back after 3 seconds
                setTimeout(() => {
                    inner.classList.remove('flipped');
                }, 3000);
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Remove flipped class from all projects when resizing above mobile breakpoint
        if (window.innerWidth > 768) {
            projectSquares.forEach(square => {
                const inner = square.querySelector('.project-inner');
                inner.classList.remove('flipped');
            });
        }
    });
});