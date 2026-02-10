import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/forms/kb-radio.js';
import '../../src/components/forms/kb-radio-group.js';

export default {
  title: 'Forms/Radio',
  component: 'kb-radio',
  render: (args) => html`<kb-radio ${spreadAttrs(args)}>Option A</kb-radio>`,
  args: { name: 'demo', value: 'a', size: 'md' },
} satisfies Meta;

type S = StoryObj;

export const Default: S = {};

export const Checked: S = { args: { checked: true } };

export const Disabled: S = { args: { disabled: true } };

export const DisabledChecked: S = { args: { disabled: true, checked: true } };

export const Invalid: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <kb-radio name="inv" value="a" invalid>Unchecked invalid</kb-radio>
      <kb-radio name="inv" value="b" invalid checked>Checked invalid (shows checked color)</kb-radio>
    </div>
  `,
};

export const WithDescription: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <kb-radio name="desc" value="free" checked>
        Free Plan
        <span slot="description">Basic features for personal use.</span>
      </kb-radio>
      <kb-radio name="desc" value="pro" color-scheme="green">
        Pro Plan
        <span slot="description">Advanced features for professionals.</span>
      </kb-radio>
      <kb-radio name="desc" value="ent" invalid>
        Enterprise
        <span slot="description">This option is currently unavailable.</span>
      </kb-radio>
    </div>
  `,
};

export const AllSizes: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <kb-radio name="sz" value="xs" size="xs" checked>Extra Small</kb-radio>
      <kb-radio name="sz" value="sm" size="sm" checked>Small</kb-radio>
      <kb-radio name="sz" value="md" size="md" checked>Medium</kb-radio>
      <kb-radio name="sz" value="lg" size="lg" checked>Large</kb-radio>
      <kb-radio name="sz" value="xl" size="xl" checked>Extra Large</kb-radio>
    </div>
  `,
};

export const ColorSchemes: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <kb-radio name="cs" value="blue" checked color-scheme="blue">Blue (default)</kb-radio>
      <kb-radio name="cs" value="red" checked color-scheme="red">Red</kb-radio>
      <kb-radio name="cs" value="green" checked color-scheme="green">Green</kb-radio>
      <kb-radio name="cs" value="yellow" checked color-scheme="yellow">Yellow</kb-radio>
      <kb-radio name="cs" value="black" checked color-scheme="black">Black</kb-radio>
    </div>
  `,
};

export const ColorSchemesUnchecked: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <kb-radio name="csu" value="blue" color-scheme="blue">Blue hover</kb-radio>
      <kb-radio name="csu" value="red" color-scheme="red">Red hover</kb-radio>
      <kb-radio name="csu" value="green" color-scheme="green">Green hover</kb-radio>
      <kb-radio name="csu" value="yellow" color-scheme="yellow">Yellow hover</kb-radio>
      <kb-radio name="csu" value="black" color-scheme="black">Black hover</kb-radio>
    </div>
  `,
};

export const GroupVertical: S = {
  render: () => html`
    <kb-radio-group name="framework" direction="vertical">
      <span slot="label">Favorite framework</span>
      <kb-radio value="react">React</kb-radio>
      <kb-radio value="vue">Vue</kb-radio>
      <kb-radio value="svelte">Svelte</kb-radio>
      <kb-radio value="lit" checked>Lit</kb-radio>
    </kb-radio-group>
  `,
};

export const GroupHorizontal: S = {
  render: () => html`
    <kb-radio-group name="size" direction="horizontal" color-scheme="green">
      <span slot="label">Select size</span>
      <kb-radio value="s">Small</kb-radio>
      <kb-radio value="m" checked>Medium</kb-radio>
      <kb-radio value="l">Large</kb-radio>
      <kb-radio value="xl">X-Large</kb-radio>
    </kb-radio-group>
  `,
};

export const GroupWithColorScheme: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:24px;">
      <kb-radio-group name="plan-blue" direction="vertical" color-scheme="blue">
        <span slot="label">Blue scheme</span>
        <kb-radio value="a" checked>Option A</kb-radio>
        <kb-radio value="b">Option B</kb-radio>
      </kb-radio-group>
      <kb-radio-group name="plan-red" direction="vertical" color-scheme="red">
        <span slot="label">Red scheme</span>
        <kb-radio value="a">Option A</kb-radio>
        <kb-radio value="b" checked>Option B</kb-radio>
      </kb-radio-group>
    </div>
  `,
};

export const GroupWithDescriptions: S = {
  render: () => html`
    <kb-radio-group name="pricing" direction="vertical" color-scheme="green">
      <span slot="label">Choose a plan</span>
      <kb-radio value="free">
        Free
        <span slot="description">Up to 3 projects, basic analytics.</span>
      </kb-radio>
      <kb-radio value="pro" checked>
        Pro
        <span slot="description">Unlimited projects, advanced analytics, priority support.</span>
      </kb-radio>
      <kb-radio value="enterprise">
        Enterprise
        <span slot="description">Custom solutions, dedicated account manager, SLA.</span>
      </kb-radio>
    </kb-radio-group>
  `,
};

export const KitchenSink: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:24px;max-width:400px;">
      <div style="display:flex;flex-direction:column;gap:8px;">
        <strong style="font-size:14px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;">States</strong>
        <kb-radio name="ks-state" value="default">Unchecked</kb-radio>
        <kb-radio name="ks-state" value="checked" checked>Checked</kb-radio>
        <kb-radio name="ks-disabled" value="dis" disabled>Disabled</kb-radio>
        <kb-radio name="ks-disabled-c" value="disc" disabled checked>Disabled checked</kb-radio>
        <kb-radio name="ks-inv" value="inv" invalid>Invalid</kb-radio>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;">
        <strong style="font-size:14px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;">Colors</strong>
        <div style="display:flex;gap:16px;flex-wrap:wrap;">
          <kb-radio name="ks-c1" value="blue" checked color-scheme="blue">Blue</kb-radio>
          <kb-radio name="ks-c2" value="red" checked color-scheme="red">Red</kb-radio>
          <kb-radio name="ks-c3" value="green" checked color-scheme="green">Green</kb-radio>
          <kb-radio name="ks-c4" value="yellow" checked color-scheme="yellow">Yellow</kb-radio>
          <kb-radio name="ks-c5" value="black" checked color-scheme="black">Black</kb-radio>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;">
        <strong style="font-size:14px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;">With Description</strong>
        <kb-radio name="ks-desc" value="email" checked color-scheme="green">
          Email notifications
          <span slot="description">Get notified when someone mentions you.</span>
        </kb-radio>
        <kb-radio name="ks-desc" value="push" color-scheme="blue">
          Push notifications
          <span slot="description">Receive push notifications on your device.</span>
        </kb-radio>
      </div>

      <kb-radio-group name="ks-group" direction="vertical" color-scheme="red">
        <span slot="label">Group selection</span>
        <kb-radio value="alpha" checked>Alpha</kb-radio>
        <kb-radio value="beta">Beta</kb-radio>
        <kb-radio value="gamma">Gamma</kb-radio>
      </kb-radio-group>
    </div>
  `,
};
