// src/BackgroundAnimation.js
import React, { useEffect, useState } from 'react';
import './BackgroundAnimation.css';
import {SPRITE_URLS} from "./SpriteUrls";

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
