import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/layout/kb-grid.js';
import '../../src/components/layout/kb-box.js';

const cells = html`
  <kb-box p="4" bg="yellow-100">1</kb-box>
  <kb-box p="4" bg="yellow-100">2</kb-box>
  <kb-box p="4" bg="yellow-100">3</kb-box>
  <kb-box p="4" bg="yellow-100">4</kb-box>
  <kb-box p="4" bg="yellow-100">5</kb-box>
  <kb-box p="4" bg="yellow-100">6</kb-box>
`;

export default {
  title: 'Layout/Grid',
  component: 'kb-grid',
  render: (args) => html`<kb-grid ${spreadAttrs(args)}>${cells}</kb-grid>`,
  args: { columns: '3', gap: '4' },
} satisfies Meta;

type S = StoryObj;

export const ThreeColumns: S = {};

export const TwoColumns: S = { args: { columns: '2' } };

export const FourColumns: S = { args: { columns: '4' } };
