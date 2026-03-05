import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/forms/kb-number-input.js';

export default {
  title: 'Forms/NumberInput',
  component: 'kb-number-input',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <kb-number-input value="5" min="0" max="100"></kb-number-input>
  `,
};

export const Sizes: S = {
  render: () => html`
    <div class="flex flex-col gap-4" style="max-width:200px">
      <kb-number-input size="xs" value="10" min="0" max="99"></kb-number-input>
      <kb-number-input size="sm" value="20" min="0" max="99"></kb-number-input>
      <kb-number-input size="md" value="30" min="0" max="99"></kb-number-input>
      <kb-number-input size="lg" value="40" min="0" max="99"></kb-number-input>
      <kb-number-input size="xl" value="50" min="0" max="99"></kb-number-input>
    </div>
  `,
};

export const WithStep: S = {
  render: () => html`
    <kb-number-input value="0" min="-100" max="100" step="10" style="max-width:200px"></kb-number-input>
  `,
};

export const Disabled: S = {
  render: () => html`
    <kb-number-input value="42" disabled style="max-width:200px"></kb-number-input>
  `,
};

export const Invalid: S = {
  render: () => html`
    <kb-number-input value="0" invalid style="max-width:200px"></kb-number-input>
  `,
};

export const MinMaxClamped: S = {
  name: 'Min/Max Clamped',
  render: () => html`
    <kb-number-input value="0" min="0" max="10" step="1" style="max-width:200px"></kb-number-input>
  `,
};
