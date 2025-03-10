/**
 * TechBR Victoria - Contact Form JavaScript
 * Handles form validation and submission
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
            const subscribeCheckbox = document.getElementById('subscribe');
            
            // Validate form fields
            let isValid = true;
            let errorMessages = [];
            
            // Name validation
            if (nameInput.value.trim() === '') {
                isValid = false;
                errorMessages.push('Please enter your name');
                nameInput.classList.add('error');
            } else {
                nameInput.classList.remove('error');
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                isValid = false;
                errorMessages.push('Please enter a valid email address');
                emailInput.classList.add('error');
            } else {
                emailInput.classList.remove('error');
            }
            
            // Subject validation
            if (subjectSelect.value === '') {
                isValid = false;
                errorMessages.push('Please select a subject');
                subjectSelect.classList.add('error');
            } else {
                subjectSelect.classList.remove('error');
            }
            
            // Message validation
            if (messageTextarea.value.trim() === '') {
                isValid = false;
                errorMessages.push('Please enter your message');
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
                    subscribeNewsletter: subscribeCheckbox.checked
                };
                
                // Simulate form submission
                console.log('Form data:', formData);
                
                // Show success message
                showFormMessage('Your message has been sent successfully. We will get back to you soon!', 'success');
                
                // Reset form
                contactForm.reset();
            } else {
                // Show error messages
                showFormMessage(errorMessages.join('<br>'), 'error');
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
    
    // Add CSS for form validation and messages
    const style = document.createElement('style');
    style.textContent = `
        .form-control.error {
            border-color: #ff3860;
        }
        
        .form-message {
            padding: 10px 15px;
            border-radius: var(--border-radius);
            margin-bottom: 20px;
            transition: opacity 0.5s ease;
        }
        
        .form-message.error {
            background-color: #feecf0;
            color: #cc0f35;
            border-left: 4px solid #cc0f35;
        }
        
        .form-message.success {
            background-color: #effaf3;
            color: #257942;
            border-left: 4px solid #257942;
        }
    `;
    document.head.appendChild(style);
});
