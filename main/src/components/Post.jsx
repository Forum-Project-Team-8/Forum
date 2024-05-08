import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { likePost, dislikePost } from '../services/posts.service';
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Post({ post }) {
    const { userData } = useContext(AppContext);
    const [replyContent, setReplyContent] = useState('');
    const like = () => likePost(post.id, userData.handle);
    const dislike = () => dislikePost(post.id, userData.handle);
    const submitReply = (e) => {
        e.preventDefault();
        // Add code to submit the reply to the server
        // You can use a service function or make an API request here
        // Example: postReply(post.id, replyContent, userData.handle);
        setReplyContent('');
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