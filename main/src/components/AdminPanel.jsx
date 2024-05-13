// import { useState } from 'react';
// import UsersList from './UsersList';

// const AdminPanel = () => {
//     const [search, setSearch] = useState('');

//     return (
//         <>
//             <div>Show admin stuff</div>
//             <label htmlFor="search">Search</label>
//                         <UsersList search={search} />
//         </>
//     );
// };

// export default AdminPanel;

import { useState } from 'react';
import { Input, VStack } from '@chakra-ui/react'; // Import Chakra UI components
import UsersList from './UsersList';

const AdminPanel = () => {
    const [search, setSearch] = useState('');

    return (
        <VStack spacing={4} align="flex-start" p={4}>
            <div>Show admin stuff</div>
            <label htmlFor="search">Search:</label>
            <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                name="search"
                id="search"
                placeholder="Search users"
                variant="filled"
                bg="white"
                w="300px"
            />
            <UsersList search={search} />
        </VStack>
    );
};

export default AdminPanel;
