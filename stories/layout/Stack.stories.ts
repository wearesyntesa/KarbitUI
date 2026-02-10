import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/layout/kb-stack.js';
import '../../src/components/layout/kb-box.js';

const items = html`
  <kb-box p="4" bg="white">First</kb-box>
  <kb-box p="4" bg="white">Second</kb-box>
  <kb-box p="4" bg="white">Third</kb-box>
`;

export default {
  title: 'Layout/Stack',
  component: 'kb-stack',
  render: (args) => html`<kb-stack ${spreadAttrs(args)}>${items}</kb-stack>`,
  args: { spacing: '4' },
} satisfies Meta;

type S = StoryObj;

export const Vertical: S = {};

export const Horizontal: S = { args: { direction: 'horizontal' } };

export const TightSpacing: S = { args: { spacing: '1' } };

export const WideSpacing: S = { args: { spacing: '8' } };

export const WithDivider: S = {
  args: { divider: true, spacing: '4' },
  render: (args) => html`
    <kb-stack ${spreadAttrs(args)}>
      <kb-box p="4" bg="white">Section One</kb-box>
      <kb-box p="4" bg="white">Section Two</kb-box>
      <kb-box p="4" bg="white">Section Three</kb-box>
    </kb-stack>
  `,
};

export const HorizontalWithDivider: S = {
  args: { direction: 'horizontal', divider: true, spacing: '4' },
  render: (args) => html`
    <div style="height:80px;">
      <kb-stack ${spreadAttrs(args)}>
        <kb-box p="4" bg="white">Left</kb-box>
        <kb-box p="4" bg="white">Center</kb-box>
        <kb-box p="4" bg="white">Right</kb-box>
      </kb-stack>
    </div>
  `,
};

export const NestedStacks: S = {
  render: () => html`
    <kb-stack spacing="6">
      <kb-box p="4" bg="gray-100">
        <kb-stack direction="horizontal" spacing="4">
          <kb-box p="2" bg="white">Nested A</kb-box>
          <kb-box p="2" bg="white">Nested B</kb-box>
        </kb-stack>
      </kb-box>
      <kb-box p="4" bg="gray-100">
        <kb-stack direction="horizontal" spacing="4">
          <kb-box p="2" bg="white">Nested C</kb-box>
          <kb-box p="2" bg="white">Nested D</kb-box>
        </kb-stack>
      </kb-box>
    </kb-stack>
  `,
};

export const FormLayout: S = {
  render: () => html`
    <kb-stack spacing="4" divider>
      <div>
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 mb-1">NAME</p>
        <p class="text-sm">Jane Doe</p>
      </div>
      <div>
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 mb-1">EMAIL</p>
        <p class="text-sm">jane@example.com</p>
      </div>
      <div>
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 mb-1">ROLE</p>
        <p class="text-sm">Administrator</p>
      </div>
    </kb-stack>
  `,
};
