<script lang="ts">
  const ITEMS = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`)
  const PAGE_SIZE = 5

  let page = $state(1)
  let step = $state(1)

  function pageItems(): string[] {
    const start = (page - 1) * PAGE_SIZE
    return ITEMS.slice(start, start + PAGE_SIZE)
  }

  const totalPages = Math.ceil(ITEMS.length / PAGE_SIZE)

  function handlePageChange(e: CustomEvent<{ page: number }>) {
    page = e.detail.page
  }
</script>

<div class="max-w-2xl mx-auto p-8 space-y-10">
  <h1 class="text-xl font-bold uppercase tracking-widest border-b border-gray-200 dark:border-zinc-700 pb-4">
    Navigation
  </h1>

  <!-- Tabs -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Tabs</h2>
    <kb-tabs variant="line" size="md">
      <span slot="tab-0">Overview</span>
      <span slot="tab-1">Metrics</span>
      <span slot="tab-2">Logs</span>
      <div slot="panel-0" class="p-4 text-sm text-slate-600 dark:text-zinc-300">
        System is operating normally with 4 of 5 services healthy.
      </div>
      <div slot="panel-1" class="p-4 text-sm text-slate-600 dark:text-zinc-300">
        P99 latency: 340ms · Throughput: 12k rps · Error rate: 0.02%
      </div>
      <div slot="panel-2" class="p-4 text-sm text-slate-600 dark:text-zinc-300">
        No critical errors in the last 24 hours.
      </div>
    </kb-tabs>
  </section>

  <!-- Pagination -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Pagination</h2>
    <div class="border border-gray-200 dark:border-zinc-700 divide-y divide-gray-200 dark:divide-zinc-700">
      {#each pageItems() as item}
        <div class="px-4 py-2 text-sm">{item}</div>
      {/each}
    </div>
    <kb-pagination
      total={totalPages}
      page={page}
      siblings={1}
      onkb-page-change={handlePageChange}
    ></kb-pagination>
    <div class="flex flex-wrap items-center gap-4 mt-2">
      {#each ['sm', 'md', 'lg'] as s}
        <kb-pagination total={10} page={3} size={s}></kb-pagination>
      {/each}
    </div>
  </section>

  <!-- Steps -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Steps</h2>
    <kb-steps
      current={step}
      onkb-step-click={(e: CustomEvent) => (step = e.detail.index)}
    >
      <kb-step label="Account"></kb-step>
      <kb-step label="Profile"></kb-step>
      <kb-step label="Review"></kb-step>
      <kb-step label="Done"></kb-step>
    </kb-steps>
    <div class="flex gap-2">
      <kb-button variant="outline" size="sm" disabled={step === 0} onclick={() => step--}>Back</kb-button>
      <kb-button variant="outline" size="sm" disabled={step === 3} onclick={() => step++}>Next</kb-button>
    </div>
  </section>
</div>
