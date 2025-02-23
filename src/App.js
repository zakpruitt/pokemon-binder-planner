import React, { useState } from 'react';
import BinderPage from './BinderPage';
import SearchPanel from './SearchPanel';

function App() {
  // Each page is an array of 9 slots (initially empty, i.e. null)
  const [pages, setPages] = useState([Array(9).fill(null)]);
  // Stores the currently selected slot as { pageIndex, slotIndex }
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Append a new page (9 empty slots) to the binder
  const addPage = () => {
    setPages([...pages, Array(9).fill(null)]);
  };

  // Update a specific slot with the chosen card
  const updateSlot = (pageIndex, slotIndex, card) => {
    const newPages = pages.map((page, pIndex) =>
        pIndex === pageIndex
            ? page.map((slot, sIndex) => (sIndex === slotIndex ? card : slot))
            : page
    );
    setPages(newPages);
  };

  return (
      <div style={{ display: 'flex', padding: '20px' }}>
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
        <div style={{ flex: '1', marginLeft: '20px' }}>
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
  );
}

export default App;
