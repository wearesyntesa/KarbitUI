<script setup lang="ts">
import { ref } from 'vue'

const modalOpen = ref(false)
const drawerOpen = ref(false)
const drawerPlacement = ref<'left' | 'right' | 'top' | 'bottom'>('right')
const alertOpen = ref(false)
const deleteAlertOpen = ref(false)

const PLACEMENTS = ['left', 'right', 'top', 'bottom'] as const
const TOOLTIP_PLACEMENTS = ['top', 'right', 'bottom', 'left'] as const

function openDrawer(p: 'left' | 'right' | 'top' | 'bottom') {
  drawerPlacement.value = p
  drawerOpen.value = true
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-8 space-y-10">
    <h1 class="text-xl font-bold uppercase tracking-widest border-b border-gray-200 dark:border-zinc-700 pb-4">
      Overlay
    </h1>

    <!-- Modal -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Modal</h2>
      <kb-button variant="outline" @click="modalOpen = true">Open modal</kb-button>
      <kb-modal
        :open="modalOpen"
        size="md"
        @kb-close="modalOpen = false"
      >
        <span slot="header">Confirm Action</span>
        <p class="text-sm text-slate-600 dark:text-zinc-300">
          Are you sure you want to proceed? This action cannot be undone.
        </p>
        <span slot="footer">
          <div class="flex gap-2 justify-end">
            <kb-button variant="outline" @click="modalOpen = false">Cancel</kb-button>
            <kb-button variant="solid" @click="modalOpen = false">Confirm</kb-button>
          </div>
        </span>
      </kb-modal>
    </section>

    <!-- Drawer -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Drawer</h2>
      <div class="flex flex-wrap gap-2">
        <kb-button
          v-for="p in PLACEMENTS"
          :key="p"
          variant="outline"
          @click="openDrawer(p)"
        >
          {{ p }}
        </kb-button>
      </div>
      <kb-drawer
        :open="drawerOpen"
        :placement="drawerPlacement"
        size="md"
        @kb-close="drawerOpen = false"
      >
        <span slot="header">Drawer — {{ drawerPlacement }}</span>
        <div class="space-y-3 text-sm text-slate-600 dark:text-zinc-300">
          <p>This is a {{ drawerPlacement }} drawer.</p>
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
        <kb-tooltip
          v-for="p in TOOLTIP_PLACEMENTS"
          :key="p"
          :label="`Tooltip — ${p}`"
          :placement="p"
        >
          <kb-button variant="outline">{{ p }}</kb-button>
        </kb-tooltip>
      </div>
    </section>

    <!-- Dropdown Menu -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Dropdown Menu</h2>
      <div class="flex flex-wrap gap-4">
        <kb-dropdown-menu placement="bottom">
          <kb-button variant="outline" slot="trigger">Actions</kb-button>
          <kb-menu-item value="edit">Edit</kb-menu-item>
          <kb-menu-item value="duplicate">Duplicate</kb-menu-item>
          <kb-menu-item value="archive">Archive</kb-menu-item>
          <kb-menu-item value="delete" destructive>Delete</kb-menu-item>
        </kb-dropdown-menu>
        <kb-dropdown-menu placement="bottom" size="sm">
          <kb-button variant="outline" slot="trigger" size="sm">Small menu</kb-button>
          <kb-menu-item value="copy">Copy</kb-menu-item>
          <kb-menu-item value="paste">Paste</kb-menu-item>
          <kb-menu-item value="cut" disabled>Cut (disabled)</kb-menu-item>
        </kb-dropdown-menu>
      </div>
    </section>

    <!-- Alert Dialog -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Alert Dialog</h2>
      <div class="flex gap-2">
        <kb-button variant="outline" @click="alertOpen = true">Confirm action</kb-button>
        <kb-button variant="outline" color-scheme="red" @click="deleteAlertOpen = true">Delete item</kb-button>
      </div>
      <kb-alert-dialog
        :open="alertOpen"
        @kb-confirm="alertOpen = false"
        @kb-cancel="alertOpen = false"
      >
        <span slot="header">Confirm Changes</span>
        <p class="text-sm text-slate-600 dark:text-zinc-300">
          Are you sure you want to save these changes? This will update the production configuration.
        </p>
        <span slot="footer">
          <div class="flex gap-2 justify-end">
            <kb-button variant="outline" data-action="cancel">Cancel</kb-button>
            <kb-button variant="solid" data-action="confirm">Save Changes</kb-button>
          </div>
        </span>
      </kb-alert-dialog>
      <kb-alert-dialog
        :open="deleteAlertOpen"
        @kb-confirm="deleteAlertOpen = false"
        @kb-cancel="deleteAlertOpen = false"
      >
        <span slot="header">Delete Item</span>
        <p class="text-sm text-slate-600 dark:text-zinc-300">
          This action cannot be undone. The item and all associated data will be permanently removed.
        </p>
        <span slot="footer">
          <div class="flex gap-2 justify-end">
            <kb-button variant="outline" data-action="cancel">Cancel</kb-button>
            <kb-button variant="solid" color-scheme="red" data-action="confirm">Delete</kb-button>
          </div>
        </span>
      </kb-alert-dialog>
    </section>

    <!-- Context Menu -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Context Menu</h2>
      <kb-context-menu>
        <div slot="trigger" class="border border-dashed border-gray-300 dark:border-zinc-600 p-8 text-center text-sm text-slate-400 dark:text-zinc-500 select-none">
          Right-click this area
        </div>
        <kb-menu-item value="cut">Cut</kb-menu-item>
        <kb-menu-item value="copy">Copy</kb-menu-item>
        <kb-menu-item value="paste">Paste</kb-menu-item>
        <kb-menu-item value="delete" destructive>Delete</kb-menu-item>
      </kb-context-menu>
    </section>

    <!-- Hover Card -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Hover Card</h2>
      <div class="flex flex-wrap gap-6 items-center">
        <kb-hover-card placement="bottom">
          <kb-button variant="outline">Hover me (bottom)</kb-button>
          <div slot="content" class="space-y-2">
            <p class="font-semibold text-sm">Project Info</p>
            <p class="text-xs text-slate-500 dark:text-zinc-400">KarbitUI — a brutalist design system built with Lit and Tailwind CSS.</p>
            <p class="text-xs text-slate-400 dark:text-zinc-500">v0.1.0 · MIT License</p>
          </div>
        </kb-hover-card>
        <kb-hover-card placement="top" size="sm">
          <kb-button variant="outline">Hover me (top)</kb-button>
          <div slot="content">
            <p class="text-xs text-slate-500 dark:text-zinc-400">A small hover card above the trigger.</p>
          </div>
        </kb-hover-card>
      </div>
    </section>
  </div>
</template>
