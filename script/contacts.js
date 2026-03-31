let contacts = [
    {
        name: 'Anton Mayer',
        email: 'antom@gmail.com',
        phone: '+49 1111 111 11 1',
        initials: 'AM',
        color: 'bg-orange'
    }
];

function deleteContact(index) {
    contacts.splice(index, 1);
    

    renderContacts();
}
