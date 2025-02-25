// src/BinderPage.js
import React, { useState } from 'react';
import './BinderPage.css';

function BinderPage({ pageIndex, cards, onSlotClick, selectedSlot, addPage, deletePage, calculatePageValue }) {
    const [hoveredCardIndex, setHoveredCardIndex] = useState(null);

    return (
        <div className="binder-page-container">
            <div className="binder-page-header">
                <h2 className="binder-page-title">Page {pageIndex + 1}</h2>
                <div className="page-buttons">
                    <button className="delete-page-button" onClick={deletePage}>−</button>
                    <button className="add-page-button" onClick={addPage}>+</button>
                    <button
                        className="value-page-button"
                        onClick={() => alert(`Total Page Value: $${calculatePageValue()}`)}
                    >
                        $
                    </button>
                </div>
            </div>

            <div className="binder-grid">
                {cards.map((card, idx) => (
                    <div
                        key={idx}
                        className={`binder-slot ${selectedSlot === idx ? 'selected' : ''}`}
                        onClick={() => onSlotClick(idx)}
                        onMouseEnter={() => setHoveredCardIndex(idx)}
                        onMouseLeave={() => setHoveredCardIndex(null)}
                    >
                        {card ? (
                            <>
                                <img src={card.images.small} alt={card.name} />
                                {hoveredCardIndex === idx && card.tcgplayer?.prices?.holofoil?.market && (
                                    <div className="card-price">${card.tcgplayer.prices.holofoil.market.toFixed(2)}</div>
                                )}
                            </>
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
