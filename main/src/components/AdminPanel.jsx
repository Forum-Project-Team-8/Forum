import { useState } from 'react';
import UsersList from './UsersList';

const AdminPanel = () => {
    const [search, setSearch] = useState('');

    return (
        <>
            <div>Show admin stuff</div>
            <label htmlFor="search">Search</label>
                        <UsersList search={search} />
        </>
    );
};

export default AdminPanel;