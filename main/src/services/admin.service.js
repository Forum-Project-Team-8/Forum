import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getAdminByHandle = (handle) => {

  return get(ref(db, `admins/${handle}`));
};

export const createAdminHandle = (firstname, lastname, handle, uid, email) => {

  return set(ref(db, `admins/${handle}`), { firstname, lastname, handle, uid, email, createdOn: new Date() })
};

export const getAdminData = (uid) => {

  return get(query(ref(db, 'admins'), orderByChild('uid'), equalTo(uid)));
};