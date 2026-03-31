/**
 * Rendert die Details eines Kontakts in den rechten Bereich.
 * @param {Object} contact - Das Kontakt-Objekt (z.B. {name: 'Anton Mayer', email: '...', color: '#ff8a00'})
 */
function renderContactDetails(contact) {
    const container = document.getElementById('contact-detail-view');

    // Initialen berechnen (z.B. "Anton Mayer" -> "AM")
    const initials = contact.name.split(' ').map(n => n[0]).join('');

    container.innerHTML = `
        <div class="contact-header">
            <div class="initials-big" style="background-color: ${contact.color}">${initials}</div>
            <div class="name-section">
                <h2>${contact.name}</h2>
                <div class="action-buttons">
                    <span onclick="editContact()"><img src="edit.svg"> Edit</span>
                    <span onclick="deleteContact()"><img src="delete.svg"> Delete</span>
                </div>
            </div>
        </div>

        <div class="info-headline">Contact Information</div>

        <div class="contact-data">
            <b>Email</b>
            <a href="mailto:${contact.email}">${contact.email}</a>

            <b>Phone</b>
            <span>${contact.phone}</span>
        </div>
    `;
}

// Beispiel-Aufruf (Das würde passieren, wenn du in der Liste links klickst)
// renderContactDetails({name: 'Anton Mayer', email: 'antom@gmail.com', phone: '+49 1111 111 11 1', color: '#ff8a00'});