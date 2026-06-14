document.addEventListener('DOMContentLoaded', () => {
    const SUPABASE_URL = window.SUPABASE_URL || 'https://YOUR_PROJECT_REF.supabase.co';
    const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

    // 1. Loader Removal
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    });

    // 2. AOS Initialization (Animations on Scroll)
    AOS.init({
        duration: 1000,
        once: true,
        mirror: false,
        offset: 100
    });

    // 3. Theme Toggle (Dark/Light Mode)
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.className = savedTheme;
        updateThemeIcon(savedTheme === 'light-mode');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light-mode' : 'dark-mode');
        updateThemeIcon(isLight);
    });

    function updateThemeIcon(isLight) {
        if (isLight) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    }

    // 4. Mobile Navigation
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // 5. Typing Animation for Tagline
    const tagline = document.querySelector('.tagline');
    const text = tagline.textContent;
    tagline.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            tagline.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Start typing after loader is gone
    setTimeout(typeWriter, 1500);

    // 6. Smooth Scrolling for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70, // Offset for sticky navbar
                    behavior: 'smooth'
                });
            }
        });
    });

    // 7. Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.boxShadow = 'var(--card-shadow)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.boxShadow = 'none';
        }
    });

    // 8. Contact Form Handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const formStatus = contactForm.querySelector('.form-status');
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            const name = contactForm.elements.name.value.trim();
            const email = contactForm.elements.email.value.trim();
            const message = contactForm.elements.message.value.trim();
            const isConfigured = !SUPABASE_URL.includes('YOUR_PROJECT_REF') && !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY');

            if (!isConfigured) {
                if (formStatus) {
                    formStatus.textContent = 'Add your Supabase project URL and anon key in script.js before sending messages.';
                    formStatus.className = 'form-status error';
                }
                return;
            }

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            fetch(`${SUPABASE_URL}/rest/v1/contact_messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    name,
                    email,
                    message
                })
            })
                .then(async response => {
                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(errorText || 'Unable to save the message.');
                    }

                    if (formStatus) {
                        formStatus.textContent = 'Message sent successfully. I will get back to you soon.';
                        formStatus.className = 'form-status success';
                    }

                    contactForm.reset();
                })
                .catch(() => {
                    if (formStatus) {
                        formStatus.textContent = 'Message could not be sent. Please try again later.';
                        formStatus.className = 'form-status error';
                    }
                })
                .finally(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    // 9. Glitch effect trigger (optional extra)
    const glitchText = document.querySelector('.glitch-text');
    if (glitchText) {
        setInterval(() => {
            glitchText.style.textShadow = `
                ${Math.random() * 5}px ${Math.random() * 5}px var(--accent-primary),
                ${Math.random() * -5}px ${Math.random() * -5}px var(--accent-secondary)
            `;
            setTimeout(() => {
                glitchText.style.textShadow = 'none';
            }, 50);
        }, 3000);
    }
});
