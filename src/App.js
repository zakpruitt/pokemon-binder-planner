// src/App.js
import React, { useState, useCallback } from "react";
import BinderPage from "./components/BinderPage";
import SearchPanel from "./components/SearchPanel";
import BackgroundAnimation from "./components/BackgroundAnimation";
import "./styles/App.css";

const INITIAL_PAGE = () => Array(9).fill(null);

function App() {
    const [pages, setPages] = useState([INITIAL_PAGE(), INITIAL_PAGE()]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const addPageAt = useCallback((index) => {
        setPages((prevPages) => [
            ...prevPages.slice(0, index + 1),
            INITIAL_PAGE(),
            ...prevPages.slice(index + 1),
        ]);
    }, []);

    const deletePageAt = useCallback((index) => {
        setPages((prevPages) =>
            prevPages.length > 1 ? prevPages.filter((_, i) => i !== index) : prevPages
        );
    }, []);

    const updateSlot = useCallback((pageIndex, slotIndex, card) => {
        setPages((prevPages) =>
            prevPages.map((page, pIndex) =>
                pIndex === pageIndex
                    ? page.map((slot, sIndex) => (sIndex === slotIndex ? card : slot))
                    : page
            )
        );
    }, []);

    const calculatePageValue = useCallback((page) =>
            page.reduce(
                (total, card) =>
                    total + (card?.tcgplayer?.prices?.holofoil?.market || 0),
                0
            ).toFixed(2),
        []);

    const exportBinder = useCallback(() => {
        const binderData = pages.map((page) =>
            page.map((card) =>
                card
                    ? {
                        name: card.name,
                        set: card.set,
                        image: card.images.small,
                        price: card.tcgplayer?.prices?.holofoil?.market || "N/A",
                    }
                    : null
            )
        );

        navigator.clipboard.writeText(JSON.stringify(binderData))
            .then(() => alert("Binder exported to clipboard!"))
            .catch((err) => alert("Export failed: " + err));
    }, [pages]);

    const importBinder = useCallback(() => {
        const data = prompt("Paste your binder data:");
        if (!data) return;

        try {
            const importedPages = JSON.parse(data).map((page) =>
                page.map((card) =>
                    card
                        ? {
                            name: card.name,
                            set: card.set,
                            images: { small: card.image },
                            tcgplayer: { prices: { holofoil: { market: card.price } } },
                        }
                        : null
                )
            );
            setPages(importedPages);
        } catch {
            alert("Invalid data! Please check your input.");
        }
    }, []);

    const printBinder = useCallback(() => {
        const printArea = document.getElementById("printable-binder");
        const scrollContainer = document.querySelector(".pages-scroll-area");

        if (!printArea) {
            alert("Error: Printable binder section not found.");
            return;
        }

        const originalOverflow = scrollContainer.style.overflow;
        scrollContainer.style.overflow = "visible";

        window.print();

        scrollContainer.style.overflow = originalOverflow;
    }, []);

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
                                        selectedSlot={selectedSlot?.pageIndex === pageIndex ? selectedSlot.slotIndex : null}
                                        onSlotClick={(slotIndex) => setSelectedSlot({pageIndex, slotIndex})}
                                        addPage={() => addPageAt(pageIndex)}
                                        deletePage={() => deletePageAt(pageIndex)}
                                        calculatePageValue={() => calculatePageValue(page)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="controls">
                            <button onClick={exportBinder}>Export Binder</button>
                            <button onClick={importBinder}>Import Binder</button>
                            <button onClick={printBinder}>Print Binder</button>
                            <button
                                onClick={() => window.open("https://github.com/zakpruitt/pokemon-binder-planner", "_blank")}
                            >
                                GitHub Repo
                            </button>
                        </div>
                    </div>
                    <div className="right-search-panel">
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
        </>
    );
}

export default App;
