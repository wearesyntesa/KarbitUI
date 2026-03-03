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
    <div class="grid grid-cols-3 gap-4">
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
    <div class="grid grid-cols-2 gap-4">
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
</div>
