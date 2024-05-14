import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById, updatePost, deleteReplyInDB, deletePostInDB, fetchPostFromDB } from "../services/posts.service";
import { ref, remove, get, child } from 'firebase/database';
import { db } from "../config/firebase-config";
import Post from "./Post";


export default function SinglePost() {
    const [post, setPost] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchPost = async () => {
          const post = await fetchPostFromDB(id);
          setPost(post);
        };
      
        fetchPost();
      }, [id]);

    const deletePost = async () => {
        try {
          await deletePostInDB(id, post.author);
          await removeTagsFromPost(id);
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
          await deleteReplyInDB(post.id, replyId);
          fetchPost(); 
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
                {post ? <Post post={post} deletePost={deletePost} editPost={(updatedPost) => editPost(id, updatedPost)}
                deleteReply={deleteReply} fetchPost={fetchPost} isSingleView={true}/> :<b style={{ fontSize: '2em' }}>Post deleted successfully.</b>}
        </div>
    )
}