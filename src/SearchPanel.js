// src/SearchPanel.js
import React, { useState } from 'react';

function SearchPanel({ onCardSelect }) {
    // State for the query builder fields
    const [cardName, setCardName] = useState('');
    const [rarity, setRarity] = useState('');
    const [setId, setSetId] = useState('');
    const [orderBy, setOrderBy] = useState('set.id,number');
    const [results, setResults] = useState([]);

    // A small list of rarities (you can expand this from the API docs)
    const rarities = [
        '', // empty means "no rarity filter"
        'Common',
        'Uncommon',
        'Rare',
        'Rare Holo',
        'Rare Holo V',
        'Rare Holo VMAX',
        'Illustration Rare',
        'Special Illustration Rare',
        'Rare Secret',
    ];

    // Build the "q" parameter for the API
    const buildQueryString = () => {
        const parts = [];
        if (cardName.trim()) {
            // if user typed "Pikachu" (with possible spaces), do name:"Pikachu"
            parts.push(`name:"${cardName}"`);
        }
        if (rarity.trim()) {
            parts.push(`rarity:"${rarity}"`);
        }
        if (setId.trim()) {
            parts.push(`set.id:${setId}`);
        }

        // Join each condition with AND
        // If user doesn't enter anything, this returns an empty string
        return parts.join(' AND ');
    };

    // Perform the search
    const handleSearch = async (e) => {
        e.preventDefault();
        const q = buildQueryString();

        // Construct the URL with or without "q"
        let apiUrl = 'https://api.pokemontcg.io/v2/cards';
        // If there's a query, append ?q=..., else we just do ?orderBy=...
        if (q) {
            apiUrl += `?q=${encodeURIComponent(q)}`;
        } else {
            apiUrl += '?';
        }
        // Then always add orderBy
        if (orderBy) {
            apiUrl += `&orderBy=${orderBy}`;
        }

        try {
            const res = await fetch(apiUrl, {
                headers: {
                    'X-Api-Key': 'YOUR_API_KEY_HERE'
                }
            });
            const data = await res.json();
            setResults(data.data || []);
        } catch (error) {
            console.error("Error fetching cards:", error);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Query Builder Form */}
            <form onSubmit={handleSearch} style={{ marginBottom: '10px' }}>
                <div style={{ marginBottom: '5px' }}>
                    <label>Card Name: </label>
                    <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="e.g. Pikachu"
                        style={{ marginLeft: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '5px' }}>
                    <label>Rarity: </label>
                    <select
                        value={rarity}
                        onChange={(e) => setRarity(e.target.value)}
                        style={{ marginLeft: '5px' }}
                    >
                        {rarities.map((r) => (
                            <option key={r} value={r}>
                                {r || '(None)'}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ marginBottom: '5px' }}>
                    <label>Set ID: </label>
                    <input
                        type="text"
                        value={setId}
                        onChange={(e) => setSetId(e.target.value)}
                        placeholder="e.g. sv1"
                        style={{ marginLeft: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '5px' }}>
                    <label>Order By: </label>
                    <select
                        value={orderBy}
                        onChange={(e) => setOrderBy(e.target.value)}
                        style={{ marginLeft: '5px' }}
                    >
                        <option value="set.id,number">Set + Number</option>
                        <option value="number">Number</option>
                        <option value="name">Name</option>
                    </select>
                </div>
                <button type="submit">Search</button>
            </form>

            {/* Search Results */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {results.map((card) => (
                    <div
                        key={card.id}
                        style={{ display: 'flex', marginBottom: '10px', cursor: 'pointer' }}
                        onClick={() => onCardSelect(card)}
                    >
                        <img
                            src={card.images.small}
                            alt={card.name}
                            style={{ width: '50px', height: 'auto', marginRight: '10px' }}
                        />
                        <div>
                            <strong>{card.name}</strong>
                            <p style={{ margin: 0 }}>{card.number} - {card.rarity}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchPanel;
