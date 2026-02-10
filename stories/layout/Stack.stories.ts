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
