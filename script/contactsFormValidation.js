let pendingDeleteIndex = null;


/**
 * Displays a field error in the contact form.
 * @param {string} fieldId - The ID of the field.
 * @param {string} message - The error message.
 */
function showContactFieldError(fieldId, message) {
    const wrapper = document.querySelector(`#${fieldId}`)?.closest('.input-wrapper');
    const errorMessage = document.getElementById(`${fieldId}-error`);
    if (!wrapper || !errorMessage) return;

    errorMessage.textContent = message;
    errorMessage.classList.add('error');
    wrapper.classList.add('error');
    errorMessage.classList.remove('d-none');
}


/**
 * Removes a field error in the contact form.
 * @param {string} fieldId - The ID of the field.
 */
function clearContactFieldError(fieldId) {
    const wrapper = document.querySelector(`#${fieldId}`)?.closest('.input-wrapper');
    const errorMessage = document.getElementById(`${fieldId}-error`);
    if (!wrapper || !errorMessage) return;

    errorMessage.classList.remove('error');
    wrapper.classList.remove('error');
    errorMessage.classList.add('d-none');
    errorMessage.textContent = '';
}


/**
 * Checks if an email address is valid.
 * @param {string} email - The email to check.
 * @returns {boolean} True if valid.
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/**
 * Checks if a phone number contains only allowed characters.
 * @param {string} phone - The phone number to check.
 * @returns {boolean} True if valid.
 */
function isValidPhone(phone) {
    return /^[0-9+\s\-()]+$/.test(phone);
}


/**
 * Validates the name field of the add contact form.
 * @returns {boolean} True if valid.
 */
function validateContactName() {
    const name = document.getElementById('contactName').value.trim();
    if (!name) { showContactFieldError('contactName', 'Please enter a name.'); return false; }
    clearContactFieldError('contactName');
    return true;
}


/**
 * Validates the email field of the add contact form.
 * @returns {boolean} True if valid.
 */
function validateContactEmail() {
    const email = document.getElementById('contactEmail').value.trim();
    if (!email) { showContactFieldError('contactEmail', 'Please enter an email address.'); return false; }
    if (!isValidEmail(email)) { showContactFieldError('contactEmail', 'Please enter a valid email address.'); return false; }
    clearContactFieldError('contactEmail');
    return true;
}


/**
 * Validates the phone field of the add contact form.
 * @returns {boolean} True if valid.
 */
function validateContactPhone() {
    const phone = document.getElementById('contactPhone').value.trim();
    if (!phone) { showContactFieldError('contactPhone', 'Please enter a phone number.'); return false; }
    if (!isValidPhone(phone)) { showContactFieldError('contactPhone', 'Only numbers are allowed.'); return false; }
    clearContactFieldError('contactPhone');
    return true;
}


/**
 * Validates the name field of the edit contact form.
 * @returns {boolean} True if valid.
 */
function validateEditContactName() {
    const name = document.getElementById('editContactName').value.trim();
    if (!name) { showContactFieldError('editContactName', 'Please enter a name.'); return false; }
    clearContactFieldError('editContactName');
    return true;
}


/**
 * Validates the email field of the edit contact form.
 * @returns {boolean} True if valid.
 */
function validateEditContactEmail() {
    const email = document.getElementById('editContactEmail').value.trim();
    if (!email) { showContactFieldError('editContactEmail', 'Please enter an email address.'); return false; }
    if (!isValidEmail(email)) { showContactFieldError('editContactEmail', 'Please enter a valid email address.'); return false; }
    clearContactFieldError('editContactEmail');
    return true;
}


/**
 * Validates the phone field of the edit contact form.
 * @returns {boolean} True if valid.
 */
function validateEditContactPhone() {
    const phone = document.getElementById('editContactPhone').value.trim();
    if (!phone) { showContactFieldError('editContactPhone', 'Please enter a phone number.'); return false; }
    if (!isValidPhone(phone)) { showContactFieldError('editContactPhone', 'Only numbers are allowed.'); return false; }
    clearContactFieldError('editContactPhone');
    return true;
}


/**
 * Reads the contact form data and returns it as an object.
 * @param {string} prefix - Prefix of the field IDs ('contact' or 'editContact').
 * @returns {{ name: string, email: string, phone: string }}
 */
function getContactFormData(prefix) {
    return {
        name: document.getElementById(`${prefix}Name`).value.trim(),
        email: document.getElementById(`${prefix}Email`).value.trim(),
        phone: document.getElementById(`${prefix}Phone`).value.trim()
    };
}


/**
 * Opens the add contact overlay.
 */
function openAddContactOverlay() {
    document.getElementById('addContactOverlay').classList.remove('d-none');
}


/**
 * Closes the add contact overlay and resets the form.
 */
function closeAddContactOverlay() {
    document.getElementById('addContactOverlay').classList.add('d-none');
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactPhone').value = '';
    ['contactName', 'contactEmail', 'contactPhone'].forEach(clearContactFieldError);
}


