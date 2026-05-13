let contacts = [];
let defaultContacts = [];
let selectedContactDetails = null;
let contactsResizeHandlerAttached = false;


/**
 * Loads the default contacts from the JSON file.
 * @returns {Promise<void>}
 */
async function loadDefaultContacts() {
    try {
        const response = await fetch('../json/defaultContacts.json');
        defaultContacts = await response.json();
    } catch (e) {
        console.error('Error loading defaultContacts.json:', e);
    }
}


/**
 * Returns the Firebase reference for contacts.
 * @returns {firebase.database.Reference} The Firebase reference.
 */
function getContactsRef() {
    return isGuest() ? db.ref('guest/contacts') : db.ref(`users/${getUserKey()}/contacts`);
}


/**
 * Saves the contacts to Firebase.
 */
async function saveContacts() {
    try {
        await getContactsRef().set(contacts);
    } catch (e) {
        console.error('Error saving contacts to Firebase:', e);
    }
}


/**
 * Parses the Firebase snapshot into a contacts array.
 * @param {Object|Array|null} val - The value from the snapshot.
 * @returns {Object[]|null} The contacts array or null.
 */
function parseContactsSnapshot(val) {
    if (!val || Object.keys(val).length === 0) return null;
    const raw = Array.isArray(val) ? val : Object.values(val);
    return raw.filter(c => c !== null && c !== undefined);
}


/**
 * Loads contacts from Firebase – first the default contacts, then Firebase.
 */
async function loadContacts() {
    await loadDefaultContacts();
    try {
        const snapshot = await getContactsRef().once('value');
        const parsed = parseContactsSnapshot(snapshot.val());

        if (!parsed) {
            contacts = [...defaultContacts];
            await saveContacts();
        } else {
            contacts = parsed;
        }

        if (typeof renderAssignedToDropdown === 'function') renderAssignedToDropdown();
        if (document.querySelector('.contact-list-scroll')) renderContacts();
    } catch (e) {
        console.error('Error loading contacts from Firebase:', e);
    }
}


/**
 * Renders a letter separator into the contact list.
 * @param {HTMLElement} container - The list container.
 * @param {string} letter - The first letter.
 */
function renderLetterSeparator(container, letter) {
    container.innerHTML += `
        <div class="letter-separator">${letter}</div>
        <hr class="separator-line">
    `;
}


/**
 * Renders a single contact card.
 * @param {HTMLElement} container - The list container.
 * @param {Object} contact - The contact.
 * @param {number} index - The index of the contact.
 */
function renderContactCard(container, contact, index) {
    container.innerHTML += `
        <div id="contactCard_${index}" class="contact-card" onclick="showContactDetails(${index}, '${contact.name}', '${contact.email}', '${contact.phone}', '${contact.initials}', '${contact.color}')">
            <div class="contact-initials ${contact.color}">${contact.initials}</div>
            <div class="contact-info">
                <span class="contact-name">${contact.name}</span>
                <a class="contact-email">${contact.email}</a>
            </div>
        </div>
    `;
}


/**
 * Renders the entire contact list sorted alphabetically.
 */
function renderContacts() {
    const container = document.querySelector('.contact-list-scroll');
    if (!container) return;

    container.innerHTML = '';
    contacts.sort((a, b) => a.name.localeCompare(b.name));

    let currentLetter = '';
    contacts.forEach((contact, index) => {
        const firstLetter = contact.name.charAt(0).toUpperCase();
        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            renderLetterSeparator(container, currentLetter);
        }
        renderContactCard(container, contact, index);
    });
}


/**
 * Calculates the initials from a full name.
 * @param {string} name - The full name.
 * @returns {string} The initials (1-2 characters).
 */
function getInitialsFromName(name) {
    const parts = name.trim().split(' ');
    return parts.length >= 2
        ? parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase()
        : parts[0].charAt(0).toUpperCase();
}


/**
 * Returns a random avatar color.
 * @returns {string} A CSS class for the color.
 */
function getRandomColor() {
    const colors = ['bg-orange', 'bg-purple', 'bg-blue', 'bg-green', 'bg-pink'];
    return colors[Math.floor(Math.random() * colors.length)];
}


/**
 * Checks if the current view is mobile.
 * @returns {boolean} True if the screen width is 1100px or less.
 */
function isMobileContactsView() {
    return window.innerWidth <= 1100;
}


/**
 * Clears the currently selected contact details.
 */
function clearContactDetailSelection() {
    selectedContactDetails = null;
}


/**
 * Marks the active contact card in the list.
 * @param {number} index - The index of the active contact.
 */
function markActiveContactCard(index) {
    document.querySelectorAll('.contact-card').forEach(card => card.classList.remove('active-card'));
    const currentCard = document.getElementById(`contactCard_${index}`);
    if (currentCard) currentCard.classList.add('active-card');
}


/**
 * Re-renders the currently selected contact details.
 */
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


/**
 * Attaches the resize handler for responsive contact detail rendering.
 */
function attachContactsResizeHandler() {
    if (contactsResizeHandlerAttached) return;

    window.addEventListener('resize', () => {
        if (!selectedContactDetails) return;
        renderSelectedContactDetails();
    });

    contactsResizeHandlerAttached = true;
}


/**
 * Shows the contact detail view for a contact.
 * @param {number} index - The index of the contact.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email address.
 * @param {string} phone - The phone number.
 * @param {string} initials - The initials.
 * @param {string} colorClass - The CSS color class.
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


/**
 * Removes invalid characters from a phone input field.
 * Allows only digits, spaces and a leading plus sign.
 * @param {HTMLInputElement} input - The phone input element.
 */
function sanitizePhoneInput(input) {
    let value = input.value;
    let hasPlus = value.startsWith('+');
    value = value.replace(/[^0-9\s]/g, '');
    if (hasPlus) value = '+' + value;
    input.value = value;
}


/**
 * Deselects the active contact card and clears the detail view
 * when clicking outside of a contact card, detail view or overlay.
 * @param {MouseEvent} event - The click event.
 */
document.addEventListener('click', function (event) {
    const clickedCard = event.target.closest('.contact-card');
    const clickedDetail = event.target.closest('.contact-detail-container');
    const clickedOverlay = event.target.closest('.overlay, .overlay-edit-contact');

    if (!clickedCard && !clickedDetail && !clickedOverlay) {
        document.querySelectorAll('.contact-card').forEach(card => {
            card.classList.remove('active-card');
        });

        const detailView = document.getElementById('contact-detail-view');
        if (detailView) {
            detailView.innerHTML = '<div class="no-selection">Wähle einen Kontakt aus, um Details zu sehen.</div>';
            detailView.classList.remove('show-mobile');
        }
    }
});