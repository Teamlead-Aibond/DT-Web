// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll Reveal Animation
const reveals = document.querySelectorAll('.reveal');

function revealOnScroll() {
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Initial check

// Header Background on Scroll
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 1)';
        header.style.boxShadow = '0 4px 12px rgba(15, 76, 129, 0.12)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 8px rgba(15, 76, 129, 0.08)';
    }
});

// Form Submission Handler with AJAX
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.submit-btn');
        const formData = new FormData(this);
        
        // Disable button during submission
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Send form data via AJAX
        fetch('php/contact.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                formMessage.className = 'success';
                formMessage.textContent = data.message;
                contactForm.reset();
            } else {
                formMessage.className = 'error';
                formMessage.textContent = data.message;
            }
            
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        })
        .catch(error => {
            formMessage.className = 'error';
            formMessage.textContent = 'An error occurred. Please try again later.';
            
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
            
            console.error('Error:', error);
        });
    });
}

// Mobile Menu Toggle (if you want to add a hamburger menu later)
function createMobileMenu() {
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');
    
    if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-toggle')) {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'mobile-menu-toggle';
        menuToggle.innerHTML = '☰';
        menuToggle.style.cssText = `
            background: var(--gradient-accent);
            border: none;
            color: white;
            font-size: 1.5rem;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            display: block;
        `;
        
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
        });
        
        nav.appendChild(menuToggle);
    }
}

// Call on load and resize
window.addEventListener('load', createMobileMenu);
window.addEventListener('resize', createMobileMenu);

// Counter Animation for Stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number, .metric-number');
    
    counters.forEach(counter => {
        const target = counter.textContent;
        const isPercentage = target.includes('%');
        const numericTarget = parseFloat(target.replace(/[^0-9.]/g, ''));
        
        if (!isNaN(numericTarget)) {
            let current = 0;
            const increment = numericTarget / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= numericTarget) {
                    current = numericTarget;
                    clearInterval(timer);
                }
                counter.textContent = isPercentage 
                    ? Math.floor(current) + '%' 
                    : Math.floor(current) + (target.includes('+') ? '+' : '');
            }, 30);
        }
    });
}

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(statsSection);
}

// ── MOBILE NAV MENU ──────────────────────────────────────────
// Added below - shows all nav links in a fullscreen overlay on mobile
document.addEventListener('DOMContentLoaded', function () {

    var nav = document.querySelector('nav');
    var navLinks = document.querySelector('.nav-links');
    if (!nav || !navLinks) return;

    // Create hamburger button
    var btn = document.createElement('button');
    btn.setAttribute('aria-label', 'Toggle navigation');
    btn.innerHTML = '<span></span><span></span><span></span>';
    btn.style.cssText = [
        'display: none',
        'flex-direction: column',
        'justify-content: center',
        'gap: 5px',
        'width: 40px',
        'height: 40px',
        'background: none',
        'border: none',
        'cursor: pointer',
        'padding: 6px',
        'margin-left: auto',
        'flex-shrink: 0'
    ].join(';');

    // Style the 3 spans
    btn.querySelectorAll('span').forEach(function (s) {
        s.style.cssText = 'display:block;width:22px;height:2px;background:#1e293b;border-radius:2px;transition:all 0.3s ease;';
    });

    nav.appendChild(btn);

    // Create fullscreen overlay
    var overlay = document.createElement('div');
    overlay.style.cssText = [
        'display: none',
        'position: fixed',
        'top: 0',
        'left: 0',
        'right: 0',
        'bottom: 0',
        'background: rgba(255,255,255,0.98)',
        'z-index: 9999',
        'flex-direction: column',
        'align-items: center',
        'justify-content: center',
        'gap: 2rem'
    ].join(';');

    // Close × button
    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = [
        'position: absolute',
        'top: 1.25rem',
        'right: 1.5rem',
        'background: none',
        'border: none',
        'font-size: 2.5rem',
        'cursor: pointer',
        'color: #475569',
        'line-height: 1'
    ].join(';');
    overlay.appendChild(closeBtn);

    // Copy all nav links into overlay
    navLinks.querySelectorAll('li').forEach(function (li) {
        var anchor = li.querySelector('a');
        if (!anchor) return;
        var a = document.createElement('a');
        a.href = anchor.getAttribute('href');
        a.textContent = anchor.textContent.trim();
        a.style.cssText = [
            'font-size: 1.6rem',
            'font-weight: 700',
            'color: #1e293b',
            'text-decoration: none',
            'font-family: Poppins, Inter, sans-serif'
        ].join(';');
        a.addEventListener('mouseenter', function () { a.style.color = '#0f4c81'; });
        a.addEventListener('mouseleave', function () { a.style.color = '#1e293b'; });
        overlay.appendChild(a);
    });

    document.body.appendChild(overlay);

    // Show/hide hamburger based on screen width
    function checkWidth() {
        if (window.innerWidth <= 968) {
            btn.style.display = 'flex';
            navLinks.style.display = 'none';
        } else {
            btn.style.display = 'none';
            navLinks.style.display = '';
            closeOverlay();
        }
    }

    function openOverlay() {
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        var spans = btn.querySelectorAll('span');
        if (spans[0]) spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        if (spans[1]) spans[1].style.opacity = '0';
        if (spans[2]) spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    }

    function closeOverlay() {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
        var spans = btn.querySelectorAll('span');
        if (spans[0]) spans[0].style.transform = '';
        if (spans[1]) spans[1].style.opacity = '1';
        if (spans[2]) spans[2].style.transform = '';
    }

    btn.addEventListener('click', function () {
        overlay.style.display === 'flex' ? closeOverlay() : openOverlay();
    });

    closeBtn.addEventListener('click', closeOverlay);

    overlay.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeOverlay);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeOverlay();
    });

    window.addEventListener('resize', checkWidth);
    checkWidth();
});
