/**
 * TechBR Victoria - Main JavaScript
 * Core functionality for the TechBR Victoria website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (navMenu.classList.contains('active') && !isClickInsideNav && !isClickOnToggle) {
            navMenu.classList.remove('active');
        }
    });
    
    // Language toggle
    const langLinks = document.querySelectorAll('.language-toggle a');
    
    langLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all language links
            langLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Here you would implement actual language switching
            // For now, we'll just log it
            console.log(`Language switched to: ${this.textContent}`);
            
            // TODO: Implement actual language switching functionality
        });
    });
    
    // Smooth scrolling for anchor links
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
    
    // Add animation classes when elements come into view
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const checkIfInView = () => {
        const windowHeight = window.innerHeight;
        const windowTopPosition = window.scrollY;
        const windowBottomPosition = windowTopPosition + windowHeight;
        
        animateElements.forEach(element => {
            const elementHeight = element.offsetHeight;
            const elementTopPosition = element.offsetTop;
            const elementBottomPosition = elementTopPosition + elementHeight;
            
            if (
                (elementBottomPosition >= windowTopPosition && 
                elementTopPosition <= windowBottomPosition)
            ) {
                element.classList.add('animated');
            }
        });
    };
    
    // Check if elements are in view on load and scroll
    window.addEventListener('load', checkIfInView);
    window.addEventListener('scroll', checkIfInView);
    
    // Testimonial rotation for homepage
    const testimonials = [
        {
            text: "Finding TechBR was a game-changer when I moved to Victoria. The community helped me settle in and find my first job in Canada.",
            author: "Ana Silva",
            title: "Software Developer",
            image: "images/testimonial1.jpg"
        },
        {
            text: "The meetups and workshops organized by TechBR Victoria have significantly expanded my professional network and kept my skills current.",
            author: "Ricardo Almeida",
            title: "Full Stack Engineer",
            image: "images/testimonial2.jpg"
        },
        {
            text: "As someone new to both tech and Canada, this group provided the support system I needed to transition into my UX design career in Victoria.",
            author: "Luciana Santos",
            title: "UX Designer",
            image: "images/testimonial3.jpg"
        }
    ];
    
    const testimonialContainer = document.getElementById('testimonials-container');
    
    if (testimonialContainer && testimonials.length > 1) {
        let currentTestimonial = 0;
        
        // Function to update testimonial content
        const updateTestimonial = () => {
            const t = testimonials[currentTestimonial];
            
            testimonialContainer.innerHTML = `
                <div class="testimonial">
                    <p>"${t.text}"</p>
                    <div class="testimonial-author">
                        <img src="${t.image}" alt="${t.author}">
                        <h4>${t.author}</h4>
                        <p>${t.title}</p>
                    </div>
                </div>
            `;
        };
        
        // Initialize with first testimonial
        updateTestimonial();
        
        // Rotate testimonials every 8 seconds
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            updateTestimonial();
        }, 8000);
    }
});
