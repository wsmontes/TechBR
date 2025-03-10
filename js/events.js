/**
 * TechBR Victoria - Hangouts & Events JavaScript
 * Handles community gatherings listing and filtering
 */

document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
});

async function loadEvents() {
    const eventsList = document.getElementById('events-list');
    // Set loading state like in members.js
    eventsList.innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin"></i> Loading events...</div>';
    
    try {
        // NEW: Use the events sheet provided by the user
        const SHEET_ID = '1BtHDfkBPuznbAJB5_jS_cNyy8RcxmczTwGOZ0M_yGI8';
        const response = await fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`);
        if (!response.ok) {
            throw new Error('Failed to fetch events data');
        }
        const csvText = await response.text();
        const events = parseCSVToEvents(csvText);
        if (!events.length) {
            eventsList.innerHTML = '<p>No events found.</p>';
            return;
        }
        renderEvents(events, eventsList);
    } catch (err) {
        console.error('Error loading events:', err);
        eventsList.innerHTML = `
            <div class="error-message">
                <p><i class="fas fa-exclamation-circle"></i> Error loading events: ${err.message}</p>
                <p>Please try again later or <a href="contact.html">contact us</a> for assistance.</p>
            </div>
        `;
    }
}

function parseCSVToEvents(csvText) {
    const events = [];
    const lines = csvText.trim().split('\n');
    // Assuming header: Event Name, Description, Local, Date, Time
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const columns = line.split(',');
        if (columns.length < 5) continue;
        const [ eventName, description, local, date, time ] = columns.map(col => col.trim());
        events.push({ name: eventName, description, local, date, time });
    }
    return events;
}

function renderEvents(events, container) {
    let html = '';
    events.forEach(event => {
        html += `
            <div class="event-card">
                <div class="event-card-header">
                    <h2>${event.name}</h2>
                </div>
                <div class="event-card-body">
                    <p>${event.description}</p>
                    <p><strong>Local:</strong> ${event.local}</p>
                    <p><strong>Date:</strong> ${event.date}</p>
                    <p><strong>Time:</strong> ${event.time}</p>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}
