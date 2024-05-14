import { VStack } from '@chakra-ui/react'; 
import UsersList from './UsersList';

const AdminPanel = () => {
    

    return (
        <VStack spacing={4} align="flex-start" p={4}>
            <UsersList  />
        </VStack>
    );
};

export default AdminPanel;
