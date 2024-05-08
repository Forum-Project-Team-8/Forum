import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getPostById } from "../services/posts.service";
import { ref, push, get, set, update, query, equalTo, orderByChild, orderByKey, onValue } from 'firebase/database';
import { db } from "../config/firebase-config";
import Post from "./Post";

export default function SinglePost() {
    const [post, setPost] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        return onValue(ref(db, `posts/${id}`), snapshot => {
            setPost({
                ...snapshot.val(),
                id,
                likedBy: snapshot.val().likedBy ? Object.keys(snapshot.val().likedBy) : [],
                createdOn: new Date(snapshot.val().createdOn).toString(),
            });
        });
    }, [id]);

    return (
        <div>
            <h1>Single Posts</h1>
            {post && <Post post={post} />}
        </div>
    )
}