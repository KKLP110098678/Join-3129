function showContactDetails(index, name, email, phone, initials, colorClass) {
    let detailContainer = document.getElementById('contact-detail-view');

    detailContainer.innerHTML = `
        <div class="back-arrow" onclick="closeMobileDetails()">⬅️ Back</div>
        <div class="contact-header">
            <div class="initials-big ${colorClass}">${initials}</div>
            
            <div class="name-section">
                <h2>${name}</h2>
                <div class="action-buttons">
                   <span onclick="openEditContactOverlay(${index})">✏️ Edit</span>
                <span onclick="deleteContact(${index})">🗑️ Delete</span>
                </div>
            </div>
        </div>
        
        <div class="contact-data">
            <h3 class="info-headline">Contact Information</h3>
            
            <b>Email</b>
            <a href="mailto:${email}">${email}</a>
            
            <b>Phone</b>
            <span>${phone}</span>
        </div>
    `;
    
    // Aktive Markierung setzen
    document.querySelectorAll('.contact-card').forEach(card => card.classList.remove('active-card'));
    let currentCard = document.getElementById('contactCard_' + index);
    if(currentCard) {
        currentCard.classList.add('active-card');
    }
    
    if (window.innerWidth <= 800) {
        detailContainer.classList.add('show-mobile');
    }
}
