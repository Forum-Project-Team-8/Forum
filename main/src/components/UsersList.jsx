import { useEffect, useState } from 'react';
import { db } from "../config/firebase-config";
import { get, ref, update, remove } from 'firebase/database';

function UsersList() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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
    <li key={index}>
      <strong>User ID:</strong> {user.uid}<br />
      <strong>Username:</strong> {user.handle}<br />
      <strong>First Name:</strong> {user.firstname}<br />
      <strong>Last Name:</strong> {user.lastname}<br />
      <strong>Email:</strong> {user.email}<br />
      <strong>isAdmin:</strong> {user.isAdmin ? 'Yes' : 'No'}<br />
      <button onClick={() => deleteUser(user.handle)}>Delete</button>
      <button onClick={() => toggleAdminStatus(user.handle, user.isAdmin)}>Toggle Admin</button>
      <button onClick={() => toggleUserBlock(user.handle, user.isBlocked)}>{user.isBlocked ? 'Unblock' : 'Block'}</button>
    </li>
  );

  return (
    <div>
      <h2>Users List</h2>
      <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search" />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {searchResults.length > 0 ? searchResults.map(renderUser) : users.map(renderUser)}
      </ul>
    </div>
  );
}

export default UsersList;
// import { useEffect, useState } from 'react';
// import { db } from "../config/firebase-config";
// import { get, set, ref, query, equalTo, orderByChild, update, remove } from 'firebase/database';

// function UsersList() {
//   const [users, setUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true); // New state variable to track loading state

//   useEffect(() => {
//     // Fetch user data from Firebase
//     const fetchUsers = async () => {
//       try {
//         const usersSnapshot = await get(ref(db, 'users'));

//         const usersData = [];

//         usersSnapshot.forEach((userSnapshot) => {
//           usersData.push(userSnapshot.val());
//         });

//         setUsers(usersData);
//         setIsLoading(false); // Set loading state to false after users are fetched
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const deleteUser = async (handle) => {
//     try {
//       const usersRef = ref(db, 'users');
//       const usersSnapshot = await get(usersRef);
  
//       usersSnapshot.forEach((userSnapshot) => {
//         const userData = userSnapshot.val();
//         if (userData.handle === handle) {
//           const userId = userSnapshot.key;
//           remove(ref(db, `users/${userId}`));
//           setUsers(users.filter(user => user.handle !== handle));
//         }
//       });
//     } catch (error) {
//       console.error('Error deleting user:', error);
//     }
//   };


// const toggleAdminStatus = async (handle, currentIsAdmin) => {
//     try {
//       const usersRef = ref(db, 'users');
//       const usersSnapshot = await get(usersRef);
  
//       usersSnapshot.forEach((userSnapshot) => {
//         const userData = userSnapshot.val();
//         if (userData.handle === handle) {
//           const userId = userSnapshot.key;
//           update(ref(db, `users/${userId}`), { isAdmin: !currentIsAdmin });
//           setUsers(users.map(user => {
//             if (user.handle === handle) {
//               return { ...user, isAdmin: !currentIsAdmin };
//             }
//             return user;
//           }));
//         }
//       });
//     } catch (error) {
//       console.error('Error toggling admin status:', error);
//     }
//   };
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h2>Users List</h2>
//       <ul>
//         {users.map((user, index) => (
//           <li key={index}>
//             <strong>User ID:</strong> {user.uid}<br />
//             <strong>Username:</strong> {user.handle}<br />
//             <strong>First Name:</strong> {user.firstname}<br />
//             <strong>Last Name:</strong> {user.lastname}<br />
//             <strong>Email:</strong> {user.email}<br />
//             <strong>isAdmin:</strong> {user.isAdmin ? 'Yes' : 'No'}<br />
//             <button onClick={() => deleteUser(user.handle)}>Delete</button>
//             <button onClick={() => toggleAdminStatus(user.handle, user.isAdmin)}>Toggle Admin</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default UsersList;


// import { useEffect, useState } from 'react';
// import { db } from "../config/firebase-config";
// import { get, set, ref, query, equalTo, orderByChild, update, remove } from 'firebase/database';



// function UsersList() {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     // Fetch user data from Firebase
//     const fetchUsers = async () => {
//       try {
//         const usersSnapshot = await get(ref(db, 'users'));

//         const usersData = [];

//         usersSnapshot.forEach((userSnapshot) => {
//           usersData.push(userSnapshot.val());
//         });

//         setUsers(usersData);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const deleteUser = async (uid) => {
//     try {
//       await remove(ref(db, `users/${uid}`));
//       setUsers(users.filter(user => user.uid !== uid));
//       console.log(`User with UID ${uid} has been deleted.`);
//     } catch (error) {
//       console.error('Error deleting user:', error);
//     }
//   };

//   const toggleAdminStatus = async (userId) => {
//     try {
//       const userRef = ref(db, `users/${userId}`);
//       const userSnapshot = await get(userRef);
  
//       // Check if user data exists
//       if (userSnapshot.exists()) {
//         const userData = userSnapshot.val();
  
//         // Toggle isAdmin status
//         await update(userRef, { isAdmin: !userData.isAdmin });
  
//         // Update local state to reflect changes
//         setUsers((prevUsers) =>
//           prevUsers.map((user) =>
//             user.uid === userId ? { ...user, isAdmin: !user.isAdmin } : user
//           )
//         );
//       } else {
//         console.error(`User with ID ${userId} not found.`);
//       }
//     } catch (error) {
//       console.error('Error toggling admin status:', error);
//     }
//   };
//   return (
//     <div>
//       <h2>Users List</h2>
//       <ul>
//         {users.map((user, index) => (
//           <li key={index}>
//             <strong>User ID:</strong> {user.uid}<br />
//             <strong>First Name:</strong> {user.firstname}<br />
//             <strong>Last Name:</strong> {user.lastname}<br />
//             <strong>Email:</strong> {user.email}<br />
//             <strong>isAdmin:</strong> {user.isAdmin ? 'Yes' : 'No'}<br />
//             <button onClick={() => toggleAdminStatus(user.uid)}>Toggle Admin Status</button>
//             <button onClick={() => {deleteUser(user.uid)}}>Delete</button>
//             {/* Add more user properties as needed */}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default UsersList;
