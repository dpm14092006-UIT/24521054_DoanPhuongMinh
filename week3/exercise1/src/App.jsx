import DeveloperCard from './components/DeveloperCard'

const developer = {
  name: 'Alex Nguyen', title: 'Frontend Developer & Pro Gamer', gamerTag: 'PixelNinja',
  location: 'Ho Chi Minh City', rank: 'Diamond', experience: '3 years',
  summary: 'Tôi xây dựng ứng dụng web hiện đại, yêu thích React, UI/UX và eSports.',
  avatarUrl: 'https://i.pravatar.cc/160?img=12',
  skills: [
    { name: 'React 19', level: 'Advanced' },
    { name: 'JavaScript', level: 'Advanced' },
    { name: 'CSS Modules', level: 'Intermediate' },
    { name: 'Gaming', level: 'Pro' },
  ],
}

export default function App() {
  return <main className="page"><DeveloperCard developer={developer} /></main>
}
