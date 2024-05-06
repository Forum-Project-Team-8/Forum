import { useContext, useState } from "react"
import { addPost } from "../services/posts.service"
import { AppContext } from "../context/AppContext";

export default function CreatePost() {
    const [post, setPost] = useState({
        content: '',
    });
    const { userData } = useContext(AppContext);

    const updatePost = (value, key) => {
        setPost({
            ...post,
            [key]: value,
        })
    }

    const createPost = async () => {
        if(post.content.length < 5) {
            return alert('Content must be at least 5 characters long');
        }

        await addPost(userData.handle, post.content);

        setPost({
            content: '',
        });
    };

    return (
        <div>
            <h1>Create post</h1>
            <label htmlFor="input-content">Content:</label><br />
            <textarea value={post.content} onChange={e => updatePost(e.target.value, 'content')} name="input-content" id="input-content" cols="30" rows="10"></textarea><br /><br />
            <button onClick={createPost}>Create</button>
        </div>
    )
}
