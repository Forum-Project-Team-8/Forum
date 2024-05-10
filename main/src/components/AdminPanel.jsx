import { useState } from 'react';
import UsersList from './UsersList';

const AdminPanel = () => {
    const [search, setSearch] = useState('');

    return (
        <>
            <div>Show admin stuff</div>
            <label htmlFor="search">Search</label>
            <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" />
            <UsersList search={search} />
        </>
    );
};

export default AdminPanel;