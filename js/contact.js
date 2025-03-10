/**
 * TechBR Victoria - Contact Form JavaScript
 * Handles form validation and submission with a friendly approach
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Form validation and submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectSelect = document.getElementById('subject');
            const messageTextarea = document.getElementById('message');
            const whatsappCheckbox = document.getElementById('whatsapp');
            
            // Validate form fields with friendly messages
            let isValid = true;
            let errorMessages = [];
            
            // Name validation
            if (nameInput.value.trim() === '') {
                isValid = false;
                errorMessages.push('We\'d love to know your name!');
                nameInput.classList.add('error');
            } else {
                nameInput.classList.remove('error');
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                isValid = false;
                errorMessages.push('We need a valid email so we can get back to you');
                emailInput.classList.add('error');
            } else {
                emailInput.classList.remove('error');
            }
            
            // Subject validation
            if (subjectSelect.value === '') {
                isValid = false;
                errorMessages.push('Please let us know what this is about');
                subjectSelect.classList.add('error');
            } else {
                subjectSelect.classList.remove('error');
            }
            
            // Message validation
            if (messageTextarea.value.trim() === '') {
                isValid = false;
                errorMessages.push('Don\'t forget to write your message!');
                messageTextarea.classList.add('error');
            } else {
                messageTextarea.classList.remove('error');
            }
            
            // If form is valid, submit it (or show success message in this demo)
            if (isValid) {
                // In a real application, you'd send this to your server
                const formData = {
                    name: nameInput.value,
                    email: emailInput.value,
                    subject: subjectSelect.value,
                    message: messageTextarea.value,
                    joinWhatsApp: whatsappCheckbox.checked
                };
                
                console.log('Form data:', formData);
                
                // Show appropriate success message based on WhatsApp checkbox
                if (whatsappCheckbox.checked) {
                    showFormMessage(`Thanks ${nameInput.value.split(' ')[0]}! We'll send you an invite to our WhatsApp group soon!`, 'success');
                } else {
                    showFormMessage(`Thanks for reaching out, ${nameInput.value.split(' ')[0]}! We'll get back to you soon!`, 'success');
                }
                
                // Reset form
                contactForm.reset();
            } else {
                // Show error messages with a friendly tone
                showFormMessage(`Oops! ${errorMessages.join(' ')}`, 'error');
            }
        });
        
        // Function to show form messages
        function showFormMessage(message, type) {
            // Remove any existing message
            const existingMessage = contactForm.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            // Create new message element
            const messageElement = document.createElement('div');
            messageElement.className = `form-message ${type}`;
            messageElement.innerHTML = message;
            
            // Insert message at the top of the form
            contactForm.insertBefore(messageElement, contactForm.firstChild);
            
            // Scroll to see the message if it's not visible
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Auto-hide message after 5 seconds for success messages
            if (type === 'success') {
                setTimeout(() => {
                    messageElement.style.opacity = '0';
                    setTimeout(() => messageElement.remove(), 500);
                }, 5000);
            }
        }
        
        // Add input event listeners to clear error styling when user starts typing
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('error');
                
                // Hide form error message if all fields with errors are now being corrected
                const fieldsWithErrors = contactForm.querySelectorAll('.error');
                if (fieldsWithErrors.length === 0) {
                    const errorMessage = contactForm.querySelector('.form-message.error');
                    if (errorMessage) {
                        errorMessage.remove();
                    }
                }
            });
        });
    }
    
    // Handle anchor links to the form
    const formLinks = document.querySelectorAll('a[href="#contactForm"]');
    formLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Scroll to the form
            contactForm.scrollIntoView({ behavior: 'smooth' });
            
            // Focus on the first input
            setTimeout(() => {
                document.getElementById('name').focus();
            }, 800);
            
            // If there's a WhatsApp checkbox, check it
            const whatsappCheckbox = document.getElementById('whatsapp');
            if (whatsappCheckbox) {
                whatsappCheckbox.checked = true;
            }
        });
    });
    
    // Add CSS for form validation and messages
    const style = document.createElement('style');
    style.textContent = `
        .form-control.error {
            border-color: #EC8305;
        }
        
        .form-message {
            padding: 10px 15px;
            border-radius: var(--border-radius);
            margin-bottom: 20px;
            transition: opacity 0.5s ease;
        }
        
        .form-message.error {
            background-color: rgba(236, 131, 5, 0.1);
            color: #D27000;
            border-left: 4px solid #EC8305;
        }
        
        .form-message.success {
            background-color: #e5f2fa;
            color: #024CAA;
            border-left: 4px solid #024CAA;
        }
    `;
    document.head.appendChild(style);
});
