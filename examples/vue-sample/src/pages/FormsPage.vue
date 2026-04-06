<script setup lang="ts">
import { Checkbox, Input, Select, Switch, Textarea } from '@wearesyntesa/karbit-ui/vue'
import { ref } from 'vue'

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

const username = ref('')
const role = ref('')
const priority = ref('')
const notes = ref('')
const termsAccepted = ref(false)
const notifications = ref(false)
const loading = ref(false)
const quantity = ref(5)
const sliderVal = ref(50)
const pin = ref('')
const rating = ref(0)
const interval = ref('monthly')
const tags = ref(['vue', 'typescript'])
const time = ref('')
const framework = ref('')
const date = ref('')
const color = ref('#3b82f6ff')
const editableText = ref('Click me to edit')

function handleSubmit(e: Event) {
  e.preventDefault()
  loading.value = true
  setTimeout(() => (loading.value = false), 1500)
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-8 space-y-8">
    <h1 class="text-xl font-bold uppercase tracking-widest border-b border-gray-200 dark:border-zinc-700 pb-4">
      Forms
    </h1>

    <form @submit="handleSubmit" class="space-y-6">

      <kb-form-control>
        <kb-form-label>Username</kb-form-label>
        <Input
          v-model:value="username"
          placeholder="Enter username"
          clearable
        />
      </kb-form-control>

      <kb-form-control>
        <kb-form-label>Role</kb-form-label>
        <Select
          v-model:value="role"
          :options="ROLE_OPTIONS"
          placeholder="Pick a role"
        />
      </kb-form-control>

      <kb-form-control>
        <kb-form-label>Priority</kb-form-label>
        <div class="flex flex-wrap gap-6">
          <kb-radio
            v-for="val in PRIORITY_OPTIONS"
            :key="val"
            :value="val"
            :checked="priority === val"
            @kb-change="priority = val"
          >
            {{ val.charAt(0).toUpperCase() + val.slice(1) }}
          </kb-radio>
        </div>
      </kb-form-control>

      <kb-form-control>
        <kb-form-label>Notes</kb-form-label>
        <Textarea
          placeholder="Add a note..."
          v-model:value="notes"
          :rows="4"
          resize="vertical"
        />
      </kb-form-control>

      <kb-form-control>
        <Checkbox v-model:checked="termsAccepted">
          Accept terms and conditions
        </Checkbox>
      </kb-form-control>

      <kb-form-control>
        <Switch v-model:checked="notifications">
          Enable notifications
        </Switch>
      </kb-form-control>

      <kb-form-control>
        <kb-form-label>Quantity</kb-form-label>
        <kb-number-input
          :value="quantity"
          :min="0"
          :max="100"
          :step="1"
          @kb-change="quantity = Number(($event as CustomEvent).detail.value)"
        />
      </kb-form-control>

      <kb-form-control>
        <kb-form-label>Volume ({{ sliderVal }}%)</kb-form-label>
        <kb-slider
          :value="sliderVal"
          :min="0"
          :max="100"
          :step="10"
          show-value
          show-ticks
          show-range
          @kb-change="sliderVal = Number(($event as CustomEvent).detail.value)"
        />
      </kb-form-control>

      <kb-form-control>
        <kb-form-label>Verification code</kb-form-label>
        <kb-pin-input
          :length="6"
          type="numeric"
          @kb-complete="pin = ($event as CustomEvent).detail.value"
        />
      </kb-form-control>

      <kb-form-control>
        <kb-form-label>Rating ({{ rating }}/5)</kb-form-label>
        <kb-rating
          :value="rating"
          :max="5"
          allow-half
          @kb-change="rating = Number(($event as CustomEvent).detail.value)"
        />
      </kb-form-control>

      <kb-form-control>
        <kb-form-label>Billing interval</kb-form-label>
        <kb-segment
          :options.prop="SEGMENT_OPTIONS"
          :value="interval"
          @kb-change="interval = ($event as CustomEvent).detail.value"
        />
      </kb-form-control>

      <kb-form-control>
        <kb-form-label>Tags</kb-form-label>
        <kb-tags-input
          :values.prop="tags"
          placeholder="Add a tag..."
          @kb-change="tags = [...($event as CustomEvent).detail.values]"
        />
      </kb-form-control>

      <kb-form-control>
        <kb-form-label>Appointment time</kb-form-label>
        <kb-time-picker
          :value="time"
          placeholder="Pick a time"
          clearable
          @kb-change="time = ($event as CustomEvent).detail.value"
        />
      </kb-form-control>

      <kb-form-control>
        <kb-form-label>Framework</kb-form-label>
        <kb-combobox
          :options.prop="FRAMEWORK_OPTIONS"
          :value="framework"
          placeholder="Search frameworks..."
          clearable
          @kb-change="framework = ($event as CustomEvent).detail.value"
        />
      </kb-form-control>

      <kb-form-control>
        <kb-form-label>Date</kb-form-label>
        <kb-date-picker
          :value="date"
          placeholder="Pick a date"
          clearable
          @kb-change="date = ($event as CustomEvent).detail.value"
        />
      </kb-form-control>

      <kb-form-control>
        <kb-form-label>Color</kb-form-label>
        <kb-color-picker
          :value="color"
          show-alpha
          @kb-change="color = ($event as CustomEvent).detail.value"
        />
      </kb-form-control>

      <kb-form-control>
        <kb-form-label>Editable text</kb-form-label>
        <kb-editable
          :value="editableText"
          placeholder="Click to edit"
          @kb-edit-submit="editableText = ($event as CustomEvent).detail.value"
        />
      </kb-form-control>

      <kb-form-control>
        <kb-form-label>Attachments</kb-form-label>
        <kb-file-upload
          accept="image/*,.pdf"
          multiple
          :max-size="5000000"
        />
      </kb-form-control>

      <div class="space-y-3">
        <p class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Button variants</p>
        <div class="flex flex-wrap gap-2">
          <kb-button variant="solid" type="submit" :loading="loading" loading-text="Saving...">Submit</kb-button>
          <kb-button variant="outline">Outline</kb-button>
          <kb-button variant="ghost">Ghost</kb-button>
          <kb-button variant="link">Link</kb-button>
          <kb-button variant="solid" color-scheme="red" disabled>Disabled</kb-button>
        </div>
      </div>

      <div class="space-y-3">
        <p class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Button sizes</p>
        <div class="flex flex-wrap items-center gap-2">
          <kb-button
            v-for="s in BUTTON_SIZES"
            :key="s"
            :size="s"
            variant="outline"
          >
            {{ s.toUpperCase() }}
          </kb-button>
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
        <div>username: {{ username || '—' }}</div>
        <div>role: {{ role || '—' }}</div>
        <div>priority: {{ priority || '—' }}</div>
        <div>terms: {{ String(termsAccepted) }}</div>
        <div>notifications: {{ String(notifications) }}</div>
        <div>quantity: {{ quantity }}</div>
        <div>slider: {{ sliderVal }}%</div>
        <div>pin: {{ pin || '—' }}</div>
        <div>rating: {{ rating }}</div>
        <div>interval: {{ interval }}</div>
        <div>tags: {{ tags.join(', ') || '—' }}</div>
        <div>time: {{ time || '—' }}</div>
        <div>framework: {{ framework || '—' }}</div>
        <div>date: {{ date || '—' }}</div>
        <div>color: {{ color }}</div>
        <div>editable: {{ editableText }}</div>
      </div>

    </form>
  </div>
</template>
