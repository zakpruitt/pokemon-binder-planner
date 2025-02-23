import React, { useState } from 'react';

function SearchPanel({ onCardSelect }) {
    const [query, setQuery] = useState('(rarity:"Illustration Rare" OR rarity:"Special Illustration Rare") AND set.id:sv1');
    const [results, setResults] = useState([]);

    // Perform a search against the Pokémon TCG API
    const handleSearch = async (e) => {
        e.preventDefault();
        const apiUrl = `https://api.pokemontcg.io/v2/cards?q=${query}`;
        try {
            const res = await fetch(apiUrl, {
                headers: {
                    'X-Api-Key': 'f716a344-07be-4012-b815-45112a60f7a4'
                }
            });
            const data = await res.json();
            setResults(data.data || []);
        } catch (error) {
            console.error("Error fetching cards:", error);
        }
    };

    return (
        <div>
            <h3>Search Cards</h3>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter search query"
                    style={{ width: '100%', padding: '8px' }}
                />
                <button type="submit" style={{ marginTop: '10px' }}>Search</button>
            </form>
            <div style={{ marginTop: '20px', maxHeight: '500px', overflowY: 'auto' }}>
                {results.map(card => (
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