/**
 * Shows a short popup after successfully creating a contact.
 */
function showContactAddedPopup() {
    const popup = document.createElement('div');
    popup.className = 'contact-added-popup';
    popup.textContent = 'Contact successfully created';
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add('fade-out');
        setTimeout(() => popup.remove(), 400);
    }, 2000);
}


/**
 * Handles adding a new contact.
 * @param {SubmitEvent} event - The submit event.
 */
function addNewContact(event) {
    event.preventDefault();
    if (!validateContactName() || !validateContactEmail() || !validateContactPhone()) return;

    const { name, email, phone } = getContactFormData('contact');
    contacts.push({ name, email, phone, initials: getInitialsFromName(name), color: getRandomColor() });

    saveContacts();
    closeAddContactOverlay();
    renderContacts();
    showContactAddedPopup();
}


/**
 * Opens the edit contact overlay and fills it with the contact data.
 * @param {number} index - The index of the contact to edit.
 */
function openEditContactOverlay(index) {
    const contact = contacts[index];
    const avatar = document.getElementById('editContactAvatar');
    const initialsSpan = document.getElementById('editContactInitials');

    document.getElementById('editContactIndex').value = index;
    document.getElementById('editContactName').value = contact.name;
    document.getElementById('editContactEmail').value = contact.email;
    document.getElementById('editContactPhone').value = contact.phone;

    avatar.className = `avatar-circle ${contact.color}`;
    initialsSpan.textContent = contact.initials;

    document.getElementById('editContactOverlay').classList.remove('d-none');
}


/**
 * Closes the edit contact overlay.
 */
function closeEditContactOverlay() {
    document.getElementById('editContactOverlay').classList.add('d-none');
    ['editContactName', 'editContactEmail', 'editContactPhone'].forEach(clearContactFieldError);
}


/**
 * Saves the changes to an existing contact.
 * @param {SubmitEvent} event - The submit event.
 */
function saveEditedContact(event) {
    event.preventDefault();
    if (!validateEditContactName() || !validateEditContactEmail() || !validateEditContactPhone()) return;

    const index = document.getElementById('editContactIndex').value;
    const { name, email, phone } = getContactFormData('editContact');
    const initials = getInitialsFromName(name);

    contacts[index] = { ...contacts[index], name, email, phone, initials };

    saveContacts();
    closeEditContactOverlay();
    renderContacts();

    const c = contacts[index];
    showContactDetails(index, c.name, c.email, c.phone, c.initials, c.color);
}


/**
 * Opens the delete confirmation overlay for a contact.
 * @param {number} index - The index of the contact to delete.
 */
function openDeleteContactOverlay(index) {
    pendingDeleteIndex = index;
    document.getElementById('deleteContactOverlay').classList.remove('d-none');
}


/**
 * Closes the delete overlay.
 */
function closeDeleteContactOverlay() {
    pendingDeleteIndex = null;
    document.getElementById('deleteContactOverlay').classList.add('d-none');
    hideMobileContactActionMenu();
}


/**
 * Confirms and executes the deletion of the pending contact.
 */
function confirmDeleteContact() {
    if (pendingDeleteIndex !== null) {
        deleteContact(pendingDeleteIndex);
        closeDeleteContactOverlay();
    }
}


/**
 * Deletes a contact and updates the view.
 * @param {number} index - The index of the contact to delete.
 */
function deleteContact(index) {
    contacts.splice(index, 1);
    document.getElementById('contact-detail-view').innerHTML =
        '<div class="no-selection">Wähle einen Kontakt aus, um Details zu sehen.</div>';
    clearContactDetailSelection();
    saveContacts();
    renderContacts();
    closeMobileDetails();
}


/**
 * Hides the mobile detail view.
 */
function closeMobileDetails() {
    document.getElementById('contact-detail-view')?.classList.remove('show-mobile');
}


/**
 * Toggles the mobile contact action menu.
 */
function showMobileContactActionMenu() {
    document.getElementById('mobileContactActionMenu').classList.toggle('d-none');
    document.getElementById('mobileActionOverlay').classList.toggle('d-none');
}


/**
 * Hides the mobile contact action menu.
 */
function hideMobileContactActionMenu() {
    document.getElementById('mobileContactActionMenu')?.classList.add('d-none');
    document.getElementById('mobileActionOverlay')?.classList.add('d-none');
}


/**
 * Closes an overlay when clicking on the background.
 * @param {MouseEvent} event - The click event.
 * @param {string} overlayId - The ID of the overlay.
 */
function closeOverlayOnBackground(event, overlayId) {
    if (event.target.id !== overlayId) return;

    const closeFunctions = {
        'addContactOverlay': closeAddContactOverlay,
        'editContactOverlay': closeEditContactOverlay,
        'deleteContactOverlay': closeDeleteContactOverlay
    };

    closeFunctions[overlayId]?.();
}