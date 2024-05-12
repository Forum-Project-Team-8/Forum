import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getPostById } from "../services/posts.service";
import { ref, remove, onValue } from 'firebase/database';
import { db } from "../config/firebase-config";
import Post from "./Post";
//import { useHistory } from "react-router-dom";

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

    //const history = useHistory();

    const deletePost = async () => {
        try {
            await remove(ref(db, `posts/${id}`));
            setPost(null);
            //history.push('/posts'); // navigate to AllPosts view
        } catch (error) {
            console.error('Error deleting post:', error);
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

    return (
        <div>
            <h1>Single Post</h1>
            {post ? <Post post={post} deletePost={deletePost} deleteReply={deleteReply} fetchPost={fetchPost}/> : 'Post deleted successfully.'}
        </div>
    )
}