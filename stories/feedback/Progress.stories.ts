import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/feedback/kb-progress.js';

export default {
  title: 'Feedback/Progress',
  component: 'kb-progress',
  render: (args) => html`<div style="max-width:400px;"><kb-progress ${spreadAttrs(args)}></kb-progress></div>`,
  args: { value: 60, size: 'md' },
} satisfies Meta;

type S = StoryObj;

export const Default: S = {};

export const ShowValue: S = { args: { 'show-value': true } };

export const Indeterminate: S = { args: { indeterminate: true } };

export const Full: S = { args: { value: 100, 'show-value': true } };

export const Empty: S = { args: { value: 0, 'show-value': true } };

export const AllSizes: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;max-width:400px;">
      <kb-progress value="40" size="xs"></kb-progress>
      <kb-progress value="55" size="sm"></kb-progress>
      <kb-progress value="70" size="md"></kb-progress>
      <kb-progress value="85" size="lg"></kb-progress>
    </div>
  `,
};

export const ColorSchemes: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;max-width:400px;">
      <kb-progress value="70" color-scheme="blue" show-value></kb-progress>
      <kb-progress value="70" color-scheme="green" show-value></kb-progress>
      <kb-progress value="70" color-scheme="red" show-value></kb-progress>
      <kb-progress value="70" color-scheme="yellow" show-value></kb-progress>
      <kb-progress value="70" color-scheme="black" show-value></kb-progress>
    </div>
  `,
};

export const Striped: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;max-width:400px;">
      <kb-progress value="65" striped size="md"></kb-progress>
      <kb-progress value="65" striped size="lg" color-scheme="green"></kb-progress>
      <kb-progress value="65" striped size="lg" color-scheme="red"></kb-progress>
      <kb-progress value="65" striped size="lg" color-scheme="yellow"></kb-progress>
    </div>
  `,
};

export const StripedAnimated: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;max-width:400px;">
      <kb-progress value="45" striped animated size="md" color-scheme="blue"></kb-progress>
      <kb-progress value="70" striped animated size="lg" color-scheme="green"></kb-progress>
      <kb-progress value="90" striped animated size="lg" color-scheme="red"></kb-progress>
    </div>
  `,
};

export const Segments: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;max-width:400px;">
      <kb-progress value="3" max="5" segments="5" show-value value-label="3 of 5" size="md"></kb-progress>
      <kb-progress value="60" segments="4" show-value size="lg" color-scheme="blue"></kb-progress>
      <kb-progress value="7" max="10" segments="10" show-value value-label="Step 7 of 10" size="md" color-scheme="green"></kb-progress>
    </div>
  `,
};

export const AutoColor: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;max-width:400px;">
      <kb-progress value="30" auto-color show-value size="md"></kb-progress>
      <kb-progress value="60" auto-color show-value size="md"></kb-progress>
      <kb-progress value="75" auto-color show-value size="md"></kb-progress>
      <kb-progress value="90" auto-color show-value size="md"></kb-progress>
      <kb-progress value="100" auto-color show-value size="md"></kb-progress>
    </div>
  `,
};

export const WithLabel: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:20px;max-width:400px;">
      <kb-progress value="42" show-value color-scheme="blue" size="md">
        <span slot="label">Uploading files</span>
      </kb-progress>
      <kb-progress value="78" show-value color-scheme="green" size="md">
        <span slot="label">Storage used</span>
      </kb-progress>
      <kb-progress value="92" show-value auto-color size="md" striped>
        <span slot="label">CPU Usage</span>
      </kb-progress>
    </div>
  `,
};

export const CustomValueLabel: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:20px;max-width:400px;">
      <kb-progress value="1200" max="2000" show-value value-label="1.2 GB / 2 GB" color-scheme="blue" size="md">
        <span slot="label">Storage</span>
      </kb-progress>
      <kb-progress value="3" max="5" show-value value-label="3 of 5 complete" color-scheme="green" size="md" segments="5">
        <span slot="label">Onboarding Steps</span>
      </kb-progress>
      <kb-progress value="847" max="1000" show-value value-label="847 / 1,000 requests" auto-color size="md">
        <span slot="label">API Rate Limit</span>
      </kb-progress>
    </div>
  `,
};

export const IndeterminateVariants: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;max-width:400px;">
      <kb-progress indeterminate size="xs"></kb-progress>
      <kb-progress indeterminate size="sm" color-scheme="blue"></kb-progress>
      <kb-progress indeterminate size="md" color-scheme="green"></kb-progress>
      <kb-progress indeterminate size="lg" color-scheme="red" striped></kb-progress>
    </div>
  `,
};

export const KitchenSink: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:24px;max-width:500px;">
      <kb-progress value="42" show-value color-scheme="blue" striped animated size="lg">
        <span slot="label">Uploading</span>
      </kb-progress>

      <kb-progress value="92" show-value auto-color striped size="md">
        <span slot="label">Disk Usage</span>
      </kb-progress>

      <kb-progress value="4" max="6" segments="6" show-value value-label="Step 4 of 6" color-scheme="green" size="md">
        <span slot="label">Setup Progress</span>
      </kb-progress>

      <kb-progress indeterminate size="sm" color-scheme="blue">
        <span slot="label">Processing</span>
      </kb-progress>

      <div style="display:flex;flex-direction:column;gap:8px;">
        <kb-progress value="70" size="xs" color-scheme="blue"></kb-progress>
        <kb-progress value="70" size="sm" color-scheme="green"></kb-progress>
        <kb-progress value="70" size="md" color-scheme="yellow" striped></kb-progress>
        <kb-progress value="70" size="lg" color-scheme="red" striped animated></kb-progress>
      </div>
    </div>
  `,
};
