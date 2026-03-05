<script setup lang="ts">
import { ref } from 'vue'

const toastVisible = ref(false)
const progressValue = ref(60)
const circularValue = ref(72)

function showAlert(msg: string) {
  globalThis.alert(msg)
}
</script>

<template>
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
        <kb-badge v-for="v in (['solid', 'outline', 'subtle'] as const)" :key="v" :variant="v">
          {{ v }}
        </kb-badge>
        <kb-badge v-for="s in (['xs', 'sm', 'md'] as const)" :key="s" :size="s" variant="solid">
          {{ s }}
        </kb-badge>
        <kb-badge variant="subtle" closable @kb-close="showAlert('badge closed')">
          Closable
        </kb-badge>
      </div>
    </section>

    <!-- Progress -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Progress</h2>
      <div class="space-y-2">
        <kb-progress :value="progressValue" :max="100" />
        <kb-progress :value="progressValue" :max="100" size="sm" />
        <kb-progress :value="progressValue" :max="100" size="lg" />
      </div>
      <div class="flex gap-2">
        <kb-button
          variant="outline"
          size="sm"
          @click="progressValue = Math.max(0, progressValue - 10)"
        >
          &minus; 10
        </kb-button>
        <kb-button
          variant="outline"
          size="sm"
          @click="progressValue = Math.min(100, progressValue + 10)"
        >
          + 10
        </kb-button>
        <span class="text-sm self-center">{{ progressValue }}%</span>
      </div>
    </section>

    <!-- Spinner -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Spinner</h2>
      <div class="flex flex-wrap items-center gap-4">
        <kb-spinner size="sm" />
        <kb-spinner size="md" />
        <kb-spinner size="lg" />
        <kb-spinner size="xl" />
        <kb-spinner variant="dots" />
        <kb-spinner variant="pulse" />
      </div>
    </section>

    <!-- Toast -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Toast</h2>
      <kb-button variant="outline" @click="toastVisible = true">
        Show toast
      </kb-button>
      <kb-toast
        v-if="toastVisible"
        status="success"
        position="bottom-right"
        closable
        @kb-close="toastVisible = false"
      >
        Changes saved successfully
      </kb-toast>
    </section>

    <!-- Clipboard — inline -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Clipboard — inline</h2>
      <kb-clipboard value="npm install @wearesyntesa/karbit-ui" show-value label="Install Command" />
      <kb-clipboard value="https://karbit.dev" show-value label="Documentation URL" />
      <kb-clipboard value="sk-1234-abcd-5678" show-value label="API Key" size="sm" />
    </section>

    <!-- Clipboard — button -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Clipboard — button</h2>
      <div class="flex flex-wrap items-center gap-4">
        <kb-clipboard value="npm install @wearesyntesa/karbit-ui" label="Copy" />
        <kb-clipboard value="https://karbit.dev" label="Copy URL" variant="subtle" />
        <kb-clipboard value="sk-1234-abcd-5678" variant="ghost" size="sm" />
      </div>
    </section>

    <!-- Skeleton -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Skeleton</h2>
      <kb-skeleton width="60%" />
      <kb-skeleton width="100%" size="lg" />
      <kb-skeleton width="40%" size="sm" />
      <div class="flex gap-4 mt-4">
        <kb-skeleton circle height="40px" />
        <div class="flex-1 space-y-2">
          <kb-skeleton lines="3" />
        </div>
      </div>
    </section>

    <!-- Empty State -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Empty State</h2>
      <kb-empty-state
        title="No projects yet"
        description="Create your first project to get started."
      >
        <span slot="icon">
          <svg class="w-full h-full text-slate-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
            <path stroke-linecap="square" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </span>
        <span slot="action">
          <kb-button variant="solid" size="sm">New Project</kb-button>
        </span>
      </kb-empty-state>
      <kb-empty-state
        title="No results found"
        description="Try adjusting your search or filters."
        size="sm"
      />
    </section>

    <!-- Circular Progress -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Circular Progress</h2>
      <div class="flex flex-wrap items-end gap-6">
        <kb-circular-progress :value="circularValue" :max="100" size="sm" />
        <kb-circular-progress :value="circularValue" :max="100" size="md" show-value />
        <kb-circular-progress :value="circularValue" :max="100" size="lg" show-value color-scheme="green" />
        <kb-circular-progress indeterminate size="md" />
      </div>
      <div class="flex gap-2 mt-2">
        <kb-button
          variant="outline"
          size="sm"
          @click="circularValue = Math.max(0, circularValue - 10)"
        >
          &minus; 10
        </kb-button>
        <kb-button
          variant="outline"
          size="sm"
          @click="circularValue = Math.min(100, circularValue + 10)"
        >
          + 10
        </kb-button>
        <span class="text-sm self-center">{{ circularValue }}%</span>
      </div>
    </section>
  </div>
</template>
