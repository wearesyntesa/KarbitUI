<script lang="ts">
  const SERVICES = [
    { name: 'Auth', status: 'healthy', latency: 12, region: 'ap-southeast-1' },
    { name: 'API Gateway', status: 'degraded', latency: 340, region: 'ap-southeast-1' },
    { name: 'Database', status: 'healthy', latency: 4, region: 'ap-southeast-2' },
    { name: 'Cache', status: 'healthy', latency: 1, region: 'ap-southeast-1' },
    { name: 'Queue', status: 'down', latency: 0, region: 'ap-southeast-3' },
  ]

  const TABS_CONFIG = [
    { label: 'Overview', panel: 'System is operating normally with 4 of 5 services healthy.' },
    { label: 'Metrics', panel: 'P99 latency: 340ms · Throughput: 12k rps · Error rate: 0.02%' },
    { label: 'Logs', panel: 'No critical errors in the last 24 hours.' },
  ]

  const CARD_VARIANTS = ['elevated', 'outline', 'filled'] as const
  const TAG_VARIANTS = ['solid', 'outline', 'subtle'] as const
  const TAG_SIZES = ['sm', 'md', 'lg'] as const
  const AVATAR_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const
  const KBD_SIZES = ['sm', 'md', 'lg'] as const

  const TREE_DATA = [
    {
      id: 'src', label: 'src', children: [
        { id: 'components', label: 'components', children: [
          { id: 'button', label: 'Button.svelte' },
          { id: 'input', label: 'Input.svelte' },
          { id: 'select', label: 'Select.svelte' },
        ]},
        { id: 'utils', label: 'utils', children: [
          { id: 'helpers', label: 'helpers.ts' },
          { id: 'constants', label: 'constants.ts' },
        ]},
        { id: 'app', label: 'App.svelte' },
      ],
    },
    {
      id: 'public', label: 'public', children: [
        { id: 'favicon', label: 'favicon.ico' },
      ],
    },
    { id: 'package', label: 'package.json' },
  ]

  const TIMELINE_ITEMS = [
    { id: '1', title: 'Project created', description: 'Repository initialized and dependencies installed', timestamp: '2025-01-15', status: 'success' },
    { id: '2', title: 'Alpha release', description: 'First internal release with core components', timestamp: '2025-03-01', status: 'success' },
    { id: '3', title: 'Beta release', description: 'Public beta with documentation site', timestamp: '2025-06-15', status: 'warning', active: true },
    { id: '4', title: 'Stable release', description: 'Production-ready v1.0', timestamp: '2025-09-01', status: 'default' },
  ]

  const SERVER_DETAILS = [
    { label: 'Host', value: 'ap-southeast-1.compute.internal' },
    { label: 'Status', value: 'Running' },
    { label: 'CPU', value: '4 vCPU' },
    { label: 'Memory', value: '16 GB' },
    { label: 'Uptime', value: '45 days' },
  ]

  let collapseOpen = $state(false)
</script>

