/**
 * EmailJS Test Utility
 * This script helps diagnose issues with EmailJS configuration.
 * 
 * How to use:
 * 1. Include this file in your HTML after EmailJS script and emailjs-config.js
 * 2. Open browser console
 * 3. Run: testEmailJS()
 */

function testEmailJS() {
    console.log("Starting EmailJS diagnostic test...");
    
    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        console.error("❌ EmailJS is not loaded. Check your script inclusion.");
        return;
    }
    
    console.log("✓ EmailJS library is loaded");
    
    // Check if config exists
    if (typeof EmailJSConfig === 'undefined') {
        console.error("❌ EmailJS configuration not found. Make sure emailjs-config.js is included before this script.");
        return;
    }
    
    // Configuration
    const serviceId = EmailJSConfig.serviceId;
    const templateId = EmailJSConfig.templateId;
    const publicKey = EmailJSConfig.publicKey;
    
    console.log("Testing with configuration from emailjs-config.js:");
    console.log("- Service ID:", serviceId);
    console.log("- Template ID:", templateId);
    console.log("- Public Key:", publicKey.substring(0, 5) + "...");
    
    // Initialize EmailJS
    emailjs.init(publicKey);
    console.log("✓ EmailJS initialized with public key");
    
    // Ask user for confirmation
    if (!confirm("This will send a test email to test your EmailJS setup. Continue?")) {
        console.log("Test cancelled by user");
        return;
    }
    
    // Create test data
    const testData = {
        name: "Test User",
        email: "test@example.com",
        subject: "Test Email",
        message: "This is a test message from the EmailJS diagnostic tool"
    };
    
    console.log("Sending test email with data:", testData);
    
    // Send test email
    emailjs.send(serviceId, templateId, testData)
        .then(function(response) {
            console.log("✅ SUCCESS! Email sent with response:", response);
            console.log("If you did not receive the email, check your spam folder and verify your EmailJS service configuration.");
        }, function(error) {
            console.error("❌ FAILED! Error sending email:", error);
            console.log("Possible issues:");
            console.log("1. Service ID is incorrect - Check emailjs-config.js");
            console.log("2. Template ID is incorrect - Check emailjs-config.js");
            console.log("3. Public Key is incorrect - Check emailjs-config.js");
            console.log("4. Your EmailJS account has reached its limit");
            console.log("5. Your template variables don't match the data provided");
            
            if (error && error.text && error.text.includes('template ID not found')) {
                console.error("IMPORTANT: Your template ID is not valid. Go to https://dashboard.emailjs.com/admin/templates to find the correct template ID.");
            }
        });
}

function openEmailJSDashboard() {
    window.open('https://dashboard.emailjs.com/admin', '_blank');
    console.log("Opened EmailJS dashboard in a new tab. Check your templates and services there.");
}

console.log("EmailJS diagnostic tool loaded. Run 'testEmailJS()' in the console to test, or 'openEmailJSDashboard()' to access your account.");
