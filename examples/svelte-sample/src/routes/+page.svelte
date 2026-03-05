<script lang="ts">
  const ROLE_OPTIONS = [
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
  ]

  const PRIORITY_OPTIONS = ['low', 'medium', 'high'] as const
  const BUTTON_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const

  const SEGMENT_OPTIONS = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ]

  const FRAMEWORK_OPTIONS = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'angular', label: 'Angular' },
    { value: 'solid', label: 'Solid' },
  ]

  let username = $state('')
  let role = $state('')
  let priority = $state('')
  let notes = $state('')
  let termsAccepted = $state(false)
  let notifications = $state(false)
  let loading = $state(false)
  let quantity = $state(5)
  let sliderVal = $state(50)
  let pin = $state('')
  let rating = $state(0)
  let interval = $state('monthly')
  let tags: string[] = $state(['svelte', 'typescript'])
  let time = $state('')
  let framework = $state('')
  let date = $state('')
  let color = $state('#3b82f6ff')
  let editableText = $state('Click me to edit')

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
      <div class="flex flex-wrap gap-6">
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

    <kb-form-control>
      <kb-form-label>Quantity</kb-form-label>
      <kb-number-input
        value={quantity}
        min={0}
        max={100}
        step={1}
        onkb-change={(e: CustomEvent) => (quantity = Number(e.detail.value))}
      ></kb-number-input>
    </kb-form-control>

    <kb-form-control>
      <kb-form-label>Volume ({sliderVal}%)</kb-form-label>
      <kb-slider
        value={sliderVal}
        min={0}
        max={100}
        step={10}
        show-value
        show-ticks
        show-range
        onkb-change={(e: CustomEvent) => (sliderVal = Number(e.detail.value))}
      ></kb-slider>
    </kb-form-control>

    <kb-form-control>
      <kb-form-label>Verification code</kb-form-label>
      <kb-pin-input
        length={6}
        type="numeric"
        onkb-complete={(e: CustomEvent) => (pin = e.detail.value)}
      ></kb-pin-input>
    </kb-form-control>

    <kb-form-control>
      <kb-form-label>Rating ({rating}/5)</kb-form-label>
      <kb-rating
        value={rating}
        max={5}
        allow-half
        onkb-change={(e: CustomEvent) => (rating = Number(e.detail.value))}
      ></kb-rating>
    </kb-form-control>

    <kb-form-control>
      <kb-form-label>Billing interval</kb-form-label>
      <kb-segment
        options={SEGMENT_OPTIONS}
        value={interval}
        onkb-change={(e: CustomEvent) => (interval = e.detail.value)}
      ></kb-segment>
    </kb-form-control>

    <kb-form-control>
      <kb-form-label>Tags</kb-form-label>
      <kb-tags-input
        values={tags}
        placeholder="Add a tag..."
        onkb-change={(e: CustomEvent) => (tags = [...e.detail.values])}
      ></kb-tags-input>
    </kb-form-control>

    <kb-form-control>
      <kb-form-label>Appointment time</kb-form-label>
      <kb-time-picker
        value={time}
        placeholder="Pick a time"
        clearable
        onkb-change={(e: CustomEvent) => (time = e.detail.value)}
      ></kb-time-picker>
    </kb-form-control>

    <kb-form-control>
      <kb-form-label>Framework</kb-form-label>
      <kb-combobox
        options={FRAMEWORK_OPTIONS}
        value={framework}
        placeholder="Search frameworks..."
        clearable
        onkb-change={(e: CustomEvent) => (framework = e.detail.value)}
      ></kb-combobox>
    </kb-form-control>

    <kb-form-control>
      <kb-form-label>Date</kb-form-label>
      <kb-date-picker
        value={date}
        placeholder="Pick a date"
        clearable
        onkb-change={(e: CustomEvent) => (date = e.detail.value)}
      ></kb-date-picker>
    </kb-form-control>

    <kb-form-control>
      <kb-form-label>Color</kb-form-label>
      <kb-color-picker
        value={color}
        show-alpha
        onkb-change={(e: CustomEvent) => (color = e.detail.value)}
      ></kb-color-picker>
    </kb-form-control>

    <kb-form-control>
      <kb-form-label>Editable text</kb-form-label>
      <kb-editable
        value={editableText}
        placeholder="Click to edit"
        onkb-edit-submit={(e: CustomEvent) => (editableText = e.detail.value)}
      ></kb-editable>
    </kb-form-control>

    <kb-form-control>
      <kb-form-label>Attachments</kb-form-label>
      <kb-file-upload
        accept="image/*,.pdf"
        multiple
        max-size={5000000}
      ></kb-file-upload>
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
      <div class="flex flex-wrap gap-2">
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
      <div>quantity: {quantity}</div>
      <div>slider: {sliderVal}%</div>
      <div>pin: {pin || '—'}</div>
      <div>rating: {rating}</div>
      <div>interval: {interval}</div>
      <div>tags: {tags.join(', ') || '—'}</div>
      <div>time: {time || '—'}</div>
      <div>framework: {framework || '—'}</div>
      <div>date: {date || '—'}</div>
      <div>color: {color}</div>
      <div>editable: {editableText}</div>
    </div>

  </form>
</div>
