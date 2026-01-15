// ============= Particles.js Configuration =============
particlesJS('particles-js', {
    particles: {
        number: { 
            value: 80, 
            density: { 
                enable: true, 
                value_area: 800 
            } 
        },
        color: { 
            value: '#00d9ff' 
        },
        shape: { 
            type: 'circle' 
        },
        opacity: { 
            value: 0.5, 
            random: false 
        },
        size: { 
            value: 3, 
            random: true 
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#00d9ff',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { 
                enable: true, 
                mode: 'repulse' 
            },
            onclick: { 
                enable: true, 
                mode: 'push' 
            },
            resize: true
        }
    },
    retina_detect: true
});

// ============= Typing Animation =============
const texts = [
    'Building Smarter Realities',
    'GenAI Specialist', 
    'NLP Engineer', 
    'Computer Vision Expert', 
    'Data Science Enthusiast'
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 100;
const deletingSpeed = 50;
const delayBetweenTexts = 2000;

function type() {
    const currentText = texts[textIndex];
    const displayText = isDeleting 
        ? currentText.substring(0, charIndex--)
        : currentText.substring(0, charIndex++);
    
    const typedElement = document.getElementById('typed-text');
    if (typedElement) {
        typedElement.textContent = displayText;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => isDeleting = true, delayBetweenTexts);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
    }
    
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    setTimeout(type, speed);
}

// Start typing animation when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    type();
});

// ============= Smooth Scroll =============
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

// ============= Scroll Animation for Elements =============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.skill-category, .project-card, .stat-card, .timeline-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

// ============= Form Submission =============
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Here you would typically send the data to a server
        // For now, we'll just show a success message
        alert(`Thank you ${name}! I'll get back to you soon at ${email}.`);
        
        // Reset form
        this.reset();
    });
}

// ============= Active Navigation Highlighting =============
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ============= Number Counter Animation =============
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const isDecimal = target.toString().includes('.');
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = isDecimal 
                ? current.toFixed(1) 
                : Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseFloat(text.replace(/[^0-9.]/g, ''));
                const suffix = text.replace(/[0-9.]/g, '');
                
                animateCounter(stat, number);
                
                // Add suffix back
                setTimeout(() => {
                    stat.textContent = stat.textContent + suffix;
                }, 2000);
            });
            entry.target.dataset.animated = 'true';
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});