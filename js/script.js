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