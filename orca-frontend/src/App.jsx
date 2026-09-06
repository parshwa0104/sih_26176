import { useState } from 'react'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import Greeting from './components/Greeting.jsx'
import StatCards from './components/StatCards.jsx'
import QueryPanel from './components/QueryPanel.jsx'
import MapCard from './components/MapCard.jsx'
import AgentStrip from './components/AgentStrip.jsx'
import AIInsights from './components/AIInsights.jsx'
import LiveConditions from './components/LiveConditions.jsx'
import RecentAlerts from './components/RecentAlerts.jsx'
import PlaceholderView from './components/PlaceholderView.jsx'
import { useInvestigation } from './hooks/useInvestigation.js'
import { navItems } from './data/mockData.js'
import PhoneLogin from './components/PhoneLogin.jsx'
import OTPVerification from './components/OTPVerification.jsx'
import OrcaEntryTransition from './components/OrcaEntryTransition.jsx'
import './components/auth.css'
import './App.css'

const STAGE = { PHONE: 'phone', OTP: 'otp', ENTRY: 'entry' }

export default function App() {
  const [activeNav, setActiveNav] = useState('home')
  const investigation = useInvestigation()
  const [stage, setStage] = useState(STAGE.PHONE)
  const [phone, setPhone] = useState('')
  const [authed, setAuthed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const activeLabel = navItems.find((n) => n.id === activeNav)?.label ?? ''

  if (!authed) {
    return (
      <div className="auth-shell">
        {stage === STAGE.PHONE && (
          <PhoneLogin onNext={(p) => { setPhone(p); setStage(STAGE.OTP) }} />
        )}
        {stage === STAGE.OTP && (
          <OTPVerification
            phone={phone}
            onBack={() => setStage(STAGE.PHONE)}
            onVerify={() => setStage(STAGE.ENTRY)}
          />
        )}
        {stage === STAGE.ENTRY && (
          <OrcaEntryTransition phone={phone} onComplete={() => setAuthed(true)} />
        )}
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />
      <div className="app-body">
        <Sidebar
          active={activeNav}
          onSelect={setActiveNav}
          collapsed={!sidebarOpen}
        />

        <main className="app-main">
          {activeNav === 'home' ? (
            <>
              <Greeting />
              <StatCards />

              <div className="dashboard-grid">
                <div className="dashboard-col-main">
                  <QueryPanel
                    phase={investigation.phase}
                    isInvestigating={investigation.isInvestigating}
                    onStart={investigation.start}
                    onReset={investigation.reset}
                  />
                  <MapCard investigation={investigation} />
                  <AgentStrip agentStatus={investigation.agentStatus} />
                </div>

                <div className="dashboard-col-side">
                  <AIInsights />
                  <LiveConditions />
                  <RecentAlerts />
                </div>
              </div>
            </>
          ) : (
            <PlaceholderView label={activeLabel} />
          )}
        </main>
      </div>
    </div>
  )
}
