import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/navigation/kb-steps.js';
import '../../src/components/navigation/kb-step.js';

export default {
  title: 'Navigation/Steps',
  component: 'kb-steps',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <kb-steps current="1">
      <kb-step label="Account"></kb-step>
      <kb-step label="Profile"></kb-step>
      <kb-step label="Review"></kb-step>
    </kb-steps>
  `,
};

export const AllComplete: S = {
  render: () => html`
    <kb-steps current="3">
      <kb-step label="Account"></kb-step>
      <kb-step label="Profile"></kb-step>
      <kb-step label="Review"></kb-step>
    </kb-steps>
  `,
};

export const FirstStep: S = {
  render: () => html`
    <kb-steps current="0">
      <kb-step label="Account"></kb-step>
      <kb-step label="Profile"></kb-step>
      <kb-step label="Review"></kb-step>
    </kb-steps>
  `,
};

export const Vertical: S = {
  render: () => html`
    <kb-steps current="1" orientation="vertical">
      <kb-step label="Create account"></kb-step>
      <kb-step label="Set up profile"></kb-step>
      <kb-step label="Configure settings"></kb-step>
      <kb-step label="Review & submit"></kb-step>
    </kb-steps>
  `,
};

export const Sizes: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:32px;">
      <div>
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-3">md</p>
        <kb-steps current="1" size="md">
          <kb-step label="Account"></kb-step>
          <kb-step label="Profile"></kb-step>
          <kb-step label="Review"></kb-step>
        </kb-steps>
      </div>
      <div>
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-3">lg</p>
        <kb-steps current="1" size="lg">
          <kb-step label="Account"></kb-step>
          <kb-step label="Profile"></kb-step>
          <kb-step label="Review"></kb-step>
        </kb-steps>
      </div>
    </div>
  `,
};

export const WithDescription: S = {
  render: () => html`
    <kb-steps current="1">
      <kb-step label="Account">
        <span slot="description">Create your credentials</span>
      </kb-step>
      <kb-step label="Profile">
        <span slot="description">Tell us about yourself</span>
      </kb-step>
      <kb-step label="Review">
        <span slot="description">Verify your information</span>
      </kb-step>
    </kb-steps>
  `,
};
