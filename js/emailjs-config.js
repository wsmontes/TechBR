/**
 * EmailJS Configuration
 * This file contains the settings for EmailJS integration
 * 
 * To update these settings:
 * 1. Log in to https://dashboard.emailjs.com/admin
 * 2. Find your Service ID under Email Services
 * 3. Find your Template ID under Email Templates
 * 4. Get your Public Key from Account > API Keys
 */

const EmailJSConfig = {
    // Public Key (USER_ID)
    publicKey: "jP28t-MpLLWmcUiTS",
    
    // Service ID - found in Email Services in EmailJS dashboard
    serviceId: "service_my9ghxn",
    
    // Template ID - found in Email Templates in EmailJS dashboard
    // IMPORTANT: Update this to match your actual template ID
    templateId: "template_nhggyqv",
    
    // Contact form settings
    contactForm: {
        // Fields to include in the email
        fields: ["name", "email", "subject", "message", "whatsapp", "formatted_message"],
        
        // Success message format (firstName will be replaced)
        successMessageWhatsApp: "Thanks {firstName}! We've received your request to join the WhatsApp group. We'll get back to you soon!",
        successMessageGeneral: "Thanks {firstName}! Your message has been sent. We'll get back to you soon!",
        
        // Support email to show in error messages
        supportEmail: "techbrvictoria@gmail.com"
    }
};

// Add a note about email template configuration
console.log("EmailJS configuration loaded. Make sure your EmailJS template includes {{formatted_message}} to display all form fields.");
