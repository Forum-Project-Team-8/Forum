import { useEffect, useState } from 'react';
import { getPosts, getUsers } from '../services/posts.service'; // You'll need to implement these functions


export default function Home() {
    const [postCount, setPostCount] = useState(0);
    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
        fetchCounts();
    }, []);

    const fetchCounts = async () => {
        const posts = await getPosts();
        const users = await getUsers();

        setPostCount(posts.length);
        setUserCount(users.length);
    };

    return (
        <div>
            <h1>Home</h1>
            <p>Number of posts: {postCount}</p>
            <p>Number of users: {userCount}</p>
        </div>
    );
}