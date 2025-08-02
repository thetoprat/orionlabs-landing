/**
 * Orion Labs Script
 */
document.addEventListener('DOMContentLoaded', () => {

    const body = document.body;
    const scrollContainer = document.querySelector('.scroll-container');
    const scrollSections = document.querySelectorAll('.scroll-section');
    const particleContainer = document.getElementById('particle-container');

    // --- 1. PARTICLE GENERATION ---
    const createParticles = () => {
        const particleCount = 50;
        if (!particleContainer) return;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            const size = Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            const duration = Math.random() * 10 + 8;
            particle.style.animationDuration = `${duration}s`;
            const delay = Math.random() * 8;
            particle.style.animationDelay = `-${delay}s`;
            particleContainer.appendChild(particle);
        }
    };

    // --- 2. THEME CUSTOMIZER LOGIC ---
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    const themePalette = document.getElementById('theme-palette');
    const themeSwatches = document.querySelectorAll('.theme-swatch');
    const colorPreview = document.getElementById('current-color-preview');
    const THEME_STORAGE_KEY = 'orion_labs_selected_theme';

    const applyTheme = (themeName) => {
        body.className = body.className.replace(/\btheme-[a-z-]+\b/g, '');
        body.classList.add(themeName);
        const newThemeSwatch = document.querySelector(`.theme-swatch[data-theme="${themeName}"]`);
        if (newThemeSwatch && colorPreview) {
            colorPreview.style.backgroundColor = newThemeSwatch.style.backgroundColor;
        }
        try {
            localStorage.setItem(THEME_STORAGE_KEY, themeName);
        } catch (error) {
            console.error("Could not save theme to localStorage:", error);
        }
    };

    const loadSavedTheme = () => {
        try {
            const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'theme-gold-dark';
            applyTheme(savedTheme);
        } catch (error) {
            console.error("Could not load theme from localStorage:", error);
        }
    };

    if (themeToggleButton && themePalette) {
        themeToggleButton.addEventListener('click', (event) => {
            event.stopPropagation();
            themePalette.classList.toggle('active');
        });
    }

    themeSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            const themeName = swatch.dataset.theme;
            if (themeName) {
                applyTheme(themeName);
                themePalette.classList.remove('active');
            }
        });
    });

    document.addEventListener('click', () => {
        if (themePalette && themePalette.classList.contains('active')) {
            themePalette.classList.remove('active');
        }
    });

    if (themePalette) {
        themePalette.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

    // --- 3. SMOOTH MANUAL SCROLL LOGIC ---
    if (scrollContainer) {
        let currentSectionIndex = 0;
        let isScrolling = false;
        const scrollDuration = 1000;

        const scrollToSection = (index) => {
            if (index < 0 || index >= scrollSections.length || isScrolling) return;
            
            isScrolling = true;
            const targetSection = scrollSections[index];
            
            const startPosition = scrollContainer.scrollTop;
            const endPosition = targetSection.offsetTop;
            const distance = endPosition - startPosition;
            let startTime = null;

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = ease(timeElapsed, startPosition, distance, scrollDuration);
                scrollContainer.scrollTo(0, run);
                if (timeElapsed < scrollDuration) {
                    requestAnimationFrame(animation);
                } else {
                    currentSectionIndex = index;
                    isScrolling = false;
                }
            }

            function ease(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t * t + b;
                t -= 2;
                return c / 2 * (t * t * t + 2) + b;
            }

            requestAnimationFrame(animation);
        };

        scrollContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (isScrolling) return;

            if (e.deltaY > 0) {
                scrollToSection(currentSectionIndex + 1);
            } else {
                scrollToSection(currentSectionIndex - 1);
            }
        }, { passive: false });
        
        scrollContainer.addEventListener('scroll', () => {
             if (scrollContainer.scrollTop > 20) {
                body.classList.add('scrolled');
            } else {
                body.classList.remove('scrolled');
            }
            
            const containerScrollTop = scrollContainer.scrollTop;
            const containerHeight = scrollContainer.clientHeight;

            scrollSections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionContent = section.querySelector('.section-content');
                if (!sectionContent) return;
                
                const progress = (sectionTop - containerScrollTop) / containerHeight;
                const opacity = 1 - Math.min(1, Math.abs(progress) * 2);
                const translateY = progress * 150;

                sectionContent.style.opacity = opacity;
                sectionContent.style.transform = `translateY(${translateY}px)`;
            });
        });

        const initialAnimation = () => {
             const containerScrollTop = scrollContainer.scrollTop;
            const containerHeight = scrollContainer.clientHeight;

            scrollSections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionContent = section.querySelector('.section-content');
                if (!sectionContent) return;
                
                const progress = (sectionTop - containerScrollTop) / containerHeight;
                const opacity = 1 - Math.min(1, Math.abs(progress) * 2);
                const translateY = progress * 150;

                sectionContent.style.opacity = opacity;
                sectionContent.style.transform = `translateY(${translateY}px)`;
            });
        }
        initialAnimation();
    }

    // --- 4. CONTACT MODAL LOGIC ---
    const modal = document.getElementById('contact-modal');
    const modalContent = modal.querySelector('.modal-content');
    const openModalBtn = document.getElementById('get-in-touch-btn');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const successOkBtn = document.getElementById('success-ok-btn');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    const openModal = () => {
        modalContent.classList.remove('show-success'); 
        contactForm.reset(); 
        formStatus.textContent = ''; 
        modal.classList.add('active');
    };
    const closeModal = () => modal.classList.remove('active');

    if(openModalBtn) openModalBtn.addEventListener('click', openModal);
    if(cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);
    if(successOkBtn) successOkBtn.addEventListener('click', closeModal);

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            formStatus.textContent = 'Sending...';
            
            const webhookUrl = 'https://discord.com/api/webhooks/1401079578428047461/3TVl-6aLMJbo7beUj2J1axl-wwVkv6Szhzkq92gfRGrliZ9LBxuClbnviLBAC2ig4mQz';
            
            const formData = new FormData(contactForm);
            const email = formData.get('email');
            const service = formData.get('service');
            const subject = formData.get('subject');
            const summary = formData.get('summary');

            const payload = {
                embeds: [{
                    title: `New Contact Form Submission: ${subject}`,
                    color: 14742302, 
                    fields: [
                        { name: 'Email', value: email, inline: true },
                        { name: 'Service', value: service, inline: true },
                        { name: 'Summary', value: summary }
                    ],
                    timestamp: new Date().toISOString()
                }]
            };

            try {
                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    modalContent.classList.add('show-success');
                } else {
                    throw new Error(`Server responded with ${response.status}`);
                }
            } catch (error) {
                console.error('Failed to send message:', error);
                formStatus.textContent = 'Failed to send message. Please try again.';
                formStatus.style.color = '#ff6b6b';
            }
        });
    }


    // --- INITIALIZATION ---
    loadSavedTheme();
    createParticles();
});
