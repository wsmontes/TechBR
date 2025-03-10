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
 * Column A: Member Name, Column B: LinkedIn URL, Column C: Title/Expertise
 */
function parseCSVToMembers(csvText) {
    const members = [];
    const lines = csvText.trim().split('\n');
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const columns = line.split(',');
        if (columns.length < 3) continue;
        
        const memberName = columns[0].trim();
        const linkedInUrl = columns[1].trim();
        const expertiseEncoded = columns[2].trim();
        const expertise = decodeURIComponent(expertiseEncoded);
        
        if (linkedInUrl && expertise && linkedInUrl.includes('linkedin.com')) {
            members.push({
                name: memberName,
                linkedInUrl: linkedInUrl,
                expertise: expertise
            });
        }
    }
    
    return members;
}

/**
 * Render member profiles using the provided member name, LinkedIn URL, and expertise
 */
function renderMemberProfiles(members, container) {
    let html = '<div class="members-grid">';
    
    members.forEach(member => {
        html += `
            <div class="member-card">
                <div class="member-info">
                    <h3>${member.name}</h3>
                    <div class="member-title">${member.expertise}</div>
                    <a href="${member.linkedInUrl}" target="_blank" rel="noopener noreferrer" class="linkedin-button">
                        <i class="fab fa-linkedin"></i> View Profile
                    </a>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Updated join note without former website reference.
    html += `
        <div class="members-note">
            <p>
                <i class="fas fa-info-circle"></i> Want to be included in our directory? 
                <a href="contact.html">Contact us</a> with your LinkedIn profile URL.
            </p>
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
        background-color: #FFFFFF;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 3px 10px rgba(9, 16, 87, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        text-align: center;
        border-top: 3px solid #024CAA;
    }
    
    .member-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(9, 16, 87, 0.15);
    }
    
    .member-info h3 {
        margin-bottom: 5px;
        font-size: 1.2rem;
        color: #091057;
    }
    
    /* NEW: Improve spacing between title description and the LinkedIn button */
    .member-title {
        margin-bottom: 10px;
    }
    
    .member-note {
        color: #666;
        font-size: 0.9rem;
        margin-bottom: 15px;
    }
    
    .linkedin-button {
        display: inline-block;
        background-color: #024CAA;
        color: white;
        padding: 8px 15px;
        border-radius: 6px;
        text-decoration: none;
        transition: background-color 0.3s;
    }
    
    .linkedin-button:hover {
        background-color: #023A80;
        color: white;
    }
    
    .linkedin-button i {
        margin-right: 5px;
    }
    
    .loading-state {
        text-align: center;
        padding: 40px 0;
        color: #091057;
    }
    
    .loading-state i {
        margin-right: 10px;
        color: #024CAA;
    }
    
    .members-note {
        text-align: center;
        margin-top: 30px;
        padding: 15px;
        background-color: #DBD3D3;
        border-radius: 10px;
    }
    
    .error-message {
        text-align: center;
        padding: 20px;
        background-color: rgba(236, 131, 5, 0.1);
        border-left: 4px solid #EC8305;
        margin: 20px 0;
    }
    
    .error-message i {
        color: #EC8305;
        margin-right: 8px;
    }
    
    @media (max-width: 768px) {
        .members-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        }
    }
</style>
`);

// NEW: Append the former website reference into the footer.
document.addEventListener('DOMContentLoaded', function() {
    const footer = document.querySelector('footer');
    if (footer) {
         const formerDiv = document.createElement('div');
         formerDiv.className = 'former-website';
         formerDiv.style.fontSize = '0.8rem';
         formerDiv.style.textAlign = 'center';
         formerDiv.style.paddingTop = '10px';
         formerDiv.innerHTML = 'Former website: <a href="https://techbrvictoria.wixsite.com/techbr" target="_blank" rel="noopener noreferrer">techbrvictoria.wixsite.com/techbr</a>';
         footer.appendChild(formerDiv);
    }
});
