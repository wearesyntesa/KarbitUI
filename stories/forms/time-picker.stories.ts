import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/forms/kb-time-picker.js';

export default {
  title: 'Forms/TimePicker',
  component: 'kb-time-picker',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <kb-time-picker placeholder="Select time..."></kb-time-picker>
  `,
};

export const WithValue: S = {
  render: () => html`
    <kb-time-picker value="14:30" clearable></kb-time-picker>
  `,
};

export const TwelveHour: S = {
  name: '12-Hour Format',
  render: () => html`
    <kb-time-picker value="14:30" format="12h" clearable></kb-time-picker>
  `,
};

export const MinuteStep: S = {
  render: () => html`
    <kb-time-picker placeholder="5 min steps..." minute-step="5"></kb-time-picker>
  `,
};

export const Variants: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <kb-time-picker variant="outline" placeholder="Outline..."></kb-time-picker>
      <kb-time-picker variant="filled" placeholder="Filled..."></kb-time-picker>
      <kb-time-picker variant="flushed" placeholder="Flushed..."></kb-time-picker>
    </div>
  `,
};

export const Sizes: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <kb-time-picker size="xs" placeholder="XS"></kb-time-picker>
      <kb-time-picker size="sm" placeholder="SM"></kb-time-picker>
      <kb-time-picker size="md" placeholder="MD"></kb-time-picker>
      <kb-time-picker size="lg" placeholder="LG"></kb-time-picker>
      <kb-time-picker size="xl" placeholder="XL"></kb-time-picker>
    </div>
  `,
};

export const Disabled: S = {
  render: () => html`
    <kb-time-picker value="09:00" disabled></kb-time-picker>
  `,
};

export const Invalid: S = {
  render: () => html`
    <kb-time-picker value="09:00" invalid></kb-time-picker>
  `,
};
