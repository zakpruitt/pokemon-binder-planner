// src/App.js
import React, { useState } from 'react';
import BinderPage from './BinderPage';
import SearchPanel from './SearchPanel';

function App() {
    const [pages, setPages] = useState([Array(9).fill(null)]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const addPage = () => {
        setPages([...pages, Array(9).fill(null)]);
    };

    const updateSlot = (pageIndex, slotIndex, card) => {
        const newPages = pages.map((page, pIndex) =>
            pIndex === pageIndex
                ? page.map((slot, sIndex) => (sIndex === slotIndex ? card : slot))
                : page
        );
        setPages(newPages);
    };

    return (
        // Outer container centers the whole app
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
            {/* Inner container with fixed maxWidth */}
            <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', gap: '20px' }}>
                {/* Binder Section */}
                <div style={{ flex: '3' }}>
                    {pages.map((page, pageIndex) => (
                        <BinderPage
                            key={pageIndex}
                            pageIndex={pageIndex}
                            cards={page}
                            onSlotClick={(slotIndex) => setSelectedSlot({ pageIndex, slotIndex })}
                        />
                    ))}
                    <button onClick={addPage}>Add Page</button>
                </div>

                {/* Search Panel Section */}
                <div style={{ flex: '1' }}>
                    <SearchPanel
                        onCardSelect={(card) => {
                            if (selectedSlot) {
                                updateSlot(selectedSlot.pageIndex, selectedSlot.slotIndex, card);
                                setSelectedSlot(null);
                            } else {
                                alert("Please click a binder slot first.");
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
