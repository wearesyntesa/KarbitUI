import { useState } from 'react'
import { Route, Routes, Link, useLocation } from 'react-router-dom'
import { FormsPage } from './pages/forms-page'
import { FeedbackPage } from './pages/feedback-page'
import { OverlayPage } from './pages/overlay-page'
import { DataDisplayPage } from './pages/data-display-page'

const NAV = [
  { to: '/', label: 'Forms' },
  { to: '/feedback', label: 'Feedback' },
  { to: '/overlay', label: 'Overlay' },
  { to: '/data-display', label: 'Data Display' },
]

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

function NavLink({ to, label }: { to: string; label: string }) {
  const { pathname } = useLocation()
  const active = pathname === to
  return (
    <Link
      to={to}
      className={`relative font-sans text-xs font-medium uppercase tracking-widest px-4 py-2 transition-colors ${
        active
          ? 'text-blue-600 dark:text-blue-400'
          : 'text-slate-400 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300'
      }`}
    >
      {label}
      {active && (
        <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 dark:bg-blue-400" />
      )}
    </Link>
  )
}

export default function App() {
  const [dark, setDark] = useState(false)

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-white text-slate-900 dark:bg-zinc-950 dark:text-zinc-100">
        <header className="border-b border-gray-200 dark:border-zinc-800">
          <div className="px-6 flex items-center">
            {/* Brand */}
            <span className="font-sans font-bold text-sm uppercase tracking-widest text-slate-900 dark:text-zinc-100 pr-6 mr-6 border-r border-gray-200 dark:border-zinc-800 py-4">
              Karbit<span className="font-normal text-red-500">UI</span>
            </span>

            {/* Navigation */}
            <nav className="flex items-center -mb-px">
              {NAV.map((n) => (
                <NavLink key={n.to} to={n.to} label={n.label} />
              ))}
            </nav>

            {/* Dark mode toggle */}
            <button
              type="button"
              onClick={() => setDark(!dark)}
              className="ml-auto flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300 py-4 transition-colors"
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
              <span>{dark ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<FormsPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/overlay" element={<OverlayPage />} />
            <Route path="/data-display" element={<DataDisplayPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
