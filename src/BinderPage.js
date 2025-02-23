// src/BinderPage.js
import React from 'react';
import './BinderPage.css';

function BinderPage({ pageIndex, cards, onSlotClick }) {
    return (
        <div className="binder-page-container">
            <h2>Page {pageIndex + 1}</h2>
            <div className="binder-grid">
                {cards.map((card, idx) => (
                    <div
                        key={idx}
                        className="binder-slot"
                        onClick={() => onSlotClick(idx)}
                    >
                        {card ? (
                            <img
                                src={card.images.small}
                                alt={card.name}
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
