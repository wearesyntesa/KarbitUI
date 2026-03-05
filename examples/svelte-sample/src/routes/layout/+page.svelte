<script lang="ts">
  const CONTAINER_SIZES = ['sm', 'md', 'lg', 'xl'] as const
</script>

<div class="max-w-3xl mx-auto p-8 space-y-10">
  <h1 class="text-xl font-bold uppercase tracking-widest border-b border-gray-200 dark:border-zinc-700 pb-4">
    Layout
  </h1>

  <!-- Box -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Box</h2>
    <kb-box class="border border-gray-200 dark:border-zinc-700 p-4 text-sm">
      A generic container element with no semantic meaning — useful as a building block.
    </kb-box>
  </section>

  <!-- Container -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Container — sizes</h2>
    {#each CONTAINER_SIZES as s}
      <kb-container size={s} class="border border-dashed border-gray-300 dark:border-zinc-600 p-3 text-xs text-slate-500 dark:text-zinc-400">
        Container size="{s}"
      </kb-container>
    {/each}
  </section>

  <!-- Divider -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Divider</h2>
    <kb-divider></kb-divider>
    <kb-divider variant="dashed"></kb-divider>
    <kb-divider variant="dotted"></kb-divider>
    <kb-divider label="OR"></kb-divider>
    <div class="flex items-center h-16 gap-4">
      <span class="text-sm">Left</span>
      <kb-divider orientation="vertical"></kb-divider>
      <span class="text-sm">Right</span>
    </div>
  </section>

  <!-- Flex -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Flex</h2>
    <kb-flex justify="space-between" align="center" class="gap-4">
      {#each [1, 2, 3] as n}
        <kb-box class="border border-gray-200 dark:border-zinc-700 p-4 text-center text-sm flex-1">
          Item {n}
        </kb-box>
      {/each}
    </kb-flex>
    <kb-flex direction="column" class="gap-2">
      {#each [1, 2] as n}
        <kb-box class="border border-gray-200 dark:border-zinc-700 p-3 text-sm">
          Column item {n}
        </kb-box>
      {/each}
    </kb-flex>
  </section>

  <!-- Grid -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Grid</h2>
    <kb-grid columns="3" class="gap-4">
      {#each [1, 2, 3, 4, 5, 6] as n}
        <kb-box class="border border-gray-200 dark:border-zinc-700 p-4 text-center text-sm">
          Cell {n}
        </kb-box>
      {/each}
    </kb-grid>
    <kb-grid columns="4" class="gap-2">
      {#each [1, 2, 3, 4] as n}
        <kb-box class="border border-gray-200 dark:border-zinc-700 p-3 text-center text-xs">
          4-col {n}
        </kb-box>
      {/each}
    </kb-grid>
  </section>

  <!-- Stack -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Stack — vertical</h2>
    <kb-stack spacing="4">
      {#each [1, 2, 3] as n}
        <kb-box class="border border-gray-200 dark:border-zinc-700 p-3 text-sm">
          Stacked item {n}
        </kb-box>
      {/each}
    </kb-stack>
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300 mt-4">Stack — horizontal</h2>
    <kb-stack direction="horizontal" spacing="4">
      {#each [1, 2, 3] as n}
        <kb-box class="border border-gray-200 dark:border-zinc-700 p-4 text-sm">
          H-item {n}
        </kb-box>
      {/each}
    </kb-stack>
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300 mt-4">Stack — with divider</h2>
    <kb-stack spacing="4" divider>
      {#each [1, 2, 3] as n}
        <kb-box class="p-3 text-sm">
          Divided item {n}
        </kb-box>
      {/each}
    </kb-stack>
  </section>

  <!-- Scroll Area -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Scroll Area — vertical</h2>
    <kb-scroll-area direction="vertical" scrollbar="hover" bordered class="h-48">
      <div class="p-4 space-y-3">
        {#each Array.from({ length: 20 }, (_, i) => i + 1) as n}
          <p class="text-sm text-slate-600 dark:text-zinc-300">
            Scrollable item {n} — this content overflows the container.
          </p>
        {/each}
      </div>
    </kb-scroll-area>
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300 mt-4">Scroll Area — horizontal</h2>
    <kb-scroll-area direction="horizontal" scrollbar="always" bordered class="h-auto">
      <div class="flex gap-4 p-4 w-max">
        {#each Array.from({ length: 12 }, (_, i) => i + 1) as n}
          <kb-box class="border border-gray-200 dark:border-zinc-700 p-4 text-center text-sm shrink-0 w-36">
            Card {n}
          </kb-box>
        {/each}
      </div>
    </kb-scroll-area>
  </section>
</div>
