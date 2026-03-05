import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/forms/kb-file-upload.js';

export default {
  title: 'Forms/FileUpload',
  component: 'kb-file-upload',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <kb-file-upload></kb-file-upload>
  `,
};

export const WithAccept: S = {
  render: () => html`
    <kb-file-upload accept=".pdf,.jpg,.png" multiple></kb-file-upload>
  `,
};

export const MaxSize: S = {
  render: () => html`
    <kb-file-upload accept="image/*" multiple max-size="5242880" max-files="3"></kb-file-upload>
  `,
};

export const Sizes: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <kb-file-upload size="xs"></kb-file-upload>
      <kb-file-upload size="sm"></kb-file-upload>
      <kb-file-upload size="md"></kb-file-upload>
      <kb-file-upload size="lg"></kb-file-upload>
      <kb-file-upload size="xl"></kb-file-upload>
    </div>
  `,
};

export const Disabled: S = {
  render: () => html`
    <kb-file-upload disabled></kb-file-upload>
  `,
};

export const Invalid: S = {
  render: () => html`
    <kb-file-upload invalid></kb-file-upload>
  `,
};
