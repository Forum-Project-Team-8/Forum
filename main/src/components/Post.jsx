import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { likePost, dislikePost, getPostById, addReply } from '../services/posts.service';
import { ref, remove } from 'firebase/database';
import { db } from '../config/firebase-config';
import { editReply } from '../services/posts.service';

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
            fetchPost(); // Fetch the post again to update the replies
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
                <p>{post.title}</p>
            )}
            <p>by {post.author}, {new Date(post.createdOn).toLocaleDateString('bg-BG')}</p>
            <p>{post.content}</p>
            <Link to={`/posts/${post.id}`}>View</Link>
            <p></p>
            {post?.likedBy.includes(userData?.handle)
                ? <button onClick={dislike}>Dislike</button>
                : <button onClick={like}>Like</button>
            }

{isSingleView && userData && (userData.handle === post.author || userData.isAdmin) && !userData.isBlocked && (
    <>
        <button onClick={handleDelete}>Delete</button>
        {userData && userData.handle === post.author && (
            isEditing ? (
                <button onClick={saveEdit}>Save</button>
            ) : (
                <button onClick={startEditing}>Edit</button>
            )
        )}
    </>
)}

            <p>Likes: {post.likedBy.length}</p>
    
            {post.replies && Object.entries(post.replies).map(([replyId, reply]) => {
    return (
        <div key={replyId}>
            <p>{isEditingReply && editedReplyId === replyId ? (
                <textarea
                    value={editedReply}
                    onChange={(e) => setEditedReply(e.target.value)}
                />
            ) : (
                reply.content
            )}</p>
            <p>by {reply.author}, {new Date(reply.createdOn).toLocaleDateString('bg-BG')}</p>
            {userData && userData.handle === reply.author && !userData.isBlocked && (
                <>
                    <button onClick={() => deleteReply(replyId)}>Delete Reply</button>
                    {isEditingReply && editedReplyId === replyId ? (
                        <button onClick={() => saveEditReply(replyId)}>Save</button>
                    ) : (
                        <button onClick={() => startEditingReply(replyId, reply.content)}>Edit</button>
                    )}
                </>
            )}
        </div>
    );
})}

{isSingleView && post.tags && post.tags.map((tag, index) => (
                <span key={index}>#{tag}{index !== post.tags.length - 1 && ' '}</span>
            ))}
    
            <form onSubmit={submitReply}>
                <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                />
                <button type="submit">Reply</button>
            </form>
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
