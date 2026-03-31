let contacts = [
    {
        name: 'Anton Mayer',
        email: 'antom@gmail.com',
        phone: '+49 1111 111 11 1',
        initials: 'AM',
        color: 'bg-orange'
    }
];



function renderContacts() {
    // 1. Das Element finden, in das wir die Kontakte laden wollen
    let listContainer = document.querySelector('.contact-list-scroll');
    
    // 2. Den Container leeren, damit sich Listen nicht doppeln
    listContainer.innerHTML = '';

    // 3. Durch das Array schleifen und jeden Kontakt als HTML erzeugen
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        
        listContainer.innerHTML += `
            <div class="contact-card" onclick="showContactDetails(${i}, '${contact.name}', '${contact.email}', '${contact.phone}', '${contact.initials}', '${contact.color}')">
                <div class="contact-initials ${contact.color}">${contact.initials}</div>
                <div class="contact-info">
                    <span class="contact-name">${contact.name}</span>
                    <span class="contact-email">${contact.email}</span>
                </div>
            </div>
        `;
    }
}


function deleteContact(index) {
    contacts.splice(index, 1);
    
    // Setzt die rechte Seite wieder auf den Platzhalter-Text
    document.getElementById('contact-detail-view').innerHTML = '<div class="no-selection">Wähle einen Kontakt aus, um Details zu sehen.</div>';
    
    renderContacts();
}

