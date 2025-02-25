// src/App.js
import React, { useState } from 'react';
import BinderPage from './BinderPage';
import SearchPanel from './SearchPanel';
import BackgroundAnimation from './BackgroundAnimation';
import './App.css'; // Make sure this has the new CSS below.
import pako from 'pako';

function App() {
    const [pages, setPages] = useState([Array(9).fill(null)]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    // For the Export Modal
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportData, setExportData] = useState('');

    // For the Import Modal
    const [showImportModal, setShowImportModal] = useState(false);
    const [importValue, setImportValue] = useState('');

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

    // Export binder data, compress with pako, then encode in base64
    const exportBinder = () => {
        try {
            const jsonString = JSON.stringify(pages);
            const compressed = pako.deflate(jsonString, { to: 'string' });
            const base64 = btoa(compressed);
            setExportData(base64);
            setShowExportModal(true);
        } catch (e) {
            alert('Error exporting binder: ' + e.message);
        }
    };

    // Import binder data from base64, decompress with pako
    const importBinder = () => {
        try {
            const compressed = atob(importValue.trim());
            const jsonString = pako.inflate(compressed, { to: 'string' });
            const importedPages = JSON.parse(jsonString);
            setPages(importedPages);
            setShowImportModal(false);
            setImportValue('');
            alert('Binder imported successfully!');
        } catch (e) {
            alert('Error importing binder: ' + e.message);
        }
    };

    return (
        <>
            <BackgroundAnimation />
            <div className="app-container">
                <div className="main-layout">
                    {/* LEFT: Binder pages + controls */}
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

                        {/* Controls row: Add Page | Export Binder, Import Binder */}
                        <div className="page-controls">
                            <button onClick={addPage}>Add Page</button>
                            <div className="divider"></div>
                            <button onClick={exportBinder}>Export Binder</button>
                            <button onClick={() => setShowImportModal(true)}>Import Binder</button>
                        </div>
                    </div>

                    {/* RIGHT: Search Panel */}
                    <div className="right-search-panel">
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

            {/* Export Modal */}
            {showExportModal && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h2>Export Binder</h2>
                        <p>Copy this code to save your binder:</p>
                        <textarea
                            readOnly
                            value={exportData}
                            onFocus={(e) => e.target.select()}
                        />
                        <div className="modal-actions">
                            <button onClick={() => setShowExportModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Import Modal */}
            {showImportModal && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h2>Import Binder</h2>
                        <p>Paste the code you exported previously:</p>
                        <textarea
                            value={importValue}
                            onChange={(e) => setImportValue(e.target.value)}
                        />
                        <div className="modal-actions">
                            <button onClick={importBinder}>Import</button>
                            <button onClick={() => setShowImportModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default App;
