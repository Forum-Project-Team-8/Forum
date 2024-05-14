import { useEffect, useState } from "react"
import { getAllPosts } from "../services/posts.service";
import Post from "./Post";
import { useSearchParams } from "react-router-dom";
import { ref, remove, onChildChanged } from 'firebase/database';
import { db } from "../config/firebase-config";
import './AllPosts.css';
import { Box, Heading, Input, Select } from "@chakra-ui/react";


export default function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search') || '';
    const [sortOption, setSortOption] = useState('username');

        const sortedPosts = [...posts].sort((a, b) => {
        switch (sortOption) {
            case 'username':
                return a.author.localeCompare(b.author);
            case 'dateAsc':
                return new Date(a.createdOn) - new Date(b.createdOn);
            case 'dateDesc':
                return new Date(b.createdOn) - new Date(a.createdOn);
                case 'latestActivity':
                    const aHasReplies = a.replies && Object.keys(a.replies).length > 0;
                    const bHasReplies = b.replies && Object.keys(b.replies).length > 0;
        
                    
                    if ((aHasReplies && bHasReplies) || (!aHasReplies && !bHasReplies)) {
                        const aLatest = a.replies ? Math.max(new Date(a.createdOn), ...Object.values(a.replies).map(reply => new Date(reply.createdOn))) : new Date(a.createdOn);
                        const bLatest = b.replies ? Math.max(new Date(b.createdOn), ...Object.values(b.replies).map(reply => new Date(reply.createdOn))) : new Date(b.createdOn);
                        return bLatest - aLatest;
                    }
                    
                    else if (aHasReplies && !bHasReplies) {
                        return -1;
                    }
                    
                    else if (!aHasReplies && bHasReplies) {
                        return 1;
                    }
                    break;
            case 'mostComments':
                const aComments = a.replies ? Object.keys(a.replies).length : 0;
                const bComments = b.replies ? Object.keys(b.replies).length : 0;
                return bComments - aComments;
            default:
                return 0;
        }
    });

    const setSearch = (value) => {
        setSearchParams({search: value});
    }

    useEffect(() => {
        getAllPosts(search).then(setPosts);
    }, [search]);

    return (
        <Box>
            <Heading>All posts</Heading>
            <Input
                type="text"
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
            />
            <Select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="username">Username</option>
                <option value="dateAsc">Date (oldest first)</option>
                <option value="dateDesc">Date (newest first)</option>
                <option value="latestActivity">Latest Activity</option>
                <option value="mostComments">Most Comments</option>
            </Select>
            {sortedPosts.map((post) => (
                <Post key={post.id} post={post}/>
            ))}
        </Box>
    );
}