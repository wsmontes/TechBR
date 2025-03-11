/**
 * TechBR Victoria - Contact Form with Accessibility and UX Improvements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Debug mode - set to true to see detailed logs
    const debugMode = true;
    
    // Check if EmailJS config exists
    if (typeof EmailJSConfig === 'undefined') {
        console.error("EmailJS configuration not found! Make sure emailjs-config.js is loaded before contact.js");
        return;
    }
    
    // Find the form after DOM is fully loaded
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        console.error("Contact form not found!");
        return;
    }

    // Initialize EmailJS with config
    emailjs.init(EmailJSConfig.publicKey);
    
    if (debugMode) console.log("Form initialized:", contactForm);
    
    // CRITICAL FIX: Create a data storage to preserve form values
    const formDataStorage = {
        name: '',
        email: '',
        subject: '',
        message: '',
        whatsapp: true
    };
    
    // Watch for form mutations that might be destroying our data
    setupFormProtection(contactForm);
    
    // Track form values to detect loss during submission
    contactForm.addEventListener('change', function(event) {
        if (event.target && event.target.name && event.target.name !== 'website') {
            const fieldName = event.target.name;
            const fieldValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
            
            // Store value in our backup storage
            formDataStorage[fieldName] = fieldValue;
            
            if (debugMode) {
                console.log(`Field ${fieldName} changed to:`, fieldValue);
                console.log("Updated formDataStorage:", {...formDataStorage});
            }
            
            // Also store in data attribute as backup
            event.target.setAttribute('data-last-value', 
                event.target.type === 'checkbox' ? event.target.checked : event.target.value);
        }
    });
    
    // Also capture input events for more responsive tracking
    contactForm.addEventListener('input', function(event) {
        if (event.target && event.target.name && event.target.name !== 'website') {
            const fieldName = event.target.name;
            const fieldValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
            
            // Store value in our backup storage
            formDataStorage[fieldName] = fieldValue;
            
            // Also store in data attribute as backup
            event.target.setAttribute('data-last-value', 
                event.target.type === 'checkbox' ? event.target.checked : event.target.value);
        }
    });
    
    // Form submission handler
    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        if (debugMode) console.log("Form submission triggered");
        
        // COLLECT FORM DATA DIRECTLY - bypass element references
        const formData = new FormData(contactForm);
        
        // Log all form values from FormData
        if (debugMode) {
            console.log("FormData entries:");
            for (let [key, value] of formData.entries()) {
                console.log(`- ${key}: ${value}`);
            }
            
            // Also check direct form element values
            const directValues = {
                name: contactForm.querySelector('#name')?.value || 'Not found',
                email: contactForm.querySelector('#email')?.value || 'Not found',
                subject: contactForm.querySelector('#subject')?.value || 'Not found',
                message: contactForm.querySelector('#message')?.value || 'Not found'
            };
            
            console.log("Direct element queries:");
            console.log(directValues);
            
            // Check for data-last-value attributes
            const storedValues = {
                name: contactForm.querySelector('#name')?.getAttribute('data-last-value') || 'Not found',
                email: contactForm.querySelector('#email')?.getAttribute('data-last-value') || 'Not found',
                subject: contactForm.querySelector('#subject')?.getAttribute('data-last-value') || 'Not found',
                message: contactForm.querySelector('#message')?.getAttribute('data-last-value') || 'Not found'
            };
            
            console.log("Stored data attribute values:");
            console.log(storedValues);
            
            // Log our persistent storage
            console.log("Form data storage (most reliable):");
            console.log({...formDataStorage});
        }
        
        // Get form feedback element
        const formFeedback = contactForm.querySelector('#formFeedback');
        
        // Check for honeypot
        if (formData.get('website')) {
            if (debugMode) console.log('Bot submission detected');
            return false;
        }

        // CRITICAL RECOVERY: Build validation data using our reliable storage
        const validationData = {
            name: formDataStorage.name || '',
            email: formDataStorage.email || '',
            subject: formDataStorage.subject || '',
            message: formDataStorage.message || '',
            whatsapp: formDataStorage.whatsapp
        };
        
        if (debugMode) {
            console.log("Using recovered data for validation:", validationData);
        }
        
        // Validate form using the recovered values
        const errors = validateFormData(validationData);
        const isValid = errors.length === 0;
        
        if (debugMode) console.log("Form validation result:", isValid, errors);
        
        if (!isValid) {
            if (debugMode) console.log('Form validation failed');
            
            // Show validation summary at the top
            showValidationSummary(errors, formFeedback);
            
            // Apply error styling to fields
            applyErrorsToFields(contactForm, validationData);
            
            return false;
        }
        
        // Get submit button and spinner
        const submitBtn = contactForm.querySelector('#submitBtn');
        const spinner = submitBtn?.querySelector('.spinner');
        
        // Show loading state
        setLoadingState(true, submitBtn, spinner);
        
        try {
            if (debugMode) {
                console.log('Preparing to send form via EmailJS');
                console.log('Using EmailJS configuration:', {
                    serviceId: EmailJSConfig.serviceId,
                    templateId: EmailJSConfig.templateId,
                    publicKey: EmailJSConfig.publicKey.substring(0, 5) + '...'
                });
            }
            
            // Format the data for better email presentation
            const formattedData = {
                name: validationData.name,
                email: validationData.email,
                subject: validationData.subject,
                message: validationData.message,
                whatsapp: validationData.whatsapp,
                // Add a formatted message that includes all form data for the email body
                formatted_message: formatEmailBody(validationData)
            };
            
            if (debugMode) console.log('Form data for submission (formatted):', formattedData);
            
            // CRITICAL FIX: Create a temporary form with our recovered values
            const tempForm = document.createElement('form');
            tempForm.style.display = 'none';
            document.body.appendChild(tempForm);
            
            // Add the input fields with recovered values and the formatted message
            for (const [key, value] of Object.entries(formattedData)) {
                const input = document.createElement('input');
                input.name = key;
                input.value = value === true ? 'Yes' : (value === false ? 'No' : (value || ''));
                tempForm.appendChild(input);
            }
            
            // Send using the temporary form with our recovered values
            const result = await emailjs.sendForm(
                EmailJSConfig.serviceId,
                EmailJSConfig.templateId,
                tempForm,
                EmailJSConfig.publicKey
            );
            
            // Remove the temporary form
            document.body.removeChild(tempForm);
            
            if (debugMode) console.log('Email sent successfully:', result);
            
            // After successful submission
            const firstName = validationData.name.trim().split(' ')[0];
            const successMessage = validationData.whatsapp
                ? EmailJSConfig.contactForm.successMessageWhatsApp.replace('{firstName}', firstName)
                : EmailJSConfig.contactForm.successMessageGeneral.replace('{firstName}', firstName);
            
            // Clear the original form and our storage
            contactForm.reset();
            resetFormDataStorage();
            
            // Clear data attributes and any backup storage
            clearAllFormData(contactForm);
            
            showSuccessMessage(successMessage, formFeedback);
            
        } catch (error) {
            console.error('EmailJS Error:', error);
            
            let errorMessage = 'Sorry, there was an error sending your message. Please try again later or email us directly.';
            
            // Better error handling for common EmailJS issues
            if (error && error.text) {
                if (error.text.includes('template ID not found')) {
                    errorMessage = `Error: The email template was not found. Please contact us directly at ${EmailJSConfig.contactForm.supportEmail}`;
                    console.error("CONFIGURATION ERROR: The template ID in emailjs-config.js is incorrect!");
                    console.error("Please update the templateId in emailjs-config.js to match your EmailJS dashboard");
                } else if (error.text.includes('service ID not found')) {
                    errorMessage = `Error: The email service was not found. Please contact us directly at ${EmailJSConfig.contactForm.supportEmail}`;
                    console.error("CONFIGURATION ERROR: The service ID in emailjs-config.js is incorrect!");
                } else if (debugMode) {
                    errorMessage = `Error sending message: ${error.text}. Please try again or contact us directly at ${EmailJSConfig.contactForm.supportEmail}`;
                }
            }
            
            showErrorMessage(errorMessage, formFeedback);
        } finally {
            setLoadingState(false, submitBtn, spinner);
        }
    });
    
    // Reset our storage when the form is reset
    function resetFormDataStorage() {
        formDataStorage.name = '';
        formDataStorage.email = '';
        formDataStorage.subject = '';
        formDataStorage.message = '';
        formDataStorage.whatsapp = true;
    }
    
    // Set up mutation observer to detect form tampering
    function setupFormProtection(form) {
        // Create an observer instance
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'value' && 
                    mutation.target.hasAttribute('data-last-value')) {
                    
                    // If a value attribute was modified and we have stored data
                    const storedValue = mutation.target.getAttribute('data-last-value');
                    const currentValue = mutation.target.value;
                    
                    if (storedValue && !currentValue) {
                        if (debugMode) console.warn("Value lost for", mutation.target.id, "- restoring from data attribute");
                        mutation.target.value = storedValue;
                    }
                }
            });
        });
        
        // Configuration of the observer
        const config = { 
            attributes: true, 
            childList: true, 
            subtree: true,
            attributeFilter: ['value'] 
        };
        
        // Start observing the form
        observer.observe(form, config);
    }
    
    // Add input handlers to clear errors on input
    contactForm.querySelectorAll('input, select, textarea').forEach(element => {
        element.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                this.removeAttribute('aria-invalid');
                const errorEl = document.getElementById(`${this.id}-error`);
                if (errorEl) errorEl.remove();
            }
            
            // Store the current value in a data attribute
            this.setAttribute('data-last-value', this.value);
            
            // Remove validation summary when user starts typing
            const summary = document.getElementById('validation-summary');
            if (summary) summary.remove();
        });
    });
    
    // UTILITY FUNCTIONS
    
    // Validate form data directly from values
    function validateFormData(data) {
        const errors = [];
        
        if (!data.name.trim()) {
            errors.push('Please enter your name');
        }
        
        if (!data.email.trim()) {
            errors.push('Please enter your email address');
        } else if (!isValidEmail(data.email.trim())) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.subject) {
            errors.push('Please select a topic');
        }
        
        if (!data.message.trim()) {
            errors.push('Please enter your message');
        }
        
        return errors;
    }
    
    // Apply error styling to form fields based on validation
    function applyErrorsToFields(form, data) {
        // Reset all errors
        form.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
            field.removeAttribute('aria-invalid');
        });
        
        form.querySelectorAll('.error-message').forEach(msg => msg.remove());
        
        // Apply errors based on validation
        if (!data.name.trim()) {
            const nameField = form.querySelector('#name');
            if (nameField) showFieldError(nameField, 'Please enter your name');
        }
        
        if (!data.email.trim()) {
            const emailField = form.querySelector('#email');
            if (emailField) showFieldError(emailField, 'Please enter your email address');
        } else if (!isValidEmail(data.email.trim())) {
            const emailField = form.querySelector('#email');
            if (emailField) showFieldError(emailField, 'Please enter a valid email address');
        }
        
        if (!data.subject) {
            const subjectField = form.querySelector('#subject');
            if (subjectField) showFieldError(subjectField, 'Please select a topic');
        }
        
        if (!data.message.trim()) {
            const messageField = form.querySelector('#message');
            if (messageField) showFieldError(messageField, 'Please enter your message');
        }
    }
    
    // Show a validation summary at the top of the form
    function showValidationSummary(errors, formFeedbackElement) {
        if (!formFeedbackElement) return;
        
        // Remove any existing summary
        const existingSummary = document.getElementById('validation-summary');
        if (existingSummary) existingSummary.remove();
        
        // Create summary element
        const summary = document.createElement('div');
        summary.id = 'validation-summary';
        summary.className = 'validation-summary';
        summary.setAttribute('role', 'alert');
        summary.setAttribute('aria-live', 'assertive');
        
        // Add heading
        const heading = document.createElement('h5');
        heading.textContent = 'Please fix the following errors:';
        summary.appendChild(heading);
        
        // Create list of errors
        const errorList = document.createElement('ul');
        
        // Add each error message
        errors.forEach(error => {
            const item = document.createElement('li');
            item.textContent = error;
            errorList.appendChild(item);
        });
        
        summary.appendChild(errorList);
        
        // Add to the form at the top
        formFeedbackElement.appendChild(summary);
        
        // Make sure it's visible
        formFeedbackElement.classList.add('error-summary-container');
        
        // Scroll to it
        summary.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Validate email format
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Show individual field error
    function showFieldError(field, message) {
        if (!field) return;
        
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        
        // Remove any existing error for this field
        const existingError = document.getElementById(`${field.id}-error`);
        if (existingError) existingError.remove();
        
        // Create error message element
        const errorEl = document.createElement('div');
        errorEl.id = `${field.id}-error`;
        errorEl.className = 'error-message';
        errorEl.textContent = message;
        errorEl.setAttribute('role', 'alert');
        
        // Add error message after the field
        field.parentNode.appendChild(errorEl);
    }
    
    // Show success message
    function showSuccessMessage(message, formFeedbackElement) {
        if (!formFeedbackElement) return;
        
        // Clear any existing content and classes
        formFeedbackElement.textContent = '';
        formFeedbackElement.className = 'form-feedback success-message';
        
        formFeedbackElement.textContent = message;
        formFeedbackElement.setAttribute('role', 'status');
        
        // Scroll to the message
        formFeedbackElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
            formFeedbackElement.style.opacity = '0';
            setTimeout(() => {
                if (formFeedbackElement) {
                    formFeedbackElement.textContent = '';
                    formFeedbackElement.className = 'form-feedback';
                    formFeedbackElement.removeAttribute('role');
                }
            }, 500);
        }, 8000);
    }
    
    // Show error message
    function showErrorMessage(message, formFeedbackElement) {
        if (!formFeedbackElement) return;
        
        // Clear any existing content and classes
        formFeedbackElement.textContent = '';
        formFeedbackElement.className = 'form-feedback error-message';
        
        formFeedbackElement.textContent = message;
        formFeedbackElement.setAttribute('role', 'alert');
        formFeedbackElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Set loading state for buttons
    function setLoadingState(isLoading, submitBtnElement, spinnerElement) {
        if (!submitBtnElement) return;
        
        if (isLoading) {
            submitBtnElement.disabled = true;
            if (submitBtnElement.querySelector('span:first-child')) {
                submitBtnElement.querySelector('span:first-child').textContent = 'Sending...';
            }
            if (spinnerElement) spinnerElement.classList.remove('hidden');
        } else {
            submitBtnElement.disabled = false;
            if (submitBtnElement.querySelector('span:first-child')) {
                submitBtnElement.querySelector('span:first-child').textContent = 'Send Message';
            }
            if (spinnerElement) spinnerElement.classList.add('hidden');
        }
    }
    
    // Add CSS styles
    const style = document.createElement('style');
    style.textContent = `
        .form-control.error {
            border-color: #e74c3c !important;
            border-width: 2px !important;
            background-color: #fff6f6;
            box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.25);
        }
        
        .error-message {
            color: #e74c3c;
            font-size: 0.85rem;
            margin-top: 5px;
            font-weight: 500;
            display: block;
        }
        
        .success-message {
            background-color: #d4edda;
            color: #155724;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 20px;
            transition: opacity 0.5s;
        }
        
        .form-feedback {
            margin-bottom: 1rem;
            transition: opacity 0.5s;
        }
        
        button[disabled] {
            opacity: 0.7;
            cursor: not-allowed;
        }
        
        .validation-summary {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 12px 15px;
            margin-bottom: 1rem;
            border-radius: 4px;
            animation: highlight 0.5s ease;
        }
        
        .validation-summary h5 {
            margin-top: 0;
            margin-bottom: 10px;
        }
        
        .validation-summary ul {
            margin: 0;
            padding-left: 20px;
        }
        
        .validation-summary li {
            margin-bottom: 4px;
        }
        
        @keyframes highlight {
            0% { background-color: #f8d7da; }
            50% { background-color: #e74c3c; }
            100% { background-color: #f8d7da; }
        }
        
        .error-summary-container {
            padding: 0;
        }
    `;
    document.head.appendChild(style);
    
    // Add manual validation test function with updated approach
    window.testFormValidation = function() {
        console.log("Testing form validation...");
        console.log("Form data storage:", {...formDataStorage});
        
        const errors = validateFormData(formDataStorage);
        console.log("Validation errors:", errors);
        return errors.length === 0;
    };
    
    window.fillTestData = function() {
        // Directly set values in our storage
        formDataStorage.name = "Test User";
        formDataStorage.email = "test@example.com";
        formDataStorage.subject = "register";
        formDataStorage.message = "This is a test message";
        
        // Also update the DOM if possible
        const nameField = document.querySelector('#name');
        const emailField = document.querySelector('#email');
        const subjectField = document.querySelector('#subject');
        const messageField = document.querySelector('#message');
        
        if (nameField) {
            nameField.value = formDataStorage.name;
            nameField.setAttribute('data-last-value', formDataStorage.name);
        }
        
        if (emailField) {
            emailField.value = formDataStorage.email;
            emailField.setAttribute('data-last-value', formDataStorage.email);
        }
        
        if (subjectField) {
            subjectField.value = formDataStorage.subject;
            subjectField.setAttribute('data-last-value', formDataStorage.subject);
        }
        
        if (messageField) {
            messageField.value = formDataStorage.message;
            messageField.setAttribute('data-last-value', formDataStorage.message);
        }
        
        console.log("Test data filled in storage and form (if elements exist)");
    };
    
    // Add a direct email test function using our storage values
    window.sendStoredDataEmail = function() {
        if (Object.values(formDataStorage).some(v => v === '' || v === null || v === undefined)) {
            console.warn("Form data incomplete. Fill the form first!");
            return;
        }
        
        console.log("Sending email with stored form data:", formDataStorage);
        
        emailjs.send(
            'service_my9ghxn', 
            'template_nhggyqv',
            formDataStorage
        )
        .then(response => {
            console.log("Email sent successfully using stored data:", response);
        })
        .catch(error => {
            console.error("Email failed using stored data:", error);
        });
    };
    
    // Format email body with ALL form fields directly included
    function formatEmailBody(data) {
        return `
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}
Join WhatsApp Group: ${data.whatsapp ? "Yes" : "No"}
Message: ${data.message}
`;
    }
    
    // Clear all form data including backups after successful submission
    function clearAllFormData(form) {
        // Reset the form
        form.reset();
        
        // Clear all our storage mechanisms
        resetFormDataStorage();
        
        // Clear data attributes
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.removeAttribute('data-last-value');
            field.value = '';
            
            if (field.type === 'checkbox' && field.name === 'whatsapp') {
                field.checked = true; // Default state for WhatsApp checkbox
            }
        });
        
        // Clear any window recovery data
        if (window.formRecoveryData && window.formRecoveryData[form.id]) {
            for (const key in window.formRecoveryData[form.id]) {
                window.formRecoveryData[form.id][key] = '';
            }
            // Reset WhatsApp to default checked state
            if (window.formRecoveryData[form.id].hasOwnProperty('whatsapp')) {
                window.formRecoveryData[form.id].whatsapp = true;
            }
        }
        
        // Remove any helpers added by form-recovery.js
        form.querySelectorAll('[id$="-recovery-helper"]').forEach(helper => {
            helper.textContent = '';
        });
    }
});
