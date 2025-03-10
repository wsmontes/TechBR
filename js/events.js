/**
 * TechBR Victoria - Hangouts & Events JavaScript
 * Handles community gatherings listing and filtering
 */

document.addEventListener('DOMContentLoaded', function() {
    // Sample events data - replaced with more casual community events
    // In a real implementation, this would come from a community calendar or Google Sheet
    const events = [
        {
            id: 1,
            title: "Monthly Coffee & Chat",
            description: "Let's catch up over some coffee! Come share what you're working on, ask for advice, or just enjoy some Brazilian-style conversations in the midst of Canadian life.",
            date: "2023-07-15",
            time: "14:00",
            location: "Discovery Coffee, 664 Discovery St, Victoria, BC",
            image: "images/coffee-chat.jpg",
            category: "social",
            featured: true,
            past: false
        },
        {
            id: 2,
            title: "Churrasco at the Beach",
            description: "It's summer! Time for our annual Brazilian BBQ at Willows Beach. Bring something to share if you can, but most importantly, bring yourself!",
            date: "2023-07-28",
            time: "17:00",
            location: "Willows Beach, Oak Bay, Victoria, BC",
            image: "images/beach-bbq.jpg",
            category: "social",
            featured: true,
            past: false
        },
        {
            id: 3,
            title: "Code & Coxinha Night",
            description: "A casual evening of coding together, helping each other with projects, and enjoying some homemade coxinhas that Eduardo promised to make!",
            date: "2023-08-10",
            time: "19:00",
            location: "CodeSpace Victoria, 735 Broughton St",
            image: "images/coding-session.jpg",
            category: "tech",
            featured: true,
            past: false
        },
        {
            id: 4,
            title: "Hiking at Mount Douglas",
            description: "Let's enjoy the beautiful nature around Victoria! An easy hike suitable for all levels, followed by a coffee at a nearby cafe.",
            date: "2023-08-20",
            time: "10:00",
            location: "Mount Douglas Park, Main Entrance",
            image: "images/hiking.jpg",
            category: "social",
            featured: false,
            past: false
        },
        {
            id: 5,
            title: "Remote Work Café Hopping",
            description: "Work remotely? Let's meet up and work together from a few different cafés around downtown Victoria. We'll start at Hey Happy Coffee.",
            date: "2023-06-05",
            time: "09:00",
            location: "Hey Happy Coffee, 560 Johnson St",
            image: "images/remote-work.jpg",
            category: "social",
            featured: false,
            past: true
        }
    ];
    
    // Function to format date in a friendly way
    const formatDate = (dateStr, timeStr) => {
        const date = new Date(`${dateStr}T${timeStr}`);
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        return `${date.toLocaleDateString('en-US', options)} at ${formatTime(timeStr)}`;
    };
    
    // Function to format time in a friendly way
    const formatTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };
    
    // Populate upcoming events on homepage
    const upcomingEventsContainer = document.getElementById('upcoming-events-list');
    
    if (upcomingEventsContainer) {
        // Get upcoming events
        const upcomingEvents = events.filter(event => !event.past).slice(0, 3);
        
        if (upcomingEvents.length > 0) {
            upcomingEventsContainer.innerHTML = '';
            
            upcomingEvents.forEach(event => {
                upcomingEventsContainer.innerHTML += `
                    <div class="event-card">
                        <div class="event-image">
                            <img src="${event.image}" alt="${event.title}">
                        </div>
                        <div class="event-details">
                            <div class="event-date">
                                <i class="far fa-calendar-alt"></i>
                                <span>${formatDate(event.date, event.time)}</span>
                            </div>
                            <h3>${event.title}</h3>
                            <p>${event.description}</p>
                            <div class="event-location">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${event.location}</span>
                            </div>
                            <a href="#" class="btn primary">I'll Be There!</a>
                        </div>
                    </div>
                `;
            });
        } else {
            upcomingEventsContainer.innerHTML = `
                <div class="no-events">
                    <p>No upcoming hangouts scheduled yet, but we're planning some! Check back soon or suggest one.</p>
                    <a href="contact.html" class="btn secondary">Suggest a Hangout</a>
                </div>
            `;
        }
    }
    
    // Event filtering on events page
    const eventFilterButtons = document.querySelectorAll('.event-filters .filter-btn');
    const eventsListContainer = document.getElementById('events-list');
    
    if (eventFilterButtons.length && eventsListContainer) {
        eventFilterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active filter button
                eventFilterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                let filteredEvents;
                
                // Filter events based on selected category
                if (filter === 'upcoming') {
                    filteredEvents = events.filter(event => !event.past);
                } else if (filter === 'past') {
                    filteredEvents = events.filter(event => event.past);
                } else {
                    filteredEvents = events.filter(event => 
                        event.category === filter && !event.past
                    );
                }
                
                // Update the events list
                renderEvents(filteredEvents, eventsListContainer);
            });
        });
        
        // Initial render with upcoming events
        const upcomingEvents = events.filter(event => !event.past);
        renderEvents(upcomingEvents, eventsListContainer);
    }
    
    // Function to render events in a more friendly way
    function renderEvents(eventsList, container) {
        if (eventsList.length === 0) {
            container.innerHTML = `
                <div class="no-events">
                    <p>Nothing here yet! Want to organize something?</p>
                    <a href="contact.html" class="btn secondary">Suggest a Hangout</a>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        
        eventsList.forEach(event => {
            container.innerHTML += `
                <div class="event-card">
                    <div class="event-image">
                        <img src="${event.image}" alt="${event.title}">
                    </div>
                    <div class="event-details">
                        <div class="event-date">
                            <i class="far fa-calendar-alt"></i>
                            <span>${formatDate(event.date, event.time)}</span>
                        </div>
                        <h3>${event.title}</h3>
                        <p>${event.description}</p>
                        <div class="event-location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location}</span>
                        </div>
                        ${event.past ? 
                            '<span class="event-past">Already happened</span>' : 
                            '<a href="#" class="btn primary">Count Me In</a>'
                        }
                    </div>
                </div>
            `;
        });
    }
    
    // Simple calendar UI (would be enhanced with a proper calendar library in production)
    const calendarContainer = document.getElementById('calendar-container');
    
    if (calendarContainer) {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        renderCalendar(currentMonth, currentYear, calendarContainer, events);
    }
    
    function renderCalendar(month, year, container, events) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        let calendarHTML = `
            <div class="calendar-header">
                <button id="prev-month">&lt;</button>
                <h3>${monthNames[month]} ${year}</h3>
                <button id="next-month">&gt;</button>
            </div>
            <table class="calendar">
                <thead>
                    <tr>
                        <th>Sun</th>
                        <th>Mon</th>
                        <th>Tue</th>
                        <th>Wed</th>
                        <th>Thu</th>
                        <th>Fri</th>
                        <th>Sat</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        let date = 1;
        
        // Create calendar rows
        for (let i = 0; i < 6; i++) {
            let row = '<tr>';
            
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    // Empty cells before start of month
                    row += '<td></td>';
                } else if (date > daysInMonth) {
                    // Empty cells after end of month
                    row += '<td></td>';
                } else {
                    // Format the date string to match event date format
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                    
                    // Check if there's an event on this day
                    const eventOnDay = events.find(event => event.date === dateStr);
                    
                    if (eventOnDay) {
                        row += `<td class="has-event" data-event-id="${eventOnDay.id}">${date}</td>`;
                    } else {
                        row += `<td>${date}</td>`;
                    }
                    
                    date++;
                }
            }
            
            row += '</tr>';
            calendarHTML += row;
            
            // Stop creating rows if we've reached the end of the month
            if (date > daysInMonth) {
                break;
            }
        }
        
        calendarHTML += '</tbody></table>';
        container.innerHTML = calendarHTML;
        
        // Add event listeners to navigation buttons
        document.getElementById('prev-month').addEventListener('click', function() {
            let newMonth = month - 1;
            let newYear = year;
            
            if (newMonth < 0) {
                newMonth = 11;
                newYear--;
            }
            
            renderCalendar(newMonth, newYear, container, events);
        });
        
        document.getElementById('next-month').addEventListener('click', function() {
            let newMonth = month + 1;
            let newYear = year;
            
            if (newMonth > 11) {
                newMonth = 0;
                newYear++;
            }
            
            renderCalendar(newMonth, newYear, container, events);
        });
        
        // Add tooltips to days with events
        const daysWithEvents = document.querySelectorAll('.has-event');
        
        daysWithEvents.forEach(day => {
            day.addEventListener('click', function() {
                const eventId = this.getAttribute('data-event-id');
                const event = events.find(e => e.id === parseInt(eventId));
                
                if (event) {
                    alert(`${event.title}\n${formatDate(event.date, event.time)}\n${event.location}\n\n${event.description}`);
                    // In a real implementation, this would show a modal with event details
                }
            });
        });
    }
    
    // Simple RSVP tracking (would be connected to a backend in production)
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('btn') && 
            (e.target.textContent.includes('Count Me In') || 
             e.target.textContent.includes('Be There') || 
             e.target.textContent.includes('Register'))) {
            
            e.preventDefault();
            
            // Get the event card
            const eventCard = e.target.closest('.event-card');
            if (eventCard) {
                const eventTitle = eventCard.querySelector('h3').textContent;
                
                // In a real implementation, this would send the RSVP to a server
                console.log(`RSVP for: ${eventTitle}`);
                
                // Update button to show confirmation
                e.target.textContent = "You're In! 👍";
                e.target.classList.add('confirmed');
                setTimeout(() => {
                    e.target.textContent = "I'll Be There!";
                    e.target.classList.remove('confirmed');
                }, 3000);
                
                // Show a little toast message
                showToast("We've got you on the list! See you there!");
            }
        }
    });
    
    // Toast message function for casual notifications
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // Add toast styles
    const toastStyle = document.createElement('style');
    toastStyle.textContent = `
        .toast-message {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background-color: #024CAA;
            color: white;
            padding: 12px 24px;
            border-radius: 30px;
            box-shadow: 0 4px 12px rgba(2, 76, 170, 0.15);
            font-weight: 500;
            z-index: 1000;
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .toast-message.show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        
        .btn.confirmed {
            background: linear-gradient(135deg, #00A1E4, #0077AD);
            border-color: #0077AD;
            color: white;
        }
    `;
    document.head.appendChild(toastStyle);
});
