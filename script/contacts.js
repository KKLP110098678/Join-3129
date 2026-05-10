let contacts = [];
let defaultContacts = [];


/**
 * Lädt die Standard-Kontakte aus der JSON-Datei.
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
 * Gibt die Firebase-Referenz für Kontakte zurück.
 * @returns {firebase.database.Reference} Die Firebase-Referenz.
 */
function getContactsRef() {
    return isGuest() ? db.ref('guest/contacts') : db.ref(`users/${getUserKey()}/contacts`);
}


/**
 * Speichert die Kontakte in Firebase.
 */
async function saveContacts() {
    try {
        await getContactsRef().set(contacts);
    } catch (e) {
        console.error('Error saving contacts to Firebase:', e);
    }
}


/**
 * Parst den Firebase-Snapshot in ein Kontakt-Array.
 * @param {Object|Array|null} val - Der Wert aus dem Snapshot.
 * @returns {Object[]|null} Das Kontakt-Array oder null.
 */
function parseContactsSnapshot(val) {
    if (!val || Object.keys(val).length === 0) return null;
    const raw = Array.isArray(val) ? val : Object.values(val);
    return raw.filter(c => c !== null && c !== undefined);
}


/**
 * Lädt Kontakte aus Firebase – zuerst die Standard-Kontakte, dann Firebase.
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
 * Rendert einen Buchstaben-Trenner in die Kontaktliste.
 * @param {HTMLElement} container - Der Listen-Container.
 * @param {string} letter - Der Anfangsbuchstabe.
 */
function renderLetterSeparator(container, letter) {
    container.innerHTML += `
        <div class="letter-separator">${letter}</div>
        <hr class="separator-line">
    `;
}


/**
 * Rendert eine einzelne Kontaktkarte.
 * @param {HTMLElement} container - Der Listen-Container.
 * @param {Object} contact - Der Kontakt.
 * @param {number} index - Der Index des Kontakts.
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
 * Rendert die gesamte Kontaktliste alphabetisch sortiert.
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
 * Berechnet die Initialen aus einem vollständigen Namen.
 * @param {string} name - Der vollständige Name.
 * @returns {string} Die Initialen (1-2 Zeichen).
 */
function getInitialsFromName(name) {
    const parts = name.trim().split(' ');
    return parts.length >= 2
        ? parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase()
        : parts[0].charAt(0).toUpperCase();
}


/**
 * Gibt eine zufällige Avatar-Farbe zurück.
 * @returns {string} Eine CSS-Klasse für die Farbe.
 */
function getRandomColor() {
    const colors = ['bg-orange', 'bg-purple', 'bg-blue', 'bg-green', 'bg-pink'];
    return colors[Math.floor(Math.random() * colors.length)];
}