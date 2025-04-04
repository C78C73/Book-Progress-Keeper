document.addEventListener('DOMContentLoaded', () => {
    // Elements selection
    const statsValues = document.querySelectorAll('.stat-value');
    const btnView = document.querySelector('.btn-view');
    
    // Animation for stats counters
    statsValues.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        let currentValue = 0;
        
        const updateCounter = () => {
            if (currentValue < finalValue) {
                currentValue++;
                stat.textContent = currentValue;
                setTimeout(updateCounter, 100);
            }
        };
        
        // Delay counter animation
        setTimeout(updateCounter, 800);
    });
    
    // Button hover effects
    btnView.addEventListener('mouseenter', () => {
        btnView.style.transform = 'translateY(-3px)';
    });
    
    btnView.addEventListener('mouseleave', () => {
        btnView.style.transform = 'translateY(0)';
    });
    
    // Add more book functionality here
    btnView.addEventListener('click', () => {
        alert('Library view functionality will be implemented soon!');
    });
});