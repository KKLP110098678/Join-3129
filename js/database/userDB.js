/**
 * Retrieves all users from Firebase.
 * @returns {Promise<Object|null>} The users object or null.
 */
async function getAllUsers() {
    const snapshot = await firebase.database().ref('users').once('value');
    return snapshot.val();
}


/**
 * Registers a new user in Firebase.
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
 * Returns the Firebase key of a user by their email address.
 * @param {string} email - The email address of the user.
 * @returns {Promise<string|null>} The Firebase key or null.
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
 * Creates the user's own contact entry for a newly registered user.
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
 * Creates default contacts for a newly registered user.
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
 * Authenticates a user by email and password.
 * @param {string} inputEmail - The entered email.
 * @param {string} inputPassword - The entered password.
 * @returns {Promise<Object|null>} The user or null.
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
 * Checks if a username is already taken.
 * @param {string} userName - The username to check.
 * @returns {Promise<boolean>} True if taken.
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
 * Checks if an email address is already registered.
 * @param {string} inputEmail - The email to check.
 * @returns {Promise<boolean>} True if taken.
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
 * Returns the Firebase key of the logged-in user.
 * @returns {string|null} The Firebase key.
 */
function getUserKey() {
    return sessionStorage.getItem('userKey');
}


/**
 * Checks if the current user is a guest.
 * @returns {boolean} True if guest.
 */
function isGuest() {
    return sessionStorage.getItem('isGuest') === 'true';
}