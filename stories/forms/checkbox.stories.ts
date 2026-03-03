import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/forms/kb-checkbox.js';
import '../../src/components/forms/kb-checkbox-group.js';

type Args = {
  size?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  invalid?: boolean;
};

export default {
  title: 'Forms/Checkbox',
  component: 'kb-checkbox',
  render: (args) => html`<kb-checkbox ${spreadAttrs(args)}>Accept terms</kb-checkbox>`,
  args: { size: 'md' },
} satisfies Meta<Args>;

type S = StoryObj<Args>;

export const Default: S = {};

export const Checked: S = { args: { checked: true } };

export const Indeterminate: S = { args: { indeterminate: true } };

export const Disabled: S = { args: { disabled: true } };

export const DisabledChecked: S = { args: { disabled: true, checked: true } };

export const Invalid: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <kb-checkbox invalid>Unchecked invalid</kb-checkbox>
      <kb-checkbox invalid checked>Checked invalid (shows checked color)</kb-checkbox>
    </div>
  `,
};

export const WithDescription: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <kb-checkbox>
        Accept terms
        <span slot="description">You must accept the terms to continue.</span>
      </kb-checkbox>
      <kb-checkbox checked color-scheme="green">
        Email notifications
        <span slot="description">Receive updates about your account.</span>
      </kb-checkbox>
      <kb-checkbox invalid>
        Required field
        <span slot="description">This field is required.</span>
      </kb-checkbox>
    </div>
  `,
};

export const AllSizes: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <kb-checkbox size="xs" checked>Extra Small</kb-checkbox>
      <kb-checkbox size="sm" checked>Small</kb-checkbox>
      <kb-checkbox size="md" checked>Medium</kb-checkbox>
      <kb-checkbox size="lg" checked>Large</kb-checkbox>
      <kb-checkbox size="xl" checked>Extra Large</kb-checkbox>
    </div>
  `,
};

export const ColorSchemes: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <kb-checkbox checked color-scheme="blue">Blue (default)</kb-checkbox>
      <kb-checkbox checked color-scheme="red">Red</kb-checkbox>
      <kb-checkbox checked color-scheme="green">Green</kb-checkbox>
      <kb-checkbox checked color-scheme="yellow">Yellow</kb-checkbox>
      <kb-checkbox checked color-scheme="black">Black</kb-checkbox>
    </div>
  `,
};

