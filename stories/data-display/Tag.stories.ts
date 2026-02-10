import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/data-display/kb-tag.js';
import '../../src/components/data-display/kb-tag-group.js';

export default {
  title: 'Data Display/Tag',
  component: 'kb-tag',
  render: (args) => html`<kb-tag ${spreadAttrs(args)}>Status</kb-tag>`,
  args: { variant: 'subtle', size: 'md' },
  argTypes: {
    variant: { control: 'select', options: ['solid', 'outline', 'subtle'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    colorScheme: { control: 'select', options: [undefined, 'black', 'red', 'blue', 'green', 'yellow'] },
    closable: { control: 'boolean' },
    interactive: { control: 'boolean' },
    dot: { control: 'boolean' },
  },
} satisfies Meta;

type S = StoryObj;

export const Subtle: S = {};

export const Solid: S = { args: { variant: 'solid' } };

export const Outline: S = { args: { variant: 'outline' } };

export const Small: S = { args: { size: 'sm' } };

export const Large: S = { args: { size: 'lg' } };

export const Closable: S = {
  args: { closable: true },
  render: (args) => html`
    <div class="flex items-center gap-3">
      <kb-tag ${spreadAttrs(args)} color-scheme="blue">Filter A</kb-tag>
      <kb-tag ${spreadAttrs(args)} color-scheme="green">Filter B</kb-tag>
      <kb-tag ${spreadAttrs(args)} color-scheme="red">Filter C</kb-tag>
    </div>
  `,
};

export const Interactive: S = {
  args: { interactive: true, variant: 'outline' },
  render: (args) => html`
    <div class="flex items-center gap-3">
      <kb-tag ${spreadAttrs(args)} @kb-click=${() => { const el = document.getElementById('tag-click-out'); if (el) el.textContent = 'Clicked: Design'; }}>Design</kb-tag>
      <kb-tag ${spreadAttrs(args)} @kb-click=${() => { const el = document.getElementById('tag-click-out'); if (el) el.textContent = 'Clicked: Engineering'; }}>Engineering</kb-tag>
      <kb-tag ${spreadAttrs(args)} @kb-click=${() => { const el = document.getElementById('tag-click-out'); if (el) el.textContent = 'Clicked: Research'; }}>Research</kb-tag>
    </div>
    <p id="tag-click-out" class="mt-4 font-mono text-xs text-slate-500 dark:text-zinc-400 h-5">Click a tag</p>
  `,
};

export const InteractiveClosable: S = {
  args: { interactive: true, closable: true, variant: 'subtle' },
  render: (args) => html`
    <div class="flex items-center gap-3">
      <kb-tag ${spreadAttrs(args)} color-scheme="blue">React</kb-tag>
      <kb-tag ${spreadAttrs(args)} color-scheme="green">Vue</kb-tag>
      <kb-tag ${spreadAttrs(args)} color-scheme="yellow">Svelte</kb-tag>
      <kb-tag ${spreadAttrs(args)} color-scheme="red">Angular</kb-tag>
    </div>
  `,
};

export const StatusDots: S = {
  render: () => html`
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-3">
        <kb-tag variant="subtle" dot color-scheme="green">Healthy</kb-tag>
        <kb-tag variant="subtle" dot color-scheme="yellow">Degraded</kb-tag>
        <kb-tag variant="subtle" dot color-scheme="red">Critical</kb-tag>
        <kb-tag variant="subtle" dot color-scheme="blue">Maintenance</kb-tag>
      </div>
      <div class="flex items-center gap-3">
        <kb-tag variant="outline" dot color-scheme="green">Online</kb-tag>
        <kb-tag variant="outline" dot color-scheme="red">Offline</kb-tag>
        <kb-tag variant="outline" dot>Unknown</kb-tag>
      </div>
    </div>
  `,
};

export const WithIcon: S = {
  render: () => html`
    <div class="flex items-center gap-3">
      <kb-tag variant="outline" color-scheme="blue">
        <svg slot="icon" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>
        Tagged
      </kb-tag>
      <kb-tag variant="subtle" color-scheme="green">
        <svg slot="icon" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        Verified
      </kb-tag>
      <kb-tag variant="solid" color-scheme="red">
        <svg slot="icon" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        Alert
      </kb-tag>
    </div>
  `,
};

export const ColorSchemes: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <div>
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-3">Solid</p>
        <div class="flex items-center gap-3">
          <kb-tag variant="solid" color-scheme="black">Default</kb-tag>
          <kb-tag variant="solid" color-scheme="red">Critical</kb-tag>
          <kb-tag variant="solid" color-scheme="blue">Info</kb-tag>
          <kb-tag variant="solid" color-scheme="green">Success</kb-tag>
          <kb-tag variant="solid" color-scheme="yellow">Warning</kb-tag>
        </div>
      </div>
      <div>
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-3">Outline</p>
        <div class="flex items-center gap-3">
          <kb-tag variant="outline" color-scheme="black">Default</kb-tag>
          <kb-tag variant="outline" color-scheme="red">Critical</kb-tag>
          <kb-tag variant="outline" color-scheme="blue">Info</kb-tag>
          <kb-tag variant="outline" color-scheme="green">Success</kb-tag>
          <kb-tag variant="outline" color-scheme="yellow">Warning</kb-tag>
        </div>
      </div>
      <div>
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-3">Subtle</p>
        <div class="flex items-center gap-3">
          <kb-tag variant="subtle" color-scheme="black">Default</kb-tag>
          <kb-tag variant="subtle" color-scheme="red">Critical</kb-tag>
          <kb-tag variant="subtle" color-scheme="blue">Info</kb-tag>
          <kb-tag variant="subtle" color-scheme="green">Success</kb-tag>
          <kb-tag variant="subtle" color-scheme="yellow">Warning</kb-tag>
        </div>
      </div>
    </div>
  `,
};

export const SizeComparison: S = {
  render: () => html`
    <div class="flex items-center gap-4">
      <kb-tag size="sm" variant="outline" dot color-scheme="green">Small</kb-tag>
      <kb-tag size="md" variant="outline" dot color-scheme="green">Medium</kb-tag>
      <kb-tag size="lg" variant="outline" dot color-scheme="green">Large</kb-tag>
    </div>
  `,
};

export const FilterBar: S = {
  render: () => html`
    <div class="flex flex-col gap-4">
      <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400">Active Filters</p>
      <div class="flex items-center gap-2 flex-wrap">
        <kb-tag interactive closable variant="outline" color-scheme="blue">Region: US East</kb-tag>
        <kb-tag interactive closable variant="outline" color-scheme="blue">Status: Active</kb-tag>
        <kb-tag interactive closable variant="outline" color-scheme="blue">Type: API</kb-tag>
        <kb-tag interactive closable variant="outline" color-scheme="red">Priority: High</kb-tag>
      </div>
    </div>
  `,
};

export const ServiceStatus: S = {
  render: () => html`
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-zinc-700">
        <span class="text-sm text-slate-900 dark:text-zinc-50">Auth Gateway</span>
        <kb-tag size="sm" variant="subtle" dot color-scheme="green">Operational</kb-tag>
      </div>
      <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-zinc-700">
        <span class="text-sm text-slate-900 dark:text-zinc-50">Payment Processor</span>
        <kb-tag size="sm" variant="subtle" dot color-scheme="yellow">Degraded</kb-tag>
      </div>
      <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-zinc-700">
        <span class="text-sm text-slate-900 dark:text-zinc-50">Search Index</span>
        <kb-tag size="sm" variant="subtle" dot color-scheme="red">Down</kb-tag>
      </div>
      <div class="flex items-center justify-between py-3">
        <span class="text-sm text-slate-900 dark:text-zinc-50">CDN Edge</span>
        <kb-tag size="sm" variant="subtle" dot color-scheme="green">Operational</kb-tag>
      </div>
    </div>
  `,
};

export const CategoryTags: S = {
  render: () => html`
    <div class="flex flex-col gap-4">
      <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400">Categories</p>
      <div class="flex items-center gap-2 flex-wrap">
        <kb-tag interactive variant="subtle">All</kb-tag>
        <kb-tag interactive variant="outline">Infrastructure</kb-tag>
        <kb-tag interactive variant="outline">Security</kb-tag>
        <kb-tag interactive variant="outline">Performance</kb-tag>
        <kb-tag interactive variant="outline">Monitoring</kb-tag>
        <kb-tag interactive variant="outline">Deployment</kb-tag>
      </div>
    </div>
  `,
};

export const Draggable: S = {
  render: () => html`
    <div class="flex flex-col gap-4">
      <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400">Drag these tags</p>
      <div class="flex items-center gap-3">
        <kb-tag kb-draggable value="react" variant="outline" color-scheme="blue">React</kb-tag>
        <kb-tag kb-draggable value="vue" variant="outline" color-scheme="green">Vue</kb-tag>
        <kb-tag kb-draggable value="svelte" variant="outline" color-scheme="yellow">Svelte</kb-tag>
      </div>
      <p class="text-xs text-slate-400 dark:text-zinc-500">Tags show grab cursor and fade to 40% opacity while dragging</p>
    </div>
  `,
};

export const Reorderable: S = {
  render: () => html`
    <div class="flex flex-col gap-4">
      <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400">Drag to reorder</p>
      <kb-tag-group reorderable @kb-reorder=${(e: CustomEvent<{ order: string[] }>) => {
        const el = document.getElementById('reorder-output');
        if (el) el.textContent = 'Order: ' + e.detail.order.join(', ');
      }}>
        <kb-tag kb-draggable value="alpha" variant="outline">Alpha</kb-tag>
        <kb-tag kb-draggable value="beta" variant="outline">Beta</kb-tag>
        <kb-tag kb-draggable value="gamma" variant="outline">Gamma</kb-tag>
        <kb-tag kb-draggable value="delta" variant="outline">Delta</kb-tag>
        <kb-tag kb-draggable value="epsilon" variant="outline">Epsilon</kb-tag>
      </kb-tag-group>
      <p id="reorder-output" class="font-mono text-xs text-slate-400 dark:text-zinc-500 h-5">Drag tags to reorder</p>
    </div>
  `,
};

export const ReorderableWithClose: S = {
  render: () => html`
    <div class="flex flex-col gap-4">
      <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400">Reorderable + Closable Filters</p>
      <kb-tag-group reorderable @kb-reorder=${(e: CustomEvent<{ order: string[] }>) => {
        const el = document.getElementById('reorder-close-output');
        if (el) el.textContent = 'Order: ' + e.detail.order.join(', ');
      }}>
        <kb-tag kb-draggable closable value="region" variant="outline" color-scheme="blue">Region: US East</kb-tag>
        <kb-tag kb-draggable closable value="status" variant="outline" color-scheme="green">Status: Active</kb-tag>
        <kb-tag kb-draggable closable value="type" variant="outline" color-scheme="blue">Type: API</kb-tag>
        <kb-tag kb-draggable closable value="priority" variant="outline" color-scheme="red">Priority: High</kb-tag>
        <kb-tag kb-draggable closable value="team" variant="outline" color-scheme="yellow">Team: Platform</kb-tag>
      </kb-tag-group>
      <p id="reorder-close-output" class="font-mono text-xs text-slate-400 dark:text-zinc-500 h-5">Drag to reorder, click × to dismiss</p>
    </div>
  `,
};

export const TagGroupGaps: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <div>
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-3">Small gap</p>
        <kb-tag-group gap="sm">
          <kb-tag variant="subtle" size="sm">React</kb-tag>
          <kb-tag variant="subtle" size="sm">Vue</kb-tag>
          <kb-tag variant="subtle" size="sm">Svelte</kb-tag>
          <kb-tag variant="subtle" size="sm">Angular</kb-tag>
          <kb-tag variant="subtle" size="sm">Solid</kb-tag>
        </kb-tag-group>
      </div>
      <div>
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-3">Medium gap (default)</p>
        <kb-tag-group gap="md">
          <kb-tag variant="outline">React</kb-tag>
          <kb-tag variant="outline">Vue</kb-tag>
          <kb-tag variant="outline">Svelte</kb-tag>
          <kb-tag variant="outline">Angular</kb-tag>
          <kb-tag variant="outline">Solid</kb-tag>
        </kb-tag-group>
      </div>
      <div>
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-3">Large gap</p>
        <kb-tag-group gap="lg">
          <kb-tag variant="solid" size="lg">React</kb-tag>
          <kb-tag variant="solid" size="lg">Vue</kb-tag>
          <kb-tag variant="solid" size="lg">Svelte</kb-tag>
          <kb-tag variant="solid" size="lg">Angular</kb-tag>
          <kb-tag variant="solid" size="lg">Solid</kb-tag>
        </kb-tag-group>
      </div>
    </div>
  `,
};
