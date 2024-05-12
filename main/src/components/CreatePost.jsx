import { useContext, useState } from "react"
import { addPost } from "../services/posts.service"
import { AppContext } from "../context/AppContext";
import { updateUserPosts } from "../services/user.service";
import { Box, Button, FormControl, FormLabel, Input, Textarea } from "@chakra-ui/react";
import { ref, set, update, get, child } from "firebase/database";
import { db } from "../config/firebase-config";

export default function CreatePost() {
    const [post, setPost] = useState({
        title: '',
        content: '',
    });
    const { userData } = useContext(AppContext);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');


    const updatePost = (value, key) => {
        setPost({
            ...post,
            [key]: value,
        })
    }
    const createPost = async () => {

        if (userData.isBlocked) {
            console.error('Cannot create post: User is blocked.');
            return;
        }
        if (post.title.length < 1 || post.title.length > 64) {
            return alert('Title must be between 16 and 64 characters long');
        }
    
        if (post.content.length < 5) {
            return alert('Content must be at least 5 characters long');
        }
    
        const postId = await addPost(userData.handle, post.title, post.content, tags);
        
        await addTagsToPost(postId, tags);
        await updateUserPosts(userData.handle, postId);
        setPost({
            title: '',
            content: '',
        });
        setTags([]); 
    };

    const addTagsToPost = async (postId, tags) => {
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

    const addTag = () => {
        if (tags.length < 5 && tagInput !== '') {
            setTags([...tags, tagInput]);
            setTagInput('');
        }
    };

    return (

        

     
            <Box>
                <h1>Create post</h1>
                <FormControl>
                    <FormLabel htmlFor="input-title">Title:</FormLabel>
                    <Input
                        type="text"
                        value={post.title}
                        onChange={(e) => updatePost(e.target.value, 'title')}
                        name="input-title"
                        id="input-title"
                    />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="input-content">Content:</FormLabel>
                    <Textarea
                        value={post.content}
                        onChange={(e) => updatePost(e.target.value, 'content')}
                        name="input-content"
                        id="input-content"
                        cols="30"
                        rows="10"
                    />
                </FormControl>
                <FormControl>
        <FormLabel htmlFor="input-tags">Tags:</FormLabel>
        <Input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            name="input-tags"
            id="input-tags"
            disabled={tags.length >= 5}
        />
        <Button onClick={addTag} disabled={tags.length >= 5}>Add Tag</Button>
        {tags.length >= 5 && <p>Tags limit reached</p>}
        <div>
            {tags.map((tag, index) => (
                <span key={index}>#{tag}</span>
            ))}
        </div>
    </FormControl>
                <Button onClick={createPost}>Create</Button>
            </Box>
        );
    
}
