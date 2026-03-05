import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/feedback/kb-circular-progress.define.js';

export default {
  title: 'Feedback/CircularProgress',
  component: 'kb-circular-progress',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <kb-circular-progress value="75" show-value></kb-circular-progress>
  `,
};

export const Sizes: S = {
  render: () => html`
    <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap">
      ${(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(
        (size) => html`
        <div class="flex flex-col items-center gap-2">
          <kb-circular-progress value="65" size=${size} show-value></kb-circular-progress>
          <span class="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-zinc-500">${size}</span>
        </div>
      `,
      )}
    </div>
  `,
};

export const ColorSchemes: S = {
  render: () => html`
    <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap">
      ${(['blue', 'green', 'red', 'yellow', 'orange', 'purple', 'pink'] as const).map(
        (scheme) => html`
        <div class="flex flex-col items-center gap-2">
          <kb-circular-progress value="70" color-scheme=${scheme} show-value></kb-circular-progress>
          <span class="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-zinc-500">${scheme}</span>
        </div>
      `,
      )}
    </div>
  `,
};

export const Indeterminate: S = {
  render: () => html`
    <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap">
      <kb-circular-progress indeterminate size="sm"></kb-circular-progress>
      <kb-circular-progress indeterminate size="md" color-scheme="green"></kb-circular-progress>
      <kb-circular-progress indeterminate size="lg" color-scheme="purple"></kb-circular-progress>
    </div>
  `,
};

export const CustomThickness: S = {
  render: () => html`
    <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap">
      <div class="flex flex-col items-center gap-2">
        <kb-circular-progress value="60" thickness=${0.5} show-value></kb-circular-progress>
        <span class="font-mono text-[10px] text-slate-400 dark:text-zinc-500">thin (0.5)</span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <kb-circular-progress value="60" show-value></kb-circular-progress>
        <span class="font-mono text-[10px] text-slate-400 dark:text-zinc-500">default (1)</span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <kb-circular-progress value="60" thickness=${2} show-value></kb-circular-progress>
        <span class="font-mono text-[10px] text-slate-400 dark:text-zinc-500">thick (2)</span>
      </div>
    </div>
  `,
};

export const CustomLabel: S = {
  render: () => html`
    <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap">
      <kb-circular-progress value="42" show-value value-label="42/100" size="lg"></kb-circular-progress>
      <kb-circular-progress value="100" show-value value-label="Done" size="lg" color-scheme="green"></kb-circular-progress>
    </div>
  `,
};

export const ProgressValues: S = {
  render: () => html`
    <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap">
      ${[0, 25, 50, 75, 100].map(
        (val) => html`
        <kb-circular-progress value=${val} show-value size="sm"></kb-circular-progress>
      `,
      )}
    </div>
  `,
};
