<script setup lang="ts">
import { ref } from 'vue'

const toastVisible = ref(false)
const progressValue = ref(60)

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
      <div class="flex items-center gap-4">
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
  </div>
</template>
