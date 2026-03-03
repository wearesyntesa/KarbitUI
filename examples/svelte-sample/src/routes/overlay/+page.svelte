<script lang="ts">
  let modalOpen = $state(false)
  let drawerOpen = $state(false)
  let drawerPlacement = $state<'left' | 'right' | 'top' | 'bottom'>('right')

  const PLACEMENTS = ['left', 'right', 'top', 'bottom'] as const
  const TOOLTIP_PLACEMENTS = ['top', 'right', 'bottom', 'left'] as const

  function openDrawer(p: 'left' | 'right' | 'top' | 'bottom') {
    drawerPlacement = p
    drawerOpen = true
  }
</script>

<div class="max-w-2xl mx-auto p-8 space-y-10">
  <h1 class="text-xl font-bold uppercase tracking-widest border-b border-gray-200 dark:border-zinc-700 pb-4">
    Overlay
  </h1>

  <!-- Modal -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Modal</h2>
    <kb-button variant="outline" onclick={() => (modalOpen = true)}>Open modal</kb-button>
    <kb-modal
      open={modalOpen}
      size="md"
      onkb-close={() => (modalOpen = false)}
    >
      <span slot="header">Confirm Action</span>
      <p class="text-sm text-slate-600 dark:text-zinc-300">
        Are you sure you want to proceed? This action cannot be undone.
      </p>
      <span slot="footer">
        <div class="flex gap-2 justify-end">
          <kb-button variant="outline" onclick={() => (modalOpen = false)}>Cancel</kb-button>
          <kb-button variant="solid" onclick={() => (modalOpen = false)}>Confirm</kb-button>
        </div>
      </span>
    </kb-modal>
  </section>

  <!-- Drawer -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Drawer</h2>
    <div class="flex flex-wrap gap-2">
      {#each PLACEMENTS as p}
        <kb-button
          variant="outline"
          onclick={() => openDrawer(p)}
        >
          {p}
        </kb-button>
      {/each}
    </div>
    <kb-drawer
      open={drawerOpen}
      placement={drawerPlacement}
      size="md"
      onkb-close={() => (drawerOpen = false)}
    >
      <span slot="header">Drawer — {drawerPlacement}</span>
      <div class="space-y-3 text-sm text-slate-600 dark:text-zinc-300">
        <p>This is a {drawerPlacement} drawer.</p>
        <p>Click outside or press Esc to close.</p>
      </div>
    </kb-drawer>
  </section>

  <!-- Popover -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Popover</h2>
    <div class="flex gap-4 flex-wrap">
      <kb-popover trigger="click" placement="bottom">
        <kb-button variant="outline" slot="trigger">Click popover</kb-button>
        <div class="text-sm space-y-1">
          <p class="font-semibold">Popover title</p>
          <p class="text-slate-500 dark:text-zinc-300">Some content inside a popover triggered on click.</p>
        </div>
      </kb-popover>
      <kb-popover trigger="hover" placement="top">
        <kb-button variant="outline" slot="trigger">Hover popover</kb-button>
        <div class="text-sm">Hovered content</div>
      </kb-popover>
    </div>
  </section>

  <!-- Tooltip -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Tooltip</h2>
    <div class="flex gap-4 flex-wrap items-center">
      {#each TOOLTIP_PLACEMENTS as p}
        <kb-tooltip label={`Tooltip — ${p}`} placement={p}>
          <kb-button variant="outline">{p}</kb-button>
        </kb-tooltip>
      {/each}
    </div>
  </section>
</div>
