import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/forms/kb-input.js';

type Args = {
  placeholder?: string;
  variant?: string;
  size?: string;
  value?: string;
  disabled?: boolean;
  readonly?: boolean;
  type?: string;
};

export default {
  title: 'Forms/Input',
  component: 'kb-input',
  render: (args) => html`<kb-input ${spreadAttrs(args)}></kb-input>`,
  args: { placeholder: 'Type something...', variant: 'outline', size: 'md' },
} satisfies Meta<Args>;

type S = StoryObj<Args>;

export const Outline: S = {};

export const Filled: S = { args: { variant: 'filled' } };

export const Flushed: S = { args: { variant: 'flushed' } };

export const AllSizes: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:400px;">
      <kb-input size="xs" placeholder="Extra Small (xs)"></kb-input>
      <kb-input size="sm" placeholder="Small (sm)"></kb-input>
      <kb-input size="md" placeholder="Medium (md)"></kb-input>
      <kb-input size="lg" placeholder="Large (lg)"></kb-input>
      <kb-input size="xl" placeholder="Extra Large (xl)"></kb-input>
    </div>
  `,
};

export const AllVariants: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:400px;">
      <kb-input variant="outline" placeholder="Outline variant"></kb-input>
      <kb-input variant="filled" placeholder="Filled variant"></kb-input>
      <kb-input variant="flushed" placeholder="Flushed variant"></kb-input>
    </div>
  `,
};

export const WithValue: S = { args: { value: 'Hello World' } };

export const Disabled: S = { args: { disabled: true, value: 'Disabled input' } };

export const Invalid: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:400px;">
      <kb-input variant="outline" invalid placeholder="Outline invalid"></kb-input>
      <kb-input variant="filled" invalid placeholder="Filled invalid"></kb-input>
      <kb-input variant="flushed" invalid placeholder="Flushed invalid"></kb-input>
    </div>
  `,
};

export const Readonly: S = { args: { readonly: true, value: 'Read only text' } };

export const Password: S = { args: { type: 'password', placeholder: 'Enter password...' } };

export const WithIconLeft: S = {
  render: () => html`
    <div style="max-width:400px;">
      <kb-input placeholder="Search...">
        <span slot="icon-left"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></span>
      </kb-input>
    </div>
  `,
};

export const WithIconRight: S = {
  render: () => html`
    <div style="max-width:400px;">
      <kb-input placeholder="Enter email...">
        <span slot="icon-right"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><rect width="20" height="16" x="2" y="4"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></span>
      </kb-input>
    </div>
  `,
};

export const WithBothIcons: S = {
  render: () => html`
    <div style="max-width:400px;">
      <kb-input placeholder="Search users...">
        <span slot="icon-left"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></span>
        <span slot="icon-right"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
      </kb-input>
    </div>
  `,
};

export const WithAddonLeft: S = {
  render: () => html`
    <div style="max-width:400px;">
      <kb-input placeholder="example.com">
        <span slot="addon-left">https://</span>
      </kb-input>
    </div>
  `,
};

export const WithAddonRight: S = {
  render: () => html`
    <div style="max-width:400px;">
      <kb-input placeholder="mysite">
        <span slot="addon-right">.com</span>
      </kb-input>
    </div>
  `,
};

export const WithBothAddons: S = {
  render: () => html`
    <div style="max-width:500px;">
      <kb-input placeholder="yoursite">
        <span slot="addon-left">https://</span>
        <span slot="addon-right">.com</span>
      </kb-input>
    </div>
  `,
};

export const Clearable: S = {
  render: () => html`
    <div style="max-width:400px;">
      <kb-input placeholder="Type to see clear button..." clearable value="Clear me"></kb-input>
    </div>
  `,
};

export const Loading: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:400px;">
      <kb-input placeholder="Loading..." loading></kb-input>
      <kb-input placeholder="Loading with icon..." loading>
        <span slot="icon-left"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></span>
      </kb-input>
    </div>
  `,
};

export const MaxLength: S = {
  render: () => html`
    <div style="max-width:400px;">
      <kb-input placeholder="Max 20 characters" max-length="20"></kb-input>
    </div>
  `,
};

export const IconsAllSizes: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:400px;">
      ${(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(
        (size) => html`
          <kb-input size=${size} placeholder="${size} with icon">
            <span slot="icon-left"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></span>
          </kb-input>
        `,
      )}
    </div>
  `,
};

export const KitchenSink: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:24px;max-width:500px;">
      <div style="display:flex;flex-direction:column;gap:8px;">
        <strong style="font-size:14px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;">Variants</strong>
        <kb-input variant="outline" placeholder="Outline"></kb-input>
        <kb-input variant="filled" placeholder="Filled"></kb-input>
        <kb-input variant="flushed" placeholder="Flushed"></kb-input>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;">
        <strong style="font-size:14px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;">States</strong>
        <kb-input placeholder="Default"></kb-input>
        <kb-input disabled value="Disabled"></kb-input>
        <kb-input readonly value="Readonly"></kb-input>
        <kb-input invalid placeholder="Invalid"></kb-input>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;">
        <strong style="font-size:14px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;">Features</strong>
        <kb-input placeholder="Search..." clearable value="Clearable">
          <span slot="icon-left"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></span>
        </kb-input>
        <kb-input placeholder="Loading..." loading>
          <span slot="icon-left"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></span>
        </kb-input>
        <kb-input placeholder="yoursite">
          <span slot="addon-left">https://</span>
          <span slot="addon-right">.com</span>
        </kb-input>
        <kb-input type="password" placeholder="Enter password...">
          <span slot="icon-left"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><rect width="18" height="11" x="3" y="11"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
        </kb-input>
      </div>
    </div>
  `,
};
