import { ref, push, get, set, update, child, remove } from 'firebase/database';
import { db } from '../config/firebase-config';

export const addPost = async(author, title, content, tags, photoUrl) => {
    const post = {
        author,
        title,
        content,
        tags,
        photoUrl,
        createdOn: Date.now(),
    };
    console.dir(post);
    const result = await push(ref(db, 'posts'), post);
    return result.key;
};

export const getAllPosts = async(search) => {
    const postsSnapshot = await get(ref(db, 'posts'));
    const tagsSnapshot = await get(ref(db, 'tags'));
    let posts = {};

    if (postsSnapshot.exists()) {
        posts = postsSnapshot.val();
    }

    let tagPosts = {};
    if (tagsSnapshot.exists()) {
        const tags = tagsSnapshot.val();
        const tagKeys = Object.keys(tags).filter(tag => tag.toLowerCase() === search.toLowerCase());
        if (tagKeys.length > 0) {
            const postIds = Object.keys(tags[tagKeys[0]]);
            postIds.forEach(postId => {
                if (posts[postId]) {
                    tagPosts[postId] = posts[postId];
                }
            });
        }
    }

    return Object
        .entries(posts)
        .map(([key, value]) => {
            return {
                ...value,
                id: key,
                likedBy: value.likedBy ? Object.keys(value.likedBy) : [],
                createdOn: new Date(value.createdOn).toString(),
            }
        })
        .filter(t => (t.content.toLowerCase().includes(search.toLowerCase())) || (t.title.toLowerCase().includes(search.toLowerCase()))
        || (t.author === search) || tagPosts[t.id]);
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

export const updatePost = async (postId, updatedPostData) => {
    const postRef = ref(db, `posts/${postId}`);
    try {
        await set(postRef, updatedPostData); 
        console.log("Post updated successfully");
    } catch (error) {
        console.error("Error updating post:", error);
        throw error;
    }
};

export const editReply = async(postId, replyId, content) => {
    const updatedReply = {
        content,
        updatedOn: Date.now(),
    };

    const replyRef = ref(db, `posts/${postId}/replies/${replyId}`);
    await update(replyRef, updatedReply);
    console.log("Reply updated successfully");
};

export const addTagsToPost = async (postId, tags) => {
    const tagsRef = ref(db, 'tags');
    tags.forEach(async (tag) => {
        const tagRef = child(tagsRef, tag);
        const tagSnapshot = await get(tagRef);
        if (tagSnapshot.exists()) {
            await update(tagRef, { [postId]: true });
        } else {
            await set(tagRef, { [postId]: true });
        }
    });
};

export const deleteReplyInDB = async (postId, replyId) => {
    try {
      await remove(ref(db, `posts/${postId}/replies/${replyId}`));
    } catch (error) {
      console.error('Error deleting reply in DB:', error);
      throw error; 
    }
  }

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