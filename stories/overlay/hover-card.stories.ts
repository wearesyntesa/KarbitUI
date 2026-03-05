import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/overlay/kb-hover-card.define.js';
import '../../src/components/feedback/kb-badge.define.js';

export default {
  title: 'Overlay/HoverCard',
  component: 'kb-hover-card',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <p class="text-sm text-slate-700 dark:text-zinc-300">
      Deployed by
      <kb-hover-card>
        <a href="#" class="text-blue-500 underline underline-offset-2 font-medium">@elena</a>
        <div slot="content">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-gray-200 dark:bg-zinc-700 flex items-center justify-center font-mono text-xs text-slate-600 dark:text-zinc-300">EV</div>
              <div>
                <div class="text-sm font-medium text-slate-900 dark:text-zinc-50">Elena Vasquez</div>
                <div class="font-mono text-xs text-slate-400 dark:text-zinc-500">@elena</div>
              </div>
            </div>
            <p class="text-xs text-slate-500 dark:text-zinc-400">Senior Engineer · Platform Team</p>
            <div class="flex gap-4 text-xs text-slate-500 dark:text-zinc-400 font-mono">
              <span>12 commits this week</span>
              <span>4 PRs open</span>
            </div>
          </div>
        </div>
      </kb-hover-card>
      on Feb 21, 2026.
    </p>
  `,
};

export const PlacementTop: S = {
  render: () => html`
    <div style="margin-top: 200px">
      <p class="text-sm text-slate-700 dark:text-zinc-300">
        Issue filed by
        <kb-hover-card placement="top">
          <a href="#" class="text-blue-500 underline underline-offset-2 font-medium">@marcus</a>
          <div slot="content">
            <div class="text-sm font-medium text-slate-900 dark:text-zinc-50">Marcus Chen</div>
            <p class="text-xs text-slate-500 dark:text-zinc-400 mt-1">Frontend Lead · 47 contributions this month</p>
          </div>
        </kb-hover-card>
      </p>
    </div>
  `,
};

export const SmallSize: S = {
  render: () => html`
    <p class="text-sm text-slate-700 dark:text-zinc-300">
      Status:
      <kb-hover-card size="sm">
        <kb-badge color-scheme="green" size="xs">PASSING</kb-badge>
        <div slot="content">
          <div class="font-mono text-xs text-slate-500 dark:text-zinc-400">Build #1847</div>
          <div class="text-sm text-slate-900 dark:text-zinc-50 mt-1">All 342 tests passed in 2m 34s</div>
        </div>
      </kb-hover-card>
    </p>
  `,
};

export const LargeSize: S = {
  render: () => html`
    <p class="text-sm text-slate-700 dark:text-zinc-300">
      View the
      <kb-hover-card size="lg">
        <a href="#" class="text-blue-500 underline underline-offset-2 font-medium">deployment report</a>
        <div slot="content">
          <div class="space-y-3">
            <div class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400">Deployment Summary</div>
            <div class="grid grid-cols-2 gap-2">
              ${[
                { label: 'Duration', value: '2m 34s' },
                { label: 'Region', value: 'us-east-1' },
                { label: 'Changes', value: '14 files' },
                { label: 'Rollbacks', value: '0' },
              ].map(
                (item) => html`
                <div>
                  <div class="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-zinc-500">${item.label}</div>
                  <div class="text-sm text-slate-900 dark:text-zinc-50 font-mono">${item.value}</div>
                </div>
              `,
              )}
            </div>
          </div>
        </div>
      </kb-hover-card>
      for details.
    </p>
  `,
};

export const InitiallyOpen: S = {
  render: () => html`
    <p class="text-sm text-slate-700 dark:text-zinc-300">
      Server:
      <kb-hover-card open>
        <span class="font-mono text-blue-500 cursor-help">prod-api-01</span>
        <div slot="content">
          <div class="space-y-1.5">
            <div class="text-sm font-medium text-slate-900 dark:text-zinc-50">prod-api-01.syntesa.net</div>
            <div class="flex gap-2">
              <kb-badge color-scheme="green" size="xs">HEALTHY</kb-badge>
              <span class="font-mono text-xs text-slate-400 dark:text-zinc-500">uptime 99.97%</span>
            </div>
            <div class="font-mono text-xs text-slate-500 dark:text-zinc-400">CPU 23% · Memory 4.2 GB / 8 GB</div>
          </div>
        </div>
      </kb-hover-card>
    </p>
  `,
};
