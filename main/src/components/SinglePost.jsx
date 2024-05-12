import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById, updatePost } from "../services/posts.service";
import { ref, remove, onValue, update, get, child } from 'firebase/database';
import { auth, db } from "../config/firebase-config";
import Post from "./Post";


export default function SinglePost() {
    const [post, setPost] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        return onValue(ref(db, `posts/${id}`), async snapshot => {
            const val = snapshot.val();
            if (val) {
                // Fetch the author's data
                const authorSnapshot = await get(child(ref(db, 'users'), val.author));
                const author = authorSnapshot.val();
                console.log('author', author);
    
                setPost({
                    ...val,
                    id,
                    author: author.handle, // Add the author's data to the post
                    likedBy: val.likedBy ? Object.keys(val.likedBy) : [],
                    createdOn: new Date(val.createdOn).toString(),
                });
            } else {
                setPost(null);
            }
        });
    }, [id]);

    const deletePost = async () => {
        try {
            await remove(ref(db, `posts/${id}`));
            await removeTagsFromPost(id);
    
            // Get the user by their handle
            const usersRef = ref(db, 'users');
            console.log(post)
            const userSnapshot = await get(child(usersRef, post.author)); // use post.author.handle as the user handle
    
            if (userSnapshot.exists()) {
                const user = userSnapshot.val();
    
                // Check if the user has this post in their posts object
                if (user.posts && user.posts[id]) {
                    // Remove the post ID from the user's posts object
                    console.log(post.author.handle)
                    await remove(ref(db, `users/${post.author}/posts/${id}`)); // use post.author.handle as the user handle
                }
            }
    
            setPost(null);
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const removeTagsFromPost = async (postId) => {
        const tagsRef = ref(db, 'tags');
        const tagsSnapshot = await get(tagsRef);
        if (tagsSnapshot.exists()) {
            const tags = tagsSnapshot.val();
            await Promise.all(Object.keys(tags).map(async (tag) => {
                const tagPostRef = ref(db, `tags/${tag}/${postId}`);
                const tagPostSnapshot = await get(tagPostRef);
                if (tagPostSnapshot.exists()) {
                    await remove(tagPostRef);
                }
                const tagRef = child(tagsRef, tag);
                const tagSnapshot = await get(tagRef);
                if (tagSnapshot.exists() && Object.keys(tagSnapshot.val()).length === 0) {
                    await remove(tagRef);
                }
            }));
        }
    };

    const deleteReply = async (replyId) => {
        try {
            await remove(ref(db, `replies/${replyId}`));
            fetchPost(); // Fetch the post again to update the replies
        } catch (error) {
            console.error('Error deleting reply:', error);
        }
    };

    const fetchPost = async () => {
        const fetchedPost = await getPostById(post.id);
        setPost(fetchedPost);
    };
    const editPost = async (postId, updatedPost) => {
        try {
            await updatePost(postId, updatedPost);
        } catch (error) {
            console.error('Error updating post:', error);
            throw error; 
        }
    };
    
    return (
        <div>
            <h1>Single Post</h1>
            {post ? <Post post={post} deletePost={deletePost} editPost={(updatedPost) => editPost(id, updatedPost)}
                deleteReply={deleteReply} fetchPost={fetchPost} isSingleView={true}/> : 'Post deleted successfully.'}
        </div>
    )
}