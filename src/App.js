// src/App.js
import React, { useState } from 'react';
import BinderPage from './components/BinderPage';
import SearchPanel from './components/SearchPanel';
import BackgroundAnimation from './components/BackgroundAnimation';
import './styles/App.css';

function App() {
    const [pages, setPages] = useState([
        Array(9).fill(null),
        Array(9).fill(null)
    ]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const addPageAt = (index) => {
        const newPages = [...pages];
        newPages.splice(index + 1, 0, Array(9).fill(null));
        setPages(newPages);
    };

    const deletePageAt = (index) => {
        if (pages.length > 1) {
            const newPages = pages.filter((_, i) => i !== index);
            setPages(newPages);
        } else {
            alert("You must have at least one page.");
        }
    };

    const updateSlot = (pageIndex, slotIndex, card) => {
        const newPages = pages.map((page, pIndex) =>
            pIndex === pageIndex
                ? page.map((slot, sIndex) => (sIndex === slotIndex ? card : slot))
                : page
        );
        setPages(newPages);
    };

    const calculatePageValue = (pageIndex) => {
        return pages[pageIndex].reduce((total, card) => {
            const price = card?.tcgplayer?.prices?.holofoil?.market;
            return total + (price ? price : 0);
        }, 0).toFixed(2);
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

    const printBinder = () => {
        const printArea = document.getElementById("printable-binder");
        const scrollContainer = document.querySelector(".pages-scroll-area");

        if (!printArea) {
            alert("Error: Printable binder section not found.");
            return;
        }

        // Temporarily disable scrolling to allow full rendering
        const originalOverflow = scrollContainer.style.overflow;
        scrollContainer.style.overflow = "visible";

        // Trigger print
        window.print();

        // Restore original scrolling behavior after printing
        scrollContainer.style.overflow = originalOverflow;
    };

    return (
        <>
            <BackgroundAnimation />
            <div className="app-container">
                <div className="main-layout">
                    <div className="left-section">
                        <div className="pages-scroll-area">
                            <div id="printable-binder">
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
                                    deletePage={() => deletePageAt(pageIndex)}
                                    calculatePageValue={() => calculatePageValue(pageIndex)}
                                />
                            ))}
                            </div>
                        </div>
                        <div className="controls">
                            <button onClick={exportBinder}>Export Binder</button>
                            <button onClick={importBinder}>Import Binder</button>
                            <button onClick={printBinder}>Print Binder</button>
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
