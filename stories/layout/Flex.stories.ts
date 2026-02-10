import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/layout/kb-flex.js';
import '../../src/components/layout/kb-box.js';

const boxes = html`
  <kb-box p="4" bg="red-100">One</kb-box>
  <kb-box p="4" bg="blue-100">Two</kb-box>
  <kb-box p="4" bg="green-100">Three</kb-box>
`;

export default {
  title: 'Layout/Flex',
  component: 'kb-flex',
  render: (args) => html`<kb-flex ${spreadAttrs(args)}>${boxes}</kb-flex>`,
  args: { gap: '4' },
} satisfies Meta;

type S = StoryObj;

export const Row: S = {};

export const Column: S = { args: { direction: 'col' } };

export const Centered: S = { args: { align: 'center', justify: 'center', h: '48' } };

export const SpaceBetween: S = { args: { justify: 'between' } };
