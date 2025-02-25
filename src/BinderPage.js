// src/BinderPage.js
import React from 'react';
import './BinderPage.css';

function BinderPage({ pageIndex, cards, onSlotClick, selectedSlot, addPage, deletePage }) {
    return (
        <div className="binder-page-container">
            {/* Page Header with Title and Buttons */}
            <div className="binder-page-header">
                <h2 className="binder-page-title">Page {pageIndex + 1}</h2>
                <div className="page-buttons">
                    <button className="delete-page-button" onClick={deletePage}>−</button>
                    <button className="add-page-button" onClick={addPage}>+</button>
                </div>
            </div>

            {/* 3x3 Card Grid */}
            <div className="binder-grid">
                {cards.map((card, idx) => (
                    <div
                        key={idx}
                        className={`binder-slot ${selectedSlot === idx ? 'selected' : ''}`}
                        onClick={() => onSlotClick(idx)}
                    >
                        {card ? (
                            <img src={card.images.small} alt={card.name} />
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
