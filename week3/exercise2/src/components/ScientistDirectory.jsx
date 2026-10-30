import { SMART_PEOPLE } from '../data/smartPeople.js';

export function ScientistDirectory({ initialData = SMART_PEOPLE }) {
  return (
    <section className="directory" aria-label="Pioneer Directory">
      <h2>Scientist &amp; Pioneer Directory</h2>

      <ul>
        {initialData.map((person) => (
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
