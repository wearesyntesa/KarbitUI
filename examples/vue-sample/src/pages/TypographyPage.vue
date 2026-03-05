<script setup lang="ts">
const HEADING_LEVELS = ['1', '2', '3', '4', '5', '6'] as const
const HEADING_SIZES = ['4xl', '3xl', '2xl', 'xl', 'lg', 'md', 'sm', 'xs'] as const
const HEADING_TONES = ['primary', 'secondary', 'muted', 'accent', 'success', 'warning', 'error'] as const
const TEXT_SIZES = ['2xl', 'xl', 'lg', 'base', 'sm', 'xs'] as const
const TEXT_TONES = ['primary', 'secondary', 'muted', 'accent', 'success', 'warning', 'error'] as const

import { ref } from 'vue'
const searchQuery = ref('design')
</script>

<template>
  <div class="max-w-3xl mx-auto p-8 space-y-10">
    <h1 class="text-xl font-bold uppercase tracking-widest border-b border-gray-200 dark:border-zinc-700 pb-4">
      Typography
    </h1>

    <!-- Heading — levels -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Heading — levels</h2>
      <kb-heading v-for="lvl in HEADING_LEVELS" :key="lvl" :level="lvl">Heading level {{ lvl }}</kb-heading>
    </section>

    <!-- Heading — sizes -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Heading — sizes</h2>
      <kb-heading v-for="s in HEADING_SIZES" :key="s" level="3" :size="s">Size {{ s }}</kb-heading>
    </section>

    <!-- Heading — tones -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Heading — tones</h2>
      <div class="space-y-1">
        <kb-heading v-for="t in HEADING_TONES" :key="t" level="4" :tone="t">{{ t }}</kb-heading>
      </div>
    </section>

    <kb-divider />

    <!-- Text — variants -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Text — variants</h2>
      <kb-text variant="body">Body text — the default variant for paragraph content.</kb-text>
      <kb-text variant="label">Label text — used for form labels and section headings.</kb-text>
      <kb-text variant="caption">Caption text — smaller supplementary information.</kb-text>
      <kb-text variant="overline">Overline text — uppercase small tracking.</kb-text>
    </section>

    <!-- Text — sizes -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Text — sizes</h2>
      <kb-text v-for="s in TEXT_SIZES" :key="s" :size="s">Text size {{ s }}</kb-text>
    </section>

    <!-- Text — tones -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Text — tones</h2>
      <div class="space-y-1">
        <kb-text v-for="t in TEXT_TONES" :key="t" :tone="t">{{ t }} tone</kb-text>
      </div>
    </section>

    <!-- Text — truncate & clamp -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Text — truncate &amp; clamp</h2>
      <kb-text truncate>This is a very long text that should be truncated with an ellipsis when it overflows the container boundary.</kb-text>
      <kb-text :clamp="2">This is a multi-line text that should be clamped to two lines. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</kb-text>
    </section>

    <kb-divider />

    <!-- Code — inline -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Code — inline</h2>
      <kb-text>
        Use <kb-code>npm install @wearesyntesa/karbit-ui</kb-code> to install the package.
      </kb-text>
      <kb-text>
        Then import components like <kb-code>import { Button } from 'karbit-ui'</kb-code>.
      </kb-text>
    </section>

    <!-- Code — block -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Code — block</h2>
      <kb-code block language="typescript" filename="example.ts">import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-element')
export class MyElement extends LitElement {
  @property() name = 'World';

  render() {
    return html`&lt;p&gt;Hello, ${`\$\{this.name\}`}!&lt;/p&gt;`;
  }
}</kb-code>
      <kb-code block language="css" filename="styles.css">:host {
  display: block;
  font-family: monospace;
  border: 1px solid currentColor;
  padding: 1rem;
}</kb-code>
    </section>

    <kb-divider />

    <!-- Blockquote -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Blockquote</h2>
      <kb-blockquote>
        Good design is as little design as possible. Less, but better — because it concentrates on the essential aspects, and the products are not burdened with non-essentials.
        <span slot="cite">Dieter Rams</span>
      </kb-blockquote>
      <kb-blockquote variant="plain">
        Simplicity is the ultimate sophistication.
        <span slot="cite">Leonardo da Vinci</span>
      </kb-blockquote>
      <kb-blockquote color-scheme="blue">
        The details are not the details. They make the design.
        <span slot="cite">Charles Eames</span>
      </kb-blockquote>
    </section>

    <!-- Highlight — inline -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Highlight — inline</h2>
      <kb-text>
        This sentence contains <kb-highlight>highlighted text</kb-highlight> for emphasis.
      </kb-text>
      <kb-text>
        Color schemes: <kb-highlight color-scheme="yellow">yellow</kb-highlight>
        <kb-highlight color-scheme="green">green</kb-highlight>
        <kb-highlight color-scheme="blue">blue</kb-highlight>
        <kb-highlight color-scheme="red">red</kb-highlight>
        <kb-highlight color-scheme="purple">purple</kb-highlight>
      </kb-text>
    </section>

    <!-- Highlight — search mode -->
    <section class="space-y-3">
      <h2 class="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Highlight — search</h2>
      <div class="flex gap-2 items-center mb-2">
        <input
          type="text"
          :value="searchQuery"
          @input="searchQuery = ($event.target as HTMLInputElement).value"
          class="border border-gray-200 dark:border-zinc-700 bg-transparent px-2 py-1 text-sm w-40"
          placeholder="Search..."
        />
      </div>
      <kb-highlight
        :text="'KarbitUI is a brutalist design system built with Lit web components and Tailwind CSS. It follows a structured minimal design philosophy.'"
        :query="searchQuery"
      />
    </section>
  </div>
</template>
