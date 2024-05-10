import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db } from '../config/firebase-config';

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





