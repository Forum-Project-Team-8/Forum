import { useContext, useState } from "react"
import { addPost } from "../services/posts.service"
import { AppContext } from "../context/AppContext";
import { updateUserPosts } from "../services/user.service";
import { Box, Button, FormControl, FormLabel, Input, Textarea } from "@chakra-ui/react";

export default function CreatePost() {
    const [post, setPost] = useState({
        title: '',
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
        if (post.title.length < 1 || post.title.length > 64) {
            return alert('Title must be between 16 and 64 characters long');
        }

        if (post.content.length < 5) {
            return alert('Content must be at least 5 characters long');
        }

        const postId = await addPost(userData.handle, post.title, post.content);

        await updateUserPosts(userData.handle, postId);
        setPost({
            title: '',
            content: '',
        });
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
                <Button onClick={createPost}>Create</Button>
            </Box>
        );
    
}
