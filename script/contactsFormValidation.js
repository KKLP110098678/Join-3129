let pendingDeleteIndex = null;


/**
 * Zeigt einen Feldfehler im Kontaktformular an.
 * @param {string} fieldId - Die ID des Felds.
 * @param {string} message - Die Fehlermeldung.
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
 * Entfernt einen Feldfehler im Kontaktformular.
 * @param {string} fieldId - Die ID des Felds.
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
 * Prüft ob eine E-Mail-Adresse gültig ist.
 * @param {string} email - Die zu prüfende E-Mail.
 * @returns {boolean} True wenn gültig.
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/**
 * Prüft ob eine Telefonnummer nur erlaubte Zeichen enthält.
 * @param {string} phone - Die zu prüfende Telefonnummer.
 * @returns {boolean} True wenn gültig.
 */
function isValidPhone(phone) {
    return /^[0-9+\s\-()]+$/.test(phone);
}


/**
 * Validiert das Name-Feld des Add-Kontakt-Formulars.
 * @returns {boolean} True wenn gültig.
 */
function validateContactName() {
    const name = document.getElementById('contactName').value.trim();
    if (!name) { showContactFieldError('contactName', 'Please enter a name.'); return false; }
    clearContactFieldError('contactName');
    return true;
}


/**
 * Validiert das E-Mail-Feld des Add-Kontakt-Formulars.
 * @returns {boolean} True wenn gültig.
 */
function validateContactEmail() {
    const email = document.getElementById('contactEmail').value.trim();
    if (!email) { showContactFieldError('contactEmail', 'Please enter an email address.'); return false; }
    if (!isValidEmail(email)) { showContactFieldError('contactEmail', 'Please enter a valid email address.'); return false; }
    clearContactFieldError('contactEmail');
    return true;
}


/**
 * Validiert das Telefon-Feld des Add-Kontakt-Formulars.
 * @returns {boolean} True wenn gültig.
 */
function validateContactPhone() {
    const phone = document.getElementById('contactPhone').value.trim();
    if (!phone) { showContactFieldError('contactPhone', 'Please enter a phone number.'); return false; }
    if (!isValidPhone(phone)) { showContactFieldError('contactPhone', 'Only numbers are allowed.'); return false; }
    clearContactFieldError('contactPhone');
    return true;
}


/**
 * Validiert das Name-Feld des Edit-Kontakt-Formulars.
 * @returns {boolean} True wenn gültig.
 */
function validateEditContactName() {
    const name = document.getElementById('editContactName').value.trim();
    if (!name) { showContactFieldError('editContactName', 'Please enter a name.'); return false; }
    clearContactFieldError('editContactName');
    return true;
}


/**
 * Validiert das E-Mail-Feld des Edit-Kontakt-Formulars.
 * @returns {boolean} True wenn gültig.
 */
function validateEditContactEmail() {
    const email = document.getElementById('editContactEmail').value.trim();
    if (!email) { showContactFieldError('editContactEmail', 'Please enter an email address.'); return false; }
    if (!isValidEmail(email)) { showContactFieldError('editContactEmail', 'Please enter a valid email address.'); return false; }
    clearContactFieldError('editContactEmail');
    return true;
}


/**
 * Validiert das Telefon-Feld des Edit-Kontakt-Formulars.
 * @returns {boolean} True wenn gültig.
 */
function validateEditContactPhone() {
    const phone = document.getElementById('editContactPhone').value.trim();
    if (!phone) { showContactFieldError('editContactPhone', 'Please enter a phone number.'); return false; }
    if (!isValidPhone(phone)) { showContactFieldError('editContactPhone', 'Only numbers are allowed.'); return false; }
    clearContactFieldError('editContactPhone');
    return true;
}


/**
 * Liest die Kontaktformulardaten aus und gibt sie als Objekt zurück.
 * @param {string} prefix - Präfix der Feld-IDs ('contact' oder 'editContact').
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
 * Öffnet das Add-Contact-Overlay.
 */
function openAddContactOverlay() {
    document.getElementById('addContactOverlay').classList.remove('d-none');
}


/**
 * Schließt das Add-Contact-Overlay und setzt das Formular zurück.
 */
function closeAddContactOverlay() {
    document.getElementById('addContactOverlay').classList.add('d-none');
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactPhone').value = '';
    ['contactName', 'contactEmail', 'contactPhone'].forEach(clearContactFieldError);
}


/**
 * Zeigt ein kurzes Popup nach erfolgreichem Erstellen eines Kontakts.
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
 * Verarbeitet das Hinzufügen eines neuen Kontakts.
 * @param {SubmitEvent} event - Das Submit-Event.
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
 * Öffnet das Edit-Contact-Overlay und befüllt es mit den Kontaktdaten.
 * @param {number} index - Der Index des zu bearbeitenden Kontakts.
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
 * Schließt das Edit-Contact-Overlay.
 */
function closeEditContactOverlay() {
    document.getElementById('editContactOverlay').classList.add('d-none');
    ['editContactName', 'editContactEmail', 'editContactPhone'].forEach(clearContactFieldError);
}


/**
 * Speichert die Änderungen an einem bestehenden Kontakt.
 * @param {SubmitEvent} event - Das Submit-Event.
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
 * Öffnet das Löschen-Bestätigungs-Overlay für einen Kontakt.
 * @param {number} index - Der Index des zu löschenden Kontakts.
 */
function openDeleteContactOverlay(index) {
    pendingDeleteIndex = index;
    document.getElementById('deleteContactOverlay').classList.remove('d-none');
}


/**
 * Schließt das Löschen-Overlay.
 */
function closeDeleteContactOverlay() {
    pendingDeleteIndex = null;
    document.getElementById('deleteContactOverlay').classList.add('d-none');
    hideMobileContactActionMenu();
}


/**
 * Bestätigt und führt das Löschen des ausstehenden Kontakts durch.
 */
function confirmDeleteContact() {
    if (pendingDeleteIndex !== null) {
        deleteContact(pendingDeleteIndex);
        closeDeleteContactOverlay();
    }
}


/**
 * Löscht einen Kontakt und aktualisiert die Ansicht.
 * @param {number} index - Der Index des zu löschenden Kontakts.
 */
function deleteContact(index) {
    contacts.splice(index, 1);
    document.getElementById('contact-detail-view').innerHTML =
        '<div class="no-selection">Wähle einen Kontakt aus, um Details zu sehen.</div>';
    saveContacts();
    renderContacts();
    closeMobileDetails();
}


/**
 * Blendet die mobile Detailansicht aus.
 */
function closeMobileDetails() {
    document.getElementById('contact-detail-view')?.classList.remove('show-mobile');
}


/**
 * Schaltet das mobile Kontakt-Aktionsmenü um.
 */
function showMobileContactActionMenu() {
    document.getElementById('mobileContactActionMenu').classList.toggle('d-none');
    document.getElementById('mobileActionOverlay').classList.toggle('d-none');
}


/**
 * Versteckt das mobile Kontakt-Aktionsmenü.
 */
function hideMobileContactActionMenu() {
    document.getElementById('mobileContactActionMenu')?.classList.add('d-none');
    document.getElementById('mobileActionOverlay')?.classList.add('d-none');
}


/**
 * Schließt ein Overlay beim Klick auf den Hintergrund.
 * @param {MouseEvent} event - Das Klick-Event.
 * @param {string} overlayId - Die ID des Overlays.
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