/**
 * TechBR Victoria - Events JavaScript
 * Handles events listing, filtering, and calendar functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Sample events data
    // In a real application, this would come from a backend API
    const events = [
        {
            id: 1,
            title: "Tech Talk: Cloud Computing in 2023",
            description: "Join us for an informative session on the latest trends in cloud computing with special guest speakers from Amazon Web Services.",
            date: "2023-06-15",
            time: "18:30",
            location: "VIATEC, 777 Fort St, Victoria, BC",
            image: "images/event1.jpg",
            category: "technical",
            featured: true,
            past: false
        },
        {
            id: 2,
            title: "Summer Networking BBQ",
            description: "Come enjoy some Brazilian BBQ, drinks, and great networking opportunities with fellow tech professionals.",
            date: "2023-06-28",
            time: "17:00",
            location: "Willows Beach, Oak Bay, Victoria, BC",
            image: "images/event2.jpg",
            category: "social",
            featured: true,
            past: false
        },
        {
            id: 3,
            title: "Workshop: Building Your Personal Brand",
            description: "Learn how to build and promote your personal brand to advance your career in the competitive tech landscape.",
            date: "2023-07-10",
            time: "10:00",
            location: "Victoria Public Library, 735 Broughton St",
            image: "images/event3.jpg",
            category: "career",
            featured: true,
            past: false
        },
        {
            id: 4,
            title: "Code & Coffee",
            description: "Informal morning meetup to code together, share projects, and enjoy some great coffee.",
            date: "2023-07-20",
            time: "08:30",
            location: "Discovery Coffee, 664 Discovery St",
            image: "images/event4.jpg",
            category: "technical",
            featured: false,
            past: false
        },
        {
            id: 5,
            title: "Introduction to Machine Learning",
            description: "A beginner-friendly workshop on the basics of machine learning with Python.",
            date: "2023-05-05",
            time: "18:00",
            location: "UVic, Engineering Building, Room 130",
            image: "images/event5.jpg",
            category: "technical",
            featured: false,
            past: true
        }
    ];
    
    // Function to format date nicely
    const formatDate = (dateStr, timeStr) => {
        const date = new Date(`${dateStr}T${timeStr}`);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return `${date.toLocaleDateString('en-US', options)} - ${formatTime(timeStr)}`;
    };
    
    // Function to format time
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
        // Get only featured upcoming events
        const featuredEvents = events.filter(event => event.featured && !event.past);
        
        if (featuredEvents.length > 0) {
            upcomingEventsContainer.innerHTML = '';
            
            featuredEvents.forEach(event => {
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
                            <a href="#" class="btn primary">Register</a>
                        </div>
                    </div>
                `;
            });
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
    
    // Function to render events
    function renderEvents(eventsList, container) {
        if (eventsList.length === 0) {
            container.innerHTML = `
                <div class="no-events">
                    <p>No events found matching your criteria.</p>
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
                            '<span class="event-past">Past Event</span>' : 
                            '<a href="#" class="btn primary">Register</a>'
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
});
