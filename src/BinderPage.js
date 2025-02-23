// src/BinderPage.js
import React from 'react';

function BinderPage({ pageIndex, cards, onSlotClick }) {
    // Define slot dimensions based on card size
    const slotWidth = 245;
    const slotHeight = 342;

    const slotStyle = {
        border: '1px solid #ccc',
        height: `${slotHeight}px`,
        width: `${slotWidth}px`,
        backgroundColor: '#f9f9f9',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    return (
        <div>
            <h2 style={{ textAlign: 'center' }}>Page {pageIndex + 1}</h2>
            {/* Set a fixed width for the grid container and reduce gap */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(3, ${slotWidth}px)`,
                    gap: '15px',
                    justifyContent: 'center',
                    margin: '0 auto'
                }}
            >
                {cards.map((card, idx) => (
                    <div
                        key={idx}
                        style={slotStyle}
                        onClick={() => onSlotClick(idx)}
                    >
                        {card ? (
                            <img
                                src={card.images.large}
                                alt={card.name}
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        ) : (
                            <p>Empty</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BinderPage;
