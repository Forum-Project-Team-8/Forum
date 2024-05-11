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

    return (
        <div>
            <h1>Single Post</h1>
            {post ? <Post post={post} deletePost={deletePost}  /> : 'Post deleted successfully.'}
        </div>
    )
}