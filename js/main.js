/**
 * TechBR Victoria - Main JavaScript
 * Core functionality for the Brazilian tech community website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    initMobileMenu();
    
    // Common functionality
    initSmoothScrolling();
    initAnimations();
    initLightbox();
    
    // Page-specific functionality
    if (document.getElementById('upcoming-events-list')) {
        initEvents();
    }
    
    if (document.getElementById('members-container')) {
        initMembersList();
    }
    
    if (document.getElementById('contactForm')) {
        initContactForm();
    }
    
    // Easter eggs
    initEasterEggs();
});

// Mobile menu functionality
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (menuToggle && navMenu) {
        // Toggle menu on click
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            
            if (navMenu.classList.contains('active') && !isClickInsideNav && !isClickOnToggle) {
                navMenu.classList.remove('active');
            }
        });
    }
    
    // Language toggle functionality removed
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animation when elements come into view
function initAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const checkIfInView = () => {
        const windowHeight = window.innerHeight;
        const windowTopPosition = window.scrollY;
        const windowBottomPosition = windowTopPosition + windowHeight;
        
        animateElements.forEach(element => {
            const elementHeight = element.offsetHeight;
            const elementTopPosition = element.offsetTop;
            const elementBottomPosition = elementTopPosition + elementHeight;
            
            if ((elementBottomPosition >= windowTopPosition && elementTopPosition <= windowBottomPosition)) {
                element.classList.add('animated');
            }
        });
    };
    
    window.addEventListener('load', checkIfInView);
    window.addEventListener('scroll', checkIfInView);
}

// Image lightbox functionality
function initLightbox() {
    const galleryImages = document.querySelectorAll('.gallery-item img, .photo-item img');
    
    if (galleryImages.length > 0) {
        galleryImages.forEach(img => {
            img.addEventListener('click', function() {
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox';
                lightbox.innerHTML = `
                    <div class="lightbox-content">
                        <img src="${this.src}" alt="${this.alt}">
                        <p>${this.alt}</p>
                    </div>
                    <div class="lightbox-close">&times;</div>
                `;
                
                document.body.appendChild(lightbox);
                document.body.style.overflow = 'hidden';
                
                // Close on click
                lightbox.addEventListener('click', function() {
                    this.remove();
                    document.body.style.overflow = '';
                });
            });
        });
    }
}

// Events page functionality - simplified
function initEvents() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // In a real implementation, this would filter the events
                console.log(`Filter selected: ${this.getAttribute('data-filter')}`);
            });
        });
    }
    
    // Event registration buttons
    document.querySelectorAll('.btn.primary').forEach(button => {
        if (button.textContent.includes('Count Me In') || 
            button.textContent.includes("I'll Be There") || 
            button.textContent.includes('Let Us Know')) {
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                this.textContent = "You're registered!";
                setTimeout(() => {
                    this.textContent = "I'll Be There!";
                }, 2000);
            });
        }
    });
}

// Members list from LinkedIn URLs
function initMembersList() {
    const membersContainer = document.getElementById('members-container');
    
    if (membersContainer) {
        // Simple demo version that doesn't attempt to access real data
        membersContainer.innerHTML = `
            <div class="members-note">
                <p>In a production environment, this section would display community members pulled from approved LinkedIn profiles.</p>
                <p>For privacy and technical reasons, we're displaying this message instead of demo data.</p>
                <p>To join our member directory, please contact us with your LinkedIn URL.</p>
            </div>
        `;
    }
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Show success message
                const message = document.createElement('div');
                message.className = 'form-message success';
                message.textContent = 'Message sent! We\'ll get back to you soon.';
                
                contactForm.prepend(message);
                contactForm.reset();
                
                // Remove message after a few seconds
                setTimeout(() => {
                    message.remove();
                }, 5000);
            } else {
                // Show error message
                const message = document.createElement('div');
                message.className = 'form-message error';
                message.textContent = 'Please fill in all required fields.';
                
                contactForm.prepend(message);
                
                // Remove existing message when user corrects errors
                requiredFields.forEach(field => {
                    field.addEventListener('input', function() {
                        const existingMessage = contactForm.querySelector('.form-message.error');
                        if (existingMessage) existingMessage.remove();
                    }, { once: true });
                });
            }
        });
    }
}

// Easter eggs for fun
function initEasterEggs() {
    let keyBuffer = '';
    const brazilianTerms = ['saudade', 'coxinha', 'pastel', 'churrasco', 'brigadeiro', 'pao de queijo'];
    
    document.addEventListener('keydown', function(e) {
        keyBuffer += e.key.toLowerCase();
        keyBuffer = keyBuffer.slice(-15);
        
        for (const term of brazilianTerms) {
            if (keyBuffer.includes(term)) {
                showEasterEgg(term);
                keyBuffer = '';
                break;
            }
        }
    });
}

// Show easter egg message
function showEasterEgg(term) {
    const messages = {
        'saudade': 'Sentindo saudades do Brasil? Nós também! 🇧🇷',
        'coxinha': 'Hmm... coxinha! Alguém sabe onde encontrar uma boa por aqui? 😋',
        'pastel': 'Um pastel de feira e caldo de cana... sonho impossível em Victoria! 🥟',
        'churrasco': 'Churrasco no Willows Beach! 🍖',
        'brigadeiro': 'Brigadeiro! A melhor forma de fazer amigos canadenses! 🍫',
        'pao de queijo': 'Pão de queijo é uma commodity rara em Victoria! 🧀'
    };
    
    alert(messages[term] || 'Oi! Você encontrou um Easter egg brasileiro!');
}
