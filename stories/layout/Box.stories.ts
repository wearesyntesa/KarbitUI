import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/layout/kb-box.js';

export default {
  title: 'Layout/Box',
  component: 'kb-box',
  render: (args) => html`<kb-box ${spreadAttrs(args)}>Box content</kb-box>`,
  args: { p: '4', bg: 'white' },
} satisfies Meta;

type S = StoryObj;

export const Default: S = {};

export const Padded: S = {
  args: { p: '6' },
  render: (args) => html`<kb-box ${spreadAttrs(args)}>Box with extra padding</kb-box>`,
};

export const Colored: S = {
  args: { bg: 'blue-500', color: 'white', p: '6' },
  render: (args) => html`<kb-box ${spreadAttrs(args)}>Colored box</kb-box>`,
};
