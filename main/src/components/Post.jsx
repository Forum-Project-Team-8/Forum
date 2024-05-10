import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { likePost, dislikePost, getPostById, addReply } from '../services/posts.service';
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

export default function Post({ post: initialPost }) {
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

    return (
        <div className="post">
            <p>{post.content}</p>
            <p>by {post.author}, {new Date(post.createdOn).toLocaleDateString('bg-BG')}</p>
            <Link to={`/posts/${post.id}`}>View</Link>
            {post?.likedBy.includes(userData?.handle)
                ? <button onClick={dislike}>Dislike</button>
                : <button onClick={like}>Like</button>
            }
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
    })
}