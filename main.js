document.addEventListener('DOMContentLoaded', () => {
    const initDetailStickyContactForm = () => {
        const stickyConfigs = [
            {
                section: document.getElementById('house-detail-section'),
                sidebar: document.getElementById('left-sidebar'),
                card: document.getElementById('contact-form-card')
            },
            {
                section: document.getElementById('service-detail-section'),
                sidebar: document.getElementById('service-sidebar'),
                card: document.getElementById('sidebar-contact')
            }
        ];
        const activeConfig = stickyConfigs.find((config) => config.section && config.sidebar && config.card);

        if (!activeConfig) return;

        const { section, sidebar, card } = activeConfig;

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

    initDetailStickyContactForm();

    const initFaqAccordion = () => {
        document.querySelectorAll('.faq-toggle').forEach((toggle) => {
            toggle.addEventListener('click', () => {
                const item = toggle.closest('.faq-item');
                const content = item?.querySelector('.faq-content');
                const icon = item?.querySelector('.faq-icon');
                const isOpen = item?.classList.contains('is-open');

                document.querySelectorAll('.faq-item.is-open').forEach((openItem) => {
                    if (openItem === item) return;
                    openItem.classList.remove('is-open');
                    openItem.querySelector('.faq-content').style.maxHeight = '0px';
                    openItem.querySelector('.faq-icon').classList.replace('fa-chevron-up', 'fa-chevron-down');
                });

                item.classList.toggle('is-open', !isOpen);
                content.style.maxHeight = isOpen ? '0px' : `${content.scrollHeight}px`;
                icon.classList.replace(isOpen ? 'fa-chevron-up' : 'fa-chevron-down', isOpen ? 'fa-chevron-down' : 'fa-chevron-up');
            });
        });
    };

    initFaqAccordion();

    const initPropertyGallery = () => {
        if (!window.jQuery || !window.jQuery.fn?.slick) return;

        const $ = window.jQuery;
        const modal = document.getElementById('property-gallery-modal');
        const stage = document.getElementById('property-gallery-stage');
        const thumbs = document.getElementById('property-gallery-thumbs');
        const count = document.getElementById('property-gallery-count');
        const closeButton = document.getElementById('property-gallery-close');
        const prevButton = document.getElementById('property-gallery-modal-prev');
        const nextButton = document.getElementById('property-gallery-modal-next');
        const playToggle = document.getElementById('property-gallery-play-toggle');
        const openTriggers = document.querySelectorAll('[data-gallery-open]');

        if (!modal || !stage || !thumbs || !openTriggers.length) return;

        const $stage = $(stage);
        const $thumbs = $(thumbs);
        const gallerySlideCount = stage.querySelectorAll(':scope > .property-gallery-slide').length;
        let isPlaying = false;

        const resetZoom = () => {
            stage.querySelectorAll('img.is-zoomed').forEach((image) => {
                image.classList.remove('is-zoomed');
                image.style.transformOrigin = '';
            });
        };

        const updateCount = (index) => {
            if (count) count.textContent = `${index + 1}/${gallerySlideCount}`;
        };

        const setPlayState = (playing) => {
            isPlaying = playing;
            $stage.slick(playing ? 'slickPlay' : 'slickPause');
            const icon = playToggle?.querySelector('i');
            if (!icon) return;
            icon.classList.toggle('fa-play', !playing);
            icon.classList.toggle('fa-pause', playing);
            playToggle.setAttribute('aria-label', playing ? 'Pause gallery' : 'Play gallery');
        };

        $stage.on('init afterChange', (event, slick, currentSlide = 0) => {
            resetZoom();
            updateCount(currentSlide);
        });

        $thumbs.slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            asNavFor: '#property-gallery-stage',
            dots: false,
            arrows: false,
            focusOnSelect: true,
            infinite: true,
            responsive: [
                { breakpoint: 768, settings: { slidesToShow: 3 } },
                { breakpoint: 480, settings: { slidesToShow: 2 } }
            ]
        });

        $stage.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            dots: false,
            infinite: true,
            autoplay: false,
            autoplaySpeed: 2200,
            asNavFor: '#property-gallery-thumbs',
            adaptiveHeight: false
        });

        const openGallery = (index) => {
            modal.classList.remove('hidden');
            requestAnimationFrame(() => modal.classList.add('is-open'));
            document.body.style.overflow = 'hidden';
            $stage.slick('setPosition');
            $thumbs.slick('setPosition');
            $stage.slick('slickGoTo', index, true);
            updateCount(index);
            setPlayState(false);
        };

        const closeGallery = () => {
            modal.classList.remove('is-open');
            setPlayState(false);
            resetZoom();
            setTimeout(() => modal.classList.add('hidden'), 250);
            document.body.style.overflow = '';
        };

        openTriggers.forEach((trigger) => {
            trigger.addEventListener('click', () => openGallery(Number(trigger.dataset.galleryOpen) || 0));
        });

        closeButton?.addEventListener('click', closeGallery);
        prevButton?.addEventListener('click', () => $stage.slick('slickPrev'));
        nextButton?.addEventListener('click', () => $stage.slick('slickNext'));
        playToggle?.addEventListener('click', () => setPlayState(!isPlaying));

        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeGallery();
        });

        document.addEventListener('keydown', (event) => {
            if (modal.classList.contains('hidden')) return;
            if (event.key === 'Escape') closeGallery();
            if (event.key === 'ArrowLeft') $stage.slick('slickPrev');
            if (event.key === 'ArrowRight') $stage.slick('slickNext');
        });

        stage.querySelectorAll('.property-gallery-slide img').forEach((image) => {
            image.addEventListener('click', (event) => {
                const rect = image.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width) * 100;
                const y = ((event.clientY - rect.top) / rect.height) * 100;
                image.style.transformOrigin = `${x}% ${y}%`;
                image.classList.toggle('is-zoomed');
            });
        });
    };

    initPropertyGallery();

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
