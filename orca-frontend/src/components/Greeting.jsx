import { Waves } from 'lucide-react'
import { currentUser } from '../data/mockData.js'
import './Greeting.css'

function timeGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Greeting() {
  return (
    <div className="greeting">
      <div>
        <h1 className="greeting-title">
          <Waves size={22} strokeWidth={2.2} />
          {timeGreeting()}, {currentUser.name.split(' ')[0]}
        </h1>
        <p className="greeting-subtitle">Your AI-powered co-pilot for a healthier and more resilient ocean.</p>
      </div>
      <div className="greeting-status">
        <span className="status-dot" />
        System Online
      </div>
    </div>
  )
}
