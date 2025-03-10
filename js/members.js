/**
 * TechBR Victoria - Members JavaScript
 * Handles member filtering and search functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Sample members data
    // In a real application, this would come from a backend API
    const members = [
        {
            id: 1,
            name: "Rafael Silva",
            title: "Senior Frontend Developer",
            bio: "Specialist in React and Vue.js with 8+ years experience.",
            image: "images/member1.jpg",
            category: "developer",
            skills: ["JavaScript", "React", "Vue.js", "CSS", "HTML5"]
        },
        {
            id: 2,
            name: "Camila Oliveira",
            title: "UX/UI Designer",
            bio: "Creating accessible and inclusive designs for web and mobile applications.",
            image: "images/member2.jpg",
            category: "designer",
            skills: ["UI Design", "UX Research", "Figma", "Adobe XD", "Accessibility"]
        },
        {
            id: 3,
            name: "Eduardo Mendes",
            title: "Data Scientist",
            bio: "Python expert with focus on machine learning and AI solutions.",
            image: "images/member3.jpg",
            category: "data",
            skills: ["Python", "Machine Learning", "TensorFlow", "Data Analysis", "SQL"]
        },
        {
            id: 4,
            name: "Juliana Costa",
            title: "Backend Developer",
            bio: "Java specialist with experience in microservices architecture.",
            image: "images/member4.jpg",
            category: "developer",
            skills: ["Java", "Spring Boot", "Microservices", "Docker", "Kubernetes"]
        },
        {
            id: 5,
            name: "Paulo Martins",
            title: "DevOps Engineer",
            bio: "AWS certified professional focusing on CI/CD pipelines and cloud infrastructure.",
            image: "images/member5.jpg",
            category: "devops",
            skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform"]
        },
        {
            id: 6,
            name: "Fernanda Lima",
            title: "Product Manager",
            bio: "Agile enthusiast focusing on product development and team leadership.",
            image: "images/member6.jpg",
            category: "pm",
            skills: ["Product Management", "Agile", "Scrum", "User Stories", "JIRA"]
        }
    ];
    
    // Get DOM elements
    const membersList = document.getElementById('members-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.querySelector('.search-input');
    
    // Check if we're on the members page
    if (membersList && filterButtons.length && searchInput) {
        // Add event listeners to filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active filter button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Apply filtering and search
                applyFilters();
            });
        });
        
        // Add event listener to search input
        searchInput.addEventListener('input', function() {
            applyFilters();
        });
        
        // Function to apply both filters and search
        function applyFilters() {
            const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            const searchTerm = searchInput.value.toLowerCase();
            
            // Filter members based on category and search term
            let filteredMembers;
            
            if (activeFilter === 'all') {
                filteredMembers = [...members];
            } else {
                filteredMembers = members.filter(member => member.category === activeFilter);
            }
            
            // Apply search filter if there's a search term
            if (searchTerm) {
                filteredMembers = filteredMembers.filter(member => {
                    // Search in name, title, bio, and skills
                    return (
                        member.name.toLowerCase().includes(searchTerm) ||
                        member.title.toLowerCase().includes(searchTerm) ||
                        member.bio.toLowerCase().includes(searchTerm) ||
                        member.skills.some(skill => skill.toLowerCase().includes(searchTerm))
                    );
                });
            }
            
            // Render filtered members
            renderMembers(filteredMembers);
        }
        
        // Function to render members in the DOM
        function renderMembers(membersList) {
            // Clear the container
            while (membersList.firstChild) {
                membersList.innerHTML = '';
            }
            
            if (membersList.length === 0) {
                membersList.innerHTML = `
                    <div class="no-members">
                        <p>No members found matching your criteria.</p>
                    </div>
                `;
                return;
            }
            
            // Create HTML for each member
            membersList.forEach(member => {
                const memberHTML = document.createElement('div');
                memberHTML.className = 'team-member';
                memberHTML.innerHTML = `
                    <img src="${member.image}" alt="${member.name}">
                    <h3>${member.name}</h3>
                    <p class="title">${member.title}</p>
                    <p>${member.bio}</p>
                    <div class="member-skills">
                        ${member.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                    <div class="member-social">
                        <a href="#"><i class="fab fa-linkedin"></i></a>
                        <a href="#"><i class="fab fa-github"></i></a>
                    </div>
                `;
                membersList.appendChild(memberHTML);
            });
        }
        
        // Initial rendering of all members
        applyFilters();
    }
});
