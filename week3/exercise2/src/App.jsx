import { ScientistDirectory } from './components/ScientistDirectory.jsx';

export default function App() {
  return (
    <main className="page-shell">
      <header className="page-heading">
        <p className="eyebrow">Week 3 · Exercise 2</p>
        <h1>Interactive Scientist Explorer</h1>
        <p className="page-intro">
          Search, compare, and explore the lives of six scientists and pioneers.
        </p>
      </header>

      <ScientistDirectory />
    </main>
  );
}
