import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/forms/kb-form-label.js';

type Args = { size?: string; required?: boolean; optional?: boolean; for?: string };

export default {
  title: 'Forms/FormLabel',
  component: 'kb-form-label',
  render: (args) => html`<kb-form-label ${spreadAttrs(args)}>Username</kb-form-label>`,
  args: { size: 'md' },
} satisfies Meta<Args>;

type S = StoryObj<Args>;

export const Default: S = {};

export const Required: S = {
  args: { required: true },
  render: (args) => html`<kb-form-label ${spreadAttrs(args)}>Email Address</kb-form-label>`,
};

export const Optional: S = {
  args: { optional: true },
  render: (args) => html`<kb-form-label ${spreadAttrs(args)}>Nickname</kb-form-label>`,
};

export const WithInfoSlot: S = {
  render: () => html`
    <kb-form-label required>
      Password
      <span slot="info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" style="width:14px;height:14px;"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></span>
    </kb-form-label>
  `,
};

export const AllSizes: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <kb-form-label size="xs" required>Extra Small (xs)</kb-form-label>
      <kb-form-label size="sm" required>Small (sm)</kb-form-label>
      <kb-form-label size="md" required>Medium (md)</kb-form-label>
      <kb-form-label size="lg" required>Large (lg)</kb-form-label>
      <kb-form-label size="xl" required>Extra Large (xl)</kb-form-label>
    </div>
  `,
};

export const WithFor: S = {
  args: { for: 'my-input' },
  render: (args) => html`<kb-form-label ${spreadAttrs(args)}>Linked Label</kb-form-label>`,
};

export const KitchenSink: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div style="display:flex;flex-direction:column;gap:8px;">
        <strong style="font-size:14px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;">States</strong>
        <kb-form-label>Default label</kb-form-label>
        <kb-form-label required>Required label</kb-form-label>
        <kb-form-label optional>Optional label</kb-form-label>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;">
        <strong style="font-size:14px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;">With Info</strong>
        <kb-form-label required>
          Email
          <span slot="info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" style="width:14px;height:14px;"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></span>
        </kb-form-label>
        <kb-form-label optional>
          Bio
          <span slot="info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" style="width:14px;height:14px;"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></span>
        </kb-form-label>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;">
        <strong style="font-size:14px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;">Sizes</strong>
        <kb-form-label size="xs">Extra small</kb-form-label>
        <kb-form-label size="sm">Small</kb-form-label>
        <kb-form-label size="md">Medium</kb-form-label>
        <kb-form-label size="lg">Large</kb-form-label>
        <kb-form-label size="xl">Extra large</kb-form-label>
      </div>
    </div>
  `,
};
