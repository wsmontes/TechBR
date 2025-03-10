/**
 * TechBR Victoria - LinkedIn Integration
 * Handles fetching member data from LinkedIn profile URLs in Google Sheets
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fetch member data from Google Sheet
    fetchMembersData();
});

/**
 * Fetch member data from Google Sheets CSV export
 */
async function fetchMembersData() {
    const SHEET_ID = '1JE581FxYuN7hRhVjpDw7FnmKLZgDRpytOvLaJysXn-o';
    const membersContainer = document.getElementById('members-container');
    
    if (!membersContainer) return;
    
    // Show loading state
    membersContainer.innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin"></i> Loading members...</div>';
    
    try {
        // Fetch CSV directly from Google Sheets public export URL
        const response = await fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch data from Google Sheets');
        }
        
        const csvText = await response.text();
        const members = parseCSVToMembers(csvText);
        
        if (members.length === 0) {
            membersContainer.innerHTML = '<p>No member profiles found in our directory.</p>';
            return;
        }
        
        // Display the retrieved member data
        renderMemberProfiles(members, membersContainer);
        
    } catch (error) {
        console.error('Error fetching member data:', error);
        membersContainer.innerHTML = `
            <div class="error-message">
                <p><i class="fas fa-exclamation-circle"></i> Error loading member profiles: ${error.message}</p>
                <p>Please try again later or <a href="contact.html">contact us</a> for assistance.</p>
            </div>
        `;
    }
}

/**
 * Parse CSV data to extract member information
 * Column A: Member Name
 * Column B: LinkedIn URL
 */
function parseCSVToMembers(csvText) {
    const members = [];
    const lines = csvText.split('\n');
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Split the line into columns (handle possible commas in the name)
        const columns = line.split(',');
        
        // Extract name and LinkedIn URL
        const name = columns[0].trim();
        // Join the remaining columns in case the URL got split due to commas
        const linkedInUrl = columns.slice(1).join(',').trim();
        
        if (name && linkedInUrl && linkedInUrl.includes('linkedin.com')) {
            members.push({
                name: name,
                linkedInUrl: linkedInUrl
            });
        }
    }
    
    return members;
}

/**
 * Render member profiles from their names and LinkedIn URLs
 */
function renderMemberProfiles(members, container) {
    let html = `<h2>${members.length} Community Members</h2>`;
    
    // Create grid to display member cards
    html += '<div class="members-grid">';
    
    // Create a card for each member
    members.forEach(member => {
        html += `
            <div class="member-card">
                <div class="member-info">
                    <h3>${member.name}</h3>
                    <p class="member-note">LinkedIn Profile</p>
                    <a href="${member.linkedInUrl}" target="_blank" rel="noopener noreferrer" class="linkedin-button">
                        <i class="fab fa-linkedin"></i> View Profile
                    </a>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Add a note about joining the directory
    html += `
        <div class="members-note">
            <p><i class="fas fa-info-circle"></i> Want to be included in our directory? <a href="contact.html">Contact us</a> with your LinkedIn profile URL.</p>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Make cards clickable (except the LinkedIn button which has its own handler)
    document.querySelectorAll('.member-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.linkedin-button')) {
                const linkedinUrl = this.querySelector('.linkedin-button').getAttribute('href');
                window.open(linkedinUrl, '_blank');
            }
        });
        
        // Add cursor style to indicate clickability
        card.style.cursor = 'pointer';
    });
}

// Add necessary styles for member cards
document.head.insertAdjacentHTML('beforeend', `
<style>
    .members-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 20px;
        margin: 30px 0;
    }
    
    .member-card {
        background-color: #f5f5f5;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        text-align: center;
    }
    
    .member-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.15);
    }
    
    .member-info h3 {
        margin-bottom: 5px;
        font-size: 1.2rem;
    }
    
    .member-note {
        color: #666;
        font-size: 0.9rem;
        margin-bottom: 15px;
    }
    
    .linkedin-button {
        display: inline-block;
        background-color: #0077B5;
        color: white;
        padding: 8px 15px;
        border-radius: 4px;
        text-decoration: none;
        transition: background-color 0.3s;
    }
    
    .linkedin-button:hover {
        background-color: #005e93;
        color: white;
    }
    
    .linkedin-button i {
        margin-right: 5px;
    }
    
    .loading-state {
        text-align: center;
        padding: 40px 0;
        color: #555;
    }
    
    .loading-state i {
        margin-right: 10px;
        color: #0077B5;
    }
    
    .members-note {
        text-align: center;
        margin-top: 30px;
        padding: 15px;
        background-color: #f0f0f0;
        border-radius: 8px;
    }
    
    .error-message {
        text-align: center;
        padding: 20px;
        background-color: #fff0f0;
        border-left: 4px solid #ff3333;
        margin: 20px 0;
    }
    
    .error-message i {
        color: #ff3333;
        margin-right: 8px;
    }
    
    @media (max-width: 768px) {
        .members-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        }
    }
</style>
`);
