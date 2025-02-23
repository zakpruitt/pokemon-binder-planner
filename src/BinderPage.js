import React from 'react';

function BinderPage({ pageIndex, cards, onSlotClick }) {
    return (
        <div style={{ marginBottom: '30px' }}>
            <h2>Page {pageIndex + 1}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {cards.map((card, idx) => (
                    <div
                        key={idx}
                        style={{
                            border: '1px solid #ccc',
                            padding: '10px',
                            height: '150px',
                            textAlign: 'center',
                            backgroundColor: '#f9f9f9',
                            cursor: 'pointer'
                        }}
                        onClick={() => onSlotClick(idx)}
                    >
                        {card ? (
                            <>
                                <img src={card.images.small} alt={card.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                <p>{card.name}</p>
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
