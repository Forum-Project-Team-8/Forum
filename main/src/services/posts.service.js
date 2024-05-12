import { ref, push, get, set, update, query, equalTo, orderByChild, orderByKey } from 'firebase/database';
import { db } from '../config/firebase-config';

export const addPost = async(author, title, content) => {
    const post = {
        author,
        title,
        content,
        createdOn: Date.now(),
    };
    console.dir(post);
    const result = await push(ref(db, 'posts'), post);
    return result.key;
};

export const getAllPosts = async(search) => {
    const snapshot = await get(ref(db, 'posts'));
    if (!snapshot.exists()) return [];

    return Object
        .entries(snapshot.val())
        .map(([key, value]) => {
            return {
                ...value,
                id: key,
                likedBy: value.likedBy ? Object.keys(value.likedBy) : [],
                createdOn: new Date(value.createdOn).toString(),
            }
        })
        .filter(t => t.content.toLowerCase().includes(search.toLowerCase()));
};

export const getPostById = async(id) => {
    const snapshot = await get(ref(db, `posts/${id}`));

    if (!snapshot.val()) throw new Error('Post with this id does not exist!');

    return {
        ...snapshot.val(),
        id,
        likedBy: snapshot.val().likedBy ? Object.keys(snapshot.val().likedBy) : [],
        createdOn: new Date(snapshot.val().createdOn).toString(),
    }
};

export const likePost = async(postId, handle) => {
    const updateVal = {};
    updateVal[`users/${handle}/likedPosts/${postId}`] = true;
    updateVal[`posts/${postId}/likedBy/${handle}`] = true;

    update(ref(db), updateVal);
};

export const dislikePost = async(postId, handle) => {
    const updateVal = {};
    updateVal[`users/${handle}/likedPosts/${postId}`] = null;
    updateVal[`posts/${postId}/likedBy/${handle}`] = null;

    update(ref(db), updateVal);
};

export const addReply = async(postId, content, author) => {
    const reply = {
        author,
        content,
        createdOn: Date.now(),
    };

    const result = await push(ref(db, `posts/${postId}/replies`), reply);
    console.log(result.key);
    return result.key;
};

export const getPosts = async () => {
    const snapshot = await get(ref(db, 'posts'));
    if (!snapshot.exists()) return [];

    return Object.entries(snapshot.val());
};

export const getUsers = async () => {
    const snapshot = await get(ref(db, 'users'));
    if (!snapshot.exists()) return [];

    return Object.entries(snapshot.val());
};

/* export const getPostByUser = async (handle) => {
    const snapshot = await get(ref(db, 'posts'));
    if (!snapshot.exists()) return [];

    return Object.entries(snapshot.val())
        .filter(([key, value]) => value.author === handle)
        .map(([key, value]) => {
            return {
                ...value,
                id: key,
                likedBy: value.likedBy ? Object.keys(value.likedBy) : [],
                createdOn: new Date(value.createdOn).toString(),
            };
        });
}; */

