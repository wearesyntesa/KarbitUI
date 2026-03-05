<script lang="ts">
  import type { Snippet } from 'svelte'
  import '../app.css'
  import '@wearesyntesa/karbit-ui/define'
  import { page } from '$app/state'

  let { children }: { children: Snippet } = $props()
  let dark = $state(false)

  const NAV = [
    { href: '/', label: 'Forms' },
    { href: '/feedback', label: 'Feedback' },
    { href: '/overlay', label: 'Overlay' },
    { href: '/data-display', label: 'Data Display' },
    { href: '/navigation', label: 'Navigation' },
    { href: '/layout', label: 'Layout' },
    { href: '/typography', label: 'Typography' },
  ]

  function isActive(href: string): boolean {
    return page.url.pathname === href
  }

  function toggleDark() {
    dark = !dark
  }
</script>

<div class={dark ? 'dark' : ''}>
  <div class="min-h-screen bg-white text-slate-900 dark:bg-zinc-950 dark:text-zinc-100">
    <header class="border-b border-gray-200 dark:border-zinc-800">
      <div class="px-6 flex items-center gap-4">
        <!-- Brand -->
        <span class="font-sans font-bold text-sm uppercase tracking-widest text-slate-900 dark:text-zinc-100 pr-6 border-r border-gray-200 dark:border-zinc-800 py-4 shrink-0">
          Karbit<span class="font-normal text-red-500">UI</span>
        </span>

        <!-- Navigation -->
        <nav class="flex items-center -mb-px overflow-x-auto min-w-0">
          {#each NAV as n}
            <a
              href={n.href}
              class="relative font-sans text-xs font-medium uppercase tracking-widest px-4 py-2 transition-colors shrink-0 {isActive(n.href)
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-400 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300'}"
            >
              {n.label}
              {#if isActive(n.href)}
                <span class="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 dark:bg-blue-400"></span>
              {/if}
            </a>
          {/each}
        </nav>

        <!-- Dark mode toggle -->
        <button
          type="button"
          class="ml-auto flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300 py-4 transition-colors shrink-0"
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          onclick={toggleDark}
        >
          {#if dark}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square">
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
          {:else}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          {/if}
          <span>{dark ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    </header>
    <main>
      {@render children()}
    </main>
  </div>
</div>
