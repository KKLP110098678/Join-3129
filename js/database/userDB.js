async function addNewUser(newUser) {
    try {
        const userRef = firebase.database().ref('users');
        const newUserRef = userRef.push();
        await newUserRef.set({
            username: newUser.username,
            email: newUser.email,
            password: newUser.password
        });
    } catch (error) {
        console.error('Error registering new user:', error);
    }
}

async function createDefaultContacts(newUser) {
    try {
        const userKey = await getUserKeyByEmail(newUser.email);
        if (!userKey) return;

        const contactsRef = firebase.database().ref(`users/${userKey}/contacts`);

        const nameParts = newUser.username.trim().split(' ');
        const initials = nameParts.length >= 2
            ? nameParts[0].charAt(0).toUpperCase() + nameParts[nameParts.length - 1].charAt(0).toUpperCase()
            : nameParts[0].charAt(0).toUpperCase();

        const colors = ['bg-orange', 'bg-purple', 'bg-blue', 'bg-green', 'bg-pink'];

        const defaultContacts = [
            { name: newUser.username, email: newUser.email, phone: '', initials, color: colors[0] },
            { name: 'Anna Müller', email: 'anna.mueller@example.com', phone: '+49 151 12345678', initials: 'AM', color: colors[1] },
            { name: 'Ben Schmidt', email: 'ben.schmidt@example.com', phone: '+49 152 23456789', initials: 'BS', color: colors[2] },
            { name: 'Clara Weber', email: 'clara.weber@example.com', phone: '+49 153 34567890', initials: 'CW', color: colors[3] },
            { name: 'David Koch', email: 'david.koch@example.com', phone: '+49 154 45678901', initials: 'DK', color: colors[4] },
            { name: 'Eva Bauer', email: 'eva.bauer@example.com', phone: '+49 155 56789012', initials: 'EB', color: colors[0] },
            { name: 'Felix Wagner', email: 'felix.wagner@example.com', phone: '+49 156 67890123', initials: 'FW', color: colors[1] },
            { name: 'Greta Fischer', email: 'greta.fischer@example.com', phone: '+49 157 78901234', initials: 'GF', color: colors[2] },
            { name: 'Hans Meyer', email: 'hans.meyer@example.com', phone: '+49 158 89012345', initials: 'HM', color: colors[3] },
            { name: 'Ida Schulz', email: 'ida.schulz@example.com', phone: '+49 159 90123456', initials: 'IS', color: colors[4] },
            { name: 'Jonas Becker', email: 'jonas.becker@example.com', phone: '+49 160 01234567', initials: 'JB', color: colors[0] },
        ];

        await contactsRef.set(defaultContacts);
    } catch(e) {
        console.error('Error creating default contacts:', e);
    }
}

async function getUserKeyByEmail(email) {
    try {
        const snapshot = await firebase.database().ref('users').once('value');
        const users = snapshot.val();
        if (!users) return null;
        for (let key in users) {
            if (users[key].email === email) return key;
        }
        return null;
    } catch(e) {
        console.error('Error getting user key:', e);
        return null;
    }
}

async function authenticateUser(inputEmail, inputPassword) {
    try {
        const usersRef = firebase.database().ref("users");
        const snapshot = await usersRef.once("value");
        const users = snapshot.val();

        if (!users) return null;

        for (let key in users) {
            if (
                users[key].email === inputEmail &&
                users[key].password === inputPassword
            ) {
                sessionStorage.setItem('userKey', key); // neu
                sessionStorage.setItem('username', users[key].username); // neu
                return users[key];
            }
        }

        return null;
    } catch (error) {
        console.error("Error authenticating user:", error);
        return null;
    }
}

async function isUserNameTaken(userName) {
    try {
        const usersRef = firebase.database().ref("users");
        const snapshot = await usersRef.once("value");
        const users = snapshot.val();

        if (!users) return false;

        for (let key in users) {
            if (users[key].username === userName) return true;
        }

        return false;
    } catch (error) {
        console.error("Error checking username:", error);
        return false;
    }
}

async function isUserEmailTaken(inputEmail) {
    try {
        const usersRef = firebase.database().ref("users");
        const snapshot = await usersRef.once("value");
        const users = snapshot.val();

        if (!users) return false;

        for (let key in users) {
            if (users[key].email === inputEmail) return true;
        }

        return false;
    } catch (error) {
        console.error("Error checking user Email:", error);
        return false;
    }
}

function getUserKey() {
    return sessionStorage.getItem('userKey');
}

function isGuest() {
    return sessionStorage.getItem('isGuest') === 'true';
}