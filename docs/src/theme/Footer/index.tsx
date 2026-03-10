import React from 'react'
import Link from '@docusaurus/Link'

const GitHubIcon = (): React.ReactElement => (
  <svg className="kb-footer__social-icon" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

const NpmIcon = (): React.ReactElement => (
  <svg className="kb-footer__social-icon" fill="currentColor" viewBox="0 0 24 24">
    <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
  </svg>
)

const MailIcon = (): React.ReactElement => (
  <svg className="kb-footer__social-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>
)

const ExternalIcon = (): React.ReactElement => (
  <svg className="kb-footer__arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
  </svg>
)

export default function Footer(): React.ReactElement {
  return (
    <footer className="kb-footer">
      <div className="kb-footer__inner">
        {/* Left column — Brand */}
        <div className="kb-footer__brand-col">
          <div className="kb-footer__brand">
            <span className="kb-footer__brand-karbit">Karbit</span>
            <span className="kb-footer__brand-ui">UI</span>
          </div>
          <p className="kb-footer__tagline">
            Brutalist web components for modern interfaces. Built on Lit v3 with Tailwind CSS styling.
          </p>
          <p className="kb-footer__built-by">
            A{' '}
            <a href="https://syntesa.net" target="_blank" rel="noopener noreferrer">
              Syntesa
            </a>{' '}
            project.
          </p>
        </div>

        {/* Middle column — Documentation links */}
        <div className="kb-footer__links-col">
          <h3 className="kb-footer__heading">Documentation</h3>
          <ul className="kb-footer__list">
            <li>
              <Link to="/docs/getting-started/installation">Installation</Link>
            </li>
            <li>
              <Link to="/docs/getting-started/setup-react">React Setup</Link>
            </li>
            <li>
              <Link to="/docs/getting-started/dark-mode">Dark Mode</Link>
            </li>
            <li>
              <Link to="/docs/design-system/overview">Design System</Link>
            </li>
            <li>
              <Link to="/docs/design-system/theming">Theming</Link>
            </li>
          </ul>
        </div>

        {/* Right column — Components + Connect */}
        <div className="kb-footer__links-col">
          <h3 className="kb-footer__heading">Components</h3>
          <ul className="kb-footer__list">
            <li>
              <Link to="/docs/category/forms">Forms</Link>
            </li>
            <li>
              <Link to="/docs/category/data-display">Data Display</Link>
            </li>
            <li>
              <Link to="/docs/category/feedback">Feedback</Link>
            </li>
            <li>
              <Link to="/docs/category/layout">Layout</Link>
            </li>
            <li>
              <Link to="/docs/category/overlay">Overlay</Link>
            </li>
          </ul>
        </div>

        {/* Far right column — Connect */}
        <div className="kb-footer__links-col">
          <h3 className="kb-footer__heading">Connect</h3>
          <ul className="kb-footer__list">
            <li></li>
            <li>
              <a href="https://www.npmjs.com/package/@wearesyntesa/karbit-ui" target="_blank" rel="noopener noreferrer">
                npm <ExternalIcon />
              </a>
            </li>
            <li>
              <a href="https://syntesa.net" target="_blank" rel="noopener noreferrer">
                Syntesa <ExternalIcon />
              </a>
            </li>
          </ul>

          <div className="kb-footer__social">
            <a
              href="https://www.npmjs.com/package/@wearesyntesa/karbit-ui"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="npm"
            >
              <NpmIcon />
            </a>
            <a href="mailto:contact@syntesa.net" aria-label="Email">
              <MailIcon />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="kb-footer__copyright">
        <span>&copy; {new Date().getFullYear()} SE LAB UNESA.</span>
      </div>
    </footer>
  )
}
