// src/App.js
import React, { useState } from 'react';
import BinderPage from './BinderPage';
import SearchPanel from './SearchPanel';
import BackgroundAnimation from './BackgroundAnimation';
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

// Export the current binder as a JSON string to the clipboard
    const exportBinder = () => {
        const binderData = pages.map(page =>
            page.map(card =>
                card ? {
                    name: card.name,
                    set: card.set.name,  // Include the set name
                    image: card.images.small,
                    price: card.tcgplayer?.prices?.holofoil?.market || "N/A"
                } : null
            )
        );

        navigator.clipboard.writeText(JSON.stringify(binderData))
            .then(() => alert("Binder exported to clipboard!"))
            .catch((err) => alert("Export failed: " + err));
    };

// Import binder data by prompting the user for a JSON string
    const importBinder = () => {
        const data = prompt("Paste your binder data:");
        if (data) {
            try {
                const importedPages = JSON.parse(data);

                // Transform imported data into a compatible format
                const formattedPages = importedPages.map(page =>
                    page.map(card =>
                        card
                            ? {
                                name: card.name,
                                set: card.set,
                                images: { small: card.image }, // Ensure it's nested under `images`
                                tcgplayer: { prices: { holofoil: { market: card.price } } } // Reformat price structure
                            }
                            : null
                    )
                );

                setPages(formattedPages);
            } catch (e) {
                alert("Invalid data! Please check your input.");
            }
        }
    };




    return (
        <>
            {/* Animated background */}
            <BackgroundAnimation />
            <div className="app-container">
                <div className="main-layout">
                    {/* LEFT: Binder pages + Add Page and Import/Export buttons */}
                    <div className="left-section">
                        {/* Pages scroll area */}
                        <div className="pages-scroll-area">
                            {pages.map((page, pageIndex) => (
                                <BinderPage
                                    key={pageIndex}
                                    pageIndex={pageIndex}
                                    cards={page}
                                    selectedSlot={
                                        selectedSlot && selectedSlot.pageIndex === pageIndex
                                            ? selectedSlot.slotIndex
                                            : null
                                    }
                                    onSlotClick={(slotIndex) =>
                                        setSelectedSlot({ pageIndex, slotIndex })
                                    }
                                />
                            ))}
                        </div>
                        {/* Buttons below scroll area */}
                        <div className="controls">
                            <button onClick={addPage}>Add Page</button>
                            <button onClick={exportBinder}>Export Binder</button>
                            <button onClick={importBinder}>Import Binder</button>
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
