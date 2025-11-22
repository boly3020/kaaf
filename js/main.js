/**
 * KAAF - Main JavaScript
 * Karim Alaa Architectural Firm
 */

(function() {
    'use strict';

    // DOM Elements
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const loader = document.getElementById('loader');
    const cursorFollower = document.querySelector('.cursor-follower');

    // --------------------------------------------------------------------------
    // Loading Screen
    // --------------------------------------------------------------------------
    function initLoader() {
        if (!loader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = '';
            }, 1800);
        });

        // Prevent scroll during loading
        document.body.style.overflow = 'hidden';
    }

    // --------------------------------------------------------------------------
    // Custom Cursor
    // --------------------------------------------------------------------------
    function initCursor() {
        if (!cursorFollower || window.matchMedia('(hover: none)').matches) return;

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;

            cursorX += dx * 0.15;
            cursorY += dy * 0.15;

            cursorFollower.style.left = cursorX + 'px';
            cursorFollower.style.top = cursorY + 'px';

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .project-card, .service-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorFollower.classList.add('active'));
            el.addEventListener('mouseleave', () => cursorFollower.classList.remove('active'));
        });
    }

    // --------------------------------------------------------------------------
    // Mobile Navigation
    // --------------------------------------------------------------------------
    function initNavigation() {
        if (!navToggle || !nav) return;

        function toggleNav() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('active');
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        }

        function closeNav() {
            navToggle.setAttribute('aria-expanded', 'false');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }

        navToggle.addEventListener('click', toggleNav);

        navLinks.forEach(link => {
            link.addEventListener('click', closeNav);
        });

        // Close nav on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                closeNav();
            }
        });
    }

    // --------------------------------------------------------------------------
    // Header Scroll Effect
    // --------------------------------------------------------------------------
    function initHeaderScroll() {
        if (!header) return;

        function handleScroll() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
    }

    // --------------------------------------------------------------------------
    // Smooth Scroll for Anchor Links
    // --------------------------------------------------------------------------
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));

                if (target) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - headerHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // --------------------------------------------------------------------------
    // Scroll Reveal Animation
    // --------------------------------------------------------------------------
    function initReveal() {
        const reveals = document.querySelectorAll('.section-header, .service-card, .project-card, .about-text, .about-visual, .contact-info, .contact-form');

        if (!reveals.length) return;

        reveals.forEach((element, index) => {
            element.classList.add('reveal');
        });

        function reveal() {
            reveals.forEach(element => {
                const windowHeight = window.innerHeight;
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 100;

                if (elementTop < windowHeight - elementVisible) {
                    element.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', reveal, { passive: true });
        reveal(); // Initial check
    }

    // --------------------------------------------------------------------------
    // Counter Animation for Stats
    // --------------------------------------------------------------------------
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');

        if (!counters.length) return;

        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count'));
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;

                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target + '+';
                        }
                    };

                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    }

    // --------------------------------------------------------------------------
    // Hero Particles
    // --------------------------------------------------------------------------
    function initParticles() {
        const particles = document.getElementById('particles');
        if (!particles) return;

        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: rgba(196, 112, 60, ${Math.random() * 0.5 + 0.2});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s linear infinite;
                animation-delay: -${Math.random() * 10}s;
            `;
            particles.appendChild(particle);
        }

        // Add float animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% {
                    transform: translate(0, 0) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translate(${Math.random() > 0.5 ? '' : '-'}100px, -100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // --------------------------------------------------------------------------
    // Contact Form Handler
    // --------------------------------------------------------------------------
    function initContactForm() {
        const form = document.getElementById('contactForm');

        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Simple validation
            if (!data.name || !data.email || !data.message) {
                alert('Please fill in all required fields.');
                return;
            }

            const button = form.querySelector('button[type="submit"]');
            const buttonText = button.querySelector('span');
            const originalText = buttonText.textContent;

            buttonText.textContent = 'Sending...';
            button.disabled = true;

            // Simulate sending
            setTimeout(() => {
                buttonText.textContent = 'Message Sent!';
                form.reset();

                setTimeout(() => {
                    buttonText.textContent = originalText;
                    button.disabled = false;
                }, 2000);
            }, 1000);
        });
    }

    // --------------------------------------------------------------------------
    // Active Navigation Link on Scroll
    // --------------------------------------------------------------------------
    function initActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');

        if (!sections.length || !navLinks.length) return;

        function updateActiveLink() {
            const scrollPos = window.pageYOffset + (header ? header.offsetHeight : 0) + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', updateActiveLink, { passive: true });
    }

    // --------------------------------------------------------------------------
    // Magnetic Effect on Buttons (Desktop only)
    // --------------------------------------------------------------------------
    function initMagneticButtons() {
        if (window.matchMedia('(hover: none)').matches) return;

        const buttons = document.querySelectorAll('.btn-primary');

        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }

    // --------------------------------------------------------------------------
    // PDF Tab Functionality
    // --------------------------------------------------------------------------
    function initPdfTabs() {
        const pdfTabs = document.querySelectorAll('.pdf-tab');
        const pdfPreview = document.getElementById('pdfPreview');

        if (!pdfTabs.length || !pdfPreview) return;

        pdfTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                pdfTabs.forEach(t => t.classList.remove('active'));

                // Add active class to clicked tab
                tab.classList.add('active');

                // Update iframe src
                const pdfUrl = tab.getAttribute('data-pdf');
                pdfPreview.src = pdfUrl;
            });
        });
    }

    // --------------------------------------------------------------------------
    // Initialize
    // --------------------------------------------------------------------------
    function init() {
        initLoader();
        initCursor();
        initNavigation();
        initHeaderScroll();
        initSmoothScroll();
        initReveal();
        initCounters();
        initParticles();
        initContactForm();
        initActiveNavLink();
        initMagneticButtons();
        initPdfTabs();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
