/**
 * Returns the HTML of the mobile contact detail view.
 * @param {number} index - The index of the contact.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email address.
 * @param {string} phone - The phone number.
 * @param {string} initials - The initials.
 * @param {string} colorClass - The CSS color class.
 * @returns {string} HTML string of the mobile detail view.
 */
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
 * Returns the HTML of the desktop contact detail view.
 * @param {number} index - The index of the contact.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email address.
 * @param {string} phone - The phone number.
 * @param {string} initials - The initials.
 * @param {string} colorClass - The CSS color class.
 * @returns {string} HTML string of the desktop detail view.
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