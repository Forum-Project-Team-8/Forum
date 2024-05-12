import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { likePost, dislikePost, getPostById, addReply } from '../services/posts.service';

export default function Post({ post: initialPost, deletePost, editPost }) {
    const { userData } = useContext(AppContext);
    const [replyContent, setReplyContent] = useState('');
    const [post, setPost] = useState(initialPost);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(post.content);

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

    return (
        <div className="post">
            {isEditing ? (
                <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                />
            ) : (
                <p>{post.content}</p>
            )}
            <p>by {post.author}, {new Date(post.createdOn).toLocaleDateString('bg-BG')}</p>
            <Link to={`/posts/${post.id}`}>View</Link>
            {post?.likedBy.includes(userData?.handle)
                ? <button onClick={dislike}>Dislike</button>
                : <button onClick={like}>Like</button>
            }

            {userData && (userData.handle === post.author || userData.isAdmin) && (
                <>
                    <button onClick={handleDelete}>Delete</button>
                    {isEditing ? (
                        <button onClick={saveEdit}>Save</button>
                    ) : (
                        <button onClick={startEditing}>Edit</button>
                    )}
                </>
            )}

            <p>Likes: {post.likedBy.length}</p>
    
            {post.replies && Object.values(post.replies).map((reply, index) => (
                <div key={index}>
                    <p>{reply.content}</p>
                    <p>by {reply.author}, {new Date(reply.createdOn).toLocaleDateString('bg-BG')}</p>
                </div>
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
}