export const ColorSchemesUnchecked: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <kb-checkbox color-scheme="blue">Blue hover</kb-checkbox>
      <kb-checkbox color-scheme="red">Red hover</kb-checkbox>
      <kb-checkbox color-scheme="green">Green hover</kb-checkbox>
      <kb-checkbox color-scheme="yellow">Yellow hover</kb-checkbox>
      <kb-checkbox color-scheme="black">Black hover</kb-checkbox>
    </div>
  `,
};

export const GroupVertical: S = {
  render: () => html`
    <kb-checkbox-group direction="vertical">
      <span slot="label">Choose toppings</span>
      <kb-checkbox value="cheese" checked>Cheese</kb-checkbox>
      <kb-checkbox value="onion">Onion</kb-checkbox>
      <kb-checkbox value="pepper">Pepper</kb-checkbox>
      <kb-checkbox value="mushroom">Mushroom</kb-checkbox>
    </kb-checkbox-group>
  `,
};

export const GroupHorizontal: S = {
  render: () => html`
    <kb-checkbox-group direction="horizontal" color-scheme="green">
      <span slot="label">Select features</span>
      <kb-checkbox value="dark-mode" checked>Dark Mode</kb-checkbox>
      <kb-checkbox value="notifications">Notifications</kb-checkbox>
      <kb-checkbox value="analytics">Analytics</kb-checkbox>
    </kb-checkbox-group>
  `,
};

export const GroupWithMax: S = {
  render: () => html`
    <kb-checkbox-group direction="vertical" max="2">
      <span slot="label">Pick up to 2</span>
      <kb-checkbox value="a" checked>Option A</kb-checkbox>
      <kb-checkbox value="b" checked>Option B</kb-checkbox>
      <kb-checkbox value="c">Option C (blocked — max 2)</kb-checkbox>
      <kb-checkbox value="d">Option D (blocked — max 2)</kb-checkbox>
    </kb-checkbox-group>
  `,
};

export const IndeterminateDemo: S = {
  render: () => {
    const syncSelectAll = (container: Element) => {
      const selectAll = container.querySelector<HTMLElement>('[data-select-all]');
      const items = container.querySelectorAll<HTMLElement>('[data-item]');
      if (!selectAll) return;

      const total = items.length;
      let checkedCount = 0;
      for (const item of items) {
        if (item.hasAttribute('checked')) checkedCount++;
      }

      if (checkedCount === 0) {
        selectAll.removeAttribute('checked');
        selectAll.removeAttribute('indeterminate');
      } else if (checkedCount === total) {
        selectAll.setAttribute('checked', '');
        selectAll.removeAttribute('indeterminate');
      } else {
        selectAll.removeAttribute('checked');
        selectAll.setAttribute('indeterminate', '');
      }
    };

    const handleSelectAll = (e: Event) => {
      const container = (e.target as HTMLElement).closest('[data-indeterminate-demo]');
      if (!container) return;
      const selectAll = container.querySelector<HTMLElement>('[data-select-all]');
      const isChecked = selectAll?.hasAttribute('checked') ?? false;
      const items = container.querySelectorAll<HTMLElement>('[data-item]');
      for (const item of items) {
        if (isChecked) {
          item.setAttribute('checked', '');
        } else {
          item.removeAttribute('checked');
        }
      }
      selectAll?.removeAttribute('indeterminate');
    };

    const handleItemChange = (e: Event) => {
      const container = (e.target as HTMLElement).closest('[data-indeterminate-demo]');
      if (container) syncSelectAll(container);
    };

    return html`
      <div data-indeterminate-demo style="display:flex;flex-direction:column;gap:8px;">
        <kb-checkbox data-select-all indeterminate @kb-change=${handleSelectAll}>Select all</kb-checkbox>
        <div style="margin-left:24px;display:flex;flex-direction:column;gap:8px;">
          <kb-checkbox data-item checked @kb-change=${handleItemChange}>Item 1</kb-checkbox>
          <kb-checkbox data-item @kb-change=${handleItemChange}>Item 2</kb-checkbox>
          <kb-checkbox data-item checked @kb-change=${handleItemChange}>Item 3</kb-checkbox>
        </div>
      </div>
    `;
  },
};

export const KitchenSink: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:24px;max-width:400px;">
      <div style="display:flex;flex-direction:column;gap:8px;">
        <strong style="font-size:14px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;">States</strong>
        <kb-checkbox>Unchecked</kb-checkbox>
        <kb-checkbox checked>Checked</kb-checkbox>
        <kb-checkbox indeterminate>Indeterminate</kb-checkbox>
        <kb-checkbox disabled>Disabled</kb-checkbox>
        <kb-checkbox disabled checked>Disabled checked</kb-checkbox>
        <kb-checkbox invalid>Invalid</kb-checkbox>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;">
        <strong style="font-size:14px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;">Colors</strong>
        <div style="display:flex;gap:16px;flex-wrap:wrap;">
          <kb-checkbox checked color-scheme="blue">Blue</kb-checkbox>
          <kb-checkbox checked color-scheme="red">Red</kb-checkbox>
          <kb-checkbox checked color-scheme="green">Green</kb-checkbox>
          <kb-checkbox checked color-scheme="yellow">Yellow</kb-checkbox>
          <kb-checkbox checked color-scheme="black">Black</kb-checkbox>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;">
        <strong style="font-size:14px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;">With Description</strong>
        <kb-checkbox checked color-scheme="green">
          Email notifications
          <span slot="description">Get notified when someone mentions you.</span>
        </kb-checkbox>
        <kb-checkbox color-scheme="blue">
          Push notifications
          <span slot="description">Receive push notifications on your device.</span>
        </kb-checkbox>
      </div>

      <kb-checkbox-group direction="vertical" color-scheme="red" max="3">
        <span slot="label">Group (max 3)</span>
        <kb-checkbox value="a" checked>Alpha</kb-checkbox>
        <kb-checkbox value="b" checked>Beta</kb-checkbox>
        <kb-checkbox value="c">Gamma</kb-checkbox>
        <kb-checkbox value="d">Delta</kb-checkbox>
      </kb-checkbox-group>
    </div>
  `,
};
