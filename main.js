document.addEventListener('DOMContentLoaded', () => {
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
                const response = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer re_Z2TdwYQC_7dvbdBvXJ8oMotpLfuUhsxSB'
                    },
                    body: JSON.stringify({
                        from: 'Cosy Home Care <no-reply@hapapoint.co.ke>',
                        to: ['plomenet@gmail.com'],
                        reply_to: data.email,
                        subject: 'New Contact Form Submission',
                        html: `
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <meta charset="UTF-8" />
                                <title>Contact Form Submission</title>
                            </head>
                            <body style="margin:0; padding:0; background:#f6f8fb; font-family:Arial, sans-serif;">
                                <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
                                    <tr>
                                        <td align="center">
                                            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
                                                <tr>
                                                    <td style="background:#2c3e50; padding:20px; text-align:center; color:#fff;">
                                                        <h2 style="margin:0; font-size:20px;">New Contact Form Submission</h2>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:20px; font-size:14px; color:#333; line-height:1.6;">
                                                        <h3 style="margin-top:0; color:#2c3e50;">Personal Information</h3>
                                                        <p><strong>First Name:</strong> ${data.firstName || '-'}</p>
                                                        <p><strong>Last Name:</strong> ${data.lastName || '-'}</p>
                                                        <p><strong>Email:</strong> ${data.email || '-'}</p>
                                                        <p><strong>Phone:</strong> ${data.phone || '-'}</p>
                                                        <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />
                                                        <h3 style="color:#2c3e50;">Service Details</h3>
                                                        <p><strong>Selected Services:</strong><br/>${data.selectedServices.join(', ') || '-'}</p>
                                                        <p><strong>Seeking For:</strong> ${data.seekingFor || '-'}</p>
                                                        <p><strong>Details:</strong><br/>${data.details || '-'}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="background:#f1f1f1; text-align:center; padding:12px; font-size:12px; color:#777;">
                                                        This email was automatically generated from the contact form.
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </body>
                            </html>
                        `
                    })
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
