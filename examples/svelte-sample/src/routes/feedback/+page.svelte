<script lang="ts">
  let toastVisible = $state(false)
  let progressValue = $state(60)
</script>

<div class="max-w-2xl mx-auto p-8 space-y-10">
  <h1 class="text-xl font-bold uppercase tracking-widest border-b border-gray-200 dark:border-zinc-700 pb-4">
    Feedback
  </h1>

  <!-- Alert — statuses -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Alert — statuses</h2>
    <kb-alert status="info" variant="subtle">Informational message</kb-alert>
    <kb-alert status="success" variant="subtle">Operation completed successfully</kb-alert>
    <kb-alert status="warning" variant="subtle">This action may have consequences</kb-alert>
    <kb-alert status="error" variant="subtle">Something went wrong</kb-alert>
  </section>

  <!-- Alert — variants -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Alert — variants</h2>
    <kb-alert status="info" variant="solid">Solid info alert</kb-alert>
    <kb-alert status="success" variant="outline">Outline success alert</kb-alert>
    <kb-alert status="warning" variant="left-accent">Left accent warning alert</kb-alert>
  </section>

  <!-- Alert — closable with title -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Alert — closable with title</h2>
    <kb-alert status="error" variant="subtle" closable>
      <span slot="title">Deployment Failed</span>
      Pipeline encountered 3 errors during build phase.
      <span slot="action">
        <kb-button variant="ghost" size="xs">Retry</kb-button>
      </span>
    </kb-alert>
  </section>

  <!-- Badge -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Badge</h2>
    <div class="flex flex-wrap gap-2">
      {#each ['solid', 'outline', 'subtle'] as v}
        <kb-badge variant={v}>{v}</kb-badge>
      {/each}
      {#each ['xs', 'sm', 'md'] as s}
        <kb-badge size={s} variant="solid">{s}</kb-badge>
      {/each}
      <kb-badge variant="subtle" closable onkb-close={() => alert('badge closed')}>
        Closable
      </kb-badge>
    </div>
  </section>

  <!-- Progress -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Progress</h2>
    <div class="space-y-2">
      <kb-progress value={progressValue} max={100}></kb-progress>
      <kb-progress value={progressValue} max={100} size="sm"></kb-progress>
      <kb-progress value={progressValue} max={100} size="lg"></kb-progress>
    </div>
    <div class="flex gap-2">
      <kb-button
        variant="outline"
        size="sm"
        onclick={() => (progressValue = Math.max(0, progressValue - 10))}
      >
        &minus; 10
      </kb-button>
      <kb-button
        variant="outline"
        size="sm"
        onclick={() => (progressValue = Math.min(100, progressValue + 10))}
      >
        + 10
      </kb-button>
      <span class="text-sm self-center">{progressValue}%</span>
    </div>
  </section>

  <!-- Spinner -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Spinner</h2>
    <div class="flex items-center gap-4">
      <kb-spinner size="sm"></kb-spinner>
      <kb-spinner size="md"></kb-spinner>
      <kb-spinner size="lg"></kb-spinner>
      <kb-spinner size="xl"></kb-spinner>
      <kb-spinner variant="dots"></kb-spinner>
      <kb-spinner variant="pulse"></kb-spinner>
    </div>
  </section>

  <!-- Toast -->
  <section class="space-y-3">
    <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Toast</h2>
    <kb-button variant="outline" onclick={() => (toastVisible = true)}>
      Show toast
    </kb-button>
    {#if toastVisible}
      <kb-toast
        status="success"
        position="bottom-right"
        closable
        onkb-close={() => (toastVisible = false)}
      >
        Changes saved successfully
      </kb-toast>
    {/if}
  </section>
</div>
