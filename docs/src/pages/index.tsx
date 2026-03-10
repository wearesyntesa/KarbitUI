import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import React from 'react'

const CubeIcon = (): React.ReactElement => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
    />
  </svg>
)

const CodeIcon = (): React.ReactElement => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
    />
  </svg>
)

const BoltIcon = (): React.ReactElement => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
    />
  </svg>
)

const ArrowRightIcon = (): React.ReactElement => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
)

const GitHubIcon = (): React.ReactElement => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

const features = [
  {
    title: 'Web Components',
    description:
      'Built on Lit v3 with Light DOM rendering. Works in any framework or vanilla HTML without Shadow DOM lock-in.',
    icon: CubeIcon,
  },
  {
    title: 'Framework Agnostic',
    description: 'First-class React wrappers via @lit/react. Vue and Svelte work with native custom elements.',
    icon: CodeIcon,
  },
  {
    title: 'Tree Shakeable',
    description: 'Import only what you need. Separate registration from definition for minimal bundle size.',
    icon: BoltIcon,
  },
]

function HeroSection(): React.ReactElement {
  const { siteConfig } = useDocusaurusContext()
  const version = siteConfig.customFields?.pkgVersion as string

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-neutral-50 via-white to-neutral-100/50 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900/50" />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '2rem 2rem',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <span className="w-1.5 h-1.5 bg-neutral-900 dark:bg-neutral-100" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            v{version} Now Available
          </span>
        </div>

        <h1 className="font-sans text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-6 max-w-4xl">
          Karbit<span className="text-red-600">UI</span>
        </h1>

        <p className="font-sans text-lg md:text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl mb-10 leading-relaxed">
          {siteConfig.tagline}. 78 Lit-based web components with Tailwind CSS styling, designed for React, Vue, Svelte,
          and vanilla HTML.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/docs/getting-started/installation"
            className="group inline-flex items-center gap-2 bg-neutral-900 hover:bg-black text-white! font-semibold uppercase tracking-wider text-xs px-6 py-3 transition-all duration-200 dark:bg-neutral-100 dark:hover:bg-white dark:text-neutral-900!"
          >
            Get Started
            <ArrowRightIcon />
          </Link>
          <Link
            to="/docs/components/overview"
            className="inline-flex items-center gap-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 font-semibold uppercase tracking-wider text-xs px-6 py-3 hover:border-neutral-900 hover:text-neutral-900 dark:hover:border-neutral-300 dark:hover:text-neutral-100 transition-all duration-200"
          >
            Browse Components
          </Link>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection(): React.ReactElement {
  return (
    <section className="border-y border-neutral-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-0.5 bg-neutral-400 dark:bg-neutral-600" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Features
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-800">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group bg-white dark:bg-neutral-950 p-6 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 mb-4 text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800">
                  <Icon />
                </div>
                <h3 className="font-sans text-base font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                  {feature.title}
                </h3>
                <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default function Home(): React.ReactElement {
  const { siteConfig } = useDocusaurusContext()

  return (
    <Layout
      title={siteConfig.title}
      description="Brutalist web components for modern interfaces. 78 Lit-based components with Tailwind CSS styling."
    >
      <main className="bg-white dark:bg-neutral-950">
        <HeroSection />
        <FeaturesSection />
      </main>
    </Layout>
  )
}
