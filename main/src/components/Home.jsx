import { useEffect, useState } from 'react';
import { getPosts, getUsers } from '../services/posts.service'; // You'll need to implement these functions
import { Box, Spacer, chakra } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react'
import { keyframes } from '@emotion/react';
import './AllPosts.css';

const boxStyle = {
 
        bg: 'lightblue',
        blur: '5px',
        color: 'darkblue',
        fontWeight: 'bold',
        p: 2,
        borderRadius: 'md',
        filter: 'drop-shadow(0 0 0.75rem #333)',

};

const boxStyle2 = { 
    bg: 'lightblue',
    blur: '5px',
    color: 'darkgray',
    fontWeight: 'bold',
    p: 2,
    borderRadius: 'md',
    filter: 'drop-shadow(0 0 0.75rem #333)',
    m: 5,
};

const headerStyle = {
    color: 'darkblue',
    textShadow: '2px 2px 4px #000000',
    fontSize: '3xl',
    fontWeight: 'bold',
    textAlign: 'center',
    bg: 'lightblue',
    p: 2,
    borderRadius: 'md',
    filter: 'drop-shadow(0 0 0.75rem #333)',
    m: 5,
    letterSpacing: '2px', 
};

const headerStyle2 = {  
    color: 'darkblue',
    textShadow: '2px 2px 4px yellow',
    fontSize: '3xl',
    fontWeight: 'bold',
    textAlign: 'center',
    p: 2,
    borderRadius: 'md',
    filter: 'drop-shadow(0 0 0.75rem #444)',
    m: 5,
};



const animateText = keyframes`
    0% {
        opacity: 0;
        transform: translateY(20px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
`;

const headerStyle3 = {
    color: 'darkblue',
    textShadow: '2px 2px 4px yellow',
    fontSize: '3xl',
    textAlign: 'center',
    p: 2,
    borderRadius: 'md',
    filter: 'drop-shadow(0 0 0.75rem #222)',
    m: 5,
    animation: `${animateText} 1s ease-in-out`,
};

const spacerStyle = {
    h: '20px',
};


export default function Home() {
    const [postCount, setPostCount] = useState(0);
    const [userCount, setUserCount] = useState(0);

    
    useEffect(() => {
        fetchCounts();
    }, []);

    const fetchCounts = async () => {
        const posts = await getPosts();
        const users = await getUsers();

        setPostCount(posts.length);
        setUserCount(users.length);

        
    };

 
    return (
        <div>
            <chakra.h1 sx={headerStyle}>Travel Paradise Forum</chakra.h1>
            <chakra.p sx={headerStyle2}>"Don't dream your life, live your dream!"</chakra.p>
            <Spacer sx={spacerStyle}/> 
            <chakra.p sx={headerStyle3}>Welcome to the travel paradise forum. Here you can share your travel experiences, ask questions, and connect with other travel enthusiasts.</chakra.p>
            <Spacer sx={spacerStyle}/> 
            <Box  display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={4}>
                <Image boxSize='500px' src='https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='Travel' sx={{ border: '4px solid lightblue'}}/>
                <Image boxSize='500px' src='https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1966&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='Second Image' sx={{ border: '4px solid lightblue'}}/>
                <Image boxSize='500px' src='https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='Third Image' sx={{ border: '4px solid lightblue'}}/>
            </Box>
            <Box sx={boxStyle} m={5}>At this time number of posts are : {postCount}</Box>
            <Box sx={boxStyle} m={5}>At this time number of users are : {userCount}</Box>
            <div className="ocean">
                <div className="wave"></div>
                <div className="wave wave2"></div>
            </div>
        </div>
    );
}