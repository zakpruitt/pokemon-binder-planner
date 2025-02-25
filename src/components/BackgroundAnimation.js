// src/BackgroundAnimation.js
import React, { useState } from "react";
import "../styles/BackgroundAnimation.css";
import { SPRITE_URLS } from "../utils/SpriteUrls";

function BackgroundAnimation() {
    const getRandomSprite = () =>
        SPRITE_URLS[Math.floor(Math.random() * SPRITE_URLS.length)];

    const [spriteUrl] = useState(getRandomSprite);

    return (
        <div
            className="background-animation"
            style={{ backgroundImage: spriteUrl ? `url(${spriteUrl})` : "none" }}
        />
    );
}

export default BackgroundAnimation;
