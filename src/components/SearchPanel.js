// src/SearchPanel.js
import React, { useState } from 'react';
import '../styles/SearchPanel.css';

const AVAILABLE_RARITIES = [
    '',
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

const AVAILABLE_SETS = [
    { id: 'sv1', name: 'Scarlet & Violet' },
    { id: 'svp', name: 'Scarlet & Violet Black Star Promos' },
    { id: 'sv2', name: 'Paldea Evolved' },
    { id: 'sve', name: 'Scarlet & Violet Energies' },
    { id: 'sv3', name: 'Obsidian Flames' },
    { id: 'sv3pt5', name: '151' },
    { id: 'sv4', name: 'Paradox Rift' },
    { id: 'sv4pt5', name: 'Paldean Fates' },
    { id: 'sv5', name: 'Temporal Forces' },
    { id: 'sv6', name: 'Twilight Masquerade' },
    { id: 'sv6pt5', name: 'Shrouded Fable' },
    { id: 'sv7', name: 'Stellar Crown' },
    { id: 'sv8', name: 'Surging Sparks' },
    { id: 'sv8pt5', name: 'Prismatic Evolutions' },
];

function SearchPanel({ onCardSelect }) {
    const [cardName, setCardName] = useState('');
    const [rarity, setRarity] = useState('');
    const [setSearch, setSetSearch] = useState('');
    const [selectedSetId, setSelectedSetId] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [orderBy, setOrderBy] = useState('set.id,number');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filter sets by user input (matching ID or name)
    const filteredSets = AVAILABLE_SETS.filter(
        (s) =>
            s.id.toLowerCase().includes(setSearch.toLowerCase()) ||
            s.name.toLowerCase().includes(setSearch.toLowerCase())
    );

    const buildQueryString = () => {
        const parts = [];
        if (cardName.trim()) {
            parts.push(`name:"${cardName}"`);
        }
        if (rarity.trim()) {
            parts.push(`rarity:"${rarity}"`);
        }
        if (selectedSetId) {
            parts.push(`set.id:${selectedSetId}`);
        }
        return parts.join(' AND ');
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        const q = buildQueryString();
        let apiUrl = 'https://api.pokemontcg.io/v2/cards';
        if (q) {
            apiUrl += `?q=${encodeURIComponent(q)}`;
        } else {
            apiUrl += '?';
        }
        if (orderBy) {
            apiUrl += `&orderBy=${orderBy}`;
        }

        try {
            const res = await fetch(apiUrl, {
                headers: { 'X-Api-Key': 'YOUR_API_KEY_HERE' },
            });
            const data = await res.json();
            setResults(data.data || []);
        } catch (error) {
            console.error('Error fetching cards:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle typing in the Set field
    const handleSetSearchChange = (e) => {
        const val = e.target.value;
        setSetSearch(val);
        setShowSuggestions(true);
        setSelectedSetId('');
    };

    // User clicks a suggestion
    const handleSetSuggestionClick = (setObj) => {
        setSelectedSetId(setObj.id);
        setSetSearch(setObj.name);
        setShowSuggestions(false);
    };

    return (
        <div className="search-panel">
            <h2>Search Cards</h2>

            {/* Query Builder Form */}
            <form onSubmit={handleSearch}>
                {/* Card Name */}
                <div className="form-group">
                    <label>Card Name</label>
                    <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="e.g. Pikachu"
                    />
                </div>

                {/* Rarity */}
                <div className="form-group">
                    <label>Rarity</label>
                    <select
                        value={rarity}
                        onChange={(e) => setRarity(e.target.value)}
                    >
                        {AVAILABLE_RARITIES.map((r) => (
                            <option key={r} value={r}>
                                {r || '(None)'}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Set Autocomplete */}
                <div className="form-group set-container">
                    <label>Set</label>
                    <input
                        type="text"
                        value={setSearch}
                        onChange={handleSetSearchChange}
                        placeholder="Type set ID or name"
                    />
                    {showSuggestions && filteredSets.length > 0 && (
                        <div className="set-suggestions">
                            {filteredSets.map((s) => (
                                <div
                                    key={s.id}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => handleSetSuggestionClick(s)}
                                    className="suggestion"
                                >
                                    <strong>{s.id}</strong> — {s.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Order By */}
                <div className="form-group">
                    <label>Order By</label>
                    <select
                        value={orderBy}
                        onChange={(e) => setOrderBy(e.target.value)}
                    >
                        <option value="set.id,number">Set + Number</option>
                        <option value="number">Number</option>
                        <option value="name">Name</option>
                    </select>
                </div>

                {/* Search Button */}
                <button type="submit">Search</button>
            </form>

            {/* Loading indicator or Search Results */}
            {loading ? (
                <div className="loading-indicator">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="search-results">
                    {results.map((card) => (
                        <div
                            key={card.id}
                            className="search-result-item"
                            onClick={() => onCardSelect(card)}
                        >
                            <img src={card.images.small} alt={card.name} />
                            <div className="result-details">
                                <strong>{card.name}</strong>
                                <p>{card.number} - {card.rarity}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchPanel;
