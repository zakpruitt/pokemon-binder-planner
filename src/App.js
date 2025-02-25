// src/App.js
import React, { useState } from 'react';
import BinderPage from './BinderPage';
import SearchPanel from './SearchPanel';
import BackgroundAnimation from './BackgroundAnimation';  // Import the new component
import './App.css';

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
        <>
            {/* Animated background goes here */}
            <BackgroundAnimation />
            <div className="app-container">
                <div className="main-layout">
                    {/* LEFT: Binder pages + Add Page button */}
                    <div className="left-section">
                        {/* Pages scroll area */}
                        <div className="pages-scroll-area">
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
                        {/* Button below scroll area */}
                        <div className="page-add-button">
                            <button onClick={addPage}>Add Page</button>
                        </div>
                    </div>
                    {/* RIGHT: Sticky Search Panel */}
                    <div className="right-search-panel">
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
        </>
    );
}

export default App;
