import React, { useState } from 'react';

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
        <div
            style={{
                // Let this container auto-size
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                padding: '15px',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <h2 style={{ margin: '0 0 10px', fontSize: '1.2rem', textAlign: 'center' }}>
                Search Cards
            </h2>

            {/* Query Builder Form */}
            <form
                onSubmit={handleSearch}
                style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}
            >
                {/* Card Name */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontWeight: '600', marginBottom: '4px', fontSize: '0.9rem' }}>
                        Card Name
                    </label>
                    <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="e.g. Pikachu"
                        style={{
                            padding: '6px 8px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            fontSize: '0.9rem',
                        }}
                    />
                </div>

                {/* Rarity */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontWeight: '600', marginBottom: '4px', fontSize: '0.9rem' }}>
                        Rarity
                    </label>
                    <select
                        value={rarity}
                        onChange={(e) => setRarity(e.target.value)}
                        style={{
                            padding: '6px 8px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            fontSize: '0.9rem',
                        }}
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
                    <label style={{ fontWeight: '600', marginBottom: '4px', fontSize: '0.9rem' }}>
                        Set
                    </label>
                    <input
                        type="text"
                        value={setSearch}
                        onChange={handleSetSearchChange}
                        placeholder="Type set ID or name"
                        style={{
                            padding: '6px 8px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            fontSize: '0.9rem',
                        }}
                    />
                    {showSuggestions && filteredSets.length > 0 && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '58px',
                                left: 0,
                                right: 0,
                                backgroundColor: '#fff',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                zIndex: 10,
                                maxHeight: '150px',
                                overflowY: 'auto',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                            }}
                        >
                            {filteredSets.map((s) => (
                                <div
                                    key={s.id}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => handleSetSuggestionClick(s)}
                                    style={{
                                        padding: '6px 8px',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        borderBottom: '1px solid #eee',
                                    }}
                                >
                                    <strong>{s.id}</strong> — {s.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Order By */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontWeight: '600', marginBottom: '4px', fontSize: '0.9rem' }}>
                        Order By
                    </label>
                    <select
                        value={orderBy}
                        onChange={(e) => setOrderBy(e.target.value)}
                        style={{
                            padding: '6px 8px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            fontSize: '0.9rem',
                        }}
                    >
                        <option value="set.id,number">Set + Number</option>
                        <option value="number">Number</option>
                        <option value="name">Name</option>
                    </select>
                </div>

                {/* Search Button */}
                <button
                    type="submit"
                    style={{
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        marginTop: '4px',
                    }}
                >
                    Search
                </button>
            </form>

            {/* Search Results */}
            {/* Constrain only the results area, so the panel doesn't overflow the screen */}
            <div
                style={{
                    maxHeight: '60vh', // adjust as desired
                    overflowY: 'auto',
                    marginTop: '6px',
                }}
            >
                {results.map((card) => (
                    <div
                        key={card.id}
                        style={{
                            display: 'flex',
                            marginBottom: '8px',
                            cursor: 'pointer',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '4px',
                            border: '1px solid #eee',
                            padding: '6px 8px',
                            alignItems: 'center',
                        }}
                        onClick={() => onCardSelect(card)}
                    >
                        <img
                            src={card.images.small}
                            alt={card.name}
                            style={{ width: '50px', height: 'auto', marginRight: '8px' }}
                        />
                        <div style={{ fontSize: '0.9rem' }}>
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
