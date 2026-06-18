document.addEventListener('DOMContentLoaded', () => {
    const initHousingDetailStickyContactForm = () => {
        const section = document.getElementById('house-detail-section');
        const sidebar = document.getElementById('left-sidebar');
        const card = document.getElementById('contact-form-card');

        if (!section || !sidebar || !card) return;

        const desktopQuery = window.matchMedia('(min-width: 1024px)');
        const stickyOffset = 105;
        const stickyGap = 8;
        const topOffset = stickyOffset + stickyGap;
        const placeholder = document.createElement('div');

        card.parentNode.insertBefore(placeholder, card);

        const resetCard = () => {
            placeholder.style.display = 'none';
            placeholder.style.height = '';
            sidebar.style.position = '';
            sidebar.style.minHeight = '';
            card.style.position = '';
            card.style.top = '';
            card.style.left = '';
            card.style.bottom = '';
            card.style.width = '';
            card.style.zIndex = '';
        };

        const updateStickyState = () => {
            if (!desktopQuery.matches) {
                resetCard();
                return;
            }

            const scrollY = window.scrollY || window.pageYOffset;
            resetCard();

            const sectionRect = section.getBoundingClientRect();
            const sidebarRect = sidebar.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            const sectionTop = sectionRect.top + scrollY;
            const sectionBottom = sectionTop + section.offsetHeight;
            const cardTop = cardRect.top + scrollY;
            const cardHeight = card.offsetHeight;
            const fixedStart = cardTop - topOffset;
            const fixedEnd = sectionBottom - topOffset - cardHeight;

            sidebar.style.position = 'relative';
            sidebar.style.minHeight = `${section.offsetHeight}px`;

            if (scrollY < fixedStart) return;

            placeholder.style.display = 'block';
            placeholder.style.height = `${cardHeight}px`;

            if (scrollY >= fixedEnd) {
                card.style.position = 'absolute';
                card.style.top = `${sectionBottom - sectionTop - cardHeight}px`;
                card.style.left = '0';
                card.style.width = `${sidebarRect.width}px`;
                card.style.zIndex = '20';
                return;
            }

            card.style.position = 'fixed';
            card.style.top = `${topOffset}px`;
            card.style.left = `${sidebarRect.left}px`;
            card.style.width = `${sidebarRect.width}px`;
            card.style.zIndex = '20';
        };

        updateStickyState();
        window.addEventListener('scroll', updateStickyState, { passive: true });
        window.addEventListener('resize', updateStickyState);
        desktopQuery.addEventListener('change', updateStickyState);
    };

    initHousingDetailStickyContactForm();

    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        const message = document.getElementById('contact-form-message');
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const submitLabel = submitButton ? submitButton.innerHTML : '';

        const showMessage = (text, isSuccess) => {
            if (!message) return;
            message.textContent = text;
            message.classList.remove('hidden');
            message.style.color = isSuccess ? '#16a34a' : '#dc2626';
        };

        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const selectedServices = Array.from(contactForm.querySelectorAll('input[name="selectedServices"]:checked')).map((input) => input.value);

            if (!selectedServices.length) {
                showMessage('Please select at least one service.', false);
                return;
            }

            const data = {
                firstName: contactForm.firstName.value.trim(),
                lastName: contactForm.lastName.value.trim(),
                email: contactForm.email.value.trim(),
                phone: contactForm.phone.value.trim(),
                selectedServices,
                seekingFor: contactForm.querySelector('.pill-btn.active')?.textContent.trim() || '',
                details: contactForm.details.value.trim()
            };

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = 'Sending...';
            }

            try {
                const response = await fetch('https://api.hapapoint.co.ke/api/cosy/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error('Contact request failed');
                }

                contactForm.reset();
                showMessage("Thank you. We've received your message and we'll get back to you shortly.", true);
            } catch (error) {
                showMessage('Something went wrong. Please try again or contact us directly.', false);
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = submitLabel;
                }
            }
        });
    }
    
    // Initialize Slick Slider for Homes
    if (window.jQuery && $('#homes-slider').length) {
        $('#homes-slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerMode: true,
                    centerPadding: '30px'
                }
            }
        ]
        });
    }
    
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
