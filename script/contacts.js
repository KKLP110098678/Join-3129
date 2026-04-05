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


function openAddContactOverlay() {
    document.getElementById('addContactOverlay').classList.remove('d-none');
}

function closeAddContactOverlay() {
    document.getElementById('addContactOverlay').classList.add('d-none');
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactPhone').value = '';
}

function addNewContact(event) {
    event.preventDefault();
    
    let name = document.getElementById('contactName').value;
    let email = document.getElementById('contactEmail').value;
    let phone = document.getElementById('contactPhone').value;
    
    let nameParts = name.trim().split(' ');
    let initials = '';
    if (nameParts.length >= 2) {
        initials = nameParts[0].charAt(0).toUpperCase() + nameParts[nameParts.length-1].charAt(0).toUpperCase();
    } else if (nameParts.length === 1) {
        initials = nameParts[0].charAt(0).toUpperCase();
    }
    
    let colors = ['bg-orange', 'bg-purple', 'bg-blue', 'bg-green', 'bg-pink'];
    let randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    contacts.push({
        name: name,
        email: email,
        phone: phone,
        initials: initials,
        color: randomColor
    });
    
    closeAddContactOverlay();
    renderContacts();
}


function openEditContactOverlay(index) {
    let contact = contacts[index];
    document.getElementById('editContactIndex').value = index;
    document.getElementById('editContactName').value = contact.name;
    document.getElementById('editContactEmail').value = contact.email;
    document.getElementById('editContactPhone').value = contact.phone;
    document.getElementById('editContactOverlay').classList.remove('d-none');
}

function closeEditContactOverlay() {
    document.getElementById('editContactOverlay').classList.add('d-none');
}

function saveEditedContact(event) {
    event.preventDefault();
    
    let index = document.getElementById('editContactIndex').value;
    let name = document.getElementById('editContactName').value;
    let email = document.getElementById('editContactEmail').value;
    let phone = document.getElementById('editContactPhone').value;
    
    let nameParts = name.trim().split(' ');
    let initials = '';
    if (nameParts.length >= 2) {
        initials = nameParts[0].charAt(0).toUpperCase() + nameParts[nameParts.length-1].charAt(0).toUpperCase();
    } else if (nameParts.length === 1) {
        initials = nameParts[0].charAt(0).toUpperCase();
    }
    
    contacts[index].name = name;
    contacts[index].email = email;
    contacts[index].phone = phone;
    contacts[index].initials = initials;
    
    closeEditContactOverlay();
    renderContacts();
    
    let c = contacts[index];
    showContactDetails(index, c.name, c.email, c.phone, c.initials, c.color);
}

