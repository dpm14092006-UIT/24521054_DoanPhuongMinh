import { useId, useState } from 'react';

import { SMART_PEOPLE } from '../data/smartPeople.js';

export function ScientistDirectory({ initialData = SMART_PEOPLE }) {
  const searchId = useId();
  const minimumIqId = useId();
  const sortId = useId();

  const [people] = useState(() => [...initialData]);
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

  return (
    <section className="directory" aria-label="Pioneer Directory">
      <h2>Scientist &amp; Pioneer Directory</h2>

      <form
        className="filters"
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor={searchId}>Search by name</label>
        <input
          id={searchId}
          type="search"
          placeholder="Enter scientist name"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

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

        <label htmlFor={sortId}>Sort by</label>
        <select
          id={sortId}
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="iq-desc">IQ: High to Low</option>
          <option value="age-asc">Age: Youngest First</option>
        </select>
      </form>

      <ul className="scientist-list">
        {visiblePeople.map((person) => (
          <li key={person.id}>
            <h3>{person.name}</h3>
            <p>Age: {person.age}</p>
            <p>IQ: {person.iq}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
