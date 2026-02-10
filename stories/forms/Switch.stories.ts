import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/forms/kb-switch.js';

export default {
  title: 'Forms/Switch',
  component: 'kb-switch',
  args: { size: 'md' },
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`<kb-switch>Enable notifications</kb-switch>`,
};

export const Checked: S = {
  render: () => html`<kb-switch checked>Dark mode</kb-switch>`,
};

export const Disabled: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px">
      <kb-switch disabled>Disabled unchecked</kb-switch>
      <kb-switch disabled checked>Disabled checked</kb-switch>
    </div>
  `,
};

export const Invalid: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px">
      <kb-switch invalid>Must accept terms</kb-switch>
      <kb-switch invalid>
        Enable feature
        <span slot="description">This field is required</span>
      </kb-switch>
    </div>
  `,
};

export const AllSizes: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px">
      <kb-switch size="xs" checked>Extra Small</kb-switch>
      <kb-switch size="sm" checked>Small</kb-switch>
      <kb-switch size="md" checked>Medium</kb-switch>
      <kb-switch size="lg" checked>Large</kb-switch>
      <kb-switch size="xl" checked>Extra Large</kb-switch>
    </div>
  `,
};

export const ColorSchemes: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px">
      <kb-switch checked color-scheme="blue">Blue (default)</kb-switch>
      <kb-switch checked color-scheme="red">Red</kb-switch>
      <kb-switch checked color-scheme="green">Green</kb-switch>
      <kb-switch checked color-scheme="yellow">Yellow</kb-switch>
      <kb-switch checked color-scheme="black">Black</kb-switch>
    </div>
  `,
};

export const ColorSchemesUnchecked: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px">
      <kb-switch color-scheme="blue">Blue hover hint</kb-switch>
      <kb-switch color-scheme="red">Red hover hint</kb-switch>
      <kb-switch color-scheme="green">Green hover hint</kb-switch>
      <kb-switch color-scheme="yellow">Yellow hover hint</kb-switch>
      <kb-switch color-scheme="black">Black hover hint</kb-switch>
    </div>
  `,
};

export const WithDescription: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px">
      <kb-switch checked color-scheme="green">
        Auto-save
        <span slot="description">Automatically save changes every 30 seconds</span>
      </kb-switch>
      <kb-switch>
        Email notifications
        <span slot="description">Receive email updates about account activity</span>
      </kb-switch>
      <kb-switch checked color-scheme="blue">
        Two-factor authentication
        <span slot="description">Add an extra layer of security to your account</span>
      </kb-switch>
    </div>
  `,
};

export const ShowIcons: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px">
      <kb-switch show-icons size="sm">Small with icons</kb-switch>
      <kb-switch show-icons checked>Checked with icon</kb-switch>
      <kb-switch show-icons>Unchecked with icon</kb-switch>
      <kb-switch show-icons checked color-scheme="green" size="lg">Large green with icon</kb-switch>
      <kb-switch show-icons checked color-scheme="red" size="xl">Extra large red with icon</kb-switch>
    </div>
  `,
};

export const ShowIconsAllSizes: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px">
      <kb-switch show-icons checked size="xs">Extra Small</kb-switch>
      <kb-switch show-icons checked size="sm">Small</kb-switch>
      <kb-switch show-icons checked size="md">Medium</kb-switch>
      <kb-switch show-icons checked size="lg">Large</kb-switch>
      <kb-switch show-icons checked size="xl">Extra Large</kb-switch>
    </div>
  `,
};

export const LabelPositionLeft: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start">
      <kb-switch label-position="left">Label on left</kb-switch>
      <kb-switch label-position="left" checked color-scheme="green">
        Dark mode
        <span slot="description">Switch placed after the label text</span>
      </kb-switch>
      <kb-switch label-position="right" checked>Label on right (default)</kb-switch>
    </div>
  `,
};

export const Loading: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px">
      <kb-switch loading>Saving preference...</kb-switch>
      <kb-switch loading checked>Syncing...</kb-switch>
      <kb-switch loading checked color-scheme="green" size="lg">
        Updating settings
        <span slot="description">Please wait while we save your changes</span>
      </kb-switch>
    </div>
  `,
};

export const AllColorSizeCombos: S = {
  render: () => html`
    <div style="display:grid;grid-template-columns:repeat(5,auto);gap:12px;align-items:center">
      ${(['blue', 'red', 'green', 'yellow', 'black'] as const).map(color =>
        (['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => html`
          <kb-switch checked show-icons color-scheme=${color} size=${size}></kb-switch>
        `)
      )}
    </div>
  `,
};

export const KitchenSink: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:20px;max-width:400px">
      <kb-switch checked show-icons color-scheme="green">
        Auto-save enabled
        <span slot="description">Documents save every 30 seconds</span>
      </kb-switch>
      <kb-switch show-icons color-scheme="blue">
        Push notifications
        <span slot="description">Get notified about important updates</span>
      </kb-switch>
      <kb-switch checked color-scheme="red">
        Delete confirmation
        <span slot="description">Ask before permanently deleting items</span>
      </kb-switch>
      <kb-switch invalid>
        Required setting
        <span slot="description">This must be enabled to continue</span>
      </kb-switch>
      <kb-switch loading checked color-scheme="green">
        Syncing preferences
        <span slot="description">Please wait...</span>
      </kb-switch>
      <kb-switch disabled checked>
        Managed by admin
        <span slot="description">Contact your administrator to change</span>
      </kb-switch>
      <kb-switch label-position="left" checked show-icons color-scheme="black" size="lg">
        Label on left
        <span slot="description">Large size, black color scheme</span>
      </kb-switch>
    </div>
  `,
};
