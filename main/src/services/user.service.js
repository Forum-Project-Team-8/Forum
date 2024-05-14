import { get, set, ref, query, equalTo, orderByChild, update, remove } from 'firebase/database';
import { db } from '../config/firebase-config';
import { updatePassword } from 'firebase/auth';
import { auth } from '../config/firebase-config';

export const getUserByHandle = (handle) => {

  return get(ref(db, `users/${handle}`));
};

export const createUserHandle = (firstname, lastname, handle, uid, email,) => {

  return set(ref(db, `users/${handle}`), { firstname, lastname, handle, uid, email, createdOn: new Date() })
};

export const getUserData = (uid) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export async function updateUserPosts(handle, postId) {
  try {

      await update(ref(db, `users/${handle}`), {
        [`posts/${postId}`]: true 
    });
  } catch (error) {
      console.error("Error updating user posts:", error);
      throw error;
  }
}

export async function updateUser(handle, updatedData) {
  try {
      await update(ref(db, `users/${handle}`), updatedData);
  } catch (error) {
      console.error("Error updating user:", error);
      throw error;
  }
}

export async function updateUserData(snapshot, firstname, lastname, email, photoData, password) {
  const userData = snapshot.val();
  if (userData) {
    const handle = Object.keys(snapshot.val())[0];
    const userRef = ref(db, 'users/' + `${handle}`);
    await update(userRef, {
      firstname: firstname || snapshot.val()[handle].firstname,
      lastname: lastname || snapshot.val()[handle].lastname,
      email: email || snapshot.val()[handle].email,
      photoData: photoData || snapshot.val()[handle].photoData,
    });

    if (password) {
      await updatePassword(auth.currentUser, password);
    }

    return { success: true };
  } else {
    return { success: false, message: 'User does not exist' };
  }
}

export async function toggleUserBlockInDB(handle, currentIsBlocked) {
  const usersRef = ref(db, 'users');
  const usersSnapshot = await get(usersRef);

  usersSnapshot.forEach((userSnapshot) => {
    const userData = userSnapshot.val();
    if (userData.handle === handle) {
      const userId = userSnapshot.key;
      update(ref(db, `users/${userId}`), { isBlocked: !currentIsBlocked });
    }
  });
}

export async function toggleAdminStatusInDB(handle, currentIsAdmin) {
  const usersRef = ref(db, 'users');
  const usersSnapshot = await get(usersRef);

  usersSnapshot.forEach((userSnapshot) => {
    const userData = userSnapshot.val();
    if (userData.handle === handle) {
      const userId = userSnapshot.key;
      update(ref(db, `users/${userId}`), { isAdmin: !currentIsAdmin });
    }
  });
}

export async function deleteUserInDB(handle) {
  const usersRef = ref(db, 'users');
  const usersSnapshot = await get(usersRef);

  usersSnapshot.forEach((userSnapshot) => {
    const userData = userSnapshot.val();
    if (userData.handle === handle) {
      const userId = userSnapshot.key;
      remove(ref(db, `users/${userId}`));
    }
  });
}

export async function fetchUsersFromDB() {
  const usersRef = ref(db, 'users');
  const usersSnapshot = await get(usersRef);
  const usersData = [];

  usersSnapshot.forEach((userSnapshot) => {
    usersData.push(userSnapshot.val());
  });

  return usersData;
}







