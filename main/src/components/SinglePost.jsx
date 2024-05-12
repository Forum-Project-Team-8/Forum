import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById, updatePost } from "../services/posts.service";
import { ref, remove, onValue, update } from 'firebase/database';
import { db } from "../config/firebase-config";
import Post from "./Post";


export default function SinglePost() {
    const [post, setPost] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        return onValue(ref(db, `posts/${id}`), snapshot => {
            const val = snapshot.val();
            if (val) {
                setPost({
                    ...val,
                    id,
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
            setPost(null);
        } catch (error) {
            console.error('Error deleting post:', error);
        }
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
                 /> : 'Post deleted successfully.'}
        </div>
    )
}