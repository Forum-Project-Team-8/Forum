import { useEffect, useState } from 'react';
import { db } from "../config/firebase-config";
import { get, ref, update, remove, child } from 'firebase/database';
import { getPostById } from '../services/posts.service';
import { Box, Button, Input, VStack, Heading } from '@chakra-ui/react';

function UsersList() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const [showPosts, setShowPosts] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersSnapshot = await get(ref(db, 'users'));
                const usersData = [];

                usersSnapshot.forEach((userSnapshot) => {
                    usersData.push(userSnapshot.val());
                });

                setUsers(usersData);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const fetchUserPosts = async (handle) => {
        try {
            // Get the user by their handle
            const usersRef = ref(db, 'users');
            const userSnapshot = await get(child(usersRef, handle));

            if (!userSnapshot.exists()) {
                throw new Error('User with this handle does not exist!');
            }

            const user = userSnapshot.val();
            console.log('User:', user); // Debugging line

            // Get the user's posts by their IDs
            const postsRef = ref(db, 'posts');
            const postPromises = Object.keys(user.posts).map((postId) => get(child(postsRef, postId)));
            console.log('Post Promises:', postPromises); // Debugging line
            const postSnapshots = await Promise.all(postPromises);
            const posts = postSnapshots.map((postSnapshot) => postSnapshot.val());

            console.log('Posts:', posts); // Debugging line

            setUserPosts(posts);
            setShowPosts(true); // Show the posts after they're fetched
        } catch (error) {
            console.error('Error fetching user posts:', error);
        }
    };

    const handleSearch = () => {
        const results = users.filter(user => (user.handle === search || user.email === search));
        setSearchResults(results);
    };

    const deleteUser = async (handle) => {
        try {
            const usersRef = ref(db, 'users');
            const usersSnapshot = await get(usersRef);

            usersSnapshot.forEach((userSnapshot) => {
                const userData = userSnapshot.val();
                if (userData.handle === handle) {
                    const userId = userSnapshot.key;
                    remove(ref(db, `users/${userId}`));
                    setUsers(users.filter(user => user.handle !== handle));
                }
            });
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const toggleAdminStatus = async (handle, currentIsAdmin) => {
        try {
            const usersRef = ref(db, 'users');
            const usersSnapshot = await get(usersRef);

            usersSnapshot.forEach((userSnapshot) => {
                const userData = userSnapshot.val();
                if (userData.handle === handle) {
                    const userId = userSnapshot.key;
                    console.log(userSnapshot)
                    update(ref(db, `users/${userId}`), { isAdmin: !currentIsAdmin });
                    setUsers(users.map(user => {
                        if (user.handle === handle) {
                            return { ...user, isAdmin: !currentIsAdmin };
                        }
                        return user;
                    }));
                }
            });
        } catch (error) {
            console.error('Error toggling admin status:', error);
        }
    };

    const toggleUserBlock = async (handle, currentIsBlocked) => {
        try {
            const usersRef = ref(db, 'users');
            const usersSnapshot = await get(usersRef);

            usersSnapshot.forEach((userSnapshot) => {
                const userData = userSnapshot.val();
                if (userData.handle === handle) {
                    const userId = userSnapshot.key;
                    update(ref(db, `users/${userId}`), { isBlocked: !currentIsBlocked });
                    setUsers(users.map(user => {
                        if (user.handle === handle) {
                            return { ...user, isBlocked: !currentIsBlocked };
                        }
                        return user;
                    }));
                }
            });
        } catch (error) {
            console.error('Error toggling user lock:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const renderUser = (user, index) => (
        <Box key={index} border="1px" borderRadius="md" p={4} my={2}>
            <strong>Username:</strong> {user.handle}<br />
            <strong>First Name:</strong> {user.firstname}<br />
            <strong>Last Name:</strong> {user.lastname}<br />
            <strong>Email:</strong> {user.email}<br />
            <strong>User type:</strong> {user.isAdmin ? 'Admin' : 'Regular user'}<br />
            <strong>User ID:</strong> {user.uid}<br />
            <Button onClick={() => deleteUser(user.handle)}>Delete</Button>
            <Button onClick={() => toggleAdminStatus(user.handle, user.isAdmin)}>Toggle Admin</Button>
            <Button onClick={() => toggleUserBlock(user.handle, user.isBlocked)}>
                {user.isBlocked ? 'Unblock' : 'Block'}
            </Button>
            <Button onClick={() => fetchUserPosts(user.handle)}>Show Posts</Button>
            {user.photoData ? (
    <img src={`data:image/jpg;base64,${user.photoData}`} style={{ width: '10%', maxWidth: '50%', display: 'block', margin: '0 auto', paddingTop: '15px'}} alt="User Photo" />
) : (
    <p>No profile photo available</p>
)}
        </Box>
    );

    return (
        <VStack align="stretch" spacing={4}>
            {showPosts ? (
                userPosts && userPosts.map((post, index) => (
                    <div key={index}>
                        <p>{post.title}</p>
                        <p>{post.content}</p>
                    </div>
                ))
            ) : (
                <>
                    <Heading size="lg">Users List</Heading>
                    <Input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        type="text"
                        placeholder="Search"
                    />
                    <Button onClick={handleSearch}>Search</Button>
                    {searchResults.length > 0 ? (
                        searchResults.map(renderUser)
                    ) : (
                        users.map(renderUser)
                    )}
                </>
            )}
        </VStack>
    );
}

export default UsersList;
