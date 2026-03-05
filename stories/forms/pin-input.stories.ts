import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/forms/kb-pin-input.js';

export default {
  title: 'Forms/PinInput',
  component: 'kb-pin-input',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <kb-pin-input></kb-pin-input>
  `,
};

export const SixDigit: S = {
  render: () => html`
    <kb-pin-input length="6"></kb-pin-input>
  `,
};

export const Alphanumeric: S = {
  render: () => html`
    <kb-pin-input type="alphanumeric" length="5"></kb-pin-input>
  `,
};

export const Masked: S = {
  render: () => html`
    <kb-pin-input mask></kb-pin-input>
  `,
};

export const Sizes: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div>
        <strong style="font-size:12px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;display:block;margin-bottom:4px;">xs</strong>
        <kb-pin-input size="xs"></kb-pin-input>
      </div>
      <div>
        <strong style="font-size:12px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;display:block;margin-bottom:4px;">sm</strong>
        <kb-pin-input size="sm"></kb-pin-input>
      </div>
      <div>
        <strong style="font-size:12px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;display:block;margin-bottom:4px;">md</strong>
        <kb-pin-input size="md"></kb-pin-input>
      </div>
      <div>
        <strong style="font-size:12px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;display:block;margin-bottom:4px;">lg</strong>
        <kb-pin-input size="lg"></kb-pin-input>
      </div>
      <div>
        <strong style="font-size:12px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;display:block;margin-bottom:4px;">xl</strong>
        <kb-pin-input size="xl"></kb-pin-input>
      </div>
    </div>
  `,
};

export const Disabled: S = {
  render: () => html`
    <kb-pin-input disabled value="12"></kb-pin-input>
  `,
};

export const Invalid: S = {
  render: () => html`
    <kb-pin-input invalid value="99"></kb-pin-input>
  `,
};

export const PreFilled: S = {
  render: () => html`
    <kb-pin-input value="1234"></kb-pin-input>
  `,
};
