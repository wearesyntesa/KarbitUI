import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/forms/kb-combobox.js';

export default {
  title: 'Forms/Combobox',
  component: 'kb-combobox',
} satisfies Meta;

type S = StoryObj;

const COUNTRIES = [
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'kr', label: 'South Korea' },
  { value: 'se', label: 'Sweden' },
  { value: 'no', label: 'Norway' },
  { value: 'id', label: 'Indonesia' },
];

export const Default: S = {
  render: () => html`
    <kb-combobox placeholder="Search country..." .options=${COUNTRIES}></kb-combobox>
  `,
};

export const WithValue: S = {
  render: () => html`
    <kb-combobox placeholder="Search..." value="de" clearable .options=${COUNTRIES}></kb-combobox>
  `,
};

export const Variants: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <kb-combobox variant="outline" placeholder="Outline..." .options=${COUNTRIES}></kb-combobox>
      <kb-combobox variant="filled" placeholder="Filled..." .options=${COUNTRIES}></kb-combobox>
      <kb-combobox variant="flushed" placeholder="Flushed..." .options=${COUNTRIES}></kb-combobox>
    </div>
  `,
};

export const Sizes: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <kb-combobox size="xs" placeholder="XS" .options=${COUNTRIES}></kb-combobox>
      <kb-combobox size="sm" placeholder="SM" .options=${COUNTRIES}></kb-combobox>
      <kb-combobox size="md" placeholder="MD" .options=${COUNTRIES}></kb-combobox>
      <kb-combobox size="lg" placeholder="LG" .options=${COUNTRIES}></kb-combobox>
      <kb-combobox size="xl" placeholder="XL" .options=${COUNTRIES}></kb-combobox>
    </div>
  `,
};

export const Disabled: S = {
  render: () => html`
    <kb-combobox disabled value="us" .options=${COUNTRIES}></kb-combobox>
  `,
};

export const Invalid: S = {
  render: () => html`
    <kb-combobox invalid placeholder="Error state..." .options=${COUNTRIES}></kb-combobox>
  `,
};
