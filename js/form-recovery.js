/**
 * TechBR Form Recovery Tool
 * This script provides enhanced form protection and recovery for TechBR forms
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("Form recovery tool activated");
    
    // Find all forms on the page
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        console.log(`Protecting form: ${form.id || 'unnamed form'}`);
        setupFormInputCapture(form);
    });
    
    /**
     * Setup a system to capture and preserve form input values
     */
    function setupFormInputCapture(form) {
        // Create a storage object for this form
        const formId = form.id || 'unnamed-form';
        window.formRecoveryData = window.formRecoveryData || {};
        window.formRecoveryData[formId] = {};
        
        // Initialize all existing fields
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            if (!field.name || field.name === 'website') return; // Skip unnamed fields or honeypots
            
            // Store initial values
            const fieldName = field.name;
            const fieldValue = field.type === 'checkbox' ? field.checked : field.value;
            window.formRecoveryData[formId][fieldName] = fieldValue;
            
            // Mark the field as protected
            field.setAttribute('data-protected', 'true');
            field.setAttribute('data-last-value', fieldValue);
            
            // Add an invisible label to help with debugging
            if (!document.getElementById(`${field.id}-recovery-helper`)) {
                const helper = document.createElement('span');
                helper.id = `${field.id}-recovery-helper`;
                helper.style.display = 'none';
                helper.setAttribute('aria-hidden', 'true');
                helper.textContent = fieldValue;
                field.parentNode.appendChild(helper);
            }
        });
        
        // Capture all input events
        form.addEventListener('input', function(e) {
            if (!e.target.name || e.target.name === 'website') return;
            
            const fieldName = e.target.name;
            const fieldValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            
            // Update our storage
            window.formRecoveryData[formId][fieldName] = fieldValue;
            
            // Update data attribute and helper
            e.target.setAttribute('data-last-value', e.target.type === 'checkbox' ? e.target.checked : e.target.value);
            const helper = document.getElementById(`${e.target.id}-recovery-helper`);
            if (helper) helper.textContent = fieldValue;
        });
        
        // Watch for form submission
        form.addEventListener('submit', function(e) {
            console.log(`Form ${formId} submitted, values preserved:`, {...window.formRecoveryData[formId]});
        });
    }
    
    // Add utility functions to window for console access
    window.getStoredFormData = function(formId = 'contactForm') {
        if (!window.formRecoveryData || !window.formRecoveryData[formId]) {
            console.error(`No stored data for form: ${formId}`);
            return null;
        }
        return {...window.formRecoveryData[formId]};
    };
    
    window.restoreFormData = function(formId = 'contactForm') {
        if (!window.formRecoveryData || !window.formRecoveryData[formId]) {
            console.error(`No stored data for form: ${formId}`);
            return false;
        }
        
        const form = document.getElementById(formId);
        if (!form) {
            console.error(`Form not found: ${formId}`);
            return false;
        }
        
        // Restore values to the form
        const storedData = window.formRecoveryData[formId];
        for (const [fieldName, fieldValue] of Object.entries(storedData)) {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = fieldValue;
                } else {
                    field.value = fieldValue;
                }
                field.setAttribute('data-last-value', field.type === 'checkbox' ? field.checked : field.value);
            }
        }
        
        console.log(`Form ${formId} values restored from storage`);
        return true;
    };
});
