/**
 * Gibt alle Nutzer aus Firebase zurück.
 * @returns {Promise<Object|null>} Das Nutzer-Objekt oder null.
 */
async function getAllUsers() {
    const snapshot = await firebase.database().ref('users').once('value');
    return snapshot.val();
}


/**
 * Registriert einen neuen Nutzer in Firebase.
 * @param {{ username: string, email: string, password: string }} newUser
 */
async function addNewUser(newUser) {
    try {
        await firebase.database().ref('users').push({
            username: newUser.username,
            email: newUser.email,
            password: newUser.password
        });
    } catch (e) {
        console.error('Error registering new user:', e);
    }
}


/**
 * Gibt den Firebase-Key eines Nutzers anhand seiner E-Mail zurück.
 * @param {string} email - Die E-Mail-Adresse des Nutzers.
 * @returns {Promise<string|null>} Der Firebase-Key oder null.
 */
async function getUserKeyByEmail(email) {
    try {
        const users = await getAllUsers();
        if (!users) return null;
        return Object.keys(users).find(key => users[key].email === email) || null;
    } catch (e) {
        console.error('Error getting user key:', e);
        return null;
    }
}


/**
 * Erstellt den eigenen Kontakteintrag des neuen Nutzers.
 * @param {{ username: string, email: string }} newUser
 * @returns {{ name: string, email: string, phone: string, initials: string, color: string }}
 */
function buildUserContact(newUser) {
    return {
        name: newUser.username,
        email: newUser.email,
        phone: '',
        initials: getInitialsFromName(newUser.username),
        color: 'bg-orange'
    };
}


/**
 * Erstellt Standard-Kontakte für einen neu registrierten Nutzer.
 * @param {{ username: string, email: string }} newUser
 */
async function createDefaultContacts(newUser) {
    try {
        const userKey = await getUserKeyByEmail(newUser.email);
        if (!userKey) return;

        const response = await fetch('../data/defaultContacts.json');
        const loadedDefaults = await response.json();
        const allContacts = [buildUserContact(newUser), ...loadedDefaults];

        await firebase.database().ref(`users/${userKey}/contacts`).set(allContacts);
    } catch (e) {
        console.error('Error creating default contacts:', e);
    }
}


/**
 * Authentifiziert einen Nutzer anhand von E-Mail und Passwort.
 * @param {string} inputEmail - Die eingegebene E-Mail.
 * @param {string} inputPassword - Das eingegebene Passwort.
 * @returns {Promise<Object|null>} Der Nutzer oder null.
 */
async function authenticateUser(inputEmail, inputPassword) {
    try {
        const users = await getAllUsers();
        if (!users) return null;

        const entry = Object.entries(users).find(([, user]) =>
            user.email === inputEmail && user.password === inputPassword
        );

        if (!entry) return null;

        const [key, user] = entry;
        sessionStorage.setItem('userKey', key);
        sessionStorage.setItem('username', user.username);
        return user;
    } catch (e) {
        console.error('Error authenticating user:', e);
        return null;
    }
}


/**
 * Prüft ob ein Benutzername bereits vergeben ist.
 * @param {string} userName - Der zu prüfende Benutzername.
 * @returns {Promise<boolean>} True wenn vergeben.
 */
async function isUserNameTaken(userName) {
    try {
        const users = await getAllUsers();
        if (!users) return false;
        return Object.values(users).some(user => user.username === userName);
    } catch (e) {
        console.error('Error checking username:', e);
        return false;
    }
}


/**
 * Prüft ob eine E-Mail-Adresse bereits registriert ist.
 * @param {string} inputEmail - Die zu prüfende E-Mail.
 * @returns {Promise<boolean>} True wenn vergeben.
 */
async function isUserEmailTaken(inputEmail) {
    try {
        const users = await getAllUsers();
        if (!users) return false;
        return Object.values(users).some(user => user.email === inputEmail);
    } catch (e) {
        console.error('Error checking user email:', e);
        return false;
    }
}


/**
 * Gibt den Firebase-Key des eingeloggten Nutzers zurück.
 * @returns {string|null} Der Firebase-Key.
 */
function getUserKey() {
    return sessionStorage.getItem('userKey');
}


/**
 * Prüft ob der aktuelle Nutzer ein Gast ist.
 * @returns {boolean} True wenn Gast.
 */
function isGuest() {
    return sessionStorage.getItem('isGuest') === 'true';
}