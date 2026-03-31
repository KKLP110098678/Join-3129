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


async function isUserNameTaken(userName) {
  try {
    const usersRef = firebase.database().ref("users");

    const snapshot = await usersRef.once("value");
    const users = snapshot.val();

    if (!users) return false;

    for (let key in users) {
      if (users[key].username === userName) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking username:", error);
    return false;
  }
}

async function authenticateUser(inputEmail, inputPassword) {
  try {
    const usersRef = firebase.database().ref("users");
    const snapshot = await usersRef.once("value");
    const users = snapshot.val();

    if (!users) return false;

    for (let key in users) {
      if (
        users[key].email === inputEmail &&
        users[key].password === inputPassword
      ) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error authenticating user:", error);
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
      if (users[key].email === inputEmail) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking user Email:", error);
    return false;
  }
}