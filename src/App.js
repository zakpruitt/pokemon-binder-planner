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
        // Outer container that centers the layout
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            {/* Inner container with a max width, laid out horizontally */}
            <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', gap: '20px', padding: '20px' }}>

                {/* Left side: Binder Pages */}
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

                {/* Right side: Sticky Search Panel */}
                <div
                    style={{
                        flex: '1',
                        position: 'sticky',
                        top: '10px',
                        alignSelf: 'flex-start', // ensures sticky works relative to the parent
                    }}
                >
                    <SearchPanel
                        onCardSelect={(card) => {
                            if (selectedSlot) {
                                updateSlot(selectedSlot.pageIndex, selectedSlot.slotIndex, card);
                                setSelectedSlot(null);
                            } else {
                                alert('Please click a binder slot first.');
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
