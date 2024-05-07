import { useEffect, useState } from "react"
import { getAllPosts } from "../services/posts.service";
import Post from "./Post";
import { useSearchParams } from "react-router-dom";
import { ref, push, get, set, update, query, equalTo, orderByChild, orderByKey, onChildChanged } from 'firebase/database';
import { db } from "../config/firebase-config";

export default function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search') || '';

    const setSearch = (value) => {
        setSearchParams({search: value});
    }

    useEffect(() => {
        getAllPosts(search).then(setPosts);
    }, [search]);

    useEffect(() => {
        return onChildChanged(ref(db, 'posts'), snapshot => {
            const value = snapshot.val();
            setPosts(posts => posts.map(t => {
                console.log(value);
                if (t.author === value.author && t.content === value.content) {
                    if (value.likedBy) {
                        t.likedBy = Object.keys(value.likedBy);
                    } else {
                        t.likedBy = [];
                    }

                    return t;
                } else {
                    return t;
                }
            }))
        });
    }, []);

    return (
        <div>
            <h1>All posts</h1>
            <label htmlFor="search">Search</label>
            <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" />
            {posts.map((post) => (
                <Post key={post.id} post={post}/>
            ))}

        </div>
    )
}