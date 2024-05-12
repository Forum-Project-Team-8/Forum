import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { likePost, dislikePost, getPostById, addReply } from '../services/posts.service';
import { ref, remove } from 'firebase/database';
import { db } from '../config/firebase-config';
// export default function Post({ post }) {
//     const { userData } = useContext(AppContext);
//     const [replyContent, setReplyContent] = useState('');
//     const like = () => likePost(post.id, userData.handle);
//     const dislike = () => dislikePost(post.id, userData.handle);
//     const submitReply = async (e) => {
//         e.preventDefault();
//         try {
//             const replyId = await addReply(post.id, replyContent, userData.handle);
//             console.log(`Added reply with ID: ${replyId}`);
//             setReplyContent('');
//         } catch (error) {
//             console.error(error);
//         }
//     };

export default function Post({ post: initialPost, deletePost }) {
    const { userData } = useContext(AppContext);
    const [replyContent, setReplyContent] = useState('');
    const [post, setPost] = useState(initialPost);

    useEffect(() => {
        fetchPost();
    }, []);

    const fetchPost = async () => {
        const fetchedPost = await getPostById(initialPost.id);
        setPost(fetchedPost);
    };

    // const like = () => likePost(post.id, userData.handle);
    // const dislike = () => dislikePost(post.id, userData.handle);

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
        console.log(userData.isBlocked)
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

    return (
        <div className="post">
            <p>{post.title}</p>
            <p>by {post.author}, {new Date(post.createdOn).toLocaleDateString('bg-BG')}</p>
            <p>{post.content}</p>
            <Link to={`/posts/${post.id}`}>View</Link>
            <p></p>
            {post?.likedBy.includes(userData?.handle)
                ? <button onClick={dislike}>Dislike</button>
                : <button onClick={like}>Like</button>
            }

{userData && (userData.handle === post.author || userData.isAdmin) && (
                <button onClick={handleDelete}>Delete</button>
            )}

            <p>Likes: {post.likedBy.length}</p>
    
            {post.replies && Object.entries(post.replies).map(([replyId, reply]) => {
    console.log('userData.handle:', userData.handle);
    console.log('reply.author:', reply.author);
    return (
        <div key={replyId}>
            <p>{reply.content}</p>
            <p>by {reply.author}, {new Date(reply.createdOn).toLocaleDateString('bg-BG')}</p>
            {userData && (userData.handle === reply.author || userData.isAdmin) && (
                <button onClick={() => deleteReply(replyId)}>Delete Reply</button>
            )}
        </div>
    );
})}
    
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
        deletePost: PropTypes.func,
    })
}