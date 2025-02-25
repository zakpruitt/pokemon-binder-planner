// src/BackgroundAnimation.js
import React, { useEffect, useState } from 'react';
import './BackgroundAnimation.css';

const SPRITE_URLS = [
    'https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/venusaur.png',
    // Add more URLs as desired
];

function BackgroundAnimation() {
    const [spriteUrl, setSpriteUrl] = useState('');

    useEffect(() => {
        const randomUrl = SPRITE_URLS[Math.floor(Math.random() * SPRITE_URLS.length)];
        setSpriteUrl(randomUrl);
    }, []);

    return (
        <div
            className="background-animation"
            style={{ backgroundImage: spriteUrl ? `url(${spriteUrl})` : 'none' }}
        ></div>
    );
}

export default BackgroundAnimation;
