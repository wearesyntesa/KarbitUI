<script lang="ts">
  const ROLE_OPTIONS = [
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
  ]

  const PRIORITY_OPTIONS = ['low', 'medium', 'high'] as const
  const BUTTON_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const

  let username = $state('')
  let role = $state('')
  let priority = $state('')
  let notes = $state('')
  let termsAccepted = $state(false)
  let notifications = $state(false)
  let loading = $state(false)

  function handleSubmit(e: Event) {
    e.preventDefault()
    loading = true
    setTimeout(() => (loading = false), 1500)
  }
</script>

<div class="max-w-2xl mx-auto p-8 space-y-8">
  <h1 class="text-xl font-bold uppercase tracking-widest border-b border-gray-200 dark:border-zinc-700 pb-4">
    Forms
  </h1>

  <form onsubmit={handleSubmit} class="space-y-6">

    <kb-form-control>
      <kb-form-label>Username</kb-form-label>
      <kb-input
        value={username}
        placeholder="Enter username"
        clearable
        onkb-input={(e: CustomEvent) => (username = e.detail.value)}
      ></kb-input>
    </kb-form-control>

    <kb-form-control>
      <kb-form-label>Role</kb-form-label>
      <kb-select
        options={ROLE_OPTIONS}
        value={role}
        placeholder="Pick a role"
        onkb-change={(e: CustomEvent) => (role = e.detail.value)}
      ></kb-select>
    </kb-form-control>

    <kb-form-control>
      <kb-form-label>Priority</kb-form-label>
      <div class="flex gap-6">
        {#each PRIORITY_OPTIONS as val}
          <kb-radio
            value={val}
            checked={priority === val}
            onkb-change={() => (priority = val)}
          >
            {val.charAt(0).toUpperCase() + val.slice(1)}
          </kb-radio>
        {/each}
      </div>
    </kb-form-control>

    <kb-form-control>
      <kb-form-label>Notes</kb-form-label>
      <kb-textarea
        placeholder="Add a note..."
        value={notes}
        rows="4"
        resize="vertical"
        onkb-input={(e: CustomEvent) => (notes = e.detail.value)}
      ></kb-textarea>
    </kb-form-control>

    <kb-form-control>
      <kb-checkbox
        checked={termsAccepted}
        onkb-change={(e: CustomEvent) => (termsAccepted = e.detail.checked)}
      >
        Accept terms and conditions
      </kb-checkbox>
    </kb-form-control>

    <kb-form-control>
      <kb-switch
        checked={notifications}
        onkb-change={(e: CustomEvent) => (notifications = e.detail.checked)}
      >
        Enable notifications
      </kb-switch>
    </kb-form-control>

    <div class="space-y-3">
      <p class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Button variants</p>
      <div class="flex flex-wrap gap-2">
        <kb-button variant="solid" type="submit" loading={loading} loading-text="Saving...">Submit</kb-button>
        <kb-button variant="outline">Outline</kb-button>
        <kb-button variant="ghost">Ghost</kb-button>
        <kb-button variant="link">Link</kb-button>
        <kb-button variant="solid" color-scheme="red" disabled>Disabled</kb-button>
      </div>
    </div>

    <div class="space-y-3">
      <p class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Button sizes</p>
      <div class="flex flex-wrap items-center gap-2">
        {#each BUTTON_SIZES as s}
          <kb-button size={s} variant="outline">{s.toUpperCase()}</kb-button>
        {/each}
      </div>
    </div>

    <div class="space-y-3">
      <p class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Button group</p>
      <kb-button-group>
        <kb-button variant="outline">Left</kb-button>
        <kb-button variant="outline">Center</kb-button>
        <kb-button variant="outline">Right</kb-button>
      </kb-button-group>
    </div>

    <div class="space-y-3">
      <p class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Icon buttons</p>
      <div class="flex gap-2">
        <kb-icon-button variant="solid" aria-label="Add">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M12 5v14M5 12h14"/></svg>
        </kb-icon-button>
        <kb-icon-button variant="outline" aria-label="Delete">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><polyline points="3 6 5 6 21 6"/><path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6"/></svg>
        </kb-icon-button>
        <kb-icon-button variant="ghost" aria-label="Settings">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </kb-icon-button>
      </div>
    </div>

    <div class="border border-gray-100 dark:border-zinc-700 p-4 text-xs space-y-1 text-gray-500 dark:text-zinc-400">
      <div>username: {username || '—'}</div>
      <div>role: {role || '—'}</div>
      <div>priority: {priority || '—'}</div>
      <div>terms: {String(termsAccepted)}</div>
      <div>notifications: {String(notifications)}</div>
    </div>

  </form>
</div>
