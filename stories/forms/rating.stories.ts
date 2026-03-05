import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/forms/kb-rating.js';

export default {
  title: 'Forms/Rating',
  component: 'kb-rating',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <kb-rating value="3" max="5"></kb-rating>
  `,
};

export const Sizes: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <kb-rating size="xs" value="3"></kb-rating>
      <kb-rating size="sm" value="3"></kb-rating>
      <kb-rating size="md" value="3"></kb-rating>
      <kb-rating size="lg" value="3"></kb-rating>
      <kb-rating size="xl" value="3"></kb-rating>
    </div>
  `,
};

export const HalfStars: S = {
  render: () => html`
    <kb-rating value="2.5" max="5" allow-half></kb-rating>
  `,
};

export const ReadOnly: S = {
  render: () => html`
    <kb-rating value="4" max="5" readonly></kb-rating>
  `,
};

export const Disabled: S = {
  render: () => html`
    <kb-rating value="2" max="5" disabled></kb-rating>
  `,
};

export const TenStars: S = {
  name: '10 Stars',
  render: () => html`
    <kb-rating value="7" max="10" size="sm"></kb-rating>
  `,
};
