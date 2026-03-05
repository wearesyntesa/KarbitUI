import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/layout/kb-scroll-area.define.js';

export default {
  title: 'Layout/ScrollArea',
  component: 'kb-scroll-area',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <kb-scroll-area style="max-height:200px" bordered>
      <div class="p-3 space-y-2">
        ${Array.from(
          { length: 20 },
          (_, i) => html`
          <div class="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-zinc-800 last:border-b-0">
            <span class="font-mono text-xs text-slate-400 dark:text-zinc-500">${String(i + 1).padStart(2, '0')}</span>
            <span class="text-sm text-slate-700 dark:text-zinc-300">Log entry ${i + 1}</span>
            <span class="font-mono text-xs text-slate-400 dark:text-zinc-500">14:${String(30 + i).padStart(2, '0')}:00</span>
          </div>
        `,
        )}
      </div>
    </kb-scroll-area>
  `,
};

export const Horizontal: S = {
  render: () => html`
    <kb-scroll-area direction="horizontal" style="max-width:400px" bordered>
      <div class="flex gap-3 p-3" style="width:max-content">
        ${Array.from(
          { length: 12 },
          (_, i) => html`
          <div class="flex-shrink-0 w-32 h-20 border border-gray-200 dark:border-zinc-700 flex items-center justify-center">
            <span class="font-mono text-xs text-slate-500 dark:text-zinc-400">Card ${i + 1}</span>
          </div>
        `,
        )}
      </div>
    </kb-scroll-area>
  `,
};

export const Both: S = {
  render: () => html`
    <kb-scroll-area direction="both" style="max-height:200px;max-width:400px" bordered>
      <div class="p-3" style="width:max(800px,100%);">
        ${Array.from(
          { length: 15 },
          (_, i) => html`
          <div class="flex gap-4 py-1.5 whitespace-nowrap">
            <span class="font-mono text-xs text-slate-400 dark:text-zinc-500 w-8">${String(i + 1).padStart(2, '0')}</span>
            <span class="text-sm text-slate-700 dark:text-zinc-300">This is a wide row with extra content that extends beyond the visible width to demonstrate horizontal + vertical scroll · Region: us-east-${i + 1}</span>
          </div>
        `,
        )}
      </div>
    </kb-scroll-area>
  `,
};

export const ScrollbarVisibility: S = {
  render: () => html`
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      ${(['auto', 'always', 'hover', 'never'] as const).map(
        (mode) => html`
        <div>
          <div class="font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-2">${mode}</div>
          <kb-scroll-area scrollbar=${mode} style="max-height:120px" bordered>
            <div class="p-3 space-y-1.5">
              ${Array.from(
                { length: 10 },
                (_, i) => html`
                <div class="text-sm text-slate-700 dark:text-zinc-300">Item ${i + 1}</div>
              `,
              )}
            </div>
          </kb-scroll-area>
        </div>
      `,
      )}
    </div>
  `,
};

export const NoBorder: S = {
  render: () => html`
    <div class="border border-gray-200 dark:border-zinc-700 p-4">
      <div class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-2">ACTIVITY LOG</div>
      <kb-scroll-area style="max-height:150px">
        <div class="space-y-2">
          ${Array.from(
            { length: 15 },
            (_, i) => html`
            <div class="flex items-start gap-3 text-sm">
              <span class="font-mono text-xs text-slate-400 dark:text-zinc-500 whitespace-nowrap">14:${String(30 + i).padStart(2, '0')}</span>
              <span class="text-slate-700 dark:text-zinc-300">Event ${i + 1}: Process completed successfully</span>
            </div>
          `,
          )}
        </div>
      </kb-scroll-area>
    </div>
  `,
};