<div class="max-w-3xl mx-auto p-8 space-y-10">
  <h1 class="text-xl font-bold uppercase tracking-widest border-b border-gray-200 dark:border-zinc-700 pb-4">
    Data Display
  </h1>

  <!-- Table -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Table</h2>
    <kb-table sortable searchable variant="simple" caption="Services" size="md">
      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Status</th>
            <th data-sort="number">Latency (ms)</th>
            <th>Region</th>
          </tr>
        </thead>
        <tbody>
          {#each SERVICES as s}
            <tr>
              <td>{s.name}</td>
              <td>{s.status}</td>
              <td>{s.latency}</td>
              <td>{s.region}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </kb-table>
  </section>

  <!-- Card -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Card</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each CARD_VARIANTS as v}
        <kb-card variant={v}>
          <div class="p-4">
            <p class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300 mb-1">{v}</p>
            <p class="font-semibold text-sm">Card title</p>
            <p class="text-xs text-slate-500 dark:text-zinc-300 mt-1">Some card description content here.</p>
          </div>
        </kb-card>
      {/each}
    </div>
  </section>

  <!-- List -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">List</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <p class="text-xs text-slate-400 dark:text-zinc-300 mb-2">plain (unordered)</p>
        <kb-list variant="plain">
          <kb-list-item>Deploy to staging</kb-list-item>
          <kb-list-item>Run smoke tests</kb-list-item>
          <kb-list-item>Promote to production</kb-list-item>
        </kb-list>
      </div>
      <div>
        <p class="text-xs text-slate-400 dark:text-zinc-300 mb-2">ordered</p>
        <kb-list variant="ordered">
          <kb-list-item>Checkout feature branch</kb-list-item>
          <kb-list-item>Open pull request</kb-list-item>
          <kb-list-item>Merge after approval</kb-list-item>
        </kb-list>
      </div>
    </div>
  </section>

  <!-- Accordion -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Accordion</h2>
    <kb-accordion-group>
      <kb-accordion>
        <span slot="trigger">What is KarbitUI?</span>
        A brutalist design system built on Lit web components with Tailwind CSS and a Chakra UI-like API.
      </kb-accordion>
      <kb-accordion>
        <span slot="trigger">How does it work with Svelte?</span>
        Through native custom element support — Svelte auto-detects complex props and sets them as properties, with SvelteKit file-based routing.
      </kb-accordion>
      <kb-accordion>
        <span slot="trigger">Is it production ready?</span>
        It is currently in active development. Breaking changes may occur between minor versions.
      </kb-accordion>
    </kb-accordion-group>
  </section>

  <!-- Tabs -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Tabs</h2>
    <kb-tabs variant="line" size="md">
      {#each TABS_CONFIG as t, i}
        <span slot={`tab-${i}`}>{t.label}</span>
      {/each}
      {#each TABS_CONFIG as t, i}
        <div slot={`panel-${i}`} class="p-4 text-sm text-slate-600 dark:text-zinc-300">
          {t.panel}
        </div>
      {/each}
    </kb-tabs>
  </section>

  <!-- Tags -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Tags</h2>
    <div class="flex flex-wrap gap-2">
      {#each TAG_VARIANTS as v}
        <kb-tag variant={v}>{v}</kb-tag>
      {/each}
      {#each TAG_SIZES as s}
        <kb-tag size={s} variant="outline">{s}</kb-tag>
      {/each}
      <kb-tag variant="subtle" closable onkb-close={() => alert('tag removed')}>
        Closable
      </kb-tag>
    </div>
    <kb-tag-group>
      <kb-tag variant="outline">TypeScript</kb-tag>
      <kb-tag variant="outline">Lit</kb-tag>
      <kb-tag variant="outline">Svelte</kb-tag>
      <kb-tag variant="outline">Tailwind</kb-tag>
    </kb-tag-group>
  </section>

  <!-- Avatar -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Avatar</h2>
    <div class="flex flex-wrap items-center gap-3">
      {#each AVATAR_SIZES as s}
        <kb-avatar name="Jane Doe" size={s} color-scheme="blue"></kb-avatar>
      {/each}
      <kb-avatar name="John Smith" badge="green"></kb-avatar>
      <kb-avatar src="https://i.pravatar.cc/80?u=avatar-demo" name="Alice" size="lg"></kb-avatar>
    </div>
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300 mt-4">Avatar Group</h2>
    <kb-avatar-group max="3" size="md" spacing="md">
      <kb-avatar name="Alice" color-scheme="red"></kb-avatar>
      <kb-avatar name="Bob" color-scheme="blue"></kb-avatar>
      <kb-avatar name="Carol" color-scheme="green"></kb-avatar>
      <kb-avatar name="Dave" color-scheme="yellow"></kb-avatar>
      <kb-avatar name="Eve" color-scheme="purple"></kb-avatar>
    </kb-avatar-group>
  </section>

  <!-- Kbd -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Kbd</h2>
    <div class="flex items-center gap-1">
      <kb-kbd>Ctrl</kb-kbd><span class="text-xs text-slate-400">+</span><kb-kbd>S</kb-kbd>
      <span class="text-xs text-slate-400 ml-3">Save</span>
    </div>
    <div class="flex items-center gap-1">
      <kb-kbd>Ctrl</kb-kbd><span class="text-xs text-slate-400">+</span><kb-kbd>Shift</kb-kbd><span class="text-xs text-slate-400">+</span><kb-kbd>P</kb-kbd>
      <span class="text-xs text-slate-400 ml-3">Command palette</span>
    </div>
    <div class="flex items-center gap-3 mt-2">
      {#each KBD_SIZES as s}
        <kb-kbd size={s}>Esc</kb-kbd>
      {/each}
    </div>
  </section>

  <!-- Stat -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Stat</h2>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <kb-stat label="Revenue" value="$12,450" help-text="+12.5% from last month" indicator="increase"></kb-stat>
      <kb-stat label="Users" value="1,024" help-text="-3.2% from last week" indicator="decrease"></kb-stat>
      <kb-stat label="Uptime" value="99.98%" help-text="Last 30 days"></kb-stat>
    </div>
  </section>

  <!-- TreeView -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">TreeView</h2>
    <kb-tree-view nodes={TREE_DATA} show-lines show-icons selectable></kb-tree-view>
  </section>

  <!-- Timeline -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Timeline</h2>
    <kb-timeline items={TIMELINE_ITEMS} variant="left" line-variant="solid" show-icons></kb-timeline>
  </section>

  <!-- Carousel -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Carousel</h2>
    <kb-carousel show-arrows show-dots show-counter loop>
      <div class="p-8 bg-white dark:bg-zinc-900">
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-1">Revenue</p>
        <p class="text-4xl font-bold font-sans tabular-nums text-slate-900 dark:text-zinc-50 mb-1">$124,500</p>
        <p class="text-sm text-green-600 dark:text-green-400">+12.5% from last month</p>
      </div>
      <div class="p-8 bg-white dark:bg-zinc-900">
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-1">Active Users</p>
        <p class="text-4xl font-bold font-sans tabular-nums text-slate-900 dark:text-zinc-50 mb-1">8,432</p>
        <p class="text-sm text-green-600 dark:text-green-400">+3.2% from last week</p>
      </div>
      <div class="p-8 bg-white dark:bg-zinc-900">
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-1">Conversion</p>
        <p class="text-4xl font-bold font-sans tabular-nums text-slate-900 dark:text-zinc-50 mb-1">4.7%</p>
        <p class="text-sm text-red-500 dark:text-red-400">-0.3% from last week</p>
      </div>
    </kb-carousel>
  </section>

  <!-- Collapsible -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Collapsible</h2>
    <kb-button variant="outline" onclick={() => (collapseOpen = !collapseOpen)}>
      {collapseOpen ? 'Hide' : 'Show'} details
    </kb-button>
    <kb-collapsible open={collapseOpen}>
      <div class="border border-gray-200 dark:border-zinc-700 p-4 text-sm text-slate-600 dark:text-zinc-300 space-y-2">
        <p>This content is revealed by the collapsible component.</p>
        <p>Unlike accordion, the trigger is external — you control the open prop directly.</p>
      </div>
    </kb-collapsible>
  </section>

  <!-- Data List -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Data List — horizontal</h2>
    <kb-data-list items={SERVER_DETAILS} orientation="horizontal" divider></kb-data-list>
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300 mt-4">Data List — vertical (small)</h2>
    <kb-data-list items={SERVER_DETAILS} orientation="vertical" size="sm"></kb-data-list>
  </section>
</div>
