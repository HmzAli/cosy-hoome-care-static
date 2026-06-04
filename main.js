document.addEventListener('DOMContentLoaded', () => {
    
    // Counter Animation
    const animateCounter = (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
        
        const updateCounter = () => {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observer for Stats
    const statsSection = document.querySelector('.flex.items-center.gap-8');
    
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statYears = document.getElementById('stat-years');
                    const statClients = document.getElementById('stat-clients');
                    
                    if (statYears) {
                        const targetYears = parseInt(statYears.dataset.target);
                        animateCounter(statYears, targetYears);
                    }
                    
                    if (statClients) {
                        const targetClients = parseInt(statClients.dataset.target);
                        animateCounter(statClients, targetClients);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
});
