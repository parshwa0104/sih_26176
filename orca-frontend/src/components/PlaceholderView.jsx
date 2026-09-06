import { Compass } from 'lucide-react'
import './PlaceholderView.css'

export default function PlaceholderView({ label }) {
  return (
    <div className="placeholder-view glass-panel">
      <span className="placeholder-icon">
        <Compass size={22} strokeWidth={1.8} />
      </span>
      <h2>{label}</h2>
      <p>This module is part of the full ORCA platform and isn't wired up in this frontend prototype yet.</p>
    </div>
  )
}
