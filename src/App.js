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
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
                style={{
                    maxWidth: '1200px',
                    width: '100%',
                    display: 'flex',
                    gap: '20px',
                    padding: '20px',
                }}
            >
                {/* LEFT: Binder pages + Add Page button */}
                <div style={{ flex: '3', display: 'flex', flexDirection: 'column' }}>
                    {/* Pages scroll area */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            maxHeight: 'calc(100vh - 120px)',
                        }}
                    >
                        {pages.map((page, pageIndex) => (
                            <BinderPage
                                key={pageIndex}
                                pageIndex={pageIndex}
                                cards={page}
                                onSlotClick={(slotIndex) =>
                                    setSelectedSlot({ pageIndex, slotIndex })
                                }
                            />
                        ))}
                    </div>

                    {/* Button below scroll area, so it won't overlap */}
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <button onClick={addPage}>Add Page</button>
                    </div>
                </div>

                {/* RIGHT: Sticky Search Panel */}
                <div
                    style={{
                        flex: '1',
                        position: 'sticky',
                        top: '20px',
                        alignSelf: 'flex-start',
                    }}
                >
                    <SearchPanel
                        onCardSelect={(card) => {
                            if (selectedSlot) {
                                updateSlot(
                                    selectedSlot.pageIndex,
                                    selectedSlot.slotIndex,
                                    card
                                );
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
