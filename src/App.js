// src/App.js
import React, { useState } from 'react';
import BinderPage from './BinderPage';
import SearchPanel from './SearchPanel';
import BackgroundAnimation from './BackgroundAnimation';
import './App.css';

function App() {
    // Start with 2 pages instead of 1
    const [pages, setPages] = useState([
        Array(9).fill(null),
        Array(9).fill(null)
    ]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const addPageAt = (index) => {
        const newPages = [...pages];
        newPages.splice(index + 1, 0, Array(9).fill(null)); // Insert new page after the given index
        setPages(newPages);
    };

    const updateSlot = (pageIndex, slotIndex, card) => {
        const newPages = pages.map((page, pIndex) =>
            pIndex === pageIndex
                ? page.map((slot, sIndex) => (sIndex === slotIndex ? card : slot))
                : page
        );
        setPages(newPages);
    };

    const exportBinder = () => {
        const binderData = pages.map(page =>
            page.map(card =>
                card ? {
                    name: card.name,
                    set: card.set,
                    image: card.images.small,
                    price: card.tcgplayer?.prices?.holofoil?.market || "N/A"
                } : null
            )
        );

        navigator.clipboard.writeText(JSON.stringify(binderData))
            .then(() => alert("Binder exported to clipboard!"))
            .catch((err) => alert("Export failed: " + err));
    };

    const importBinder = () => {
        const data = prompt("Paste your binder data:");
        if (data) {
            try {
                const importedPages = JSON.parse(data);

                const formattedPages = importedPages.map(page =>
                    page.map(card =>
                        card
                            ? {
                                name: card.name,
                                set: card.set,
                                images: { small: card.image },
                                tcgplayer: { prices: { holofoil: { market: card.price } } }
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
            <BackgroundAnimation />
            <div className="app-container">
                <div className="main-layout">
                    <div className="left-section">
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
                                    addPage={() => addPageAt(pageIndex)}
                                />
                            ))}
                        </div>
                        <div className="controls">
                            <button onClick={exportBinder}>Export Binder</button>
                            <button onClick={importBinder}>Import Binder</button>
                        </div>
                    </div>
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
