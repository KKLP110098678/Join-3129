function showContactDetails(index, name, email, phone, initials, colorClass) {
    let detailContainer = document.getElementById('contact-detail-view');

        if (window.innerWidth <= 1000) {

        detailContainer.innerHTML = `
        <h3 class="info-headline">Contact Information</h3>
        <div class="back-arrow" onclick="closeMobileDetails()"><img src="../assets/icon/sign/backarrow.svg" alt="Back"></div>
        <div class="contact-header">
            <div class="initials-big ${colorClass}">${initials}</div>
            
            <div class="name-section">
                <h2>${name}</h2>
            </div>
        </div>
        <div class="contact-data">
            
            <b>Email</b>
            <a href="mailto:${email}">${email}</a>
            
            <b>Phone</b>
            <span>${phone}</span>
        </div>
        <div id="mobileActionOverlay" class="menu-overlay d-none" onclick="hideMobileContactActionMenu()"></div>
        <div class="mobile-contact-action-menu d-none" id="mobileContactActionMenu">
            <span onclick="openEditContactOverlay(${index})" class="mobile-action-button"><img src="../assets/icon/contacts/edit.svg" alt="Edit">Edit</span>
            <span onclick="openDeleteContactOverlay(${index})" class="mobile-action-button"><img src="../assets/icon/contacts/delete.svg" alt="Delete">Delete</span>
        </div>
        <button class="btn-change-contact-mobile" onclick="showMobileContactActionMenu()">
            <img src="../assets/icon/contacts/contact-details-menu.svg" alt="Edit and Delete Menu">
        </button>
        `;
    }

    else {
        detailContainer.innerHTML = `
        <div class="back-arrow" onclick="closeMobileDetails()"><img src="../assets/icon/sign/backarrow.svg" alt="Back"></div>
        <div class="contact-header">
            <div class="initials-big ${colorClass}">${initials}</div>
            
            <div class="name-section">
                <h2>${name}</h2>
                <div class="action-buttons">
                    <span onclick="openEditContactOverlay(${index})" class="mobile-action-button"><img src="../assets/icon/contacts/edit.svg" alt="Edit">Edit</span>
                    <span onclick="openDeleteContactOverlay(${index})" class="mobile-action-button"><img src="../assets/icon/contacts/delete.svg" alt="Delete">Delete</span>
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
    }
    // Aktive Markierung setzen
    document.querySelectorAll('.contact-card').forEach(card => card.classList.remove('active-card'));
    let currentCard = document.getElementById('contactCard_' + index);
    if (currentCard) {
        currentCard.classList.add('active-card');
    }

    if (window.innerWidth <= 1000) {
        detailContainer.classList.add('show-mobile');
    }
}

