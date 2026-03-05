import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/forms/kb-tags-input.js';

export default {
  title: 'Forms/TagsInput',
  component: 'kb-tags-input',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <kb-tags-input placeholder="Add tag..." .values=${['react', 'lit', 'tailwind']}></kb-tags-input>
  `,
};

export const Variants: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <kb-tags-input variant="outline" placeholder="Outline..." .values=${['tag-1']}></kb-tags-input>
      <kb-tags-input variant="filled" placeholder="Filled..." .values=${['tag-1']}></kb-tags-input>
      <kb-tags-input variant="flushed" placeholder="Flushed..." .values=${['tag-1']}></kb-tags-input>
    </div>
  `,
};

export const Sizes: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <kb-tags-input size="xs" placeholder="XS" .values=${['small']}></kb-tags-input>
      <kb-tags-input size="sm" placeholder="SM" .values=${['small']}></kb-tags-input>
      <kb-tags-input size="md" placeholder="MD" .values=${['medium']}></kb-tags-input>
      <kb-tags-input size="lg" placeholder="LG" .values=${['large']}></kb-tags-input>
      <kb-tags-input size="xl" placeholder="XL" .values=${['extra']}></kb-tags-input>
    </div>
  `,
};

export const MaxTags: S = {
  render: () => html`
    <kb-tags-input placeholder="Max 3 tags..." max="3" .values=${['one', 'two']}></kb-tags-input>
  `,
};

export const Disabled: S = {
  render: () => html`
    <kb-tags-input disabled .values=${['locked', 'tags']}></kb-tags-input>
  `,
};

export const Invalid: S = {
  render: () => html`
    <kb-tags-input invalid placeholder="Error state..." .values=${['bad']}></kb-tags-input>
  `,
};
