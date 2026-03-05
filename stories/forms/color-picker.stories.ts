import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/forms/kb-color-picker.js';

export default {
  title: 'Forms/Color Picker',
  component: 'kb-color-picker',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <kb-color-picker></kb-color-picker>
  `,
};

export const WithPresets: S = {
  render: () => html`
    <kb-color-picker
      value="#3b82f6ff"
      .presets=${[
        '#ef4444ff',
        '#f97316ff',
        '#eab308ff',
        '#22c55eff',
        '#3b82f6ff',
        '#8b5cf6ff',
        '#ec4899ff',
        '#000000ff',
        '#ffffffff',
        '#6b7280ff',
      ]}
    ></kb-color-picker>
  `,
};

export const NoAlpha: S = {
  render: () => html`
    <kb-color-picker
      value="#22c55e"
      .showAlpha=${false}
    ></kb-color-picker>
  `,
};

export const Variants: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <kb-color-picker variant="outline" value="#3b82f6ff" placeholder="Outline"></kb-color-picker>
      <kb-color-picker variant="filled" value="#ef4444ff" placeholder="Filled"></kb-color-picker>
      <kb-color-picker variant="flushed" value="#22c55eff" placeholder="Flushed"></kb-color-picker>
    </div>
  `,
};

export const Sizes: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <kb-color-picker size="xs" value="#ef4444ff"></kb-color-picker>
      <kb-color-picker size="sm" value="#f97316ff"></kb-color-picker>
      <kb-color-picker size="md" value="#3b82f6ff"></kb-color-picker>
      <kb-color-picker size="lg" value="#8b5cf6ff"></kb-color-picker>
      <kb-color-picker size="xl" value="#22c55eff"></kb-color-picker>
    </div>
  `,
};

export const Clearable: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <kb-color-picker value="#3b82f6ff" clearable placeholder="Clearable"></kb-color-picker>
      <kb-color-picker value="#ef4444ff" placeholder="Not clearable"></kb-color-picker>
    </div>
  `,
};

export const Invalid: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <kb-color-picker value="#3b82f6ff" invalid variant="outline"></kb-color-picker>
      <kb-color-picker value="#3b82f6ff" invalid variant="filled"></kb-color-picker>
      <kb-color-picker value="#3b82f6ff" invalid variant="flushed"></kb-color-picker>
    </div>
  `,
};

export const Disabled: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <kb-color-picker disabled value="#3b82f6ff"></kb-color-picker>
      <kb-color-picker disabled></kb-color-picker>
    </div>
  `,
};

export const WithPresetsAndNoAlpha: S = {
  render: () => html`
    <kb-color-picker
      value="#3b82f6"
      .showAlpha=${false}
      .presets=${['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#000000', '#ffffff']}
    ></kb-color-picker>
  `,
};

export const CustomValue: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <kb-color-picker value="#ff006680"></kb-color-picker>
      <kb-color-picker value="#00ff88ff"></kb-color-picker>
      <kb-color-picker value="#8b5cf6cc"></kb-color-picker>
    </div>
  `,
};

export const KeyboardNavigation: S = {
  name: 'Keyboard Navigation',
  render: () => html`
    <div class="max-w-xs">
      <p class="text-sm text-gray-500 dark:text-zinc-400 mb-4">Open with Enter/Space/ArrowDown. Escape to close. Tab through inputs in the panel.</p>
      <kb-color-picker value="#3b82f6ff" clearable></kb-color-picker>
    </div>
  `,
};

export const AllFeatures: S = {
  name: 'All Features',
  render: () => html`
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
      <kb-color-picker value="#3b82f6ff" clearable placeholder="Primary color"></kb-color-picker>
      <kb-color-picker
        value="#ef4444ff"
        clearable
        .presets=${['#ef4444ff', '#f97316ff', '#eab308ff', '#22c55eff', '#3b82f6ff', '#8b5cf6ff']}
      ></kb-color-picker>
      <kb-color-picker value="#22c55e" .showAlpha=${false} variant="filled"></kb-color-picker>
      <kb-color-picker disabled value="#8b5cf6ff"></kb-color-picker>
      <kb-color-picker size="sm" value="#ec4899ff" variant="flushed" clearable></kb-color-picker>
      <kb-color-picker size="lg" value="#000000ff" invalid></kb-color-picker>
    </div>
  `,
};
