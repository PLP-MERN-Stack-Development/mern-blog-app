import React, { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = \"Search posts...\" }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type=\"text\"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            style={{
              width: '100%',
              padding: '12px 40px 12px 15px',
              border: '1px solid #ddd',
              borderRadius: '25px',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
          <span style={{
            position: 'absolute',
            right: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#666'
          }}>
            🔍
          </span>
        </div>
        
        <button
          type=\"submit\"
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '12px 20px',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '16px',
            whiteSpace: 'nowrap'
          }}
        >
          Search
        </button>
        
        {query && (
          <button
            type=\"button\"
            onClick={handleClear}
            style={{
              backgroundColor: '#666',
              color: 'white',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '16px',
              whiteSpace: 'nowrap'
            }}
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
