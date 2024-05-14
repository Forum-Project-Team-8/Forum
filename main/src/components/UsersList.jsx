import { useEffect, useState } from 'react';
import { Box, Button, Input, VStack, Heading } from '@chakra-ui/react';
import { toggleUserBlockInDB, toggleAdminStatusInDB, deleteUserInDB, fetchUsersFromDB } from '../services/user.service';

function UsersList() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);


    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const usersData = await fetchUsersFromDB();
      
            setUsers(usersData);
            setIsLoading(false);
          } catch (error) {
            console.error('Error fetching users:', error);
          }
        };
      
        fetchUsers();
      }, []);

    
    const handleSearch = () => {
        const results = users.filter(user => (user.handle === search || user.email === search));
        setSearchResults(results);
    };

    const deleteUser = async (handle) => {
        try {
          await deleteUserInDB(handle);
      
          setUsers(users.filter(user => user.handle !== handle));
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      };

    const toggleAdminStatus = async (handle, currentIsAdmin) => {
        try {
          await toggleAdminStatusInDB(handle, currentIsAdmin);
      
          setUsers(users.map(user => {
            if (user.handle === handle) {
              return { ...user, isAdmin: !currentIsAdmin };
            }
            return user;
          }));
        } catch (error) {
          console.error('Error toggling admin status:', error);
        }
      };

    const toggleUserBlock = async (handle, currentIsBlocked) => {
        try {
          await toggleUserBlockInDB(handle, currentIsBlocked);
      
          setUsers(users.map(user => {
            if (user.handle === handle) {
              return { ...user, isBlocked: !currentIsBlocked };
            }
            return user;
          }));
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
            {user.photoData ? (
    <img src={`data:image/jpg;base64,${user.photoData}`} style={{ width: '10%', maxWidth: '50%', display: 'block', margin: '0 auto', paddingTop: '15px'}} alt="User Photo" />
) : (
    <p>No profile photo available</p>
)}
        </Box>
    );

    return (
        <VStack align="stretch" spacing={4}>
            {(
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
