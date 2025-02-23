// src/SearchPanel.js
import React, { useState } from 'react';

const AVAILABLE_RARITIES = [
    '', // Means no filter
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
    { id: "sv1", name: "Scarlet & Violet" },
    { id: "svp", name: "Scarlet & Violet Black Star Promos" },
    { id: "sv2", name: "Paldea Evolved" },
    { id: "sve", name: "Scarlet & Violet Energies" },
    { id: "sv3", name: "Obsidian Flames" },
    { id: "sv3pt5", name: "151" },
    { id: "sv4", name: "Paradox Rift" },
    { id: "sv4pt5", name: "Paldean Fates" },
    { id: "sv5", name: "Temporal Forces" },
    { id: "sv6", name: "Twilight Masquerade" },
    { id: "sv6pt5", name: "Shrouded Fable" },
    { id: "sv7", name: "Stellar Crown" },
    { id: "sv8", name: "Surging Sparks" },
    { id: "sv8pt5", name: "Prismatic Evolutions" },
];

function SearchPanel({ onCardSelect }) {
    // Query builder states
    const [cardName, setCardName] = useState('');
    const [rarity, setRarity] = useState('');

    // The user-facing text in the Set field
    const [setSearch, setSetSearch] = useState('');
    // The actual set ID we’ll use in the query (once a user picks from suggestions)
    const [selectedSetId, setSelectedSetId] = useState('');

    const [orderBy, setOrderBy] = useState('set.id,number');
    const [results, setResults] = useState([]);

    // Whether to show the set suggestions dropdown
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Filter the sets based on user text in setSearch
    const filteredSets = AVAILABLE_SETS.filter((setObj) =>
        setObj.id.toLowerCase().includes(setSearch.toLowerCase()) ||
        setObj.name.toLowerCase().includes(setSearch.toLowerCase())
    );

    // Build the "q" parameter for the Pokémon TCG API
    const buildQueryString = () => {
        const parts = [];
        if (cardName.trim()) {
            // For spaces or special chars, do name:"Pikachu" style
            parts.push(`name:"${cardName}"`);
        }
        if (rarity.trim()) {
            parts.push(`rarity:"${rarity}"`);
        }
        // If we have a valid selectedSetId, use that
        if (selectedSetId) {
            parts.push(`set.id:${selectedSetId}`);
        }
        // Join each condition with AND
        return parts.join(' AND ');
    };

    // Handle search form submit
    const handleSearch = async (e) => {
        e.preventDefault();
        const q = buildQueryString();

        let apiUrl = 'https://api.pokemontcg.io/v2/cards';
        if (q) {
            apiUrl += `?q=${encodeURIComponent(q)}`;
        } else {
            apiUrl += '?';
        }
        // Always add orderBy
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

    // Handle user typing in the set field
    const handleSetSearchChange = (e) => {
        const val = e.target.value;
        setSetSearch(val);
        setShowSuggestions(true);
        // If they change the text after selecting, we clear out the old set ID
        setSelectedSetId('');
    };

    // When the user clicks on a suggestion
    const handleSetSuggestionClick = (setObj) => {
        // We store the set's ID for the query
        setSelectedSetId(setObj.id);
        // We display the set's name in the text field
        setSetSearch(setObj.name);
        // Hide the suggestions
        setShowSuggestions(false);
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: '#f7f7f7',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '15px'
        }}>
            <h2 style={{ marginTop: 0 }}>Search Cards</h2>

            {/* Query Builder Form */}
            <form onSubmit={handleSearch} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginBottom: '10px'
            }}>
                {/* Card Name */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label><strong>Card Name</strong></label>
                    <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="e.g. Pikachu"
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                {/* Rarity */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label><strong>Rarity</strong></label>
                    <select
                        value={rarity}
                        onChange={(e) => setRarity(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        {AVAILABLE_RARITIES.map((r) => (
                            <option key={r} value={r}>
                                {r || '(None)'}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Set Autocomplete */}
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <label><strong>Set</strong></label>
                    <input
                        type="text"
                        value={setSearch}
                        onChange={handleSetSearchChange}
                        placeholder="Type set ID or name (e.g. sv1, Paldea Evolved)"
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    {/* Suggestions Dropdown */}
                    {showSuggestions && filteredSets.length > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: '65px', // input height + margin
                            left: 0,
                            right: 0,
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            zIndex: 10,
                            maxHeight: '200px',
                            overflowY: 'auto'
                        }}>
                            {filteredSets.map((setObj) => (
                                <div
                                    key={setObj.id}
                                    onClick={() => handleSetSuggestionClick(setObj)}
                                    style={{
                                        padding: '8px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #eee'
                                    }}
                                    onMouseDown={(e) => e.preventDefault()}
                                    // prevents blur on input from closing the dropdown too soon
                                >
                                    <strong>{setObj.id}</strong> — {setObj.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Order By */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label><strong>Order By</strong></label>
                    <select
                        value={orderBy}
                        onChange={(e) => setOrderBy(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="set.id,number">Set + Number</option>
                        <option value="number">Number</option>
                        <option value="name">Name</option>
                    </select>
                </div>

                {/* Search Button */}
                <button type="submit" style={{
                    padding: '10px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '16px'
                }}>
                    Search
                </button>
            </form>

            {/* Search Results */}
            <div style={{ flex: 1, overflowY: 'auto', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
                {results.map((card) => (
                    <div
                        key={card.id}
                        style={{
                            display: 'flex',
                            marginBottom: '10px',
                            cursor: 'pointer',
                            backgroundColor: '#fff',
                            borderRadius: '4px',
                            padding: '8px',
                            border: '1px solid #ddd'
                        }}
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
