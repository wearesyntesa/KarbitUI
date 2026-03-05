import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/forms/kb-editable.js';

export default {
  title: 'Forms/Editable',
  component: 'kb-editable',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <p class="text-sm text-gray-600 dark:text-zinc-400">
      This is some paragraph text with an
      <kb-editable value="editable portion"></kb-editable>
      inline.
    </p>
  `,
};

export const WithPlaceholder: S = {
  render: () => html`
    <p class="text-sm text-gray-600 dark:text-zinc-400">
      Click the placeholder to add a
      <kb-editable placeholder="name here..."></kb-editable>
      value.
    </p>
  `,
};

export const Sizes: S = {
  render: () => html`
    <div class="flex flex-col gap-4">
      <p class="text-xs text-gray-600 dark:text-zinc-400">XS: <kb-editable size="xs" value="Extra Small"></kb-editable> text</p>
      <p class="text-sm text-gray-600 dark:text-zinc-400">SM: <kb-editable size="sm" value="Small"></kb-editable> text</p>
      <p class="text-sm text-gray-600 dark:text-zinc-400">MD: <kb-editable size="md" value="Medium (default)"></kb-editable> text</p>
      <p class="text-base text-gray-600 dark:text-zinc-400">LG: <kb-editable size="lg" value="Large"></kb-editable> text</p>
      <p class="text-lg text-gray-600 dark:text-zinc-400">XL: <kb-editable size="xl" value="Extra Large"></kb-editable> text</p>
    </div>
  `,
};

export const Invalid: S = {
  render: () => html`
    <p class="text-sm text-gray-600 dark:text-zinc-400">
      This field is
      <kb-editable value="invalid value" invalid></kb-editable>
      — shown with a red underline.
    </p>
  `,
};

export const DoubleClickActivation: S = {
  render: () => html`
    <p class="text-sm text-gray-600 dark:text-zinc-400">
      Double-click to edit:
      <kb-editable value="Double-click me" activation="dblclick"></kb-editable>
    </p>
  `,
};

export const Disabled: S = {
  render: () => html`
    <p class="text-sm text-gray-600 dark:text-zinc-400">
      This value is locked:
      <kb-editable value="Cannot edit this" disabled></kb-editable>
    </p>
  `,
};

export const SubmitOnBlurOff: S = {
  name: 'Submit on Blur Off',
  render: () => html`
    <div>
      <p class="text-sm text-gray-500 dark:text-zinc-400 mb-4">Click away without pressing Enter — changes will be discarded. Use Enter to confirm or Escape to cancel.</p>
      <p class="text-sm text-gray-600 dark:text-zinc-400">
        Edit this:
        <kb-editable value="Click away to test" .submitOnBlur=${false}></kb-editable>
      </p>
    </div>
  `,
};

export const StartInEditMode: S = {
  render: () => html`
    <p class="text-sm text-gray-600 dark:text-zinc-400">
      Already editing:
      <kb-editable value="Already editing" start-with-edit-view></kb-editable>
    </p>
  `,
};

export const KeyboardNavigation: S = {
  name: 'Keyboard Navigation',
  render: () => html`
    <div>
      <p class="text-sm text-gray-500 dark:text-zinc-400 mb-4">Focus the text and press Enter/Space to edit. While editing, Enter confirms and Escape cancels.</p>
      <p class="text-sm text-gray-600 dark:text-zinc-400">
        Try keyboard controls:
        <kb-editable value="Focus and press Enter"></kb-editable>
      </p>
    </div>
  `,
};

export const AllFeatures: S = {
  name: 'All Features',
  render: () => html`
    <div class="flex flex-col gap-4">
      <p class="text-sm text-gray-600 dark:text-zinc-400">Default: <kb-editable value="Click to edit"></kb-editable> inline</p>
      <p class="text-sm text-gray-600 dark:text-zinc-400">Placeholder: <kb-editable placeholder="Empty placeholder..."></kb-editable></p>
      <p class="text-sm text-gray-600 dark:text-zinc-400">Double-click: <kb-editable value="Double-click" activation="dblclick"></kb-editable></p>
      <p class="text-sm text-gray-600 dark:text-zinc-400">Invalid: <kb-editable value="Invalid state" invalid></kb-editable></p>
      <p class="text-sm text-gray-600 dark:text-zinc-400">Disabled: <kb-editable value="Disabled" disabled></kb-editable></p>
      <p class="text-base text-gray-600 dark:text-zinc-400">Large: <kb-editable size="lg" value="Large size"></kb-editable></p>
    </div>
  `,
};
