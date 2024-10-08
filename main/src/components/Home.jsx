import { useEffect, useState } from 'react';
import { getPosts, getUsers } from '../services/posts.service';
import { Box, Spacer, chakra } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react'
import { keyframes } from '@emotion/react';
import './Home.css';

const boxStyle = {
 
        bg: '#ca6702',
        blur: '5px',
        color: '	#e9d8a6',
        fontWeight: 'bold',
        p: 2,
        borderRadius: 'md',
        filter: 'drop-shadow(0 0 0.75rem #333)',

};

const boxStyle2 = { 
    bg: '#0a9396',
    blur: '5px',
    color: 'darkgray',
    fontWeight: 'bold',
    p: 2,
    borderRadius: 'md',
    filter: 'drop-shadow(0 0 0.75rem #333)',
    m: 5,
};

const headerStyle = {
    color: '#005f73',
    fontSize: '3xl',
    fontWeight: 'bold',
    textAlign: 'center',
    bg: '#e9d8a6',
    p: 2,
    borderRadius: 'md',
    filter: 'drop-shadow(0 0 0.75rem #333)',
    m: 5,
    letterSpacing: '2px', 
};

const headerStyle2 = {  
    color: '	#0a9396',
    textShadow: '2px 2px 4px #ca6702',
    fontSize: '3xl',
    textAlign: 'center',
    p: 2,
    borderRadius: 'md',
    filter: 'drop-shadow(0 0 0.75rem #f4cccc)',
    m: 2,
};



const animateText = keyframes`
0% {
    opacity: 1;
    transform: translateY(0);
}
100% {
    opacity: 0;
    transform: translateY(20px);

}
`;

const headerStyle3 = {
    color: '#0a9396',
    textShadow: '2px 2px 4px #e9d8a6',
    fontSize: '3xl',
    textAlign: 'center',
    p: 2,
    borderRadius: 'md',
    m: 3,
    animation: `${animateText} 1s ease-in-out`,
};

const spacerStyle = {
    h: '20px',
};


export default function Home() {
    const [postCount, setPostCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [topPosts, setTopPosts] = useState([]);

    
    useEffect(() => {
        fetchCounts();
        fetchTopPosts();
    }, []);

    const fetchCounts = async () => {
        const posts = await getPosts();
        const users = await getUsers();

        setPostCount(posts.length);
        setUserCount(users.length);
    };

    const fetchTopPosts = async () => {
        try {
            const posts = await getPosts();
            const sortedPosts = posts
                .slice()
                .sort((a, b) => (a[1].replies ? Object.keys(a[1].replies).length : 0) - (b[1].replies ? Object.keys(b[1].replies).length : 0))
                .reverse();
            const top10Posts = sortedPosts.slice(0, 10);
            setTopPosts(top10Posts);
        } catch (error) {
            console.error('Error fetching top posts:', error);
        }
    };
 
    return (
        <div>
            <chakra.h1 sx={headerStyle}>TRAVEL PARADISE FORUM</chakra.h1>
            <chakra.p sx={headerStyle2}>"Don't dream your life, live your dream!"</chakra.p>
                   <chakra.p sx={headerStyle3}>Welcome to the travel paradise forum. Here you can share your travel experiences, ask questions, and connect with other travel enthusiasts.</chakra.p>
            <Box sx={boxStyle} m={5}>users : {userCount} posts : {postCount} </Box>
            <Spacer sx={spacerStyle}/> 
            <Box  display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={4}>
                <Image boxSize='500px' src='https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='Travel' sx={{ border: '4px solid lightblue'}}/>
                <Image boxSize='500px' src='https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1966&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='Second Image' sx={{ border: '4px solid lightblue'}}/>
                <Image boxSize='500px' src='https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='Third Image' sx={{ border: '4px solid lightblue'}}/>
            </Box>
            <Box sx={boxStyle2}>
                <h2>Top 10 Posts with Most Replies</h2>
                {topPosts.map((post, index) => (
                    <div key={index}>
                        <p>{`Post ${index + 1}: ` + post[1].title}</p>
                        <p>{`Replies : ` + (post[1].replies ? Object.keys(post[1].replies).length : 0)}</p>
                        <br />
                    </div>
                ))}
            </Box>
            <div className="ocean">
                <div className="wave"></div>
                <div className="wave wave2"></div>
            </div>
        </div>
    );
}
