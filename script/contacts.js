let contacts = [];

// --- Firebase ---

async function loadContacts() {
    try {
        let snapshot = await db.ref('contacts').once('value');
        const val = snapshot.val();

        if (!val) {
            contacts = [];
        } else if (Array.isArray(val)) {
            contacts = val.filter(c => c !== null && c !== undefined);
        } else {
            contacts = Object.values(val).filter(c => c !== null && c !== undefined);
        }

        if (typeof renderAssignedToDropdown === 'function') {
            renderAssignedToDropdown();
        }

        let listContainer = document.querySelector('.contact-list-scroll');
        if (!listContainer) return;
        renderContacts();

    } catch(e) {
        console.error("Error loading contacts from Firebase:", e);
    }
}

async function saveContacts() {
    try {
        await db.ref('contacts').set(contacts);
    } catch(e) {
        console.error("Error saving contacts to Firebase:", e);
    }
}

// --- Render ---

function renderContacts() {
    let listContainer = document.querySelector('.contact-list-scroll');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    contacts.sort((a, b) => a.name.localeCompare(b.name));

    let currentLetter = '';

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        let firstLetter = contact.name.charAt(0).toUpperCase();

        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            listContainer.innerHTML += `
                <div class="letter-separator">${currentLetter}</div>
                <hr class="separator-line">
            `;
        }

        listContainer.innerHTML += `
            <div id="contactCard_${i}" class="contact-card" onclick="showContactDetails(${i}, '${contact.name}', '${contact.email}', '${contact.phone}', '${contact.initials}', '${contact.color}')">
                <div class="contact-initials ${contact.color}">${contact.initials}</div>
                <div class="contact-info">
                    <span class="contact-name">${contact.name}</span>
                    <a class="contact-email" href="mailto:${contact.email}">${contact.email}</a>
                </div>
            </div>
        `;
    }
}

// --- Add Contact ---

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
    let initials = nameParts.length >= 2
        ? nameParts[0].charAt(0).toUpperCase() + nameParts[nameParts.length - 1].charAt(0).toUpperCase()
        : nameParts[0].charAt(0).toUpperCase();

    let colors = ['bg-orange', 'bg-purple', 'bg-blue', 'bg-green', 'bg-pink'];
    let randomColor = colors[Math.floor(Math.random() * colors.length)];

    contacts.push({ name, email, phone, initials, color: randomColor });

    saveContacts();
    closeAddContactOverlay();
    renderContacts();
}

// --- Edit Contact ---

function openEditContactOverlay(index) {
    let contact = contacts[index];
    document.getElementById('editContactIndex').value = index;
    document.getElementById('editContactName').value = contact.name;
    document.getElementById('editContactEmail').value = contact.email;
    document.getElementById('editContactPhone').value = contact.phone;
    
    let avatar = document.getElementById('editContactAvatar');
    let initialsSpan = document.getElementById('editContactInitials');
    avatar.className = 'avatar-circle ' + contact.color;
    initialsSpan.textContent = contact.initials;
    
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
    let initials = nameParts.length >= 2
        ? nameParts[0].charAt(0).toUpperCase() + nameParts[nameParts.length - 1].charAt(0).toUpperCase()
        : nameParts[0].charAt(0).toUpperCase();

    contacts[index] = { ...contacts[index], name, email, phone, initials };

    saveContacts();
    closeEditContactOverlay();
    renderContacts();

    let c = contacts[index];
    showContactDetails(index, c.name, c.email, c.phone, c.initials, c.color);
}

// --- Delete Contact ---

let pendingDeleteIndex = null;

function openDeleteContactOverlay(index) {
    pendingDeleteIndex = index;
    document.getElementById('deleteContactOverlay').classList.remove('d-none');
}

function closeDeleteContactOverlay() {
    pendingDeleteIndex = null;
    document.getElementById('deleteContactOverlay').classList.add('d-none');
    hideMobileContactActionMenu();
}

function confirmDeleteContact() {
    if (pendingDeleteIndex !== null) {
        deleteContact(pendingDeleteIndex);
        closeDeleteContactOverlay();
    }
}

function deleteContact(index) {
    contacts.splice(index, 1);
    document.getElementById('contact-detail-view').innerHTML = '<div class="no-selection">Wähle einen Kontakt aus, um Details zu sehen.</div>';
    saveContacts();
    renderContacts();
    closeMobileDetails();
}

// --- Mobile ---

function closeMobileDetails() {
    let detailContainer = document.getElementById('contact-detail-view');
    if (detailContainer) detailContainer.classList.remove('show-mobile');
}

function showMobileContactActionMenu() {
    document.getElementById('mobileContactActionMenu').classList.toggle('d-none');
    document.getElementById('mobileActionOverlay').classList.toggle('d-none');
}

function hideMobileContactActionMenu() {
    document.getElementById('mobileContactActionMenu').classList.add('d-none');
    document.getElementById('mobileActionOverlay').classList.add('d-none');
}