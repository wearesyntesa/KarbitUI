import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/forms/kb-date-picker.js';

export default {
  title: 'Forms/DatePicker',
  component: 'kb-date-picker',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <kb-date-picker placeholder="Pick a date..."></kb-date-picker>
  `,
};

export const WithValue: S = {
  render: () => html`
    <kb-date-picker value="2025-06-15" clearable></kb-date-picker>
  `,
};

export const MinMax: S = {
  name: 'With Min/Max Range',
  render: () => html`
    <kb-date-picker placeholder="2025 only..." min="2025-01-01" max="2025-12-31" clearable></kb-date-picker>
  `,
};

export const Variants: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <kb-date-picker variant="outline" placeholder="Outline..."></kb-date-picker>
      <kb-date-picker variant="filled" placeholder="Filled..."></kb-date-picker>
      <kb-date-picker variant="flushed" placeholder="Flushed..."></kb-date-picker>
    </div>
  `,
};

export const Sizes: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <kb-date-picker size="xs" placeholder="XS" clearable></kb-date-picker>
      <kb-date-picker size="sm" placeholder="SM" clearable></kb-date-picker>
      <kb-date-picker size="md" placeholder="MD" clearable></kb-date-picker>
      <kb-date-picker size="lg" placeholder="LG" clearable></kb-date-picker>
      <kb-date-picker size="xl" placeholder="XL" clearable></kb-date-picker>
    </div>
  `,
};

export const MonthYearNavigation: S = {
  name: 'Month & Year Navigation',
  render: () => html`
    <div class="max-w-xs">
      <p class="text-sm text-gray-500 dark:text-zinc-400 mb-4">Click the month/year header to switch between days → months → years views.</p>
      <kb-date-picker value="2025-06-15" clearable></kb-date-picker>
    </div>
  `,
};

export const TodayButton: S = {
  name: 'Today Button',
  render: () => html`
    <div class="max-w-xs">
      <p class="text-sm text-gray-500 dark:text-zinc-400 mb-4">Open the calendar to see the "Today" shortcut at the bottom.</p>
      <kb-date-picker placeholder="Select a date..." clearable></kb-date-picker>
    </div>
  `,
};

export const KeyboardNavigation: S = {
  name: 'Keyboard Navigation',
  render: () => html`
    <div class="max-w-xs">
      <p class="text-sm text-gray-500 dark:text-zinc-400 mb-4">Open with Enter/Space/ArrowDown. Use arrow keys to move between days. Enter to select, Escape to close.</p>
      <kb-date-picker placeholder="Try keyboard..." clearable></kb-date-picker>
    </div>
  `,
};

export const Clearable: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <kb-date-picker value="2025-01-15" clearable placeholder="Clearable"></kb-date-picker>
      <kb-date-picker value="2025-06-20" placeholder="Not clearable"></kb-date-picker>
    </div>
  `,
};

export const Disabled: S = {
  render: () => html`
    <kb-date-picker value="2025-03-01" disabled></kb-date-picker>
  `,
};

export const Invalid: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <kb-date-picker value="2025-03-01" invalid variant="outline"></kb-date-picker>
      <kb-date-picker value="2025-03-01" invalid variant="filled"></kb-date-picker>
      <kb-date-picker value="2025-03-01" invalid variant="flushed"></kb-date-picker>
    </div>
  `,
};

export const AllFeatures: S = {
  name: 'All Features',
  render: () => html`
    <div class="max-w-sm flex flex-col gap-6">
      <p class="text-sm text-gray-500 dark:text-zinc-400">Full-featured date picker with clearable, min/max range, all navigation modes, and keyboard support.</p>
      <kb-date-picker
        value="2025-06-15"
        min="2025-01-01"
        max="2025-12-31"
        clearable
        placeholder="Pick a date in 2025..."
      ></kb-date-picker>
    </div>
  `,
};
