/**
 * Gibt das HTML der mobilen Kontakt-Detailansicht zurück.
 * @param {number} index - Der Index des Kontakts.
 * @param {string} name - Der Name des Kontakts.
 * @param {string} email - Die E-Mail-Adresse.
 * @param {string} phone - Die Telefonnummer.
 * @param {string} initials - Die Initialen.
 * @param {string} colorClass - Die CSS-Farbklasse.
 * @returns {string} HTML-String der mobilen Detailansicht.
 */
let selectedContactDetails = null;
let contactsResizeHandlerAttached = false;


function isMobileContactsView() {
    return window.innerWidth <= 1100;
}


function clearContactDetailSelection() {
    selectedContactDetails = null;
}


function renderSelectedContactDetails() {
    if (!selectedContactDetails) return;

    const detailContainer = document.getElementById('contact-detail-view');
    if (!detailContainer) return;

    const isMobile = isMobileContactsView();
    const currentContact = contacts[selectedContactDetails.index];
    if (!currentContact) return;

    detailContainer.innerHTML = isMobile
        ? contactDetailMobileTemplate(
            selectedContactDetails.index,
            currentContact.name,
            currentContact.email,
            currentContact.phone,
            currentContact.initials,
            currentContact.color
        )
        : contactDetailDesktopTemplate(
            selectedContactDetails.index,
            currentContact.name,
            currentContact.email,
            currentContact.phone,
            currentContact.initials,
            currentContact.color
        );

    if (isMobile) {
        detailContainer.classList.add('show-mobile');
    } else {
        detailContainer.classList.remove('show-mobile');
        hideMobileContactActionMenu();
    }

    markActiveContactCard(selectedContactDetails.index);
}


function attachContactsResizeHandler() {
    if (contactsResizeHandlerAttached) return;

    window.addEventListener('resize', () => {
        if (!selectedContactDetails) return;
        renderSelectedContactDetails();
    });

    contactsResizeHandlerAttached = true;
}


function contactDetailMobileTemplate(index, name, email, phone, initials, colorClass) {
    return `
        <h3 class="info-headline">Contact Information</h3>
        <div class="back-arrow" onclick="closeMobileDetails()">
            <img src="../assets/icon/sign/backarrow.svg" alt="Back">
        </div>
        <div class="contact-header">
            <div class="initials-big ${colorClass}">${initials}</div>
            <div class="name-section"><h2>${name}</h2></div>
        </div>
        <div class="contact-data">
            <b>Email</b>
            <a href="mailto:${email}">${email}</a>
            <b>Phone</b>
            <span>${phone}</span>
        </div>
        <div id="mobileActionOverlay" class="menu-overlay d-none" onclick="hideMobileContactActionMenu()"></div>
        <div class="mobile-contact-action-menu d-none" id="mobileContactActionMenu">
            <span onclick="openEditContactOverlay(${index})" class="mobile-action-button">
                <img src="../assets/icon/contacts/edit.svg" alt="Edit">Edit
            </span>
            <span onclick="openDeleteContactOverlay(${index})" class="mobile-action-button">
                <img src="../assets/icon/contacts/delete.svg" alt="Delete">Delete
            </span>
        </div>
        <button class="btn-change-contact-mobile" onclick="showMobileContactActionMenu()">
            <img src="../assets/icon/contacts/contact-details-menu.svg" alt="Edit and Delete Menu">
        </button>
    `;
}


/**
 * Gibt das HTML der Desktop-Kontakt-Detailansicht zurück.
 * @param {number} index - Der Index des Kontakts.
 * @param {string} name - Der Name des Kontakts.
 * @param {string} email - Die E-Mail-Adresse.
 * @param {string} phone - Die Telefonnummer.
 * @param {string} initials - Die Initialen.
 * @param {string} colorClass - Die CSS-Farbklasse.
 * @returns {string} HTML-String der Desktop-Detailansicht.
 */
function contactDetailDesktopTemplate(index, name, email, phone, initials, colorClass) {
    return `
        <div class="back-arrow" onclick="closeMobileDetails()">
            <img src="../assets/icon/sign/backarrow.svg" alt="Back">
        </div>
        <div class="contact-header">
            <div class="initials-big ${colorClass}">${initials}</div>
            <div class="name-section">
                <h2>${name}</h2>
                <div class="action-buttons">
                    <span onclick="openEditContactOverlay(${index})" class="mobile-action-button">
                        <img src="../assets/icon/contacts/edit.svg" alt="Edit">Edit
                    </span>
                    <span onclick="openDeleteContactOverlay(${index})" class="mobile-action-button">
                        <img src="../assets/icon/contacts/delete.svg" alt="Delete">Delete
                    </span>
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


/**
 * Markiert die aktive Kontaktkarte in der Liste.
 * @param {number} index - Der Index des aktiven Kontakts.
 */
function markActiveContactCard(index) {
    document.querySelectorAll('.contact-card').forEach(card => card.classList.remove('active-card'));
    const currentCard = document.getElementById(`contactCard_${index}`);
    if (currentCard) currentCard.classList.add('active-card');
}


/**
 * Zeigt die Kontakt-Detailansicht für einen Kontakt an.
 * @param {number} index - Der Index des Kontakts.
 * @param {string} name - Der Name des Kontakts.
 * @param {string} email - Die E-Mail-Adresse.
 * @param {string} phone - Die Telefonnummer.
 * @param {string} initials - Die Initialen.
 * @param {string} colorClass - Die CSS-Farbklasse.
 */
function showContactDetails(index, name, email, phone, initials, colorClass) {
    const detailContainer = document.getElementById('contact-detail-view');
    const isMobile = isMobileContactsView();

    attachContactsResizeHandler();
    selectedContactDetails = { index };

    detailContainer.innerHTML = isMobile
        ? contactDetailMobileTemplate(index, name, email, phone, initials, colorClass)
        : contactDetailDesktopTemplate(index, name, email, phone, initials, colorClass);

    markActiveContactCard(index);
    if (isMobile) {
        detailContainer.classList.add('show-mobile');
    } else {
        detailContainer.classList.remove('show-mobile');
    }
}