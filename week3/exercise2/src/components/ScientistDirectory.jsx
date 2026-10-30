import { useId, useRef, useState } from 'react';

import { SMART_PEOPLE } from '../data/smartPeople.js';

export function ScientistDirectory({ initialData = SMART_PEOPLE }) {
  const searchId = useId();
  const minimumIqId = useId();
  const sortId = useId();
  const searchRef = useRef(null);

  const [people, setPeople] = useState(() => [...initialData]);
  const [query, setQuery] = useState('');
  const [minIq, setMinIq] = useState(160);
  const [sortBy, setSortBy] = useState('iq-desc');

  const normalizedQuery = query.trim().toLowerCase();
  const visiblePeople = people
    .filter((person) => {
      const matchesName = person.name
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesIq = person.iq >= minIq;

      return matchesName && matchesIq;
    })
    .toSorted((first, second) =>
      sortBy === 'iq-desc'
        ? second.iq - first.iq
        : first.age - second.age,
    );

  function handleDelete(id) {
    searchRef.current?.focus();
    setPeople((currentPeople) =>
      currentPeople.filter((person) => person.id !== id),
    );
  }

  function handleReset() {
    setPeople([...initialData]);
    setQuery('');
    setMinIq(160);
    setSortBy('iq-desc');
    searchRef.current?.focus();
  }

  return (
    <section className="directory" aria-label="Pioneer Directory">
      <h2>Scientist &amp; Pioneer Directory</h2>

      <form
        className="filters"
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="filter-field">
          <label htmlFor={searchId}>Search by name</label>
          <input
            ref={searchRef}
            id={searchId}
            type="search"
            placeholder="Enter scientist name"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="filter-field">
          <label htmlFor={minimumIqId}>Minimum IQ</label>
          <input
            id={minimumIqId}
            type="number"
            min="0"
            step="1"
            value={minIq}
            onChange={(event) => {
              const value = event.target.valueAsNumber;
              setMinIq(Number.isNaN(value) ? 0 : value);
            }}
          />
        </div>

        <div className="filter-field">
          <label htmlFor={sortId}>Sort by</label>
          <select
            id={sortId}
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="iq-desc">IQ: High to Low</option>
            <option value="age-asc">Age: Youngest First</option>
          </select>
        </div>
      </form>

      <div className="results-heading">
        <p className="result-count" role="status" aria-live="polite" aria-atomic="true">
          Found {visiblePeople.length} of {people.length} pioneers
        </p>
      </div>

      {visiblePeople.length === 0 ? (
        <p className="empty-message">No matching scientists found.</p>
      ) : (
        <ul className="scientist-list">
          {visiblePeople.map((person) => (
            <li key={person.id}>
              <article className="scientist-card">
                <div className="scientist-card__heading">
                  <h3>{person.name}</h3>
                  <span className="iq-badge">IQ {person.iq}</span>
                </div>
                <p className="person-age">Age: {person.age}</p>
                <button
                  type="button"
                  className="delete-button"
                  aria-label={`Delete ${person.name}`}
                  onClick={() => handleDelete(person.id)}
                >
                  Delete
                </button>
              </article>
            </li>
          ))}
        </ul>
      )}

      <button type="button" className="reset-button" onClick={handleReset}>
        Reset Directory
      </button>
    </section>
  );
}
