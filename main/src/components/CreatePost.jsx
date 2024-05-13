import { useContext, useState } from "react"
import { addPost } from "../services/posts.service"
import { AppContext } from "../context/AppContext";
import { updateUserPosts } from "../services/user.service";
import { Box, Button, FormControl, FormLabel, Heading, Input, Textarea } from "@chakra-ui/react";
import { ref, set, update, get, child } from "firebase/database";
import { db } from "../config/firebase-config";
import { Image } from "@chakra-ui/react";
import { color } from "framer-motion";
import FileUpload from './FileUpload'; 



export default function CreatePost() {
    const [post, setPost] = useState({
        title: '',
        content: '',
    });
    const { userData } = useContext(AppContext);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [validationMessage, setValidationMessage] = useState('');
    const [uploadedFileUrl, setUploadedFileUrl] = useState('');


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

        const postId = await addPost(userData.handle, post.title, post.content, tags, uploadedFileUrl);

        await addTagsToPost(postId, tags);
        await updateUserPosts(userData.handle, postId);
        setPost({
            title: '',
            content: '',
        });
        setTags([]); 
        setTagInput('');
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
        if (tags.length < 5 && tagInput !== '' && /^[a-z]+$/.test(tagInput)) {
            setTags([...tags, tagInput]);
            setTagInput('');
            setValidationMessage('');
        } else {
            setValidationMessage('Tags can only be lowercase');
            setTimeout(() => setValidationMessage(''), 1500);
            }
    };

    const handleFileUpload = (dataUrl) => {
        setUploadedFileUrl(dataUrl);
    };

    return (
        <div>
            <Box>
                <Heading>Create post</Heading>
                <FormControl>
                    <FormLabel textAlign={'center'} htmlFor="input-title">Title:</FormLabel>
                    <Input
                        type="text"
                        value={post.title}
                        onChange={(e) => updatePost(e.target.value, 'title')}
                        name="input-title"
                        id="input-title"
                    />
                </FormControl>
                <FormControl>
                    <FormLabel textAlign={'center'} htmlFor="input-content">Content:</FormLabel>
                    <Textarea
                        value={post.content}
                        onChange={(e) => updatePost(e.target.value, 'content')}
                        name="input-content"
                        id="input-content"
                        cols="30"
                        rows="10"
                    />
                </FormControl>
                <FileUpload onUpload={handleFileUpload} />
                <FormControl>
                    <FormLabel textAlign={'center'} htmlFor="input-tags">Tags:</FormLabel>
                    <Input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        name="input-tags"
                        id="input-tags"
                        disabled={tags.length >= 5}
                    />
                    <div>{validationMessage}</div>
                    <Button colorScheme="blue" onClick={addTag} disabled={tags.length >= 5}>Add Tag</Button>
                    {tags.length >= 5 && <p>Tags limit reached</p>}

                    {tags.map((tag, index) => (
                        <span key={index}>#{tag}</span>
                    ))}
                </FormControl>
                <Button colorScheme = "yellow" onClick={createPost}>Create</Button>
            </Box>
            <Box display="grid" gap={4} justifyContent="center">
                <Image
                    boxSize='500px'
                    src='https://images.unsplash.com/photo-1504542982118-59308b40fe0c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                    alt='Second Image'
                    sx={{ border: '4px solid #dbebe8', filter: 'drop-shadow(0 0 0.75rem #D4B590)' }}
                />
            </Box>
            
        </div>
    );

}
