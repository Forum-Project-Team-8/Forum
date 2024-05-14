import { useState } from 'react';
import { Input, VStack } from '@chakra-ui/react'; // Import Chakra UI components
import UsersList from './UsersList';

const AdminPanel = () => {
    const [search, setSearch] = useState('');

    return (
        <VStack spacing={4} align="flex-start" p={4}>
            <UsersList search={search} />
        </VStack>
    );
};

export default AdminPanel;
