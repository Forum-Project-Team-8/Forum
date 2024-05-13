import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { likePost, dislikePost, getPostById, addReply } from '../services/posts.service';
import { ref, remove } from 'firebase/database';
import { db } from '../config/firebase-config';
import { editReply } from '../services/posts.service';
import { Button, Heading } from '@chakra-ui/react';

const contentPost = {
    color: '#005f73',
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: '#e9d8a6',
    borderRadius: '1rem',
    boxShadow: '0 0 10px #ca6702',
    margin: '1rem',

}

export default function Post({ post: initialPost, deletePost, editPost, isSingleView }) {
    const { userData } = useContext(AppContext);
    const [replyContent, setReplyContent] = useState('');
    const [post, setPost] = useState(initialPost);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(post.content);
    const [isEditingReply, setIsEditingReply] = useState(false);
    const [editedReply, setEditedReply] = useState('');
    const [editedReplyId, setEditedReplyId] = useState(null);


    useEffect(() => {
        fetchPost();
        console.log('Post:', post);
    }, []);

    const fetchPost = async () => {
        const fetchedPost = await getPostById(initialPost.id);
        setPost(fetchedPost);
    };

    const like = async () => {
        await likePost(post.id, userData.handle);
        fetchPost();
    };
    
    const dislike = async () => {
        await dislikePost(post.id, userData.handle);
        fetchPost();
    };

    const submitReply = async (e) => {
        e.preventDefault();
        if (userData.isBlocked) {
            console.error('Cannot add reply: User is blocked.');
            return;
        }
        try {
            const replyId = await addReply(post.id, replyContent, userData.handle);
            console.log(`Added reply with ID: ${replyId}`);
            setReplyContent('');
            fetchPost(); 
        } catch (error) {
            console.error(error);
        }
    };

    const deleteReply = async (replyId) => {
        try {
            await remove(ref(db, `posts/${post.id}/replies/${replyId}`));
            fetchPost(); 
            console.dir(post.replies)
        } catch (error) {
            console.error('Error deleting reply:', error);
        }
    };

    const handleDelete = () => {
        deletePost(post.id);
    };

    const startEditing = () => {
        setIsEditing(true);
    };

    const saveEdit = async () => {
        const updatedPost = { ...post, content: editedContent };
        await editPost(updatedPost);
        setIsEditing(false);
        fetchPost();
    };

    const startEditingReply = (replyId, content) => {
        setEditedReplyId(replyId);
        setEditedReply(content);
        setIsEditingReply(true);
    };
    
    const saveEditReply = async (replyId) => {
                await editReply(post.id, replyId, editedReply);
        setIsEditingReply(false);
        fetchPost();
    };

    return (
        <div className="post">
            {isEditing ? (
                <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                />
            ) : (
                <Heading color={'#0a9396'}>{post.title}</Heading>
            )}
            <p>by {post.author}, {new Date(post.createdOn).toLocaleDateString('bg-BG')}</p>
            <Heading sx={contentPost}>{post.content}</Heading>
            <Link to={`/posts/${post.id}`}>View</Link>
            <p></p>
            {post?.likedBy.includes(userData?.handle)
                ? <Button onClick={dislike} colorScheme="yellow">Dislike</Button>
                : <Button onClick={like} colorScheme="green">Like</Button>
            }

            {isSingleView && userData && (userData.handle === post.author || userData.isAdmin) && !userData.isBlocked && (
                <>
                    <Button onClick={handleDelete} colorScheme="red">Delete</Button>
                    {userData && userData.handle === post.author && (
                        isEditing ? (
                            <Button onClick={saveEdit} colorScheme="blue">Save</Button>
                        ) : (
                            <Button onClick={startEditing} colorScheme="blue">Edit</Button>
                        )
                    )}
                </>
            )}

            <Button onClick={like} colorScheme="green">{`Likes: ${post.likedBy.length}`}</Button>
            <Button colorScheme="blue">{`Replies: ${post.replies?Object.entries(post.replies).length : 0}`}</Button>

            {isSingleView && post.replies && Object.entries(post.replies).map(([replyId, reply]) => {
                return (
                    <div key={replyId}>
                        <p>{isEditingReply && editedReplyId === replyId ? (
                            <textarea
                                value={editedReply}
                                onChange={(e) => setEditedReply(e.target.value)}
                                style={{ height: '200px' }} 
                            />
                        ) : (
                            reply.content
                        )}</p>
                        <p>by {reply.author}, {new Date(reply.createdOn).toLocaleDateString('bg-BG')}</p>
                        {userData && userData.handle === reply.author && !userData.isBlocked && (
                            <>
                                <Button onClick={() => deleteReply(replyId)} colorScheme="red">Delete Reply</Button>
                                {isEditingReply && editedReplyId === replyId ? (
                                    <Button onClick={() => saveEditReply(replyId)} colorScheme="blue">Save</Button>
                                ) : (
                                    <Button onClick={() => startEditingReply(replyId, reply.content)} colorScheme="blue">Edit</Button>
                                )}
                            </>
                        )}
                    </div>
                );
            })}

            {isSingleView && post.tags && post.tags.map((tag, index) => (
                <span key={index}>#{tag}{index !== post.tags.length - 1 && ' '}</span>
            ))}

{isSingleView && (
    <form onSubmit={submitReply}>
        <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            style={{ height: '200px' }} // Set the height to make it bigger
        />
        <br />
        <Button type="submit" colorScheme="blue">Reply</Button>
    </form>
)}
        </div>
    )
}

Post.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.string,
        author: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        createdOn: PropTypes.string,
        likedBy: PropTypes.array,
    }),
    deletePost: PropTypes.func,
    editPost: PropTypes.func,
    isSingleView: PropTypes.bool,
}
