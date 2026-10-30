import { DeveloperCard } from './components/DeveloperCard'

const skills = [
  { id: 'sk-1', name: 'React 19 Fiber', tier: 'Core' },
  { id: 'sk-2', name: 'JavaScript ES6+', tier: 'Advanced' },
  { id: 'sk-3', name: 'CSS Modules', tier: 'Core' },
  { id: 'sk-4', name: 'Pro Gaming', tier: 'Competitive' },
]

const metrics = {
  commits: 512,
  vdomNodes: 0,
  a11yScore: 100,
}

export default function App() {
  return (
    <main className="page">
      <DeveloperCard
        fullName="Tran Vinh Khiem"
        role="Senior Systems Architect • UIT S3T • Pro Gamer"
        metrics={metrics}
        skills={skills}
      />
    </main>
  )
}
